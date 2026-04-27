import { Snowflake } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/skiing/flachau.jpg";

const article: InfoArticle = {
  id: "snow-space-flachau",
  topic: "skiing",
  icon: Snowflake,
  gradient: "from-primary to-accent",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Flachau mit Ortsteil Reitdorf im Vordergrund", en: "Flachau with Reitdorf district in the foreground" } },
  ],
  title: { de: "Snow Space Salzburg – Flachau · Wagrain · St. Johann", en: "Snow Space Salzburg – Flachau · Wagrain · St. Johann" },
  subtitle: { de: "Drei Skigebiete in einem – Ski amadé", en: "Three ski areas in one – Ski amadé" },
  shortDescription: {
    de: "Verbund Snow Space Salzburg mit 120 km Pisten und Anschluss an die Sportwelt amadé (über 350 km). Heimat des FIS-Weltcup-Slaloms in Flachau.",
    en: "Snow Space Salzburg combine zone with 120 km of slopes, linked into Sportwelt amadé (over 350 km). Home of the FIS World Cup slalom in Flachau.",
  },
  stats: [
    { label: { de: "Pisten", en: "Slopes" }, value: { de: "120 km", en: "120 km" } },
    { label: { de: "Liftanlagen", en: "Lifts" }, value: { de: "45", en: "45" } },
    { label: { de: "Höhe", en: "Altitude" }, value: { de: "800–2.014 m", en: "800–2,014 m" } },
    { label: { de: "Entfernung", en: "Distance" }, value: { de: "ca. 110 km", en: "approx. 110 km" } },
  ],
  sections: [
    {
      heading: { de: "Das Skigebiet", en: "The ski area" },
      body: {
        de: "Flachau, Wagrain und St. Johann/Alpendorf sind via Bergbahnen lückenlos verbunden – ein riesiges Skigebiet im Herzen von Ski amadé mit über 760 km Gesamtnetz.",
        en: "Flachau, Wagrain and St. Johann/Alpendorf are seamlessly linked by lifts – a huge area at the heart of Ski amadé's 760 km network.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "FIS Ski Weltcup Nightrace in Flachau", en: "FIS Ski World Cup Nightrace in Flachau" },
        { de: "Snow Space Flying Fox & längste Funslope der Alpen", en: "Snow Space Flying Fox & the Alps' longest funslope" },
        { de: "Teil von Ski amadé – Österreichs größtem Skiverbund", en: "Part of Ski amadé – Austria's largest ski alliance" },
      ],
    },
  ],
  externalUrl: "https://www.snow-space.com/",
  sourceLabel: "snow-space.com / Wikimedia Commons",
};

export default article;
