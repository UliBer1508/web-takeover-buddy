import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { SelectableHouse } from "@/hooks/useHouseSelection";

interface StatItem {
  value: number;
  label: string;
  suffix?: string;
  decimals?: number;
}

interface StatsProps {
  house?: SelectableHouse | null;
}

const Stats = ({ house }: StatsProps) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Durchschnittsnote aus den sichtbaren Bewertungen DIESES Hauses. Keine
  // Bewertungen, keine Note - statt einer erfundenen Zahl.
  const { data: note } = useQuery({
    queryKey: ["haus-note", house?.id],
    queryFn: async () => {
      if (!house?.id) return null;
      const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("house_id", house.id)
        .eq("is_visible", true);
      if (error) throw error;
      if (!data || data.length === 0) return null;
      const summe = data.reduce((s, r) => s + (r.rating ?? 0), 0);
      return Math.round((summe / data.length) * 10) / 10;
    },
    enabled: !!house?.id,
  });

  // Nur zeigen, was tatsaechlich hinterlegt ist.
  const stats: StatItem[] = [];
  if (house?.bedrooms) stats.push({ value: house.bedrooms, label: t("stats.bedrooms") });
  if (house?.max_guests) stats.push({ value: house.max_guests, label: t("stats.guests") });
  if (house?.square_meters) stats.push({ value: house.square_meters, label: t("stats.squareMeters"), suffix: "m²" });
  if (note) stats.push({ value: note, label: t("stats.rating"), suffix: "★", decimals: 1 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Ohne Kennzahlen gar keine Leiste - ein leerer farbiger Balken sieht aus
  // wie ein Fehler.
  if (stats.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-16 md:py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid gap-8 md:gap-12 grid-cols-2 ${stats.length >= 4 ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                {isVisible ? (
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                ) : (
                  "0"
                )}
              </div>
              <div className="text-sm md:text-base text-primary-foreground/80 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AnimatedNumber = ({
  value,
  suffix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <>
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}
      {suffix}
    </>
  );
};

export default Stats;
