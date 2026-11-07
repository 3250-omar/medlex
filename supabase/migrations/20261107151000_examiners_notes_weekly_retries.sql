-- Retry confirmed rate-limit rejections; hold ambiguous outcomes for review.
create or replace function public.claim_examiners_note()
returns table(enrollment_id uuid, message_number integer, email text, first_name text,
  attempts integer, subject text, preview text, paragraphs jsonb)
language plpgsql security definer set search_path = '' as $$
declare v_enrollment_id uuid; v_sequence integer;
begin
  -- Do not retry ambiguous attempts beyond Resend's idempotency window.
  update public.examiners_notes_deliveries d
    set state = 'uncertain', locked_until = null, updated_at = now()
    where d.state in ('pending', 'sending') and d.first_attempt_at < now() - interval '23 hours'
      and coalesce(d.last_error, '') not like '429:%'
      and coalesce(d.locked_until, '-infinity') < now();
  select m.enrollment_id, candidate.sequence into v_enrollment_id, v_sequence
  from public.examiners_notes_members m
  join public.enrollments e on e.id = m.enrollment_id
  join lateral (
    select min(available.sequence) as sequence from (
      select msg.sequence from public.examiners_notes_messages msg
      where msg.is_active and msg.sequence >= m.next_number
      union all
      select d.message_number from public.examiners_notes_deliveries d
      where d.enrollment_id = m.enrollment_id and d.message_number >= m.next_number
        and d.state in ('pending', 'sending', 'failed', 'uncertain')
    ) available
  ) candidate on candidate.sequence is not null
  left join public.examiners_notes_deliveries d
    on d.enrollment_id = m.enrollment_id and d.message_number = candidate.sequence
  where m.due_at <= now() and e.status = 'active'
    and (e.expires_at is null or e.expires_at > now())
    and (d.state is null or (d.state in ('pending','sending') and coalesce(d.locked_until, '-infinity') < now() and coalesce(d.retry_at, '-infinity') <= now()))
  order by m.due_at, m.enrollment_id for update of m skip locked limit 1;
  if not found then return; end if;

  insert into public.examiners_notes_deliveries as d(enrollment_id, message_number, state, attempts,
    first_attempt_at, locked_until, recipient_email, recipient_first_name, subject_snapshot, preview_snapshot, paragraphs_snapshot)
  select v_enrollment_id, v_sequence, 'sending', 1, now(), now() + interval '5 minutes', u.email,
    coalesce(nullif(split_part(trim(p.full_name), ' ', 1), ''), 'Colleague'), msg.subject, msg.preview, msg.paragraphs
  from public.enrollments e join auth.users u on u.id = e.user_id
  left join public.profiles p on p.id = e.user_id
  left join public.examiners_notes_messages msg on msg.sequence = v_sequence
  where e.id = v_enrollment_id
  on conflict on constraint examiners_notes_deliveries_pkey do update set
    state = 'sending',
    first_attempt_at = case when d.first_attempt_at < now() - interval '23 hours' and d.last_error like '429:%' then now() else d.first_attempt_at end,
    last_error = null, attempts = d.attempts + 1, locked_until = now() + interval '5 minutes', updated_at = now();
  return query select d.enrollment_id, d.message_number, d.recipient_email, d.recipient_first_name,
    d.attempts, d.subject_snapshot, d.preview_snapshot, d.paragraphs_snapshot
  from public.examiners_notes_deliveries d
  where d.enrollment_id = v_enrollment_id and d.message_number = v_sequence and d.state = 'sending';
end $$;
