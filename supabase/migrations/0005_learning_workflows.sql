-- Assessment finalisation and server-authoritative mastery updates.

create or replace function public.submit_exam_attempt(
  target_attempt_id uuid,
  submitted_answers jsonb,
  reported_elapsed_seconds integer
) returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare
  target_enrollment_id uuid;
  target_assessment_id uuid;
  target_unit_id uuid;
  duration_limit integer;
  required_score integer;
  require_critical boolean;
  q record;
  supplied_option uuid;
  total_questions integer := 0;
  correct_answers integer := 0;
  critical_misses integer := 0;
  is_correct_answer boolean;
  did_pass boolean;
begin
  if reported_elapsed_seconds < 0 then raise exception 'elapsed seconds must be non-negative'; end if;
  select a.enrollment_id, a.assessment_id, ass.unit_id, ass.duration_seconds,
         coalesce(ass.pass_score, 0), ass.require_all_critical
    into target_enrollment_id, target_assessment_id, target_unit_id, duration_limit,
         required_score, require_critical
  from public.assessment_attempts a
  join public.assessments ass on ass.id = a.assessment_id
  where a.id = target_attempt_id
    and a.status = 'in_progress'
    and private.owns_active_enrollment(a.enrollment_id);
  if target_assessment_id is null then raise exception 'active owned attempt required'; end if;
  if duration_limit is not null and reported_elapsed_seconds > duration_limit then
    update public.assessment_attempts
      set status = 'expired', elapsed_seconds = duration_limit
      where id = target_attempt_id;
    raise exception 'assessment time expired';
  end if;

  for q in
    select q.id, q.is_critical, k.correct_option_id
    from public.assessment_questions q
    join private.question_answer_keys k on k.question_id = q.id
    where q.assessment_id = target_assessment_id
    order by q.sort_order
  loop
    total_questions := total_questions + 1;
    supplied_option := nullif(submitted_answers ->> q.id::text, '')::uuid;
    if supplied_option is not null and not exists (
      select 1 from public.answer_options o where o.id = supplied_option and o.question_id = q.id
    ) then
      raise exception 'invalid option for question %', q.id;
    end if;
    is_correct_answer := supplied_option = q.correct_option_id;
    if is_correct_answer then correct_answers := correct_answers + 1; end if;
    if q.is_critical and not is_correct_answer then critical_misses := critical_misses + 1; end if;
    insert into public.attempt_answers(
      attempt_id, question_id, selected_option_id, answer_sequence, is_correct
    ) values (target_attempt_id, q.id, supplied_option, 1, is_correct_answer);
  end loop;

  did_pass := correct_answers >= required_score
    and (not require_critical or critical_misses = 0);

  update public.assessment_attempts
  set status = 'submitted',
      submitted_at = now(),
      elapsed_seconds = reported_elapsed_seconds,
      score = correct_answers,
      max_score = total_questions,
      critical_misses = critical_misses,
      passed = did_pass
  where id = target_attempt_id;

  insert into public.unit_progress(
    enrollment_id, unit_id, status, progress_percent, started_at, last_accessed_at
  ) values (
    target_enrollment_id, target_unit_id, 'in_progress', 20, now(), now()
  )
  on conflict (enrollment_id, unit_id) do update
    set status = case when public.unit_progress.status = 'completed' then 'completed' else 'in_progress' end,
        progress_percent = greatest(public.unit_progress.progress_percent, 20),
        last_accessed_at = now();

  if did_pass then
    insert into public.mastery_evidence(
      enrollment_id, competency_id, unit_id, mastery_level, source_type, source_id
    )
    select target_enrollment_id, uc.competency_id, target_unit_id,
           'recognised', 'exam_attempt', target_attempt_id
    from public.unit_competencies uc
    where uc.unit_id = target_unit_id
    on conflict do nothing;
  end if;
  return jsonb_build_object(
    'score', correct_answers,
    'max_score', total_questions,
    'critical_misses', critical_misses,
    'passed', did_pass
  );
end;
$$;

create or replace function public.submit_production(
  target_task_id uuid,
  response text,
  checked_criteria uuid[]
) returns uuid
language plpgsql
security definer
set search_path = public, private
as $$
declare
  target_enrollment_id uuid;
  target_unit_id uuid;
  minimum_length integer;
  v_submission_id uuid := gen_random_uuid();
  total_criteria integer;
  checked_count integer;
begin
  select e.id, t.unit_id, t.minimum_characters
    into target_enrollment_id, target_unit_id, minimum_length
  from public.enrollments e
  join public.production_tasks t on true
  join public.learning_units u on u.id = t.unit_id and u.release_id = e.release_id
  where e.user_id = auth.uid()
    and t.id = target_task_id
    and e.status in ('active', 'paused', 'completed')
    and (e.expires_at is null or e.expires_at > now())
  limit 1;
  if target_enrollment_id is null then raise exception 'active enrollment required'; end if;
  if char_length(btrim(coalesce(response, ''))) < minimum_length then
    raise exception 'production response is too short';
  end if;

  insert into public.production_submissions(id, enrollment_id, task_id, response_text)
  values (v_submission_id, target_enrollment_id, target_task_id, response);
  insert into public.production_self_checks(submission_id, criterion_id, is_met)
  select v_submission_id, c.id, c.id = any(coalesce(checked_criteria, '{}'::uuid[]))
  from public.production_criteria c where c.task_id = target_task_id;

  select count(*) into total_criteria from public.production_criteria where task_id = target_task_id;
  select count(*) into checked_count from public.production_self_checks
    where production_self_checks.submission_id = v_submission_id and is_met;
  if total_criteria > 0 and total_criteria = checked_count then
    insert into public.mastery_evidence(
      enrollment_id, competency_id, unit_id, mastery_level, source_type, source_id
    )
    select target_enrollment_id, uc.competency_id, target_unit_id,
      'demonstrated', 'production_submission', v_submission_id
    from public.unit_competencies uc where uc.unit_id = target_unit_id
    on conflict do nothing;
  end if;
  return v_submission_id;
end;
$$;

revoke all on function public.submit_exam_attempt(uuid, jsonb, integer) from public;
revoke all on function public.submit_production(uuid, text, uuid[]) from public;
grant execute on function public.submit_exam_attempt(uuid, jsonb, integer) to authenticated;
grant execute on function public.submit_production(uuid, text, uuid[]) to authenticated;
