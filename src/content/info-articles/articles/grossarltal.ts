import { Snowflake } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/skiing/grossarltal.jpg";

const article: InfoArticle = {
  id: "grossarltal",
  topic: "skiing",
  icon: Snowflake,
  gradient: "from-primary to-accent",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Großarltal – „Tal der Almen“", en: "Großarltal – 'Valley of the Alpine pastures'" } },
  ],
  title: { de: "Großarltal & Dorfgastein", en: "Großarltal & Dorfgastein" },
  subtitle: { de: "Skischaukel im Verbund Ski amadé", en: "Ski circuit linked to Ski amadé" },
  shortDescription: {
    de: "Verbundenes Skigebiet zwischen Großarl und Dorfgastein mit 75 km Piste. Charmante Hüttengastronomie und ruhigerer Charakter als die großen Nachbarn.",
    en: "Linked ski area between Großarl and Dorfgastein with 75 km of slopes. Charming hut cuisine and a quieter feel than its big neighbours.",
  },
  stats: [
    { label: { de: "Pisten", en: "Slopes" }, value: { de: "75 km", en: "75 km" } },
    { label: { de: "Liftanlagen", en: "Lifts" }, value: { de: "20", en: "20" } },
    { label: { de: "Höhe", en: "Altitude" }, value: { de: "830–2.033 m", en: "830–2,033 m" } },
    { label: { de: "Entfernung", en: "Distance" }, value: { de: "ca. 90 km", en: "approx. 90 km" } },
  ],
  sections: [
    {
      heading: { de: "Das Skigebiet", en: "The ski area" },
      body: {
        de: "Das Großarltal – auch „Tal der Almen“ genannt – verbindet sich über die Bergstationen mit Dorfgastein zur Skischaukel Großarltal-Dorfgastein. Familienfreundlich und Teil von Ski amadé.",
        en: "Großarltal – the 'valley of the Alpine pastures' – connects via mountain stations to Dorfgastein to form the Großarltal-Dorfgastein ski circuit. Family-friendly and part of Ski amadé.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "40 bewirtschaftete Almen im Tal", en: "40 traditional alpine huts in the valley" },
        { de: "Verbund mit Dorfgastein und ganz Ski amadé", en: "Linked to Dorfgastein and all of Ski amadé" },
        { de: "Lange rote Pisten ideal für Genussskifahrer", en: "Long red slopes ideal for cruising skiers" },
      ],
    },
  ],
  externalUrl: "https://www.skiamade.com/skigebiete/grossarltal-dorfgastein",
  sourceLabel: "skiamade.com / Wikimedia Commons",
};

export default article;
