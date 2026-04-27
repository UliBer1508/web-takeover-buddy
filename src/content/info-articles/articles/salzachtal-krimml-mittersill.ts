import { Bike } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/bike-routes/salzachtal-cover.jpg";
import g1 from "@/assets/bike-routes/salzachtal-g1.jpg";
import g2 from "@/assets/bike-routes/salzachtal-g2.jpg";
import g3 from "@/assets/bike-routes/salzachtal-g3.jpg";

// Image source: Wikimedia Commons (CC BY-SA) - authentic Salzach valley photography

const article: InfoArticle = {
  id: "salzachtal-krimml-mittersill",
  topic: "cycling",
  icon: Bike,
  gradient: "from-accent to-primary",
  coverImage: cover,
  gallery: [
    { url: g1, caption: { de: "Krimmler Wasserfälle – Start der Tour", en: "Krimml waterfalls – start of the tour" } },
    { url: g2, caption: { de: "Salzach bei Bramberg am Wildkogel", en: "Salzach river near Bramberg am Wildkogel" } },
    { url: g3, caption: { de: "Brücke über die Salzach bei Mittersill", en: "Bridge over the Salzach near Mittersill" } },
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
