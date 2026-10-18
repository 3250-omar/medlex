-- Migration: Make Arabic title and content nullable to support English-only articles (e.g. CASC)
ALTER TABLE public.blogs ALTER COLUMN title_ar DROP NOT NULL;
ALTER TABLE public.blogs ALTER COLUMN content_ar DROP NOT NULL;

-- Update CHECK constraint on title_ar to allow NULL or between 5 and 100 characters
ALTER TABLE public.blogs DROP CONSTRAINT IF EXISTS blogs_title_ar_check;
ALTER TABLE public.blogs ADD CONSTRAINT blogs_title_ar_check 
  CHECK (title_ar IS NULL OR (char_length(title_ar) >= 5 AND char_length(title_ar) <= 100));
