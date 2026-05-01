import { useEffect, useState } from "react";
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
}

const Index = ({ initialGalleryView }: IndexProps = {}) => {
  const { t } = useTranslation();
  const { selectedHouseId, setSelectedHouseId, hasMultipleHouses, selectedHouse } = useHouseSelection();
  const [selectedDates, setSelectedDates] = useState<{
    checkIn: Date | null;
    checkOut: Date | null;
  }>({ checkIn: null, checkOut: null });

  // Update document title + meta tags + auto-scroll for deep-link routes
  useEffect(() => {
    if (!initialGalleryView) return;

    const isInfo = initialGalleryView === "info";
    const title = isInfo
      ? "Gäste-Infos & Region-Tipps – Steinbock Chalets"
      : "Galerie – Steinbock Chalets";
    const description = isInfo
      ? "Persönliche Insider-Tipps zur Region Pinzgau: Skigebiete, Wanderungen, Radtouren und Kultur – plus alle Infos zum Chalet."
      : "Bilder unseres Chalets in den österreichischen Alpen – Sommer wie Winter.";

    document.title = title;

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        const [key, val] = selector.replace("meta[", "").replace("]", "").split("=");
        el.setAttribute(key, val.replace(/"/g, ""));
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);

    // Smooth scroll to gallery section after content has had time to render
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
      <Navigation />
      <Hero />
      
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
      
      <About />
      <Stats />
      <Features />
      <Testimonials />
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
