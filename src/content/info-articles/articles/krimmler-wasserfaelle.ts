import { Droplets } from "lucide-react";
import type { InfoArticle } from "../types";

// Image source: Unsplash (free to use under the Unsplash License)
const UNSPLASH = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const article: InfoArticle = {
  id: "krimmler-wasserfaelle",
  topic: "hiking",
  icon: Droplets,
  gradient: "from-mountain-blue to-primary",
  coverImage: UNSPLASH("photo-1506260408121-e353d10b87c7", 1600),
  gallery: [
    {
      url: UNSPLASH("photo-1502082553048-f009c37129b9"),
      caption: { de: "Sonniger Waldweg entlang der Fälle", en: "Sunny forest path along the falls" },
    },
    {
      url: UNSPLASH("photo-1418065460487-3e41a6c84dc5"),
      caption: { de: "Bergblumen oberhalb der Fälle", en: "Mountain flowers above the falls" },
    },
    {
      url: UNSPLASH("photo-1502784444187-359ac186c5bb"),
      caption: { de: "Almwiese am oberen Ende", en: "Alpine meadow at the top" },
    },
    {
      url: UNSPLASH("photo-1500534314209-a25ddb2bd429"),
      caption: { de: "Helle alpine Landschaft im Achental", en: "Bright alpine scenery in the Achen Valley" },
    },
  ],
  title: { de: "Krimmler Wasserfälle – Wasserfallweg", en: "Krimml Waterfalls – Waterfall Trail" },
  subtitle: {
    de: "Höchste Wasserfälle Österreichs hautnah erleben",
    en: "Get up close to Austria's highest waterfalls",
  },
  shortDescription: {
    de: "Drei mächtige Fallstufen über 380 m, gut ausgebaute Aussichtskanzeln und ein begleitender Wald-Rundweg.",
    en: "Three mighty cascades over 380 m, well-built viewing platforms and an accompanying forest path.",
  },
  stats: [
    { label: { de: "Länge", en: "Length" }, value: { de: "ca. 4 km", en: "approx. 4 km" } },
    { label: { de: "Höhenmeter", en: "Elevation" }, value: { de: "ca. 460 hm", en: "approx. 460 m" } },
    { label: { de: "Dauer", en: "Duration" }, value: { de: "1,5–2 h hin", en: "1.5–2 h up" } },
    { label: { de: "Schwierigkeit", en: "Difficulty" }, value: { de: "leicht", en: "Easy" } },
  ],
  sections: [
    {
      heading: { de: "Streckenverlauf", en: "Route" },
      body: {
        de: "Vom Eingang der Wasserfälle führt der ‚Wasserfallweg‘ in zahlreichen Serpentinen über die untere, mittlere und obere Fallstufe bis zur Schettbrücke. Wer mag, geht weiter Richtung Krimmler Tauernhaus.",
        en: "From the waterfalls entrance, the 'Wasserfallweg' winds in serpentines past the lower, middle and upper cascades up to the Schettbrücke. From there you can continue towards Krimmler Tauernhaus.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "15 spektakuläre Aussichtskanzeln", en: "15 spectacular viewing platforms" },
        { de: "WasserWunderWelt am Eingang", en: "WasserWunderWelt experience at the entrance" },
        { de: "Schettbrücke mit Blick über alle Fallstufen", en: "Schettbrücke with views over all cascades" },
        { de: "Tauernhaus als gemütliche Einkehr oben", en: "Tauernhaus as a cosy stop at the top" },
      ],
    },
    {
      heading: { de: "Gut zu wissen", en: "Good to know" },
      body: {
        de: "Im Sommer ist der Eingangsbereich gebührenpflichtig. Bei Nässe ist der Weg rutschig – wasserfeste Jacke nicht vergessen, die Gischt erreicht alle Aussichtspunkte.",
        en: "There is an entry fee in summer at the main gate. The path can be slippery when wet – bring a waterproof jacket, the spray reaches every viewing platform.",
      },
    },
  ],
  externalUrl: "https://www.wasserfaelle-krimml.at",
  sourceLabel: "wasserfaelle-krimml.at",
};

export default article;
