import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { toast } from "@/hooks/use-toast";
import { houseColor } from "@/lib/houseColors";
import HouseSettingsDialog from "./HouseSettingsDialog";

interface AdminHouse {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
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

/**
 * Nur fuer Admins sichtbar. Ein Schalter je Haus steuert is_active - und damit,
 * ob das Haus im Umschalter, in der Galerie, im Kalender und im
 * Buchungsformular auftaucht. Ist nur ein Haus aktiv, sieht die Seite fuer
 * Gaeste genauso aus wie vorher.
 */
const AdminHousesPanel = () => {
  const { isAdmin, loading } = useAdmin();
  const queryClient = useQueryClient();

  const { data: houses = [], isLoading } = useQuery({
    queryKey: ['houses-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data || []) as AdminHouse[];
    },
    enabled: isAdmin,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('houses')
        .update({ is_active: isActive })
        .eq('id', id);
      if (error) throw error;
      return isActive;
    },
    onSuccess: (isActive) => {
      queryClient.invalidateQueries({ queryKey: ['houses-all'] });
      queryClient.invalidateQueries({ queryKey: ['houses-active'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
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

  if (loading || !isAdmin) return null;

  const activeCount = houses.filter(h => h.is_active).length;

  return (
    <section className="border-b bg-muted/40">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold">Häuser auf der Website</h2>
            <p className="text-sm text-muted-foreground">
              Nur für Admins sichtbar. {activeCount} von {houses.length} freigeschaltet.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-6">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Häuser werden geladen…</span>
          </div>
        ) : (
          <div className="rounded-xl border bg-background divide-y">
            {houses.map((house, index) => {
              const kalenderFehlt = !house.external_house_id;
              return (
                <div key={house.id} className="flex items-center gap-4 px-4 py-4">
                  <span
                    aria-hidden="true"
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: houseColor(index) }}
                  />
                  <div className="flex-grow min-w-0">
                    <div className="font-semibold">{house.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {house.is_active ? "sichtbar und buchbar" : "ausgeblendet"}
                      {kalenderFehlt && (
                        <span className="text-amber-700 dark:text-amber-500">
                          {" "}· keine Kalender-Verknüpfung
                        </span>
                      )}
                    </div>
                  </div>

                  <HouseSettingsDialog house={house} />

                  <Switch
                    checked={house.is_active}
                    disabled={toggleMutation.isPending}
                    onCheckedChange={(checked) =>
                      toggleMutation.mutate({ id: house.id, isActive: checked })
                    }
                    aria-label={`${house.name} auf der Website anzeigen`}
                  />
                </div>
              );
            })}
          </div>
        )}

        {houses.some(h => h.is_active && !h.external_house_id) && (
          <div className="mt-3 flex gap-2 items-start rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800 px-3 py-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-700 dark:text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200">
              Ein freigeschaltetes Haus ohne Kalender-Verknüpfung zeigt Gästen einen
              leeren Verfügbarkeitskalender — jeder Zeitraum wirkt frei. Verknüpfung
              in den Hauseinstellungen nachtragen.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminHousesPanel;
