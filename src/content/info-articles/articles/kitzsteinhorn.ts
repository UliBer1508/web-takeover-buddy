import { Snowflake } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/skiing/kitzsteinhorn.jpg";

const article: InfoArticle = {
  id: "kitzsteinhorn",
  topic: "skiing",
  icon: Snowflake,
  gradient: "from-primary to-accent",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Gletscherskigebiet Kitzsteinhorn bei Kaprun", en: "Kitzsteinhorn glacier ski area near Kaprun" } },
  ],
  title: { de: "Kitzsteinhorn Kaprun", en: "Kitzsteinhorn Kaprun" },
  subtitle: { de: "Ganzjährig Schnee am Gletscher", en: "Year-round snow on the glacier" },
  shortDescription: {
    de: "Gletscherskigebiet auf 3.029 m – schneesicher von Oktober bis Mai. Mit Gipfelwelt 3000, Aussichtsplattform „Top of Salzburg“ und langer Gletscherabfahrt.",
    en: "Glacier ski area at 3,029 m – snow-sure from October to May. Featuring Gipfelwelt 3000, the 'Top of Salzburg' viewing platform and a long glacier descent.",
  },
  stats: [
    { label: { de: "Pisten", en: "Slopes" }, value: { de: "61 km", en: "61 km" } },
    { label: { de: "Liftanlagen", en: "Lifts" }, value: { de: "21", en: "21" } },
    { label: { de: "Höhe", en: "Altitude" }, value: { de: "911–3.029 m", en: "911–3,029 m" } },
    { label: { de: "Entfernung", en: "Distance" }, value: { de: "ca. 50 km", en: "approx. 50 km" } },
  ],
  sections: [
    {
      heading: { de: "Das Skigebiet", en: "The ski area" },
      body: {
        de: "Salzburgs einziger Gletscher und Anschluss ans Schmittenhöhe-Skigebiet über den Skiverbund Ski Alpin Card. Spektakuläre Hochgebirgskulisse und Gipfelrestaurant auf 3.029 m.",
        en: "Salzburg's only glacier, linked to the Schmittenhöhe ski area via the Ski Alpin Card. Spectacular high-alpine scenery and a summit restaurant at 3,029 m.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Schneegarantie von Oktober bis Mai", en: "Snow guarantee from October to May" },
        { de: "Gipfelwelt 3000 mit Cinema 3000 & Nationalpark Gallery", en: "Gipfelwelt 3000 with Cinema 3000 & National Park Gallery" },
        { de: "Top of Salzburg – Aussichtsplattform auf 3.029 m", en: "Top of Salzburg viewing platform at 3,029 m" },
      ],
    },
  ],
  externalUrl: "https://www.kitzsteinhorn.at/",
  sourceLabel: "kitzsteinhorn.at / Wikimedia Commons",
};

export default article;
