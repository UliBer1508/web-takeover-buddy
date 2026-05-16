import { Users } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/family/wildkogel-funslope.jpg";

const article: InfoArticle = {
  id: "wildkogel-family-fun",
  topic: "family",
  icon: Users,
  gradient: "from-accent to-primary",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Mountaincart-Fahrt am Wildkogel", en: "Mountaincart ride on Wildkogel" } },
  ],
  title: { de: "Wildkogel Family Fun – Rutschen & Mountaincarts", en: "Wildkogel Family Fun – Slides & Mountaincarts" },
  subtitle: { de: "Sommerabenteuer am Hausberg", en: "Summer adventure on the local mountain" },
  shortDescription: {
    de: "Rutschenweg, Mountaincarts, Bogenparcours und Wasserspielplatz – der Wildkogel ist ein riesiger Spielplatz für Kinder und Erwachsene.",
    en: "Slide trail, mountaincarts, archery course and water playground – the Wildkogel is one huge playground for kids and adults alike.",
  },
  stats: [
    { label: { de: "Höhe", en: "Altitude" }, value: { de: "2.150 m", en: "2,150 m" } },
    { label: { de: "Saison", en: "Season" }, value: { de: "Juni–Okt.", en: "Jun–Oct" } },
    { label: { de: "Entfernung", en: "Distance" }, value: { de: "ca. 5 km", en: "approx. 5 km" } },
    { label: { de: "Familien", en: "Families" }, value: { de: "ideal", en: "ideal" } },
  ],
  sections: [
    {
      heading: { de: "Das Erlebnis", en: "The experience" },
      body: {
        de: "Mit der Wildkogelbahn auf die Smaragdjuwele-Bergstation und dann den ganzen Tag spielen: Rutschen, mit Mountaincarts ins Tal düsen, Adlerwurf-Bogenparcours oder am Hexenwasser planschen.",
        en: "Take the Wildkogelbahn up to the summit station, then play all day: slides, racing down on mountaincarts, the archery trail or splashing at the Witches' Water playground.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Rutschenweg mit mehreren Stationen", en: "Slide trail with multiple stations" },
        { de: "Mountaincart-Strecke ins Tal", en: "Mountaincart track down to the valley" },
        { de: "Bogenparcours für die ganze Familie", en: "Family archery course" },
        { de: "Hexenwasser-Spielplatz", en: "Witches' Water playground" },
      ],
    },
  ],
  externalUrl: "https://www.wildkogel-arena.at/de/sommer/familien.html",
  sourceLabel: "wildkogel-arena.at",
};

export default article;
