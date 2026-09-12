-- ==============================================================================
-- RUN THIS IN SUPABASE DASHBOARD > SQL EDITOR
-- This script does 2 things in one click:
-- 1. Creates the `contacts_requests` table, indexes, RLS, and trigger
-- 2. Synchronizes the migration history so `supabase db push` is happy
-- ==============================================================================

-- 1. Create contacts_requests table
CREATE TABLE IF NOT EXISTS public.contacts_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(trim(full_name)) > 0),
  gmail text NOT NULL CHECK (char_length(trim(gmail)) > 0),
  phone text NOT NULL CHECK (char_length(trim(phone)) > 0),
  professional_role text,
  organisation text,
  pathway text NOT NULL CHECK (char_length(trim(pathway)) > 0),
  notes text,
  locale text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS contacts_requests_created_at_idx ON public.contacts_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS contacts_requests_gmail_idx ON public.contacts_requests (gmail);

-- 3. Row Level Security
ALTER TABLE public.contacts_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins can view contacts_requests" ON public.contacts_requests;
CREATE POLICY "admins can view contacts_requests" ON public.contacts_requests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "admins can update contacts_requests" ON public.contacts_requests;
CREATE POLICY "admins can update contacts_requests" ON public.contacts_requests
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "admins can delete contacts_requests" ON public.contacts_requests;
CREATE POLICY "admins can delete contacts_requests" ON public.contacts_requests
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- 4. Auto-update updated_at trigger (uses existing set_updated_at function)
DROP TRIGGER IF EXISTS set_contacts_requests_updated_at ON public.contacts_requests;
CREATE TRIGGER set_contacts_requests_updated_at
BEFORE UPDATE ON public.contacts_requests
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. Clear stale remote migration versions
DELETE FROM supabase_migrations.schema_migrations
WHERE version IN (
  '20260908000000',
  '20260908143234',
  '20260908163000',
  '20260908180000',
  '20260909150000',
  '20260910190000',
  '20260910193000',
  '20260910194500',
  '20260910195500'
);

-- 6. Mark all local migrations (including the new contacts_requests) as applied
INSERT INTO supabase_migrations.schema_migrations (version)
VALUES
  ('0001'),
  ('0002'),
  ('0003'),
  ('0004'),
  ('0005'),
  ('0006'),
  ('0007'),
  ('0008'),
  ('0009'),
  ('0010'),
  ('0011'),
  ('0012'),
  ('0013'),
  ('20260905120000'),
  ('20260906120000'),
  ('20260907140000'),
  ('20260907150000'),
  ('20260908120000'),
  ('20260908130000'),
  ('20260908140000'),
  ('20260908150000'),
  ('20260910120000'),
  ('20260912140000')
ON CONFLICT (version) DO NOTHING;

-- 7. Confirm
SELECT version FROM supabase_migrations.schema_migrations ORDER BY version;
