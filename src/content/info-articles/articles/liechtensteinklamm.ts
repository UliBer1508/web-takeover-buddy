import { Waves } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/water/liechtensteinklamm.jpg";

const article: InfoArticle = {
  id: "liechtensteinklamm",
  topic: "water",
  icon: Waves,
  gradient: "from-primary to-mountain-blue",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Holzbrücke in der Liechtensteinklamm", en: "Wooden bridge in Liechtenstein Gorge" } },
  ],
  title: { de: "Liechtensteinklamm St. Johann", en: "Liechtenstein Gorge St. Johann" },
  subtitle: { de: "Eine der eindrucksvollsten Schluchten der Ostalpen", en: "One of the most impressive gorges in the Eastern Alps" },
  shortDescription: {
    de: "Bis zu 300 m tiefe Klamm mit moderner Helix-Aussichtsplattform und 50 m hohem Wasserfall am Ende des Steges.",
    en: "Gorge up to 300 m deep with a modern helix viewing platform and a 50 m waterfall at the end of the walkway.",
  },
  stats: [
    { label: { de: "Tiefe", en: "Depth" }, value: { de: "bis 300 m", en: "up to 300 m" } },
    { label: { de: "Dauer", en: "Duration" }, value: { de: "ca. 1,5 h", en: "approx. 1.5 h" } },
    { label: { de: "Saison", en: "Season" }, value: { de: "Mai–Okt.", en: "May–Oct." } },
    { label: { de: "Entfernung", en: "Distance" }, value: { de: "ca. 75 km", en: "approx. 75 km" } },
  ],
  sections: [
    {
      heading: { de: "Das Erlebnis", en: "The experience" },
      body: {
        de: "Ein gesicherter Steig führt entlang der tosenden Großarler Ache tief in die Klamm hinein. Am Ende erwartet Besucher die spektakuläre Helix – eine Wendeltreppe mit Blick auf den Schleierfall.",
        en: "A secured trail follows the roaring Großarler Ache deep into the gorge. At the far end, visitors reach the spectacular Helix – a spiral staircase facing the Schleierfall waterfall.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Helix-Aussichtsplattform", en: "Helix viewing platform" },
        { de: "Schleierfall am Ende der Klamm", en: "Schleierfall at the end of the gorge" },
        { de: "Erlebnispark vor dem Eingang", en: "Adventure park at the entrance" },
        { de: "Auch bei Hitze angenehm kühl", en: "Pleasantly cool even in heat" },
      ],
    },
  ],
  externalUrl: "https://www.liechtensteinklamm.at",
  sourceLabel: "liechtensteinklamm.at",
};

export default article;
