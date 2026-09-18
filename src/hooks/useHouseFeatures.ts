import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type FeatureSection = "highlight" | "feature";

export interface HouseFeature {
  id: string;
  house_id: string;
  section: FeatureSection;
  icon: string;
  title: string;
  description: string | null;
  sort_order: number;
}

/**
 * Highlights und Ausstattung eines Hauses. Beide Bloecke liegen in derselben
 * Tabelle und werden ueber `section` unterschieden - eine Abfrage reicht.
 */
export const useHouseFeatures = (houseId: string | null | undefined) => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["house-features", houseId],
    queryFn: async () => {
      if (!houseId) return [] as HouseFeature[];
      const { data, error } = await supabase
        .from("house_features")
        .select("*")
        .eq("house_id", houseId)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []) as HouseFeature[];
    },
    enabled: !!houseId,
  });

  return {
    highlights: data.filter(f => f.section === "highlight"),
    features: data.filter(f => f.section === "feature"),
    isLoading,
  };
};
