import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useHouseSelection = () => {
  const [selectedHouseId, setSelectedHouseId] = useState<string | null>(null);

  const { data: houses, isLoading } = useQuery({
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

  // Set default house when houses are loaded
  useEffect(() => {
    if (houses && houses.length > 0 && !selectedHouseId) {
      setSelectedHouseId(houses[0].id);
    }
  }, [houses, selectedHouseId]);

  const selectedHouse = houses?.find(h => h.id === selectedHouseId) || houses?.[0] || null;

  return {
    houses,
    selectedHouseId,
    selectedHouse,
    setSelectedHouseId,
    isLoading,
    hasMultipleHouses: (houses?.length || 0) > 1,
  };
};
