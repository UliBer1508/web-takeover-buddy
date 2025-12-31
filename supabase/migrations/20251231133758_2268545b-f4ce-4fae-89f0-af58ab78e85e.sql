-- Rollen-Enum erstellen
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Rollen-Tabelle erstellen
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, role)
);

-- RLS aktivieren
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security Definer Funktion für Rollen-Check
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Admin-Check Funktion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
$$;

-- RLS Policy für user_roles: Nur Admins können lesen
CREATE POLICY "Admins can read user_roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Alte DEV Policies für reviews entfernen und neue erstellen
DROP POLICY IF EXISTS "DEV: Anyone can delete reviews" ON public.reviews;
DROP POLICY IF EXISTS "DEV: Anyone can insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "DEV: Anyone can read all reviews" ON public.reviews;
DROP POLICY IF EXISTS "DEV: Anyone can update reviews" ON public.reviews;

-- Reviews: Alle können sichtbare lesen
CREATE POLICY "Anyone can read visible reviews"
ON public.reviews
FOR SELECT
USING (is_visible = true);

-- Reviews: Alle können hinzufügen
CREATE POLICY "Anyone can insert reviews"
ON public.reviews
FOR INSERT
WITH CHECK (true);

-- Reviews: Nur Admins können bearbeiten
CREATE POLICY "Admins can update reviews"
ON public.reviews
FOR UPDATE
TO authenticated
USING (public.is_admin());

-- Reviews: Nur Admins können löschen
CREATE POLICY "Admins can delete reviews"
ON public.reviews
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Admins können auch unsichtbare Reviews lesen
CREATE POLICY "Admins can read all reviews"
ON public.reviews
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Alte DEV Policy für houses entfernen und neue erstellen
DROP POLICY IF EXISTS "DEV: Anyone can update houses" ON public.houses;

-- Houses: Nur Admins können updaten
CREATE POLICY "Admins can update houses"
ON public.houses
FOR UPDATE
TO authenticated
USING (public.is_admin());

-- Alte Policies für gallery_images entfernen und neue erstellen
DROP POLICY IF EXISTS "Anyone can delete gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Anyone can insert gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Anyone can update gallery images" ON public.gallery_images;

-- Gallery: Nur Admins können einfügen
CREATE POLICY "Admins can insert gallery images"
ON public.gallery_images
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- Gallery: Nur Admins können updaten
CREATE POLICY "Admins can update gallery images"
ON public.gallery_images
FOR UPDATE
TO authenticated
USING (public.is_admin());

-- Gallery: Nur Admins können löschen
CREATE POLICY "Admins can delete gallery images"
ON public.gallery_images
FOR DELETE
TO authenticated
USING (public.is_admin());