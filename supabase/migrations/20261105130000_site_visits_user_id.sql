-- The first blog details migration may already have been applied before user_id was added.
alter table public.site_visits
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists site_visits_user_id_visited_at_idx
  on public.site_visits (user_id, visited_at desc)
  where user_id is not null;
