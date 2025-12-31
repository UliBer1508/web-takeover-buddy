import { Bed, UtensilsCrossed, Waves, TreePine, Wifi, Car } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const Features = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: Bed,
      titleKey: "features.items.bedrooms.title",
      descriptionKey: "features.items.bedrooms.description",
    },
    {
      icon: UtensilsCrossed,
      titleKey: "features.items.kitchen.title",
      descriptionKey: "features.items.kitchen.description",
    },
    {
      icon: Waves,
      titleKey: "features.items.wellness.title",
      descriptionKey: "features.items.wellness.description",
    },
    {
      icon: TreePine,
      titleKey: "features.items.terrace.title",
      descriptionKey: "features.items.terrace.description",
    },
    {
      icon: Wifi,
      titleKey: "features.items.wifi.title",
      descriptionKey: "features.items.wifi.description",
    },
    {
      icon: Car,
      titleKey: "features.items.parking.title",
      descriptionKey: "features.items.parking.description",
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("features.title")}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t(feature.descriptionKey)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
