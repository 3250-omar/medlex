-- Add author columns to the blogs table
ALTER TABLE public.blogs
ADD COLUMN IF NOT EXISTS author_name_en TEXT DEFAULT 'Dr. Ahmed Abouelghit',
ADD COLUMN IF NOT EXISTS author_name_ar TEXT DEFAULT 'د. أحمد أبو الغيط';

-- Update existing blogs to have Dr. Ahmed Abouelghit as author
UPDATE public.blogs
SET 
    author_name_en = COALESCE(author_name_en, 'Dr. Ahmed Abouelghit'),
    author_name_ar = COALESCE(author_name_ar, 'د. أحمد أبو الغيط'),
    author_id = COALESCE(author_id, 'b7f97355-a510-4306-b5c4-80cb731e8bcb')
WHERE author_name_en IS NULL OR author_name_ar IS NULL OR author_id IS NULL;
