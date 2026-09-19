import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SelectableHouse } from "@/hooks/useHouseSelection";
import { useHouseFeatures } from "@/hooks/useHouseFeatures";
import { featureIcon } from "@/lib/featureIcons";

interface AboutProps {
  /** Aktuell gewaehltes Haus. Ohne Angabe bleiben die festen Texte stehen. */
  house?: SelectableHouse | null;
}

const About = ({ house }: AboutProps) => {
  const { t, i18n } = useTranslation();
  const anfahrtBasis = i18n.language?.startsWith("en") ? "/directions" : "/anfahrt";
  const { highlights } = useHouseFeatures(house?.id);

  // Beschreibung des Hauses in Absaetze zerlegen. Leerzeile = neuer Absatz.
  const absaetze = (house?.description || "")
    .split(/\n\s*\n/)
    .map(a => a.trim())
    .filter(Boolean);

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

          {/* Hausbeschreibung - ausschliesslich aus der Datenbank (houses.description) */}
          {absaetze.map((absatz, i) => (
              <p key={i} className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {absatz}
              </p>
          ))}

          {house?.slug && (
            <Link
              to={`${anfahrtBasis}/${house.slug}`}
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              <MapPin className="w-4 h-4" />
              {t("directions.toDirections", "Anfahrt")}
            </Link>
          )}

          {/* Highlight-Kacheln des Hauses - ausschliesslich aus der Datenbank */}
          {highlights.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
              {highlights.map(eintrag => {
                const Symbol = featureIcon(eintrag.icon);
                return (
                  <div
                    key={eintrag.id}
                    className="flex flex-col items-center gap-3 p-6 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <Symbol className="w-8 h-8 text-primary" />
                    <div className="text-center">
                      <h3 className="font-semibold text-foreground mb-1">{eintrag.title}</h3>
                      {eintrag.description && (
                        <p className="text-sm text-muted-foreground">{eintrag.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default About;
