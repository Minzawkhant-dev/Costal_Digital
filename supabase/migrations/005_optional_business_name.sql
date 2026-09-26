-- ============================================================================
-- 005 — business name is optional
--
-- The project form was cut down to name, email, an optional phone and a
-- message; business name moved behind "Add more details" and is no longer
-- required. A sole trader or someone asking on behalf of a café they have not
-- named yet should not be stopped by it.
--
-- `contacts.business_name` is already nullable, and process_lead already
-- coalesces it — both in the contact upsert and in the follow-up task title,
-- which falls back to the person's name. Only the `leads` constraint changes.
--
-- Run in the Supabase SQL editor BEFORE deploying the shorter form: until it
-- runs, an enquiry without a business name fails to insert. Safe to re-run.
-- ============================================================================

alter table leads alter column business_name drop not null;
