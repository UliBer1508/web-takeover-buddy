import { Snowflake } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/skiing/kitzbuehel-hahnenkamm.jpg";
import may from "@/assets/skiing/kitzbuehel-may.jpg";

const article: InfoArticle = {
  id: "kitzski-kitzbuehel",
  topic: "skiing",
  icon: Snowflake,
  gradient: "from-primary to-accent",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Kitzbühel mit Hahnenkamm im Hintergrund", en: "Kitzbühel with Hahnenkamm in the background" } },
    { url: may, caption: { de: "Hahnenkamm im Frühjahr", en: "Hahnenkamm in spring" } },
  ],
  title: { de: "KitzSki – Kitzbühel & Kirchberg", en: "KitzSki – Kitzbühel & Kirchberg" },
  subtitle: { de: "Eines der besten Skigebiete der Welt", en: "One of the world's top ski resorts" },
  shortDescription: {
    de: "Legendäre Hahnenkamm-Abfahrt, 233 km Piste und das mehrfach ausgezeichnete Skigebiet Kitzbühel – nur rund eine Autostunde vom Chalet entfernt.",
    en: "Legendary Hahnenkamm downhill, 233 km of slopes and the multi-award-winning Kitzbühel ski area – about an hour by car from the chalet.",
  },
  stats: [
    { label: { de: "Pisten", en: "Slopes" }, value: { de: "233 km", en: "233 km" } },
    { label: { de: "Liftanlagen", en: "Lifts" }, value: { de: "57", en: "57" } },
    { label: { de: "Höhe", en: "Altitude" }, value: { de: "800–2.000 m", en: "800–2,000 m" } },
    { label: { de: "Entfernung", en: "Distance" }, value: { de: "ca. 60 km", en: "approx. 60 km" } },
  ],
  sections: [
    {
      heading: { de: "Das Skigebiet", en: "The ski area" },
      body: {
        de: "KitzSki verbindet Kitzbühel, Kirchberg, Jochberg und Pass Thurn zu einem der größten und modernsten Skigebiete der Alpen. Berühmt durch das Hahnenkamm-Rennen und die anspruchsvolle „Streif“-Abfahrt.",
        en: "KitzSki links Kitzbühel, Kirchberg, Jochberg and Pass Thurn into one of the largest and most modern ski areas in the Alps. Famous for the Hahnenkamm race and the demanding 'Streif' downhill.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Legendäre Streif-Abfahrt am Hahnenkamm", en: "Legendary Streif downhill on the Hahnenkamm" },
        { de: "3S Bahn – höchste Dreiseilumlaufbahn der Welt zur Bauzeit", en: "3S cable car – once the world's highest tri-cable gondola" },
        { de: "Kitzbüheler Altstadt mit Après-Ski & Kulinarik", en: "Historic Kitzbühel old town with après-ski & cuisine" },
      ],
    },
  ],
  externalUrl: "https://www.kitzski.at/",
  sourceLabel: "kitzski.at / Wikimedia Commons",
};

export default article;
