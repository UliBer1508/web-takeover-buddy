import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader2, AlertTriangle, Plus, Pencil, EyeOff, Image as ImageIcon, X, Euro, LayoutGrid, MapPin, Link2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { toast } from "@/hooks/use-toast";
import { houseColor } from "@/lib/houseColors";
import HouseSettingsDialog from "./HouseSettingsDialog";
import HouseFormDialog, { HouseFormValues } from "./HouseFormDialog";
import HouseFeaturesDialog from "./HouseFeaturesDialog";
import HouseDirectionsDialog from "./HouseDirectionsDialog";

interface AdminHouse {
  id: string;
  name: string;
  slug: string;
  location: string | null;
  short_description: string | null;
  description: string | null;
  highlights: string[] | null;
  bedrooms: number | null;
  bathrooms: number | null;
  square_meters: number | null;
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
  vorschauHausId?: string | null;
  onVorschau?: (houseId: string | null, name: string | null) => void;
}

const AdminHousesPanel = ({ vorschauHausId, onVorschau }: AdminHousesPanelProps) => {
  const { isAdmin, loading } = useAdmin();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [bearbeitet, setBearbeitet] = useState<HouseFormValues | null>(null);
  const [kachelnFuer, setKachelnFuer] = useState<{ id: string; name: string } | null>(null);
  const [anfahrtFuer, setAnfahrtFuer] = useState<{ id: string; name: string } | null>(null);

  // Link, den Uli Gaesten nach der Buchung schickt (Booking, Airbnb, Belvilla).
  const gaesteLinkKopieren = async (house: AdminHouse) => {
    const link = `https://steinbockchalets.com/anfahrt/${house.slug}`;
    try {
      await navigator.clipboard.writeText(link);
      toast({ title: "Anfahrts-Link kopiert", description: link });
    } catch {
      toast({ title: "Anfahrts-Link", description: link });
    }
  };
  const [verstecktGemerkt, setVerstecktGemerkt] = useState<{ id: string; name: string }[]>([]);

  const { data: houses = [], isLoading } = useQuery({
    queryKey: ["houses-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("houses").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []) as AdminHouse[];
    },
    enabled: isAdmin,
  });

  // Wie viele Kacheln je Haus hinterlegt sind — damit man sieht, wo noch
  // die allgemeinen Texte greifen.
  const { data: kachelZahl = {} } = useQuery({
    queryKey: ["house-features-count"],
    queryFn: async () => {
      const { data, error } = await supabase.from("house_features").select("house_id, section");
      if (error) throw error;
      const zaehler: Record<string, { highlight: number; feature: number }> = {};
      (data || []).forEach((z: any) => {
        zaehler[z.house_id] = zaehler[z.house_id] || { highlight: 0, feature: 0 };
        zaehler[z.house_id][z.section as "highlight" | "feature"]++;
      });
      return zaehler;
    },
    enabled: isAdmin,
  });

  const wirklichVersteckt = useMemo(
    () => verstecktGemerkt.filter(v => !houses.some(h => h.id === v.id)),
    [verstecktGemerkt, houses]
  );

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase.from("houses").update({ is_active: isActive }).eq("id", id);
      if (error) throw error;
      return { id, isActive };
    },
    onSuccess: ({ isActive }) => {
      ["houses-all", "houses-active", "gallery-images", "hero-image", "chalet-cover", "availability"]
        .forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
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
      bedrooms: house.bedrooms,
      bathrooms: house.bathrooms,
      square_meters: house.square_meters,
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
          <Button onClick={() => { setBearbeitet(null); setFormOpen(true); }}>
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
              const zahlen = kachelZahl[house.id] || { highlight: 0, feature: 0 };
              const fehlt: string[] = [];
              if (!house.external_house_id) fehlt.push("kein Kalender");
              if (!house.description) fehlt.push("keine Beschreibung");
              if (!house.square_meters) fehlt.push("keine m²");
              if (zahlen.highlight === 0) fehlt.push("keine Highlights");
              if (zahlen.feature === 0) fehlt.push("keine Ausstattung");
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
                      {" · "}{house.max_guests} Gäste
                      {fehlt.length > 0 && (
                        <span className="text-amber-700 dark:text-amber-500">
                          {" · "}{fehlt.join(" · ")}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant={istVorschau ? "default" : "outline"} size="sm"
                    onClick={() => (istVorschau ? onVorschau?.(null, null) : bilderPflegen(house))}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Bilder
                  </Button>

                  <Button variant="outline" size="sm" onClick={() => bearbeiten(house)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Texte &amp; Daten
                  </Button>

                  <Button
                    variant="outline" size="sm"
                    onClick={() => setKachelnFuer({ id: house.id, name: house.name })}
                  >
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Ausstattung
                  </Button>

                  <Button
                    variant="outline" size="sm"
                    onClick={() => setAnfahrtFuer({ id: house.id, name: house.name })}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Anfahrt
                  </Button>

                  <Button
                    variant="ghost" size="sm"
                    title={`https://steinbockchalets.com/anfahrt/${house.slug}`}
                    onClick={() => gaesteLinkKopieren(house)}
                  >
                    <Link2 className="h-4 w-4 mr-2" />
                    Gäste-Link
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
                <div key={v.id} className="flex flex-wrap items-center gap-3 rounded-lg bg-background border px-3 py-2">
                  <span className="flex-grow text-sm font-medium">{v.name}</span>
                  <Button
                    size="sm" variant="outline"
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

      <HouseDirectionsDialog
        open={!!anfahrtFuer}
        onOpenChange={offen => !offen && setAnfahrtFuer(null)}
        houseId={anfahrtFuer?.id ?? null}
        houseName={anfahrtFuer?.name ?? ""}
      />

      <HouseFeaturesDialog
        open={!!kachelnFuer}
        onOpenChange={offen => !offen && setKachelnFuer(null)}
        houseId={kachelnFuer?.id ?? null}
        houseName={kachelnFuer?.name ?? ""}
      />
    </section>
  );
};

export default AdminHousesPanel;
