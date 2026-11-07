-- Run only after creating Vault secrets examiners_notes_url and examiners_notes_cron_secret.
-- URL: https://<project-ref>.supabase.co/functions/v1/examiners-notes
-- The worker checks due_at, which is calculated in Africa/Cairo, once each Monday.
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

-- Apply migration 20261107150000 before running this setup.
select public.schedule_examiners_notes_next_week();
