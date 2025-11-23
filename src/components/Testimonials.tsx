import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Familie Müller",
      date: "Februar 2024",
      rating: 5,
      text: "Ein absoluter Traum! Das Chalet übertrifft alle Erwartungen. Die Aussicht ist spektakulär und die Ausstattung lässt keine Wünsche offen. Wir kommen definitiv wieder!",
    },
    {
      name: "Sarah & Thomas",
      date: "Januar 2024",
      rating: 5,
      text: "Perfekt für einen romantischen Winterurlaub. Die Sauna nach einem Tag auf der Piste war himmlisch. Die Küche ist hervorragend ausgestattet.",
    },
    {
      name: "Familie Weber",
      date: "Dezember 2023",
      rating: 5,
      text: "Wir haben hier eine unvergessliche Weihnachtszeit verbracht. Das Chalet bietet alles für einen entspannten Familienurlaub. Top Lage und sehr sauber!",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Gästebewertungen
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Was unsere Gäste über ihren Aufenthalt sagen
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.date}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
