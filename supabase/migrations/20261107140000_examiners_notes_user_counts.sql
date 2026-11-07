-- Aggregate only the requested page; service_role is used after admin authorization.
create or replace function public.get_examiners_notes_user_counts(p_user_ids uuid[])
returns table(user_id uuid, sent_count bigint)
language sql stable security definer set search_path = '' as $$
  select e.user_id, count(*)::bigint
  from public.examiners_notes_deliveries d
  join public.enrollments e on e.id = d.enrollment_id
  where d.state = 'accepted' and e.user_id = any(p_user_ids)
  group by e.user_id;
$$;
revoke all on function public.get_examiners_notes_user_counts(uuid[]) from public, anon, authenticated;
grant execute on function public.get_examiners_notes_user_counts(uuid[]) to service_role;
