-- Entferne bestehende restriktive RLS-Policies
DROP POLICY IF EXISTS "Anyone can read visible reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can update reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can delete reviews" ON public.reviews;

-- Erstelle offene Entwicklungs-Policies
CREATE POLICY "DEV: Anyone can read all reviews"
ON public.reviews FOR SELECT
USING (true);

CREATE POLICY "DEV: Anyone can insert reviews"
ON public.reviews FOR INSERT
WITH CHECK (true);

CREATE POLICY "DEV: Anyone can update reviews"
ON public.reviews FOR UPDATE
USING (true);

CREATE POLICY "DEV: Anyone can delete reviews"
ON public.reviews FOR DELETE
USING (true);