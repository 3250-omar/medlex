-- Add likes_count and shares_count to public.blogs
ALTER TABLE public.blogs
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS shares_count INTEGER DEFAULT 0 NOT NULL;

-- Function to safely increment/decrement blog likes
CREATE OR REPLACE FUNCTION increment_blog_likes(p_blog_id UUID, p_increment INT DEFAULT 1)
RETURNS INT AS $$
DECLARE
  v_new_count INT;
BEGIN
  UPDATE public.blogs
  SET likes_count = GREATEST(0, COALESCE(likes_count, 0) + p_increment)
  WHERE id = p_blog_id
  RETURNING likes_count INTO v_new_count;

  RETURN v_new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to safely increment blog shares
CREATE OR REPLACE FUNCTION increment_blog_shares(p_blog_id UUID)
RETURNS INT AS $$
DECLARE
  v_new_count INT;
BEGIN
  UPDATE public.blogs
  SET shares_count = COALESCE(shares_count, 0) + 1
  WHERE id = p_blog_id
  RETURNING shares_count INTO v_new_count;

  RETURN v_new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to anon and authenticated roles
GRANT EXECUTE ON FUNCTION increment_blog_likes(UUID, INT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_blog_shares(UUID) TO anon, authenticated;
