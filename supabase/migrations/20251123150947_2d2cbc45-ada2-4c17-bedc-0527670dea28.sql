-- Create booking inquiries table for guest booking requests
CREATE TABLE booking_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  house_id UUID NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  check_in TIMESTAMP WITH TIME ZONE NOT NULL,
  check_out TIMESTAMP WITH TIME ZONE NOT NULL,
  number_of_guests INTEGER NOT NULL CHECK (number_of_guests >= 1 AND number_of_guests <= 6),
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'confirmed', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_booking_inquiries_house_id ON booking_inquiries(house_id);
CREATE INDEX idx_booking_inquiries_status ON booking_inquiries(status);
CREATE INDEX idx_booking_inquiries_created_at ON booking_inquiries(created_at DESC);
CREATE INDEX idx_booking_inquiries_check_in ON booking_inquiries(check_in);

-- Enable Row Level Security
ALTER TABLE booking_inquiries ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert booking inquiries (public form submission)
CREATE POLICY "Anyone can insert booking inquiries"
  ON booking_inquiries
  FOR INSERT
  WITH CHECK (true);

-- Policy: Authenticated users can read all booking inquiries (for management app)
CREATE POLICY "Authenticated users can read booking inquiries"
  ON booking_inquiries
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can update booking inquiries (status changes in management app)
CREATE POLICY "Authenticated users can update booking inquiries"
  ON booking_inquiries
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_booking_inquiry_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function on update
CREATE TRIGGER set_booking_inquiry_updated_at
  BEFORE UPDATE ON booking_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_booking_inquiry_updated_at();