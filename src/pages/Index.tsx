import { useState } from "react";
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

const Index = () => {
  const { t } = useTranslation();
  const { selectedHouseId, setSelectedHouseId, hasMultipleHouses, selectedHouse } = useHouseSelection();
  const [selectedDates, setSelectedDates] = useState<{
    checkIn: Date | null;
    checkOut: Date | null;
  }>({ checkIn: null, checkOut: null });

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
      <Gallery houseId={selectedHouseId} />
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
