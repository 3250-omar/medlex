-- The auth.users trigger creates the initial profile before a learner session exists.
-- Permit only Supabase's internal auth role to perform that insert.
drop policy if exists "auth admin can create profiles" on public.profiles;
create policy "auth admin can create profiles" on public.profiles
  for insert to supabase_auth_admin
  with check (true);