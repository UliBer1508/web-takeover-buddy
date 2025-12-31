import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ChevronLeft, ChevronRight, X, Trash2, Star, StarOff, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ImageUploadDialog from "./ImageUploadDialog";

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
  is_hero: boolean;
  sort_order: number;
}

const Gallery = () => {
  const queryClient = useQueryClient();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Fetch images from Supabase
  const { data: images = [], isLoading } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as GalleryImage[];
    },
  });

  // Set hero mutation
  const setHeroMutation = useMutation({
    mutationFn: async (imageId: string) => {
      // First, unset all hero images
      const { error: unsetError } = await supabase
        .from('gallery_images')
        .update({ is_hero: false })
        .eq('is_hero', true);
      
      if (unsetError) throw unsetError;

      // Then set the new hero
      const { error: setError } = await supabase
        .from('gallery_images')
        .update({ is_hero: true })
        .eq('id', imageId);
      
      if (setError) throw setError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      queryClient.invalidateQueries({ queryKey: ['hero-image'] });
      toast({
        title: "⭐ Hero-Bild aktualisiert",
        description: "Das Bild wird nun auf der Startseite angezeigt.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Fehler",
        description: error.message || "Das Hero-Bild konnte nicht gesetzt werden.",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (image: GalleryImage) => {
      // Extract filename from URL
      const urlParts = image.url.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([fileName]);
      
      if (storageError) {
        console.warn('Storage delete warning:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', image.id);
      
      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      queryClient.invalidateQueries({ queryKey: ['hero-image'] });
      toast({
        title: "✓ Bild gelöscht",
        description: "Das Bild wurde aus der Galerie entfernt.",
      });
      setImageToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "Fehler",
        description: error.message || "Das Bild konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    },
  });

  const handleSetHero = (image: GalleryImage) => {
    setHeroMutation.mutate(image.id);
  };

  const confirmDelete = (image: GalleryImage) => {
    if (image.is_hero) {
      toast({
        title: "⚠️ Aktion nicht möglich",
        description: "Das aktuelle Hero-Bild kann nicht gelöscht werden. Bitte wählen Sie zuerst ein anderes Hero-Bild.",
        variant: "destructive",
      });
      return;
    }
    
    if (images.length <= 1) {
      toast({
        title: "⚠️ Aktion nicht möglich",
        description: "Mindestens ein Bild muss in der Galerie bleiben.",
        variant: "destructive",
      });
      return;
    }
    
    setImageToDelete(image);
  };

  const handleDelete = () => {
    if (imageToDelete) {
      deleteMutation.mutate(imageToDelete);
    }
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const goToPrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
    }
  };

  const goToNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % images.length);
    }
  };

  if (isLoading) {
    return (
      <section id="galerie" className="py-20 bg-background">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section id="galerie" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Bildergalerie</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Entdecken Sie die luxuriöse Ausstattung und die atemberaubende Lage unseres Chalets
          </p>
        </div>

        {/* Upload Button */}
        <div className="flex justify-end mb-6">
          <Button onClick={() => setUploadDialogOpen(true)} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Bild hinzufügen
          </Button>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Noch keine Bilder in der Galerie.</p>
            <Button onClick={() => setUploadDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Erstes Bild hochladen
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg cursor-pointer aspect-[4/3] animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Icon Overlay */}
                <div className="absolute top-2 left-2 right-2 flex justify-between opacity-0 md:group-hover:opacity-100 opacity-100 md:opacity-0 transition-opacity z-10">
                  {/* Stern-Icon links */}
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleSetHero(image); 
                    }}
                    className="bg-black/60 hover:bg-black/80 backdrop-blur-sm p-2 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Als Hero-Bild setzen"
                    disabled={setHeroMutation.isPending}
                  >
                    {image.is_hero ? (
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ) : (
                      <StarOff className="w-5 h-5 text-white" />
                    )}
                  </button>
                  
                  {/* Trash-Icon rechts */}
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      confirmDelete(image); 
                    }}
                    className="bg-black/60 hover:bg-red-600/80 backdrop-blur-sm p-2 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                    disabled={images.length <= 1 || deleteMutation.isPending}
                    aria-label="Bild löschen"
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="text-sm font-medium text-accent">{image.category}</p>
                    <p className="text-lg font-semibold">{image.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <ImageUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['gallery-images'] })}
      />

      {/* Lightbox Dialog */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 text-white hover:text-accent transition-colors"
          >
            <X className="h-8 w-8" />
          </button>

          {selectedImageIndex !== null && images[selectedImageIndex] && (
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:text-accent hover:bg-white/10"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              <div className="flex flex-col items-center justify-center max-w-full max-h-full">
                <img
                  src={images[selectedImageIndex].url}
                  alt={images[selectedImageIndex].title}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
                <div className="text-white text-center mt-4">
                  <p className="text-sm text-accent">{images[selectedImageIndex].category}</p>
                  <p className="text-xl font-semibold">{images[selectedImageIndex].title}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedImageIndex + 1} / {images.length}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:text-accent hover:bg-white/10"
                onClick={goToNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={imageToDelete !== null} onOpenChange={() => setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bild löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie das Bild "{imageToDelete?.title}" wirklich aus der Galerie entfernen? 
              Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird gelöscht...
                </>
              ) : (
                "Löschen"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default Gallery;
