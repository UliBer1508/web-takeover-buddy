import { Footprints } from "lucide-react";
import type { InfoArticle } from "../types";
// Real photos from Wikimedia Commons (CC BY-SA)
// "berndlalm-cover" / "berndlalm-view" by Whgler
// "obersulzbachtal-postalm" & "...-geiger" CC BY-SA 4.0
import berndlalmCover from "@/assets/hiking/berndlalm-cover.jpg";
import berndlalmView from "@/assets/hiking/berndlalm-view.jpg";
import obersulzbachtalPostalm from "@/assets/hiking/obersulzbachtal-postalm.jpg";
import obersulzbachtalGeiger from "@/assets/hiking/obersulzbachtal-geiger.jpg";

const article: InfoArticle = {
  id: "berndlalm",
  topic: "hiking",
  icon: Footprints,
  gradient: "from-wood to-accent",
  coverImage: berndlalmCover,
  gallery: [
    {
      url: berndlalmView,
      caption: { de: "Blick von der Berndlalm ins Obersulzbachtal", en: "View from Berndlalm into the Obersulzbach Valley" },
    },
    {
      url: obersulzbachtalPostalm,
      caption: { de: "Obersulzbachtal von der Postalm", en: "Obersulzbach Valley from Postalm" },
    },
    {
      url: obersulzbachtalGeiger,
      caption: { de: "Obersulzbachtal mit Großem Geiger", en: "Obersulzbach Valley with Großer Geiger" },
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
