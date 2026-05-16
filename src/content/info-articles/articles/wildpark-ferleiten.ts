import { Users } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/family/wildpark-ferleiten.jpg";

const article: InfoArticle = {
  id: "wildpark-ferleiten",
  topic: "family",
  icon: Users,
  gradient: "from-primary to-accent",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Hirsch im Wildpark Ferleiten", en: "Red deer in Wildpark Ferleiten" } },
  ],
  title: { de: "Wildpark Ferleiten", en: "Wildpark Ferleiten" },
  subtitle: { de: "Heimische Tiere am Fuß des Großglockners", en: "Native wildlife at the foot of the Großglockner" },
  shortDescription: {
    de: "Über 200 Tiere in 100 großzügigen Gehegen – Steinböcke, Murmeltiere, Bären und Luchse, dazu ein großer Erlebnisspielplatz.",
    en: "Over 200 animals in 100 spacious enclosures – ibex, marmots, bears and lynx, plus a large adventure playground.",
  },
  stats: [
    { label: { de: "Tiere", en: "Animals" }, value: { de: "200+", en: "200+" } },
    { label: { de: "Saison", en: "Season" }, value: { de: "Mai–Okt.", en: "May–Oct." } },
    { label: { de: "Dauer", en: "Visit time" }, value: { de: "ca. 2–3 h", en: "approx. 2–3 h" } },
    { label: { de: "Entfernung", en: "Distance" }, value: { de: "ca. 65 km", en: "approx. 65 km" } },
  ],
  sections: [
    {
      heading: { de: "Das Erlebnis", en: "The experience" },
      body: {
        de: "Ein 3 km langer Rundweg führt durch den Wildpark am Beginn der Großglockner Hochalpenstraße. Perfekt mit einem Glockner-Ausflug kombinierbar.",
        en: "A 3 km loop leads through the park at the start of the Großglockner High Alpine Road. Perfect to combine with a Glockner road trip.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Steinböcke, Bären, Luchse, Wölfe", en: "Ibex, bears, lynx and wolves" },
        { de: "Großer Abenteuerspielplatz", en: "Large adventure playground" },
        { de: "Kinderwagentauglicher Rundweg", en: "Pram-friendly loop" },
        { de: "Restaurant mit Almprodukten", en: "Restaurant with alpine cuisine" },
      ],
    },
  ],
  externalUrl: "https://www.wildpark-ferleiten.at",
  sourceLabel: "wildpark-ferleiten.at",
};

export default article;
