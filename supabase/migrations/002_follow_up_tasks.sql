-- ============================================================================
-- 002 — follow-up tasks
--
-- The brief's form flow ends with "Create Follow-up Task", which the original
-- schema had nowhere to put. This adds that table plus the RPC the n8n workflow
-- calls, so the automation has a single, idempotent entry point rather than
-- three separate REST writes it has to sequence itself.
--
-- Run this in the Supabase SQL editor AFTER schema.sql. Safe to re-run.
-- ============================================================================

do $$ begin
  create type task_status as enum ('open', 'in_progress', 'done', 'cancelled');
exception when duplicate_object then null; end $$;

create table if not exists follow_up_tasks (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid references leads (id) on delete cascade,
  contact_id  uuid references contacts (id) on delete set null,
  title       text not null,
  detail      text,
  status      task_status not null default 'open',
  due_at      timestamptz,
  -- Who or what created it: 'n8n', 'admin', 'system'.
  created_by  text not null default 'n8n',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists follow_up_tasks_status_idx  on follow_up_tasks (status);
create index if not exists follow_up_tasks_due_at_idx  on follow_up_tasks (due_at);
create index if not exists follow_up_tasks_lead_id_idx on follow_up_tasks (lead_id);

-- One open task per lead. Without this a webhook retry silently creates
-- duplicate work for whoever is doing the following up.
create unique index if not exists follow_up_tasks_one_open_per_lead
  on follow_up_tasks (lead_id)
  where status in ('open', 'in_progress');

drop trigger if exists follow_up_tasks_set_updated_at on follow_up_tasks;
create trigger follow_up_tasks_set_updated_at
  before update on follow_up_tasks
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- process_lead — the single entry point n8n calls.
--
-- One transaction: upsert the contact (deduped on lowercased email) and open a
-- follow-up task. n8n retries failed webhooks, so this is written to be
-- idempotent: a retry returns the same contactId and taskId with
-- taskCreated = false rather than creating a duplicate.
-- ---------------------------------------------------------------------------
create or replace function process_lead(
  p_lead_id   uuid,
  p_due_hours int default 24
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lead       leads%rowtype;
  v_contact_id uuid;
  v_task_id    uuid;
  v_created    boolean := false;
begin
  select * into v_lead from leads where id = p_lead_id;

  if not found then
    return json_build_object('ok', false, 'error', 'lead not found', 'leadId', p_lead_id);
  end if;

  insert into contacts (name, business_name, email, phone, business_type, website)
  values (v_lead.name, v_lead.business_name, lower(v_lead.email), v_lead.phone,
          v_lead.business_type, v_lead.website)
  on conflict (lower(email)) do update
    set name          = excluded.name,
        business_name = coalesce(excluded.business_name, contacts.business_name),
        phone         = coalesce(excluded.phone,         contacts.phone),
        business_type = coalesce(excluded.business_type, contacts.business_type),
        website       = coalesce(excluded.website,       contacts.website),
        updated_at    = now()
  returning id into v_contact_id;

  select id into v_task_id
    from follow_up_tasks
   where lead_id = p_lead_id
     and status in ('open', 'in_progress')
   limit 1;

  if v_task_id is null then
    insert into follow_up_tasks (lead_id, contact_id, title, detail, due_at, created_by)
    values (
      p_lead_id,
      v_contact_id,
      'Follow up: ' || coalesce(v_lead.business_name, v_lead.name),
      v_lead.message,
      now() + make_interval(hours => coalesce(p_due_hours, 24)),
      'n8n'
    )
    returning id into v_task_id;
    v_created := true;
  end if;

  return json_build_object(
    'ok',           true,
    'leadId',       p_lead_id,
    'contactId',    v_contact_id,
    'taskId',       v_task_id,
    'taskCreated',  v_created,
    'email',        v_lead.email,
    'businessName', v_lead.business_name
  );
end;
$$;

-- Only the service role calls this. The public site never touches it, and the
-- anon key must not be able to manufacture contacts or tasks.
revoke all on function process_lead(uuid, int) from public, anon, authenticated;
grant execute on function process_lead(uuid, int) to service_role;

-- ---------------------------------------------------------------------------
-- RLS. Same posture as every other table: admins only, anon has no path in.
-- ---------------------------------------------------------------------------
alter table follow_up_tasks enable row level security;

drop policy if exists "admins manage follow_up_tasks" on follow_up_tasks;
create policy "admins manage follow_up_tasks"
  on follow_up_tasks for all
  using (is_admin())
  with check (is_admin());
