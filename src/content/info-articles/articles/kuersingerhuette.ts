import { Tent } from "lucide-react";
import type { InfoArticle } from "../types";

// Image source: Unsplash (free to use under the Unsplash License)
const UNSPLASH = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const article: InfoArticle = {
  id: "kuersingerhuette",
  topic: "hiking",
  icon: Tent,
  gradient: "from-primary to-wood",
  coverImage: UNSPLASH("photo-1464822759023-fed622ff2c3b", 1600),
  gallery: [
    {
      url: UNSPLASH("photo-1502784444187-359ac186c5bb"),
      caption: { de: "Aufstieg über blühende Almen", en: "Ascent across flowering pastures" },
    },
    {
      url: UNSPLASH("photo-1418065460487-3e41a6c84dc5"),
      caption: { de: "Berndlalm als Zwischenstopp", en: "Berndlalm as a midway stop" },
    },
    {
      url: UNSPLASH("photo-1470770841072-f978cf4d019e"),
      caption: { de: "Hochalpiner Bergsee am Weg", en: "High alpine lake along the trail" },
    },
    {
      url: UNSPLASH("photo-1469474968028-56623f02e42e"),
      caption: { de: "Sonniger Gipfelblick aus der Venedigergruppe", en: "Sunny summit view from the Venediger group" },
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
