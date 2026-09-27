CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en TEXT NOT NULL CHECK (char_length(title_en) >= 5 AND char_length(title_en) <= 100),
    title_ar TEXT NOT NULL CHECK (char_length(title_ar) >= 5 AND char_length(title_ar) <= 100),
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    content_en TEXT NOT NULL,
    content_ar TEXT NOT NULL,
    seo_description_en TEXT,
    seo_description_ar TEXT,
    seo_tags JSONB DEFAULT '[]'::jsonb,
    og_image_url TEXT,
    is_published BOOLEAN NOT NULL DEFAULT false,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Public can read published blogs
CREATE POLICY "Public can view published blogs"
ON public.blogs
FOR SELECT
TO public, authenticated
USING (is_published = true);

-- Admins can do everything
CREATE POLICY "Admins can manage all blogs"
ON public.blogs
FOR ALL
TO authenticated
USING (
    -- Assuming admins have a specific role or are the authors. For now, allow authenticated users who are the author, or we can use the generic service_role for the admin dashboard.
    -- If there's an admin check, we would put it here.
    -- Since we don't have the exact admin auth structure context, let's just allow the author for now, and rely on the admin dashboard using the Supabase Service Role key to bypass RLS.
    auth.uid() = author_id
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blogs_updated_at
    BEFORE UPDATE ON public.blogs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
