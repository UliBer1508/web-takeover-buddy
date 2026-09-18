import {
  Mountain, Sparkles, Snowflake, Heart, Bed, Bath, UtensilsCrossed, Waves,
  Flame, TreePine, Sun, Sprout, Wifi, Car, Zap, Shirt, Tv, Dog, Baby,
  Ruler, Users, KeyRound, MapPin, Coffee, Sofa, Wind, LucideIcon,
} from "lucide-react";

/**
 * Auswahlliste der Symbole fuer Highlights und Ausstattung. Der Schluessel
 * steht in house_features.icon, das Label erscheint im Admin-Dialog.
 * Neue Symbole hier ergaenzen - die Datenbank muss dafuer nicht geaendert
 * werden.
 */
export const FEATURE_ICONS: { key: string; label: string; icon: LucideIcon }[] = [
  { key: "sparkles",  label: "Sterne",         icon: Sparkles },
  { key: "mountain",  label: "Berg",           icon: Mountain },
  { key: "snowflake", label: "Schneeflocke",   icon: Snowflake },
  { key: "heart",     label: "Herz",           icon: Heart },
  { key: "bed",       label: "Bett",           icon: Bed },
  { key: "bath",      label: "Bad",            icon: Bath },
  { key: "kitchen",   label: "Küche",          icon: UtensilsCrossed },
  { key: "sauna",     label: "Sauna",          icon: Waves },
  { key: "fire",      label: "Kamin",          icon: Flame },
  { key: "terrace",   label: "Terrasse",       icon: TreePine },
  { key: "sun",       label: "Balkon / Sonne", icon: Sun },
  { key: "garden",    label: "Garten",         icon: Sprout },
  { key: "wifi",      label: "WLAN",           icon: Wifi },
  { key: "parking",   label: "Parkplatz",      icon: Car },
  { key: "charger",   label: "Wallbox",        icon: Zap },
  { key: "laundry",   label: "Waschmaschine",  icon: Shirt },
  { key: "tv",        label: "Fernseher",      icon: Tv },
  { key: "pets",      label: "Haustiere",      icon: Dog },
  { key: "family",    label: "Familie",        icon: Baby },
  { key: "size",      label: "Größe",          icon: Ruler },
  { key: "guests",    label: "Gäste",          icon: Users },
  { key: "checkin",   label: "Check-in",       icon: KeyRound },
  { key: "location",  label: "Lage",           icon: MapPin },
  { key: "coffee",    label: "Frühstück",      icon: Coffee },
  { key: "living",    label: "Wohnbereich",    icon: Sofa },
  { key: "air",       label: "Frische Luft",   icon: Wind },
];

const KARTE = new Map(FEATURE_ICONS.map(e => [e.key, e.icon]));

/** Symbol zu einem Schluessel. Unbekannte Schluessel bekommen Sterne. */
export const featureIcon = (key: string | null | undefined): LucideIcon =>
  (key && KARTE.get(key)) || Sparkles;
