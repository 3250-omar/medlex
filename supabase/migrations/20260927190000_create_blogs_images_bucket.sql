-- Create public storage bucket for blog images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'blogs-images',
    'blogs-images',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy to allow public read access for blogs-images bucket
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Public Access blogs-images'
    ) THEN
        CREATE POLICY "Public Access blogs-images"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'blogs-images');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Authenticated Upload blogs-images'
    ) THEN
        CREATE POLICY "Authenticated Upload blogs-images"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (bucket_id = 'blogs-images');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Authenticated Update blogs-images'
    ) THEN
        CREATE POLICY "Authenticated Update blogs-images"
        ON storage.objects FOR UPDATE
        TO authenticated
        USING (bucket_id = 'blogs-images');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Authenticated Delete blogs-images'
    ) THEN
        CREATE POLICY "Authenticated Delete blogs-images"
        ON storage.objects FOR DELETE
        TO authenticated
        USING (bucket_id = 'blogs-images');
    END IF;
END $$;
