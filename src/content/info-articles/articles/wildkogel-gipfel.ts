import { Mountain } from "lucide-react";
import type { InfoArticle } from "../types";
// Real photos from Wikimedia Commons (CC BY-SA)
// Wildkogel-Gipfelkreuz by Erwinnindl (CC BY-SA 3.0)
// Wildkogel from Hollersbach by Herzi Pinki (CC BY-SA 4.0)
import wildkogelGipfel from "@/assets/hiking/wildkogel-gipfel.jpg";
import wildkogelView from "@/assets/hiking/wildkogel-view.jpg";

const article: InfoArticle = {
  id: "wildkogel-gipfel",
  topic: "hiking",
  icon: Mountain,
  gradient: "from-mountain-blue to-accent",
  coverImage: wildkogelGipfel,
  gallery: [
    {
      url: wildkogelGipfel,
      caption: { de: "Gipfelkreuz am Wildkogel auf 2.224 m", en: "Summit cross at the Wildkogel (2,224 m)" },
    },
    {
      url: wildkogelView,
      caption: { de: "Wildkogel-Massiv vom Tal aus gesehen", en: "Wildkogel massif seen from the valley" },
    },
  ],
  title: { de: "Wildkogel-Gipfeltour", en: "Wildkogel Summit Hike" },
  subtitle: {
    de: "360°-Panorama auf 2.224 m mit Bergbahn-Auffahrt",
    en: "360° panorama at 2,224 m with cable car access",
  },
  shortDescription: {
    de: "Aussichtsreicher Höhenweg über Almen und Latschenfelder zum Gipfelkreuz mit Blick auf den Großvenediger.",
    en: "Scenic high trail across pastures and pine fields to the summit cross with views of the Großvenediger.",
  },
  stats: [
    { label: { de: "Länge", en: "Length" }, value: { de: "ca. 5 km Rundweg", en: "approx. 5 km loop" } },
    { label: { de: "Höhenmeter", en: "Elevation" }, value: { de: "ca. 350 hm", en: "approx. 350 m" } },
    { label: { de: "Dauer", en: "Duration" }, value: { de: "ca. 2 h", en: "approx. 2 h" } },
    { label: { de: "Schwierigkeit", en: "Difficulty" }, value: { de: "mittel", en: "Moderate" } },
  ],
  sections: [
    {
      heading: { de: "Streckenverlauf", en: "Route" },
      body: {
        de: "Mit der Smaragdbahn von Bramberg oder Neukirchen auf den Wildkogel auffahren. Von der Bergstation auf dem markierten Höhenweg zum Wildkogel-Gipfelkreuz und auf einer Schleife zurück.",
        en: "Take the Smaragdbahn cable car from Bramberg or Neukirchen up to the Wildkogel. From the top station, follow the marked high trail to the summit cross and loop back.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Gipfelkreuz Wildkogel auf 2.224 m", en: "Wildkogel summit cross at 2,224 m" },
        { de: "Blick auf Großvenediger und Großglockner", en: "Views of Großvenediger and Großglockner" },
        { de: "Erlebniswelt mit Aussichtsplattform", en: "Adventure park with viewing platform" },
        { de: "Bergrestaurants auf dem Weg", en: "Mountain restaurants along the way" },
      ],
    },
    {
      heading: { de: "Gut zu wissen", en: "Good to know" },
      body: {
        de: "Gäste mit der Nationalpark-Sommercard fahren die Bergbahn häufig vergünstigt. Wetterumschwung am Berg möglich – Wind- und Regenschutz mitnehmen.",
        en: "Guests with the National Park Summer Card often get a discount on the cable car. Weather can change quickly up high – bring wind and rain protection.",
      },
    },
  ],
  externalUrl: "https://www.wildkogel-arena.at/sommer/wandern/",
  sourceLabel: "wildkogel-arena.at",
};

export default article;
