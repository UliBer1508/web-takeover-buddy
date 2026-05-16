import { Waves } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/water/sigmund-thun-klamm.jpg";

const article: InfoArticle = {
  id: "sigmund-thun-klamm",
  topic: "water",
  icon: Waves,
  gradient: "from-mountain-blue to-primary",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Holzsteg durch die Klamm", en: "Wooden walkway through the gorge" } },
  ],
  title: { de: "Sigmund-Thun-Klamm Kaprun", en: "Sigmund Thun Gorge Kaprun" },
  subtitle: { de: "Tosende Schlucht mit Holzstegen", en: "Roaring gorge with wooden boardwalks" },
  shortDescription: {
    de: "320 m lange Klamm mit gut gesicherten Stegen, kristallklarem Wildbach und kühler Schluchtatmosphäre – ideal für heiße Tage.",
    en: "320 m gorge with secured walkways, crystal-clear torrent and cool canyon air – perfect on hot days.",
  },
  stats: [
    { label: { de: "Länge", en: "Length" }, value: { de: "ca. 320 m", en: "approx. 320 m" } },
    { label: { de: "Dauer", en: "Duration" }, value: { de: "ca. 1 h", en: "approx. 1 h" } },
    { label: { de: "Saison", en: "Season" }, value: { de: "Mai–Okt.", en: "May–Oct." } },
    { label: { de: "Familien", en: "Families" }, value: { de: "ideal", en: "ideal" } },
  ],
  sections: [
    {
      heading: { de: "Das Erlebnis", en: "The experience" },
      body: {
        de: "Die Klamm wurde nach dem Erbauer der Kapruner Hochgebirgsstauseen benannt. Holzstege und Treppen führen sicher durch die enge Schlucht, über der Klamm wartet der idyllische Klammsee.",
        en: "Named after the engineer of the Kaprun reservoirs. Wooden walkways and stairs lead safely through the narrow canyon; the idyllic Klammsee lake sits above.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Spektakuläre Holzstege über dem Wasser", en: "Spectacular wooden walkways over the water" },
        { de: "Klammsee mit Rundweg", en: "Klammsee with loop trail" },
        { de: "Kühle Erfrischung im Hochsommer", en: "Cool refuge on hot summer days" },
        { de: "Auch für Kinderwagen-Eltern teilweise begehbar", en: "Partly accessible for prams" },
      ],
    },
  ],
  externalUrl: "https://www.kaprun.com/de/aktivitaeten/sommer/wandern/sigmund-thun-klamm",
  sourceLabel: "kaprun.com",
};

export default article;
