import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

interface House {
  id: string;
  name: string;
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
  house_id: z.string().optional(),
  is_active: z.boolean(),
});

type PromotionFormData = z.infer<typeof promotionSchema>;

interface PromotionSettingsDialogProps {
  trigger?: React.ReactNode;
}

const PromotionSettingsDialog = ({ trigger }: PromotionSettingsDialogProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data: promotions = [], isLoading } = useQuery({
    queryKey: ['all-promotions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as Promotion[];
    },
    enabled: open,
  });

  const { data: houses = [] } = useQuery({
    queryKey: ['houses-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('houses')
        .select('id, name')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as House[];
    },
    enabled: open,
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
      house_id: "__all__",
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
      house_id: "__all__",
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
      house_id: promo.house_id || "__all__",
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
        house_id: data.house_id === "__all__" ? null : (data.house_id || null),
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

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="outline" size="sm" className="gap-2">
              <Tag className="h-4 w-4" />
              {t('promotions.manage')}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              {t('promotions.title')}
            </DialogTitle>
            <DialogDescription>
              {t('promotions.description')}
            </DialogDescription>
          </DialogHeader>

          {showForm ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                    name="house_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('promotions.house')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('promotions.allHouses')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="__all__">{t('promotions.allHouses')}</SelectItem>
                            {houses.map((house) => (
                              <SelectItem key={house.id} value={house.id}>
                                {house.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? t('common.loading') : t('common.save')}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <Button onClick={() => setShowForm(true)} className="w-full gap-2">
                <Plus className="h-4 w-4" />
                {t('promotions.add')}
              </Button>

              <ScrollArea className="h-[400px]">
                <div className="space-y-3 pr-4">
                  {isLoading ? (
                    <p className="text-center text-muted-foreground py-8">{t('common.loading')}</p>
                  ) : promotions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">{t('promotions.empty')}</p>
                  ) : (
                    promotions.map((promo) => (
                      <Card key={promo.id} className={!promo.is_active ? "opacity-60" : ""}>
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-base">{promo.name}</CardTitle>
                              {isPromotionActive(promo) ? (
                                <Badge variant="default" className="text-xs">{t('promotions.activeNow')}</Badge>
                              ) : !promo.is_active ? (
                                <Badge variant="secondary" className="text-xs">{t('promotions.inactive')}</Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">{t('promotions.scheduled')}</Badge>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => startEditing(promo)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => setDeleteConfirmId(promo.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-1">
                          <p>{promo.description_de}</p>
                          <p className="font-medium text-foreground">
                            {promo.discount_type === 'percentage' 
                              ? `${promo.discount_value}% ${t('promotions.discount')}`
                              : `${promo.discount_value}€ ${t('promotions.discount')}`
                            }
                          </p>
                          <p className="text-xs">
                            {t('promotions.validPeriod')}: {promo.valid_from} - {promo.valid_until}
                          </p>
                          {promo.booking_start && promo.booking_end && (
                            <p className="text-xs">
                              {t('promotions.stayPeriod')}: {promo.booking_start} - {promo.booking_end}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>

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

export default PromotionSettingsDialog;
