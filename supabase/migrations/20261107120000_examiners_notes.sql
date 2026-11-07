-- The campaign is deliberately disabled until activate_examiners_notes() is called.
create table public.examiners_notes_campaign (
  id boolean primary key default true check (id),
  activated_at timestamptz
);
insert into public.examiners_notes_campaign(id) values (true);

create table public.examiners_notes_members (
  enrollment_id uuid primary key references public.enrollments(id) on delete cascade,
  next_number integer not null default 1 check (next_number between 1 and 5),
  due_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.examiners_notes_deliveries (
  enrollment_id uuid not null references public.examiners_notes_members(enrollment_id) on delete cascade,
  message_number integer not null check (message_number between 1 and 4),
  state text not null default 'pending' check (state in ('pending', 'sending', 'accepted', 'uncertain', 'failed')),
  attempts integer not null default 0,
  first_attempt_at timestamptz,
  locked_until timestamptz,
  retry_at timestamptz,
  provider_id text,
  recipient_email text,
  recipient_first_name text,
  last_error text,
  updated_at timestamptz not null default now(),
  primary key (enrollment_id, message_number)
);
alter table public.examiners_notes_campaign enable row level security;
alter table public.examiners_notes_members enable row level security;
alter table public.examiners_notes_deliveries enable row level security;
revoke all on public.examiners_notes_campaign, public.examiners_notes_members, public.examiners_notes_deliveries from anon, authenticated;

create function public.examiners_notes_next_monday(p_time timestamptz)
returns timestamptz language sql immutable set search_path = '' as $$
  select ((p_time at time zone 'Africa/Cairo')::date
    + (7 - extract(isodow from p_time at time zone 'Africa/Cairo')::integer + 1) % 7
    + case when extract(isodow from p_time at time zone 'Africa/Cairo') = 1 then 7 else 0 end
    + time '11:00') at time zone 'Africa/Cairo';
$$;

create function public.examiners_notes_enrollment_trigger()
returns trigger language plpgsql security definer set search_path = '' as $$
declare v_activated_at timestamptz;
begin
  -- Share-lock the campaign row so activation and concurrent enrollments cannot race.
  select activated_at into v_activated_at from public.examiners_notes_campaign where id = true for share;
  if v_activated_at is not null and exists (select 1 from public.courses where id = new.course_id and slug = 'casc-academy') then
    insert into public.examiners_notes_members(enrollment_id, due_at)
    values (new.id, public.examiners_notes_next_monday(new.enrolled_at)) on conflict do nothing;
  end if;
  return new;
end $$;
create trigger examiners_notes_new_enrollment after insert on public.enrollments
for each row execute function public.examiners_notes_enrollment_trigger();

create function public.activate_examiners_notes()
returns integer language plpgsql security definer set search_path = '' as $$
declare v_count integer;
begin
  perform 1 from public.examiners_notes_campaign where id = true and activated_at is null for update;
  if not found then return 0; end if;
  update public.examiners_notes_campaign set activated_at = now() where id = true;
  insert into public.examiners_notes_members(enrollment_id, due_at)
  select e.id, now() from public.enrollments e join public.courses c on c.id = e.course_id
  where c.slug = 'casc-academy' and e.status = 'active' and (e.expires_at is null or e.expires_at > now())
  on conflict do nothing;
  get diagnostics v_count = row_count;
  return v_count;
end $$;

create function public.claim_examiners_note()
returns table(enrollment_id uuid, message_number integer, email text, first_name text, attempts integer)
language plpgsql security definer set search_path = '' as $$
declare v_member public.examiners_notes_members%rowtype;
begin
  select m.* into v_member from public.examiners_notes_members m
  join public.enrollments e on e.id = m.enrollment_id
  left join public.examiners_notes_deliveries d on d.enrollment_id = m.enrollment_id and d.message_number = m.next_number
  where m.next_number <= 4 and m.due_at <= now() and e.status = 'active'
    and (e.expires_at is null or e.expires_at > now())
    and (d.state is null or (d.state in ('pending','sending') and coalesce(d.locked_until, '-infinity') < now() and coalesce(d.retry_at, '-infinity') <= now()))
  order by m.due_at, m.enrollment_id for update of m skip locked limit 1;
  if not found then return; end if;
  insert into public.examiners_notes_deliveries as d(enrollment_id, message_number, state, attempts, first_attempt_at, locked_until, recipient_email, recipient_first_name)
  select v_member.enrollment_id, v_member.next_number, 'sending', 1, now(), now() + interval '5 minutes', u.email,
    coalesce(nullif(split_part(trim(p.full_name), ' ', 1), ''), 'Colleague')
  from public.enrollments e join auth.users u on u.id = e.user_id left join public.profiles p on p.id = e.user_id
  where e.id = v_member.enrollment_id
  on conflict on constraint examiners_notes_deliveries_pkey do update set
    state = case when d.first_attempt_at < now() - interval '23 hours' then 'uncertain' else 'sending' end,
    attempts = d.attempts + 1, locked_until = now() + interval '5 minutes', updated_at = now();
  return query select e.id, v_member.next_number, d.recipient_email,
    d.recipient_first_name, d.attempts
    from public.enrollments e
    join public.examiners_notes_deliveries d on d.enrollment_id = e.id and d.message_number = v_member.next_number
    where e.id = v_member.enrollment_id and d.state = 'sending';
end $$;

create function public.finish_examiners_note(p_enrollment uuid, p_number integer, p_outcome text, p_provider_id text default null, p_error text default null)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_outcome not in ('accepted', 'pending', 'failed', 'uncertain') then raise exception 'invalid outcome'; end if;
  update public.examiners_notes_deliveries set state = p_outcome, provider_id = p_provider_id,
    last_error = left(p_error, 1000), locked_until = null,
    retry_at = case when p_outcome = 'pending' then now() + interval '15 minutes' else null end,
    updated_at = now() where enrollment_id = p_enrollment and message_number = p_number and state = 'sending';
  if found and p_outcome = 'accepted' then
    update public.examiners_notes_members set next_number = p_number + 1,
      due_at = public.examiners_notes_next_monday(now())
      where enrollment_id = p_enrollment and next_number = p_number;
  end if;
end $$;

revoke all on function public.examiners_notes_next_monday(timestamptz), public.examiners_notes_enrollment_trigger(), public.activate_examiners_notes(), public.claim_examiners_note(), public.finish_examiners_note(uuid, integer, text, text, text) from public, anon, authenticated;
grant execute on function public.activate_examiners_notes(), public.claim_examiners_note(), public.finish_examiners_note(uuid, integer, text, text, text) to service_role;
