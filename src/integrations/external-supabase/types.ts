// booking_inquiries Tabelle (neue Website-Anfragen)
export interface BookingInquiry {
  id: string;
  house_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  number_of_guests: number;
  number_of_adults?: number;
  number_of_children?: number;
  estimated_amount?: number | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'rejected';
  message?: string | null;
  created_at: string;
  updated_at: string;
}

// bookings Tabelle (bestätigte Buchungen)
export interface Booking {
  id: string;
  house_id: string;
  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  check_in: string;
  check_out: string;
  number_of_guests: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string | null;
  platform?: string | null;
  booking_amount?: number | null;
  currency?: string | null;
  created_at: string;
  updated_at: string;
}
