-- Legacy users may predate the profile-creation trigger. Allow them to create
-- only their own learner profile when recording gated product activity.
create policy "learners can create their own profile" on public.profiles
  for insert
  with check (auth.uid() = id and role = 'learner');