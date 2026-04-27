import { Bike } from "lucide-react";
import type { InfoArticle } from "../types";

const UNSPLASH = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const article: InfoArticle = {
  id: "salzachtal-krimml-mittersill",
  topic: "cycling",
  icon: Bike,
  gradient: "from-accent to-primary",
  coverImage: UNSPLASH("photo-1571333250630-f0230c320b6d", 1600),
  gallery: [
    { url: UNSPLASH("photo-1544191696-15693072e0b5"), caption: { de: "Flacher Radweg entlang der Salzach", en: "Flat cycle path along the Salzach" } },
    { url: UNSPLASH("photo-1502784444187-359ac186c5bb"), caption: { de: "Bergdörfer im sonnigen Salzachtal", en: "Mountain villages in the sunny Salzach Valley" } },
    { url: UNSPLASH("photo-1418065460487-3e41a6c84dc5"), caption: { de: "Wiesen und Felder am Wegesrand", en: "Meadows and fields along the route" } },
    { url: UNSPLASH("photo-1470770841072-f978cf4d019e"), caption: { de: "Stille Bachläufe im Pinzgau", en: "Quiet streams in the Pinzgau" } },
  ],
  title: { de: "Salzachtal: Krimml → Mittersill", en: "Salzach Valley: Krimml → Mittersill" },
  subtitle: { de: "Klassische Genussetappe entlang der Salzach", en: "Classic leisure stage along the Salzach river" },
  shortDescription: {
    de: "Fast flache Genuss-Radstrecke entlang der Salzach – perfekt für E-Bike und gemütliche Halbtagestouren mit der ganzen Familie.",
    en: "Almost flat leisure ride along the Salzach – perfect for e-bikes and easy half-day tours with the whole family.",
  },
  stats: [
    { label: { de: "Länge", en: "Length" }, value: { de: "ca. 25 km", en: "approx. 25 km" } },
    { label: { de: "Höhenmeter", en: "Elevation" }, value: { de: "ca. 50 hm", en: "approx. 50 m" } },
    { label: { de: "Dauer", en: "Duration" }, value: { de: "ca. 2 h", en: "approx. 2 h" } },
    { label: { de: "Schwierigkeit", en: "Difficulty" }, value: { de: "leicht", en: "Easy" } },
  ],
  sections: [
    {
      heading: { de: "Streckenverlauf", en: "Route" },
      body: {
        de: "Start in Krimml am Fuße der berühmten Wasserfälle. Auf dem ausgeschilderten Tauernradweg geht es entlang der Salzach über Wald, Neukirchen, Bramberg und Hollersbach bis nach Mittersill. Asphaltiert und überwiegend autofrei.",
        en: "Start in Krimml at the foot of the famous waterfalls. Follow the well-signposted Tauern Cycle Path along the Salzach through Wald, Neukirchen, Bramberg and Hollersbach to Mittersill. Paved and mostly car-free.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Direkt am Chalet vorbeiführend – ideal als Halbtagestour", en: "Passes right by the chalet – ideal as a half-day tour" },
        { de: "Zahlreiche Bademöglichkeiten an Bach und Badeteichen", en: "Plenty of swimming spots along streams and bathing ponds" },
        { de: "Cafés und Eisdielen in jedem Pinzgauer Ort", en: "Cafés and ice cream shops in every Pinzgau village" },
        { de: "Rückfahrt bequem mit der Pinzgauer Lokalbahn möglich", en: "Easy return by the Pinzgau Local Train" },
      ],
    },
    {
      heading: { de: "Gut zu wissen", en: "Good to know" },
      body: {
        de: "Strecke ist beidseitig ausgeschilderter Teil des Tauernradwegs. E-Bike-Verleih in Neukirchen und Mittersill verfügbar. Bei Hitze früh starten und Trinkflasche mitnehmen.",
        en: "The route is signposted in both directions as part of the Tauern Cycle Path. E-bike rentals available in Neukirchen and Mittersill. Start early on hot days and bring a water bottle.",
      },
    },
  ],
  externalUrl: "https://www.tauernradweg.at/",
  sourceLabel: "tauernradweg.at",
};

export default article;
