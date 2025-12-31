import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ChevronLeft, ChevronRight, X, Trash2, Star, StarOff, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ImageUploadDialog from "./ImageUploadDialog";

// Import all existing assets
import exteriorWinter from "@/assets/exterior-winter.jpg";
import exteriorFrontGarage from "@/assets/exterior-front-garage.jpg";
import exteriorFrontView from "@/assets/exterior-front-view.jpg";
import terrace from "@/assets/terrace.jpg";
import balconyMountainView from "@/assets/balcony-mountain-view.jpg";
import balconyTerrace from "@/assets/balcony-terrace.jpg";
import balconyInteriorView from "@/assets/balcony-interior-view.jpg";
import livingDiningOpen from "@/assets/living-dining-open.jpg";
import diningTableView from "@/assets/dining-table-view.jpg";
import diningCornerWindow from "@/assets/dining-corner-window.jpg";
import diningPanorama from "@/assets/dining-panorama.jpg";
import livingFireplace from "@/assets/living-fireplace.jpg";
import livingFireplaceTV from "@/assets/living-fireplace-tv.jpg";
import kitchenOak from "@/assets/kitchen-oak.jpg";
import bedroomMountainView from "@/assets/bedroom-mountain-view.jpg";
import bedroomBalcony from "@/assets/bedroom-balcony.jpg";
import bedroomDoorOpen from "@/assets/bedroom-door-open.jpg";
import bedroomDetail from "@/assets/bedroom-detail.jpg";
import bathroomMain from "@/assets/bathroom-main.jpg";
import bathroomShower from "@/assets/bathroom-shower.jpg";
import bathroomMirror from "@/assets/bathroom-mirror.jpg";
import bathroomGuest from "@/assets/bathroom-guest.jpg";
import saunaInterior from "@/assets/sauna-interior.jpg";
import skiRoom from "@/assets/ski-room.jpg";
import hallwayStairs from "@/assets/hallway-stairs.jpg";

// Default images from assets (used as fallback and initial data)
const defaultImages = [
  { id: "default-1", url: exteriorWinter, title: "Außenansicht Winter", category: "Außenbereich", is_hero: true, sort_order: 1, is_default: true },
  { id: "default-2", url: exteriorFrontGarage, title: "Chalet mit Garage", category: "Außenbereich", is_hero: false, sort_order: 2, is_default: true },
  { id: "default-3", url: exteriorFrontView, title: "Frontansicht des Chalets", category: "Außenbereich", is_hero: false, sort_order: 3, is_default: true },
  { id: "default-4", url: terrace, title: "Terrasse mit Bergblick", category: "Außenbereich", is_hero: false, sort_order: 4, is_default: true },
  { id: "default-5", url: balconyMountainView, title: "Balkon mit Bergpanorama", category: "Außenbereich", is_hero: false, sort_order: 5, is_default: true },
  { id: "default-6", url: balconyTerrace, title: "Sonnenterrasse", category: "Außenbereich", is_hero: false, sort_order: 6, is_default: true },
  { id: "default-7", url: balconyInteriorView, title: "Balkon mit Innenansicht", category: "Außenbereich", is_hero: false, sort_order: 7, is_default: true },
  { id: "default-8", url: livingDiningOpen, title: "Offener Wohn-/Essbereich", category: "Wohn- & Essbereich", is_hero: false, sort_order: 8, is_default: true },
  { id: "default-9", url: diningTableView, title: "Essbereich mit gedecktem Tisch", category: "Wohn- & Essbereich", is_hero: false, sort_order: 9, is_default: true },
  { id: "default-10", url: diningCornerWindow, title: "Essbereich mit Eckfenster", category: "Wohn- & Essbereich", is_hero: false, sort_order: 10, is_default: true },
  { id: "default-11", url: diningPanorama, title: "Essbereich mit Panoramablick", category: "Wohn- & Essbereich", is_hero: false, sort_order: 11, is_default: true },
  { id: "default-12", url: livingFireplace, title: "Wohnzimmer mit Kamin", category: "Wohn- & Essbereich", is_hero: false, sort_order: 12, is_default: true },
  { id: "default-13", url: livingFireplaceTV, title: "Gemütlicher Wohnbereich", category: "Wohn- & Essbereich", is_hero: false, sort_order: 13, is_default: true },
  { id: "default-14", url: kitchenOak, title: "Küche mit Eichenfronten", category: "Küche", is_hero: false, sort_order: 14, is_default: true },
  { id: "default-15", url: bedroomMountainView, title: "Schlafzimmer mit Bergblick", category: "Schlafzimmer", is_hero: false, sort_order: 15, is_default: true },
  { id: "default-16", url: bedroomBalcony, title: "Schlafzimmer mit Balkonzugang", category: "Schlafzimmer", is_hero: false, sort_order: 16, is_default: true },
  { id: "default-17", url: bedroomDoorOpen, title: "Gemütliches Schlafzimmer", category: "Schlafzimmer", is_hero: false, sort_order: 17, is_default: true },
  { id: "default-18", url: bedroomDetail, title: "Schlafzimmer Detail", category: "Schlafzimmer", is_hero: false, sort_order: 18, is_default: true },
  { id: "default-19", url: bathroomMain, title: "Hauptbadezimmer", category: "Badezimmer", is_hero: false, sort_order: 19, is_default: true },
  { id: "default-20", url: bathroomShower, title: "Badezimmer mit Dusche", category: "Badezimmer", is_hero: false, sort_order: 20, is_default: true },
  { id: "default-21", url: bathroomMirror, title: "Elegantes Badezimmer", category: "Badezimmer", is_hero: false, sort_order: 21, is_default: true },
  { id: "default-22", url: bathroomGuest, title: "Gäste-WC", category: "Badezimmer", is_hero: false, sort_order: 22, is_default: true },
  { id: "default-23", url: saunaInterior, title: "Finnische Sauna", category: "Wellness", is_hero: false, sort_order: 23, is_default: true },
  { id: "default-24", url: skiRoom, title: "Skiraum mit Ausrüstung", category: "Ausstattung", is_hero: false, sort_order: 24, is_default: true },
  { id: "default-25", url: hallwayStairs, title: "Eingangsbereich mit Treppe", category: "Eingangsbereich", is_hero: false, sort_order: 25, is_default: true },
];

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
  is_hero: boolean;
  sort_order: number;
  is_default?: boolean;
}

const Gallery = () => {
  const queryClient = useQueryClient();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [heroImageId, setHeroImageId] = useState<string>("default-1");

  // Fetch images from Supabase, merge with defaults
  const { data: images = defaultImages, isLoading } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      
      // If database has images, use them + defaults
      const dbImages = (data || []).map(img => ({ ...img, is_default: false }));
      
      // Combine: DB images first (if any), then defaults
      if (dbImages.length > 0) {
        // Check if any DB image is hero
        const dbHero = dbImages.find(img => img.is_hero);
        if (dbHero) {
          setHeroImageId(dbHero.id);
          // Mark all defaults as non-hero
          return [...dbImages, ...defaultImages.map(img => ({ ...img, is_hero: false }))];
        }
      }
      
      // Use defaults with first as hero
      return defaultImages;
    },
  });

  // Set hero mutation (only for DB images)
  const setHeroMutation = useMutation({
    mutationFn: async (image: GalleryImage) => {
      if (image.is_default) {
        // For default images, just update local state
        setHeroImageId(image.id);
        return;
      }
      
      // First, unset all hero images in DB
      await supabase
        .from('gallery_images')
        .update({ is_hero: false })
        .eq('is_hero', true);

      // Then set the new hero
      const { error } = await supabase
        .from('gallery_images')
        .update({ is_hero: true })
        .eq('id', image.id);
      
      if (error) throw error;
      setHeroImageId(image.id);
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

  // Delete mutation (only for DB images)
  const deleteMutation = useMutation({
    mutationFn: async (image: GalleryImage) => {
      if (image.is_default) {
        throw new Error("Standard-Bilder können nicht gelöscht werden.");
      }
      
      // Extract filename from URL
      const urlParts = image.url.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // Delete from storage
      await supabase.storage
        .from('gallery')
        .remove([fileName]);

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
      setImageToDelete(null);
    },
  });

  const handleSetHero = (image: GalleryImage) => {
    setHeroMutation.mutate(image);
  };

  const isCurrentHero = (image: GalleryImage) => {
    return image.id === heroImageId || image.is_hero;
  };

  const confirmDelete = (image: GalleryImage) => {
    if (image.is_default) {
      toast({
        title: "⚠️ Aktion nicht möglich",
        description: "Standard-Bilder können nicht gelöscht werden.",
        variant: "destructive",
      });
      return;
    }
    
    if (isCurrentHero(image)) {
      toast({
        title: "⚠️ Aktion nicht möglich",
        description: "Das aktuelle Hero-Bild kann nicht gelöscht werden. Bitte wählen Sie zuerst ein anderes Hero-Bild.",
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

  // Get the current hero image URL for the Hero component
  const currentHeroImage = images.find(img => isCurrentHero(img));

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg cursor-pointer aspect-[4/3] animate-fade-in-up"
              style={{ animationDelay: `${Math.min(index, 10) * 0.1}s` }}
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
                  {isCurrentHero(image) ? (
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ) : (
                    <StarOff className="w-5 h-5 text-white" />
                  )}
                </button>
                
                {/* Trash-Icon rechts - only for non-default images */}
                {!image.is_default && (
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      confirmDelete(image); 
                    }}
                    className="bg-black/60 hover:bg-red-600/80 backdrop-blur-sm p-2 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                    disabled={deleteMutation.isPending}
                    aria-label="Bild löschen"
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                )}
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
