import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import BookingForm from "@/components/BookingForm";
import Testimonials from "@/components/Testimonials";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import HouseSelector from "@/components/HouseSelector";
import { useHouseSelection } from "@/hooks/useHouseSelection";

interface IndexProps {
  initialGalleryView?: "photos" | "info";
  startAtGallery?: boolean;
}

const Index = ({ initialGalleryView, startAtGallery = false }: IndexProps = {}) => {
  const { t } = useTranslation();
  const { selectedHouseId, setSelectedHouseId, hasMultipleHouses, selectedHouse } = useHouseSelection();
  const [selectedDates, setSelectedDates] = useState<{
    checkIn: Date | null;
    checkOut: Date | null;
  }>({ checkIn: null, checkOut: null });

  const location = useLocation();

  const isInfo = initialGalleryView === "info";
  const isGalleryPhotos = initialGalleryView === "photos";
  const pageTitle = isInfo
    ? "Gäste-Infos & Region-Tipps – Steinbock Chalets"
    : isGalleryPhotos
      ? "Galerie – Steinbock Chalets"
      : "Steinbock Chalets – Ferienchalets in den Hohen Tauern";
  const pageDescription = isInfo
    ? "Persönliche Insider-Tipps zur Region Pinzgau: Skigebiete, Wanderungen, Radtouren und Kultur – plus alle Infos zum Chalet."
    : isGalleryPhotos
      ? "Bilder unseres Chalets in den österreichischen Alpen – Sommer wie Winter."
      : "Buchen Sie Ihr Chalet in Neukirchen am Großvenediger. Skifahren, Wandern und Erholung in den Hohen Tauern.";
  const canonicalUrl = `https://steinbockchalets.com${location.pathname === "/" ? "/" : location.pathname}`;

  // Auto-scroll to gallery section for deep-link routes
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

  const handleDateSelection = (checkIn: Date | null, checkOut: Date | null) => {
    setSelectedDates({ checkIn, checkOut });
    
    // Smooth scroll to booking form after selection
    if (checkIn && checkOut) {
      setTimeout(() => {
        document.getElementById('booking')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 400);
    }
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Navigation />
      {!startAtGallery && <Hero />}
      
      {/* House Selector - only shown when multiple houses exist */}
      {hasMultipleHouses && (
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4">
            <HouseSelector 
              selectedHouseId={selectedHouseId} 
              onHouseChange={setSelectedHouseId} 
            />
          </div>
        </div>
      )}
      
      {!startAtGallery && (
        <>
          <About />
          <Stats />
          <Features />
          <Testimonials />
        </>
      )}
      <Gallery houseId={selectedHouseId} initialView={initialGalleryView} />
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
          <AvailabilityCalendar externalHouseId={selectedHouse?.external_house_id} onDateRangeSelect={handleDateSelection} />
        </div>
      </section>
      <BookingForm 
        initialCheckIn={selectedDates.checkIn} 
        initialCheckOut={selectedDates.checkOut}
        defaultHouseId={selectedHouseId}
      />
      <Footer />
    </div>
  );
};

export default Index;
