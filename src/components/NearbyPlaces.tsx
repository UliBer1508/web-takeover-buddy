import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Map as MapIcon, Home, ExternalLink } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "@/components/ui/button";
import { SelectableHouse } from "@/hooks/useHouseSelection";
import { useHousePlaces, HousePlace } from "@/hooks/useHousePlaces";
import { useHouseDirections } from "@/hooks/useHouseDirections";
import { PLACE_CATEGORIES, placeCategory, entfernungKm, formatKm } from "@/lib/placeCategories";
import { useSprache, lokal } from "@/lib/sprache";
import "leaflet/dist/leaflet.css";

interface NearbyPlacesProps {
  house?: SelectableHouse | null;
}

/**
 * "In der Naehe": Orte rund um das gewaehlte Haus (public.house_places).
 * Mittelpunkt = Koordinaten aus der Anfahrt (house_directions).
 * Die OpenStreetMap-Karte laedt erst nach Klick - vorher geht keine Anfrage
 * an einen fremden Server (Datenschutz). Die Liste funktioniert ohne Karte.
 */
const NearbyPlaces = ({ house }: NearbyPlacesProps) => {
  const { t } = useTranslation();
  const sprache = useSprache();
  const { data: orte = [] } = useHousePlaces(house?.id);
  const { data: anfahrt } = useHouseDirections(house?.id);
  const [aktiv, setAktiv] = useState<Set<string>>(new Set());
  const [karteAn, setKarteAn] = useState(false);
  const kartenRef = useRef<HTMLDivElement>(null);

  const hausLat = anfahrt?.latitude != null ? Number(anfahrt.latitude) : null;
  const hausLon = anfahrt?.longitude != null ? Number(anfahrt.longitude) : null;
  const hatMitte = hausLat != null && hausLon != null;

  // Nur Kategorien anbieten, zu denen es Orte gibt. Standard: alle an.
  const vorhanden = useMemo(
    () => PLACE_CATEGORIES.filter(k => orte.some(o => o.category === k.key)),
    [orte]
  );
  useEffect(() => {
    setAktiv(new Set(vorhanden.map(k => k.key)));
    setKarteAn(false);
  }, [house?.id, vorhanden.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const sichtbar = useMemo(() => {
    const liste = orte
      .filter(o => aktiv.has(o.category))
      .map(o => ({
        ...o,
        km: hatMitte ? entfernungKm(hausLat!, hausLon!, o.latitude, o.longitude) : null,
      }));
    return liste.sort((a, b) => (a.km ?? 0) - (b.km ?? 0));
  }, [orte, aktiv, hatMitte, hausLat, hausLon]);

  // Karte (Leaflet) erst nach Klick laden und bei Filterwechsel neu zeichnen
  useEffect(() => {
    if (!karteAn || !hatMitte || !kartenRef.current) return;
    let karte: any = null;
    let abgebrochen = false;
    import("leaflet").then(L => {
      if (abgebrochen || !kartenRef.current) return;
      karte = L.map(kartenRef.current, { scrollWheelZoom: false }).setView([hausLat!, hausLon!], 12);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(karte);

      const symbol = (farbe: string, inhalt: string) =>
        L.divIcon({
          className: "",
          html: `<div style="background:${farbe};color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)">${inhalt}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
      const svg = (Icon: any) => renderToStaticMarkup(<Icon size={15} strokeWidth={2.2} />);

      L.marker([hausLat!, hausLon!], { icon: symbol("#1f1a17", svg(Home)), zIndexOffset: 1000 })
        .addTo(karte).bindPopup(house?.name ?? "");

      const punkte: [number, number][] = [[hausLat!, hausLon!]];
      sichtbar.forEach(o => {
        const k = placeCategory(o.category);
        if (!k) return;
        const name = document.createElement("div");
        name.textContent = `${o.name}${o.km != null ? ` · ${formatKm(o.km, sprache)}` : ""}`;
        L.marker([o.latitude, o.longitude], { icon: symbol(k.color, svg(k.icon)) })
          .addTo(karte).bindPopup(name);
        punkte.push([o.latitude, o.longitude]);
      });
      if (punkte.length > 1) karte.fitBounds(punkte, { padding: [30, 30], maxZoom: 14 });
    });
    return () => { abgebrochen = true; karte?.remove(); };
  }, [karteAn, hatMitte, hausLat, hausLon, sichtbar, sprache, house?.name]);

  if (!house || orte.length === 0) return null;

  const umschalten = (key: string) =>
    setAktiv(s => {
      const n = new Set(s);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });

  return (
    <section id="nearby" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{t("nearby.title")}</h2>
          <p className="text-muted-foreground">{house.name}</p>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          {/* Kategorien */}
          <div className="rounded-xl border divide-y h-fit">
            {vorhanden.map(k => {
              const Symbol = k.icon;
              const an = aktiv.has(k.key);
              return (
                <label
                  key={k.key}
                  htmlFor={`nearby-${k.key}`}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/40"
                >
                  <span className="w-8 h-8 rounded-md flex items-center justify-center text-white shrink-0" style={{ backgroundColor: k.color }}>
                    <Symbol className="w-4 h-4" />
                  </span>
                  <span className="flex-1 font-medium text-sm">{t(`nearby.categories.${k.key}`)}</span>
                  <input
                    id={`nearby-${k.key}`}
                    type="checkbox"
                    checked={an}
                    onChange={() => umschalten(k.key)}
                    className="h-4 w-4 accent-primary"
                  />
                </label>
              );
            })}
          </div>

          {/* Karte + Liste */}
          <div className="space-y-4 min-w-0">
            {hatMitte && (
              karteAn ? (
                <div ref={kartenRef} className="w-full h-[420px] rounded-xl border overflow-hidden z-0" />
              ) : (
                <div className="w-full rounded-xl border bg-muted/40 p-6 text-center space-y-3">
                  <Button onClick={() => setKarteAn(true)}>
                    <MapIcon className="w-4 h-4 mr-2" />
                    {t("nearby.showMap")}
                  </Button>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">{t("nearby.mapPrivacy")}</p>
                </div>
              )
            )}

            <ul className="grid sm:grid-cols-2 gap-2">
              {sichtbar.map((o: HousePlace & { km: number | null }) => {
                const k = placeCategory(o.category);
                const Symbol = k?.icon;
                const hinweis = lokal(o.note_de, o.note_en, sprache);
                return (
                  <li key={o.id} className="flex items-start gap-3 rounded-lg border px-3 py-2.5">
                    {Symbol && (
                      <span className="w-7 h-7 rounded-md flex items-center justify-center text-white shrink-0 mt-0.5" style={{ backgroundColor: k!.color }}>
                        <Symbol className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-medium text-sm truncate">
                          {o.url ? (
                            <a href={o.url} target="_blank" rel="noopener noreferrer" className="hover:underline inline-flex items-center gap-1">
                              {o.name}<ExternalLink className="w-3 h-3" />
                            </a>
                          ) : o.name}
                        </span>
                        {o.km != null && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap tabular-nums">{formatKm(o.km, sprache)}</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t(`nearby.categories.${o.category}`)}
                        {hinweis && <> · {hinweis}</>}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            {hatMitte && <p className="text-xs text-muted-foreground">{t("nearby.distanceNote")}</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NearbyPlaces;
