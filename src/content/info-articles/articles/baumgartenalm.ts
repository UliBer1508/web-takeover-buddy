import { Flower2 } from "lucide-react";
import type { InfoArticle } from "../types";

// Image source: Unsplash (free to use under the Unsplash License)
const UNSPLASH = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const article: InfoArticle = {
  id: "baumgartenalm",
  topic: "hiking",
  icon: Flower2,
  gradient: "from-wood to-primary",
  coverImage: UNSPLASH("photo-1486870591958-9b9d0d1dda99", 1600),
  gallery: [
    {
      url: UNSPLASH("photo-1502784444187-359ac186c5bb"),
      caption: { de: "Blühende Almwiesen rund um die Hütte", en: "Blooming alpine meadows around the hut" },
    },
    {
      url: UNSPLASH("photo-1502082553048-f009c37129b9"),
      caption: { de: "Schattige Waldpassage am Aufstieg", en: "Shady forest section on the way up" },
    },
    {
      url: UNSPLASH("photo-1418065460487-3e41a6c84dc5"),
      caption: { de: "Almpanorama mit Bramberg im Tal", en: "Alm panorama with Bramberg in the valley" },
    },
    {
      url: UNSPLASH("photo-1464822759023-fed622ff2c3b"),
      caption: { de: "Bergblick Richtung Hohe Tauern", en: "Mountain view towards the Hohe Tauern" },
    },
  ],
  title: { de: "Baumgartenalm Bramberg", en: "Baumgartenalm in Bramberg" },
  subtitle: {
    de: "Familienfreundliche Almtour mit ruhiger Einkehr",
    en: "Family-friendly alm hike with a quiet stop",
  },
  shortDescription: {
    de: "Gemütliche Wanderung durch Wälder und Almwiesen zur urigen Baumgartenalm – hausgemachte Mehlspeisen und herzhafte Almküche.",
    en: "Easy hike through forests and alpine meadows to the rustic Baumgartenalm – homemade pastries and hearty alpine cuisine.",
  },
  stats: [
    { label: { de: "Länge", en: "Length" }, value: { de: "ca. 5 km", en: "approx. 5 km" } },
    { label: { de: "Höhenmeter", en: "Elevation" }, value: { de: "ca. 350 hm", en: "approx. 350 m" } },
    { label: { de: "Dauer", en: "Duration" }, value: { de: "ca. 2 h", en: "approx. 2 h" } },
    { label: { de: "Schwierigkeit", en: "Difficulty" }, value: { de: "leicht", en: "Easy" } },
  ],
  sections: [
    {
      heading: { de: "Streckenverlauf", en: "Route" },
      body: {
        de: "Vom Ortszentrum Bramberg über den Güterweg zum Haslachbauer. Über einen flachen, breiten Almweg geht es weiter durch Wald und über sonnige Wiesen bis zur Baumgartenalm. Rückweg auf gleicher Strecke.",
        en: "From the centre of Bramberg take the farm road to Haslachbauer. A flat, wide alm path continues through forest and across sunny meadows to the Baumgartenalm. Return on the same route.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Ruhige Alternative zu den Klassikern – wenig Wandererfrequenz", en: "Quiet alternative to the classics – low foot traffic" },
        { de: "Hausgemachte Mehlspeisen und Almkäse", en: "Homemade pastries and alm cheese" },
        { de: "Sonnige Almwiesen mit Bergblick", en: "Sunny alpine meadows with mountain views" },
        { de: "Ideal für Familien mit kleineren Kindern", en: "Ideal for families with smaller children" },
      ],
    },
    {
      heading: { de: "Gut zu wissen", en: "Good to know" },
      body: {
        de: "Bewirtschaftungszeiten meist von Mai bis Oktober. Anreise per Auto bis zum Ortszentrum Bramberg, Parkplätze direkt am Wanderbeginn.",
        en: "Usually open from May to October. Drive to the centre of Bramberg, parking is available right at the start of the trail.",
      },
    },
  ],
  externalUrl: "https://www.bergfex.at/sommer/salzburg/touren/wanderung/3695056,bramberg-am-wildkogel--baumgartenalm/",
  sourceLabel: "bergfex.at",
};

export default article;
