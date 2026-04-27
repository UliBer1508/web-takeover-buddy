import { Bike } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/bike-routes/tauernradweg-cover.jpg";
import g1 from "@/assets/bike-routes/tauernradweg-g1.jpg";
import g2 from "@/assets/bike-routes/tauernradweg-g2.jpg";
import g3 from "@/assets/bike-routes/tauernradweg-g3.jpg";

// Image source: Wikimedia Commons (CC BY-SA) - authentic Pinzgau / Salzach region photography

const article: InfoArticle = {
  id: "tauernradweg",
  topic: "cycling",
  icon: Bike,
  gradient: "from-mountain-blue to-primary",
  coverImage: cover,
  gallery: [
    { url: g1, caption: { de: "Salzach bei Neukirchen am Großvenediger", en: "The Salzach river near Neukirchen am Großvenediger" } },
    { url: g2, caption: { de: "Salzachtal bei Hollersbach im Pinzgau", en: "Salzach valley near Hollersbach in Pinzgau" } },
    { url: g3, caption: { de: "Sommerblick ins Salzachtal vom Plattenkogel", en: "Summer view into the Salzach valley from Plattenkogel" } },
  ],
  title: { de: "Tauernradweg", en: "Tauern Cycle Path" },
  subtitle: {
    de: "Von Krimml entlang der Salzach bis nach Passau",
    en: "From Krimml along the Salzach River to Passau",
  },
  shortDescription: {
    de: "Einer der beliebtesten Flussradwege Europas – überwiegend flach, familienfreundlich und mit traumhaften Alpenpanoramen.",
    en: "One of Europe's most popular river cycle paths – mostly flat, family-friendly, with stunning alpine views.",
  },
  stats: [
    { label: { de: "Länge", en: "Length" }, value: { de: "ca. 310 km", en: "approx. 310 km" } },
    { label: { de: "Etappen", en: "Stages" }, value: { de: "5–7", en: "5–7" } },
    { label: { de: "Schwierigkeit", en: "Difficulty" }, value: { de: "leicht", en: "Easy" } },
  ],
  sections: [
    {
      heading: { de: "Streckenverlauf", en: "Route" },
      body: {
        de: "Der Tauernradweg startet bei den Krimmler Wasserfällen, folgt der jungen Salzach durch den Pinzgau und Pongau, weiter über die Stadt Salzburg bis nach Passau an der Donau.",
        en: "The Tauern Cycle Path starts at the Krimml Waterfalls, follows the young Salzach through Pinzgau and Pongau, past the city of Salzburg, all the way to Passau on the Danube.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Krimmler Wasserfälle – höchste Wasserfälle Österreichs", en: "Krimml Waterfalls – Austria's highest waterfalls" },
        { de: "Nationalpark Hohe Tauern", en: "Hohe Tauern National Park" },
        { de: "Mittelalterliche Festung Hohenwerfen", en: "Medieval Hohenwerfen Fortress" },
        { de: "Mozartstadt Salzburg", en: "Mozart's city of Salzburg" },
      ],
    },
    {
      heading: { de: "Gut zu wissen", en: "Good to know" },
      body: {
        de: "Die Strecke ist überwiegend asphaltiert und auch für E-Bikes bestens geeignet. Gepäcktransport und Bahnanbindung machen die Tour besonders komfortabel.",
        en: "The route is mostly paved and ideal for e-bikes. Luggage transfer and rail connections make the tour especially convenient.",
      },
    },
  ],
  externalUrl: "https://www.tauernradweg.com",
  sourceLabel: "tauernradweg.com",
};

export default article;
