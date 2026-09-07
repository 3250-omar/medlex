alter table public.profiles
  add column if not exists exam_date date;

update public.profiles p
set exam_date = nullif(u.raw_user_meta_data ->> 'exam_date', '')::date
from auth.users u
where u.id = p.id
  and p.exam_date is null
  and nullif(u.raw_user_meta_data ->> 'exam_date', '') is not null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, exam_date)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'exam_date', '')::date
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
