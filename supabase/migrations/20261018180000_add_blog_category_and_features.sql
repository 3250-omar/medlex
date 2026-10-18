-- Migration: Add category, course relation, alt text, and FAQ to blogs
ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'casc',
  ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cover_image_alt TEXT,
  ADD COLUMN IF NOT EXISTS faq_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS is_english_only BOOLEAN NOT NULL DEFAULT true;
  
-- Indexes for category and course_id
CREATE INDEX IF NOT EXISTS idx_blogs_category ON public.blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_course_id ON public.blogs(course_id);
