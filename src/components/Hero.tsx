import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

interface HeroProps {
  /** Haus, dessen Titelbild gezeigt wird. Null = global markiertes Bild. */
  houseId?: string | null;
  title?: string | null;
  subtitle?: string | null;
  scrollTarget?: string;
  ctaLabel?: string | null;
  /**
   * Inhalt am unteren Rand des Titelbilds - bei zwei Haeusern stehen hier die
   * Chalet-Karten. Ist etwas gesetzt, entfallen Knopf und Pfeil: die Karten
   * sind dann der Weg weiter, alles andere waere doppelt.
   */
  bottomSlot?: ReactNode;
}

const Hero = ({
  houseId,
  title,
  subtitle,
  scrollTarget = "booking",
  ctaLabel,
  bottomSlot,
}: HeroProps) => {
  const { t } = useTranslation();

  // Hero-Bild je Haus. Reihenfolge der Versuche:
  // 1. als Hero markiertes Bild dieses Hauses
  // 2. erstes Galeriebild dieses Hauses
  // 3. global als Hero markiertes Bild
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

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

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
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/45 via-foreground/25 to-foreground/75" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/40 via-secondary/30 to-accent/20">
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-transparent to-foreground/50" />
          </div>
        )}
      </div>

      {isLoading && (
        <div className="absolute top-20 right-6 z-20" aria-live="polite">
          <Loader2 className="h-5 w-5 animate-spin text-white/80" aria-label={t("hero.altImage")} />
        </div>
      )}

      {/* Überschrift — rückt nach oben, wenn unten Karten stehen */}
      <div
        className={`relative z-10 text-center px-4 sm:px-6 lg:px-8 animate-fade-in-up ${
          bottomSlot ? "pb-[19rem] sm:pb-52 lg:pb-44" : ""
        }`}
      >
        <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 drop-shadow-2xl ${heroImage ? "text-white" : "text-foreground"}`}>
          {title || t("hero.title")}
        </h1>
        <p className={`text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto drop-shadow-lg ${heroImage ? "text-white/95" : "text-muted-foreground"}`}>
          {subtitle || t("hero.subtitle")}
        </p>

        {!bottomSlot && (
          <Button
            onClick={() => scrollTo(scrollTarget)}
            size="lg"
            className="mt-8 md:mt-12 bg-primary hover:bg-primary/90 text-primary-foreground text-base md:text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            {ctaLabel || t("hero.bookNow")}
          </Button>
        )}
      </div>

      {/* Karten am unteren Rand */}
      {bottomSlot && (
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-5 sm:pb-7">
          {bottomSlot}
        </div>
      )}

      {/* Scroll Indicator — nur ohne Karten, sonst überlagern sie sich */}
      {!bottomSlot && (
        <button
          onClick={() => scrollTo(scrollTarget)}
          aria-label="Zur nächsten Sektion scrollen"
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer hover:scale-110 transition-transform ${heroImage ? "text-white" : "text-foreground"}`}
        >
          <ChevronDown size={32} />
        </button>
      )}
    </section>
  );
};

export default Hero;
