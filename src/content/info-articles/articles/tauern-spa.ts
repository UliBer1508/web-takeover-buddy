import { Sparkles } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/wellness/tauern-spa.jpg";

const article: InfoArticle = {
  id: "tauern-spa",
  topic: "wellness",
  icon: Sparkles,
  gradient: "from-primary to-accent",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Außenpool mit Bergblick", en: "Outdoor pool with mountain view" } },
  ],
  title: { de: "Tauern Spa Zell am See – Kaprun", en: "Tauern Spa Zell am See – Kaprun" },
  subtitle: { de: "Therme & Sauna mit Panoramablick", en: "Thermal baths & sauna with panoramic views" },
  shortDescription: {
    de: "Eine der größten Thermenanlagen der Alpen: 12 Pools, 10 Saunen, Day-Spa und großzügige Familienwelt.",
    en: "One of the largest thermal complexes in the Alps: 12 pools, 10 saunas, day spa and a generous family world.",
  },
  stats: [
    { label: { de: "Pools", en: "Pools" }, value: { de: "12", en: "12" } },
    { label: { de: "Saunen", en: "Saunas" }, value: { de: "10", en: "10" } },
    { label: { de: "Saison", en: "Season" }, value: { de: "ganzjährig", en: "year-round" } },
    { label: { de: "Entfernung", en: "Distance" }, value: { de: "ca. 32 km", en: "approx. 32 km" } },
  ],
  sections: [
    {
      heading: { de: "Das Erlebnis", en: "The experience" },
      body: {
        de: "Großzügige Wasserwelten, eine textile Familientherme und eine separate Sauna-Landschaft. Ideale Schlechtwetter-Alternative – aber auch im Sommer perfekt zum Entspannen nach einem Wandertag.",
        en: "Generous water worlds, a family-friendly textile thermal area and a separate sauna landscape. A perfect bad-weather option – and equally great after a summer hike.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Outdoor-Solepool mit Bergblick", en: "Outdoor brine pool with mountain view" },
        { de: "Familienwelt mit Rutschen", en: "Family world with water slides" },
        { de: "Day-Spa & Massagen", en: "Day spa and massages" },
        { de: "Separate Erwachsenenbereiche", en: "Separate adults-only areas" },
      ],
    },
  ],
  externalUrl: "https://www.tauernspakaprun.com",
  sourceLabel: "tauernspakaprun.com",
};

export default article;
