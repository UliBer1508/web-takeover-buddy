import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { MapPin, Copy, Check, AlertTriangle, Car, Plane, TrainFront, Snowflake, Phone } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

// Lage des Hauses. Die Adresssuche fuehrt bei Google zu einem Nachbargebaeude,
// daher werden ueberall Koordinaten bzw. der Plus Code verwendet.
const LAT = 47.249878;
const LON = 12.254109;
const PLUS_CODE = "67X3+XJ5";
const COORDS = `${LAT}, ${LON}`;

const GOOGLE_MAPS = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LON}`;
const APPLE_MAPS = `https://maps.apple.com/?daddr=${LAT},${LON}&dirflg=d`;

const Anfahrt = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "de";
  const [kopiert, setKopiert] = useState<string | null>(null);

  const kopieren = async (wert: string, feld: string) => {
    try {
      await navigator.clipboard.writeText(wert);
      setKopiert(feld);
      window.setTimeout(() => setKopiert(null), 2000);
    } catch {
      /* Zwischenablage nicht verfuegbar - Wert steht als Text auf der Seite */
    }
  };

  const schritte = [
    t("directions.step1"),
    t("directions.step2"),
    t("directions.step3"),
    t("directions.step4"),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{t("directions.metaTitle")} | Steinbock Chalets</title>
        <meta name="description" content={t("directions.metaDescription")} />
        <link
          rel="canonical"
          href={`https://steinbockchalets.com/${lang === "en" ? "directions" : "anfahrt"}`}
        />
      </Helmet>

      <Navigation />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">{t("directions.title")}</h1>
        <p className="text-muted-foreground mb-8">{t("directions.intro")}</p>

        <img
          src="/chalet-anfahrt.jpg"
          alt={t("directions.imageAlt")}
          className="w-full rounded-xl border border-border mb-8 aspect-[16/9] object-cover"
          loading="lazy"
        />

        <div className="rounded-lg border border-amber-500/40 bg-amber-50 dark:bg-amber-950/30 p-4 mb-8 flex gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-500" />
          <div>
            <p className="font-semibold text-amber-900 dark:text-amber-200">
              {t("directions.warningTitle")}
            </p>
            <p className="text-sm mt-1 text-amber-900/90 dark:text-amber-200/90">
              {t("directions.warningText")}
            </p>
          </div>
        </div>

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

        <section className="mb-12">
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

          <figure className="mt-8">
            <img
              src="/anfahrt-karte.jpg"
              alt={t("directions.mapAlt")}
              className="w-full rounded-xl border border-border"
              loading="lazy"
            />
            <figcaption className="text-sm text-muted-foreground mt-2">
              {t("directions.mapCaption")}
            </figcaption>
          </figure>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-5">{t("directions.arrivalTitle")}</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="flex gap-3">
              <Car className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
              <div>
                <p className="font-medium">{t("directions.byCar")}</p>
                <p className="text-sm text-muted-foreground">{t("directions.byCarText")}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
              <div>
                <p className="font-medium">{t("directions.parkingTitle")}</p>
                <p className="text-sm text-muted-foreground">{t("directions.parkingText")}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Plane className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
              <div>
                <p className="font-medium">{t("directions.airport")}</p>
                <p className="text-sm text-muted-foreground">{t("directions.airportText")}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <TrainFront className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
              <div>
                <p className="font-medium">{t("directions.trainStation")}</p>
                <p className="text-sm text-muted-foreground">{t("directions.trainStationText")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg bg-muted/50 border border-border p-5 mb-8 flex gap-3">
          <Snowflake className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
          <div>
            <p className="font-medium">{t("directions.winterTitle")}</p>
            <p className="text-sm text-muted-foreground mt-1">{t("directions.winterText")}</p>
          </div>
        </section>

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
