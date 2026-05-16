import { Landmark } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/cities/zell-am-see-altstadt.jpg";

const article: InfoArticle = {
  id: "zell-am-see-altstadt",
  topic: "culture",
  icon: Landmark,
  gradient: "from-mountain-blue to-primary",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Promenade & Altstadt Zell am See", en: "Promenade & old town Zell am See" } },
  ],
  title: { de: "Zell am See – Altstadt & Promenade", en: "Zell am See – Old Town & Promenade" },
  subtitle: { de: "Bummeln, shoppen, genießen am See", en: "Strolling, shopping and dining by the lake" },
  shortDescription: {
    de: "Historische Altstadt mit Vogtturm, Stadtkirche und gemütlichen Straßencafés direkt am Zeller See.",
    en: "Historic old town with the Vogtturm tower, parish church and cozy cafés right on Lake Zell.",
  },
  stats: [
    { label: { de: "Entfernung", en: "Distance" }, value: { de: "ca. 30 km", en: "approx. 30 km" } },
    { label: { de: "Saison", en: "Season" }, value: { de: "ganzjährig", en: "year-round" } },
    { label: { de: "Dauer", en: "Visit time" }, value: { de: "halber Tag", en: "half day" } },
    { label: { de: "Familien", en: "Families" }, value: { de: "ideal", en: "ideal" } },
  ],
  sections: [
    {
      heading: { de: "Das Erlebnis", en: "The experience" },
      body: {
        de: "Die autofreie Altstadt mit Seeplatz, Stadtplatz und Promenade lädt zum Flanieren ein – mit Boutiquen, Restaurants und herrlichem Blick auf See und Schmittenhöhe.",
        en: "The car-free old town with its lake square, town square and promenade invites you to stroll – boutiques, restaurants and beautiful views over the lake and Schmittenhöhe.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Vogtturm – Wahrzeichen der Stadt", en: "Vogtturm – the town's landmark" },
        { de: "Stadtkirche St. Hippolyt", en: "St. Hippolyt parish church" },
        { de: "Seepromenade mit Cafés", en: "Lakeside promenade with cafés" },
        { de: "Sommer-Konzerte am Stadtplatz", en: "Summer concerts on the town square" },
      ],
    },
  ],
  externalUrl: "https://www.zellamsee-kaprun.com/de/zell-am-see-kaprun/zell-am-see",
  sourceLabel: "zellamsee-kaprun.com",
};

export default article;
