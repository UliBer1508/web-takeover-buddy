import { Train } from "lucide-react";
import type { InfoArticle } from "../types";

const UNSPLASH = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const article: InfoArticle = {
  id: "pinzgauer-lokalbahn-rad",
  topic: "cycling",
  icon: Train,
  gradient: "from-mountain-blue to-accent",
  coverImage: UNSPLASH("photo-1517649763962-0c623066013b", 1600),
  gallery: [
    { url: UNSPLASH("photo-1571333250630-f0230c320b6d"), caption: { de: "Genussradeln entlang der Salzach", en: "Leisure cycling along the Salzach" } },
    { url: UNSPLASH("photo-1502784444187-359ac186c5bb"), caption: { de: "Pinzgauer Bergdörfer am Wegesrand", en: "Pinzgau mountain villages along the way" } },
    { url: UNSPLASH("photo-1418065460487-3e41a6c84dc5"), caption: { de: "Sonnige Almwiesen im Salzachtal", en: "Sunny alpine meadows in the Salzach Valley" } },
    { url: UNSPLASH("photo-1464822759023-fed622ff2c3b"), caption: { de: "Bergpanorama auf der Genussetappe", en: "Mountain panorama on the leisure stage" } },
  ],
  title: { de: "Pinzgauer Lokalbahn-Tour", en: "Pinzgau Local Train Cycling Tour" },
  subtitle: { de: "Mit der Schmalspurbahn hin – entspannt zurückradeln", en: "Take the narrow-gauge train one way – cycle back at your own pace" },
  shortDescription: {
    de: "Familienfreundliche Genuss-Radtour: Mit der Pinzgauer Lokalbahn samt Fahrradmitnahme nach Zell am See, entspannt zurück entlang der Salzach.",
    en: "Family-friendly leisure cycling: take the Pinzgau Local Train (with bike transport) to Zell am See and roll back along the Salzach.",
  },
  stats: [
    { label: { de: "Länge", en: "Length" }, value: { de: "ca. 40 km", en: "approx. 40 km" } },
    { label: { de: "Höhenmeter", en: "Elevation" }, value: { de: "ca. 100 hm", en: "approx. 100 m" } },
    { label: { de: "Dauer", en: "Duration" }, value: { de: "ca. 3–4 h", en: "approx. 3–4 h" } },
    { label: { de: "Schwierigkeit", en: "Difficulty" }, value: { de: "leicht", en: "Easy" } },
  ],
  sections: [
    {
      heading: { de: "Streckenverlauf", en: "Route" },
      body: {
        de: "Vom Bahnhof Neukirchen oder Krimml mit der historischen Schmalspurbahn (Fahrradmitnahme nach Voranmeldung) bis Zell am See. Von dort geht es entspannt entlang des fast ebenen Tauernradwegs am Ufer der Salzach zurück Richtung Mittersill und Neukirchen.",
        en: "From Neukirchen or Krimml station, take the historic narrow-gauge train (bike transport with prior reservation) to Zell am See. From there, ride back along the almost flat Tauern Cycle Path on the banks of the Salzach towards Mittersill and Neukirchen.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Nostalgische Zugfahrt durch das Salzachtal", en: "Nostalgic train ride through the Salzach Valley" },
        { de: "Fast ebene Strecke – auch für Kinder und E-Biker ideal", en: "Almost flat – perfect for children and e-bikers" },
        { de: "Jederzeit Aus- und Einstieg an Zwischenstationen möglich", en: "Hop on and off at any of the intermediate stations" },
        { de: "Zahlreiche Einkehrmöglichkeiten in den Pinzgauer Orten", en: "Plenty of stops for refreshments in the Pinzgau villages" },
      ],
    },
    {
      heading: { de: "Gut zu wissen", en: "Good to know" },
      body: {
        de: "Fahrradmitnahme von Mai bis September gegen Voranmeldung (bis Vortag 14:00 Uhr) beim SVV-Kundencenter Mittersill. Stundentakt zwischen Zell am See und Krimml.",
        en: "Bike transport from May to September with prior reservation (by 2 pm the day before) at the SVV customer centre in Mittersill. Hourly service between Zell am See and Krimml.",
      },
    },
  ],
  externalUrl: "https://www.pinzgauerlokalbahn.at/content/website_pinzgauerlokalbahn/de_at/freizeittipps.html",
  sourceLabel: "pinzgauerlokalbahn.at",
};

export default article;
