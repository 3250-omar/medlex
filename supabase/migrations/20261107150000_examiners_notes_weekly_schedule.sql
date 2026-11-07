-- The scheduler uses GMT; calculate the next Monday from Cairo's local clock
-- each week, so the UTC hour follows Egyptian daylight saving time.
create or replace function public.schedule_examiners_notes_next_week()
returns bigint language plpgsql security definer set search_path = '' as $$
declare
  local_monday timestamp;
  next_run timestamptz;
  utc_hour integer;
begin
  if current_setting('cron.timezone', true) not in ('GMT', 'UTC', 'Etc/UTC') then
    raise exception 'Examiner notes scheduler requires a UTC cron timezone';
  end if;
  local_monday := date_trunc('week', now() at time zone 'Africa/Cairo') + interval '11 hours';
  next_run := local_monday at time zone 'Africa/Cairo';
  if next_run <= now() then
    next_run := (local_monday + interval '7 days') at time zone 'Africa/Cairo';
  end if;
  utc_hour := extract(hour from next_run at time zone 'UTC')::integer;
  return cron.schedule('examiners-notes-dispatch', format('0 %s * * 1', utc_hour),
    'select public.dispatch_examiners_notes_weekly();');
end $$;

create or replace function public.dispatch_examiners_notes_weekly()
returns bigint language plpgsql security definer set search_path = '' as $$
begin
  -- Register the following Monday before initiating this week's dispatch.
  perform public.schedule_examiners_notes_next_week();
  return net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'examiners_notes_url'),
    headers := jsonb_build_object('Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'examiners_notes_cron_secret')),
    body := '{}'::jsonb, timeout_milliseconds := 120000
  );
end $$;

revoke all on function public.schedule_examiners_notes_next_week(), public.dispatch_examiners_notes_weekly() from public, anon, authenticated;
grant execute on function public.schedule_examiners_notes_next_week(), public.dispatch_examiners_notes_weekly() to service_role;
