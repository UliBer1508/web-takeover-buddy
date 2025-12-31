-- 1. Erweitere houses Tabelle mit zusätzlichen Feldern
ALTER TABLE public.houses 
  ADD COLUMN IF NOT EXISTS slug text UNIQUE,
  ADD COLUMN IF NOT EXISTS short_description text,
  ADD COLUMN IF NOT EXISTS price_winter integer,
  ADD COLUMN IF NOT EXISTS price_summer integer,
  ADD COLUMN IF NOT EXISTS price_offseason integer,
  ADD COLUMN IF NOT EXISTS min_nights integer DEFAULT 4,
  ADD COLUMN IF NOT EXISTS cleaning_fee integer DEFAULT 240,
  ADD COLUMN IF NOT EXISTS check_in_time text DEFAULT '15:00',
  ADD COLUMN IF NOT EXISTS check_out_time text DEFAULT '10:00',
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

-- 2. Aktualisiere das bestehende Haupthaus mit Slug
UPDATE public.houses 
SET slug = 'haupthaus', 
    short_description = 'Unser gemütliches Haupthaus',
    sort_order = 0
WHERE name = 'Haupthaus';

-- 3. Füge house_id zu gallery_images hinzu
ALTER TABLE public.gallery_images 
  ADD COLUMN IF NOT EXISTS house_id uuid REFERENCES public.houses(id) ON DELETE CASCADE;

-- 4. Verknüpfe bestehende Bilder mit dem Haupthaus
UPDATE public.gallery_images 
SET house_id = (SELECT id FROM public.houses WHERE name = 'Haupthaus' LIMIT 1)
WHERE house_id IS NULL;

-- 5. Erstelle Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_gallery_images_house_id ON public.gallery_images(house_id);
CREATE INDEX IF NOT EXISTS idx_houses_slug ON public.houses(slug);
CREATE INDEX IF NOT EXISTS idx_houses_is_active ON public.houses(is_active);