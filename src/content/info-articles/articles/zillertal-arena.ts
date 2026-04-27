import { Mountain } from "lucide-react";
import type { InfoArticle } from "../types";
// Real photos from Wikimedia Commons (CC BY-SA)
import panorama from "@/assets/skiing/koenigsleiten-panorama.jpg";
import ort from "@/assets/skiing/koenigsleiten-ort.jpg";

const article: InfoArticle = {
  id: "zillertal-arena",
  topic: "skiing",
  icon: Mountain,
  gradient: "from-accent to-primary",
  coverImage: panorama,
  gallery: [
    { url: panorama, caption: { de: "Panorama Königsleiten – Holidaypark mit Bergblick", en: "Königsleiten panorama – holiday park with mountain views" } },
    { url: ort, caption: { de: "Almdorf Königsleiten im Tiefschnee", en: "Königsleiten alpine village in deep snow" } },
  ],
  title: { de: "Zillertal Arena – Königsleiten & Gerlos", en: "Zillertal Arena – Königsleiten & Gerlos" },
  subtitle: { de: "Größtes Skigebiet im Zillertal, ca. 30 Minuten entfernt", en: "Largest ski area in Zillertal, about 30 minutes away" },
  shortDescription: {
    de: "150 Pistenkilometer und 52 Liftanlagen – die Smaragd-Skischaukel verbindet Königsleiten und Gerlos mit Zell am Ziller und Hochkrimml.",
    en: "150 km of slopes and 52 lifts – the Emerald Ski Carousel links Königsleiten and Gerlos with Zell am Ziller and Hochkrimml.",
  },
  stats: [
    { label: { de: "Pisten", en: "Slopes" }, value: { de: "150 km", en: "150 km" } },
    { label: { de: "Liftanlagen", en: "Lifts" }, value: { de: "52", en: "52" } },
    { label: { de: "Höhe", en: "Altitude" }, value: { de: "bis 2.500 m", en: "up to 2,500 m" } },
    { label: { de: "Talabfahrt", en: "Valley descent" }, value: { de: "1.930 hm", en: "1,930 m drop" } },
  ],
  sections: [
    {
      heading: { de: "Das Skigebiet", en: "The ski area" },
      body: {
        de: "Die Zillertal Arena erstreckt sich über zwei Bundesländer und verbindet die Orte Zell am Ziller, Gerlos, Königsleiten und Hochkrimml. Mit der längsten durchgehenden Talabfahrt im Zillertal (1.930 Höhenmeter).",
        en: "The Zillertal Arena spans two federal states and connects Zell am Ziller, Gerlos, Königsleiten and Hochkrimml. Home to Zillertal's longest valley descent (1,930 m vertical drop).",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Schneesicherheit bis 2.500 m", en: "Snow guarantee up to 2,500 m" },
        { de: "Übergang über Hochkrimml direkt aus Salzburger Land erreichbar", en: "Direct access via Hochkrimml from Salzburg" },
        { de: "ARENA Coaster Family-Rodelbahn", en: "ARENA Coaster family toboggan run" },
        { de: "Freeride-Routen abseits der Pisten", en: "Freeride routes off-piste" },
      ],
    },
  ],
  externalUrl: "https://www.zillertalarena.com/de/winter",
  sourceLabel: "zillertalarena.com",
};

export default article;
