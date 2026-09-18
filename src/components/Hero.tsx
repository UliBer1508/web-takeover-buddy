import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

interface HeroProps {
  /** Aktuell gewaehltes Haus. Ohne Angabe verhaelt sich der Hero wie bisher. */
  houseId?: string | null;
  houseName?: string | null;
  houseSubtitle?: string | null;
  /** Erst ab zwei Haeusern wird der Hausname als Ueberschrift gezeigt. */
  showHouseName?: boolean;
}

const Hero = ({ houseId, houseName, houseSubtitle, showHouseName = false }: HeroProps) => {
  const { t } = useTranslation();

  // Hero-Bild je Haus. Reihenfolge der Versuche:
  // 1. als Hero markiertes Bild dieses Hauses
  // 2. erstes Galeriebild dieses Hauses
  // 3. global als Hero markiertes Bild (alter Zustand, ein Haus)
  const { data: heroImage, isLoading } = useQuery({
    queryKey: ['hero-image', houseId],
    queryFn: async () => {
      if (houseId) {
        const { data: ownHero } = await supabase
          .from('gallery_images')
          .select('url')
          .eq('house_id', houseId)
          .eq('is_hero', true)
          .maybeSingle();
        if (ownHero?.url) return ownHero.url;

        const { data: firstOfHouse } = await supabase
          .from('gallery_images')
          .select('url')
          .eq('house_id', houseId)
          .order('sort_order', { ascending: true })
          .limit(1)
          .maybeSingle();
        if (firstOfHouse?.url) return firstOfHouse.url;
      }

      const { data: globalHero } = await supabase
        .from('gallery_images')
        .select('url')
        .eq('is_hero', true)
        .limit(1)
        .maybeSingle();
      return globalHero?.url || null;
    },
  });

  const scrollToBooking = () => {
    const element = document.getElementById("booking");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const title = showHouseName && houseName ? houseName : t("hero.title");
  const subtitle = showHouseName && houseSubtitle ? houseSubtitle : t("hero.subtitle");

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {heroImage ? (
          <>
            <img
              src={heroImage}
              alt={t("hero.altImage")}
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/30 to-foreground/60" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/40 via-secondary/30 to-accent/20">
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-transparent to-foreground/40" />
          </div>
        )}
      </div>

      {/* Small loader overlay */}
      {isLoading && (
        <div className="absolute top-20 right-6 z-20" aria-live="polite">
          <Loader2 className="h-5 w-5 animate-spin text-white/80" aria-label={t("hero.altImage")} />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 drop-shadow-2xl ${heroImage ? "text-white" : "text-foreground"}`}>
          {title}
        </h1>
        <p className={`text-lg sm:text-xl md:text-2xl mb-8 md:mb-12 max-w-2xl mx-auto drop-shadow-lg ${heroImage ? "text-white/95" : "text-muted-foreground"}`}>
          {subtitle}
        </p>
        <Button
          onClick={scrollToBooking}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-base md:text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          {t("hero.bookNow")}
        </Button>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={() => {
          const element = document.getElementById("about");
          if (element) element.scrollIntoView({ behavior: "smooth" });
        }}
        aria-label="Zur nächsten Sektion scrollen"
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer hover:scale-110 transition-transform ${heroImage ? "text-white" : "text-foreground"}`}
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
};

export default Hero;
