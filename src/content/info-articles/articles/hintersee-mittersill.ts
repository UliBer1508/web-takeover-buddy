import { Waves } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/water/hintersee.jpg";

const article: InfoArticle = {
  id: "hintersee-mittersill",
  topic: "water",
  icon: Waves,
  gradient: "from-primary to-mountain-blue",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Hintersee im Nationalpark Hohe Tauern", en: "Hintersee in Hohe Tauern National Park" } },
  ],
  title: { de: "Hintersee – Mittersill", en: "Hintersee – Mittersill" },
  subtitle: { de: "Stiller Bergsee im Felbertal", en: "Quiet mountain lake in Felber Valley" },
  shortDescription: {
    de: "Idyllischer, kristallklarer See im Nationalpark Hohe Tauern – ein flacher Rundweg eignet sich perfekt für alle Generationen.",
    en: "Idyllic, crystal-clear lake in Hohe Tauern National Park – a flat loop trail is perfect for every generation.",
  },
  stats: [
    { label: { de: "Rundweg", en: "Loop trail" }, value: { de: "ca. 1,5 km", en: "approx. 1.5 km" } },
    { label: { de: "Dauer", en: "Duration" }, value: { de: "ca. 45 min", en: "approx. 45 min" } },
    { label: { de: "Höhe", en: "Altitude" }, value: { de: "1.313 m", en: "1,313 m" } },
    { label: { de: "Entfernung", en: "Distance" }, value: { de: "ca. 20 km", en: "approx. 20 km" } },
  ],
  sections: [
    {
      heading: { de: "Das Erlebnis", en: "The experience" },
      body: {
        de: "Vom Parkplatz im Felbertal führt ein leichter, schattiger Rundweg um den Hintersee – ruhig, idyllisch und ideal für eine entspannte Pause in der Natur des Nationalparks.",
        en: "From the Felber Valley car park, an easy shaded loop circles Hintersee – peaceful, idyllic and perfect for a relaxing break in the national park's nature.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Glasklarer Bergsee mit Spiegelungen", en: "Crystal-clear lake with mirror reflections" },
        { de: "Kinderwagentauglicher Rundweg", en: "Pram-friendly loop" },
        { de: "Schattige Picknickplätze", en: "Shaded picnic spots" },
        { de: "Ausgangspunkt für Wanderungen ins Felbertal", en: "Starting point for hikes into Felber Valley" },
      ],
    },
  ],
  externalUrl: "https://www.nationalpark.at/de/wandern/hintersee-rundwanderung",
  sourceLabel: "nationalpark.at",
};

export default article;
