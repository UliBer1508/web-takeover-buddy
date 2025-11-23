import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ChevronLeft, ChevronRight, X, Trash2, Star, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

import heroImage from "@/assets/hero-chalet.jpg";
import exteriorWinter from "@/assets/exterior-winter.jpg";
import exteriorFrontGarage from "@/assets/exterior-front-garage.jpg";
import exteriorFrontView from "@/assets/exterior-front-view.jpg";
import terrace from "@/assets/terrace.jpg";
import balconyMountainView from "@/assets/balcony-mountain-view.jpg";
import balconyTerrace from "@/assets/balcony-terrace.jpg";
import balconyInteriorView from "@/assets/balcony-interior-view.jpg";
import skiRoom from "@/assets/ski-room.jpg";

// Real chalet images - Living & Dining
import livingDiningOpen from "@/assets/living-dining-open.jpg";
import diningTableView from "@/assets/dining-table-view.jpg";
import diningCornerWindow from "@/assets/dining-corner-window.jpg";
import diningPanorama from "@/assets/dining-panorama.jpg";
import livingFireplace from "@/assets/living-fireplace.jpg";
import livingFireplaceTV from "@/assets/living-fireplace-tv.jpg";

// Kitchen
import kitchenOak from "@/assets/kitchen-oak.jpg";

// Bedrooms
import bedroomMountainView from "@/assets/bedroom-mountain-view.jpg";
import bedroomBalcony from "@/assets/bedroom-balcony.jpg";
import bedroomDoorOpen from "@/assets/bedroom-door-open.jpg";
import bedroomDetail from "@/assets/bedroom-detail.jpg";

// Bathrooms
import bathroomMain from "@/assets/bathroom-main.jpg";
import bathroomShower from "@/assets/bathroom-shower.jpg";
import bathroomMirror from "@/assets/bathroom-mirror.jpg";
import bathroomGuest from "@/assets/bathroom-guest.jpg";

// Wellness & Entrance
import saunaInterior from "@/assets/sauna-interior.jpg";
import hallwayStairs from "@/assets/hallway-stairs.jpg";

const galleryImages = [
  // Außenbereich
  { src: heroImage, title: "Außenansicht Sommer", category: "Außenbereich" },
  { src: exteriorWinter, title: "Außenansicht Winter", category: "Außenbereich" },
  { src: exteriorFrontGarage, title: "Chalet mit Garage", category: "Außenbereich" },
  { src: exteriorFrontView, title: "Frontansicht des Chalets", category: "Außenbereich" },
  { src: terrace, title: "Terrasse mit Bergblick", category: "Außenbereich" },
  { src: balconyMountainView, title: "Balkon mit Bergpanorama", category: "Außenbereich" },
  { src: balconyTerrace, title: "Sonnenterrasse", category: "Außenbereich" },
  { src: balconyInteriorView, title: "Balkon mit Innenansicht", category: "Außenbereich" },
  
  // Wohn- & Essbereich
  { src: livingDiningOpen, title: "Offener Wohn-/Essbereich", category: "Wohn- & Essbereich" },
  { src: diningTableView, title: "Essbereich mit gedecktem Tisch", category: "Wohn- & Essbereich" },
  { src: diningCornerWindow, title: "Essbereich mit Eckfenster", category: "Wohn- & Essbereich" },
  { src: diningPanorama, title: "Essbereich mit Panoramablick", category: "Wohn- & Essbereich" },
  { src: livingFireplace, title: "Wohnzimmer mit Kamin", category: "Wohn- & Essbereich" },
  { src: livingFireplaceTV, title: "Gemütlicher Wohnbereich", category: "Wohn- & Essbereich" },
  
  // Küche
  { src: kitchenOak, title: "Küche mit Eichenfronten", category: "Küche" },
  
  // Schlafzimmer
  { src: bedroomMountainView, title: "Schlafzimmer mit Bergblick", category: "Schlafzimmer" },
  { src: bedroomBalcony, title: "Schlafzimmer mit Balkonzugang", category: "Schlafzimmer" },
  { src: bedroomDoorOpen, title: "Gemütliches Schlafzimmer", category: "Schlafzimmer" },
  { src: bedroomDetail, title: "Schlafzimmer Detail", category: "Schlafzimmer" },
  
  // Badezimmer
  { src: bathroomMain, title: "Hauptbadezimmer", category: "Badezimmer" },
  { src: bathroomShower, title: "Badezimmer mit Dusche", category: "Badezimmer" },
  { src: bathroomMirror, title: "Elegantes Badezimmer", category: "Badezimmer" },
  { src: bathroomGuest, title: "Gäste-WC", category: "Badezimmer" },
  
  // Wellness
  { src: saunaInterior, title: "Finnische Sauna", category: "Wellness" },
  
  // Ausstattung
  { src: skiRoom, title: "Skiraum mit Ausrüstung", category: "Ausstattung" },
  
  // Eingangsbereich
  { src: hallwayStairs, title: "Eingangsbereich mit Treppe", category: "Eingangsbereich" },
];

const Gallery = () => {
  const [images, setImages] = useState(() => {
    const saved = localStorage.getItem('gallery_images');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge new images from galleryImages that aren't in saved list
        const savedSrcs = new Set(parsed.map((img: any) => img.src));
        const newImages = galleryImages.filter(img => !savedSrcs.has(img.src));
        return [...parsed, ...newImages];
      } catch (e) {
        console.error('Error parsing gallery images:', e);
      }
    }
    return galleryImages;
  });

  const [heroImageSrc, setHeroImageSrc] = useState(() => {
    return localStorage.getItem('hero_image') || heroImage;
  });

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [imageToDelete, setImageToDelete] = useState<typeof images[0] | null>(null);

  useEffect(() => {
    localStorage.setItem('gallery_images', JSON.stringify(images));
  }, [images]);

  useEffect(() => {
    localStorage.setItem('hero_image', heroImageSrc);
    window.dispatchEvent(new Event('heroImageChanged'));
  }, [heroImageSrc]);

  const handleSetHero = (imageSrc: string) => {
    setHeroImageSrc(imageSrc);
    toast({
      title: "⭐ Hero-Bild aktualisiert",
      description: "Das Bild wird nun auf der Startseite angezeigt.",
    });
  };

  const confirmDelete = (image: typeof images[0]) => {
    if (image.src === heroImageSrc) {
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
      const newImages = images.filter(img => img.src !== imageToDelete.src);
      
      // Safety check: If deleted image was somehow the hero (shouldn't happen), reset to first image
      if (imageToDelete.src === heroImageSrc && newImages.length > 0) {
        const newHero = newImages[0].src;
        setHeroImageSrc(newHero);
        localStorage.setItem('hero_image', newHero);
      }
      
      setImages(newImages);
      toast({
        title: "✓ Bild gelöscht",
        description: "Das Bild wurde aus der Galerie entfernt.",
      });
      setImageToDelete(null);
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

  return (
    <section id="galerie" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Bildergalerie</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Entdecken Sie die luxuriöse Ausstattung und die atemberaubende Lage unseres Chalets
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg cursor-pointer aspect-[4/3] animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Icon Overlay */}
              <div className="absolute top-2 left-2 right-2 flex justify-between opacity-0 md:group-hover:opacity-100 opacity-100 md:opacity-0 transition-opacity z-10">
                {/* Stern-Icon links */}
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handleSetHero(image.src); 
                  }}
                  className="bg-black/60 hover:bg-black/80 backdrop-blur-sm p-2 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Als Hero-Bild setzen"
                >
                  {heroImageSrc === image.src ? (
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
                  disabled={images.length <= 1}
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
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 text-white hover:text-accent transition-colors"
          >
            <X className="h-8 w-8" />
          </button>

          {selectedImageIndex !== null && (
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
                  src={images[selectedImageIndex].src}
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
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default Gallery;
