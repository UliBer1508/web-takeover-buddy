import { Snowflake } from "lucide-react";
import type { InfoArticle } from "../types";
// Real photos from wildkogel-arena.at (used promotionally)
import cover from "@/assets/skiing/wildkogel-piste.jpg";
import bogen from "@/assets/skiing/wildkogel-bogen.jpg";
import funslope from "@/assets/skiing/wildkogel-funslope.jpg";
import kinder from "@/assets/skiing/wildkogel-kinder.jpg";

const article: InfoArticle = {
  id: "skiarena-wildkogel",
  topic: "skiing",
  icon: Snowflake,
  gradient: "from-primary to-accent",
  coverImage: cover,
  gallery: [
    { url: bogen, caption: { de: "Willkommensbogen am Startpunkt der Wildkogel-Arena", en: "Welcome arch at the Wildkogel-Arena start" } },
    { url: funslope, caption: { de: "Funslope & Familypark", en: "Funslope & Family park" } },
    { url: kinder, caption: { de: "Kogel-Mogel Kinderland", en: "Kogel-Mogel kids' area" } },
  ],
  title: { de: "Skiarena Wildkogel", en: "Wildkogel Ski Arena" },
  subtitle: { de: "75 km Pisten direkt vor der Haustür", en: "75 km of slopes right on the doorstep" },
  shortDescription: {
    de: "Familienfreundliches Skigebiet zwischen Neukirchen und Bramberg – schneesicher bis ins Frühjahr, mit Funslope, Kinderland und Skimovie-Strecke.",
    en: "Family-friendly ski area between Neukirchen and Bramberg – snow-sure into spring, with funslope, kids' area and ski-movie run.",
  },
  stats: [
    { label: { de: "Pisten", en: "Slopes" }, value: { de: "75 km", en: "75 km" } },
    { label: { de: "Liftanlagen", en: "Lifts" }, value: { de: "16", en: "16" } },
    { label: { de: "Höhe", en: "Altitude" }, value: { de: "830–2.150 m", en: "830–2,150 m" } },
    { label: { de: "Schwierigkeit", en: "Difficulty" }, value: { de: "85 % blau/rot", en: "85 % blue/red" } },
  ],
  sections: [
    {
      heading: { de: "Das Skigebiet", en: "The ski area" },
      body: {
        de: "Die Wildkogel-Arena ist das Hausskigebiet von Neukirchen und Bramberg im Salzburger Land. 75 km bestens präparierte Pisten, eine 14 km lange Talabfahrt und Panoramablick auf die 3000er der Hohen Tauern.",
        en: "Wildkogel-Arena is the home ski area of Neukirchen and Bramberg in Salzburger Land. 75 km of perfectly groomed slopes, a 14 km valley descent and panoramic views of the Hohe Tauern 3,000-metre peaks.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Eine der längsten beleuchteten Rodelbahnen der Welt (14 km)", en: "One of the longest floodlit toboggan runs in the world (14 km)" },
        { de: "Funslope, Familypark und Kogel-Mogel Kinderland", en: "Funslope, family park and Kogel-Mogel kids' area" },
        { de: "Skimovie-Strecke mit Speedcheck", en: "Ski-movie run with speed check" },
        { de: "85 % blaue und rote Pisten – ideal für Familien", en: "85 % blue and red slopes – ideal for families" },
      ],
    },
  ],
  externalUrl: "https://www.wildkogel-arena.at/skifahren-snowboarden/",
  sourceLabel: "wildkogel-arena.at",
};

export default article;
