-- Serialize Paddle transaction creation for one idempotent course payment attempt.
alter table public.course_payment_attempts
  add column if not exists provider_creation_claim_id uuid,
  add column if not exists provider_creation_claimed_at timestamptz;

create index if not exists course_payment_attempts_provider_claim_idx
  on public.course_payment_attempts(provider_creation_claim_id)
  where provider_creation_claim_id is not null;