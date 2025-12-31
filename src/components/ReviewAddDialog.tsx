import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface ReviewAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReviewAddDialog = ({ open, onOpenChange }: ReviewAddDialogProps) => {
  const [guestName, setGuestName] = useState("");
  const [reviewDate, setReviewDate] = useState(new Date().toISOString().split('T')[0]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  
  const queryClient = useQueryClient();

  const handleSave = async () => {
    if (!guestName.trim() || !text.trim()) {
      toast({ title: "Fehler", description: "Bitte alle Felder ausfüllen.", variant: "destructive" });
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
        is_visible: true,
        sort_order: 0,
      });

    setLoading(false);
    
    if (error) {
      toast({ title: "Fehler", description: "Bewertung konnte nicht erstellt werden.", variant: "destructive" });
    } else {
      toast({ title: "Erstellt", description: "Neue Bewertung wurde hinzugefügt." });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      onOpenChange(false);
      // Reset form
      setGuestName("");
      setText("");
      setRating(5);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Neue Bewertung</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="guestName">Name</Label>
            <Input
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="z.B. Familie Müller"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reviewDate">Datum</Label>
            <Input
              id="reviewDate"
              type="date"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Bewertung</Label>
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
            <Label htmlFor="text">Text</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Bewertungstext eingeben..."
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Speichern..." : "Hinzufügen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewAddDialog;
