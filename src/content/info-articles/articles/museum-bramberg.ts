import { Gem } from "lucide-react";
import type { InfoArticle } from "../types";
// Real photos from museumbramberg.at (used promotionally)
import cover from "@/assets/culture/bramberg-haus.jpg";
import kristall from "@/assets/culture/bramberg-kristall.jpg";

const article: InfoArticle = {
  id: "museum-bramberg",
  topic: "culture",
  icon: Gem,
  gradient: "from-primary to-accent",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Wilhelmgut – Sitz des Museum Bramberg", en: "Wilhelmgut – home of Museum Bramberg" } },
    { url: kristall, caption: { de: "Smaragde & Kristalle aus dem Habachtal", en: "Emeralds & crystals from the Habach valley" } },
  ],
  title: { de: "Museum Bramberg – Smaragde & Kristalle", en: "Museum Bramberg – Emeralds & Crystals" },
  subtitle: { de: "Eine der bedeutendsten Mineraliensammlungen Europas", en: "One of Europe's most important mineral collections" },
  shortDescription: {
    de: "Im historischen Wilhelmgut erleben Sie Smaragde aus dem Habachtal, riesige Bergkristalle und Tauernschätze – nur wenige Minuten entfernt.",
    en: "In the historic Wilhelmgut you'll discover emeralds from the Habach valley, giant rock crystals and Tauern treasures – just minutes away.",
  },
  stats: [
    { label: { de: "Themen", en: "Themes" }, value: { de: "Smaragde · Kristalle · Kultur", en: "Emeralds · Crystals · Culture" } },
    { label: { de: "Entfernung", en: "Distance" }, value: { de: "ca. 7 km", en: "approx. 7 km" } },
    { label: { de: "Dauer", en: "Visit time" }, value: { de: "ca. 1,5 h", en: "approx. 1.5 h" } },
    { label: { de: "Schwierigkeit", en: "Difficulty" }, value: { de: "leicht", en: "Easy" } },
  ],
  sections: [
    {
      heading: { de: "Die Sammlung", en: "The collection" },
      body: {
        de: "Das Museum Bramberg im 1581 erbauten Wilhelmgut zeigt die größte Smaragdsammlung Europas aus dem benachbarten Habachtal sowie spektakuläre Bergkristalle aus den Hohen Tauern.",
        en: "Museum Bramberg in the Wilhelmgut (built 1581) houses Europe's largest collection of emeralds from the neighbouring Habach valley plus spectacular rock crystals from the Hohe Tauern.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Größte Smaragdsammlung Europas", en: "Europe's largest emerald collection" },
        { de: "Tauernschätze – Mineralien der Hohen Tauern", en: "Tauern treasures – minerals of the Hohe Tauern" },
        { de: "Ausstellung Mensch & Kultur im Pinzgau", en: "Exhibition on People & Culture in Pinzgau" },
        { de: "Historisches Bauernhaus aus dem 16. Jahrhundert", en: "Historic 16th-century farmhouse" },
      ],
    },
  ],
  externalUrl: "https://www.museumbramberg.at/",
  sourceLabel: "museumbramberg.at",
};

export default article;
