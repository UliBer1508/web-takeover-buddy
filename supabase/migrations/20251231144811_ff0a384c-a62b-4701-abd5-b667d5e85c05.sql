-- Bestehende RESTRICTIVE INSERT/UPDATE/DELETE-Policies löschen
DROP POLICY IF EXISTS "Admins can insert promotions" ON public.promotions;
DROP POLICY IF EXISTS "Admins can update promotions" ON public.promotions;
DROP POLICY IF EXISTS "Admins can delete promotions" ON public.promotions;

-- Neue PERMISSIVE Policies erstellen
CREATE POLICY "Admins can insert promotions"
  ON public.promotions
  FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update promotions"
  ON public.promotions
  FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete promotions"
  ON public.promotions
  FOR DELETE
  USING (is_admin());