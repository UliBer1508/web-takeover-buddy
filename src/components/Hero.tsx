import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import heroImageFallback from "@/assets/exterior-winter.jpg";

const Hero = () => {
  // Fetch hero image from Supabase
  const { data: heroImage } = useQuery({
    queryKey: ['hero-image'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('url')
        .eq('is_hero', true)
        .limit(1)
        .single();
      
      if (error || !data) {
        // Fallback to first image if no hero is set
        const { data: firstImage } = await supabase
          .from('gallery_images')
          .select('url')
          .order('sort_order', { ascending: true })
          .limit(1)
          .single();
        
        return firstImage?.url || null;
      }
      
      return data.url;
    },
  });

  const heroImageSrc = heroImage || heroImageFallback;

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
            e.currentTarget.src = heroImageFallback;
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
