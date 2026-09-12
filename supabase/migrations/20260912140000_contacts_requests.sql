-- Create contacts_requests table for storing contact and interest registration forms
create table if not exists public.contacts_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) > 0),
  gmail text not null check (char_length(trim(gmail)) > 0),
  phone text not null check (char_length(trim(phone)) > 0),
  professional_role text,
  organisation text,
  pathway text not null check (char_length(trim(pathway)) > 0),
  notes text,
  locale text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Comments
comment on table public.contacts_requests is 'Inquiries and pathway interest registrations submitted through the contact form.';
comment on column public.contacts_requests.id is 'Unique identifier for the contact request.';
comment on column public.contacts_requests.full_name is 'Full name of the contact person.';
comment on column public.contacts_requests.gmail is 'Email / Gmail address of the contact person.';
comment on column public.contacts_requests.phone is 'Contact phone number of the submitter.';
comment on column public.contacts_requests.professional_role is 'Professional role / specialty.';
comment on column public.contacts_requests.organisation is 'Organisation, clinic, hospital or institution.';
comment on column public.contacts_requests.pathway is 'Target educational pathway or inquiry topic.';
comment on column public.contacts_requests.notes is 'Additional inquiry notes or questions.';
comment on column public.contacts_requests.locale is 'Locale used at time of submission (en/ar).';

-- Indexes
create index if not exists contacts_requests_created_at_idx on public.contacts_requests (created_at desc);
create index if not exists contacts_requests_gmail_idx on public.contacts_requests (gmail);

-- Row Level Security
alter table public.contacts_requests enable row level security;

-- Admin policies
create policy "admins can view contacts_requests" on public.contacts_requests
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "admins can update contacts_requests" on public.contacts_requests
  for update using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "admins can delete contacts_requests" on public.contacts_requests
  for delete using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Auto-update updated_at on row changes (reuses existing trigger function)
drop trigger if exists set_contacts_requests_updated_at on public.contacts_requests;
create trigger set_contacts_requests_updated_at
before update on public.contacts_requests
for each row execute function public.set_updated_at();
