-- Add status column to contacts_requests
alter table public.contacts_requests
  add column if not exists status text not null default 'pending'
  check (status in ('pending', 'responded', 'ignored', 'reponsed'));

comment on column public.contacts_requests.status is 'Processing status of the inquiry (pending, responded, ignored).';

-- Index for filtering by status in admin dashboard
create index if not exists contacts_requests_status_idx on public.contacts_requests (status);
