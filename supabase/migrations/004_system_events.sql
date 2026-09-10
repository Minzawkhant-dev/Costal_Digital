-- ============================================================================
-- 004 — system events
--
-- Somewhere to record the things that fail after a lead is already saved.
--
-- Step 5 of /api/leads — the confirmation email, the CRM promotion, the
-- Telegram alert — deliberately cannot fail the request: losing a real enquiry
-- is worse than a missed email. The cost of that choice is that failures were
-- only ever visible in a server log, which nobody reads and Netlify rotates.
--
-- This table is the durable half of the answer. The immediate half is the
-- Telegram alert; this is what the dashboard reads back, so a failure from
-- three days ago is still there when someone goes looking.
--
-- Deliberately not a general log. Only things a human might need to act on get
-- written here, so the table stays small enough to read by eye.
--
-- Run in the Supabase SQL editor after 003. Safe to re-run.
-- ============================================================================

do $$ begin
  create type event_level as enum ('error', 'warn', 'info');
exception when duplicate_object then null; end $$;

create table if not exists system_events (
  id         uuid primary key default gen_random_uuid(),
  level      event_level not null default 'error',
  -- Dotted origin, e.g. 'leads.email.client' or 'leads.crm'. Grouped on in the
  -- dashboard, so keep it stable and coarse.
  source     text not null,
  message    text not null,
  -- The enquiry this concerns, when there is one. `set null` rather than
  -- `cascade`: if the lead is deleted the record that something failed is still
  -- worth keeping.
  lead_id    uuid references leads (id) on delete set null,
  context    jsonb,
  created_at timestamptz not null default now()
);

create index if not exists system_events_created_at_idx on system_events (created_at desc);
create index if not exists system_events_level_idx      on system_events (level);
create index if not exists system_events_source_idx     on system_events (source);

-- ---------------------------------------------------------------------------
-- Access. Same posture as every other table: anon gets nothing, admins read,
-- and only the service role writes — these rows are written by the API route,
-- never by a browser.
-- ---------------------------------------------------------------------------

alter table system_events enable row level security;

drop policy if exists "admins read system events" on system_events;
create policy "admins read system events"
  on system_events for select
  to authenticated
  using (is_admin());

revoke all on system_events from anon;
grant select on system_events to authenticated;

-- ---------------------------------------------------------------------------
-- Retention. Unbounded rows would eventually be the outage rather than the
-- record of one, and an event nobody acted on in three months is not going to
-- be acted on now.
-- ---------------------------------------------------------------------------

create or replace function prune_system_events(p_keep_days int default 90)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  removed int;
begin
  delete from system_events
   where created_at < now() - make_interval(days => p_keep_days);
  get diagnostics removed = row_count;
  return removed;
end;
$$;

revoke execute on function prune_system_events(int) from public, anon, authenticated;
grant execute on function prune_system_events(int) to service_role;
