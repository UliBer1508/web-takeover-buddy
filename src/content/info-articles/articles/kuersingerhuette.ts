import { Tent } from "lucide-react";
import type { InfoArticle } from "../types";
// Real photos from Wikimedia Commons
// Kürsingerhütte 2007 (Public domain) by User:Fleece
// Berndlalm view by Whgler (CC BY-SA)
import kuersinger from "@/assets/hiking/kuersingerhuette.jpg";
import berndlalmView from "@/assets/hiking/berndlalm-view.jpg";

const article: InfoArticle = {
  id: "kuersingerhuette",
  topic: "hiking",
  icon: Tent,
  gradient: "from-primary to-wood",
  coverImage: kuersinger,
  gallery: [
    {
      url: kuersinger,
      caption: { de: "Kürsingerhütte auf 2.558 m am Großvenediger", en: "Kürsingerhütte at 2,558 m at the Großvenediger" },
    },
    {
      url: berndlalmView,
      caption: { de: "Berndlalm im Obersulzbachtal als Zwischenstopp", en: "Berndlalm in the Obersulzbach Valley as a midway stop" },
    },
  ],
  title: { de: "Kürsingerhütte über Berndlalm", en: "Kürsingerhütte via Berndlalm" },
  subtitle: {
    de: "Anspruchsvoller Aufstieg zur Schutzhütte am Großvenediger",
    en: "Challenging climb to the alpine refuge at the Großvenediger",
  },
  shortDescription: {
    de: "Hochalpine Tour für trittsichere Wanderer – mit Gletscherblick und Übernachtungsmöglichkeit auf 2.558 m.",
    en: "High-alpine tour for sure-footed hikers – with glacier views and overnight option at 2,558 m.",
  },
  stats: [
    { label: { de: "Länge", en: "Length" }, value: { de: "ca. 13 km", en: "approx. 13 km" } },
    { label: { de: "Höhenmeter", en: "Elevation" }, value: { de: "ca. 1.400 hm", en: "approx. 1,400 m" } },
    { label: { de: "Dauer", en: "Duration" }, value: { de: "5–6 h hin", en: "5–6 h up" } },
    { label: { de: "Schwierigkeit", en: "Difficulty" }, value: { de: "schwer", en: "Demanding" } },
  ],
  sections: [
    {
      heading: { de: "Streckenverlauf", en: "Route" },
      body: {
        de: "Von Hopffeldboden zunächst gemütlich zur Berndlalm. Dann steiler Aufstieg über den Postalmweg, vorbei am Gletschersee bis zur Kürsingerhütte (2.558 m), Stützpunkt für Großvenediger-Besteigungen.",
        en: "From Hopffeldboden, an easy walk first to Berndlalm. Then a steep climb along the Postalm path, past the glacier lake up to the Kürsingerhütte (2,558 m), the base camp for Großvenediger ascents.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Spektakulärer Gletscherblick", en: "Spectacular glacier views" },
        { de: "Bewirtschaftete Schutzhütte mit Übernachtung", en: "Managed refuge with overnight stays" },
        { de: "Optionaler Klettersteig (B) am Gletschersee", en: "Optional via ferrata (grade B) at the glacier lake" },
        { de: "Möglicher Gipfelaufstieg Großvenediger mit Bergführer", en: "Optional Großvenediger summit with a mountain guide" },
      ],
    },
    {
      heading: { de: "Gut zu wissen", en: "Good to know" },
      body: {
        de: "Hochalpine Tour – nur bei stabilem Wetter, mit guter Ausrüstung und Erfahrung. Hütten-Übernachtung im Voraus reservieren. Der Gletscherteil erfordert einen geprüften Bergführer.",
        en: "High alpine tour – only in stable weather and with proper equipment and experience. Book the hut in advance. The glacier section requires a certified mountain guide.",
      },
    },
  ],
  externalUrl: "https://www.bergwelten.com/t/w/15134",
  sourceLabel: "bergwelten.com",
};

export default article;
