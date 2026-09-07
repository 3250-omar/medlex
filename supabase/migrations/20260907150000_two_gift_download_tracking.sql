-- Track the two CASC Academy gifts independently.
alter table public.profiles
  add column if not exists gift_1_downloaded_at timestamptz,
  add column if not exists gift_2_downloaded_at timestamptz;

comment on column public.profiles.gift_1_downloaded_at is
  'Timestamp of the first CASC Academy gift download.';

comment on column public.profiles.gift_2_downloaded_at is
  'Timestamp of the second CASC Academy gift download.';
