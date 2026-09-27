-- Migration: 20260927120000_course_country_prices.sql
-- Description: Country-based pricing overrides for courses.
--   Adds course_country_prices table to allow per-country pricing overrides.
--   Uses '__OTHER__' as a wildcard country code for "all other countries" fallback.
--   Falls back to default course price and currency when no country match is found.

-- ============================================================================
-- 1. course_country_prices table
-- ============================================================================
create table if not exists public.course_country_prices (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  country_code text not null check (
    country_code = '__OTHER__' or country_code ~ '^[A-Z]{2}$'
  ),
  price numeric(12,2) not null check (price >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint course_country_prices_unique unique (course_id, country_code)
);

comment on table public.course_country_prices is
  'Per-country pricing overrides for courses. '
  'Use ISO 3166-1 alpha-2 country codes (e.g. EG, US, SA). '
  'The special code __OTHER__ serves as the fallback for any country without an explicit entry.';

-- ============================================================================
-- 2. Indexes
-- ============================================================================
create index if not exists course_country_prices_course_idx
  on public.course_country_prices (course_id, is_active);

create index if not exists course_country_prices_lookup_idx
  on public.course_country_prices (course_id, country_code)
  where (is_active = true);

-- ============================================================================
-- 3. Updated-at trigger
-- ============================================================================
create or replace trigger set_course_country_prices_updated_at
  before update on public.course_country_prices
  for each row execute function public.set_updated_at();

-- ============================================================================
-- 4. RLS policies
-- ============================================================================
alter table public.course_country_prices enable row level security;

-- Admins have full access
drop policy if exists "Admins have full access to course_country_prices" on public.course_country_prices;
create policy "Admins have full access to course_country_prices"
  on public.course_country_prices
  for all
  using (private.is_admin(auth.uid()))
  with check (private.is_admin(auth.uid()));

-- Authenticated and public users can read active prices
drop policy if exists "Public and authenticated users can read active course_country_prices" on public.course_country_prices;
create policy "Public and authenticated users can read active course_country_prices"
  on public.course_country_prices
  for select
  using (is_active = true);

-- ============================================================================
-- 5. Helper function: resolve country price for a course
-- ============================================================================
create or replace function public.resolve_course_country_price(
  p_course_id uuid,
  p_country_code text
)
returns table (
  resolved_price numeric(12,2),
  resolved_currency text,
  price_source text  -- 'country', 'other', 'default'
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_exact record;
  v_other record;
  v_default record;
begin
  -- 1. Try exact country match
  select price, currency into v_exact
  from public.course_country_prices
  where course_id = p_course_id
    and country_code = upper(p_country_code)
    and is_active = true;

  if found then
    resolved_price := v_exact.price;
    resolved_currency := v_exact.currency;
    price_source := 'country';
    return next;
    return;
  end if;

  -- 2. Try __OTHER__ fallback
  select price, currency into v_other
  from public.course_country_prices
  where course_id = p_course_id
    and country_code = '__OTHER__'
    and is_active = true;

  if found then
    resolved_price := v_other.price;
    resolved_currency := v_other.currency;
    price_source := 'other';
    return next;
    return;
  end if;

  -- 3. Fall back to course default price and currency
  select price, currency into v_default
  from public.courses
  where id = p_course_id;

  if found then
    resolved_price := coalesce(v_default.price, 0);
    resolved_currency := coalesce(v_default.currency, 'EGP');
    price_source := 'default';
    return next;
    return;
  end if;

  return;
end;
$$;
