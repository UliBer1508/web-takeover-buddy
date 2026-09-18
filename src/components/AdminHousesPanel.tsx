import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  AlertTriangle,
  Plus,
  Pencil,
  EyeOff,
  Image as ImageIcon,
  X,
  Euro,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { toast } from "@/hooks/use-toast";
import { houseColor } from "@/lib/houseColors";
import HouseSettingsDialog from "./HouseSettingsDialog";
import HouseFormDialog, { HouseFormValues } from "./HouseFormDialog";

interface AdminHouse {
  id: string;
  name: string;
  slug: string;
  location: string | null;
  short_description: string | null;
  description: string | null;
  highlights: string[] | null;
  is_active: boolean;
  sort_order: number;
  max_guests: number;
  external_house_id: string | null;
  min_nights: number | null;
  check_in_time: string | null;
  check_out_time: string | null;
  cleaning_fee: number | null;
  service_fee: number | null;
  bed_linen_fee: number | null;
  tourist_tax: number | null;
  price_winter: number | null;
  price_summer: number | null;
  price_offseason: number | null;
}

interface AdminHousesPanelProps {
  /** Haus, dessen Bilder gerade bearbeitet werden (auch wenn ausgeschaltet). */
  vorschauHausId?: string | null;
  onVorschau?: (houseId: string | null, name: string | null) => void;
}

/**
 * Nur fuer Admins sichtbar. Haeuser anlegen, Texte pflegen, Bilder zuordnen und
 * mit einem Schalter fuer Gaeste freischalten. Der Schalter steuert
 * houses.is_active - davon haengt ab, ob ein Haus in der Uebersicht, im
 * Umschalter, in der Galerie, im Kalender und im Formular erscheint.
 */
const AdminHousesPanel = ({ vorschauHausId, onVorschau }: AdminHousesPanelProps) => {
  const { isAdmin, loading } = useAdmin();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [bearbeitet, setBearbeitet] = useState<HouseFormValues | null>(null);

  // Haeuser, die wir angelegt oder ausgeschaltet haben und die danach aus der
  // Liste verschwunden sind - falls die Leserechte nur aktive durchlassen.
  const [verstecktGemerkt, setVerstecktGemerkt] = useState<
    { id: string; name: string }[]
  >([]);

  const { data: houses = [], isLoading } = useQuery({
    queryKey: ["houses-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("houses")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []) as AdminHouse[];
    },
    enabled: isAdmin,
  });

  const wirklichVersteckt = useMemo(
    () => verstecktGemerkt.filter(v => !houses.some(h => h.id === v.id)),
    [verstecktGemerkt, houses]
  );

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from("houses")
        .update({ is_active: isActive })
        .eq("id", id);
      if (error) throw error;
      return { id, isActive };
    },
    onSuccess: ({ isActive }) => {
      queryClient.invalidateQueries({ queryKey: ["houses-all"] });
      queryClient.invalidateQueries({ queryKey: ["houses-active"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
      queryClient.invalidateQueries({ queryKey: ["hero-image"] });
      queryClient.invalidateQueries({ queryKey: ["chalet-cover"] });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast({
        title: isActive ? "Haus ist auf der Website sichtbar" : "Haus ist ausgeblendet",
        description: isActive
          ? "Gäste können es jetzt auswählen und anfragen."
          : "Gäste sehen es nicht mehr. Bestehende Buchungen bleiben unberührt.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Konnte nicht gespeichert werden",
        description: error?.message ?? "Bitte erneut versuchen.",
        variant: "destructive",
      });
    },
  });

  const ausschalten = (house: AdminHouse) => {
    setVerstecktGemerkt(prev =>
      prev.some(v => v.id === house.id) ? prev : [...prev, { id: house.id, name: house.name }]
    );
    toggleMutation.mutate({ id: house.id, isActive: false });
  };

  const bilderPflegen = (house: AdminHouse) => {
    onVorschau?.(house.id, house.name);
    setTimeout(() => {
      document.getElementById("galerie")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const bearbeiten = (house: AdminHouse) => {
    setBearbeitet({
      id: house.id,
      name: house.name,
      slug: house.slug,
      location: house.location,
      short_description: house.short_description,
      description: house.description,
      highlights: house.highlights,
      max_guests: house.max_guests,
      external_house_id: house.external_house_id,
      sort_order: house.sort_order,
    });
    setFormOpen(true);
  };

  if (loading || !isAdmin) return null;

  const aktiveAnzahl = houses.filter(h => h.is_active).length;
  const naechsteReihenfolge =
    houses.length > 0 ? Math.max(...houses.map(h => h.sort_order ?? 0)) + 1 : 1;
  const vorschauHaus = houses.find(h => h.id === vorschauHausId);

  return (
    <section id="admin-haeuser" className="border-y bg-muted/40">
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <h2 className="text-lg font-semibold">Häuser auf der Website</h2>
            <p className="text-sm text-muted-foreground">
              Nur für Admins sichtbar. {aktiveAnzahl} von {houses.length} freigeschaltet.
            </p>
          </div>
          <Button
            onClick={() => {
              setBearbeitet(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Haus anlegen
          </Button>
        </div>

        {vorschauHaus && (
          <div className="mb-3 flex flex-wrap items-center gap-3 rounded-lg border border-blue-300 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-800 px-3 py-2.5">
            <ImageIcon className="h-4 w-4 text-blue-700 dark:text-blue-400 shrink-0" />
            <p className="flex-grow min-w-[12rem] text-xs leading-relaxed text-blue-900 dark:text-blue-200">
              Du bearbeitest gerade die Bilder von <strong>{vorschauHaus.name}</strong>.
              Titelbild und Galerie unten zeigen dieses Haus — Gäste sehen davon nichts.
            </p>
            <Button size="sm" variant="outline" onClick={() => onVorschau?.(null, null)}>
              <X className="h-4 w-4 mr-1" />
              Beenden
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-6">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Häuser werden geladen…</span>
          </div>
        ) : (
          <div className="rounded-xl border bg-background divide-y">
            {houses.map((house, index) => {
              const kalenderFehlt = !house.external_house_id;
              const textFehlt = !house.description;
              const istVorschau = house.id === vorschauHausId;
              return (
                <div
                  key={house.id}
                  className={`flex flex-wrap items-center gap-2 px-4 py-4 ${istVorschau ? "bg-blue-50/60 dark:bg-blue-950/20" : ""}`}
                >
                  <span
                    aria-hidden="true"
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: houseColor(index) }}
                  />
                  <div className="flex-grow min-w-[10rem]">
                    <div className="font-semibold">{house.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {house.is_active ? "sichtbar und buchbar" : "ausgeblendet"}
                      {" · "}
                      {house.max_guests} Gäste
                      {kalenderFehlt && (
                        <span className="text-amber-700 dark:text-amber-500">
                          {" · kein Kalender"}
                        </span>
                      )}
                      {textFehlt && (
                        <span className="text-amber-700 dark:text-amber-500">
                          {" · keine Beschreibung"}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant={istVorschau ? "default" : "outline"}
                    size="sm"
                    onClick={() => (istVorschau ? onVorschau?.(null, null) : bilderPflegen(house))}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Bilder
                  </Button>

                  <Button variant="outline" size="sm" onClick={() => bearbeiten(house)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Texte &amp; Kalender
                  </Button>

                  <HouseSettingsDialog
                    house={house}
                    trigger={
                      <Button variant="outline" size="sm">
                        <Euro className="h-4 w-4 mr-2" />
                        Preise
                      </Button>
                    }
                  />

                  <Switch
                    checked={house.is_active}
                    disabled={toggleMutation.isPending}
                    onCheckedChange={checked =>
                      checked
                        ? toggleMutation.mutate({ id: house.id, isActive: true })
                        : ausschalten(house)
                    }
                    aria-label={`${house.name} auf der Website anzeigen`}
                  />
                </div>
              );
            })}
          </div>
        )}

        {wirklichVersteckt.length > 0 && (
          <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800 px-4 py-3">
            <div className="flex items-start gap-2 mb-3">
              <EyeOff className="h-4 w-4 text-amber-700 dark:text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200">
                Diese Häuser sind ausgeschaltet und werden von der Datenbank nicht mehr
                zurückgegeben. Solange diese Seite offen bleibt, kannst du sie hier wieder
                einschalten.
              </p>
            </div>
            <div className="space-y-2">
              {wirklichVersteckt.map(v => (
                <div
                  key={v.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg bg-background border px-3 py-2"
                >
                  <span className="flex-grow text-sm font-medium">{v.name}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={toggleMutation.isPending}
                    onClick={() => toggleMutation.mutate({ id: v.id, isActive: true })}
                  >
                    Wieder einschalten
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {houses.some(h => h.is_active && !h.external_house_id) && (
          <div className="mt-3 flex gap-2 items-start rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800 px-3 py-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-700 dark:text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200">
              Ein freigeschaltetes Haus ohne Kalender-Verknüpfung zeigt Gästen einen
              leeren Verfügbarkeitskalender — jeder Zeitraum wirkt frei.
            </p>
          </div>
        )}
      </div>

      <HouseFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        house={bearbeitet}
        naechsteReihenfolge={naechsteReihenfolge}
        onCreated={(id, name) =>
          setVerstecktGemerkt(prev =>
            prev.some(v => v.id === id) ? prev : [...prev, { id, name }]
          )
        }
      />
    </section>
  );
};

export default AdminHousesPanel;
