-- ============================================================================
-- 003 — lock down function execution
--
-- Postgres grants EXECUTE on a newly created function to PUBLIC, and Supabase
-- publishes every function in the `public` schema as a PostgREST RPC endpoint.
-- Both SECURITY DEFINER helpers were therefore callable by anyone holding the
-- anon key — which ships inside the browser bundle and is public by design.
--
-- `bump_rate_limit` was the one that mattered. It writes to `rate_limits`, and
-- being definer-rights it runs straight past the `revoke all on rate_limits
-- from anon` in schema.sql. An unauthenticated caller could insert unbounded
-- rows under arbitrary keys — a slow way to fill the database and take the
-- `leads` table down with it.
--
-- `process_lead` needs a valid lead uuid (gen_random_uuid(), so unguessable)
-- and was not practically exploitable, but it has no business being reachable
-- from the public role either.
--
-- Both are only ever called server-side through the service role — see
-- `src/lib/rate-limit.ts` and `src/lib/crm.ts`, which use `createAdminClient()`
-- — and by the n8n workflow, which authenticates with the service key. So
-- nothing legitimate loses access here.
--
-- `is_admin()` is deliberately left alone. RLS policies call it, Postgres
-- checks EXECUTE on functions used in policy expressions, and so `authenticated`
-- must keep it. It only ever reports whether the caller is themselves an admin.
--
-- Run this in the Supabase SQL editor AFTER schema.sql. Safe to re-run:
-- revoking from a role that holds no grant is a no-op rather than an error.
-- ============================================================================

revoke execute on function bump_rate_limit(text, int) from public, anon, authenticated;
revoke execute on function process_lead(uuid, int)    from public, anon, authenticated;

-- The only caller. Stated explicitly rather than left to inherited defaults.
grant execute on function bump_rate_limit(text, int) to service_role;
grant execute on function process_lead(uuid, int)    to service_role;
