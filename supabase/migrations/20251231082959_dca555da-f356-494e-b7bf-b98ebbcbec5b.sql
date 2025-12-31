-- Make category_id nullable in gallery_images
ALTER TABLE public.gallery_images 
ALTER COLUMN category_id DROP NOT NULL;