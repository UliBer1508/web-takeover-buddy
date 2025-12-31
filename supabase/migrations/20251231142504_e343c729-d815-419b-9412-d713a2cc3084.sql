-- Create promotions table for discounts/promos
CREATE TABLE public.promotions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    house_id uuid REFERENCES public.houses(id) ON DELETE CASCADE,
    name text NOT NULL,
    description_de text NOT NULL,
    description_en text,
    discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value numeric NOT NULL CHECK (discount_value > 0),
    valid_from date NOT NULL,
    valid_until date NOT NULL,
    booking_start date,
    booking_end date,
    min_nights integer DEFAULT 1,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT valid_date_range CHECK (valid_until >= valid_from),
    CONSTRAINT valid_booking_range CHECK (booking_end IS NULL OR booking_start IS NULL OR booking_end >= booking_start)
);

-- Enable RLS
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read active promotions"
ON public.promotions
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can read all promotions"
ON public.promotions
FOR SELECT
USING (is_admin());

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

-- Add promotion tracking to booking_inquiries
ALTER TABLE public.booking_inquiries
ADD COLUMN promotion_id uuid REFERENCES public.promotions(id) ON DELETE SET NULL,
ADD COLUMN discount_amount numeric DEFAULT 0;