import { Landmark } from "lucide-react";
import type { InfoArticle } from "../types";
// Real photos from Wikimedia Commons (CC BY-SA)
import cover from "@/assets/culture/felberturm-bergkristall.jpg";
import perchten from "@/assets/culture/felberturm-perchten.jpg";

const article: InfoArticle = {
  id: "felberturm",
  topic: "culture",
  icon: Landmark,
  gradient: "from-wood to-accent",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "139 kg-Bergkristall aus dem Felbertal", en: "139 kg rock crystal from the Felber valley" } },
    { url: perchten, caption: { de: "Original Pinzgauer Schiachpercht-Maske", en: "Original Pinzgau Schiachpercht mask" } },
  ],
  title: { de: "Felberturm Museum Mittersill", en: "Felberturm Museum Mittersill" },
  subtitle: { de: "Eines der ältesten Heimatmuseen Salzburgs", en: "One of Salzburg's oldest folk museums" },
  shortDescription: {
    de: "Im mittelalterlichen Wehrturm in Mittersill warten rund 5.000 Schaustücke zu Saumhandel, Bergbau, Brauchtum und alpinem Skilauf.",
    en: "In Mittersill's medieval defensive tower, around 5,000 exhibits cover pack-horse trade, mining, customs and alpine skiing history.",
  },
  stats: [
    { label: { de: "Exponate", en: "Exhibits" }, value: { de: "ca. 5.000", en: "approx. 5,000" } },
    { label: { de: "Entfernung", en: "Distance" }, value: { de: "ca. 25 km", en: "approx. 25 km" } },
    { label: { de: "Dauer", en: "Visit time" }, value: { de: "ca. 1,5–2 h", en: "approx. 1.5–2 h" } },
    { label: { de: "Saison", en: "Season" }, value: { de: "Mai–Oktober", en: "May–October" } },
  ],
  sections: [
    {
      heading: { de: "Das Museum", en: "The museum" },
      body: {
        de: "Das Felberturm Museum dokumentiert den Saumhandel über die Tauern, das harte Leben der Pinzgauer Bauern, die Mineralienwelt der Hohen Tauern und die Anfänge des alpinen Skilaufs.",
        en: "Felberturm Museum documents pack-horse trade across the Tauern, the hard life of Pinzgau farmers, the mineral world of the Hohe Tauern and the early days of alpine skiing.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Größter Bergkristall des Felbertals (139 kg)", en: "Largest rock crystal from the Felber valley (139 kg)" },
        { de: "Original Schiachpercht-Masken aus dem Pinzgau", en: "Original Schiachpercht masks from Pinzgau" },
        { de: "Ausstellung zur Geschichte des alpinen Skilaufs", en: "Exhibition on the history of alpine skiing" },
        { de: "Historischer Felberturm aus dem 13. Jahrhundert", en: "Historic Felberturm from the 13th century" },
      ],
    },
  ],
  externalUrl: "https://www.museumswelten-hohetauern.at/felberturmmuseum-mittersill/",
  sourceLabel: "museumswelten-hohetauern.at",
};

export default article;
