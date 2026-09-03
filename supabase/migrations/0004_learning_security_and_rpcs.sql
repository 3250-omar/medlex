-- Security boundary: clients can read their own records and eligible content;
-- scoring and progress mutations are server/RPC controlled.

create or replace function private.is_admin(requesting_user uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select exists (
    select 1 from public.profiles
    where id = requesting_user and role = 'admin'
  );
$$;

create or replace function private.has_active_release_access(target_release_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select exists (
    select 1
    from public.enrollments e
    where e.user_id = auth.uid()
      and e.release_id = target_release_id
      and e.status in ('active', 'paused', 'completed')
      and (e.expires_at is null or e.expires_at > now())
  );
$$;

create or replace function private.owns_active_enrollment(target_enrollment_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select exists (
    select 1 from public.enrollments e
    where e.id = target_enrollment_id
      and e.user_id = auth.uid()
      and e.status in ('active', 'paused', 'completed')
      and (e.expires_at is null or e.expires_at > now())
  );
$$;

revoke all on schema private from public;
revoke all on all tables in schema private from public, anon, authenticated;

-- Replace the recursive policies created by the foundation migration.
drop policy if exists "admins can manage profiles" on public.profiles;
create policy "admins can manage profiles" on public.profiles
  for all using (private.is_admin(auth.uid()))
  with check (private.is_admin(auth.uid()));

drop policy if exists "admins can manage courses" on public.courses;
create policy "admins can manage courses" on public.courses
  for all using (private.is_admin(auth.uid()))
  with check (private.is_admin(auth.uid()));

alter table public.course_categories enable row level security;
alter table public.course_category_assignments enable row level security;
alter table public.course_releases enable row level security;
alter table public.course_release_features enable row level security;
alter table public.learning_unit_kinds enable row level security;
alter table public.learning_units enable row level security;
alter table public.content_blocks enable row level security;
alter table public.media_assets enable row level security;
alter table public.competencies enable row level security;
alter table public.unit_competencies enable row level security;
alter table public.assessment_kinds enable row level security;
alter table public.question_kinds enable row level security;
alter table public.assessments enable row level security;
alter table public.assessment_questions enable row level security;
alter table public.answer_options enable row level security;
alter table public.production_tasks enable row level security;
alter table public.production_criteria enable row level security;
alter table public.practice_packs enable row level security;
alter table public.practice_roles enable row level security;
alter table public.rubrics enable row level security;
alter table public.rubric_sections enable row level security;
alter table public.rubric_items enable row level security;
alter table public.enrollments enable row level security;
alter table public.unit_progress enable row level security;
alter table public.assessment_attempts enable row level security;
alter table public.attempt_question_order enable row level security;
alter table public.attempt_answers enable row level security;
alter table public.production_submissions enable row level security;
alter table public.production_self_checks enable row level security;
alter table public.practice_sessions enable row level security;
alter table public.practice_participants enable row level security;
alter table public.rubric_submissions enable row level security;
alter table public.rubric_item_scores enable row level security;
alter table public.mastery_evidence enable row level security;
alter table public.course_completion_policies enable row level security;
alter table public.learning_sessions enable row level security;
alter table public.learning_events enable row level security;
alter table public.point_ledger enable row level security;
alter table public.certificates enable row level security;
alter table public.certificate_download_events enable row level security;
alter table public.content_imports enable row level security;

-- Public catalog remains available through courses; all course authoring is admin-only.
create policy "course categories are public" on public.course_categories for select using (true);
create policy "course categories are public" on public.course_category_assignments for select using (true);

-- Generic administrator policy for every learning table.
do $$
declare table_name text;
begin
  foreach table_name in array array[
    'course_categories','course_category_assignments',
    'course_releases','course_release_features','learning_unit_kinds','learning_units',
    'content_blocks','media_assets','competencies','unit_competencies','assessment_kinds','question_kinds',
    'assessments','assessment_questions','answer_options','production_tasks','production_criteria',
    'practice_packs','practice_roles','rubrics','rubric_sections','rubric_items','enrollments',
    'unit_progress','assessment_attempts','attempt_question_order','attempt_answers',
    'production_submissions','production_self_checks','practice_sessions','practice_participants',
    'rubric_submissions','rubric_item_scores','mastery_evidence','course_completion_policies',
    'learning_sessions','learning_events','point_ledger','certificates',
    'certificate_download_events','content_imports'
  ]
  loop
    execute format(
      'create policy %I on public.%I for all using (private.is_admin(auth.uid())) with check (private.is_admin(auth.uid()))',
      'admins manage ' || table_name, table_name
    );
  end loop;
end;
$$;

-- Learners may read only published units of releases they can access.
create policy "learners read accessible releases" on public.course_releases
  for select using (status = 'published' and private.has_active_release_access(id));
create policy "learners read accessible features" on public.course_release_features
  for select using (private.has_active_release_access(release_id));
create policy "learners read unit kinds" on public.learning_unit_kinds for select using (true);
create policy "learners read accessible units" on public.learning_units
  for select using (is_published and private.has_active_release_access(release_id));
create policy "learners read accessible blocks" on public.content_blocks
  for select using (exists (
    select 1 from public.learning_units u
    where u.id = unit_id and u.is_published and private.has_active_release_access(u.release_id)
  ));
create policy "learners read accessible assessments" on public.assessments
  for select using (exists (
    select 1 from public.learning_units u
    where u.id = unit_id and u.is_published and private.has_active_release_access(u.release_id)
  ));

-- Direct question access deliberately stays closed. API/RPC DTOs release only the
-- permitted fields for the active assessment phase; private answer keys are never exposed.

create policy "learners read own enrollments" on public.enrollments
  for select using (user_id = auth.uid());
create policy "learners read own progress" on public.unit_progress
  for select using (private.owns_active_enrollment(enrollment_id));
create policy "learners read own attempts" on public.assessment_attempts
  for select using (private.owns_active_enrollment(enrollment_id));
create policy "learners read own attempt order" on public.attempt_question_order
  for select using (exists (
    select 1 from public.assessment_attempts a
    where a.id = attempt_id and private.owns_active_enrollment(a.enrollment_id)
  ));
create policy "learners read own answers" on public.attempt_answers
  for select using (exists (
    select 1 from public.assessment_attempts a
    where a.id = attempt_id and private.owns_active_enrollment(a.enrollment_id)
  ));
create policy "learners read own production" on public.production_submissions
  for select using (private.owns_active_enrollment(enrollment_id));
create policy "learners read own self checks" on public.production_self_checks
  for select using (exists (
    select 1 from public.production_submissions s
    where s.id = submission_id and private.owns_active_enrollment(s.enrollment_id)
  ));
create policy "learners read own practice sessions" on public.practice_sessions
  for select using (private.owns_active_enrollment(enrollment_id));
create policy "learners read own mastery" on public.mastery_evidence
  for select using (private.owns_active_enrollment(enrollment_id));
create policy "learners read own points" on public.point_ledger for select using (user_id = auth.uid());
create policy "learners read own certificates" on public.certificates
  for select using (exists (
    select 1 from public.enrollments e where e.id = enrollment_id and e.user_id = auth.uid()
  ));

create or replace function public.start_assessment(target_assessment_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public, private
as $$
declare
  target_enrollment_id uuid;
  next_attempt integer;
  new_attempt_id uuid := gen_random_uuid();
  should_shuffle boolean;
begin
  select e.id, a.shuffle_options into target_enrollment_id, should_shuffle
  from public.enrollments e
  join public.assessments a on a.id = target_assessment_id
  join public.learning_units u on u.id = a.unit_id and u.release_id = e.release_id
  where e.user_id = auth.uid()
    and a.id = target_assessment_id
    and e.status in ('active', 'paused', 'completed')
    and (e.expires_at is null or e.expires_at > now())
  limit 1;
  if target_enrollment_id is null then raise exception 'active enrollment required'; end if;

  select coalesce(max(attempt_number), 0) + 1 into next_attempt
  from public.assessment_attempts
  where enrollment_id = target_enrollment_id and assessment_id = target_assessment_id;

  insert into public.assessment_attempts(id, enrollment_id, assessment_id, attempt_number)
  values (new_attempt_id, target_enrollment_id, target_assessment_id, next_attempt);

  insert into public.attempt_question_order(attempt_id, question_id, question_position, option_order)
  select new_attempt_id, q.id, q.sort_order,
    array(
      select o.id from public.answer_options o
      where o.question_id = q.id
      order by case when should_shuffle then random() else o.sort_order::double precision end
    )
  from public.assessment_questions q
  where q.assessment_id = target_assessment_id
  order by q.sort_order;
  return new_attempt_id;
end;
$$;

create or replace function public.submit_single_choice_answer(
  target_attempt_id uuid,
  target_question_id uuid,
  target_option_id uuid
) returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare
  target_assessment_id uuid;
  can_retry boolean;
  sequence_number integer;
  correct boolean;
begin
  select a.assessment_id, ass.allow_retry_per_question
    into target_assessment_id, can_retry
  from public.assessment_attempts a
  join public.assessments ass on ass.id = a.assessment_id
  where a.id = target_attempt_id
    and a.status = 'in_progress'
    and private.owns_active_enrollment(a.enrollment_id);
  if target_assessment_id is null then raise exception 'active owned attempt required'; end if;
  if not can_retry then raise exception 'use exam submission for this assessment'; end if;
  if not exists (select 1 from public.assessment_questions q where q.id = target_question_id and q.assessment_id = target_assessment_id)
     or not exists (select 1 from public.answer_options o where o.id = target_option_id and o.question_id = target_question_id) then
    raise exception 'question or option does not belong to this assessment';
  end if;

  select k.correct_option_id = target_option_id into correct
  from private.question_answer_keys k where k.question_id = target_question_id;
  if correct is null then raise exception 'answer key is missing'; end if;
  select coalesce(max(answer_sequence), 0) + 1 into sequence_number
  from public.attempt_answers where attempt_id = target_attempt_id and question_id = target_question_id;
  insert into public.attempt_answers(attempt_id, question_id, selected_option_id, answer_sequence, is_correct)
  values (target_attempt_id, target_question_id, target_option_id, sequence_number, correct);
  return jsonb_build_object('is_correct', correct, 'answer_sequence', sequence_number);
end;
$$;

revoke all on function public.start_assessment(uuid) from public;
revoke all on function public.submit_single_choice_answer(uuid, uuid, uuid) from public;
grant execute on function public.start_assessment(uuid) to authenticated;
grant execute on function public.submit_single_choice_answer(uuid, uuid, uuid) to authenticated;
