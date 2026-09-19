import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Map as MapIcon, CalendarDays, ChevronDown, ExternalLink } from "lucide-react";
import { useSkiAreas, SkiArea } from "@/hooks/useSkiAreas";
import { useSprache, lokal, Sprache } from "@/lib/sprache";

/**
 * Skigebiete - gemeinsame Liste für alle Häuser (public.ski_areas).
 * Jeder Block erscheint nur, wenn der Wert in der DB steht (kein Ersatztext).
 * Darstellung als Liste (Wunsch Uli): eine Zeile je Gebiet, Klick klappt Details auf.
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

/** Eine Zeile der Liste; Klick klappt die Details auf. */
const SkiAreaRow = ({ area }: { area: SkiArea }) => {
  const { t } = useTranslation();
  const sprache = useSprache();
  const [offen, setOffen] = useState(false);
  const region = lokal(area.region_de, area.region_en, sprache);
  const beschreibung = lokal(area.description_de, area.description_en, sprache);
  const saison = lokal(area.season_de, area.season_en, sprache);
  const pisten = PISTEN.filter(p => area[p.key] != null);
  const pistenSumme = area.slopes_km ?? pisten.reduce((s, p) => s + (area[p.key] ?? 0), 0);
  const hoehe =
    area.elevation_min != null && area.elevation_max != null
      ? `${zahl(area.elevation_min, sprache)}–${zahl(area.elevation_max, sprache)} m`
      : area.elevation_max != null ? `↑ ${zahl(area.elevation_max, sprache)} m`
      : area.elevation_min != null ? `↓ ${zahl(area.elevation_min, sprache)} m` : null;
  const anfahrt = [
    area.distance_km != null ? `${zahl(area.distance_km, sprache)} km` : null,
    area.drive_minutes != null ? t("skiAreas.minutes", { min: area.drive_minutes }) : null,
  ].filter(Boolean).join(" · ");
  const hatDetails = !!(beschreibung || saison || pisten.length || area.website_url || area.facts_as_of);
  const detailId = `ski-${area.id}`;

  // Wert mit Beschriftung; auf dem Handy steht die Beschriftung davor, am PC im Tabellenkopf
  // Fehlt ein Wert: am PC "–" in der Spalte, auf dem Handy entfällt die Angabe ganz.
  const wert = (label: string, inhalt: string | number | null) => (
    <div className={`min-w-0 ${inhalt == null ? "hidden md:block" : ""}`}>
      <span className="block md:hidden text-[11px] text-muted-foreground">{label}</span>
      <span className="text-sm tabular-nums">{inhalt ?? "–"}</span>
    </div>
  );

  return (
    <li className="border-b last:border-b-0">
      <div className="grid grid-cols-2 md:grid-cols-[minmax(0,2.4fr)_1fr_0.7fr_1.2fr_1.3fr_8.5rem] items-center gap-x-4 gap-y-1.5 px-4 py-3">
        <button
          type="button"
          onClick={() => hatDetails && setOffen(o => !o)}
          aria-expanded={hatDetails ? offen : undefined}
          aria-controls={hatDetails ? detailId : undefined}
          className="col-span-2 md:col-span-1 flex items-center gap-3 text-left min-w-0 group"
        >
          {area.image_url && (
            <img src={area.image_url} alt="" loading="lazy" className="w-12 h-12 rounded-lg object-cover shrink-0" />
          )}
          <div className="min-w-0">
            <div className="font-semibold leading-tight group-hover:text-primary">{area.name}</div>
            {region && <div className="text-xs text-muted-foreground truncate">{region}</div>}
          </div>
          {hatDetails && (
            <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${offen ? "rotate-180" : ""}`} />
          )}
        </button>
        {wert(t("skiAreas.slopes"), pistenSumme > 0 ? `${zahl(pistenSumme, sprache)} km` : null)}
        {wert(t("skiAreas.lifts"), area.lifts)}
        {wert(t("skiAreas.elevation"), hoehe)}
        {wert(t("skiAreas.driveShort"), anfahrt || null)}
        <div className="col-span-2 md:col-span-1 md:text-right">
          {area.piste_map_url && (
            <a
              href={area.piste_map_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-muted whitespace-nowrap"
            >
              <MapIcon className="w-4 h-4" />
              {t("skiAreas.pisteMap")}
            </a>
          )}
        </div>
      </div>

      {hatDetails && offen && (
        <div id={detailId} className="px-4 pb-4 md:pl-4 space-y-3 text-sm">
          {beschreibung && <p className="text-muted-foreground">{beschreibung}</p>}
          {pisten.length > 0 && (
            <div className="grid grid-cols-3 gap-3 max-w-xl">
              {pisten.map(p => {
                const km = area[p.key] as number;
                return (
                  <div key={p.key}>
                    <div className="text-xs text-muted-foreground">
                      {t(`skiAreas.${p.label}`)} · <span className="tabular-nums">{zahl(km, sprache)} km</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted mt-1.5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.min(100, (km / pistenSumme) * 100)}%`, backgroundColor: p.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {saison && (
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">{t("skiAreas.season")}:</span> {saison}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {area.facts_as_of && <span>{t("skiAreas.asOf", { date: datum(area.facts_as_of, sprache) })}</span>}
            {area.website_url && (
              <a href={area.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                {t("skiAreas.website")}<ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}
    </li>
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
        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
          {/* Tabellenkopf nur am PC */}
          <div className="hidden md:grid grid-cols-[minmax(0,2.4fr)_1fr_0.7fr_1.2fr_1.3fr_8.5rem] gap-x-4 px-4 py-2.5 text-xs font-medium text-muted-foreground bg-muted/50 border-b">
            <span>{t("skiAreas.area")}</span>
            <span>{t("skiAreas.slopes")}</span>
            <span>{t("skiAreas.lifts")}</span>
            <span>{t("skiAreas.elevation")}</span>
            <span>{t("skiAreas.drive")}</span>
            <span className="invisible">{t("skiAreas.pisteMap")}</span>
          </div>
          <ul>
            {gebiete.map(g => <SkiAreaRow key={g.id} area={g} />)}
          </ul>
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">{t("skiAreas.listHint")}</p>
      </div>
    </section>
  );
};

export default SkiAreas;
