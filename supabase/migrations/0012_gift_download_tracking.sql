-- Add gift download tracking to profiles table
alter table public.profiles
  add column if not exists gift_downloaded_at timestamptz;

comment on column public.profiles.gift_downloaded_at is
  'Timestamp of when the user first downloaded the CASC gift PDF. Null if not yet downloaded.';
