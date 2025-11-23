import { Mountain, Sparkles, Snowflake, Heart } from "lucide-react";
import interiorImage from "@/assets/interior-living.jpg";

const About = () => {
  const highlights = [
    {
      icon: Mountain,
      title: "Bergpanorama",
      description: "Atemberaubender 360° Blick auf die Alpen",
    },
    {
      icon: Sparkles,
      title: "Luxusausstattung",
      description: "Hochwertige Einrichtung und moderne Annehmlichkeiten",
    },
    {
      icon: Snowflake,
      title: "Wellness",
      description: "Private Sauna und Entspannungsbereich",
    },
    {
      icon: Heart,
      title: "Wohlfühloase",
      description: "Gemütliche Atmosphäre für unvergessliche Momente",
    },
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 animate-slide-in-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Willkommen im Steinbock Chalet
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Erleben Sie alpinen Luxus in seiner schönsten Form. Unser exklusives
              Chalet bietet Ihnen den perfekten Rückzugsort inmitten der
              majestätischen Bergwelt. Mit liebevoll gestalteten Räumen, modernster
              Ausstattung und einem atemberaubenden Panoramablick wird Ihr
              Aufenthalt zu einem unvergesslichen Erlebnis.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Ob Winterurlaub auf der Piste oder Sommerfrische in den Bergen – das
              Steinbock Chalet ist Ihr idealer Ausgangspunkt für alpine Abenteuer
              und erholsame Stunden.
            </p>

            {/* Highlights Grid */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <highlight.icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {highlight.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-slide-in-right">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={interiorImage}
                alt="Luxuriöses Chalet Interieur"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
