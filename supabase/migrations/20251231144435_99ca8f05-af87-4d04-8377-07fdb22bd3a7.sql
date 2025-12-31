-- Bestehende RESTRICTIVE SELECT-Policies löschen
DROP POLICY IF EXISTS "Anyone can read active promotions" ON public.promotions;
DROP POLICY IF EXISTS "Admins can read all promotions" ON public.promotions;

-- Neue PERMISSIVE SELECT-Policies erstellen (Standard ist PERMISSIVE)
CREATE POLICY "Anyone can read active promotions"
  ON public.promotions
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can read all promotions"
  ON public.promotions
  FOR SELECT
  USING (is_admin());