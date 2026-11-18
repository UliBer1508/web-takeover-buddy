import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Öffentliche Angaben „Wohnen auf Zeit“ eines Hauses (public.house_long_term).
 * Enthält bewusst KEINE Preise: Miete und Konditionen bekommt ein Interessent
 * erst nach der Besichtigung (Entscheidung Uli, 18.11.2026).
 */
export interface HouseLongTerm {
  house_id: string;
  min_months: number;
  max_months: number | null;
  available_from: string | null; // ISO-Datum, leer = nach Vereinbarung
  registration_required: boolean;
  text_de: string | null;
  text_en: string | null;
  included_de: string[] | null;
  included_en: string[] | null;
}

export const useHouseLongTerm = (houseId: string | null | undefined, enabled = true) =>
  useQuery({
    queryKey: ["house-long-term", houseId],
    queryFn: async () => {
      if (!houseId) return null;
      const { data, error } = await (supabase as any)
        .from("house_long_term")
        .select("*")
        .eq("house_id", houseId)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as HouseLongTerm | null;
    },
    enabled: !!houseId && enabled,
  });

/** Die eine Zeile aus public.site_settings. */
export interface SiteSettings {
  show_mode_switch: boolean;
}

export const useSiteSettings = () =>
  useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("site_settings")
        .select("show_mode_switch")
        .maybeSingle();
      // Fehlt die Tabelle (SQL noch nicht ausgeführt), gilt: kein Umschalter.
      if (error) return { show_mode_switch: false } as SiteSettings;
      return (data ?? { show_mode_switch: false }) as SiteSettings;
    },
    staleTime: 5 * 60 * 1000,
  });

/** Vermietungsart, die ein Gast gerade ansieht. */
export type Mietart = "short" | "long";
