import { Mountain, Sparkles, Snowflake, Heart, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SelectableHouse } from "@/hooks/useHouseSelection";

interface AboutProps {
  /** Aktuell gewaehltes Haus. Ohne Angabe bleiben die festen Texte stehen. */
  house?: SelectableHouse | null;
}

const About = ({ house }: AboutProps) => {
  const { t } = useTranslation();

  const highlights = [
    {
      icon: Mountain,
      titleKey: "about.highlights.mountain.title",
      descriptionKey: "about.highlights.mountain.description",
    },
    {
      icon: Sparkles,
      titleKey: "about.highlights.luxury.title",
      descriptionKey: "about.highlights.luxury.description",
    },
    {
      icon: Snowflake,
      titleKey: "about.highlights.wellness.title",
      descriptionKey: "about.highlights.wellness.description",
    },
    {
      icon: Heart,
      titleKey: "about.highlights.comfort.title",
      descriptionKey: "about.highlights.comfort.description",
    },
  ];

  // Beschreibung des Hauses in Absaetze zerlegen. Leerzeile = neuer Absatz.
  const absaetze = (house?.description || "")
    .split(/\n\s*\n/)
    .map(a => a.trim())
    .filter(Boolean);

  const hatEigenenText = absaetze.length > 0;
  const eigeneMerkmale = house?.highlights || [];

  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 max-w-4xl mx-auto text-center animate-fade-in">

          {house?.location && (
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">
              {house.location}
            </div>
          )}

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            {house ? house.name : t("about.title")}
          </h2>

          {hatEigenenText ? (
            absaetze.map((absatz, i) => (
              <p key={i} className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {absatz}
              </p>
            ))
          ) : (
            <>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {t("about.description1")}
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {t("about.description2")}
              </p>
            </>
          )}

          {/* Merkmale: eigene des Hauses, sonst die allgemeinen vier Kacheln */}
          {eigeneMerkmale.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
              {eigeneMerkmale.map(merkmal => (
                <div
                  key={merkmal}
                  className="flex items-center justify-center gap-3 p-5 rounded-lg bg-secondary/50"
                >
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-medium text-foreground text-left">{merkmal}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-3 p-6 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <highlight.icon className="w-8 h-8 text-primary" />
                  <div className="text-center">
                    <h3 className="font-semibold text-foreground mb-1">
                      {t(highlight.titleKey)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t(highlight.descriptionKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default About;
