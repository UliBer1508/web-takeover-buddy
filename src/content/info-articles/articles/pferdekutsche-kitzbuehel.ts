import { Crown } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/premium/pferdekutsche-kitzbuehel.jpg";

const article: InfoArticle = {
  id: "pferdekutsche-kitzbuehel",
  topic: "premium",
  icon: Crown,
  gradient: "from-accent to-primary",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Fiaker in der Kitzbüheler Altstadt", en: "Horse carriage in Kitzbühel old town" } },
  ],
  title: { de: "Pferdekutschenfahrt Kitzbühel", en: "Horse-Carriage Ride Kitzbühel" },
  subtitle: { de: "Stilvoll durch die Gamsstadt", en: "An elegant ride through the legendary Alpine town" },
  shortDescription: {
    de: "Klassische Fiaker- und Pferdekutschenfahrten durch Kitzbühel und das umliegende Tal – Sommer wie Winter.",
    en: "Classic horse-drawn carriage rides through Kitzbühel and the surrounding valley – summer and winter.",
  },
  stats: [
    { label: { de: "Dauer", en: "Duration" }, value: { de: "ca. 30–60 min", en: "approx. 30–60 min" } },
    { label: { de: "Personen", en: "People" }, value: { de: "bis 6", en: "up to 6" } },
    { label: { de: "Saison", en: "Season" }, value: { de: "ganzjährig", en: "year-round" } },
    { label: { de: "Entfernung", en: "Distance" }, value: { de: "ca. 50 km", en: "approx. 50 km" } },
  ],
  sections: [
    {
      heading: { de: "Das Erlebnis", en: "The experience" },
      body: {
        de: "Erleben Sie Kitzbühel auf die elegante Art: Mehrere Anbieter starten im Stadtzentrum und fahren durch die historische Altstadt oder hinaus ins Bichlach.",
        en: "Experience Kitzbühel in style: several operators depart from the town centre and drive through the historic old town or out into the Bichlach meadows.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Historische Altstadt vom Kutschbock", en: "Historic old town from the coach box" },
        { de: "Romantisch zu zweit oder mit Familie", en: "Romantic for couples or families" },
        { de: "Private Touren buchbar", en: "Private tours bookable" },
        { de: "Auch im Winter im Schnee", en: "Snowy rides in winter too" },
      ],
    },
  ],
  externalUrl: "https://www.kitzbuehel.com/de/erlebnis/sport-freizeit/pferdekutsche",
  sourceLabel: "kitzbuehel.com",
};

export default article;
