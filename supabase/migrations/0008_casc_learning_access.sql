-- CASC Academy access and learner workflow helpers.

create or replace function public.subscribe_to_free_course(target_course_slug text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_course_id uuid;
  v_release_id uuid;
  v_enrollment_id uuid;
  v_first_unit_slug text;
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '28000';
  end if;

  select c.id, r.id into v_course_id, v_release_id
  from public.courses c
  join public.course_releases r on r.course_id = c.id and r.status = 'published'
  where c.slug = target_course_slug and c.is_published
  limit 1;

  if v_course_id is null then
    raise exception 'course_not_found' using errcode = 'P0002';
  end if;
  if exists (select 1 from public.courses where id = v_course_id and price > 0) then
    raise exception 'payment_required' using errcode = 'P0001';
  end if;

  select id into v_enrollment_id
  from public.enrollments
  where user_id = v_user_id and course_id = v_course_id
    and status in ('active', 'paused', 'completed')
  order by enrolled_at desc
  limit 1;

  if v_enrollment_id is null then
    insert into public.enrollments(user_id, course_id, release_id, status)
    values (v_user_id, v_course_id, v_release_id, 'active')
    returning id into v_enrollment_id;
  end if;

  select slug into v_first_unit_slug
  from public.learning_units
  where release_id = v_release_id and is_published
  order by sequence_number
  limit 1;

  return jsonb_build_object(
    'enrollmentId', v_enrollment_id,
    'releaseId', v_release_id,
    'firstUnitSlug', v_first_unit_slug
  );
end;
$$;

create or replace function public.mark_unit_opened(target_unit_id uuid)
returns void
language plpgsql
security definer
set search_path = public, private
as $$
declare v_enrollment_id uuid;
begin
  select e.id into v_enrollment_id
  from public.enrollments e
  join public.learning_units u on u.release_id = e.release_id
  where e.user_id = auth.uid() and u.id = target_unit_id
    and e.status in ('active', 'paused', 'completed')
    and (e.expires_at is null or e.expires_at > now())
  limit 1;
  if v_enrollment_id is null then raise exception 'active enrollment required'; end if;

  insert into public.unit_progress(enrollment_id, unit_id, status, progress_percent, started_at, last_accessed_at)
  values (v_enrollment_id, target_unit_id, 'in_progress', 10, now(), now())
  on conflict (enrollment_id, unit_id) do update
    set status = case when public.unit_progress.status = 'completed' then 'completed' else 'in_progress' end,
        progress_percent = greatest(public.unit_progress.progress_percent, 10),
        last_accessed_at = now();
end;
$$;

create or replace function public.complete_learn_assessment(target_attempt_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare v_enrollment_id uuid; v_unit_id uuid; v_assessment_id uuid; v_total integer; v_correct integer;
begin
  select a.enrollment_id, ass.unit_id, a.assessment_id into v_enrollment_id, v_unit_id, v_assessment_id
  from public.assessment_attempts a
  join public.assessments ass on ass.id = a.assessment_id
  where a.id = target_attempt_id and a.status = 'in_progress'
    and private.owns_active_enrollment(a.enrollment_id);
  if v_enrollment_id is null then raise exception 'active owned attempt required'; end if;

  select count(*) into v_total from public.assessment_questions where assessment_id = v_assessment_id;
  select count(distinct aa.question_id) into v_correct
  from public.attempt_answers aa
  where aa.attempt_id = target_attempt_id and aa.is_correct;
  if v_correct < v_total then raise exception 'all questions need a correct answer'; end if;

  update public.assessment_attempts set status = 'submitted', submitted_at = now(), score = v_total, max_score = v_total, passed = true
  where id = target_attempt_id;
  insert into public.unit_progress(enrollment_id, unit_id, status, progress_percent, started_at, last_accessed_at)
  values (v_enrollment_id, v_unit_id, 'in_progress', 40, now(), now())
  on conflict (enrollment_id, unit_id) do update
    set progress_percent = greatest(public.unit_progress.progress_percent, 40), last_accessed_at = now();
  return jsonb_build_object('completed', true, 'progressPercent', 40);
end;
$$;

revoke all on function public.subscribe_to_free_course(text) from public;
revoke all on function public.mark_unit_opened(uuid) from public;
revoke all on function public.complete_learn_assessment(uuid) from public;
grant execute on function public.subscribe_to_free_course(text) to authenticated;
grant execute on function public.mark_unit_opened(uuid) to authenticated;
grant execute on function public.complete_learn_assessment(uuid) to authenticated;
