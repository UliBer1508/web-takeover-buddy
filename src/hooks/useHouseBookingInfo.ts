import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BookingPlatform {
  name: string;
  url: string | null;
}

/** Eine Zeile aus public.house_booking_info - Hinweis, wenn ein Haus nicht direkt buchbar ist. */
export interface HouseBookingInfo {
  house_id: string;
  title_de: string | null;
  title_en: string | null;
  text_de: string | null;
  text_en: string | null;
  main_label: string | null;
  main_url: string | null;
  platforms: BookingPlatform[] | null;
}

/**
 * Hinweis "wird ueber Plattform X vermietet" eines Hauses. Alle Inhalte kommen
 * aus der Datenbank; im Code steht keine Plattform.
 */
export const useHouseBookingInfo = (houseId: string | null | undefined, enabled = true) =>
  useQuery({
    queryKey: ["house-booking-info", houseId],
    queryFn: async () => {
      if (!houseId) return null;
      const { data, error } = await (supabase as any)
        .from("house_booking_info")
        .select("*")
        .eq("house_id", houseId)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as HouseBookingInfo | null;
    },
    enabled: !!houseId && enabled,
  });

/** Text in der Sprache; leeres Englisch -> Deutsch. */
export const infoText = (
  info: HouseBookingInfo | null | undefined,
  feld: "title" | "text",
  lang: "de" | "en"
): string | null => {
  if (!info) return null;
  const de = (info as any)[`${feld}_de`] as string | null;
  const en = (info as any)[`${feld}_en`] as string | null;
  const wert = lang === "en" && en?.trim() ? en : de;
  return wert?.trim() ? wert : null;
};
