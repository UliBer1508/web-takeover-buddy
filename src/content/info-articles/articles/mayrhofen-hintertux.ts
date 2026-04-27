import { Snowflake } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/skiing/hintertux-gletscher.jpg";
import penken from "@/assets/skiing/mayrhofen-penken.jpg";
import piste from "@/assets/skiing/hintertux-piste.jpg";

const article: InfoArticle = {
  id: "mayrhofen-hintertux",
  topic: "skiing",
  icon: Snowflake,
  gradient: "from-primary to-accent",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Hintertuxer Gletscher – ganzjährig geöffnet", en: "Hintertux Glacier – open year-round" } },
    { url: piste, caption: { de: "Piste am Riepensattel, Hintertux", en: "Piste at Riepensattel, Hintertux" } },
    { url: penken, caption: { de: "Penken – Hausberg von Mayrhofen", en: "Penken – Mayrhofen's home mountain" } },
  ],
  title: { de: "Mayrhofen & Hintertuxer Gletscher", en: "Mayrhofen & Hintertux Glacier" },
  subtitle: { de: "Zillertal – Ski 365 Tage im Jahr", en: "Zillertal – ski 365 days a year" },
  shortDescription: {
    de: "Mayrhofen mit Penken und Ahorn (142 km) plus den ganzjährig geöffneten Hintertuxer Gletscher. Für Adrenalin: die Harakiri – steilste Piste Österreichs (78 %).",
    en: "Mayrhofen with Penken and Ahorn (142 km) plus the year-round Hintertux Glacier. For thrill-seekers: the Harakiri – Austria's steepest piste (78 %).",
  },
  stats: [
    { label: { de: "Pisten", en: "Slopes" }, value: { de: "196 km (Verbund)", en: "196 km (combined)" } },
    { label: { de: "Höhe", en: "Altitude" }, value: { de: "630–3.250 m", en: "630–3,250 m" } },
    { label: { de: "Steilste Piste", en: "Steepest slope" }, value: { de: "Harakiri 78 %", en: "Harakiri 78 %" } },
    { label: { de: "Entfernung", en: "Distance" }, value: { de: "ca. 80 km via Gerlos", en: "approx. 80 km via Gerlos" } },
  ],
  sections: [
    {
      heading: { de: "Das Skigebiet", en: "The ski area" },
      body: {
        de: "Mayrhofen ist der Action-Hotspot des Zillertals. Mit der Super-Skipass-Variante kommt der Hintertuxer Gletscher dazu – das einzige Ganzjahresskigebiet Österreichs.",
        en: "Mayrhofen is the action hotspot of the Zillertal. The Super Ski Pass adds the Hintertux Glacier – Austria's only year-round ski area.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Harakiri – steilste präparierte Piste Österreichs", en: "Harakiri – Austria's steepest groomed piste" },
        { de: "Hintertuxer Gletscher: Skifahren 365 Tage", en: "Hintertux Glacier: skiing 365 days a year" },
        { de: "Vans Penken Park – Top-Snowpark der Alpen", en: "Vans Penken Park – top alpine snowpark" },
      ],
    },
  ],
  externalUrl: "https://www.mayrhofner-bergbahnen.com/",
  sourceLabel: "mayrhofner-bergbahnen.com / Wikimedia Commons",
};

export default article;
