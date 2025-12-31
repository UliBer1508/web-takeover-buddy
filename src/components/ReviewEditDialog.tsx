import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface Review {
  id: string;
  guest_name: string;
  review_date: string;
  rating: number;
  text: string;
  is_visible: boolean;
  sort_order: number;
}

interface ReviewEditDialogProps {
  review: Review;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReviewEditDialog = ({ review, open, onOpenChange }: ReviewEditDialogProps) => {
  const { t } = useTranslation();
  const [guestName, setGuestName] = useState(review.guest_name);
  const [reviewDate, setReviewDate] = useState(review.review_date);
  const [rating, setRating] = useState(review.rating);
  const [text, setText] = useState(review.text);
  const [isVisible, setIsVisible] = useState(review.is_visible);
  const [loading, setLoading] = useState(false);
  
  const queryClient = useQueryClient();

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('reviews')
      .update({
        guest_name: guestName,
        review_date: reviewDate,
        rating,
        text,
        is_visible: isVisible,
      })
      .eq('id', review.id);

    setLoading(false);
    
    if (error) {
      toast({ title: t('common.error'), description: t('reviewEdit.errorSave'), variant: "destructive" });
    } else {
      toast({ title: t('reviewEdit.saved'), description: t('reviewEdit.savedDesc') });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      onOpenChange(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t('reviewEdit.confirmDelete'))) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', review.id);

    setLoading(false);
    
    if (error) {
      toast({ title: t('common.error'), description: t('reviewEdit.errorDelete'), variant: "destructive" });
    } else {
      toast({ title: t('reviewEdit.deleted'), description: t('reviewEdit.deletedDesc') });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('reviewEdit.title')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="guestName">{t('reviewEdit.name')}</Label>
            <Input
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reviewDate">{t('reviewEdit.date')}</Label>
            <Input
              id="reviewDate"
              type="date"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t('reviewEdit.rating')}</Label>
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
            <Label htmlFor="text">{t('reviewEdit.text')}</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isVisible"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="isVisible">{t('reviewEdit.visible')}</Label>
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {t('reviewEdit.delete')}
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? t('reviewEdit.saving') : t('reviewEdit.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewEditDialog;