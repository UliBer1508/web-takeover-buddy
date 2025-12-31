import { Mountain, Sparkles, Snowflake, Heart } from "lucide-react";

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
        <div className="space-y-6 max-w-4xl mx-auto text-center animate-fade-in">
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-3 p-6 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <highlight.icon className="w-8 h-8 text-primary" />
                <div className="text-center">
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
      </div>
    </section>
  );
};

export default About;
