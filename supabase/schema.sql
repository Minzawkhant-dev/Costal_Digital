-- ============================================================================
-- Coastal Digital Studio — database schema
--
-- Run this once in the Supabase SQL editor (or via `supabase db push`).
-- It is written to be re-runnable: every object is created conditionally.
--
-- Security model
-- --------------
-- The public site NEVER talks to Supabase directly. The lead form posts to
-- /api/leads, which writes using the service-role key on the server. That means
-- anon has no write path at all, and RLS below denies anon everything except
-- reading published `services` and `faq` rows.
--
-- Admin access is granted by a row in `admins` keyed to an auth.users id.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type lead_status as enum ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost');
exception when duplicate_object then null; end $$;

do $$ begin
  create type project_status as enum ('planning', 'in_progress', 'review', 'launched', 'on_hold', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('unpaid', 'deposit_paid', 'partially_paid', 'paid');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- admins
--
-- Membership of this table IS the admin role. It is deliberately not
-- self-serve: rows are inserted manually, or by another admin.
-- ---------------------------------------------------------------------------
create table if not exists admins (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  created_at  timestamptz not null default now()
);

-- SECURITY DEFINER so the check itself is not subject to RLS on `admins`,
-- which would otherwise recurse when used inside `admins`' own policy.
create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- leads
-- ---------------------------------------------------------------------------
create table if not exists leads (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  business_name   text not null,
  email           text not null,
  phone           text,
  business_type   text,
  website         text,
  service         text,
  budget          text,
  timeline        text,
  message         text not null,
  status          lead_status not null default 'new',
  source          text not null default 'website',
  -- Operational metadata. Never rendered on the public site.
  ip_hash         text,
  user_agent      text,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_status_idx     on leads (status);
create index if not exists leads_email_idx      on leads (lower(email));

drop trigger if exists leads_set_updated_at on leads;
create trigger leads_set_updated_at
  before update on leads
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create table if not exists projects (
  id            uuid primary key default gen_random_uuid(),
  lead_id       uuid references leads (id) on delete set null,
  name          text not null,
  description   text,
  status        project_status not null default 'planning',
  budget        numeric(12, 2),
  currency      text not null default 'THB',
  payment       payment_status not null default 'unpaid',
  start_date    date,
  deadline      date,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists projects_status_idx   on projects (status);
create index if not exists projects_deadline_idx on projects (deadline);
create index if not exists projects_lead_id_idx  on projects (lead_id);

drop trigger if exists projects_set_updated_at on projects;
create trigger projects_set_updated_at
  before update on projects
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- contacts
--
-- People, as distinct from enquiries. A lead is an event; a contact persists
-- across several enquiries and projects.
-- ---------------------------------------------------------------------------
create table if not exists contacts (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  business_name  text,
  email          text not null,
  phone          text,
  line_id        text,
  business_type  text,
  website        text,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create unique index if not exists contacts_email_key on contacts (lower(email));

drop trigger if exists contacts_set_updated_at on contacts;
create trigger contacts_set_updated_at
  before update on contacts
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- services  (public content, editable from the admin dashboard)
-- ---------------------------------------------------------------------------
create table if not exists services (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  summary       text not null,
  description   text,
  deliverables  text[] not null default '{}',
  sort_order    int not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

drop trigger if exists services_set_updated_at on services;
create trigger services_set_updated_at
  before update on services
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- faq  (public content, editable from the admin dashboard)
-- ---------------------------------------------------------------------------
create table if not exists faq (
  id            uuid primary key default gen_random_uuid(),
  question      text not null,
  answer        text not null,
  category      text,
  sort_order    int not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

drop trigger if exists faq_set_updated_at on faq;
create trigger faq_set_updated_at
  before update on faq
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- rate_limits
--
-- Backs the submission rate limiter. Serverless instances do not share memory,
-- so the counter has to live somewhere both of them can see.
-- ---------------------------------------------------------------------------
create table if not exists rate_limits (
  key          text primary key,
  count        int not null default 0,
  window_start timestamptz not null default now()
);

-- Atomic increment-and-read. Doing this in SQL avoids the read-then-write race
-- that would let two concurrent submissions both pass the limit check.
create or replace function bump_rate_limit(
  p_key            text,
  p_window_seconds int
)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  insert into rate_limits (key, count, window_start)
    values (p_key, 1, now())
  on conflict (key) do update
    set count = case
          when rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
            then 1
          else rate_limits.count + 1
        end,
        window_start = case
          when rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
            then now()
          else rate_limits.window_start
        end
  returning count into v_count;

  return v_count;
end;
$$;

-- ============================================================================
-- Row Level Security
--
-- RLS is enabled on every table. The service-role key used by the API routes
-- bypasses RLS by design; anon and authenticated users are governed below.
-- ============================================================================

alter table admins      enable row level security;
alter table leads       enable row level security;
alter table projects    enable row level security;
alter table contacts    enable row level security;
alter table services    enable row level security;
alter table faq         enable row level security;
alter table rate_limits enable row level security;

-- --- admins ---------------------------------------------------------------
drop policy if exists "admins read own row" on admins;
create policy "admins read own row"
  on admins for select
  to authenticated
  using (user_id = auth.uid());

-- --- leads ----------------------------------------------------------------
-- No anon policy of any kind: the public cannot read, insert, update or delete.
-- Inserts happen server-side through the service role.
drop policy if exists "admins read leads" on leads;
create policy "admins read leads"
  on leads for select
  to authenticated
  using (is_admin());

drop policy if exists "admins update leads" on leads;
create policy "admins update leads"
  on leads for update
  to authenticated
  using (is_admin())
  with check (is_admin());

drop policy if exists "admins delete leads" on leads;
create policy "admins delete leads"
  on leads for delete
  to authenticated
  using (is_admin());

-- --- projects -------------------------------------------------------------
drop policy if exists "admins manage projects" on projects;
create policy "admins manage projects"
  on projects for all
  to authenticated
  using (is_admin())
  with check (is_admin());

-- --- contacts -------------------------------------------------------------
drop policy if exists "admins manage contacts" on contacts;
create policy "admins manage contacts"
  on contacts for all
  to authenticated
  using (is_admin())
  with check (is_admin());

-- --- services (public read of published rows) -----------------------------
drop policy if exists "public read published services" on services;
create policy "public read published services"
  on services for select
  to anon, authenticated
  using (is_published);

drop policy if exists "admins manage services" on services;
create policy "admins manage services"
  on services for all
  to authenticated
  using (is_admin())
  with check (is_admin());

-- --- faq (public read of published rows) ----------------------------------
drop policy if exists "public read published faq" on faq;
create policy "public read published faq"
  on faq for select
  to anon, authenticated
  using (is_published);

drop policy if exists "admins manage faq" on faq;
create policy "admins manage faq"
  on faq for all
  to authenticated
  using (is_admin())
  with check (is_admin());

-- --- rate_limits ----------------------------------------------------------
-- No policies at all. Only the service role touches this table.

-- ============================================================================
-- Grants
--
-- Revoke the blanket privileges Supabase grants to anon so that, even if a
-- policy were added by mistake, anon still has no write capability on leads.
-- ============================================================================
-- Take away everything anon inherits from Supabase's default privileges, so a
-- policy added by mistake later still cannot expose a lead.
revoke all on leads       from anon;
revoke all on projects    from anon;
revoke all on contacts    from anon;
revoke all on admins      from anon;
revoke all on rate_limits from anon, authenticated;

-- anon may read published site content, and nothing else.
grant select on services to anon, authenticated;
grant select on faq      to anon, authenticated;

-- Be explicit about the roles that DO need access rather than depending on
-- Supabase's defaults still being in place. RLS is what actually decides
-- whether a signed-in user sees a row; these grants only make the tables
-- reachable so the policies get a chance to run.
grant select, insert, update, delete on leads, projects, contacts to authenticated;
grant select                          on admins                   to authenticated;
grant insert, update, delete          on services, faq            to authenticated;

-- The API routes run as service_role, which bypasses RLS by design.
grant all on leads, projects, contacts, services, faq, admins, rate_limits to service_role;
