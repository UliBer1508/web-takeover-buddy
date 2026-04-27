import { Mountain } from "lucide-react";
import type { InfoArticle } from "../types";

// Image source: Unsplash (free to use under the Unsplash License)
const UNSPLASH = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const article: InfoArticle = {
  id: "wildkogelalm",
  topic: "hiking",
  icon: Mountain,
  gradient: "from-mountain-blue to-primary",
  coverImage: UNSPLASH("photo-1519681393784-d120267933ba", 1600),
  gallery: [
    {
      url: UNSPLASH("photo-1469474968028-56623f02e42e"),
      caption: { de: "360°-Panorama von der Sonnenterrasse", en: "360° panorama from the sun terrace" },
    },
    {
      url: UNSPLASH("photo-1470770841072-f978cf4d019e"),
      caption: { de: "Bergsee unterhalb des Wildkogels", en: "Mountain lake below the Wildkogel" },
    },
    {
      url: UNSPLASH("photo-1418065460487-3e41a6c84dc5"),
      caption: { de: "Almenrausch entlang des Höhenwegs", en: "Alpenrose along the high trail" },
    },
    {
      url: UNSPLASH("photo-1464822759023-fed622ff2c3b"),
      caption: { de: "Blick zu den Hohen Tauern", en: "View towards the Hohe Tauern" },
    },
  ],
  title: { de: "Wildkogelalm vom Gipfel", en: "Wildkogelalm from the Summit" },
  subtitle: {
    de: "Bequem mit der Bergbahn – komfortable Einkehr auf 2.089 m",
    en: "Easy access by cable car – comfortable stop at 2,089 m",
  },
  shortDescription: {
    de: "Auffahrt mit der Smaragdbahn, gemütlicher Höhenweg zur Wildkogelalm mit Sonnenterrasse und 360°-Panorama.",
    en: "Take the Smaragdbahn cable car up and enjoy an easy high trail to the Wildkogelalm with its sun terrace and 360° panorama.",
  },
  stats: [
    { label: { de: "Länge", en: "Length" }, value: { de: "ca. 4 km", en: "approx. 4 km" } },
    { label: { de: "Höhenmeter", en: "Elevation" }, value: { de: "ca. 100 hm", en: "approx. 100 m" } },
    { label: { de: "Dauer", en: "Duration" }, value: { de: "ca. 2 h", en: "approx. 2 h" } },
    { label: { de: "Schwierigkeit", en: "Difficulty" }, value: { de: "leicht", en: "Easy" } },
  ],
  sections: [
    {
      heading: { de: "Streckenverlauf", en: "Route" },
      body: {
        de: "Mit der Smaragdbahn von Bramberg auf 2.094 m. Vom Bergrestaurant führt ein gemütlicher, breiter Höhenweg in rund 30 Minuten zur Wildkogelalm. Rückweg per Bahn oder zu Fuß über den Wildkogel-Panoramaweg.",
        en: "Take the Smaragdbahn from Bramberg up to 2,094 m. From the mountain restaurant, an easy, wide high path leads to the Wildkogelalm in around 30 minutes. Return by cable car or on foot via the Wildkogel Panorama Trail.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Spektakuläres 360°-Panorama vom Großvenediger bis zum Kitzsteinhorn", en: "Stunning 360° panorama from the Großvenediger to the Kitzsteinhorn" },
        { de: "Große Sonnenterrasse mit Liegestühlen", en: "Large sun terrace with deck chairs" },
        { de: "Auch für ältere Gäste oder mit Kindern bestens geeignet", en: "Perfect for older guests or with children" },
        { de: "Hausgemachte Speisen – täglich frisch", en: "Homemade dishes – freshly prepared daily" },
      ],
    },
    {
      heading: { de: "Gut zu wissen", en: "Good to know" },
      body: {
        de: "Mit der Nationalpark-Sommercard ist die Bergbahn-Auffahrt inklusive. Bahnbetrieb meist Anfang Juni bis Mitte Oktober.",
        en: "The cable car ride is included with the Nationalpark Summer Card. Operation usually from early June to mid-October.",
      },
    },
  ],
  externalUrl: "https://www.sentres.com/de/hut/die-wildkogel-alm-am-wildkogel-2.089-m/6044848/",
  sourceLabel: "wildkogel-arena.at",
};

export default article;
