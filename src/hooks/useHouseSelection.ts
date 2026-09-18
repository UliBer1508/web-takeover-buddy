import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { houseColor } from '@/lib/houseColors';

export interface SelectableHouse {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  max_guests: number;
  is_active: boolean;
  sort_order: number;
  external_house_id: string | null;
  /** Aus sort_order abgeleitet, nicht aus der Datenbank. */
  color: string;
}

export const useHouseSelection = () => {
  const [selectedHouseId, setSelectedHouseId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['houses-active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('houses')
        .select('id, name, slug, short_description, max_guests, is_active, sort_order, external_house_id')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Farbe einmal vergeben, stabil ueber die Reihenfolge.
  const houses: SelectableHouse[] = useMemo(
    () => (data || []).map((h, i) => ({ ...h, color: houseColor(i) })),
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
