import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";

interface StatItem {
  value: number;
  labelKey: string;
  suffix?: string;
  decimals?: number;
}

const Stats = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats: StatItem[] = [
    { value: 3, labelKey: "stats.bedrooms", suffix: "" },
    { value: 6, labelKey: "stats.guests", suffix: "" },
    { value: 135, labelKey: "stats.squareMeters", suffix: "m²" },
    { value: 4.9, labelKey: "stats.rating", suffix: "★", decimals: 1 },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
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
                {t(stat.labelKey)}
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
