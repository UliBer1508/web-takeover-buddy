import { Mountain } from "lucide-react";
import type { InfoArticle } from "../types";

// Image source: Unsplash (free to use under the Unsplash License)
const UNSPLASH = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const article: InfoArticle = {
  id: "wildkogel-gipfel",
  topic: "hiking",
  icon: Mountain,
  gradient: "from-mountain-blue to-accent",
  coverImage: UNSPLASH("photo-1735410162712-f42fe3b173e4", 1600),
  gallery: [
    {
      url: UNSPLASH("photo-1658242662484-611a2c472780"),
      caption: { de: "Gipfelkreuz über den Hohen Tauern", en: "Summit cross above the Hohe Tauern" },
    },
    {
      url: UNSPLASH("photo-1756846036941-36644e2dff7a"),
      caption: { de: "Bergsee am Wildkogel-Höhenweg", en: "Mountain lake along the Wildkogel high trail" },
    },
    {
      url: UNSPLASH("photo-1761384140398-88c88e648fcb"),
      caption: { de: "Almenrausch und Bergblumen", en: "Alpenrose and mountain flowers" },
    },
    {
      url: UNSPLASH("photo-1750526927596-654bdccacc3c"),
      caption: { de: "Großvenediger im Hintergrund", en: "Großvenediger in the distance" },
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
