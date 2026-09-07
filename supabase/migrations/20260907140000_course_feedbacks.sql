create table if not exists public.feedbacks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  feedback text not null check (char_length(trim(feedback)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, course_id)
);
create index if not exists feedbacks_course_id_idx on public.feedbacks (course_id);
alter table public.feedbacks enable row level security;
create policy "learners can read their own feedback" on public.feedbacks for select to authenticated using (user_id = auth.uid());
create policy "learners can create their own feedback" on public.feedbacks for insert to authenticated with check (user_id = auth.uid());
create policy "learners can update their own feedback" on public.feedbacks for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());