import { Waves } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/water/zeller-see.jpg";

const article: InfoArticle = {
  id: "zeller-see",
  topic: "water",
  icon: Waves,
  gradient: "from-mountain-blue to-accent",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Promenade am Zeller See", en: "Lake Zell promenade" } },
  ],
  title: { de: "Zeller See – See & Promenade", en: "Lake Zell – Lakeside Promenade" },
  subtitle: { de: "Türkisblauer Bergsee mitten in den Alpen", en: "Turquoise mountain lake in the heart of the Alps" },
  shortDescription: {
    de: "Trinkwasserqualität, autofreie Promenade, Strandbäder und gemütliche Schifffahrt rund um den See.",
    en: "Drinking-water quality, car-free promenade, lidos and a relaxing scheduled boat service.",
  },
  stats: [
    { label: { de: "Länge", en: "Length" }, value: { de: "4 km", en: "4 km" } },
    { label: { de: "Wassertemp.", en: "Water temp." }, value: { de: "bis 23 °C", en: "up to 23 °C" } },
    { label: { de: "Saison", en: "Season" }, value: { de: "Mai–Sept.", en: "May–Sept." } },
    { label: { de: "Entfernung", en: "Distance" }, value: { de: "ca. 30 km", en: "approx. 30 km" } },
  ],
  sections: [
    {
      heading: { de: "Das Erlebnis", en: "The experience" },
      body: {
        de: "Spazieren, Tretboot fahren, Stand-up-Paddeln oder eine entspannte Linienschifffahrt – der Zeller See bietet Abkühlung und Bewegung gleichermaßen. Die Promenade ist autofrei und kinderwagenfreundlich.",
        en: "Stroll, hire a pedalo, paddle a SUP or take the scheduled boat – Lake Zell combines cooling off and gentle activity. The promenade is car-free and pram-friendly.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Schifffahrt MS Schmittenhöhe", en: "MS Schmittenhöhe scheduled boat" },
        { de: "Strandbad Zell & Thumersbach", en: "Zell and Thumersbach lidos" },
        { de: "SUP-, Tretboot- und Bootsverleih", en: "SUP, pedalo and boat rentals" },
        { de: "Lakeside Park für Familien", en: "Lakeside Park for families" },
      ],
    },
  ],
  externalUrl: "https://www.zellamsee-kaprun.com/de/zell-am-see-kaprun/zell-am-see/zeller-see",
  sourceLabel: "zellamsee-kaprun.com",
};

export default article;
