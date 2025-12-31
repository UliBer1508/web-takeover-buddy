import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home } from "lucide-react";

interface House {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  max_guests: number;
  is_active: boolean;
  sort_order: number;
}

interface HouseSelectorProps {
  selectedHouseId: string | null;
  onHouseChange: (houseId: string) => void;
}

const HouseSelector = ({ selectedHouseId, onHouseChange }: HouseSelectorProps) => {
  const { data: houses, isLoading } = useQuery({
    queryKey: ['houses-active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('houses')
        .select('id, name, slug, short_description, max_guests, is_active, sort_order')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as House[];
    },
  });

  if (isLoading || !houses || houses.length <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center py-4">
      <Tabs 
        value={selectedHouseId || houses[0]?.id} 
        onValueChange={onHouseChange}
        className="w-auto"
      >
        <TabsList className="bg-muted/50 backdrop-blur-sm">
          {houses.map((house) => (
            <TabsTrigger 
              key={house.id} 
              value={house.id}
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Home className="h-4 w-4" />
              {house.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default HouseSelector;
