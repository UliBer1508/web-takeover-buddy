import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Eine Zeile aus public.ski_areas (gemeinsam für alle Häuser). */
export interface SkiArea {
  id: string;
  name: string;
  region_de: string | null;
  region_en: string | null;
  description_de: string | null;
  description_en: string | null;
  website_url: string | null;
  piste_map_url: string | null;
  image_url: string | null;
  elevation_min: number | null;
  elevation_max: number | null;
  slopes_km: number | null;
  slopes_blue_km: number | null;
  slopes_red_km: number | null;
  slopes_black_km: number | null;
  lifts: number | null;
  season_de: string | null;
  season_en: string | null;
  distance_km: number | null;
  drive_minutes: number | null;
  facts_as_of: string | null;
  facts_source: string | null;
  is_active: boolean;
  sort_order: number;
}

const ZAHLEN = [
  "elevation_min", "elevation_max", "slopes_km", "slopes_blue_km", "slopes_red_km",
  "slopes_black_km", "lifts", "distance_km", "drive_minutes",
] as const;

/** numeric-Spalten kommen als Text - in Zahlen umwandeln, leer bleibt null. */
export const skiAreaAusDb = (z: any): SkiArea => {
  const r = { ...z };
  ZAHLEN.forEach(k => { r[k] = z[k] == null || z[k] === "" ? null : Number(z[k]); });
  return r as SkiArea;
};

/** Sichtbare Skigebiete für die Website (RLS liefert nur is_active). */
export const useSkiAreas = () =>
  useQuery({
    queryKey: ["ski-areas"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("ski_areas")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return ((data || []) as any[]).map(skiAreaAusDb);
    },
  });
