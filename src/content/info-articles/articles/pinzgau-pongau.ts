import { MapPin } from "lucide-react";
import type { InfoArticle } from "../types";

const article: InfoArticle = {
  id: "pinzgau-pongau",
  topic: "cycling",
  icon: MapPin,
  gradient: "from-primary to-accent",
  title: { de: "Radregion Pinzgau & Pongau", en: "Pinzgau & Pongau Cycling Region" },
  subtitle: {
    de: "Genussradeln, Mountainbike und E-Bike rund ums Chalet",
    en: "Leisure cycling, mountain biking and e-biking around the chalet",
  },
  shortDescription: {
    de: "Ein dichtes Netz aus Tal-, Berg- und Themenradwegen – vom gemütlichen Familienausflug bis zur sportlichen Bergetappe.",
    en: "A dense network of valley, mountain and themed cycle routes – from family outings to sporty mountain stages.",
  },
  stats: [
    { label: { de: "Routen", en: "Routes" }, value: { de: "über 30", en: "30+" } },
    { label: { de: "E-Bike-Stationen", en: "E-bike stations" }, value: { de: "zahlreich", en: "numerous" } },
    { label: { de: "Schwierigkeit", en: "Difficulty" }, value: { de: "leicht – schwer", en: "Easy to hard" } },
  ],
  sections: [
    {
      heading: { de: "Was die Region bietet", en: "What the region offers" },
      bullets: [
        { de: "Tauernradweg direkt vor der Haustür", en: "Tauern Cycle Path right at the doorstep" },
        { de: "Rundtouren durch Bergdörfer und Almen", en: "Loops through mountain villages and alpine pastures" },
        { de: "Ausgewiesene MTB-Strecken aller Schwierigkeitsgrade", en: "Marked MTB trails of all difficulty levels" },
        { de: "E-Bike-Verleih und Lade-Infrastruktur", en: "E-bike rentals and charging infrastructure" },
      ],
    },
    {
      heading: { de: "Tipps vor Ort", en: "Local tips" },
      body: {
        de: "Vor Ihrer Tour beraten wir Sie gerne persönlich – passend zu Wetter, Kondition und Wunschdistanz. Aktuelle Streckeninfos finden Sie bei den Tourismusverbänden im Pinzgau und Pongau.",
        en: "We are happy to advise you in person before your tour – matched to weather, fitness level and desired distance. Up-to-date route info is available from the Pinzgau and Pongau tourism boards.",
      },
    },
    {
      heading: { de: "Hinweis", en: "Please note" },
      body: {
        de: "Streckenführung, Sperren und Öffnungszeiten können sich ändern. Bitte informieren Sie sich vor jeder Tour über den aktuellen Zustand der Wege.",
        en: "Routes, closures and opening times may change. Please check the current trail status before each tour.",
      },
    },
  ],
  externalUrl: "https://www.salzburgerland.com/de/radfahren/",
  sourceLabel: "salzburgerland.com",
};

export default article;
