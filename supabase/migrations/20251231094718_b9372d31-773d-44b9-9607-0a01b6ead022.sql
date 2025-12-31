-- Allow updates to houses table during development
CREATE POLICY "DEV: Anyone can update houses"
ON public.houses FOR UPDATE
USING (true);