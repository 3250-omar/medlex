-- Migration: 20260927110000_add_courses_pricing_and_status.sql
-- Description: Add pricing, currency, and course_status columns to courses table.

alter table public.courses 
  add column if not exists price numeric(12,2) not null default 0 check (price >= 0);

alter table public.courses 
  add column if not exists currency text not null default 'EGP' check (currency ~ '^[A-Z]{3}$');

alter table public.courses 
  add column if not exists course_status text not null default 'active' check (course_status in ('active', 'waiting_list', 'launching'));

comment on column public.courses.price is 'Course price amount';
comment on column public.courses.currency is 'ISO 3-letter currency code, e.g. EGP, USD';
comment on column public.courses.course_status is 'Status of course: active (Open Now), waiting_list (WaitingList Open), launching (First programmes launching ..)';
