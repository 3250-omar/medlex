-- ==============================================================================
-- Migration: 20261019110000_create_site_visits.sql
-- Description: Create site_visits table for internal visitor & attribution tracking
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.site_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_hash TEXT NOT NULL,
    path TEXT NOT NULL,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    ip_hash TEXT NOT NULL,
    visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performant aggregation and reporting
CREATE INDEX IF NOT EXISTS idx_site_visits_visited_at ON public.site_visits(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_visits_visitor_date ON public.site_visits(visitor_hash, visited_at);
CREATE INDEX IF NOT EXISTS idx_site_visits_path ON public.site_visits(path);
CREATE INDEX IF NOT EXISTS idx_site_visits_utm_source ON public.site_visits(utm_source);

-- Enable Row Level Security (RLS)
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- Restrict access to service_role / internal backend
DROP POLICY IF EXISTS "Allow service role full access" ON public.site_visits;
CREATE POLICY "Allow service role full access" ON public.site_visits
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
