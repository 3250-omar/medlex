-- Migration to add features arrays to courses table
ALTER TABLE public.courses
ADD COLUMN features_ar text[] DEFAULT '{}'::text[],
ADD COLUMN features_en text[] DEFAULT '{}'::text[];
