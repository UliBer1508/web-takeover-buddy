import { Bike } from "lucide-react";
import type { InfoArticle } from "../types";
import cover from "@/assets/bike-routes/bike-trail-cover.jpg";
import g1 from "@/assets/bike-routes/bike-trail-g1.jpg";
import g2 from "@/assets/bike-routes/bike-trail-g2.jpg";
import g3 from "@/assets/bike-routes/bike-trail-g3.jpg";

// Image source: Wikimedia Commons (CC BY-SA) - authentic Obersulzbachtal photography

const article: InfoArticle = {
  id: "hohe-tauern-bike-trail-et12",
  topic: "cycling",
  icon: Bike,
  gradient: "from-primary to-mountain-blue",
  coverImage: cover,
  gallery: [
    { url: g1, caption: { de: "Hinteres Obersulzbachtal mit Großvenediger-Massiv", en: "Inner Obersulzbach valley with Großvenediger massif" } },
    { url: g2, caption: { de: "Blick ins Obersulzbachtal von der Postalm", en: "View into the Obersulzbach valley from the Postalm" } },
    { url: g3, caption: { de: "Schiedhofalm im Obersulzbachtal", en: "Schiedhofalm in the Obersulzbach valley" } },
  ],
  title: { de: "Hohe Tauern Bike Trail – Etappe 12", en: "Hohe Tauern Bike Trail – Stage 12" },
  subtitle: { de: "Anspruchsvolle MTB-Etappe direkt ab Neukirchen", en: "Challenging MTB stage starting right in Neukirchen" },
  shortDescription: {
    de: "Offizielle Etappe des Hohe Tauern Bike Trails: von Neukirchen durchs wilde Obersulzbachtal nach Wald im Pinzgau – sportliches MTB-Highlight.",
    en: "Official stage of the Hohe Tauern Bike Trail: from Neukirchen through the wild Obersulzbach Valley to Wald im Pinzgau – a sporty MTB highlight.",
  },
  stats: [
    { label: { de: "Länge", en: "Length" }, value: { de: "ca. 30 km", en: "approx. 30 km" } },
    { label: { de: "Höhenmeter", en: "Elevation" }, value: { de: "ca. 900 hm", en: "approx. 900 m" } },
    { label: { de: "Dauer", en: "Duration" }, value: { de: "ca. 4–5 h", en: "approx. 4–5 h" } },
    { label: { de: "Schwierigkeit", en: "Difficulty" }, value: { de: "schwer", en: "Difficult" } },
  ],
  sections: [
    {
      heading: { de: "Streckenverlauf", en: "Route" },
      body: {
        de: "Start in Neukirchen, hinein ins Obersulzbachtal mit Blick auf die Sulzbachfälle und den Großvenediger. Über Forstwege und Singletrails geht es weiter über den Hohbichl bis nach Wald im Pinzgau – Teil der mehrtägigen Hohe Tauern Bike Trail-Runde.",
        en: "Start in Neukirchen and head into the Obersulzbach Valley with views of the Sulzbach waterfalls and the Großvenediger. Forest roads and single trails continue over the Hohbichl pass to Wald im Pinzgau – part of the multi-day Hohe Tauern Bike Trail loop.",
      },
    },
    {
      heading: { de: "Highlights", en: "Highlights" },
      bullets: [
        { de: "Spektakuläre Aussichten ins Venedigergebirge", en: "Spectacular views into the Venediger massif" },
        { de: "Mix aus Forstwegen und schönen Trails", en: "Mix of forest roads and enjoyable trails" },
        { de: "Einkehrmöglichkeiten auf den bewirtschafteten Almen", en: "Refreshment stops at managed alpine huts" },
        { de: "Verbindbar mit Anschlussetappen für Mehrtagestouren", en: "Can be combined with adjoining stages for multi-day tours" },
      ],
    },
    {
      heading: { de: "Gut zu wissen", en: "Good to know" },
      body: {
        de: "Gute Grundkondition und MTB-Fahrtechnik nötig. Helm Pflicht. Beste Zeit Juni bis Anfang Oktober – vorher Bedingungen prüfen, einzelne Abschnitte können nach Schneefällen geschlossen sein.",
        en: "Good fitness and MTB skills required. Helmet mandatory. Best from June to early October – check conditions in advance, some sections may be closed after snowfall.",
      },
    },
  ],
  externalUrl: "https://www.sentres.com/de/tour/mountainbike/hohe-tauern-bike-trail-et12-neukirchen-obersulzbachtal-wald-im/809246624/",
  sourceLabel: "hohe-tauern-bike-trail",
};

export default article;
