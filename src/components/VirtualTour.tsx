import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Play, Pause, RotateCcw, Maximize, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectableHouse } from "@/hooks/useHouseSelection";
import { useSprache } from "@/lib/sprache";
import { ladeTourBilder, bilderLaden, planErstellen, zeichneFrame, TourPlan, TourTexte } from "@/lib/tour";

/** Texte für Titel- und Schlusskarte — gemeinsam für Website und Admin-Aufnahme. */
export const useTourTexte = (house: SelectableHouse | null): TourTexte | null => {
  const { t } = useTranslation();
  if (!house) return null;
  return {
    haus: house.name,
    zeile: house.location,
    zusatz: house.offer_long_term && !house.offer_short_term
      ? t("tour.longTerm")
      : house.offer_long_term
        ? t("tour.both")
        : null,
    schluss: house.offer_long_term && !(house.offer_short_term && house.direct_booking !== false)
      ? t("tour.endInquiry")
      : t("tour.endBook"),
    marke: "Steinbock Chalets",
  };
};

/** Lädt Bilder und baut den Plan (gemeinsam für Website und Admin). */
export const useTourPlan = (house: SelectableHouse | null, maxBilder = 24, aktiv = true) => {
  const { t } = useTranslation();
  const sprache = useSprache();
  const texte = useTourTexte(house);
  return useQuery({
    queryKey: ["tour-plan", house?.id, sprache, maxBilder, texte?.zusatz, texte?.schluss],
    queryFn: async (): Promise<TourPlan | null> => {
      if (!house || !texte) return null;
      const kat = (name: string, fallback: string) => {
        const x = t(`gallery.categories.${name}`);
        return x.startsWith("gallery.categories.") ? fallback : x;
      };
      const infos = await ladeTourBilder(house.id, kat, sprache, maxBilder);
      const { bilder, infos: ok } = await bilderLaden(infos);
      return bilder.length >= 3 ? planErstellen(bilder, ok, texte) : null;
    },
    enabled: !!house && aktiv,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Abschnitt „Rundgang“ (#rundgang): Video-Rundgang aus den Galerie-Bildern des gewählten
 * Hauses, live im Browser abgespielt (lib/tour.ts). Startet erst auf Klick; fehlt bei
 * weniger als 3 Bildern ganz (Grundsatz: fehlende Inhalte = Block weglassen).
 */
const VirtualTour = ({ house }: { house: SelectableHouse | null }) => {
  const { t } = useTranslation();
  const { data: plan, isLoading } = useTourPlan(house);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rahmenRef = useRef<HTMLDivElement>(null);
  const [laeuft, setLaeuft] = useState(false);
  const [gestartet, setGestartet] = useState(false);
  const zeitRef = useRef(0);
  const letzteRef = useRef<number | null>(null);

  // Haus gewechselt → zurück auf Anfang
  useEffect(() => {
    setLaeuft(false); setGestartet(false); zeitRef.current = 0; letzteRef.current = null;
  }, [house?.id]);

  // Standbild (Titelkarte), solange nicht gespielt wird
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && plan && !laeuft) zeichneFrame(ctx, plan, Math.max(zeitRef.current, plan.dauerTitel * 0.6));
  }, [plan, laeuft]);

  useEffect(() => {
    if (!laeuft || !plan) return;
    let id = 0;
    const schritt = (jetzt: number) => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      if (letzteRef.current !== null) zeitRef.current += (jetzt - letzteRef.current) / 1000;
      letzteRef.current = jetzt;
      if (zeitRef.current >= plan.gesamt) {
        zeichneFrame(ctx, plan, plan.gesamt);
        setLaeuft(false);
        letzteRef.current = null;
        return;
      }
      zeichneFrame(ctx, plan, zeitRef.current);
      id = requestAnimationFrame(schritt);
    };
    id = requestAnimationFrame(schritt);
    return () => { cancelAnimationFrame(id); letzteRef.current = null; };
  }, [laeuft, plan]);

  if (!house) return null;
  if (!isLoading && !plan) return null;

  const abspielen = () => {
    if (plan && zeitRef.current >= plan.gesamt) zeitRef.current = 0;
    setGestartet(true);
    setLaeuft(true);
  };

  return (
    <section id="rundgang" className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{t("tour.title")}</h2>
          <p className="text-muted-foreground">{t("tour.subtitle", { house: house.name })}</p>
        </div>
        <div ref={rahmenRef} className="relative rounded-2xl overflow-hidden shadow-xl bg-[#1b140e] aspect-video">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center text-white/80">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <>
              <canvas ref={canvasRef} width={1280} height={720} className="w-full h-full" aria-label={t("tour.title")} />
              {!laeuft && (
                <button
                  type="button"
                  onClick={abspielen}
                  className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors"
                  aria-label={t("tour.play")}
                >
                  <span className="flex items-center gap-2 h-14 px-6 rounded-full bg-primary text-primary-foreground font-semibold shadow-xl">
                    {gestartet && plan && zeitRef.current >= plan.gesamt
                      ? <><RotateCcw className="h-5 w-5" />{t("tour.again")}</>
                      : <><Play className="h-5 w-5" />{gestartet ? t("tour.resume") : t("tour.play")}</>}
                  </span>
                </button>
              )}
              {laeuft && (
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <Button size="icon" variant="secondary" aria-label={t("tour.pause")} onClick={() => setLaeuft(false)}>
                    <Pause className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" aria-label={t("tour.fullscreen")}
                    onClick={() => rahmenRef.current?.requestFullscreen?.().catch(() => undefined)}>
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default VirtualTour;
