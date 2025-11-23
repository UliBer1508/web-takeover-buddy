import { Bed, UtensilsCrossed, Waves, TreePine, Wifi, Car } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import bedroomImage from "@/assets/bedroom.jpg";
import kitchenImage from "@/assets/kitchen.jpg";

const Features = () => {
  const features = [
    {
      icon: Bed,
      title: "5 Schlafzimmer",
      description: "Komfortable Zimmer mit hochwertigen Matratzen und alpinem Charme",
      image: bedroomImage,
    },
    {
      icon: UtensilsCrossed,
      title: "Gourmet-Küche",
      description: "Vollausgestattete Küche mit Premium-Geräten und großem Essbereich",
      image: kitchenImage,
    },
    {
      icon: Waves,
      title: "Wellness & Sauna",
      description: "Private Sauna und Entspannungsbereich für ultimative Erholung",
      image: null,
    },
    {
      icon: TreePine,
      title: "Terrasse & Garten",
      description: "Weitläufige Außenbereiche mit Panoramablick auf die Berge",
      image: null,
    },
    {
      icon: Wifi,
      title: "High-Speed WLAN",
      description: "Schnelles Internet im gesamten Chalet verfügbar",
      image: null,
    },
    {
      icon: Car,
      title: "Parkplätze",
      description: "Private Parkplätze direkt am Chalet",
      image: null,
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Ausstattung & Highlights
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Entdecken Sie die exklusiven Annehmlichkeiten unseres Luxus-Chalets
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {feature.image && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
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
