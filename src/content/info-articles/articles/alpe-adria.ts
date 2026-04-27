import { Mountain } from "lucide-react";
import type { InfoArticle } from "../types";

// Image source: Unsplash (free to use under the Unsplash License)
const UNSPLASH = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const article: InfoArticle = {
  id: "alpe-adria",
  topic: "cycling",
  icon: Mountain,
  gradient: "from-accent to-wood",
  coverImage: UNSPLASH("photo-1698077326553-32c42f839a85", 1600),
  gallery: [
    {
      url: UNSPLASH("photo-1699962765931-0f58ed74ee21"),
      caption: { de: "Kurvenreiche Alpenstraße Richtung Süden", en: "Winding alpine road heading south" },
    },
    {
      url: UNSPLASH("photo-1768161680835-c8e0cca76c22"),
      caption: { de: "Stiller Bergsee unterwegs", en: "Quiet mountain lake along the way" },
    },
    {
      url: UNSPLASH("photo-1668936132313-2c3105eef631"),
      caption: { de: "Etappe mit dem Rad über die Berge", en: "A stage by bike across the mountains" },
    },
    {
      url: UNSPLASH("photo-1756326276980-a4ee41a9f519"),
      caption: { de: "Startpunkt Salzburg", en: "Starting point Salzburg" },
    },
  ],
  title: { de: "Alpe-Adria-Radweg", en: "Alpe Adria Cycle Path" },
  subtitle: {
    de: "Von Salzburg über die Alpen bis ans Mittelmeer",
    en: "From Salzburg across the Alps to the Mediterranean",
  },
  shortDescription: {
    de: "Eine der spektakulärsten Alpenüberquerungen mit dem Rad – von der Mozartstadt bis nach Grado an die Adria.",
    en: "One of the most spectacular alpine crossings by bike – from Salzburg to Grado on the Adriatic Sea.",
  },
  stats: [
    { label: { de: "Länge", en: "Length" }, value: { de: "ca. 415 km", en: "approx. 415 km" } },
    { label: { de: "Etappen", en: "Stages" }, value: { de: "8–10", en: "8–10" } },
    { label: { de: "Schwierigkeit", en: "Difficulty" }, value: { de: "mittel", en: "Moderate" } },
  ],
  sections: [
    {
      heading: { de: "Streckenverlauf", en: "Route" },
      body: {
        de: "Von Salzburg führt der Weg durch das Salzachtal, über den Tauern (mit Bahn-Shuttle möglich) ins Gasteinertal, weiter durch Kärnten, Slowenien und Italien bis ans Meer.",
        en: "From Salzburg the path runs through the Salzach Valley, over the Tauern (with optional rail shuttle), into Gastein, then on through Carinthia, Slovenia and Italy to the sea.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Drei-Länder-Tour: Österreich, Slowenien, Italien", en: "Three-country tour: Austria, Slovenia, Italy" },
        { de: "Tauernschleuse-Bahn als entspannte Alpenüberquerung", en: "Tauern car-train as a relaxed alpine crossing" },
        { de: "Historische Städte wie Villach, Udine, Aquileia", en: "Historic towns like Villach, Udine, Aquileia" },
        { de: "Lagunenstadt Grado am Mittelmeer", en: "Lagoon city of Grado on the Mediterranean" },
      ],
    },
    {
      heading: { de: "Gut zu wissen", en: "Good to know" },
      body: {
        de: "Gut beschildert, viele Etappen entlang von Flüssen und stillgelegten Bahntrassen. Ideal für eine Wochentour mit Gepäcktransport.",
        en: "Well signposted, many stages run along rivers and former railway lines. Ideal for a week-long tour with luggage transfer.",
      },
    },
  ],
  externalUrl: "https://www.alpe-adria-radweg.com",
  sourceLabel: "alpe-adria-radweg.com",
};

export default article;
