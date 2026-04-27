import { Trees } from "lucide-react";
import type { InfoArticle } from "../types";
// Real photos from Wikimedia Commons – no specific Wildalm photo is freely
// licensed, so we use authentic regional images: Berndlalm (Obersulzbachtal,
// Whgler CC BY-SA) and Trattenbachalm (Woelle ffm CC BY-SA 3.0).
import berndlalmView from "@/assets/hiking/berndlalm-view.jpg";
import trattenbachalm from "@/assets/hiking/trattenbachalm.jpg";

const article: InfoArticle = {
  id: "wildalm",
  topic: "hiking",
  icon: Trees,
  gradient: "from-primary to-wood",
  coverImage: berndlalmView,
  gallery: [
    {
      url: berndlalmView,
      caption: { de: "Sulzbachtal – typische Almlandschaft des Nationalparks", en: "Sulzbach Valley – typical alpine landscape of the national park" },
    },
    {
      url: trattenbachalm,
      caption: { de: "Urige Pinzgauer Alm (Trattenbachalm)", en: "Rustic Pinzgau alm (Trattenbachalm)" },
    },
  ],
  title: { de: "Wildalm im Untersulzbachtal", en: "Wildalm in the Untersulzbach Valley" },
  subtitle: {
    de: "Romantische Almwanderung im Naturschutzgebiet",
    en: "Romantic alm hike in the nature reserve",
  },
  shortDescription: {
    de: "Klassische Jausen-Tour zur urigen Wildalm – Buttermilch, Kaspressknödel und ein stilles Hochtal.",
    en: "A classic snack hike to the rustic Wildalm – buttermilk, cheese dumplings and a quiet high valley.",
  },
  stats: [
    { label: { de: "Länge", en: "Length" }, value: { de: "ca. 7 km", en: "approx. 7 km" } },
    { label: { de: "Höhenmeter", en: "Elevation" }, value: { de: "ca. 450 hm", en: "approx. 450 m" } },
    { label: { de: "Dauer", en: "Duration" }, value: { de: "ca. 2,5 h", en: "approx. 2.5 h" } },
    { label: { de: "Schwierigkeit", en: "Difficulty" }, value: { de: "mittel", en: "Moderate" } },
  ],
  sections: [
    {
      heading: { de: "Streckenverlauf", en: "Route" },
      body: {
        de: "Vom Parkplatz Stockeralm im Untersulzbachtal folgt man dem markierten Almweg durch lichten Bergwald, vorbei an einem rauschenden Bach bis zur Wildalm (ca. 1.700 m). Der Rückweg erfolgt auf gleicher Route oder über den Almsteig.",
        en: "From the Stockeralm car park in the Untersulzbach Valley, follow the marked alm path through bright mountain forest, past a rushing stream to the Wildalm (around 1,700 m). Return on the same path or via the Almsteig trail.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Naturbelassenes Hochtal im Nationalpark Hohe Tauern", en: "Untouched high valley in Hohe Tauern National Park" },
        { de: "Hausgemachte Almprodukte direkt von der Sennerin", en: "Homemade alm products straight from the dairy maid" },
        { de: "Wenig befahren – ideal für Ruhesuchende", en: "Quiet trail – perfect for those seeking solitude" },
        { de: "Schöne Brotzeit-Plätze am Bachlauf", en: "Lovely picnic spots along the stream" },
      ],
    },
    {
      heading: { de: "Gut zu wissen", en: "Good to know" },
      body: {
        de: "Bewirtschaftung in der Regel von Mitte Juni bis Mitte September. Bei Regen wird der Steig rutschig – festes Schuhwerk Pflicht.",
        en: "Usually open from mid-June to mid-September. The trail becomes slippery in rain – sturdy footwear is essential.",
      },
    },
  ],
  externalUrl: "https://www.outdooractive.com/de/route/wandern/wildkogel-arena/almwanderung-zur-wildalm-in-neukirchen/28658200/",
  sourceLabel: "outdooractive.com",
};

export default article;
