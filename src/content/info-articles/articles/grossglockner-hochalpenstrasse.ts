import { Mountain } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/panorama/grossglockner.jpg";

const article: InfoArticle = {
  id: "grossglockner-hochalpenstrasse",
  topic: "panorama",
  icon: Mountain,
  gradient: "from-primary to-accent",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Serpentinen der Hochalpenstraße", en: "Switchbacks of the High Alpine Road" } },
  ],
  title: { de: "Großglockner Hochalpenstraße", en: "Großglockner High Alpine Road" },
  subtitle: { de: "Eine der schönsten Panoramastraßen der Alpen", en: "One of the most scenic alpine roads in the world" },
  shortDescription: {
    de: "48 km Traumstrecke mit 36 Kehren bis auf 2.504 m – Blick auf den höchsten Berg Österreichs und die Pasterze.",
    en: "48 km dream route with 36 hairpin bends up to 2,504 m – views of Austria's highest peak and the Pasterze glacier.",
  },
  stats: [
    { label: { de: "Höhe", en: "Altitude" }, value: { de: "2.504 m", en: "2,504 m" } },
    { label: { de: "Länge", en: "Length" }, value: { de: "48 km", en: "48 km" } },
    { label: { de: "Saison", en: "Season" }, value: { de: "Mai–Okt.", en: "May–Oct." } },
    { label: { de: "Entfernung", en: "Distance" }, value: { de: "ca. 90 km", en: "approx. 90 km" } },
  ],
  sections: [
    {
      heading: { de: "Das Erlebnis", en: "The experience" },
      body: {
        de: "Die Hochalpenstraße führt über die Edelweißspitze (2.571 m) zur Kaiser-Franz-Josefs-Höhe mit direktem Blick auf Großglockner und Pasterze-Gletscher. Mautstrecke mit zahlreichen Aussichtspunkten, Museen und Wanderwegen.",
        en: "The road climbs over Edelweißspitze (2,571 m) up to Kaiser-Franz-Josefs-Höhe with a direct view of the Großglockner and the Pasterze glacier. Toll road with many viewpoints, museums and trails.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Edelweißspitze – höchster Punkt", en: "Edelweißspitze – highest point" },
        { de: "Kaiser-Franz-Josefs-Höhe mit Gletscherblick", en: "Kaiser-Franz-Josefs-Höhe glacier viewpoint" },
        { de: "Murmeltiere am Wegesrand", en: "Marmots along the road" },
        { de: "Ausstellungen & Themenwege", en: "Exhibitions and theme trails" },
      ],
    },
  ],
  externalUrl: "https://www.grossglockner.at",
  sourceLabel: "grossglockner.at",
};

export default article;
