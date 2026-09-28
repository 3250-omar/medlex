-- Add views_count to public.blogs
ALTER TABLE public.blogs
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0 NOT NULL;

-- Function to safely increment blog views
CREATE OR REPLACE FUNCTION increment_blog_views(p_blog_id UUID)
RETURNS INT AS $$
DECLARE
  v_new_count INT;
BEGIN
  UPDATE public.blogs
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = p_blog_id
  RETURNING views_count INTO v_new_count;

  RETURN v_new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to anon and authenticated roles
GRANT EXECUTE ON FUNCTION increment_blog_views(UUID) TO anon, authenticated;
