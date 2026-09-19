import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Eine Zeile aus public.house_directions - die Anfahrt eines Hauses. */
export interface HouseDirections {
  house_id: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  plus_code: string | null;
  warning_title_de: string | null;
  warning_title_en: string | null;
  warning_text_de: string | null;
  warning_text_en: string | null;
  steps_de: string[] | null;
  steps_en: string[] | null;
  parking_de: string | null;
  parking_en: string | null;
  by_car_de: string | null;
  by_car_en: string | null;
  airport_de: string | null;
  airport_en: string | null;
  train_station_de: string | null;
  train_station_en: string | null;
  winter_de: string | null;
  winter_en: string | null;
  house_image_url: string | null;
  map_image_url: string | null;
  map_caption_de: string | null;
  map_caption_en: string | null;
}

/** Felder, die es je Sprache gibt (Spalte = <feld>_de / <feld>_en). */
export type DirectionsTextField =
  | "warning_title" | "warning_text" | "parking" | "by_car" | "airport"
  | "train_station" | "winter" | "map_caption";

/**
 * Anfahrt eines Hauses. `null`, solange fuer das Haus nichts hinterlegt ist.
 * Alle Inhalte kommen aus der Datenbank - im Code stehen keine Anfahrtsdaten.
 */
export const useHouseDirections = (houseId: string | null | undefined) =>
  useQuery({
    queryKey: ["house-directions", houseId],
    queryFn: async () => {
      if (!houseId) return null;
      const { data, error } = await (supabase as any)
        .from("house_directions")
        .select("*")
        .eq("house_id", houseId)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as HouseDirections | null;
    },
    enabled: !!houseId,
  });

/**
 * Text in der gewuenschten Sprache. Ist die englische Fassung leer, gilt die
 * deutsche - beides kommt aus der Datenbank.
 */
export const textIn = (
  d: HouseDirections | null | undefined,
  feld: DirectionsTextField,
  lang: "de" | "en"
): string | null => {
  if (!d) return null;
  const de = (d as any)[`${feld}_de`] as string | null;
  const en = (d as any)[`${feld}_en`] as string | null;
  const wert = lang === "en" ? (en?.trim() ? en : de) : de;
  return wert?.trim() ? wert : null;
};

export const schritteIn = (
  d: HouseDirections | null | undefined,
  lang: "de" | "en"
): string[] => {
  if (!d) return [];
  const saubere = (liste: string[] | null) => (liste || []).map(s => s.trim()).filter(Boolean);
  const de = saubere(d.steps_de);
  const en = saubere(d.steps_en);
  return lang === "en" && en.length > 0 ? en : de;
};
