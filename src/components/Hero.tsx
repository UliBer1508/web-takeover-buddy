import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import defaultHeroImage from "@/assets/hero-chalet-winter.jpg";

const Hero = () => {
  const [heroImage, setHeroImage] = useState(defaultHeroImage);

  // Load hero image from localStorage
  useEffect(() => {
    const savedHeroImage = localStorage.getItem("heroImage");
    if (savedHeroImage) {
      try {
        const parsed = JSON.parse(savedHeroImage);
        setHeroImage(parsed.src);
      } catch (e) {
        console.error("Error loading hero image:", e);
        setHeroImage(defaultHeroImage);
      }
    }
  }, []);

  // Listen for localStorage changes (when hero image is updated from Gallery)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedHeroImage = localStorage.getItem("heroImage");
      if (savedHeroImage) {
        try {
          const parsed = JSON.parse(savedHeroImage);
          setHeroImage(parsed.src);
        } catch (e) {
          console.error("Error loading hero image:", e);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also listen for custom event for same-page updates
    const handleHeroImageUpdate = () => {
      handleStorageChange();
    };
    window.addEventListener("heroImageUpdated", handleHeroImageUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("heroImageUpdated", handleHeroImageUpdate);
    };
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
          src={heroImage}
          alt="Steinbock Chalet in den Alpen"
          className="w-full h-full object-cover"
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
