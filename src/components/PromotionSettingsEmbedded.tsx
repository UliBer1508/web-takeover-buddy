import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  sort_order: number;
  created_at: string;
}

const promotionSchema = z.object({
  name: z.string().min(1, "Name erforderlich"),
  description_de: z.string().min(1, "Beschreibung erforderlich"),
  description_en: z.string().optional(),
  discount_type: z.enum(["percentage", "fixed"]),
  discount_value: z.coerce.number().positive("Muss größer als 0 sein"),
  valid_from: z.string().min(1, "Startdatum erforderlich"),
  valid_until: z.string().min(1, "Enddatum erforderlich"),
  booking_start: z.string().optional(),
  booking_end: z.string().optional(),
  min_nights: z.coerce.number().min(1).optional(),
  is_active: z.boolean(),
});

type PromotionFormData = z.infer<typeof promotionSchema>;

interface PromotionSettingsEmbeddedProps {
  houseId: string;
  houseName: string;
}

const PromotionSettingsEmbedded = ({ houseId, houseName }: PromotionSettingsEmbeddedProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data: promotions = [], isLoading } = useQuery({
    queryKey: ['house-promotions', houseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .or(`house_id.eq.${houseId},house_id.is.null`)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as Promotion[];
    },
  });

  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      name: "",
      description_de: "",
      description_en: "",
      discount_type: "percentage",
      discount_value: 10,
      valid_from: "",
      valid_until: "",
      booking_start: "",
      booking_end: "",
      min_nights: 1,
      is_active: true,
    },
  });

  const resetForm = () => {
    form.reset({
      name: "",
      description_de: "",
      description_en: "",
      discount_type: "percentage",
      discount_value: 10,
      valid_from: "",
      valid_until: "",
      booking_start: "",
      booking_end: "",
      min_nights: 1,
      is_active: true,
    });
    setEditingPromotion(null);
    setShowForm(false);
  };

  const startEditing = (promo: Promotion) => {
    setEditingPromotion(promo);
    form.reset({
      name: promo.name,
      description_de: promo.description_de,
      description_en: promo.description_en || "",
      discount_type: promo.discount_type as "percentage" | "fixed",
      discount_value: promo.discount_value,
      valid_from: promo.valid_from,
      valid_until: promo.valid_until,
      booking_start: promo.booking_start || "",
      booking_end: promo.booking_end || "",
      min_nights: promo.min_nights || 1,
      is_active: promo.is_active,
    });
    setShowForm(true);
  };

  const onSubmit = async (data: PromotionFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        description_de: data.description_de,
        description_en: data.description_en || null,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        valid_from: data.valid_from,
        valid_until: data.valid_until,
        booking_start: data.booking_start || null,
        booking_end: data.booking_end || null,
        min_nights: data.min_nights || 1,
        house_id: houseId, // Always for this house
        is_active: data.is_active,
      };

      if (editingPromotion) {
        const { error } = await supabase
          .from('promotions')
          .update(payload)
          .eq('id', editingPromotion.id);

        if (error) throw error;
        toast({
          title: t('promotions.updated'),
          description: t('promotions.updatedDesc'),
        });
      } else {
        const { error } = await supabase
          .from('promotions')
          .insert(payload);

        if (error) throw error;
        toast({
          title: t('promotions.created'),
          description: t('promotions.createdDesc'),
        });
      }

      queryClient.invalidateQueries({ queryKey: ['house-promotions', houseId] });
      queryClient.invalidateQueries({ queryKey: ['all-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['active-promotions'] });
      resetForm();
    } catch (error: any) {
      console.error("Promotion save error:", error);
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: t('promotions.deleted'),
        description: t('promotions.deletedDesc'),
      });

      queryClient.invalidateQueries({ queryKey: ['house-promotions', houseId] });
      queryClient.invalidateQueries({ queryKey: ['all-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['active-promotions'] });
    } catch (error: any) {
      console.error("Delete error:", error);
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive",
      });
    }
    setDeleteConfirmId(null);
  };

  const isPromotionActive = (promo: Promotion) => {
    if (!promo.is_active) return false;
    const today = new Date().toISOString().split('T')[0];
    return promo.valid_from <= today && promo.valid_until >= today;
  };

  const isGlobalPromo = (promo: Promotion) => promo.house_id === null;

  return (
    <>
      <div className="space-y-4 border-t pt-6 mt-6">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">{t('promotions.title')}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{t('promotions.houseSpecific', { houseName })}</p>

        {showForm ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-muted/50 p-4 rounded-lg">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('promotions.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('promotions.namePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description_de"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('promotions.descriptionDe')}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t('promotions.descriptionPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('promotions.descriptionEn')}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t('promotions.descriptionPlaceholderEn')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="discount_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('promotions.discountType')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="percentage">{t('promotions.percentage')}</SelectItem>
                          <SelectItem value="fixed">{t('promotions.fixedAmount')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discount_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('promotions.discountValue')}</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="min_nights"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('promotions.minNightsLabel')}</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="valid_from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('promotions.validFrom')}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="valid_until"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('promotions.validUntil')}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="booking_start"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('promotions.bookingStart')}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="booking_end"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('promotions.bookingEnd')}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">{t('promotions.active')}</FormLabel>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? t('common.loading') : t('common.save')}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-3">
            <Button onClick={() => setShowForm(true)} variant="outline" size="sm" className="w-full gap-2">
              <Plus className="h-4 w-4" />
              {t('promotions.add')}
            </Button>

            {isLoading ? (
              <p className="text-center text-muted-foreground py-4 text-sm">{t('common.loading')}</p>
            ) : promotions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4 text-sm">{t('promotions.empty')}</p>
            ) : (
              <ScrollArea className="h-[200px]">
                <div className="space-y-2 pr-2">
                  {promotions.map((promo) => (
                    <Card key={promo.id} className={`${!promo.is_active ? "opacity-60" : ""} ${isGlobalPromo(promo) ? "border-dashed" : ""}`}>
                      <CardHeader className="py-2 px-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <CardTitle className="text-sm">{promo.name}</CardTitle>
                            {isGlobalPromo(promo) && (
                              <Badge variant="outline" className="text-xs">{t('promotions.global')}</Badge>
                            )}
                            {isPromotionActive(promo) ? (
                              <Badge variant="default" className="text-xs">{t('promotions.activeNow')}</Badge>
                            ) : !promo.is_active ? (
                              <Badge variant="secondary" className="text-xs">{t('promotions.inactive')}</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">{t('promotions.scheduled')}</Badge>
                            )}
                          </div>
                          {!isGlobalPromo(promo) && (
                            <div className="flex gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => startEditing(promo)}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:text-destructive"
                                onClick={() => setDeleteConfirmId(promo.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="text-xs text-muted-foreground py-2 px-3 pt-0">
                        <p className="font-medium text-foreground">
                          {promo.discount_type === 'percentage' 
                            ? `${promo.discount_value}% ${t('promotions.discount')}`
                            : `${promo.discount_value}€ ${t('promotions.discount')}`
                          }
                        </p>
                        <p>{promo.valid_from} - {promo.valid_until}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('promotions.deleteConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('promotions.deleteConfirmDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PromotionSettingsEmbedded;
