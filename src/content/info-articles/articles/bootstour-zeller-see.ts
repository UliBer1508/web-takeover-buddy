import { Crown } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/premium/bootstour-zellersee.jpg";

const article: InfoArticle = {
  id: "bootstour-zeller-see",
  topic: "premium",
  icon: Crown,
  gradient: "from-mountain-blue to-accent",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Elektroboot am Zeller See", en: "Electric boat on Lake Zell" } },
  ],
  title: { de: "Privates Elektroboot am Zeller See", en: "Private Electric Boat on Lake Zell" },
  subtitle: { de: "Den See in Ruhe selbst entdecken", en: "Discover the lake at your own pace" },
  shortDescription: {
    de: "Führerscheinfreie Elektroboote für bis zu 6 Personen – ideal für Familien, Paare und Genießer.",
    en: "Licence-free electric boats for up to 6 people – ideal for families, couples and connoisseurs.",
  },
  stats: [
    { label: { de: "Personen", en: "People" }, value: { de: "bis 6", en: "up to 6" } },
    { label: { de: "Mietdauer", en: "Rental" }, value: { de: "ab 1 h", en: "from 1 h" } },
    { label: { de: "Saison", en: "Season" }, value: { de: "Mai–Sept.", en: "May–Sept." } },
    { label: { de: "Führerschein", en: "Licence" }, value: { de: "nicht nötig", en: "not required" } },
  ],
  sections: [
    {
      heading: { de: "Das Erlebnis", en: "The experience" },
      body: {
        de: "Mehrere Bootsverleihe entlang der Esplanade bieten geräuschlose Elektroboote, die selbständig auf dem See gefahren werden dürfen. Picknick an Bord erlaubt.",
        en: "Boat rentals along the esplanade offer silent electric boats you can pilot yourself across the lake. Picnics on board are welcome.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Lautlos und emissionsfrei", en: "Silent and emission-free" },
        { de: "Eigene Route wählbar", en: "Choose your own route" },
        { de: "Romantischer Sonnenuntergang", en: "Romantic sunsets" },
        { de: "Picknick an Bord möglich", en: "Picnic on board" },
      ],
    },
  ],
  externalUrl: "https://www.zellamsee-kaprun.com/de/aktivitaeten/sommer/wassersport/bootsverleih",
  sourceLabel: "zellamsee-kaprun.com",
};

export default article;
