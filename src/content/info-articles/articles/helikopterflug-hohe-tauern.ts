import { Crown } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/premium/helikopter.jpg";

const article: InfoArticle = {
  id: "helikopterflug-hohe-tauern",
  topic: "premium",
  icon: Crown,
  gradient: "from-primary to-accent",
  coverImage: cover,
  gallery: [
    { url: cover, caption: { de: "Helikopter über den Hohen Tauern", en: "Helicopter above the Hohe Tauern" } },
  ],
  title: { de: "Helikopter-Rundflug Hohe Tauern", en: "Helicopter Scenic Flight Hohe Tauern" },
  subtitle: { de: "Großglockner & Gletscher aus der Luft", en: "Großglockner & glaciers from the air" },
  shortDescription: {
    de: "Privat- oder Gruppenflüge ab Zell am See zu Großglockner, Großvenediger und den Gletschern – ein unvergessliches Premium-Erlebnis.",
    en: "Private or shared flights from Zell am See over Großglockner, Großvenediger and the glaciers – an unforgettable premium experience.",
  },
  stats: [
    { label: { de: "Dauer", en: "Duration" }, value: { de: "20–60 min", en: "20–60 min" } },
    { label: { de: "Start", en: "Departure" }, value: { de: "Zell am See", en: "Zell am See" } },
    { label: { de: "Saison", en: "Season" }, value: { de: "ganzjährig", en: "year-round" } },
    { label: { de: "Anmeldung", en: "Booking" }, value: { de: "erforderlich", en: "required" } },
  ],
  sections: [
    {
      heading: { de: "Das Erlebnis", en: "The experience" },
      body: {
        de: "Mehrere zertifizierte Anbieter (z. B. Heli Austria) starten direkt am Flugplatz Zell am See. Wählbar sind Kurzflüge, Glockner-Rundflüge oder individuelle Charterflüge.",
        en: "Several certified operators (e.g. Heli Austria) depart from Zell am See airfield. Choose short scenic flights, a Glockner loop or a private charter.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Großglockner aus der Luft", en: "Großglockner from the air" },
        { de: "Pasterze-Gletscher Überflug", en: "Pasterze glacier flyover" },
        { de: "Privatcharter möglich", en: "Private charter available" },
        { de: "Hochzeits- & Anlassflüge", en: "Wedding and special-occasion flights" },
      ],
    },
  ],
  externalUrl: "https://www.heli-austria.at",
  sourceLabel: "heli-austria.at",
};

export default article;
