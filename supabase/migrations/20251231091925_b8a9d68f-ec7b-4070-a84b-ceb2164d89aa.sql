-- Create reviews table
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  house_id uuid REFERENCES public.houses(id) ON DELETE CASCADE,
  guest_name text NOT NULL,
  review_date date NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text text NOT NULL,
  is_visible boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public read access for visible reviews only
CREATE POLICY "Anyone can read visible reviews"
ON public.reviews FOR SELECT
USING (is_visible = true);

-- Authenticated users can manage all reviews
CREATE POLICY "Authenticated users can insert reviews"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update reviews"
ON public.reviews FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete reviews"
ON public.reviews FOR DELETE
TO authenticated
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_booking_inquiry_updated_at();