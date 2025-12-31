-- Create gallery_images table for storing image metadata
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  is_hero BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- For development: RLS disabled (will be enabled later with admin restrictions)
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Temporary open policies for development
CREATE POLICY "Anyone can read gallery images" 
ON public.gallery_images 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert gallery images" 
ON public.gallery_images 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update gallery images" 
ON public.gallery_images 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete gallery images" 
ON public.gallery_images 
FOR DELETE 
USING (true);

-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true);

-- Storage policies for development (open access)
CREATE POLICY "Anyone can view gallery images"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

CREATE POLICY "Anyone can upload gallery images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Anyone can update gallery images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'gallery');

CREATE POLICY "Anyone can delete gallery images"
ON storage.objects FOR DELETE
USING (bucket_id = 'gallery');