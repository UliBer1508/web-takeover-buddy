import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const settingsSchema = z.object({
  min_nights: z.coerce.number().min(1, "Mindestens 1 Nacht").max(30, "Maximal 30 Nächte"),
  check_in_time: z.string().min(1, "Check-in Zeit erforderlich"),
  check_out_time: z.string().min(1, "Check-out Zeit erforderlich"),
  cleaning_fee: z.coerce.number().min(0, "Muss positiv sein"),
  service_fee: z.coerce.number().min(0, "Muss positiv sein"),
  bed_linen_fee: z.coerce.number().min(0, "Muss positiv sein"),
  tourist_tax: z.coerce.number().min(0, "Muss positiv sein"),
  price_winter: z.coerce.number().min(0, "Muss positiv sein"),
  price_summer: z.coerce.number().min(0, "Muss positiv sein"),
  price_offseason: z.coerce.number().min(0, "Muss positiv sein"),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface House {
  id: string;
  name: string;
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

interface HouseSettingsDialogProps {
  house: House;
  trigger?: React.ReactNode;
}

const HouseSettingsDialog = ({ house, trigger }: HouseSettingsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      min_nights: house.min_nights ?? 4,
      check_in_time: house.check_in_time ?? "15:00",
      check_out_time: house.check_out_time ?? "10:00",
      cleaning_fee: house.cleaning_fee ?? 240,
      service_fee: house.service_fee ?? 0,
      bed_linen_fee: house.bed_linen_fee ?? 0,
      tourist_tax: house.tourist_tax ?? 0,
      price_winter: house.price_winter ?? 450,
      price_summer: house.price_summer ?? 380,
      price_offseason: house.price_offseason ?? 320,
    },
  });

  // Reset form when house changes
  useEffect(() => {
    form.reset({
      min_nights: house.min_nights ?? 4,
      check_in_time: house.check_in_time ?? "15:00",
      check_out_time: house.check_out_time ?? "10:00",
      cleaning_fee: house.cleaning_fee ?? 240,
      service_fee: house.service_fee ?? 0,
      bed_linen_fee: house.bed_linen_fee ?? 0,
      tourist_tax: house.tourist_tax ?? 0,
      price_winter: house.price_winter ?? 450,
      price_summer: house.price_summer ?? 380,
      price_offseason: house.price_offseason ?? 320,
    });
  }, [house, form]);

  const onSubmit = async (data: SettingsFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('houses')
        .update({
          min_nights: data.min_nights,
          check_in_time: data.check_in_time,
          check_out_time: data.check_out_time,
          cleaning_fee: data.cleaning_fee,
          service_fee: data.service_fee,
          bed_linen_fee: data.bed_linen_fee,
          tourist_tax: data.tourist_tax,
          price_winter: data.price_winter,
          price_summer: data.price_summer,
          price_offseason: data.price_offseason,
        })
        .eq('id', house.id);

      if (error) throw error;

      toast({
        title: "Einstellungen gespeichert ✓",
        description: "Die Hauseinstellungen wurden aktualisiert.",
      });

      queryClient.invalidateQueries({ queryKey: ['houses-active'] });
      setOpen(false);
    } catch (error: any) {
      console.error("Update error:", error);
      toast({
        title: "Fehler beim Speichern",
        description: error.message || "Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hauseinstellungen bearbeiten</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="min_nights"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mindestaufenthalt (Nächte)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cleaning_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endreinigung (€)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Nebenkosten</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="service_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Servicegebühr (€)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bed_linen_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bettwäsche (€/Person)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tourist_tax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kurtaxe (€/Person/Nacht)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="check_in_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-in Zeit</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="check_out_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-out Zeit</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Preise pro Nacht</h4>
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="price_winter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Winter (€)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price_summer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Sommer (€)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price_offseason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Nebensaison (€)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Abbrechen
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Speichern..." : "Speichern"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default HouseSettingsDialog;
