import { Snowflake } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/skiing/rauris-hochalm.jpg";

const article: InfoArticle = {
  id: "rauris",
  topic: "skiing",
  icon: Snowflake,
  gradient: "from-primary to-accent",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Hochalmbahn Rauris", en: "Hochalmbahn Rauris" } },
  ],
  title: { de: "Skigebiet Rauris – Hochalmbahnen", en: "Rauris Ski Area – Hochalmbahnen" },
  subtitle: { de: "Familiäres Skigebiet im Raurisertal", en: "Family-run ski area in the Rauris valley" },
  shortDescription: {
    de: "Ruhiges, charmantes Skigebiet am Rande des Nationalparks Hohe Tauern. 30 km Piste, ideal für Familien und Genussskifahrer abseits des Trubels.",
    en: "Quiet, charming ski area on the edge of the Hohe Tauern National Park. 30 km of slopes, ideal for families and cruising skiers away from the crowds.",
  },
  stats: [
    { label: { de: "Pisten", en: "Slopes" }, value: { de: "30 km", en: "30 km" } },
    { label: { de: "Liftanlagen", en: "Lifts" }, value: { de: "9", en: "9" } },
    { label: { de: "Höhe", en: "Altitude" }, value: { de: "950–2.200 m", en: "950–2,200 m" } },
    { label: { de: "Entfernung", en: "Distance" }, value: { de: "ca. 75 km", en: "approx. 75 km" } },
  ],
  sections: [
    {
      heading: { de: "Das Skigebiet", en: "The ski area" },
      body: {
        de: "Die Hochalmbahnen in Rauris bieten entspanntes Skifahren mit traumhaftem Tauernblick – ein Geheimtipp für alle, die familiäre Atmosphäre statt Massentourismus suchen.",
        en: "The Hochalmbahnen in Rauris offer relaxed skiing with stunning Tauern views – an insider tip for those who prefer a family feel over mass tourism.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Direkt am Nationalpark Hohe Tauern", en: "Right next to the Hohe Tauern National Park" },
        { de: "Übungslifte und Kinderland am Talboden", en: "Practice lifts and children's area in the valley" },
        { de: "Lange Talabfahrt mit Panoramablick", en: "Long valley descent with panoramic views" },
      ],
    },
  ],
  externalUrl: "https://www.skigebiet-rauris.at/",
  sourceLabel: "skigebiet-rauris.at / Wikimedia Commons",
};

export default article;
