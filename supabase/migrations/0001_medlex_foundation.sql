create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'learner' check (role in ('learner', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_en text not null,
  title_ar text,
  description_en text,
  description_ar text,
  price numeric(12,2) not null default 0 check (price >= 0),
  access_duration_days integer not null default 365 check (access_duration_days > 0),
  points_on_completion integer not null default 0 check (points_on_completion >= 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists courses_published_created_idx on public.courses (is_published, created_at desc);

alter table public.profiles enable row level security;
alter table public.courses enable row level security;

create policy "published courses are public" on public.courses
  for select using (is_published = true);

create policy "learners can read their profile" on public.profiles
  for select using (auth.uid() = id);

create policy "learners can update their profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "admins can manage profiles" on public.profiles
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "admins can manage courses" on public.courses
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
