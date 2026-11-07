-- Likes and shares have only counters today, so future interactions need a detail log.
-- Article views continue to use the existing site_visits table.
create table if not exists public.blog_engagement_events (
  id uuid primary key default gen_random_uuid(),
  blog_id uuid not null references public.blogs(id) on delete cascade,
  event_type text not null check (event_type in ('like', 'unlike', 'share')),
  user_id uuid references auth.users(id) on delete set null,
  visitor_hash text,
  ip_address inet,
  country_code text check (country_code ~ '^[A-Z]{2}$'),
  occurred_at timestamptz not null default now()
);

create index if not exists blog_engagement_events_lookup
  on public.blog_engagement_events (blog_id, event_type, occurred_at desc);

alter table public.blog_engagement_events enable row level security;
-- Only the server-side service role writes or reads these details.
revoke all on public.blog_engagement_events from anon, authenticated;
grant select, insert on public.blog_engagement_events to service_role;

alter table public.site_visits
  add column if not exists ip_address inet,
  add column if not exists country_code text,
  add column if not exists user_id uuid references auth.users(id) on delete set null;

do $$
declare
  existing_definition text;
begin
  select pg_get_constraintdef(oid) into existing_definition
  from pg_constraint
  where conrelid = 'public.site_visits'::regclass
    and conname = 'site_visits_country_code_check';

  if existing_definition is null then
    alter table public.site_visits
      add constraint site_visits_country_code_check
      check (country_code is null or country_code ~ '^[A-Z]{2}$');
  elsif existing_definition <> 'CHECK (((country_code IS NULL) OR (country_code ~ ''^[A-Z]{2}$''::text)))' then
    raise exception 'Existing site_visits_country_code_check has an unexpected definition: %', existing_definition;
  end if;
end $$;
