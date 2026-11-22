import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import HouseSelector from "@/components/HouseSelector";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Features from "@/components/Features";
import VirtualTour from "@/components/VirtualTour";
import Gallery from "@/components/Gallery";
import LongTermRental from "@/components/LongTermRental";
import AboutUs from "@/components/AboutUs";
import Footer from "@/components/Footer";
import { useHouseSelection } from "@/hooks/useHouseSelection";

/**
 * Eigene Seite „Chalets auf Zeit“ (seit 22.11.2026), damit Google die
 * Langzeitmiete als eigene Seite findet (vorher nur Abschnitt der Startseite).
 * /chalets-auf-zeit (de), /long-stay-chalets (en).
 * Zeigt nur Häuser mit offer_long_term — alle Inhalte aus der Datenbank wie auf
 * der Startseite (keine Hausinhalte im Code). Titel/Beschreibung für Google sind
 * Markentexte aus i18n (longTermPage.*), keine Hausdaten.
 */
const ChaletsAufZeit = () => {
  const { t, i18n } = useTranslation();
  const { houses } = useHouseSelection();
  const langHaeuser = useMemo(() => houses.filter(h => h.offer_long_term), [houses]);
  const [hausId, setHausId] = useState<string | null>(null);

  useEffect(() => {
    if (langHaeuser.length === 0) return;
    if (!hausId || !langHaeuser.some(h => h.id === hausId)) setHausId(langHaeuser[0].id);
  }, [langHaeuser, hausId]);

  const haus = langHaeuser.find(h => h.id === hausId) ?? null;
  const en = i18n.language === "en";
  // Wie bei /galerie: eine kanonische Adresse, /long-stay-chalets ist nur ein Alias.
  const url = "https://steinbockchalets.com/chalets-auf-zeit";
  const title = t("longTermPage.metaTitle");
  const description = t("longTermPage.metaDescription");

  return (
    <div className="min-h-screen">
      <Helmet>
        <html lang={en ? "en" : "de"} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://steinbockchalets.com/og-preview.jpg" />
      </Helmet>
      <Navigation />

      <Hero
        houseId={hausId}
        title={t("longTermPage.heroTitle")}
        subtitle={t("longTermPage.heroSubtitle")}
        scrollTarget="wohnen-auf-zeit"
        ctaLabel={t("navigation.requestNow")}
      />

      {langHaeuser.length > 1 && (
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4">
            <HouseSelector houses={langHaeuser} selectedHouseId={hausId} onHouseChange={setHausId} />
          </div>
        </div>
      )}

      {haus ? (
        <div id="haus">
          <LongTermRental house={haus} />
          <About house={haus} />
          <Stats house={haus} />
          <Features house={haus} />
          <VirtualTour house={haus} />
          <Gallery houseId={haus.id} />
        </div>
      ) : (
        houses.length > 0 && (
          <p className="container mx-auto px-4 py-16 text-center text-muted-foreground">
            {t("longTermPage.none")}
          </p>
        )
      )}

      <AboutUs />
      <Footer />
    </div>
  );
};

export default ChaletsAufZeit;
