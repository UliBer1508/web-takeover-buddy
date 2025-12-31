import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, Users, Mail, Phone, MessageSquare, Pencil } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { externalSupabase } from "@/integrations/external-supabase/client";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import HouseSettingsDialog from "@/components/HouseSettingsDialog";

// Default house ID (will be replaced by actual house from database)
const DEFAULT_HOUSE_ID = "00000000-0000-0000-0000-000000000001";

// Development mode - set to false when auth is implemented
const DEV_MODE = true;

const bookingSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein").max(100, "Name zu lang"),
  email: z.string().email("Ungültige E-Mail-Adresse").max(255, "E-Mail zu lang"),
  phone: z.string().min(10, "Bitte geben Sie eine gültige Telefonnummer ein").max(20, "Telefonnummer zu lang"),
  checkIn: z.string().min(1, "Check-in Datum erforderlich"),
  checkOut: z.string().min(1, "Check-out Datum erforderlich"),
  guests: z.string().refine((val) => {
    const num = parseInt(val);
    return num >= 1 && num <= 10;
  }, "Anzahl Gäste muss zwischen 1 und 10 liegen"),
  message: z.string().max(1000, "Nachricht zu lang").optional()
}).refine((data) => {
  const checkIn = new Date(data.checkIn);
  const checkOut = new Date(data.checkOut);
  return checkOut > checkIn;
}, {
  message: "Abreisedatum muss nach dem Anreisedatum liegen",
  path: ["checkOut"]
}).refine((data) => {
  const checkIn = new Date(data.checkIn);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return checkIn >= today;
}, {
  message: "Anreisedatum muss heute oder in der Zukunft liegen",
  path: ["checkIn"]
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  initialCheckIn?: Date | null;
  initialCheckOut?: Date | null;
  defaultHouseId?: string | null;
}

interface House {
  id: string;
  name: string;
  max_guests: number;
  is_active?: boolean;
  min_nights?: number | null;
  check_in_time?: string | null;
  check_out_time?: string | null;
  cleaning_fee?: number | null;
  service_fee?: number | null;
  bed_linen_fee?: number | null;
  tourist_tax?: number | null;
  price_winter?: number | null;
  price_summer?: number | null;
  price_offseason?: number | null;
}

interface BookingStatus {
  id: string;
  name: string;
  display_name: string;
}

const BookingForm = ({ initialCheckIn, initialCheckOut, defaultHouseId }: BookingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();
  const canEdit = DEV_MODE || isAuthenticated;
  
  // Fetch houses from database
  const { data: houses = [] } = useQuery({
    queryKey: ['houses-active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as House[];
    },
  });

  // Fetch booking statuses to get "pending" status ID
  const { data: statuses = [] } = useQuery({
    queryKey: ['booking-statuses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_statuses')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as BookingStatus[];
    },
  });

  // Get house from defaultHouseId prop, or use first house
  const selectedHouse = defaultHouseId 
    ? houses.find(h => h.id === defaultHouseId) || houses[0]
    : houses[0];
  const maxGuests = selectedHouse?.max_guests || 10;
  const pendingStatusId = statuses.find(s => s.name === 'pending')?.id;

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      checkIn: "",
      checkOut: "",
      guests: "",
      message: ""
    }
  });

  // Auto-fill form when dates are selected from calendar
  useEffect(() => {
    if (initialCheckIn) {
      form.setValue('checkIn', format(initialCheckIn, 'yyyy-MM-dd'));
    }
    if (initialCheckOut) {
      form.setValue('checkOut', format(initialCheckOut, 'yyyy-MM-dd'));
    }
  }, [initialCheckIn, initialCheckOut, form]);

  const onSubmit = async (data: BookingFormData) => {
    if (!pendingStatusId) {
      toast({
        title: "Fehler",
        description: "Status konnte nicht geladen werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert date strings to ISO timestamps
      const checkInDate = new Date(data.checkIn);
      const checkOutDate = new Date(data.checkOut);

      // Insert booking inquiry into database with foreign keys
      const { error } = await supabase
        .from('booking_inquiries')
        .insert({
          house_id: selectedHouse?.id || DEFAULT_HOUSE_ID,
          guest_name: data.name.trim(),
          guest_email: data.email.trim().toLowerCase(),
          guest_phone: data.phone.trim(),
          check_in: checkInDate.toISOString(),
          check_out: checkOutDate.toISOString(),
          number_of_guests: parseInt(data.guests),
          message: data.message?.trim() || null,
          status_id: pendingStatusId
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Anfrage erfolgreich gesendet! ✓",
        description: "Vielen Dank! Wir werden uns in Kürze bei Ihnen melden."
      });
      
      form.reset();
    } catch (error: any) {
      console.error("Booking inquiry error:", error);
      toast({
        title: "Fehler beim Senden",
        description: error.message || "Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Buchungsanfrage
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Senden Sie uns Ihre Anfrage und wir melden uns umgehend bei Ihnen
            </p>
          </div>

          <Card className="shadow-xl animate-scale-in">
            <CardHeader>
              <CardTitle>Verfügbarkeit anfragen</CardTitle>
              <CardDescription>
                Füllen Sie das Formular aus und wir prüfen die Verfügbarkeit für Ihren Wunschtermin
                {selectedHouse && <span className="block mt-1">Objekt: {selectedHouse.name}</span>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Ihr Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-Mail</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="ihre@email.com" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="+49 123 456789" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid sm:grid-cols-3 gap-4">
                    <FormField control={form.control} name="checkIn" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Check-in</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="date" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        {initialCheckIn && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            ✓ Vom Kalender übernommen
                          </Badge>
                        )}
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="checkOut" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Check-out</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="date" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        {initialCheckOut && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            ✓ Vom Kalender übernommen
                          </Badge>
                        )}
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="guests" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gäste</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <Users className="h-4 w-4 mr-2" />
                              <SelectValue placeholder="Anzahl" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: maxGuests }, (_, i) => i + 1).map(num => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? "Gast" : "Gäste"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nachricht (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Textarea placeholder="Besondere Wünsche oder Fragen..." className="pl-10 min-h-[100px]" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                    {isSubmitting ? "Wird gesendet..." : "Anfrage senden"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Pricing Info */}
          <div className="mt-12 grid sm:grid-cols-2 gap-6 animate-fade-in-up">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl">Preise</CardTitle>
                {canEdit && selectedHouse && (
                  <HouseSettingsDialog house={selectedHouse} />
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Winter (Dez-März)</span>
                  <span className="font-semibold">ab {selectedHouse?.price_winter ?? 450}€ / Nacht</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sommer (Jun-Sep)</span>
                  <span className="font-semibold">ab {selectedHouse?.price_summer ?? 380}€ / Nacht</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nebensaison</span>
                  <span className="font-semibold">ab {selectedHouse?.price_offseason ?? 320}€ / Nacht</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl">Wichtige Infos</CardTitle>
                {canEdit && selectedHouse && (
                  <HouseSettingsDialog house={selectedHouse} />
                )}
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Mindestaufenthalt: {selectedHouse?.min_nights ?? 4} Nächte</p>
                <p>✓ Check-in: ab {selectedHouse?.check_in_time ?? "15:00"} Uhr</p>
                <p>✓ Check-out: bis {selectedHouse?.check_out_time ?? "10:00"} Uhr</p>
                <p>✓ Endreinigung: {selectedHouse?.cleaning_fee ?? 240}€</p>
                {(selectedHouse?.service_fee ?? 0) > 0 && (
                  <p>✓ Servicegebühr: {selectedHouse?.service_fee}€</p>
                )}
                {(selectedHouse?.bed_linen_fee ?? 0) > 0 && (
                  <p>✓ Bettwäsche: {selectedHouse?.bed_linen_fee}€ pro Buchung</p>
                )}
                {(selectedHouse?.tourist_tax ?? 0) > 0 && (
                  <p>✓ Kurtaxe: {selectedHouse?.tourist_tax?.toFixed(2).replace('.', ',')}€ pro Person und Nacht</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
