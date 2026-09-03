-- Generic, versioned learning-content schema. CASC is a consumer of this schema,
-- not a special-case course in the database.

create schema if not exists private;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

alter table public.courses
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists set_courses_updated_at on public.courses;
create trigger set_courses_updated_at
before update on public.courses
for each row execute function public.set_updated_at();

create table public.course_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.course_category_assignments (
  course_id uuid not null references public.courses(id) on delete cascade,
  category_id uuid not null references public.course_categories(id) on delete cascade,
  primary key (course_id, category_id)
);

create table public.course_releases (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  version_number integer not null check (version_number > 0),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  source_sha256 text,
  settings jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, version_number),
  check (status <> 'published' or published_at is not null)
);

create unique index one_published_release_per_course
  on public.course_releases(course_id) where status = 'published';

create trigger set_course_releases_updated_at
before update on public.course_releases
for each row execute function public.set_updated_at();

create table public.course_release_features (
  release_id uuid not null references public.course_releases(id) on delete cascade,
  feature_key text not null,
  is_enabled boolean not null default true,
  config jsonb not null default '{}'::jsonb,
  primary key (release_id, feature_key)
);

create table public.learning_unit_kinds (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  renderer_key text not null unique,
  is_system boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.learning_unit_kinds (key, renderer_key)
values
  ('orientation', 'orientation'),
  ('module_hub', 'module-hub'),
  ('lesson', 'lesson'),
  ('station', 'station'),
  ('assessment_only', 'assessment-only')
on conflict (key) do nothing;

create table public.learning_units (
  id uuid primary key default gen_random_uuid(),
  release_id uuid not null references public.course_releases(id) on delete cascade,
  parent_unit_id uuid references public.learning_units(id) on delete cascade,
  unit_kind_id uuid not null references public.learning_unit_kinds(id) on delete restrict,
  source_key text not null,
  slug text not null,
  unit_code text,
  sequence_number integer not null check (sequence_number >= 0),
  position_in_parent integer not null default 0 check (position_in_parent >= 0),
  estimated_seconds integer check (estimated_seconds > 0),
  is_required boolean not null default true,
  is_published boolean not null default false,
  title text not null,
  summary text,
  eyebrow text,
  lens_text text,
  completion_title text,
  completion_body text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (release_id, source_key),
  unique (release_id, slug),
  unique (release_id, sequence_number)
);

create index learning_units_parent_position_idx
  on public.learning_units(parent_unit_id, position_in_parent);

create trigger set_learning_units_updated_at
before update on public.learning_units
for each row execute function public.set_updated_at();

create or replace function public.assert_unit_parent_same_release()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.parent_unit_id is not null and not exists (
    select 1 from public.learning_units parent
    where parent.id = new.parent_unit_id and parent.release_id = new.release_id
  ) then
    raise exception 'parent unit must belong to the same course release';
  end if;
  return new;
end;
$$;

create trigger assert_unit_parent_same_release
before insert or update of parent_unit_id, release_id on public.learning_units
for each row execute function public.assert_unit_parent_same_release();

create table public.content_blocks (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.learning_units(id) on delete cascade,
  source_key text not null,
  block_type text not null,
  sort_order integer not null check (sort_order >= 0),
  settings jsonb not null default '{}'::jsonb,
  content jsonb not null default '{}'::jsonb,
  is_required_for_progress boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (unit_id, source_key),
  unique (unit_id, sort_order)
);

create index content_blocks_unit_sort_idx on public.content_blocks(unit_id, sort_order);
create trigger set_content_blocks_updated_at before update on public.content_blocks
for each row execute function public.set_updated_at();

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_bucket text not null,
  storage_path text not null,
  mime_type text not null,
  sha256 text not null unique,
  alt_text text,
  created_at timestamptz not null default now(),
  unique (storage_bucket, storage_path)
);

create table public.competencies (
  id uuid primary key default gen_random_uuid(),
  release_id uuid not null references public.course_releases(id) on delete cascade,
  domain_unit_id uuid not null references public.learning_units(id) on delete cascade,
  source_key text not null,
  position integer not null check (position >= 0),
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  unique (release_id, source_key),
  unique (domain_unit_id, position)
);

create table public.unit_competencies (
  unit_id uuid not null references public.learning_units(id) on delete cascade,
  competency_id uuid not null references public.competencies(id) on delete cascade,
  is_primary boolean not null default false,
  primary key (unit_id, competency_id)
);

create table public.assessment_kinds (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  scoring_strategy_key text not null,
  renderer_key text not null unique,
  created_at timestamptz not null default now()
);

insert into public.assessment_kinds (key, scoring_strategy_key, renderer_key)
values
  ('learn_decision', 'retry_until_correct', 'learn-decision'),
  ('timed_exam', 'threshold_with_critical', 'timed-exam'),
  ('knowledge_check', 'percentage', 'knowledge-check'),
  ('survey', 'none', 'survey')
on conflict (key) do nothing;

create table public.question_kinds (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  renderer_key text not null unique,
  created_at timestamptz not null default now()
);

insert into public.question_kinds (key, renderer_key)
values ('single_choice', 'single-choice'), ('true_false', 'true-false')
on conflict (key) do nothing;

create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.learning_units(id) on delete cascade,
  assessment_kind_id uuid not null references public.assessment_kinds(id) on delete restrict,
  source_key text not null,
  duration_seconds integer check (duration_seconds > 0),
  pass_score integer check (pass_score >= 0),
  require_all_critical boolean not null default false,
  shuffle_options boolean not null default false,
  allow_retry_per_question boolean not null default false,
  feedback_policy text not null default 'after_answer'
    check (feedback_policy in ('after_answer', 'after_submit', 'never')),
  rules jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (unit_id, source_key)
);

create index assessments_unit_kind_idx on public.assessments(unit_id, assessment_kind_id);

create table public.assessment_questions (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  question_kind_id uuid not null references public.question_kinds(id) on delete restrict,
  source_key text not null,
  sort_order integer not null check (sort_order >= 0),
  is_critical boolean not null default false,
  critical_label text,
  stem text not null,
  explanation text,
  created_at timestamptz not null default now(),
  unique (assessment_id, source_key),
  unique (assessment_id, sort_order),
  check (not is_critical or critical_label is not null)
);

create index assessment_questions_assessment_sort_idx
  on public.assessment_questions(assessment_id, sort_order);

create table public.answer_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.assessment_questions(id) on delete cascade,
  source_key text not null,
  sort_order integer not null check (sort_order >= 0),
  option_text text not null,
  feedback text,
  created_at timestamptz not null default now(),
  unique (question_id, source_key),
  unique (question_id, sort_order)
);

create index answer_options_question_sort_idx on public.answer_options(question_id, sort_order);

create table private.question_answer_keys (
  question_id uuid primary key references public.assessment_questions(id) on delete cascade,
  correct_option_id uuid not null references public.answer_options(id) on delete restrict
);

create table public.production_tasks (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.learning_units(id) on delete cascade,
  source_key text not null,
  minimum_characters integer not null default 20 check (minimum_characters > 0),
  sort_order integer not null default 0,
  prompt text not null,
  unique (unit_id, source_key)
);

create table public.production_criteria (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.production_tasks(id) on delete cascade,
  source_key text not null,
  sort_order integer not null,
  criterion_text text not null,
  unique (task_id, source_key),
  unique (task_id, sort_order)
);

create table public.practice_packs (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.learning_units(id) on delete cascade,
  source_key text not null,
  station_duration_seconds integer not null default 420 check (station_duration_seconds > 0),
  feedback_duration_seconds integer not null default 480 check (feedback_duration_seconds > 0),
  unique (unit_id, source_key)
);

create table public.practice_roles (
  id uuid primary key default gen_random_uuid(),
  practice_pack_id uuid not null references public.practice_packs(id) on delete cascade,
  source_key text not null,
  role_type text not null,
  sort_order integer not null,
  contains_hidden_information boolean not null default false,
  title text not null,
  instructions jsonb not null default '{}'::jsonb,
  unique (practice_pack_id, source_key),
  unique (practice_pack_id, sort_order)
);

create table public.rubrics (
  id uuid primary key default gen_random_uuid(),
  practice_pack_id uuid not null unique references public.practice_packs(id) on delete cascade,
  pass_rule jsonb not null default '{}'::jsonb
);

create table public.rubric_sections (
  id uuid primary key default gen_random_uuid(),
  rubric_id uuid not null references public.rubrics(id) on delete cascade,
  source_key text not null,
  sort_order integer not null,
  title text not null,
  unique (rubric_id, source_key),
  unique (rubric_id, sort_order)
);

create table public.rubric_items (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.rubric_sections(id) on delete cascade,
  source_key text not null,
  sort_order integer not null,
  weight numeric(6,2) not null default 1 check (weight > 0),
  is_critical boolean not null default false,
  item_text text not null,
  unique (section_id, source_key),
  unique (section_id, sort_order)
);
