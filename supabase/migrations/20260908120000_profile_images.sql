alter table public.profiles
  add column if not exists avatar_path text;

insert into storage.buckets (id, name, public)
values ('profile-images', 'profile-images', false)
on conflict (id) do nothing;