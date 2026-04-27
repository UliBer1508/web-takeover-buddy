import { Footprints } from "lucide-react";
import type { InfoArticle } from "../types";
import berndlalmCover from "@/assets/hiking/berndlalm-cover.jpg";

// Image source: Unsplash (free to use under the Unsplash License)
const UNSPLASH = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const article: InfoArticle = {
  id: "berndlalm",
  topic: "hiking",
  icon: Footprints,
  gradient: "from-wood to-accent",
  coverImage: berndlalmCover,
  gallery: [
    {
      url: UNSPLASH("photo-1502784444187-359ac186c5bb"),
      caption: { de: "Sonnige Almwiesen mit Bergpanorama", en: "Sunny alpine meadows with mountain panorama" },
    },
    {
      url: UNSPLASH("photo-1486870591958-9b9d0d1dda99"),
      caption: { de: "Heller Wanderpfad durch das Tal", en: "Bright hiking trail through the valley" },
    },
    {
      url: UNSPLASH("photo-1506905925346-21bda4d32df4"),
      caption: { de: "Klarer Bergbach am Wegesrand", en: "Clear mountain stream along the path" },
    },
    {
      url: UNSPLASH("photo-1464822759023-fed622ff2c3b"),
      caption: { de: "Blick zum Großvenediger", en: "View towards the Großvenediger" },
    },
  ],
  title: { de: "Wanderung zur Berndlalm", en: "Hike to Berndlalm" },
  subtitle: {
    de: "Familientour durch das wilde Obersulzbachtal",
    en: "Family hike through the wild Obersulzbach Valley",
  },
  shortDescription: {
    de: "Gemütlicher Almweg mit Blick auf den Großvenediger – urige Einkehr und kleine Kapelle inklusive.",
    en: "Easy alpine path with views of the Großvenediger – includes a rustic stop and a small chapel.",
  },
  stats: [
    { label: { de: "Länge", en: "Length" }, value: { de: "ca. 6 km", en: "approx. 6 km" } },
    { label: { de: "Höhenmeter", en: "Elevation" }, value: { de: "ca. 350 hm", en: "approx. 350 m" } },
    { label: { de: "Dauer", en: "Duration" }, value: { de: "ca. 2 h hin", en: "approx. 2 h up" } },
    { label: { de: "Schwierigkeit", en: "Difficulty" }, value: { de: "leicht", en: "Easy" } },
  ],
  sections: [
    {
      heading: { de: "Streckenverlauf", en: "Route" },
      body: {
        de: "Start ist der Parkplatz Hopffeldboden im Obersulzbachtal. Auf einem breiten, gut markierten Almweg geht es entlang des Sulzbachs sanft bergauf bis zur Berndlalm (ca. 1.520 m).",
        en: "The hike starts at the Hopffeldboden car park in the Obersulzbach Valley. A wide, well-marked alpine path follows the Sulzbach gently uphill to the Berndlalm (around 1,520 m).",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Tosende Sulzbach-Wasserfälle direkt am Weg", en: "Roaring Sulzbach waterfalls right next to the trail" },
        { de: "Berndlalm-Kapelle als idyllischer Rastplatz", en: "Berndlalm chapel as a peaceful resting spot" },
        { de: "Großvenediger-Panorama auf der Alm", en: "Großvenediger panorama from the alm" },
        { de: "Bewirtschaftete Hütte mit hausgemachten Spezialitäten", en: "Managed hut serving homemade specialties" },
      ],
    },
    {
      heading: { de: "Gut zu wissen", en: "Good to know" },
      body: {
        de: "Kinderwagentauglich ist nur der untere Abschnitt – festes Schuhwerk wird empfohlen. Die Alm ist im Sommer bewirtschaftet; vorher Öffnungszeiten prüfen.",
        en: "Only the lower section is suitable for strollers – sturdy footwear is recommended. The hut is open in summer; check opening hours in advance.",
      },
    },
  ],
  externalUrl: "https://www.bergfex.at/sommer/salzburg/touren/wanderung/3969452,neukirchen-am-grossvenediger--berndlalm--berndlalm--kapelle--kuersingerhuette",
  sourceLabel: "bergfex.at",
};

export default article;
