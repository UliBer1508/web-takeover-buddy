import { Sun } from "lucide-react";
import type { InfoArticle } from "../types";
import stockenbaumalmCover from "@/assets/hiking/stockenbaumalm-cover.jpg";

// Image source: Unsplash (free to use under the Unsplash License)
const UNSPLASH = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const article: InfoArticle = {
  id: "stockenbaumalm",
  topic: "hiking",
  icon: Sun,
  gradient: "from-accent to-wood",
  coverImage: stockenbaumalmCover,
  gallery: [
    {
      url: UNSPLASH("photo-1418065460487-3e41a6c84dc5"),
      caption: { de: "Sonniger Höhenweg auf halber Höhe", en: "Sunny high path at mid-altitude" },
    },
    {
      url: UNSPLASH("photo-1486870591958-9b9d0d1dda99"),
      caption: { de: "Aussicht ins Salzachtal", en: "View into the Salzach Valley" },
    },
    {
      url: UNSPLASH("photo-1464822759023-fed622ff2c3b"),
      caption: { de: "Großvenediger-Panorama vom Sonnenweg", en: "Großvenediger panorama from the sunny trail" },
    },
    {
      url: UNSPLASH("photo-1469474968028-56623f02e42e"),
      caption: { de: "Gemütliche Einkehr am Gasthof Stockenbaum", en: "Cosy stop at Gasthof Stockenbaum" },
    },
  ],
  title: { de: "Stockenbaumalm via Sonnenweg", en: "Stockenbaumalm via Sun Trail" },
  subtitle: {
    de: "Aussichtsreicher Höhenweg mit garantierter Einkehr",
    en: "Scenic mid-altitude trail with a guaranteed stop",
  },
  shortDescription: {
    de: "Genuss-Wanderung auf halber Höhe von Neukirchen zum Gasthof Stockenbaum – ganzjährig bewirtschaftet, ideal für Familien und Genießer.",
    en: "Easy walk at mid-altitude from Neukirchen to Gasthof Stockenbaum – open year-round, perfect for families and gourmets.",
  },
  stats: [
    { label: { de: "Länge", en: "Length" }, value: { de: "ca. 3,5 km", en: "approx. 3.5 km" } },
    { label: { de: "Höhenmeter", en: "Elevation" }, value: { de: "ca. 150 hm", en: "approx. 150 m" } },
    { label: { de: "Dauer", en: "Duration" }, value: { de: "ca. 1–1,5 h", en: "approx. 1–1.5 h" } },
    { label: { de: "Schwierigkeit", en: "Difficulty" }, value: { de: "leicht", en: "Easy" } },
  ],
  sections: [
    {
      heading: { de: "Streckenverlauf", en: "Route" },
      body: {
        de: "Einstieg am Gasthof Rechtegg in Neukirchen. Der Sonnenweg führt sanft ostwärts auf halber Höhe Richtung Steinerbauer und endet am Gasthof Stockenbaum. Auf Wunsch Abstieg nach Neukirchen oder Weiterwanderung nach Bramberg.",
        en: "Start at Gasthof Rechtegg in Neukirchen. The Sun Trail meanders gently east at mid-altitude past Steinerbauer and ends at Gasthof Stockenbaum. You can descend to Neukirchen or continue on to Bramberg.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Ganzjährig bewirtschaftete Einkehr mit regionaler Küche", en: "Year-round open stop with regional cuisine" },
        { de: "Sonnige Wegführung – auch im Frühjahr früh schneefrei", en: "Sunny route – snow-free early in spring" },
        { de: "Panoramablick auf die Hohen Tauern", en: "Panoramic view of the Hohe Tauern" },
        { de: "Familien- und kinderwagentauglich auf den ersten Abschnitten", en: "Family- and stroller-friendly on the first sections" },
      ],
    },
    {
      heading: { de: "Gut zu wissen", en: "Good to know" },
      body: {
        de: "Der Sonnenweg ist auch im Winter bei guter Schneelage begehbar. Reservierung im Gasthof Stockenbaum an Sonn- und Feiertagen empfohlen.",
        en: "The Sun Trail can also be hiked in winter with good snow conditions. Reservations at Gasthof Stockenbaum are recommended on Sundays and holidays.",
      },
    },
  ],
  externalUrl: "https://www.wildkogel-arena.at/wildkogel-arena-partner/sonnenweg/",
  sourceLabel: "wildkogel-arena.at",
};

export default article;
