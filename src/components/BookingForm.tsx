import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, Users, Mail, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Chalet Venedigersiedlung house ID
const HOUSE_ID = "f5b4588b-96cf-46f7-b84a-5f6750f7088e";

const bookingSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein").max(100, "Name zu lang"),
  email: z.string().email("Ungültige E-Mail-Adresse").max(255, "E-Mail zu lang"),
  phone: z.string().min(10, "Bitte geben Sie eine gültige Telefonnummer ein").max(20, "Telefonnummer zu lang"),
  checkIn: z.string().min(1, "Check-in Datum erforderlich"),
  checkOut: z.string().min(1, "Check-out Datum erforderlich"),
  guests: z.string().refine((val) => {
    const num = parseInt(val);
    return num >= 1 && num <= 6;
  }, "Anzahl Gäste muss zwischen 1 und 6 liegen"),
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
const BookingForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);

    try {
      // Convert date strings to ISO timestamps
      const checkInDate = new Date(data.checkIn);
      const checkOutDate = new Date(data.checkOut);

      // Insert booking inquiry into database
      const { error } = await supabase
        .from('booking_inquiries')
        .insert({
          house_id: HOUSE_ID,
          guest_name: data.name.trim(),
          guest_email: data.email.trim().toLowerCase(),
          guest_phone: data.phone.trim(),
          check_in: checkInDate.toISOString(),
          check_out: checkOutDate.toISOString(),
          number_of_guests: parseInt(data.guests),
          message: data.message?.trim() || null,
          status: 'pending'
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
  return <section id="booking" className="py-16 md:py-24 bg-background">
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
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Ihr Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="email" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>E-Mail</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="ihre@email.com" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>

                  <FormField control={form.control} name="phone" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Telefon</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="+49 123 456789" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

                  <div className="grid sm:grid-cols-3 gap-4">
                    <FormField control={form.control} name="checkIn" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Check-in</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input type="date" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="checkOut" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Check-out</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input type="date" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="guests" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Gäste</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <Users className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Anzahl" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6].map(num => <SelectItem key={num} value={num.toString()}>
                                  {num} {num === 1 ? "Gast" : "Gäste"}
                                </SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>} />
                  </div>

                  <FormField control={form.control} name="message" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Nachricht (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea placeholder="Besondere Wünsche oder Fragen..." className="pl-10 min-h-[100px]" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />

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
              <CardHeader>
                <CardTitle className="text-xl">Preise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Winter (Dez-März)</span>
                  <span className="font-semibold">ab 450€ / Nacht</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sommer (Jun-Sep)</span>
                  <span className="font-semibold">ab 380€ / Nacht</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nebensaison</span>
                  <span className="font-semibold">ab 320€ / Nacht</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Wichtige Infos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Mindestaufenthalt: 4 Nächte</p>
                <p>✓ Check-in: ab 15:00 Uhr</p>
                <p>✓ Check-out: bis 10:00 Uhr</p>
                <p>✓ Endreinigung: 240€</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>;
};
export default BookingForm;