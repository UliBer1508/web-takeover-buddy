-- =============================================
-- SCHRITT 1: Lookup-Tabellen erstellen
-- =============================================

-- 1.1 Tabelle für Kategorien
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 1.2 Tabelle für Jahreszeiten
CREATE TABLE public.seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

-- Standardwerte für Jahreszeiten einfügen
INSERT INTO public.seasons (name, display_name, sort_order) VALUES
  ('all', 'Ganzjährig', 0),
  ('spring', 'Frühling', 1),
  ('summer', 'Sommer', 2),
  ('autumn', 'Herbst', 3),
  ('winter', 'Winter', 4);

-- 1.3 Tabelle für Buchungsstatus
CREATE TABLE public.booking_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

-- Standardwerte für Status einfügen
INSERT INTO public.booking_statuses (name, display_name, sort_order) VALUES
  ('pending', 'Ausstehend', 0),
  ('confirmed', 'Bestätigt', 1),
  ('cancelled', 'Storniert', 2);

-- 1.4 Tabelle für Ferienhäuser
CREATE TABLE public.houses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  max_guests integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Standardhaus einfügen
INSERT INTO public.houses (id, name, max_guests) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Haupthaus', 10);

-- =============================================
-- SCHRITT 2: Bestehende Kategorien migrieren
-- =============================================

INSERT INTO public.categories (name, display_name)
SELECT DISTINCT category, category 
FROM public.gallery_images
WHERE category IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- SCHRITT 3: gallery_images umstrukturieren
-- =============================================

-- Neue FK-Spalten hinzufügen
ALTER TABLE public.gallery_images 
  ADD COLUMN category_id uuid,
  ADD COLUMN season_id uuid;

-- Daten migrieren: category -> category_id
UPDATE public.gallery_images gi
SET category_id = c.id
FROM public.categories c
WHERE gi.category = c.name;

-- Alle Bilder auf season 'all' setzen (da keine season-Spalte existierte)
UPDATE public.gallery_images
SET season_id = (SELECT id FROM public.seasons WHERE name = 'all');

-- FK-Constraints hinzufügen
ALTER TABLE public.gallery_images
  ADD CONSTRAINT fk_gallery_category 
    FOREIGN KEY (category_id) REFERENCES public.categories(id),
  ADD CONSTRAINT fk_gallery_season 
    FOREIGN KEY (season_id) REFERENCES public.seasons(id);

-- NOT NULL setzen
ALTER TABLE public.gallery_images
  ALTER COLUMN category_id SET NOT NULL,
  ALTER COLUMN season_id SET NOT NULL;

-- Alte Text-Spalte entfernen
ALTER TABLE public.gallery_images 
  DROP COLUMN category;

-- =============================================
-- SCHRITT 4: booking_inquiries umstrukturieren
-- =============================================

-- Status-FK hinzufügen
ALTER TABLE public.booking_inquiries 
  ADD COLUMN status_id uuid;

-- Daten migrieren: status -> status_id
UPDATE public.booking_inquiries bi
SET status_id = bs.id
FROM public.booking_statuses bs
WHERE bi.status = bs.name;

-- Falls status_id noch NULL, auf 'pending' setzen
UPDATE public.booking_inquiries
SET status_id = (SELECT id FROM public.booking_statuses WHERE name = 'pending')
WHERE status_id IS NULL;

-- FK-Constraint für house_id und status_id hinzufügen
ALTER TABLE public.booking_inquiries
  ADD CONSTRAINT fk_booking_status 
    FOREIGN KEY (status_id) REFERENCES public.booking_statuses(id),
  ADD CONSTRAINT fk_booking_house 
    FOREIGN KEY (house_id) REFERENCES public.houses(id);

-- NOT NULL für status_id setzen
ALTER TABLE public.booking_inquiries
  ALTER COLUMN status_id SET NOT NULL;

-- Alte Text-Spalte entfernen
ALTER TABLE public.booking_inquiries 
  DROP COLUMN status;

-- =============================================
-- SCHRITT 5: RLS-Policies für neue Tabellen
-- =============================================

-- Categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read categories" ON public.categories
  FOR SELECT USING (true);

-- Seasons
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read seasons" ON public.seasons
  FOR SELECT USING (true);

-- Booking Statuses
ALTER TABLE public.booking_statuses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read booking_statuses" ON public.booking_statuses
  FOR SELECT USING (true);

-- Houses
ALTER TABLE public.houses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read houses" ON public.houses
  FOR SELECT USING (true);