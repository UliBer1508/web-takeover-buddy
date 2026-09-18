import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export interface HouseFormValues {
  id?: string;
  name: string;
  slug: string;
  short_description: string | null;
  max_guests: number;
  external_house_id: string | null;
  sort_order: number;
}

interface HouseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Ohne Haus = neues Haus anlegen. */
  house?: HouseFormValues | null;
  /** Vorschlag für die Reihenfolge beim Anlegen. */
  naechsteReihenfolge?: number;
  /** Bekommt die id des neu angelegten Hauses. */
  onCreated?: (id: string, name: string) => void;
}

// Aus dem Namen einen Slug bauen: Kleinbuchstaben, Umlaute aufgelöst,
// alles andere zu Bindestrichen.
const slugAusName = (name: string) =>
  name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const UUID_MUSTER = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const HouseFormDialog = ({
  open,
  onOpenChange,
  house,
  naechsteReihenfolge = 1,
  onCreated,
}: HouseFormDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const istNeu = !house?.id;

  const schema = z.object({
    name: z.string().trim().min(2, "Name ist zu kurz").max(80, "Name ist zu lang"),
    slug: z
      .string()
      .trim()
      .min(2, "Kürzel ist zu kurz")
      .regex(/^[a-z0-9-]+$/, "Nur Kleinbuchstaben, Ziffern und Bindestriche"),
    short_description: z.string().trim().max(300, "Höchstens 300 Zeichen").optional(),
    max_guests: z.coerce.number().min(1, "Mindestens 1").max(30, "Höchstens 30"),
    external_house_id: z
      .string()
      .trim()
      .refine(v => v === "" || UUID_MUSTER.test(v), "Muss eine UUID sein oder leer bleiben"),
    sort_order: z.coerce.number().min(0),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: house?.name ?? "",
      slug: house?.slug ?? "",
      short_description: house?.short_description ?? "",
      max_guests: house?.max_guests ?? 6,
      external_house_id: house?.external_house_id ?? "",
      sort_order: house?.sort_order ?? naechsteReihenfolge,
    },
  });

  useEffect(() => {
    form.reset({
      name: house?.name ?? "",
      slug: house?.slug ?? "",
      short_description: house?.short_description ?? "",
      max_guests: house?.max_guests ?? 6,
      external_house_id: house?.external_house_id ?? "",
      sort_order: house?.sort_order ?? naechsteReihenfolge,
    });
  }, [house, naechsteReihenfolge, open, form]);

  // Beim Anlegen das Kürzel aus dem Namen vorschlagen, solange es niemand
  // von Hand geändert hat.
  const nameWert = form.watch("name");
  useEffect(() => {
    if (!istNeu) return;
    if (form.formState.dirtyFields.slug) return;
    form.setValue("slug", slugAusName(nameWert || ""));
  }, [nameWert, istNeu, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const werte = {
        name: data.name,
        slug: data.slug,
        short_description: data.short_description?.trim() || null,
        max_guests: data.max_guests,
        external_house_id: data.external_house_id.trim() || null,
        sort_order: data.sort_order,
      };

      if (istNeu) {
        // Neue Häuser entstehen ausgeschaltet. Freigeschaltet wird über den
        // Schalter, erst wenn Bilder und Preise stehen.
        const { data: angelegt, error } = await supabase
          .from("houses")
          .insert({ ...werte, is_active: false })
          .select("id, name")
          .single();

        if (error) throw error;

        toast({
          title: "Haus angelegt",
          description: `${werte.name} ist noch ausgeschaltet und für Gäste unsichtbar.`,
        });
        if (angelegt?.id) onCreated?.(angelegt.id, angelegt.name);
      } else {
        const { error } = await supabase
          .from("houses")
          .update(werte)
          .eq("id", house!.id!);

        if (error) throw error;

        toast({
          title: "Gespeichert",
          description: `${werte.name} wurde aktualisiert.`,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["houses-all"] });
      queryClient.invalidateQueries({ queryKey: ["houses-active"] });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      onOpenChange(false);
    } catch (error: any) {
      console.error("Haus speichern:", error);
      toast({
        title: "Konnte nicht gespeichert werden",
        // Die echte Meldung der Datenbank zeigen — bei fehlenden Pflichtfeldern
        // oder Rechteproblemen steht dort der Grund im Klartext.
        description: error?.message ?? "Unbekannter Fehler.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{istNeu ? "Haus anlegen" : "Haus bearbeiten"}</DialogTitle>
          <DialogDescription>
            {istNeu
              ? "Das Haus wird zunächst ausgeschaltet angelegt und ist für Gäste nicht sichtbar."
              : "Name, Kürzel und Kalender-Verknüpfung. Preise und Gebühren stehen in den Einstellungen."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Wald Chalet" {...field} />
                  </FormControl>
                  <FormDescription>So steht es im Umschalter und in der Überschrift.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kürzel</FormLabel>
                  <FormControl>
                    <Input placeholder="wald" {...field} />
                  </FormControl>
                  <FormDescription>Nur Kleinbuchstaben, Ziffern und Bindestriche.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="short_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kurztext</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={2}
                      placeholder="Wald im Pinzgau · 6 Gäste · Sauna"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>Erscheint unter dem Namen im Titelbild.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="max_guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gäste maximal</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sort_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reihenfolge</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormDescription>Kleinere Zahl steht links.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="external_house_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kalender-Verknüpfung</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="a2b4d1f7-f396-40a5-b83f-174ccafa55fd"
                      className="font-mono text-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Die house_id aus der Hausverwaltung. Ohne sie bleibt der
                    Verfügbarkeitskalender leer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Abbrechen
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Speichert…" : istNeu ? "Anlegen" : "Speichern"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default HouseFormDialog;
