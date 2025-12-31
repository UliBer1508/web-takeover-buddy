import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  display_name: string;
  sort_order: number;
}

interface Season {
  id: string;
  name: string;
  display_name: string;
  sort_order: number;
}

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category_id: string;
  season_id: string;
  house_id: string | null;
  is_hero: boolean;
  sort_order: number;
  category?: { id: string; name: string; display_name: string };
  season?: { id: string; name: string; display_name: string };
}

interface ImageEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: GalleryImage | null;
  onSuccess?: () => void;
}

const ImageEditDialog = ({ open, onOpenChange, image, onSuccess }: ImageEditDialogProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [seasonId, setSeasonId] = useState("");

  // Helper function to get translated category name with fallback
  const getCategoryName = (cat: Category) => {
    const translated = t(`gallery.categories.${cat.name}`);
    return translated.startsWith('gallery.categories.') ? cat.display_name : translated;
  };

  // Helper function to get translated season name with fallback
  const getSeasonName = (season: Season) => {
    const translated = t(`gallery.seasons.${season.name}`);
    return translated.startsWith('gallery.seasons.') ? season.display_name : translated;
  };

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Category[];
    },
  });

  // Fetch seasons
  const { data: seasons = [] } = useQuery({
    queryKey: ["seasons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seasons")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Season[];
    },
  });

  // Reset form when image changes
  useEffect(() => {
    if (image) {
      setTitle(image.title);
      setCategoryId(image.category_id || "");
      // Set season from image, or default to "Ganzjährig" if not set
      if (image.season_id) {
        setSeasonId(image.season_id);
      } else {
        const allSeason = seasons.find(s => s.name === "all");
        if (allSeason) setSeasonId(allSeason.id);
      }
    }
  }, [image, seasons]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!image) return;
      
      const { error } = await supabase
        .from("gallery_images")
        .update({
          title,
          category_id: categoryId,
          season_id: seasonId,
        })
        .eq("id", image.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
      toast({
        title: t('imageEdit.updated'),
        description: t('imageEdit.updatedDesc'),
      });
      onSuccess?.();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: t('imageEdit.error'),
        description: error.message || t('imageEdit.errorDesc'),
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: t('imageEdit.titleRequired'),
        description: t('imageEdit.titleRequiredDesc'),
        variant: "destructive",
      });
      return;
    }
    if (!categoryId) {
      toast({
        title: t('imageEdit.categoryRequired'),
        description: t('imageEdit.categoryRequiredDesc'),
        variant: "destructive",
      });
      return;
    }
    if (!seasonId) {
      toast({
        title: t('imageEdit.seasonRequired'),
        description: t('imageEdit.seasonRequiredDesc'),
        variant: "destructive",
      });
      return;
    }
    updateMutation.mutate();
  };

  if (!image) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('imageEdit.title')}</DialogTitle>
          <DialogDescription>
            {t('imageEdit.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview */}
          <div className="aspect-video overflow-hidden rounded-lg">
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">{t('imageEdit.titleLabel')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('imageEdit.titlePlaceholder')}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>{t('imageEdit.category')}</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder={t('imageEdit.categoryPlaceholder')} />
              </SelectTrigger>
              <SelectContent className="bg-background">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {getCategoryName(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Season */}
          <div className="space-y-2">
            <Label>{t('imageEdit.season')}</Label>
            <Select value={seasonId} onValueChange={setSeasonId}>
              <SelectTrigger>
                <SelectValue placeholder={t('imageEdit.seasonPlaceholder')} />
              </SelectTrigger>
              <SelectContent className="bg-background">
                {seasons.map((season) => (
                  <SelectItem key={season.id} value={season.id}>
                    {getSeasonName(season)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('imageEdit.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t('imageEdit.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditDialog;