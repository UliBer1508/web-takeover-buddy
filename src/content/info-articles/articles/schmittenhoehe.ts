import { Snowflake } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/skiing/schmittenhoehe.jpg";
import zellsee from "@/assets/skiing/schmittenhoehe-zellsee.jpg";

const article: InfoArticle = {
  id: "schmittenhoehe",
  topic: "skiing",
  icon: Snowflake,
  gradient: "from-primary to-accent",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Schmittenhöhe über Zell am See", en: "Schmittenhöhe above Zell am See" } },
    { url: zellsee, caption: { de: "Blick auf den Zeller See", en: "View over Lake Zell" } },
  ],
  title: { de: "Schmittenhöhe Zell am See", en: "Schmittenhöhe Zell am See" },
  subtitle: { de: "77 km Pisten mit Seenpanorama", en: "77 km of slopes with lake panorama" },
  shortDescription: {
    de: "Skifahren mit einmaligem Panorama auf den Zeller See, das Kitzsteinhorn und die Hohen Tauern – inklusive moderner Bergbahnen und der berühmten Trass-Abfahrt.",
    en: "Skiing with unique panoramic views over Lake Zell, the Kitzsteinhorn and the Hohe Tauern – with modern lifts and the famous Trass descent.",
  },
  stats: [
    { label: { de: "Pisten", en: "Slopes" }, value: { de: "77 km", en: "77 km" } },
    { label: { de: "Liftanlagen", en: "Lifts" }, value: { de: "28", en: "28" } },
    { label: { de: "Höhe", en: "Altitude" }, value: { de: "757–2.000 m", en: "757–2,000 m" } },
    { label: { de: "Entfernung", en: "Distance" }, value: { de: "ca. 45 km", en: "approx. 45 km" } },
  ],
  sections: [
    {
      heading: { de: "Das Skigebiet", en: "The ski area" },
      body: {
        de: "Die Schmittenhöhe ist der Hausberg von Zell am See – mit Anschluss an Kaprun über die Ski Alpin Card. Berühmt für die Trass-Abfahrt, eine der schwersten Talabfahrten Österreichs.",
        en: "Schmittenhöhe is Zell am See's home mountain – linked with Kaprun via the Ski Alpin Card. Famous for the Trass descent, one of Austria's toughest valley runs.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "360°-Panorama über 30 Dreitausender", en: "360° panorama over 30 three-thousand-metre peaks" },
        { de: "Trass – legendäre Talabfahrt nach Schüttdorf", en: "Trass – legendary valley descent to Schüttdorf" },
        { de: "Ski Alpin Card: 408 Pistenkilometer in einem Pass", en: "Ski Alpin Card: 408 km of slopes on one pass" },
      ],
    },
  ],
  externalUrl: "https://www.schmitten.at/",
  sourceLabel: "schmitten.at / Wikimedia Commons",
};

export default article;
