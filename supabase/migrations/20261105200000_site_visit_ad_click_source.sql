-- Store only whether an Ads click identifier was present, never the identifier itself.
alter table public.site_visits
  add column if not exists google_ads_click_detected boolean;
