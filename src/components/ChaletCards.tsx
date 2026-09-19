import { useQuery } from "@tanstack/react-query";
import { Users, ArrowRight, Image as ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { SelectableHouse, abPreis } from "@/hooks/useHouseSelection";
import { useSprache, lokal, lokalListe } from "@/lib/sprache";

interface ChaletCardsProps {
  houses: SelectableHouse[];
  onSelectHouse: (houseId: string) => void;
  /**
   * "overlay" = kompakt am unteren Rand des Titelbilds, ohne Scrollen sichtbar.
   * "section" = grosse Karten als eigener Abschnitt weiter unten.
   */
  variant?: "overlay" | "section";
}

/** Ein Titelbild je Haus, in einer Abfrage fuer alle. */
const useCoverBilder = (houseIds: string[]) =>
  useQuery({
    queryKey: ['chalet-cover', houseIds.join(',')],
    queryFn: async () => {
      if (houseIds.length === 0) return {} as Record<string, string>;
      const { data, error } = await supabase
        .from('gallery_images')
        .select('house_id, url, is_hero, sort_order')
        .in('house_id', houseIds)
        .order('sort_order', { ascending: true });
      if (error) throw error;

      const map: Record<string, string> = {};
      (data || []).forEach(bild => {
        if (!bild.house_id) return;
        // Erstes Bild gewinnt, ein Hero-Bild sticht es aus.
        if (!map[bild.house_id] || bild.is_hero) map[bild.house_id] = bild.url;
      });
      return map;
    },
    enabled: houseIds.length > 0,
  });

const ChaletCards = ({ houses, onSelectHouse, variant = "overlay" }: ChaletCardsProps) => {
  const { t } = useTranslation();
  const sprache = useSprache();
  const houseIds = houses.map(h => h.id);
  const { data: bilder = {} } = useCoverBilder(houseIds);

  // Bei einem Haus gibt es nichts zu wählen — dann sieht die Seite aus wie vorher.
  if (houses.length <= 1) return null;

  // ---------------------------------------------------------------- overlay
  if (variant === "overlay") {
    return (
      <div id="chalets" className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 gap-3 md:gap-4 max-w-4xl mx-auto">
          {houses.map(haus => {
            const bild = bilder[haus.id];
            const preis = abPreis(haus);
            return (
              <button
                key={haus.id}
                type="button"
                onClick={() => onSelectHouse(haus.id)}
                className="group flex items-center gap-3 md:gap-4 p-2.5 md:p-3 rounded-2xl text-left bg-background/92 hover:bg-background backdrop-blur-md border border-white/25 shadow-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {/* Bild */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-secondary shrink-0">
                  {bild ? (
                    <img src={bild} alt={haus.name} loading="lazy" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="flex-grow min-w-0">
                  {haus.location && (
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        aria-hidden="true"
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: haus.color }}
                      />
                      <span className="text-[11px] md:text-xs text-muted-foreground truncate">
                        {haus.location}
                      </span>
                    </div>
                  )}
                  <div className="font-bold text-sm md:text-base leading-tight truncate">
                    {haus.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] md:text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {haus.max_guests}
                    </span>
                    {preis !== null && (
                      <span className="font-semibold text-primary">
                        {t('chalets.from', 'ab')} {preis} €
                      </span>
                    )}
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 text-primary shrink-0 transition-transform group-hover:translate-x-1" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------- section
  return (
    <section id="chalets" className="py-14 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t('chalets.title', 'Unsere Chalets')}
          </h2>
          <p className="text-muted-foreground">
            {t('chalets.subtitle', 'Wählen Sie Ihr Haus — Bilder, Verfügbarkeit und Preise je Chalet')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {houses.map(haus => {
            const bild = bilder[haus.id];
            const preis = abPreis(haus);
            return (
              <button
                key={haus.id}
                type="button"
                onClick={() => onSelectHouse(haus.id)}
                className="group text-left bg-background border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <div className="relative h-48 md:h-56 bg-secondary overflow-hidden">
                  {bild ? (
                    <img
                      src={bild}
                      alt={haus.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <ImageIcon className="h-7 w-7" />
                      <span className="text-xs">{t('chalets.noImage', 'Noch keine Bilder')}</span>
                    </div>
                  )}
                  {haus.location && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-2 h-7 px-3 rounded-full bg-foreground/70 text-background text-xs font-semibold backdrop-blur-sm">
                      <span
                        aria-hidden="true"
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: haus.color }}
                      />
                      {haus.location}
                    </span>
                  )}
                </div>

                <div className="p-5 md:p-6">
                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <h3 className="text-xl md:text-2xl font-bold">{haus.name}</h3>
                    {preis !== null && (
                      <span className="text-sm font-semibold text-primary whitespace-nowrap">
                        {t('chalets.from', 'ab')} {preis} € / {t('chalets.night', 'Nacht')}
                      </span>
                    )}
                  </div>

                  {lokal(haus.short_description, haus.short_description_en, sprache) && (
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
                      {lokal(haus.short_description, haus.short_description_en, sprache)}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-secondary text-secondary-foreground">
                      <Users className="h-3.5 w-3.5" />
                      {haus.max_guests} {t('chalets.guests', 'Gäste')}
                    </span>
                    {lokalListe(haus.highlights, haus.highlights_en, sprache).slice(0, 3).map(merkmal => (
                      <span
                        key={merkmal}
                        className="text-xs px-2.5 py-1.5 rounded-md bg-secondary text-secondary-foreground"
                      >
                        {merkmal}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                    {t('chalets.view', 'Chalet ansehen')}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ChaletCards;
