import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import heroImage from "@/assets/hero-chalet.jpg";
import interiorLiving from "@/assets/interior-living.jpg";
import bedroom from "@/assets/bedroom.jpg";
import masterBedroom from "@/assets/master-bedroom.jpg";
import kitchen from "@/assets/kitchen.jpg";
import dining from "@/assets/dining.jpg";
import bathroom from "@/assets/bathroom.jpg";
import sauna from "@/assets/sauna.jpg";
import terrace from "@/assets/terrace.jpg";
import exteriorWinter from "@/assets/exterior-winter.jpg";

const galleryImages = [
  { src: heroImage, title: "Außenansicht Sommer", category: "Außenbereich" },
  { src: exteriorWinter, title: "Außenansicht Winter", category: "Außenbereich" },
  { src: interiorLiving, title: "Wohnbereich", category: "Innenräume" },
  { src: masterBedroom, title: "Master Schlafzimmer", category: "Schlafzimmer" },
  { src: bedroom, title: "Schlafzimmer", category: "Schlafzimmer" },
  { src: kitchen, title: "Küche", category: "Innenräume" },
  { src: dining, title: "Essbereich", category: "Innenräume" },
  { src: bathroom, title: "Badezimmer", category: "Innenräume" },
  { src: sauna, title: "Wellness & Sauna", category: "Wellness" },
  { src: terrace, title: "Terrasse", category: "Außenbereich" },
];

const Gallery = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const goToPrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  const goToNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % galleryImages.length);
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
          {galleryImages.map((image, index) => (
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
                  src={galleryImages[selectedImageIndex].src}
                  alt={galleryImages[selectedImageIndex].title}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
                <div className="text-white text-center mt-4">
                  <p className="text-sm text-accent">{galleryImages[selectedImageIndex].category}</p>
                  <p className="text-xl font-semibold">{galleryImages[selectedImageIndex].title}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedImageIndex + 1} / {galleryImages.length}
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
    </section>
  );
};

export default Gallery;
