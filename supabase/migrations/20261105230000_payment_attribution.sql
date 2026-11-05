-- Capture the latest known source before checkout. Existing visits are evidence;
-- a missing source remains unknown. Run manually on production.
create table if not exists public.payment_attributions (
  payment_kind text not null check (payment_kind in ('course', 'private_session')),
  payment_id uuid not null,
  visit_id uuid not null references public.site_visits(id) on delete cascade,
  primary key (payment_kind, payment_id)
);
alter table public.payment_attributions enable row level security;
revoke all on public.payment_attributions from public, anon, authenticated;
grant select, insert, update, delete on public.payment_attributions to service_role;

create or replace function public.find_payment_attribution(p_user uuid, p_at timestamptz)
returns uuid language sql stable security definer set search_path = public as $$
  select v.id from public.site_visits v
  where v.visited_at <= p_at
    and (v.google_ads_click_detected is true or nullif(trim(v.utm_source), '') is not null
         or nullif(trim(v.referrer), '') is not null)
    and (v.user_id = p_user or (v.user_id is null and exists (
      select 1 from public.site_visits linked
      where linked.visitor_hash = v.visitor_hash and linked.user_id = p_user
        and linked.visited_at <= p_at
        and not exists (select 1 from public.site_visits other_user
          where other_user.visitor_hash = v.visitor_hash and other_user.user_id is not null
            and other_user.user_id <> p_user and other_user.visited_at <= p_at)
    )))
  order by v.visited_at desc, v.id desc limit 1;
$$;
revoke all on function public.find_payment_attribution(uuid, timestamptz) from public, anon, authenticated;

create or replace function public.capture_payment_attribution()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_visit uuid; v_kind text;
begin
  v_kind := case when tg_table_name = 'course_payment_attempts' then 'course' else 'private_session' end;
  v_visit := public.find_payment_attribution(new.user_id, new.created_at);
  if v_visit is not null then
    insert into public.payment_attributions(payment_kind, payment_id, visit_id)
    values (v_kind, new.id, v_visit) on conflict do nothing;
  end if;
  return new;
exception when others then
  raise warning 'Payment attribution could not be captured: %', sqlerrm;
  return new;
end;
$$;
revoke all on function public.capture_payment_attribution() from public, anon, authenticated;
drop trigger if exists capture_payment_attribution on public.course_payment_attempts;
create trigger capture_payment_attribution after insert on public.course_payment_attempts
for each row execute function public.capture_payment_attribution();
drop trigger if exists capture_payment_attribution on public.session_payment_attempts;
create trigger capture_payment_attribution after insert on public.session_payment_attempts
for each row execute function public.capture_payment_attribution();

insert into public.payment_attributions(payment_kind, payment_id, visit_id)
select p.kind, p.id, p.visit_id from (
  select 'course'::text kind, a.id, public.find_payment_attribution(a.user_id, a.created_at) visit_id
  from public.course_payment_attempts a
  union all
  select 'private_session'::text, a.id, public.find_payment_attribution(a.user_id, a.created_at)
  from public.session_payment_attempts a
) p where p.visit_id is not null on conflict do nothing;
