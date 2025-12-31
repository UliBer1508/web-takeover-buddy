import { useState, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, Users, Mail, Phone, MessageSquare, Pencil, ChevronDown, Calculator, Tag } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { externalSupabase } from "@/integrations/external-supabase/client";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format, differenceInDays, getMonth } from "date-fns";
import HouseSettingsDialog from "@/components/HouseSettingsDialog";

import PromotionBanner from "@/components/PromotionBanner";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { useAdmin } from "@/hooks/useAdmin";

// Default house ID (will be replaced by actual house from database)
const DEFAULT_HOUSE_ID = "00000000-0000-0000-0000-000000000001";

// Season determination based on month
type Season = 'winter' | 'summer' | 'offseason';

const getSeason = (date: Date): Season => {
  const month = getMonth(date); // 0-11
  // Winter: December (11), January (0), February (1), March (2)
  if (month === 11 || month <= 2) return 'winter';
  // Summer: June (5), July (6), August (7), September (8)
  if (month >= 5 && month <= 8) return 'summer';
  // Offseason: April (3), May (4), October (9), November (10)
  return 'offseason';
};

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

interface PriceBreakdown {
  nights: number;
  season: Season;
  pricePerNight: number;
  accommodationTotal: number;
  cleaningFee: number;
  serviceFee: number;
  bedLinenFee: number;
  touristTaxTotal: number;
  grandTotal: number;
  // Promotion fields
  discountAmount: number;
  discountLabel: string | null;
  originalTotal: number;
  promotionId: string | null;
}

const calculatePriceBreakdown = (
  house: House | undefined,
  checkIn: string,
  checkOut: string,
  adults: number,
  children: number,
  promotions: Promotion[] = []
): PriceBreakdown | null => {
  if (!house || !checkIn || !checkOut) return null;
  
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) return null;
  
  const nights = differenceInDays(checkOutDate, checkInDate);
  if (nights <= 0) return null;
  
  const season = getSeason(checkInDate);
  
  // Get price per night based on season
  let pricePerNight: number;
  switch (season) {
    case 'winter':
      pricePerNight = house.price_winter ?? 450;
      break;
    case 'summer':
      pricePerNight = house.price_summer ?? 380;
      break;
    default:
      pricePerNight = house.price_offseason ?? 320;
  }
  
  const accommodationTotal = pricePerNight * nights;
  const cleaningFee = house.cleaning_fee ?? 240;
  const serviceFee = house.service_fee ?? 0;
  const bedLinenFee = house.bed_linen_fee ?? 0;
  
  // Tourist tax: per person per night (adults + children who count)
  const touristTaxPerPerson = house.tourist_tax ?? 0;
  const touristTaxTotal = touristTaxPerPerson * (adults + children) * nights;
  
  const subtotalBeforeDiscount = accommodationTotal + cleaningFee + serviceFee + bedLinenFee + touristTaxTotal;
  
  // Find applicable promotion (highest discount wins)
  let bestPromotion: Promotion | null = null;
  let bestDiscountAmount = 0;
  
  for (const promo of promotions) {
    // Check if promotion applies to this house
    if (promo.house_id !== null && promo.house_id !== house.id) continue;
    
    // Check if check-in is within booking_start/booking_end range
    if (promo.booking_start && new Date(promo.booking_start) > checkInDate) continue;
    if (promo.booking_end && new Date(promo.booking_end) < checkInDate) continue;
    
    // Check minimum nights requirement
    if (promo.min_nights && nights < promo.min_nights) continue;
    
    // Calculate discount amount
    let discountAmount: number;
    if (promo.discount_type === 'percentage') {
      discountAmount = accommodationTotal * (promo.discount_value / 100);
    } else {
      discountAmount = promo.discount_value;
    }
    
    // Keep the best discount
    if (discountAmount > bestDiscountAmount) {
      bestDiscountAmount = discountAmount;
      bestPromotion = promo;
    }
  }
  
  const discountAmount = Math.round(bestDiscountAmount * 100) / 100;
  const grandTotal = subtotalBeforeDiscount - discountAmount;
  
  return {
    nights,
    season,
    pricePerNight,
    accommodationTotal,
    cleaningFee,
    serviceFee,
    bedLinenFee,
    touristTaxTotal,
    grandTotal,
    discountAmount,
    discountLabel: bestPromotion 
      ? `${bestPromotion.discount_type === 'percentage' ? `${bestPromotion.discount_value}%` : `${bestPromotion.discount_value}€`} ${bestPromotion.name}`
      : null,
    originalTotal: subtotalBeforeDiscount,
    promotionId: bestPromotion?.id ?? null
  };
};

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
};

const getSeasonLabel = (season: Season, t: TFunction): string => {
  switch (season) {
    case 'winter': return t('booking.seasons.winter');
    case 'summer': return t('booking.seasons.summer');
    default: return t('booking.seasons.offseason');
  }
};

const bookingSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein").max(100, "Name zu lang"),
  email: z.string().email("Ungültige E-Mail-Adresse").max(255, "E-Mail zu lang"),
  phone: z.string().min(10, "Bitte geben Sie eine gültige Telefonnummer ein").max(20, "Telefonnummer zu lang"),
  checkIn: z.string().min(1, "Check-in Datum erforderlich"),
  checkOut: z.string().min(1, "Check-out Datum erforderlich"),
  adults: z.string().refine((val) => {
    const num = parseInt(val);
    return num >= 1 && num <= 6;
  }, "Mindestens 1 Erwachsener erforderlich"),
  children: z.string().refine((val) => {
    const num = parseInt(val);
    return num >= 0 && num <= 5;
  }, "Anzahl Kinder muss zwischen 0 und 5 liegen"),
  message: z.string().max(1000, "Nachricht zu lang").optional()
}).refine((data) => {
  const adults = parseInt(data.adults);
  const children = parseInt(data.children);
  return (adults + children) <= 6;
}, {
  message: "Maximale Gästezahl ist 6 (Erwachsene + Kinder)",
  path: ["children"]
}).refine((data) => {
  const checkIn = new Date(data.checkIn);
  const checkOut = new Date(data.checkOut);
  return checkOut > checkIn;
}, {
  message: "Abreisedatum muss nach dem Anreisedatum liegen",
  path: ["checkOut"]
}).refine((data) => {
  const checkIn = new Date(data.checkIn);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return checkIn >= today;
}, {
  message: "Anreisedatum muss heute oder in der Zukunft liegen",
  path: ["checkIn"]
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  initialCheckIn?: Date | null;
  initialCheckOut?: Date | null;
  defaultHouseId?: string | null;
}

interface House {
  id: string;
  name: string;
  max_guests: number;
  is_active?: boolean;
  min_nights?: number | null;
  check_in_time?: string | null;
  check_out_time?: string | null;
  cleaning_fee?: number | null;
  service_fee?: number | null;
  bed_linen_fee?: number | null;
  tourist_tax?: number | null;
  price_winter?: number | null;
  price_summer?: number | null;
  price_offseason?: number | null;
  external_house_id?: string | null;
}

interface BookingStatus {
  id: string;
  name: string;
  display_name: string;
}

const BookingForm = ({ initialCheckIn, initialCheckOut, defaultHouseId }: BookingFormProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAdmin } = useAdmin();
  const canEdit = isAdmin;
  
  // Fetch houses from database
  const { data: houses = [] } = useQuery({
    queryKey: ['houses-active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as House[];
    },
  });

  // Fetch booking statuses to get "pending" status ID
  const { data: statuses = [] } = useQuery({
    queryKey: ['booking-statuses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_statuses')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as BookingStatus[];
    },
  });

  // Get house from defaultHouseId prop, or use first house
  const selectedHouse = defaultHouseId 
    ? houses.find(h => h.id === defaultHouseId) || houses[0]
    : houses[0];
  const maxGuests = selectedHouse?.max_guests || 10;
  const pendingStatusId = statuses.find(s => s.name === 'pending')?.id;

  // Fetch active promotions
  const { data: promotions = [] } = useQuery({
    queryKey: ['active-promotions', selectedHouse?.id],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .lte('valid_from', today)
        .gte('valid_until', today);

      if (error) throw error;
      return (data as Promotion[]).filter(p => 
        p.house_id === null || p.house_id === selectedHouse?.id
      );
    },
    enabled: !!selectedHouse,
  });

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      checkIn: "",
      checkOut: "",
      adults: "",
      children: "0",
      message: ""
    }
  });

  // Watch form fields for price calculation
  const watchedCheckIn = useWatch({ control: form.control, name: 'checkIn' });
  const watchedCheckOut = useWatch({ control: form.control, name: 'checkOut' });
  const watchedAdults = useWatch({ control: form.control, name: 'adults' });
  const watchedChildren = useWatch({ control: form.control, name: 'children' });

  // Calculate dynamic guest limits (max 6 total)
  const currentAdults = parseInt(watchedAdults) || 0;
  const currentChildren = parseInt(watchedChildren) || 0;
  const maxAdults = Math.max(1, 6 - currentChildren);
  const maxChildren = 6 - currentAdults;

  // Auto-reset children if adults selection makes current children invalid
  useEffect(() => {
    if (currentAdults > 0 && currentChildren > maxChildren) {
      form.setValue('children', maxChildren.toString());
    }
  }, [currentAdults, currentChildren, maxChildren, form]);

  // Calculate price breakdown reactively (including promotions)
  const priceBreakdown = useMemo(() => {
    return calculatePriceBreakdown(selectedHouse, watchedCheckIn, watchedCheckOut, currentAdults, currentChildren, promotions);
  }, [selectedHouse, watchedCheckIn, watchedCheckOut, currentAdults, currentChildren, promotions]);

  // Auto-fill form when dates are selected from calendar
  useEffect(() => {
    if (initialCheckIn) {
      form.setValue('checkIn', format(initialCheckIn, 'yyyy-MM-dd'));
    }
    if (initialCheckOut) {
      form.setValue('checkOut', format(initialCheckOut, 'yyyy-MM-dd'));
    }
  }, [initialCheckIn, initialCheckOut, form]);

  const onSubmit = async (data: BookingFormData) => {
    if (!pendingStatusId) {
      toast({
        title: t('common.error'),
        description: t('booking.statusError'),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert date strings to ISO timestamps
      const checkInDate = new Date(data.checkIn);
      const checkOutDate = new Date(data.checkOut);
      const totalGuests = parseInt(data.adults) + parseInt(data.children);

      // Calculate price for storage
      const adults = parseInt(data.adults);
      const children = parseInt(data.children);
      const calculatedPrice = calculatePriceBreakdown(selectedHouse, data.checkIn, data.checkOut, adults, children);

      // 1. Insert into local Lovable Cloud database
      const { error: localError } = await supabase
        .from('booking_inquiries')
        .insert({
          house_id: selectedHouse?.id || DEFAULT_HOUSE_ID,
          guest_name: data.name.trim(),
          guest_email: data.email.trim().toLowerCase(),
          guest_phone: data.phone.trim(),
          check_in: checkInDate.toISOString(),
          check_out: checkOutDate.toISOString(),
          number_of_guests: adults,
          number_of_children: children,
          message: data.message?.trim() || null,
          status_id: pendingStatusId,
          // Price fields
          total_price: calculatedPrice?.grandTotal ?? null,
          price_per_night: calculatedPrice?.pricePerNight ?? null,
          nights: calculatedPrice?.nights ?? null,
          cleaning_fee: calculatedPrice?.cleaningFee ?? null,
          service_fee: calculatedPrice?.serviceFee ?? null,
          bed_linen_fee: calculatedPrice?.bedLinenFee ?? null,
          tourist_tax_total: calculatedPrice?.touristTaxTotal ?? null
        });

      if (localError) {
        throw localError;
      }

      // 2. Insert into external "my sweet-home manager" database
      if (selectedHouse?.external_house_id) {
        const { error: externalError } = await externalSupabase
          .from('booking_inquiries')
          .insert({
            house_id: selectedHouse.external_house_id,
            guest_name: data.name.trim(),
            guest_email: data.email.trim().toLowerCase(),
            guest_phone: data.phone.trim(),
            check_in: checkInDate.toISOString(),
            check_out: checkOutDate.toISOString(),
            number_of_guests: totalGuests,
            number_of_adults: adults,
            number_of_children: children,
            estimated_amount: calculatedPrice?.grandTotal ?? null,
            message: data.message?.trim() || null
          });

        if (externalError) {
          console.warn("External DB sync failed:", externalError);
          // Don't throw - local save was successful
        }
      }

      toast({
        title: t('booking.successTitle'),
        description: t('booking.successDesc')
      });
      
      form.reset();
    } catch (error: any) {
      console.error("Booking inquiry error:", error);
      toast({
        title: t('booking.errorTitle'),
        description: error.message || t('booking.errorDesc'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {t('booking.title')}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t('booking.subtitle')}
            </p>
          </div>

          <Card className="shadow-xl animate-scale-in">
            <CardHeader>
              <CardTitle>{t('booking.checkAvailability')}</CardTitle>
              <CardDescription>
                {t('booking.formDescription')}
                {selectedHouse && <span className="block mt-1">{t('booking.property')}: {selectedHouse.name}</span>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('booking.name')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('booking.namePlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('booking.email')}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder={t('booking.emailPlaceholder')} className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('booking.phone')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder={t('booking.phonePlaceholder')} className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <FormField control={form.control} name="checkIn" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('booking.checkIn')}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="date" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        {initialCheckIn && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            ✓ {t('booking.fromCalendar')}
                          </Badge>
                        )}
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="checkOut" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('booking.checkOut')}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="date" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        {initialCheckOut && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            ✓ {t('booking.fromCalendar')}
                          </Badge>
                        )}
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="adults" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('booking.adults')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <Users className="h-4 w-4 mr-2" />
                              <SelectValue placeholder={t('booking.count')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: maxAdults }, (_, i) => i + 1).map(num => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? t('booking.adult') : t('booking.adults')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="children" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('booking.children')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <Users className="h-4 w-4 mr-2" />
                              <SelectValue placeholder={t('booking.count')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: maxChildren + 1 }, (_, i) => i).map(num => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? t('booking.child') : t('booking.children')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  {/* Live Price Display */}
                  {priceBreakdown && (
                    <Card className="border-primary/20 bg-primary/5">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Calculator className="h-5 w-5 text-primary" />
                          {t('booking.priceOverview')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            {priceBreakdown.nights} {priceBreakdown.nights === 1 ? t('booking.night') : t('booking.nights')} × {formatCurrency(priceBreakdown.pricePerNight)} ({getSeasonLabel(priceBreakdown.season, t)})
                          </span>
                          <span className="font-medium">{formatCurrency(priceBreakdown.accommodationTotal)}</span>
                        </div>
                        
                        <Collapsible>
                          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors [&[data-state=open]>svg]:rotate-180">
                            {t('booking.showFees')}
                            <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pt-2 space-y-2">
                            {priceBreakdown.cleaningFee > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{t('booking.cleaningFee')}</span>
                                <span>{formatCurrency(priceBreakdown.cleaningFee)}</span>
                              </div>
                            )}
                            {priceBreakdown.serviceFee > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{t('booking.serviceFee')}</span>
                                <span>{formatCurrency(priceBreakdown.serviceFee)}</span>
                              </div>
                            )}
                            {priceBreakdown.bedLinenFee > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{t('booking.bedLinen')}</span>
                                <span>{formatCurrency(priceBreakdown.bedLinenFee)}</span>
                              </div>
                            )}
                            {priceBreakdown.touristTaxTotal > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {t('booking.touristTax')} ({parseInt(watchedAdults) + parseInt(watchedChildren)} {t('booking.persons')} × {priceBreakdown.nights} {priceBreakdown.nights === 1 ? t('booking.night') : t('booking.nights')})
                                </span>
                                <span>{formatCurrency(priceBreakdown.touristTaxTotal)}</span>
                              </div>
                            )}
                          </CollapsibleContent>
                        </Collapsible>

                        {/* Discount display */}
                        {priceBreakdown.discountAmount > 0 && priceBreakdown.discountLabel && (
                          <div className="flex justify-between items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 p-2 rounded-md">
                            <span className="flex items-center gap-2">
                              <Tag className="h-4 w-4" />
                              {t('promotions.appliedDiscount')}: {priceBreakdown.discountLabel}
                            </span>
                            <span className="font-medium">-{formatCurrency(priceBreakdown.discountAmount)}</span>
                          </div>
                        )}
                        
                        <div className="border-t pt-3 flex justify-between items-center">
                          <span className="font-semibold text-lg">{t('booking.totalPrice')}</span>
                          <div className="text-right">
                            {priceBreakdown.discountAmount > 0 && (
                              <span className="text-sm text-muted-foreground line-through mr-2">
                                {formatCurrency(priceBreakdown.originalTotal)}
                              </span>
                            )}
                            <span className="font-bold text-xl text-primary">{formatCurrency(priceBreakdown.grandTotal)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('booking.message')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Textarea placeholder={t('booking.messagePlaceholder')} className="pl-10 min-h-[100px]" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                    {isSubmitting ? t('booking.submitting') : t('booking.submit')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Pricing Info */}
          <div className="mt-12 grid sm:grid-cols-2 gap-6 animate-fade-in-up">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl">{t('booking.prices')}</CardTitle>
                {canEdit && selectedHouse && (
                  <HouseSettingsDialog house={selectedHouse} />
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('booking.winter')}</span>
                  <span className="font-semibold">{t('booking.from')} {selectedHouse?.price_winter ?? 450}€ {t('booking.perNight')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('booking.summer')}</span>
                  <span className="font-semibold">{t('booking.from')} {selectedHouse?.price_summer ?? 380}€ {t('booking.perNight')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('booking.offseason')}</span>
                  <span className="font-semibold">{t('booking.from')} {selectedHouse?.price_offseason ?? 320}€ {t('booking.perNight')}</span>
                </div>
                
                {/* Promotion Banner - now under prices */}
                {promotions.length > 0 && selectedHouse && (
                  <div className="mt-4 pt-4 border-t">
                    <PromotionBanner houseId={selectedHouse.id} checkInDate={watchedCheckIn} />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl">{t('booking.importantInfo')}</CardTitle>
                {canEdit && selectedHouse && (
                  <HouseSettingsDialog house={selectedHouse} />
                )}
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>✓ {t('booking.minStay')}: {selectedHouse?.min_nights ?? 4} {t('booking.nights')}</p>
                <p>✓ {t('booking.checkInTime')} {selectedHouse?.check_in_time ?? "15:00"} {t('booking.clock')}</p>
                <p>✓ {t('booking.checkOutTime')} {selectedHouse?.check_out_time ?? "10:00"} {t('booking.clock')}</p>
                <p>✓ {t('booking.cleaningFee')}: {selectedHouse?.cleaning_fee ?? 240}€</p>
                
                <Collapsible className="mt-3">
                  <CollapsibleTrigger className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors [&[data-state=open]>svg]:rotate-180">
                    {t('booking.additionalFees')}
                    <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2 pl-4 space-y-1">
                    {(selectedHouse?.service_fee ?? 0) > 0 && (
                      <p>✓ {t('booking.serviceFee')}: {selectedHouse?.service_fee}€</p>
                    )}
                    {(selectedHouse?.bed_linen_fee ?? 0) > 0 && (
                      <p>✓ {t('booking.bedLinen')}: {selectedHouse?.bed_linen_fee}€ {t('booking.perBooking')}</p>
                    )}
                    {(selectedHouse?.tourist_tax ?? 0) > 0 && (
                      <p>✓ {t('booking.touristTax')}: {selectedHouse?.tourist_tax?.toFixed(2).replace('.', ',')}€ {t('booking.perPersonPerNight')}</p>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
