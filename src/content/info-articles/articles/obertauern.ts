import { Snowflake } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/skiing/obertauern.jpg";

const article: InfoArticle = {
  id: "obertauern",
  topic: "skiing",
  icon: Snowflake,
  gradient: "from-primary to-accent",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Obertauern mit Blick zur Steinfeldspitze", en: "Obertauern with view to Steinfeldspitze" } },
  ],
  title: { de: "Obertauern", en: "Obertauern" },
  subtitle: { de: "Schneesicheres Hochplateau auf 1.740 m", en: "Snow-sure high plateau at 1,740 m" },
  shortDescription: {
    de: "Eines der schneesichersten Skigebiete Österreichs – als kompakte Tauernrunde rund um den Ort. 100 km Pisten in zentraler Höhenlage.",
    en: "One of Austria's most snow-sure resorts – a compact 'Tauernrunde' circuit around the village. 100 km of slopes at high altitude.",
  },
  stats: [
    { label: { de: "Pisten", en: "Slopes" }, value: { de: "100 km", en: "100 km" } },
    { label: { de: "Liftanlagen", en: "Lifts" }, value: { de: "26", en: "26" } },
    { label: { de: "Höhe", en: "Altitude" }, value: { de: "1.630–2.313 m", en: "1,630–2,313 m" } },
    { label: { de: "Entfernung", en: "Distance" }, value: { de: "ca. 130 km", en: "approx. 130 km" } },
  ],
  sections: [
    {
      heading: { de: "Das Skigebiet", en: "The ski area" },
      body: {
        de: "Obertauern liegt direkt am Radstädter Tauernpass und bietet dank seiner Höhenlage eine der längsten Skisaisonen Österreichs (Anfang Dezember bis Anfang Mai). Die berühmte Tauernrunde führt einmal um den Ort.",
        en: "Obertauern sits right on the Radstädter Tauern pass and, thanks to its altitude, offers one of Austria's longest ski seasons (early December to early May). The famous Tauernrunde circuit loops around the village.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Tauernrunde – einmal um Obertauern auf Skiern", en: "Tauernrunde – ski all the way around the village" },
        { de: "Schneesicher von Anfang Dezember bis Mai", en: "Snow-sure from early December until May" },
        { de: "Drehort der Beatles-Filme „Help!“", en: "Filming location of the Beatles' film 'Help!'" },
      ],
    },
  ],
  externalUrl: "https://www.obertauern.com/",
  sourceLabel: "obertauern.com / Wikimedia Commons",
};

export default article;
