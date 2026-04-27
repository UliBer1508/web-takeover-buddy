import { Snowflake } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/skiing/hochkoenig-mariaalm.jpg";

const article: InfoArticle = {
  id: "hochkoenig",
  topic: "skiing",
  icon: Snowflake,
  gradient: "from-primary to-accent",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Maria Alm in der Region Hochkönig", en: "Maria Alm in the Hochkönig region" } },
  ],
  title: { de: "Skigebiet Hochkönig", en: "Hochkönig Ski Area" },
  subtitle: { de: "Maria Alm · Dienten · Mühlbach – Ski amadé", en: "Maria Alm · Dienten · Mühlbach – Ski amadé" },
  shortDescription: {
    de: "120 km Pisten unter dem mächtigen Hochkönig-Massiv. Teil des Skiverbunds Ski amadé – mit der weitläufigen „Königstour“ über drei Orte.",
    en: "120 km of slopes beneath the mighty Hochkönig massif. Part of the Ski amadé alliance – including the long 'Königstour' linking three villages.",
  },
  stats: [
    { label: { de: "Pisten", en: "Slopes" }, value: { de: "120 km", en: "120 km" } },
    { label: { de: "Liftanlagen", en: "Lifts" }, value: { de: "34", en: "34" } },
    { label: { de: "Höhe", en: "Altitude" }, value: { de: "800–1.900 m", en: "800–1,900 m" } },
    { label: { de: "Entfernung", en: "Distance" }, value: { de: "ca. 70 km", en: "approx. 70 km" } },
  ],
  sections: [
    {
      heading: { de: "Das Skigebiet", en: "The ski area" },
      body: {
        de: "Drei traditionsreiche Bergorte – Maria Alm, Dienten und Mühlbach – verbunden zu einem familienfreundlichen Skigebiet vor der Kulisse des 2.941 m hohen Hochkönigs.",
        en: "Three traditional mountain villages – Maria Alm, Dienten and Mühlbach – linked into one family-friendly ski area set against the 2,941 m Hochkönig massif.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Königstour: Skirunde über alle drei Orte", en: "Königstour: ski circuit across all three villages" },
        { de: "Teil des Ski amadé Verbunds (760 km in einem Pass)", en: "Part of Ski amadé (760 km on one pass)" },
        { de: "Kulinarische Hütten mit Hochkönig-Blick", en: "Culinary huts with Hochkönig views" },
      ],
    },
  ],
  externalUrl: "https://www.hochkoenig.at/",
  sourceLabel: "hochkoenig.at / Wikimedia Commons",
};

export default article;
