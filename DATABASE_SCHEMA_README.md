# Medlex Database Schema

This document describes the current Supabase/PostgreSQL schema. The canonical source is the ordered SQL in [`supabase/migrations`](supabase/migrations); `types/database.ts` is a partial application type and must be regenerated when the schema changes.

## Platform and conventions

- PostgreSQL is provided by Supabase. `pgcrypto` supplies `gen_random_uuid()`.
- Application tables live in `public`; answer keys live in the non-public `private` schema; authentication users are `auth.users`.
- IDs are UUIDs unless a table explicitly uses an identity `bigint`. Most timestamps are `timestamptz` with a `now()` default.
- `public.set_updated_at()` drives update timestamps on courses, releases, units, blocks, enrollments, and unit progress.
- A new `auth.users` record invokes `public.handle_new_user()`, which creates a matching profile using `full_name` and `exam_date` from user metadata.

## Domain map

```text
auth.users -> profiles
auth.users -> enrollments -> unit_progress
courses -> course_releases -> learning_units -> content_blocks
                    |                 -> assessments -> questions -> options
                    |                 -> production_tasks / practice_packs
enrollments -> attempts, submissions, sessions, mastery, certificates, points
courses -> feedbacks -> public_course_feedbacks (read-only view)
```

## Tables

### Identity and catalogue

| Table | Columns and constraints | Purpose |
| --- | --- | --- |
| `profiles` | `id` PK -> `auth.users` (cascade); `full_name`, `phone`, `avatar_path`, `exam_date`; `role` = `learner` or `admin` (default learner); gift timestamps: `gift_downloaded_at`, `gift_1_downloaded_at`, `gift_2_downloaded_at`; `created_at`, `updated_at` | Application profile and authorization role. |
| `courses` | UUID PK; unique `slug`; English and optional Arabic title/description; non-negative `price`, positive `access_duration_days`, non-negative `points_on_completion`; `is_published`; `created_at`, `updated_at` | Course catalogue record. |
| `course_categories` | UUID PK; unique `slug`; `created_at` | Category lookup. |
| `course_category_assignments` | Composite PK: `course_id` -> courses and `category_id` -> categories, both cascade | Course/category many-to-many relation. |
| `course_releases` | UUID PK; `course_id` -> courses (cascade); positive `version_number`; `status` = draft/published/archived; optional `source_sha256`, `published_at`; JSONB `settings`; timestamps; unique `(course_id, version_number)` | Immutable-style version boundary for learning content. One published release per course; published rows require `published_at`. |
| `course_release_features` | Composite PK: `release_id` -> releases (cascade), `feature_key`; `is_enabled`; JSONB `config` | Release feature flags. |
| `content_imports` | UUID PK; `course_id` -> courses (restrict); optional `release_id` -> releases (set null); importer/source identity; `status` = pending/validated/imported/failed; JSONB report; lifecycle timestamps | Import audit trail. Unique `(course_id, importer_key, source_sha256)`. |

### Learning content

| Table | Columns and constraints | Purpose |
| --- | --- | --- |
| `learning_unit_kinds` | UUID PK; unique `key` and `renderer_key`; `is_system`; `created_at` | Renderer lookup. Seeded: orientation, module hub, lesson, station, assessment only. |
| `learning_units` | UUID PK; `release_id` -> releases (cascade); optional self-referencing `parent_unit_id` (cascade); `unit_kind_id` -> unit kinds (restrict); source identity, slug, optional code; sequence/position; estimated duration; publish/required flags; title and editorial text; JSONB metadata; timestamps | Hierarchical course units. `source_key`, `slug`, and `sequence_number` are each unique within a release; parent must be in the same release. |
| `content_blocks` | UUID PK; `unit_id` -> units (cascade); source key/type/order; JSONB `settings` and `content`; required-for-progress flag; timestamps | Ordered unit content. Source key and sort order are unique per unit. |
| `media_assets` | UUID PK; storage bucket/path, MIME type, unique SHA-256, optional alt text, `created_at` | Stored media registry. Bucket/path combination is unique. |
| `competencies` | UUID PK; `release_id` -> releases, `domain_unit_id` -> units (both cascade); source key, position, title/description, timestamp | Release-scoped competency definitions. |
| `unit_competencies` | Composite PK: `unit_id` -> units, `competency_id` -> competencies; `is_primary` | Units mapped to competencies. |
| `course_completion_policies` | UUID PK; `release_id` -> releases (cascade); key/type; JSONB config; order; required flag | Data-defined completion requirements. |

### Assessment and practice authoring

| Table | Columns and constraints | Purpose |
| --- | --- | --- |
| `assessment_kinds` | UUID PK; unique `key` and `renderer_key`; `scoring_strategy_key`; timestamp | Assessment renderer/scoring lookup. |
| `question_kinds` | UUID PK; unique `key` and `renderer_key`; timestamp | Question renderer lookup. |
| `assessments` | UUID PK; `unit_id` -> units (cascade); kind -> assessment kinds (restrict); source key; optional duration/pass score; critical/shuffle/retry flags; feedback policy = after_answer/after_submit/never; JSONB rules; order; timestamp | Unit assessment definition. |
| `assessment_questions` | UUID PK; `assessment_id` -> assessments (cascade); kind -> question kinds (restrict); source key/order; critical fields; stem/explanation; timestamp | Ordered assessment questions. Critical questions require a label. |
| `answer_options` | UUID PK; `question_id` -> questions (cascade); source key/order; option text/feedback; timestamp | Ordered selectable answers. |
| `private.question_answer_keys` | `question_id` PK -> assessment questions (cascade); `correct_option_id` -> answer options (restrict) | Private correctness mapping. Never expose directly to learners. |
| `production_tasks` | UUID PK; `unit_id` -> units (cascade); source key; positive minimum characters; order; prompt | Free-text activity definition. |
| `production_criteria` | UUID PK; `task_id` -> production tasks (cascade); source key/order; criterion text | Self-check criteria for a production task. |
| `practice_packs` | UUID PK; `unit_id` -> units (cascade); source key; positive station and feedback durations | Practice station definition. |
| `practice_roles` | UUID PK; `practice_pack_id` -> packs (cascade); source key/type/order; hidden-info flag; title; JSONB instructions | Participant role in a practice pack. |
| `rubrics` | UUID PK; unique `practice_pack_id` -> packs (cascade); JSONB pass rule | One rubric per practice pack. |
| `rubric_sections` | UUID PK; `rubric_id` -> rubrics (cascade); source key/order/title | Ordered rubric group. |
| `rubric_items` | UUID PK; `section_id` -> sections (cascade); source key/order; positive numeric weight; critical flag; text | Scorable rubric item. |

### Learner records and rewards

| Table | Columns and constraints | Purpose |
| --- | --- | --- |
| `enrollments` | UUID PK; `user_id` -> auth users (cascade); course/release -> catalogue (restrict); optional last unit -> units (set null); status = active/completed/expired/paused/cancelled; access lifecycle timestamps | Learner access to a particular release. Release and last unit are validated against the selected course/release; one active or paused enrollment per user/course. |
| `unit_progress` | Composite PK: enrollment -> enrollments and unit -> units (cascade); status = not_started/in_progress/completed; 0-100 percent; lifecycle timestamps | Per-unit learner progress. Trigger requires the unit to belong to the enrollment release. |
| `assessment_attempts` | UUID PK; enrollment -> enrollments (cascade); assessment -> assessments (restrict); positive attempt number; status = in_progress/submitted/expired/abandoned; timings, score/max score, critical misses, passed | Assessment run. `(enrollment_id, assessment_id, attempt_number)` is unique; submitted status requires `submitted_at`. |
| `attempt_question_order` | Composite PK: attempt -> attempts (cascade), question -> questions (restrict); position; UUID option order array | Per-attempt question and option ordering. |
| `attempt_answers` | UUID PK; attempt -> attempts (cascade); question/selected option -> assessment entities (restrict); positive sequence; correctness; timestamp | Submitted/retried answer history. |
| `production_submissions` | UUID PK; enrollment -> enrollments (cascade); task -> production tasks (restrict); response text; timestamp | Learner free-text response. |
| `production_self_checks` | Composite PK: submission -> production submissions (cascade), criterion -> criteria (restrict); `is_met` | Learner checklist results. |
| `practice_sessions` | UUID PK; enrollment -> enrollments (cascade); pack -> practice packs (restrict); status = planned/in_progress/completed/cancelled; timestamps | A learner practice session. |
| `practice_participants` | Composite PK: session -> sessions (cascade), role -> roles (restrict); optional auth user (set null), optional display name | Assigned participant. At least a user or nonblank display name is required. |
| `rubric_submissions` | UUID PK; unique session -> practice sessions (cascade); optional submitter -> auth users (set null); rating = pass/borderline/fail; nonblank evidence note; timestamp | One completed rubric per session. |
| `rubric_item_scores` | Composite PK: submission -> rubric submissions (cascade), item -> rubric items (restrict); `achieved` | Per-item rubric result. |
| `mastery_evidence` | UUID PK; enrollment/competency/unit -> respective tables (cascade); level = explored/recognised/demonstrated/validated; source type; source UUID; achievement/revocation timestamps | Auditable competency evidence. |
| `learning_sessions` | UUID PK; enrollment/unit -> respective tables (cascade); session timings, active seconds, heartbeat; client key | Learning time tracking. Unique `(enrollment_id, client_session_key)`. |
| `learning_events` | Identity bigint PK; session -> sessions (cascade); unit -> units (cascade); optional block -> blocks (set null); event metadata; unique idempotency key | Immutable client activity log. |
| `point_ledger` | UUID PK; user -> auth users (cascade); optional enrollment (set null); points/reason/source; timestamp | Idempotent point accounting. Unique `(user_id, source_type, source_id)`. |
| `certificates` | UUID PK; unique certificate number; unique enrollment -> enrollments (restrict); recipient/course/release snapshots; issue/revocation/storage fields | One certificate per enrollment. |
| `certificate_download_events` | Identity bigint PK; certificate -> certificates (cascade); optional user -> auth users (set null); timestamp | Certificate download audit. |
| `feedbacks` | UUID PK; user -> auth users (cascade); course -> courses (cascade); nonblank text; timestamps | One learner feedback record per course. |

## View, storage, and security

- `public.public_course_feedbacks` exposes only `feedback`, `updated_at`, and published `course_slug`; it is readable by `anon` and `authenticated`.
- Storage bucket `profile-images` is private and backs `profiles.avatar_path`.
- RLS is enabled on application tables. Administrators have full access through `private.is_admin(auth.uid())`.
- Public users can read published courses/categories and the public feedback view. Learners can read only their own profile, enrollment data, certificates, points, and permitted published release content.
- Direct learner access to answer options' correctness is prohibited: answer keys are private and assessment workflow functions return only allowed data.
- Learners can create/update their own feedback and insert their own certificate download event; they can update their own profile. The auth-admin profile creation policy supports the auth trigger.

## Public RPCs

All workflow RPCs are `SECURITY DEFINER`, validate the authenticated user/enrollment, and are granted to `authenticated` rather than `public`.

| Function | Responsibility |
| --- | --- |
| `subscribe_to_free_course(course_slug)` | Enrolls a signed-in user in a published free course and returns enrollment/release/first unit. |
| `record_unit_opened(course_slug, unit_slug)` / `mark_unit_opened(unit_id)` | Upserts in-progress unit access. |
| `mark_unit_completed(course_slug, unit_slug)` | Marks a unit 100%, updates last access, calculates course progress, and completes the enrollment when all published units are complete. |
| `start_assessment(assessment_id)` | Creates an attempt and locks per-attempt question/option order. |
| `submit_single_choice_answer(attempt_id, question_id, option_id)` | Validates a retry-capable answer against private keys. |
| `submit_exam_attempt(attempt_id, answers, elapsed_seconds)` | Scores an exam, enforces timing/critical rules, persists answers, and writes recognised mastery on a pass. |
| `complete_learn_assessment(attempt_id)` | Completes a learning assessment once every question has a correct answer. |
| `submit_production(task_id, response, checked_criteria)` | Saves a response/self-check and writes demonstrated mastery when all criteria are met. |
| `get_course_certificate_status(course_slug)` | Returns enrollment, progress, recipient, and certificate status. |
| `issue_course_certificate(course_slug, recipient_name_override)` | Issues or updates a certificate for an active enrollment. The former 50% progress gate is intentionally disabled by the latest migration. |

## Maintenance

1. Add schema changes as a new timestamped migration; do not edit applied migrations.
2. Update this document and regenerate `types/database.ts` after applying the migration.
3. Keep answer keys and any future sensitive content in `private` or behind a server-side RPC.
4. Test RLS as anonymous, learner, and administrator roles whenever a policy or RPC changes.
