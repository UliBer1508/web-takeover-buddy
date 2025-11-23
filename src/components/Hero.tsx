import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-chalet.jpg";

const Hero = () => {
  const [heroImageSrc, setHeroImageSrc] = useState(() => {
    const savedHero = localStorage.getItem('hero_image');
    const savedImages = localStorage.getItem('gallery_images');
    
    // Check if saved hero image exists and is still in gallery
    if (savedHero && savedImages) {
      try {
        const images = JSON.parse(savedImages);
        const heroExists = images.some((img: { src: string }) => img.src === savedHero);
        if (heroExists) return savedHero;
      } catch (e) {
        console.error('Error parsing gallery images:', e);
      }
    }
    
    // Fallback: First image from gallery
    if (savedImages) {
      try {
        const images = JSON.parse(savedImages);
        if (images.length > 0) return images[0].src;
      } catch (e) {
        console.error('Error parsing gallery images:', e);
      }
    }
    
    // Last fallback: Original imported image
    return heroImage;
  });

  useEffect(() => {
    const handleHeroChange = () => {
      const newHero = localStorage.getItem('hero_image');
      if (newHero) setHeroImageSrc(newHero);
    };
    
    window.addEventListener('heroImageChanged', handleHeroChange);
    return () => window.removeEventListener('heroImageChanged', handleHeroChange);
  }, []);
  const scrollToBooking = () => {
    const element = document.getElementById("booking");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImageSrc}
          alt="Steinbock Chalet in den Alpen"
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Hero image failed to load:', heroImageSrc);
            e.currentTarget.src = heroImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/30 to-foreground/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 drop-shadow-2xl">
          Steinbock Chalet
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-8 md:mb-12 max-w-2xl mx-auto drop-shadow-lg">
          Luxuriöser Alpen-Rückzugsort mit atemberaubendem Bergpanorama
        </p>
        <Button
          onClick={scrollToBooking}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-base md:text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          Jetzt Buchen
        </Button>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={() => {
          const element = document.getElementById("about");
          if (element) element.scrollIntoView({ behavior: "smooth" });
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce cursor-pointer hover:scale-110 transition-transform"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
};

export default Hero;
