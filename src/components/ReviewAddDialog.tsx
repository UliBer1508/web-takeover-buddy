import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Languages, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface ReviewAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReviewAddDialog = ({ open, onOpenChange }: ReviewAddDialogProps) => {
  const { t } = useTranslation();
  const [guestName, setGuestName] = useState("");
  const [reviewDate, setReviewDate] = useState(new Date().toISOString().split('T')[0]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [textEn, setTextEn] = useState("");
  const [loading, setLoading] = useState(false);
  const [translatingToEn, setTranslatingToEn] = useState(false);
  const [translatingToDe, setTranslatingToDe] = useState(false);
  
  const queryClient = useQueryClient();

  const translateToEnglish = async () => {
    if (!text.trim()) return;
    setTranslatingToEn(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate-review', {
        body: { text, targetLanguage: 'en' }
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setTextEn(data.translatedText);
      toast({ title: t('reviewEdit.translated'), description: t('reviewEdit.translatedToEn') });
    } catch (error) {
      console.error('Translation error:', error);
      toast({ title: t('common.error'), description: t('reviewEdit.translateError'), variant: "destructive" });
    }
    setTranslatingToEn(false);
  };

  const translateToGerman = async () => {
    if (!textEn.trim()) return;
    setTranslatingToDe(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate-review', {
        body: { text: textEn, targetLanguage: 'de' }
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setText(data.translatedText);
      toast({ title: t('reviewEdit.translated'), description: t('reviewEdit.translatedToDe') });
    } catch (error) {
      console.error('Translation error:', error);
      toast({ title: t('common.error'), description: t('reviewEdit.translateError'), variant: "destructive" });
    }
    setTranslatingToDe(false);
  };

  const handleSave = async () => {
    if (!guestName.trim() || !text.trim()) {
      toast({ title: t('reviewAdd.error'), description: t('reviewAdd.fillAllFields'), variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('reviews')
      .insert({
        guest_name: guestName,
        review_date: reviewDate,
        rating,
        text,
        text_en: textEn || null,
        is_visible: true,
        sort_order: 0,
      });

    setLoading(false);
    
    if (error) {
      toast({ title: t('reviewAdd.error'), description: t('reviewAdd.errorCreate'), variant: "destructive" });
    } else {
      toast({ title: t('reviewAdd.created'), description: t('reviewAdd.createdDesc') });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      onOpenChange(false);
      // Reset form
      setGuestName("");
      setText("");
      setTextEn("");
      setRating(5);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('reviewAdd.title')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="guestName">{t('reviewAdd.name')}</Label>
            <Input
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder={t('reviewAdd.namePlaceholder')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reviewDate">{t('reviewAdd.date')}</Label>
            <Input
              id="reviewDate"
              type="date"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t('reviewAdd.rating')}</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 touch-manipulation"
                >
                  <Star
                    className={`w-6 h-6 ${star <= rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="text">{t('reviewAdd.text')}</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={translateToEnglish}
                disabled={translatingToEn || !text.trim()}
                className="h-7 px-2 text-xs"
              >
                {translatingToEn ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Languages className="h-3 w-3 mr-1" />}
                → EN
              </Button>
            </div>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder={t('reviewAdd.textPlaceholder')}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="textEn">{t('reviewAdd.textEnglish')}</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={translateToGerman}
                disabled={translatingToDe || !textEn.trim()}
                className="h-7 px-2 text-xs"
              >
                {translatingToDe ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Languages className="h-3 w-3 mr-1" />}
                → DE
              </Button>
            </div>
            <Textarea
              id="textEn"
              value={textEn}
              onChange={(e) => setTextEn(e.target.value)}
              rows={4}
              placeholder={t('reviewAdd.textEnglishPlaceholder')}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('reviewAdd.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? t('reviewEdit.saving') : t('reviewAdd.add')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewAddDialog;
