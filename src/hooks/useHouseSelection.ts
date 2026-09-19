import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { houseColor } from '@/lib/houseColors';

export interface SelectableHouse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  short_description_en: string | null;
  description_en: string | null;
  highlights_en: string[] | null;
  location: string | null;
  highlights: string[] | null;
  bedrooms: number | null;
  bathrooms: number | null;
  square_meters: number | null;
  max_guests: number;
  price_winter: number | null;
  price_summer: number | null;
  price_offseason: number | null;
  min_nights: number | null;
  is_active: boolean;
  /** false = wird ueber eine Plattform vermietet (z. B. Belvilla): keine Preise, kein Anfrageformular. */
  direct_booking: boolean;
  sort_order: number;
  external_house_id: string | null;
  /** Aus sort_order abgeleitet, nicht aus der Datenbank. */
  color: string;
}

/** Niedrigster hinterlegter Saisonpreis, fuer "ab X € / Nacht".
 *  Nicht direkt buchbare Haeuser zeigen keinen Preis. */
export const abPreis = (haus: SelectableHouse): number | null => {
  if (haus.direct_booking === false) return null;
  const preise = [haus.price_winter, haus.price_summer, haus.price_offseason]
    .filter((p): p is number => typeof p === 'number' && p > 0);
  return preise.length > 0 ? Math.min(...preise) : null;
};

export const useHouseSelection = () => {
  const [selectedHouseId, setSelectedHouseId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['houses-active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('houses')
        .select('id, name, slug, description, description_en, short_description, short_description_en, location, highlights, highlights_en, bedrooms, bathrooms, square_meters, max_guests, price_winter, price_summer, price_offseason, min_nights, is_active, direct_booking, sort_order, external_house_id')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const houses: SelectableHouse[] = useMemo(
    () => (data || []).map((h: any, i: number) => ({ ...h, color: houseColor(i) })),
    [data]
  );

  // Standardhaus setzen, sobald geladen. Faellt die Auswahl weg, weil ein Haus
  // im Admin abgeschaltet wurde, springt die Auswahl auf das erste Haus zurueck.
  useEffect(() => {
    if (houses.length === 0) return;
    if (!selectedHouseId || !houses.some(h => h.id === selectedHouseId)) {
      setSelectedHouseId(houses[0].id);
    }
  }, [houses, selectedHouseId]);

  const selectedHouse =
    houses.find(h => h.id === selectedHouseId) || houses[0] || null;

  return {
    houses,
    selectedHouseId: selectedHouse?.id ?? null,
    selectedHouse,
    setSelectedHouseId,
    isLoading,
    hasMultipleHouses: houses.length > 1,
  };
};
