import { Bike } from "lucide-react";
import type { InfoArticle } from "../types";

// Image source: Unsplash (free to use under the Unsplash License)
const UNSPLASH = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const article: InfoArticle = {
  id: "tauernradweg",
  topic: "cycling",
  icon: Bike,
  gradient: "from-mountain-blue to-primary",
  coverImage: UNSPLASH("photo-1541625602330-2277a4c46182", 1600),
  gallery: [
    {
      url: UNSPLASH("photo-1571333250630-f0230c320b6d"),
      caption: { de: "Genussradeln entlang der Salzach im goldenen Licht", en: "Leisure cycling along the Salzach in golden light" },
    },
    {
      url: UNSPLASH("photo-1506905925346-21bda4d32df4"),
      caption: { de: "Türkisblauer Bergsee als Etappenziel", en: "Turquoise mountain lake as a stage destination" },
    },
    {
      url: UNSPLASH("photo-1502082553048-f009c37129b9"),
      caption: { de: "Sonniger Radweg durch lichten Bergwald", en: "Sunny cycle path through bright mountain forest" },
    },
    {
      url: UNSPLASH("photo-1502784444187-359ac186c5bb"),
      caption: { de: "Pinzgauer Bergdorf im Sonnenlicht", en: "Pinzgau mountain village bathed in sunlight" },
    },
  ],
  title: { de: "Tauernradweg", en: "Tauern Cycle Path" },
  subtitle: {
    de: "Von Krimml entlang der Salzach bis nach Passau",
    en: "From Krimml along the Salzach River to Passau",
  },
  shortDescription: {
    de: "Einer der beliebtesten Flussradwege Europas – überwiegend flach, familienfreundlich und mit traumhaften Alpenpanoramen.",
    en: "One of Europe's most popular river cycle paths – mostly flat, family-friendly, with stunning alpine views.",
  },
  stats: [
    { label: { de: "Länge", en: "Length" }, value: { de: "ca. 310 km", en: "approx. 310 km" } },
    { label: { de: "Etappen", en: "Stages" }, value: { de: "5–7", en: "5–7" } },
    { label: { de: "Schwierigkeit", en: "Difficulty" }, value: { de: "leicht", en: "Easy" } },
  ],
  sections: [
    {
      heading: { de: "Streckenverlauf", en: "Route" },
      body: {
        de: "Der Tauernradweg startet bei den Krimmler Wasserfällen, folgt der jungen Salzach durch den Pinzgau und Pongau, weiter über die Stadt Salzburg bis nach Passau an der Donau.",
        en: "The Tauern Cycle Path starts at the Krimml Waterfalls, follows the young Salzach through Pinzgau and Pongau, past the city of Salzburg, all the way to Passau on the Danube.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Krimmler Wasserfälle – höchste Wasserfälle Österreichs", en: "Krimml Waterfalls – Austria's highest waterfalls" },
        { de: "Nationalpark Hohe Tauern", en: "Hohe Tauern National Park" },
        { de: "Mittelalterliche Festung Hohenwerfen", en: "Medieval Hohenwerfen Fortress" },
        { de: "Mozartstadt Salzburg", en: "Mozart's city of Salzburg" },
      ],
    },
    {
      heading: { de: "Gut zu wissen", en: "Good to know" },
      body: {
        de: "Die Strecke ist überwiegend asphaltiert und auch für E-Bikes bestens geeignet. Gepäcktransport und Bahnanbindung machen die Tour besonders komfortabel.",
        en: "The route is mostly paved and ideal for e-bikes. Luggage transfer and rail connections make the tour especially convenient.",
      },
    },
  ],
  externalUrl: "https://www.tauernradweg.com",
  sourceLabel: "tauernradweg.com",
};

export default article;
