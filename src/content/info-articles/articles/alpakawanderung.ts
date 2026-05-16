import { Users } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/family/alpaka.jpg";

const article: InfoArticle = {
  id: "alpakawanderung",
  topic: "family",
  icon: Users,
  gradient: "from-accent to-primary",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Alpakawanderung im Pinzgau", en: "Alpaca trek in Pinzgau" } },
  ],
  title: { de: "Alpakawanderung im Pinzgau", en: "Alpaca Trekking in Pinzgau" },
  subtitle: { de: "Entspannt mit Alpakas durch die Natur", en: "A relaxed walk through nature with alpacas" },
  shortDescription: {
    de: "Geführte Wanderungen mit zutraulichen Alpakas – ein außergewöhnliches Erlebnis für Familien und Tierfreunde.",
    en: "Guided walks with friendly alpacas – an unforgettable experience for families and animal lovers.",
  },
  stats: [
    { label: { de: "Dauer", en: "Duration" }, value: { de: "1–2 h", en: "1–2 h" } },
    { label: { de: "Saison", en: "Season" }, value: { de: "ganzjährig", en: "year-round" } },
    { label: { de: "Familien", en: "Families" }, value: { de: "ideal", en: "ideal" } },
    { label: { de: "Anmeldung", en: "Booking" }, value: { de: "erforderlich", en: "required" } },
  ],
  sections: [
    {
      heading: { de: "Das Erlebnis", en: "The experience" },
      body: {
        de: "Mehrere Anbieter in Bramberg, Mittersill und im Salzburger Land bieten geführte Touren an. Jede Person führt ein eigenes Alpaka am Halfter – ein ruhiges, achtsames Erlebnis.",
        en: "Several providers in Bramberg, Mittersill and Salzburg offer guided tours. Each guest leads their own alpaca on a halter – a calm, mindful experience.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Persönlicher Kontakt mit den Tieren", en: "Personal contact with the animals" },
        { de: "Für Kinder ab ca. 4 Jahren geeignet", en: "Suitable for children from about age 4" },
        { de: "Wunderschöne Foto-Motive", en: "Beautiful photo opportunities" },
        { de: "Auch bei Regen möglich", en: "Possible even in rain" },
      ],
    },
  ],
  externalUrl: "https://www.salzburgerland.com/de/alpaka-wandern-salzburg/",
  sourceLabel: "salzburgerland.com",
};

export default article;
