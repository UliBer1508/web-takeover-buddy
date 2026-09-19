import {
  Croissant, Coffee, ShoppingCart, Stethoscope, Hospital, Pill, UtensilsCrossed,
  Flower2, CableCar, Bus, Fuel, PlugZap, LucideIcon,
} from "lucide-react";

/**
 * Kategorien fuer "In der Naehe". Die Liste ist Struktur (Symbol, Farbe,
 * OpenStreetMap-Abfrage) - die Beschriftung steht zweisprachig in i18n unter
 * nearby.categories.<key>. Die Orte selbst liegen in public.house_places.
 * Neue Kategorie: hier ergaenzen UND im Check-Constraint von house_places.
 */
export interface PlaceCategory {
  key: string;
  icon: LucideIcon;
  color: string;
  /** Overpass-Filter (ohne Umkreis), je Eintrag eine Abfragezeile */
  osm: string[];
  /** Suchradius in Metern fuer die Vorschlaege */
  radius: number;
}

export const PLACE_CATEGORIES: PlaceCategory[] = [
  { key: "supermarket", icon: ShoppingCart,    color: "#d4a017", osm: ['nwr[shop~"^(supermarket|convenience)$"]'], radius: 15000 },
  { key: "bakery",      icon: Croissant,       color: "#a8457a", osm: ['nwr[shop=bakery]'], radius: 15000 },
  { key: "restaurant",  icon: UtensilsCrossed, color: "#7a4a1e", osm: ['nwr[amenity~"^(restaurant|fast_food)$"]'], radius: 8000 },
  { key: "cafe",        icon: Coffee,          color: "#333333", osm: ['nwr[amenity~"^(cafe|bar|pub)$"]'], radius: 8000 },
  { key: "doctor",      icon: Stethoscope,     color: "#e0443a", osm: ['nwr[amenity~"^(doctors|clinic)$"]', 'nwr[healthcare=doctor]'], radius: 20000 },
  { key: "hospital",    icon: Hospital,        color: "#3a8fd6", osm: ['nwr[amenity=hospital]'], radius: 45000 },
  { key: "pharmacy",    icon: Pill,            color: "#5aa832", osm: ['nwr[amenity=pharmacy]'], radius: 20000 },
  { key: "spa",         icon: Flower2,         color: "#16928f", osm: ['nwr[leisure~"^(spa|sauna|water_park)$"]', 'nwr[amenity=public_bath]'], radius: 25000 },
  { key: "ski_lift",    icon: CableCar,        color: "#2b5fb3", osm: ['node[aerialway=station][name]'], radius: 20000 },
  { key: "bus_stop",    icon: Bus,             color: "#6b6b6b", osm: ['node[highway=bus_stop]'], radius: 2000 },
  { key: "fuel",        icon: Fuel,            color: "#b35a1f", osm: ['nwr[amenity=fuel]'], radius: 15000 },
  { key: "ev_charging", icon: PlugZap,         color: "#2f8f4e", osm: ['nwr[amenity=charging_station]'], radius: 15000 },
];

const KARTE = new Map(PLACE_CATEGORIES.map(k => [k.key, k]));
export const placeCategory = (key: string): PlaceCategory | undefined => KARTE.get(key);

/** Luftlinie in km (Haversine). */
export const entfernungKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const r = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(a));
};

export const formatKm = (km: number, sprache: "de" | "en"): string =>
  km < 1
    ? `${Math.round(km * 1000 / 10) * 10} m`
    : `${km.toLocaleString(sprache === "en" ? "en-GB" : "de-DE", { maximumFractionDigits: 1 })} km`;
