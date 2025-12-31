import { Mountain, Sparkles, Snowflake, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

const About = () => {
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

  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            {t("about.title")}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            {t("about.description1")}
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            {t("about.description2")}
          </p>

          {/* Highlights Grid */}
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
        </div>
      </div>
    </section>
  );
};

export default About;
