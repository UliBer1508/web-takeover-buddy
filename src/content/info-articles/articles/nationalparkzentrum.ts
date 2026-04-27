import { Landmark } from "lucide-react";
import type { InfoArticle } from "../types";
// Real photo from Wikimedia Commons (CC BY-SA)
import cover from "@/assets/culture/nationalparkzentrum.jpg";

const article: InfoArticle = {
  id: "nationalparkzentrum",
  topic: "culture",
  icon: Landmark,
  gradient: "from-accent to-primary",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Nationalparkwelten Hohe Tauern in Mittersill", en: "Nationalparkwelten Hohe Tauern in Mittersill" } },
  ],
  title: { de: "Nationalparkwelten Hohe Tauern", en: "Nationalparkwelten Hohe Tauern" },
  subtitle: { de: "Erlebnisausstellung in Mittersill", en: "Interactive exhibition in Mittersill" },
  shortDescription: {
    de: "Auf 2.500 m² wird der größte Nationalpark der Alpen erlebbar – mit Adlerflug-Simulator, 360°-Kino und begehbarer Gletscherwelt.",
    en: "On 2,500 m² the largest national park of the Alps comes alive – with an eagle-flight simulator, a 360° cinema and a walk-in glacier world.",
  },
  stats: [
    { label: { de: "Ausstellung", en: "Exhibition" }, value: { de: "2.500 m²", en: "2,500 m²" } },
    { label: { de: "Entfernung", en: "Distance" }, value: { de: "ca. 25 km", en: "approx. 25 km" } },
    { label: { de: "Dauer", en: "Visit time" }, value: { de: "ca. 2–3 h", en: "approx. 2–3 h" } },
    { label: { de: "Familien", en: "Families" }, value: { de: "ideal", en: "ideal" } },
  ],
  sections: [
    {
      heading: { de: "Das Erlebnis", en: "The experience" },
      body: {
        de: "Adlerflug-Simulator über die Hohen Tauern, 360°-Panoramakino, begehbarer Gletscher mit Eishöhle und tiergerecht inszenierte Lebensräume vom Tal bis ins Hochgebirge.",
        en: "Eagle-flight simulator across the Hohe Tauern, a 360° panoramic cinema, a walk-in glacier with ice cave and lifelike habitats from the valley to the high mountains.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Adlerflug-Simulator", en: "Eagle-flight simulator" },
        { de: "360°-Panoramakino", en: "360° panoramic cinema" },
        { de: "Begehbare Gletscherwelt", en: "Walk-in glacier world" },
        { de: "Bei jedem Wetter geöffnet", en: "Open in any weather" },
      ],
    },
  ],
  externalUrl: "https://hohetauern.at/de/np/nationalparkzentrum.html",
  sourceLabel: "hohetauern.at",
};

export default article;
