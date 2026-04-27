import { Gem } from "lucide-react";
import type { InfoArticle } from "../types";
// Real photos from Wikimedia Commons (CC BY-SA 3.0)
// Moa Alm im Habachtal by Whgler; Smaragd Habachtal by Mayer Bruno
import moaAlm from "@/assets/hiking/habachtal-moaalm.jpg";
import smaragd from "@/assets/hiking/habachtal-smaragd.jpg";

const article: InfoArticle = {
  id: "smaragdweg-habachtal",
  topic: "hiking",
  icon: Gem,
  gradient: "from-primary to-mountain-blue",
  coverImage: moaAlm,
  gallery: [
    {
      url: moaAlm,
      caption: { de: "Moa-Alm im Habachtal", en: "Moa-Alm in the Habach Valley" },
    },
    {
      url: smaragd,
      caption: { de: "Smaragdvorkommen im Habachtal", en: "Emerald deposit in the Habach Valley" },
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
