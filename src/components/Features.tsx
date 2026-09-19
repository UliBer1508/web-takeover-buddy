import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { SelectableHouse } from "@/hooks/useHouseSelection";
import { useHouseFeatures } from "@/hooks/useHouseFeatures";
import { featureIcon } from "@/lib/featureIcons";

interface FeaturesProps {
  house?: SelectableHouse | null;
}

const Features = ({ house }: FeaturesProps) => {
  const { t } = useTranslation();
  const { features } = useHouseFeatures(house?.id);

  // Ausstattung kommt ausschliesslich aus der Datenbank (house_features).
  // Ohne Eintraege entfaellt der Abschnitt.
  if (features.length === 0) return null;

  return (
    <section id="features" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("features.title")}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {house ? house.name : t("features.subtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((eintrag, index) => {
                const Symbol = featureIcon(eintrag.icon);
                return (
                  <Card
                    key={eintrag.id}
                    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary">
                          <Symbol className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {eintrag.title}
                          </h3>
                          {eintrag.description && (
                            <p className="text-sm text-muted-foreground">{eintrag.description}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
