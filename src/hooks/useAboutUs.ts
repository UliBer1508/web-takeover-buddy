import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { lokal, Sprache } from "@/lib/sprache";

/** Die eine Zeile aus public.about_us (Gastgeber, gilt für die ganze Website). */
export interface AboutUs {
  title_de: string | null;
  title_en: string | null;
  text_de: string | null;
  text_en: string | null;
  image_url: string | null;
  is_active: boolean;
}

/** Für die Website: liefert nur etwas, wenn „anzeigen“ an ist (RLS). */
export const useAboutUs = () =>
  useQuery({
    queryKey: ["about-us"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("about_us")
        .select("title_de, title_en, text_de, text_en, image_url, is_active")
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as AboutUs | null;
    },
    staleTime: 5 * 60 * 1000,
  });

/** Abschnitt nur zeigen, wenn aktiv UND ein Text in dieser Sprache (oder deutsch) da ist. */
export const aboutUsText = (a: AboutUs | null | undefined, sprache: Sprache) =>
  a?.is_active ? lokal(a.text_de, a.text_en, sprache) : null;
