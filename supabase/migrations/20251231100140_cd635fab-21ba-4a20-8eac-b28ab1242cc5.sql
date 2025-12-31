-- Add column for number of children (bis 6 Jahre)
ALTER TABLE public.booking_inquiries 
ADD COLUMN number_of_children integer NOT NULL DEFAULT 0;

-- Add comment for clarity
COMMENT ON COLUMN public.booking_inquiries.number_of_children IS 'Anzahl Kinder bis 6 Jahre';