import { useTranslation } from "react-i18next";
import { Map as MapIcon, Mountain, CableCar, CalendarDays, Car, ExternalLink } from "lucide-react";
import { useSkiAreas, SkiArea } from "@/hooks/useSkiAreas";
import { useSprache, lokal, Sprache } from "@/lib/sprache";

/**
 * Skigebiete - gemeinsame Liste für alle Häuser (public.ski_areas).
 * Jeder Block erscheint nur, wenn der Wert in der DB steht (kein Ersatztext).
 * Der Pistenplan ist ein Link auf die offizielle Seite/PDF der Bergbahn.
 */

const zahl = (n: number, sprache: Sprache) =>
  n.toLocaleString(sprache === "en" ? "en-GB" : "de-AT", { maximumFractionDigits: 1 });

const datum = (iso: string, sprache: Sprache) =>
  new Date(iso + "T00:00:00").toLocaleDateString(sprache === "en" ? "en-GB" : "de-AT", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });

const PISTEN = [
  { key: "slopes_blue_km", label: "easy", color: "#2563eb" },
  { key: "slopes_red_km", label: "medium", color: "#dc2626" },
  { key: "slopes_black_km", label: "difficult", color: "#111827" },
] as const;

const SkiAreaCard = ({ area }: { area: SkiArea }) => {
  const { t } = useTranslation();
  const sprache = useSprache();
  const region = lokal(area.region_de, area.region_en, sprache);
  const beschreibung = lokal(area.description_de, area.description_en, sprache);
  const saison = lokal(area.season_de, area.season_en, sprache);
  const pisten = PISTEN.filter(p => area[p.key] != null);
  const pistenSumme = area.slopes_km ?? pisten.reduce((s, p) => s + (area[p.key] ?? 0), 0);
  const hatHoehe = area.elevation_min != null || area.elevation_max != null;
  const hatAnfahrt = area.distance_km != null || area.drive_minutes != null;

  return (
    <article className="rounded-2xl border bg-card overflow-hidden shadow-sm flex flex-col">
      {/* Kopf */}
      <div className="relative h-40 md:h-44">
        {area.image_url ? (
          <>
            <img src={area.image_url} alt={area.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" />
        )}
        {area.piste_map_url && (
          <a
            href={area.piste_map_url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-3 inline-flex items-center gap-2 rounded-lg bg-white/95 hover:bg-white text-slate-900 text-sm font-semibold px-3 py-2 shadow"
          >
            <MapIcon className="w-4 h-4" />
            {t("skiAreas.pisteMap")}
          </a>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl md:text-2xl font-bold leading-tight drop-shadow">{area.name}</h3>
          {region && <p className="text-sm text-white/85">{region}</p>}
        </div>
      </div>

      {/* Inhalt */}
      <div className="p-4 md:p-5 space-y-4 flex-1 flex flex-col">
        {beschreibung && <p className="text-sm text-muted-foreground">{beschreibung}</p>}

        {(hatHoehe || area.lifts != null) && (
          <div className="grid grid-cols-2 gap-4">
            {hatHoehe && (
              <div className="flex items-start gap-2.5">
                <Mountain className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground">{t("skiAreas.elevation")}</div>
                  <div className="text-sm font-medium tabular-nums">
                    {area.elevation_max != null && <div>↑ {zahl(area.elevation_max, sprache)} m</div>}
                    {area.elevation_min != null && <div>↓ {zahl(area.elevation_min, sprache)} m</div>}
                  </div>
                </div>
              </div>
            )}
            {area.lifts != null && (
              <div className="flex items-start gap-2.5">
                <CableCar className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground">{t("skiAreas.lifts")}</div>
                  <div className="text-sm font-medium tabular-nums">{area.lifts}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {pistenSumme > 0 && (
          <div className="border-t pt-4">
            <div className="text-sm">
              <span className="font-semibold">{t("skiAreas.slopes")}</span>{" "}
              <span className="text-muted-foreground">{t("skiAreas.total")}: </span>
              <span className="font-medium tabular-nums">{zahl(pistenSumme, sprache)} km</span>
            </div>
            {pisten.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {pisten.map(p => {
                  const km = area[p.key] as number;
                  return (
                    <div key={p.key}>
                      <div className="text-xs text-muted-foreground">
                        {t(`skiAreas.${p.label}`)} · <span className="tabular-nums">{zahl(km, sprache)} km</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted mt-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.min(100, (km / pistenSumme) * 100)}%`, backgroundColor: p.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {(saison || hatAnfahrt) && (
          <div className="border-t pt-4 grid sm:grid-cols-2 gap-3">
            {saison && (
              <div className="flex items-start gap-2.5">
                <CalendarDays className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground">{t("skiAreas.season")}</div>
                  <div className="text-sm">{saison}</div>
                </div>
              </div>
            )}
            {hatAnfahrt && (
              <div className="flex items-start gap-2.5">
                <Car className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground">{t("skiAreas.drive")}</div>
                  <div className="text-sm tabular-nums">
                    {[
                      area.distance_km != null ? `${zahl(area.distance_km, sprache)} km` : null,
                      area.drive_minutes != null ? t("skiAreas.minutes", { min: area.drive_minutes }) : null,
                    ].filter(Boolean).join(" · ")}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-auto pt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          {area.facts_as_of && <span>{t("skiAreas.asOf", { date: datum(area.facts_as_of, sprache) })}</span>}
          {area.website_url && (
            <a href={area.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
              {t("skiAreas.website")}<ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

const SkiAreas = () => {
  const { t } = useTranslation();
  const { data: gebiete = [] } = useSkiAreas();
  if (gebiete.length === 0) return null;

  return (
    <section id="skigebiete" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{t("skiAreas.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("skiAreas.subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {gebiete.map(g => <SkiAreaCard key={g.id} area={g} />)}
        </div>
      </div>
    </section>
  );
};

export default SkiAreas;
