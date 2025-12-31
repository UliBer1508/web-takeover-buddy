import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { Tag } from "lucide-react";
import { format } from "date-fns";
import { de, enUS } from "date-fns/locale";

interface Promotion {
  id: string;
  house_id: string | null;
  name: string;
  description_de: string;
  description_en: string | null;
  discount_type: string;
  discount_value: number;
  valid_from: string;
  valid_until: string;
  booking_start: string | null;
  booking_end: string | null;
  min_nights: number | null;
  is_active: boolean;
}

interface PromotionBannerProps {
  houseId?: string;
  checkInDate?: string;
}

const PromotionBanner = ({ houseId, checkInDate }: PromotionBannerProps) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'de' ? de : enUS;

  const { data: promotions = [] } = useQuery({
    queryKey: ['active-promotions', houseId],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      let query = supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .lte('valid_from', today)
        .gte('valid_until', today);

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Filter by house_id (null means all houses)
      return (data as Promotion[]).filter(p => 
        p.house_id === null || p.house_id === houseId
      );
    },
  });

  // Filter promotions that apply to the selected check-in date
  const applicablePromotions = promotions.filter(promo => {
    if (!checkInDate) return true; // Show all if no date selected
    
    const checkIn = new Date(checkInDate);
    
    // Check if check-in is within booking_start/booking_end range
    if (promo.booking_start && new Date(promo.booking_start) > checkIn) return false;
    if (promo.booking_end && new Date(promo.booking_end) < checkIn) return false;
    
    return true;
  });

  if (applicablePromotions.length === 0) return null;

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'dd.MM.', { locale });
  };

  return (
    <div className="space-y-2">
      {applicablePromotions.map((promo) => (
        <div
          key={promo.id}
          className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20"
        >
          <div className="flex-shrink-0 p-1.5 rounded-full bg-primary/20">
            <Tag className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground">
              {promo.discount_type === 'percentage' 
                ? `${promo.discount_value}% ${t('promotions.discount')}`
                : `${promo.discount_value}€ ${t('promotions.discount')}`
              }
            </p>
            <p className="text-sm text-muted-foreground">
              {i18n.language === 'de' ? promo.description_de : (promo.description_en || promo.description_de)}
            </p>
            {promo.booking_start && promo.booking_end && (
              <p className="text-xs text-muted-foreground mt-1">
                {t('promotions.validForStays')}: {formatDate(promo.booking_start)} - {formatDate(promo.booking_end)}
              </p>
            )}
            {promo.min_nights && promo.min_nights > 1 && (
              <p className="text-xs text-muted-foreground">
                {t('promotions.minNights', { nights: promo.min_nights })}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromotionBanner;
