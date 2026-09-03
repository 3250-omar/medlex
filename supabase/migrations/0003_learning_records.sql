-- Learner-owned records, progress, attempts, rewards, and import audit.

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete restrict,
  release_id uuid not null references public.course_releases(id) on delete restrict,
  last_accessed_unit_id uuid references public.learning_units(id) on delete set null,
  status text not null default 'active'
    check (status in ('active', 'completed', 'expired', 'paused', 'cancelled')),
  enrolled_at timestamptz not null default now(),
  access_starts_at timestamptz not null default now(),
  expires_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  check (expires_at is null or expires_at > access_starts_at)
);

create unique index one_open_enrollment_per_course
  on public.enrollments(user_id, course_id)
  where status in ('active', 'paused');
create index enrollments_user_status_idx on public.enrollments(user_id, status);

create trigger set_enrollments_updated_at before update on public.enrollments
for each row execute function public.set_updated_at();

create or replace function public.assert_enrollment_release_consistency()
returns trigger language plpgsql set search_path = public as $$
begin
  if not exists (
    select 1 from public.course_releases r
    where r.id = new.release_id and r.course_id = new.course_id
  ) then
    raise exception 'enrollment release must belong to enrollment course';
  end if;
  if new.last_accessed_unit_id is not null and not exists (
    select 1 from public.learning_units u
    where u.id = new.last_accessed_unit_id and u.release_id = new.release_id
  ) then
    raise exception 'last accessed unit must belong to enrollment release';
  end if;
  return new;
end;
$$;

create trigger assert_enrollment_release_consistency
before insert or update of course_id, release_id, last_accessed_unit_id on public.enrollments
for each row execute function public.assert_enrollment_release_consistency();

create table public.unit_progress (
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  unit_id uuid not null references public.learning_units(id) on delete cascade,
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'completed')),
  progress_percent smallint not null default 0 check (progress_percent between 0 and 100),
  started_at timestamptz,
  completed_at timestamptz,
  last_accessed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (enrollment_id, unit_id)
);

create index unit_progress_enrollment_status_idx on public.unit_progress(enrollment_id, status);
create trigger set_unit_progress_updated_at before update on public.unit_progress
for each row execute function public.set_updated_at();

create or replace function public.assert_progress_unit_release()
returns trigger language plpgsql set search_path = public as $$
begin
  if not exists (
    select 1
    from public.enrollments e
    join public.learning_units u on u.release_id = e.release_id
    where e.id = new.enrollment_id and u.id = new.unit_id
  ) then
    raise exception 'progress unit must belong to enrollment release';
  end if;
  return new;
end;
$$;

create trigger assert_progress_unit_release before insert or update on public.unit_progress
for each row execute function public.assert_progress_unit_release();

create table public.assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  assessment_id uuid not null references public.assessments(id) on delete restrict,
  attempt_number integer not null check (attempt_number > 0),
  status text not null default 'in_progress'
    check (status in ('in_progress', 'submitted', 'expired', 'abandoned')),
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  elapsed_seconds integer check (elapsed_seconds >= 0),
  score integer,
  max_score integer,
  critical_misses integer not null default 0 check (critical_misses >= 0),
  passed boolean,
  unique (enrollment_id, assessment_id, attempt_number),
  check ((status = 'submitted') = (submitted_at is not null))
);

create index assessment_attempts_enrollment_assessment_idx
  on public.assessment_attempts(enrollment_id, assessment_id, started_at desc);

create table public.attempt_question_order (
  attempt_id uuid not null references public.assessment_attempts(id) on delete cascade,
  question_id uuid not null references public.assessment_questions(id) on delete restrict,
  question_position integer not null check (question_position >= 0),
  option_order uuid[] not null,
  primary key (attempt_id, question_id),
  unique (attempt_id, question_position)
);

create table public.attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.assessment_attempts(id) on delete cascade,
  question_id uuid not null references public.assessment_questions(id) on delete restrict,
  selected_option_id uuid references public.answer_options(id) on delete restrict,
  answer_sequence integer not null default 1 check (answer_sequence > 0),
  is_correct boolean not null,
  answered_at timestamptz not null default now(),
  unique (attempt_id, question_id, answer_sequence)
);

create index attempt_answers_attempt_question_idx on public.attempt_answers(attempt_id, question_id);

create table public.production_submissions (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  task_id uuid not null references public.production_tasks(id) on delete restrict,
  response_text text not null,
  submitted_at timestamptz not null default now()
);

create table public.production_self_checks (
  submission_id uuid not null references public.production_submissions(id) on delete cascade,
  criterion_id uuid not null references public.production_criteria(id) on delete restrict,
  is_met boolean not null,
  primary key (submission_id, criterion_id)
);

create table public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  practice_pack_id uuid not null references public.practice_packs(id) on delete restrict,
  status text not null default 'planned'
    check (status in ('planned', 'in_progress', 'completed', 'cancelled')),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.practice_participants (
  session_id uuid not null references public.practice_sessions(id) on delete cascade,
  role_id uuid not null references public.practice_roles(id) on delete restrict,
  user_id uuid references auth.users(id) on delete set null,
  display_name text,
  primary key (session_id, role_id),
  check (user_id is not null or nullif(btrim(display_name), '') is not null)
);

create table public.rubric_submissions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.practice_sessions(id) on delete cascade,
  submitted_by uuid references auth.users(id) on delete set null,
  overall_rating text not null check (overall_rating in ('pass', 'borderline', 'fail')),
  evidence_note text not null check (nullif(btrim(evidence_note), '') is not null),
  submitted_at timestamptz not null default now()
);

create table public.rubric_item_scores (
  submission_id uuid not null references public.rubric_submissions(id) on delete cascade,
  rubric_item_id uuid not null references public.rubric_items(id) on delete restrict,
  achieved boolean not null,
  primary key (submission_id, rubric_item_id)
);

create table public.mastery_evidence (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  competency_id uuid not null references public.competencies(id) on delete cascade,
  unit_id uuid not null references public.learning_units(id) on delete cascade,
  mastery_level text not null
    check (mastery_level in ('explored', 'recognised', 'demonstrated', 'validated')),
  source_type text not null
    check (source_type in ('learn_completion', 'exam_attempt', 'production_submission', 'practice_rubric')),
  source_id uuid not null,
  achieved_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (enrollment_id, competency_id, unit_id, mastery_level, source_type, source_id)
);

create index mastery_evidence_enrollment_competency_idx
  on public.mastery_evidence(enrollment_id, competency_id, mastery_level);

create table public.course_completion_policies (
  id uuid primary key default gen_random_uuid(),
  release_id uuid not null references public.course_releases(id) on delete cascade,
  policy_key text not null,
  policy_type text not null,
  config jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_required boolean not null default true,
  unique (release_id, policy_key)
);

create table public.learning_sessions (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  unit_id uuid not null references public.learning_units(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  active_seconds integer not null default 0 check (active_seconds >= 0),
  last_heartbeat_at timestamptz,
  client_session_key text not null,
  unique (enrollment_id, client_session_key)
);

create table public.learning_events (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.learning_sessions(id) on delete cascade,
  event_type text not null,
  unit_id uuid not null references public.learning_units(id) on delete cascade,
  block_id uuid references public.content_blocks(id) on delete set null,
  activity_key text,
  occurred_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb,
  idempotency_key text not null unique
);

create index learning_events_session_occurred_idx on public.learning_events(session_id, occurred_at);

create table public.point_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  enrollment_id uuid references public.enrollments(id) on delete set null,
  points integer not null,
  reason text not null,
  source_type text not null,
  source_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, source_type, source_id)
);

create index point_ledger_user_created_idx on public.point_ledger(user_id, created_at desc);

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  certificate_number text not null unique,
  enrollment_id uuid not null unique references public.enrollments(id) on delete restrict,
  recipient_name_snapshot text not null,
  course_title_snapshot text not null,
  release_version_snapshot integer not null,
  issued_at timestamptz not null default now(),
  revoked_at timestamptz,
  revocation_reason text,
  storage_path text
);

create table public.certificate_download_events (
  id bigint generated always as identity primary key,
  certificate_id uuid not null references public.certificates(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  downloaded_at timestamptz not null default now()
);

create table public.content_imports (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete restrict,
  release_id uuid references public.course_releases(id) on delete set null,
  importer_key text not null,
  source_filename text not null,
  source_sha256 text not null,
  status text not null default 'pending'
    check (status in ('pending', 'validated', 'imported', 'failed')),
  validation_report jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index content_imports_source_idx
  on public.content_imports(course_id, importer_key, source_sha256);
