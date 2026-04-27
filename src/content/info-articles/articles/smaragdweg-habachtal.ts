import { Gem } from "lucide-react";
import type { InfoArticle } from "../types";

// Image source: Unsplash (free to use under the Unsplash License)
const UNSPLASH = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const article: InfoArticle = {
  id: "smaragdweg-habachtal",
  topic: "hiking",
  icon: Gem,
  gradient: "from-primary to-mountain-blue",
  coverImage: UNSPLASH("photo-1757330878339-0b0c3b02d9b5", 1600),
  gallery: [
    {
      url: UNSPLASH("photo-1768395594632-6d6af13cfd7e"),
      caption: { de: "Stäubender Habach entlang des Themenwegs", en: "The Habach river spraying along the theme trail" },
    },
    {
      url: UNSPLASH("photo-1761384140398-88c88e648fcb"),
      caption: { de: "Blühende Almwiesen im Habachtal", en: "Flowering alpine meadows in the Habach Valley" },
    },
    {
      url: UNSPLASH("photo-1769029299328-31fa8472ef67"),
      caption: { de: "Thurnerkaser-Alm zum Einkehren", en: "Thurnerkaser alm for a break" },
    },
    {
      url: UNSPLASH("photo-1756846036941-36644e2dff7a"),
      caption: { de: "Naturbelassenes Hochtal", en: "Untouched high alpine valley" },
    },
  ],
  title: { de: "Smaragdweg im Habachtal", en: "Emerald Trail in the Habach Valley" },
  subtitle: {
    de: "Themenweg durch Europas einziges Smaragdvorkommen",
    en: "Theme trail through Europe's only emerald deposit",
  },
  shortDescription: {
    de: "Familienfreundlicher Themenweg entlang des wilden Habachs – mit Mineralien-Stationen und Schatzsucher-Atmosphäre.",
    en: "Family-friendly theme trail along the wild Habach river – with mineral stations and a treasure-hunt feel.",
  },
  stats: [
    { label: { de: "Länge", en: "Length" }, value: { de: "ca. 13 km", en: "approx. 13 km" } },
    { label: { de: "Höhenmeter", en: "Elevation" }, value: { de: "ca. 500 hm", en: "approx. 500 m" } },
    { label: { de: "Dauer", en: "Duration" }, value: { de: "ca. 4 h", en: "approx. 4 h" } },
    { label: { de: "Schwierigkeit", en: "Difficulty" }, value: { de: "leicht – mittel", en: "Easy to moderate" } },
  ],
  sections: [
    {
      heading: { de: "Streckenverlauf", en: "Route" },
      body: {
        de: "Vom Habachtal-Parkplatz in Bramberg führt der Weg an der Nationalpark-Infostelle vorbei und folgt dem Habach taleinwärts. Am ‚Grünen Boden‘ informieren Tafeln über die Mineralien des Tals.",
        en: "From the Habach Valley car park in Bramberg the trail passes the national park information point and follows the Habach upstream. At the 'Grüner Boden' clearing, panels explain the valley's minerals.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Einziges Smaragdvorkommen Europas", en: "Europe's only emerald deposit" },
        { de: "Mineralien-Lehrpfad für Kinder", en: "Mineral discovery trail for children" },
        { de: "Wilder Habach mit Wasserfallpassagen", en: "Wild Habach river with waterfall sections" },
        { de: "Thurnerkaser- und Gasthof-Einkehr", en: "Thurnerkaser hut and inn for refreshments" },
      ],
    },
    {
      heading: { de: "Gut zu wissen", en: "Good to know" },
      body: {
        de: "Der Weg ist auch mit größeren Kindern gut machbar. Im Habachhaus gibt es Mineralienführungen – Termine im Voraus buchen.",
        en: "The trail works well with older children. The Habachhaus offers guided mineral tours – book ahead.",
      },
    },
  ],
  externalUrl: "https://habachtal.at",
  sourceLabel: "habachtal.at",
};

export default article;
