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
  coverImage: UNSPLASH("photo-1544191696-15693072e0b5", 1600),
  gallery: [
    {
      url: UNSPLASH("photo-1517649763962-0c623066013b"),
      caption: { de: "Sonnige Radtour entlang der Salzach", en: "Sunny ride along the Salzach river" },
    },
    {
      url: UNSPLASH("photo-1506260408121-e353d10b87c7"),
      caption: { de: "Wasserfall im Salzburger Land", en: "Waterfall in Salzburg country" },
    },
    {
      url: UNSPLASH("photo-1558981806-ec527fa84c39"),
      caption: { de: "Radfahrt mit Bergpanorama", en: "Cycling with mountain panorama" },
    },
    {
      url: UNSPLASH("photo-1502784444187-359ac186c5bb"),
      caption: { de: "Bergdorf im sonnigen Tal", en: "Mountain village in a sunny valley" },
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
