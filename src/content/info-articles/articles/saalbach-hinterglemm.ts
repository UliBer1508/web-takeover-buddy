import { Snowflake } from "lucide-react";
import type { InfoArticle } from "../types";
// Real photos from saalbach.com © Georg Lindacher (used promotionally)
import cover from "@/assets/skiing/saalbach-skialpin.jpg";
import piste from "@/assets/skiing/saalbach-pistenblick.jpg";
import huette from "@/assets/skiing/saalbach-huette.jpg";

const article: InfoArticle = {
  id: "saalbach-hinterglemm",
  topic: "skiing",
  icon: Snowflake,
  gradient: "from-primary to-wood",
  coverImage: cover,
  gallery: [
    { url: piste, caption: { de: "Saalbach – Piste im Skicircus", en: "Saalbach – slope in the Skicircus" } },
    { url: huette, caption: { de: "Hütteneinkehr mit Pistenblick", en: "Mountain hut stop with slope view" } },
  ],
  title: { de: "Skicircus Saalbach Hinterglemm", en: "Skicircus Saalbach Hinterglemm" },
  subtitle: { de: "270 km Pisten – Weltcup-Resort, ca. 45 Minuten entfernt", en: "270 km of slopes – World Cup resort, about 45 minutes away" },
  shortDescription: {
    de: "Eines der größten Skigebiete Österreichs: Saalbach Hinterglemm Leogang Fieberbrunn vereint 270 km Pisten und 70 Lifte zu einem einzigen Skicircus.",
    en: "One of Austria's largest ski areas: Saalbach Hinterglemm Leogang Fieberbrunn unites 270 km of slopes and 70 lifts in a single Skicircus.",
  },
  stats: [
    { label: { de: "Pisten", en: "Slopes" }, value: { de: "270 km", en: "270 km" } },
    { label: { de: "Liftanlagen", en: "Lifts" }, value: { de: "70", en: "70" } },
    { label: { de: "Höhe", en: "Altitude" }, value: { de: "840–2.096 m", en: "840–2,096 m" } },
    { label: { de: "Anfahrt", en: "Drive time" }, value: { de: "ca. 45 min", en: "approx. 45 min" } },
  ],
  sections: [
    {
      heading: { de: "Das Skigebiet", en: "The ski area" },
      body: {
        de: "Der Skicircus Saalbach Hinterglemm Leogang Fieberbrunn ist eines der größten zusammenhängenden Skigebiete Österreichs. Austragungsort der alpinen Ski-WM 2025.",
        en: "The Skicircus Saalbach Hinterglemm Leogang Fieberbrunn is one of Austria's largest connected ski areas. Host of the 2025 Alpine Ski World Championships.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Ski ALPIN CARD: bis zu 408 Pistenkilometer mit einem Ticket", en: "Ski ALPIN CARD: up to 408 km of slopes with one ticket" },
        { de: "Lebendigster Après-Ski der Alpen", en: "Liveliest après-ski in the Alps" },
        { de: "Freeride-Hänge und Snowparks", en: "Freeride slopes and snow parks" },
        { de: "Renommierte Hüttenkulinarik", en: "Renowned mountain hut cuisine" },
      ],
    },
  ],
  externalUrl: "https://www.saalbach.com/de/winter",
  sourceLabel: "saalbach.com",
};

export default article;
