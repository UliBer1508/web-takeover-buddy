import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Eine Zeile aus public.house_places. */
export interface HousePlace {
  id: string;
  house_id: string;
  category: string;
  name: string;
  latitude: number;
  longitude: number;
  note_de: string | null;
  note_en: string | null;
  url: string | null;
  osm_id: string | null;
  sort_order: number;
}

/** Orte "In der Naehe" eines Hauses - ausschliesslich aus der Datenbank. */
export const useHousePlaces = (houseId: string | null | undefined) =>
  useQuery({
    queryKey: ["house-places", houseId],
    queryFn: async () => {
      if (!houseId) return [] as HousePlace[];
      const { data, error } = await (supabase as any)
        .from("house_places")
        .select("*")
        .eq("house_id", houseId)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return ((data || []) as any[]).map(p => ({
        ...p, latitude: Number(p.latitude), longitude: Number(p.longitude),
      })) as HousePlace[];
    },
    enabled: !!houseId,
  });
