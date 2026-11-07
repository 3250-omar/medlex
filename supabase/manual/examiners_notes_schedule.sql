-- Run only after creating Vault secrets examiners_notes_url and examiners_notes_cron_secret.
-- URL: https://<project-ref>.supabase.co/functions/v1/examiners-notes
-- The worker checks due_at, which is calculated in Africa/Cairo, on each invocation.
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

select cron.schedule('examiners-notes-dispatch', '*/10 * * * *', $cron$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'examiners_notes_url'),
    headers := jsonb_build_object('Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'examiners_notes_cron_secret')),
    body := '{}'::jsonb,
    timeout_milliseconds := 120000
  );
$cron$);
