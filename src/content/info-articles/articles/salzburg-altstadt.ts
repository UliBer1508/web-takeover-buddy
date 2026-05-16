import { Landmark } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/cities/salzburg-altstadt.jpg";

const article: InfoArticle = {
  id: "salzburg-altstadt",
  topic: "culture",
  icon: Landmark,
  gradient: "from-primary to-accent",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Festung Hohensalzburg über der Altstadt", en: "Hohensalzburg Fortress above the old town" } },
  ],
  title: { de: "Salzburg Altstadt – UNESCO Welterbe", en: "Salzburg Old Town – UNESCO World Heritage" },
  subtitle: { de: "Festung, Mozart & barocke Plätze", en: "Fortress, Mozart & baroque squares" },
  shortDescription: {
    de: "Festung Hohensalzburg, Mozart-Geburtshaus, Mirabellgarten und die Getreidegasse – die Mozartstadt ist ein perfekter Tagesausflug.",
    en: "Hohensalzburg Fortress, Mozart's birthplace, Mirabell Gardens and Getreidegasse – the Mozart city is a perfect day trip.",
  },
  stats: [
    { label: { de: "Entfernung", en: "Distance" }, value: { de: "ca. 110 km", en: "approx. 110 km" } },
    { label: { de: "Anfahrt", en: "Travel" }, value: { de: "1,5 h Auto", en: "1.5 h by car" } },
    { label: { de: "Saison", en: "Season" }, value: { de: "ganzjährig", en: "year-round" } },
    { label: { de: "Dauer", en: "Visit time" }, value: { de: "1 Tag", en: "1 day" } },
  ],
  sections: [
    {
      heading: { de: "Das Erlebnis", en: "The experience" },
      body: {
        de: "Die Altstadt Salzburgs ist UNESCO-Welterbe. Festung Hohensalzburg, Dom, Residenz und die berühmten Schaufenster der Getreidegasse machen die Stadt zu einem der Highlights Österreichs.",
        en: "Salzburg's old town is a UNESCO World Heritage Site. Hohensalzburg Fortress, the Cathedral, the Residenz and the famous wrought-iron signs of Getreidegasse make it one of Austria's highlights.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Festung Hohensalzburg mit Standseilbahn", en: "Hohensalzburg Fortress with funicular" },
        { de: "Mozart-Geburtshaus in der Getreidegasse", en: "Mozart's birthplace on Getreidegasse" },
        { de: "Schloss Mirabell & Gärten", en: "Mirabell Palace & gardens" },
        { de: "Haus der Natur – Museum für Familien", en: "Haus der Natur – museum for families" },
      ],
    },
  ],
  externalUrl: "https://www.salzburg.info",
  sourceLabel: "salzburg.info",
};

export default article;
