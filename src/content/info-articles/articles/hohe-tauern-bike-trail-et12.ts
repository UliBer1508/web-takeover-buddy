import { Bike } from "lucide-react";
import type { InfoArticle } from "../types";

const UNSPLASH = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const article: InfoArticle = {
  id: "hohe-tauern-bike-trail-et12",
  topic: "cycling",
  icon: Bike,
  gradient: "from-primary to-mountain-blue",
  coverImage: UNSPLASH("photo-1505705694340-019e1e335916", 1600),
  gallery: [
    { url: UNSPLASH("photo-1541625602330-2277a4c46182"), caption: { de: "Sportliche MTB-Etappe ab Neukirchen", en: "Sporty MTB stage starting in Neukirchen" } },
    { url: UNSPLASH("photo-1502082553048-f009c37129b9"), caption: { de: "Trail durch lichten Bergwald", en: "Trail through bright mountain forest" } },
    { url: UNSPLASH("photo-1506905925346-21bda4d32df4"), caption: { de: "Wilder Sulzbach im Obersulzbachtal", en: "Wild Sulzbach river in the Obersulzbach Valley" } },
    { url: UNSPLASH("photo-1464822759023-fed622ff2c3b"), caption: { de: "Etappenziel Wald im Pinzgau", en: "Stage destination Wald im Pinzgau" } },
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
