import { Mountain } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/panorama/mooserboden.jpg";

const article: InfoArticle = {
  id: "mooserboden-stauseen",
  topic: "panorama",
  icon: Mountain,
  gradient: "from-mountain-blue to-primary",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Stausee Mooserboden mit Staumauer", en: "Mooserboden reservoir with dam wall" } },
  ],
  title: { de: "Hochgebirgsstauseen Kaprun – Mooserboden", en: "Kaprun High Mountain Reservoirs – Mooserboden" },
  subtitle: { de: "Türkisblaues Bergwasser auf 2.040 m", en: "Turquoise mountain water at 2,040 m" },
  shortDescription: {
    de: "Spektakuläre Stauseen mit gewaltigen Staumauern, umgeben von 3.000ern. Auffahrt mit Busshuttle und Schrägaufzug.",
    en: "Spectacular reservoirs with massive dams, surrounded by 3,000 m peaks. Reached via shuttle bus and inclined elevator.",
  },
  stats: [
    { label: { de: "Höhe", en: "Altitude" }, value: { de: "2.040 m", en: "2,040 m" } },
    { label: { de: "Saison", en: "Season" }, value: { de: "Mai–Okt.", en: "May–Oct." } },
    { label: { de: "Entfernung", en: "Distance" }, value: { de: "ca. 35 km", en: "approx. 35 km" } },
    { label: { de: "Familien", en: "Families" }, value: { de: "ideal", en: "ideal" } },
  ],
  sections: [
    {
      heading: { de: "Das Erlebnis", en: "The experience" },
      body: {
        de: "Vom Parkplatz Kesselfall geht es mit Bus und Schrägaufzug hinauf zu den Stauseen Wasserfallboden und Mooserboden. Oben warten Themenwege, Erlebniswelt Strom & Eis und beeindruckende Panoramen.",
        en: "From Kesselfall car park, shuttle buses and an inclined lift take you up to the Wasserfallboden and Mooserboden reservoirs. Theme trails, the Electricity & Ice experience and breathtaking panoramas await.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Begehbare Staumauer", en: "Walk across the dam wall" },
        { de: "Rundweg um den Mooserboden", en: "Loop trail around Mooserboden" },
        { de: "Erlebniswelt Strom & Eis", en: "Electricity & Ice experience" },
        { de: "Restaurant mit Panoramaterrasse", en: "Restaurant with panorama terrace" },
      ],
    },
  ],
  externalUrl: "https://www.verbund.com/de-at/konsumenten/uber-strom/erlebnis-erzeugung/kaprun",
  sourceLabel: "verbund.com",
};

export default article;
