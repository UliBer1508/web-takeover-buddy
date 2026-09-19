import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Features from "@/components/Features";
import NearbyPlaces from "@/components/NearbyPlaces";
import SkiAreas from "@/components/SkiAreas";
import Stats from "@/components/Stats";
import BookingForm from "@/components/BookingForm";
import Testimonials from "@/components/Testimonials";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import HouseSelector from "@/components/HouseSelector";
import ChaletCards from "@/components/ChaletCards";
import AdminHousesPanel from "@/components/AdminHousesPanel";
import { useHouseSelection } from "@/hooks/useHouseSelection";

interface IndexProps {
  initialGalleryView?: "photos" | "info";
  startAtGallery?: boolean;
}

const Index = ({ initialGalleryView, startAtGallery = false }: IndexProps = {}) => {
  const { t, i18n } = useTranslation();
  const { houses, selectedHouseId, setSelectedHouseId, hasMultipleHouses, selectedHouse } =
    useHouseSelection();
  const [selectedDates, setSelectedDates] = useState<{
    checkIn: Date | null;
    checkOut: Date | null;
  }>({ checkIn: null, checkOut: null });

  // Admin-Vorschau: Bilder eines Hauses pflegen, das fuer Gaeste noch
  // ausgeschaltet ist.
  const [vorschauHausId, setVorschauHausId] = useState<string | null>(null);
  const [vorschauHausName, setVorschauHausName] = useState<string | null>(null);

  const location = useLocation();

  const isInfo = initialGalleryView === "info";
  const isGalleryPhotos = initialGalleryView === "photos";
  const seoKey = isInfo ? "seo.info" : isGalleryPhotos ? "seo.gallery" : "seo.home";
  const pageTitle = t(`${seoKey}.title`);
  const pageDescription = t(`${seoKey}.description`);

  const canonicalPath = isInfo
    ? "/galerie/info"
    : isGalleryPhotos
      ? "/galerie"
      : location.pathname === "/" ? "/" : location.pathname;
  const canonicalUrl = `https://steinbockchalets.com${canonicalPath}`;
  const htmlLang = i18n.language?.startsWith("en") ? "en" : "de";

  useEffect(() => {
    if (!initialGalleryView) return;
    const timer = setTimeout(() => {
      document.getElementById("galerie")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [initialGalleryView]);

  // Wechselt der Gast das Haus, ist die bisherige Datumsauswahl hinfaellig -
  // sie galt fuer das andere Haus und kann dort belegt sein.
  useEffect(() => {
    setSelectedDates({ checkIn: null, checkOut: null });
  }, [selectedHouseId]);

  const handleDateSelection = (checkIn: Date | null, checkOut: Date | null) => {
    setSelectedDates({ checkIn, checkOut });
    if (checkIn && checkOut) {
      setTimeout(() => {
        document.getElementById('booking')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 400);
    }
  };

  // Karte angeklickt: nur Haus auswaehlen. Kein Sprung nach unten - der Gast
  // soll zuerst das Titelbild des Hauses sehen (Wunsch Uli, 19.09.2026).
  const handleChaletSelect = (houseId: string) => {
    setSelectedHouseId(houseId);
  };

  const galerieHausId = vorschauHausId ?? selectedHouseId;

  // Auf der Startseite steht oben die Marke, nicht ein einzelnes Haus.
  const heroTitle = hasMultipleHouses ? "Steinbock Chalets" : null;
  const heroSubtitle = hasMultipleHouses
    ? t(
        "hero.brandSubtitle",
        "Zwei Ferienhäuser im Oberpinzgau — Neukirchen am Großvenediger und Wald im Pinzgau"
      )
    : null;

  // Beide Häuser stehen direkt im Titelbild, damit Gäste sie ohne Scrollen
  // sehen. In der Admin-Bildvorschau bleiben sie weg: dort geht es um ein Haus.
  const zeigeKartenImHero = hasMultipleHouses && !startAtGallery && !vorschauHausId;

  return (
    <div className="min-h-screen">
      <Helmet>
        <html lang={htmlLang} />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://steinbockchalets.com/og-preview.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://steinbockchalets.com/og-preview.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LodgingBusiness",
          name: "Steinbock Chalets",
          description: pageDescription,
          url: "https://steinbockchalets.com",
          image: "https://steinbockchalets.com/og-preview.jpg",
          telephone: "+49 15757153466",
          email: "steinbockchalets@gmail.com",
          priceRange: "€€€",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Venedigersiedlung 316",
            postalCode: "5741",
            addressLocality: "Neukirchen am Großvenediger",
            addressCountry: "AT",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 47.249878,
            longitude: 12.254109,
          },
        })}</script>
      </Helmet>
      <Navigation />

      {!startAtGallery && (
        <Hero
          houseId={vorschauHausId ?? selectedHouseId}
          title={vorschauHausName ?? heroTitle}
          subtitle={vorschauHausName ? null : heroSubtitle}
          scrollTarget="haus"
          bottomSlot={
            zeigeKartenImHero ? (
              <ChaletCards
                houses={houses}
                selectedHouseId={selectedHouseId}
                onSelectHouse={handleChaletSelect}
                variant="overlay"
              />
            ) : null
          }
        />
      )}

      {/* Admin-Schalter: steuert, welche Häuser Gäste sehen. Für Gäste unsichtbar. */}
      <AdminHousesPanel
        vorschauHausId={vorschauHausId}
        onVorschau={(id, name) => {
          setVorschauHausId(id);
          setVorschauHausName(name);
        }}
      />

      {/* Ab hier geht es um EIN Haus: das ausgewählte */}
      <div id="haus">
        {/* Umschaltleiste nur, wo es kein Titelbild mit Hauskarten gibt (/galerie).
            Auf der Startseite wird über die Karten im Titelbild gewechselt
            (Entscheidung Uli, 19.09.2026). */}
        {hasMultipleHouses && !zeigeKartenImHero && (
          <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b">
            <div className="container mx-auto px-4">
              <HouseSelector
                houses={houses}
                selectedHouseId={selectedHouseId}
                onHouseChange={setSelectedHouseId}
              />
            </div>
          </div>
        )}

        {!startAtGallery && (
          <>
            <About house={selectedHouse} />
            <Stats house={selectedHouse} />
            <Features house={selectedHouse} />
            <NearbyPlaces house={selectedHouse} />
            <SkiAreas />
            <Testimonials />
          </>
        )}
        <Gallery houseId={galerieHausId} initialView={initialGalleryView} />
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                {t('calendar.sectionTitle')}
              </h2>
              <p className="text-muted-foreground">
                {t('calendar.sectionSubtitle')}
              </p>
            </div>
            <AvailabilityCalendar
              houses={houses}
              selectedHouseId={selectedHouseId}
              onDateRangeSelect={handleDateSelection}
            />
          </div>
        </section>
        <BookingForm
          initialCheckIn={selectedDates.checkIn}
          initialCheckOut={selectedDates.checkOut}
          defaultHouseId={selectedHouseId}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Index;
