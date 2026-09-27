-- Add gallery_images column to public.blogs
ALTER TABLE public.blogs
ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb;
