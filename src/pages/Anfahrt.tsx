import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { MapPin, Copy, Check, AlertTriangle, Car, Plane, TrainFront, Snowflake, Phone } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import HouseSelector from "@/components/HouseSelector";
import { useHouseSelection } from "@/hooks/useHouseSelection";
import { useHouseDirections, textIn, schritteIn } from "@/hooks/useHouseDirections";

/**
 * Anfahrt je Haus. Alle Inhalte (Koordinaten, Plus Code, Route, Hinweise,
 * Bilder) kommen aus public.house_directions und werden im Admin unter
 * "Anfahrt" gepflegt. Im Code stehen nur die Beschriftungen der Oberflaeche.
 * Leere Felder werden weggelassen.
 *
 * Adressen: /anfahrt/<slug> bzw. /directions/<slug> - das ist der Link, den
 * Uli Gaesten nach der Buchung schickt. /anfahrt ohne Haus zeigt die Auswahl
 * der freigeschalteten Haeuser. Ausgeblendete Haeuser haben keine Anfahrt
 * (RLS auf houses und house_directions liefert sie Gaesten nicht aus).
 */
const Anfahrt = () => {
  const { t, i18n } = useTranslation();
  const lang: "de" | "en" = i18n.language?.startsWith("en") ? "en" : "de";
  const [kopiert, setKopiert] = useState<string | null>(null);

  const { houses, isLoading: haeuserLaden } = useHouseSelection();
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const basis = lang === "en" ? "/directions" : "/anfahrt";
  const selectedHouse = slug ? houses.find(h => h.slug === slug) ?? null : null;

  const hausWechseln = (id: string) => {
    const haus = houses.find(h => h.id === id);
    if (haus) navigate(`${basis}/${haus.slug}`, { replace: true });
  };

  const { data: anfahrt, isLoading: anfahrtLaden } = useHouseDirections(selectedHouse?.id);
  const isLoading = haeuserLaden || anfahrtLaden;

  const hatKoordinaten = anfahrt?.latitude != null && anfahrt?.longitude != null;
  const COORDS = hatKoordinaten ? `${anfahrt!.latitude}, ${anfahrt!.longitude}` : null;
  const PLUS_CODE = anfahrt?.plus_code?.trim() || null;
  const GOOGLE_MAPS = hatKoordinaten
    ? `https://www.google.com/maps/dir/?api=1&destination=${anfahrt!.latitude},${anfahrt!.longitude}`
    : null;
  const APPLE_MAPS = hatKoordinaten
    ? `https://maps.apple.com/?daddr=${anfahrt!.latitude},${anfahrt!.longitude}&dirflg=d`
    : null;

  const warnTitel = textIn(anfahrt, "warning_title", lang);
  const warnText = textIn(anfahrt, "warning_text", lang);
  const parken = textIn(anfahrt, "parking", lang);
  const auto = textIn(anfahrt, "by_car", lang);
  const flughafen = textIn(anfahrt, "airport", lang);
  const bahnhof = textIn(anfahrt, "train_station", lang);
  const winter = textIn(anfahrt, "winter", lang);
  const kartenText = textIn(anfahrt, "map_caption", lang);
  const schritte = schritteIn(anfahrt, lang);
  const hausBild = anfahrt?.house_image_url?.trim() || null;
  const kartenBild = anfahrt?.map_image_url?.trim() || null;
  const hatAnreise = !!(auto || parken || flughafen || bahnhof);
  const hausName = selectedHouse?.name ?? "";

  const kopieren = async (wert: string, feld: string) => {
    try {
      await navigator.clipboard.writeText(wert);
      setKopiert(feld);
      window.setTimeout(() => setKopiert(null), 2000);
    } catch {
      /* Zwischenablage nicht verfuegbar - Wert steht als Text auf der Seite */
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{`${t("directions.title")}${hausName ? ` – ${hausName}` : ""} | Steinbock Chalets`}</title>
        {hausName && (
          <meta
            name="description"
            content={`${t("directions.title")}: ${hausName}${selectedHouse?.location ? `, ${selectedHouse.location}` : ""}`}
          />
        )}
        <link
          rel="canonical"
          href={`https://steinbockchalets.com/${lang === "en" ? "directions" : "anfahrt"}${slug ? `/${slug}` : ""}`}
        />
      </Helmet>

      <Navigation />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">{t("directions.title")}</h1>
        {hausName && (
          <p className="text-lg font-medium mb-1">
            {hausName}
            {selectedHouse?.location && (
              <span className="text-muted-foreground font-normal"> · {selectedHouse.location}</span>
            )}
          </p>
        )}

        {selectedHouse && (
          <HouseSelector
            houses={houses}
            selectedHouseId={selectedHouse.id}
            onHouseChange={hausWechseln}
          />
        )}

        {isLoading ? null : !slug ? (
          <div className="mt-8 space-y-3">
            <p className="text-muted-foreground">
              {t("directions.chooseHouse", "Bitte wählen Sie Ihr Haus.")}
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {houses.map(h => (
                <Link
                  key={h.id}
                  to={`${basis}/${h.slug}`}
                  className="rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors flex items-start gap-3"
                >
                  <span
                    aria-hidden="true"
                    className="w-2.5 h-2.5 rounded-full shrink-0 mt-2"
                    style={{ backgroundColor: h.color }}
                  />
                  <span>
                    <span className="block font-semibold text-lg">{h.name}</span>
                    {h.location && <span className="block text-sm text-muted-foreground">{h.location}</span>}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : !selectedHouse ? (
          <p className="text-muted-foreground mt-8">
            {t("directions.houseNotFound", "Dieses Haus wurde nicht gefunden.")}{" "}
            <Link to={basis} className="text-primary underline">{t("directions.chooseHouse", "Bitte wählen Sie Ihr Haus.")}</Link>
          </p>
        ) : !anfahrt ? (
          <p className="text-muted-foreground mt-8">
            {t("directions.noData", "Für dieses Haus ist noch keine Anfahrt hinterlegt. Bitte fragen Sie uns direkt.")}
          </p>
        ) : (
          <>
            {hatKoordinaten && (
              <p className="text-muted-foreground mb-8 mt-4">{t("directions.intro")}</p>
            )}

            {hausBild && (
              <img
                src={hausBild}
                alt={hausName}
                className="w-full rounded-xl border border-border mb-8 aspect-[16/9] object-cover"
                loading="lazy"
              />
            )}

            {(warnTitel || warnText) && (
              <div className="rounded-lg border border-amber-500/40 bg-amber-50 dark:bg-amber-950/30 p-4 mb-8 flex gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-500" />
                <div>
                  {warnTitel && (
                    <p className="font-semibold text-amber-900 dark:text-amber-200">{warnTitel}</p>
                  )}
                  {warnText && (
                    <p className="text-sm mt-1 text-amber-900/90 dark:text-amber-200/90">{warnText}</p>
                  )}
                </div>
              </div>
            )}

            {anfahrt.address?.trim() && (
              <div className="rounded-lg border border-border p-4 mb-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  {t("directions.address", "Adresse")}
                </p>
                <span className="text-lg font-medium">{anfahrt.address}</span>
              </div>
            )}

            {COORDS && (
              <div className="rounded-lg border border-border p-4 mb-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  {t("directions.coordinates")}
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-lg font-medium">{COORDS}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    onClick={() => kopieren(COORDS, "coords")}
                  >
                    {kopiert === "coords" ? (
                      <><Check className="w-4 h-4 mr-1.5" />{t("directions.copied")}</>
                    ) : (
                      <><Copy className="w-4 h-4 mr-1.5" />{t("directions.copy")}</>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {PLUS_CODE && (
              <div className="rounded-lg border border-border p-4 mb-6">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  {t("directions.plusCode")}
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-lg font-medium">{PLUS_CODE}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    onClick={() => kopieren(PLUS_CODE, "plus")}
                  >
                    {kopiert === "plus" ? (
                      <><Check className="w-4 h-4 mr-1.5" />{t("directions.copied")}</>
                    ) : (
                      <><Copy className="w-4 h-4 mr-1.5" />{t("directions.copy")}</>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {GOOGLE_MAPS && APPLE_MAPS && (
              <div className="grid sm:grid-cols-2 gap-3 mb-12">
                <Button asChild size="lg">
                  <a href={GOOGLE_MAPS} target="_blank" rel="noopener noreferrer">
                    <MapPin className="w-4 h-4 mr-2" />
                    {t("directions.openGoogleMaps")}
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href={APPLE_MAPS} target="_blank" rel="noopener noreferrer">
                    <MapPin className="w-4 h-4 mr-2" />
                    {t("directions.openAppleMaps")}
                  </a>
                </Button>
              </div>
            )}

            {(schritte.length > 0 || kartenBild) && (
              <section className="mb-12">
                {schritte.length > 0 && (
                  <>
                    <h2 className="text-2xl font-semibold mb-5">{t("directions.routeTitle")}</h2>
                    <ol className="space-y-4">
                      {schritte.map((text, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed pt-0.5">{text}</span>
                        </li>
                      ))}
                    </ol>
                  </>
                )}

                {kartenBild && (
                  <figure className="mt-8">
                    <img
                      src={kartenBild}
                      alt={`${t("directions.title")} ${hausName}`}
                      className="w-full rounded-xl border border-border"
                      loading="lazy"
                    />
                    {kartenText && (
                      <figcaption className="text-sm text-muted-foreground mt-2">{kartenText}</figcaption>
                    )}
                  </figure>
                )}
              </section>
            )}

            {hatAnreise && (
              <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-5">{t("directions.arrivalTitle")}</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  {auto && (
                    <div className="flex gap-3">
                      <Car className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
                      <div>
                        <p className="font-medium">{t("directions.byCar")}</p>
                        <p className="text-sm text-muted-foreground">{auto}</p>
                      </div>
                    </div>
                  )}
                  {parken && (
                    <div className="flex gap-3">
                      <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
                      <div>
                        <p className="font-medium">{t("directions.parkingTitle")}</p>
                        <p className="text-sm text-muted-foreground">{parken}</p>
                      </div>
                    </div>
                  )}
                  {flughafen && (
                    <div className="flex gap-3">
                      <Plane className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
                      <div>
                        <p className="font-medium">{t("directions.airport")}</p>
                        <p className="text-sm text-muted-foreground">{flughafen}</p>
                      </div>
                    </div>
                  )}
                  {bahnhof && (
                    <div className="flex gap-3">
                      <TrainFront className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
                      <div>
                        <p className="font-medium">{t("directions.trainStation")}</p>
                        <p className="text-sm text-muted-foreground">{bahnhof}</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {winter && (
              <section className="rounded-lg bg-muted/50 border border-border p-5 mb-8 flex gap-3">
                <Snowflake className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">{t("directions.winterTitle")}</p>
                  <p className="text-sm text-muted-foreground mt-1">{winter}</p>
                </div>
              </section>
            )}
          </>
        )}

        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Phone className="w-4 h-4" />
          {t("directions.questions")}
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default Anfahrt;
