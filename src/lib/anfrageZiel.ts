import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { SelectableHouse } from "@/hooks/useHouseSelection";

/**
 * Wohin „Jetzt buchen“ / „Buchen“ (Menü, Footer) führt und wie der Knopf heißt
 * (Wunsch Uli, 18.11.2026: „Jetzt buchen“ ging ins Leere, wenn kein Haus direkt buchbar ist).
 *
 * Auf der Startseite zählt das GEWÄHLTE Haus und die gewählte Vermietungsart:
 *  - Urlaubsbereich sichtbar, direkt buchbar           → „Jetzt buchen“ → #booking
 *  - Urlaubsbereich sichtbar, über Plattform (Belvilla) → „Buchungsanfrage“ → #booking (Plattform-Hinweis)
 *  - nur „Wohnen auf Zeit“ sichtbar                     → „Anfrage senden“ → #wohnen-auf-zeit
 * Ohne Startseiten-Kontext (Unterseiten) entscheiden alle Häuser:
 *  - Mindestens ein Haus ist im Urlaub DIREKT buchbar  → „Jetzt buchen“ → #booking
 *  - sonst, mindestens ein Haus bietet Wohnen auf Zeit → „Anfrage senden“ → #wohnen-auf-zeit
 *  - sonst (nur Plattform, z. B. Belvilla)            → „Buchungsanfrage“ → #booking (Plattform-Hinweis)
 *
 * Geklickt wird über ein Ereignis an die Startseite (Index.tsx): Die wählt bei Bedarf ein
 * passendes Haus aus (der Abschnitt gibt es nur für das gewählte Haus) und scrollt dann.
 */
export type AnfrageZielId = "booking" | "wohnen-auf-zeit";

export const ZIEL_EREIGNIS = "steinbock:anfrage-ziel";

/**
 * Was die Startseite gerade zeigt (gewähltes Haus + sichtbare Bereiche). Index.tsx meldet es
 * über setStartseitenKontext(); Navigation und Footer richten den Knopf danach aus
 * (Uli, 18.11.2026: beim Wald Chalet unter „Urlaub“ muss es zur Buchungsanfrage mit dem
 * Belvilla-Hinweis gehen, nicht zu „Wohnen auf Zeit“ eines anderen Hauses).
 * Ohne Kontext (Unterseiten, Seite lädt noch) gilt die Regel über alle Häuser.
 */
export interface StartseitenKontext {
  kurz: boolean;        // Urlaubsbereich (Kalender + Anfrage/Plattform) sichtbar
  lang: boolean;        // Abschnitt „Wohnen auf Zeit“ sichtbar
  direkt: boolean;      // gewähltes Haus im Urlaub direkt buchbar
}
let kontext: StartseitenKontext | null = null;
const hoerer = new Set<() => void>();
export const setStartseitenKontext = (k: StartseitenKontext | null) => {
  if (JSON.stringify(k) === JSON.stringify(kontext)) return;
  kontext = k;
  hoerer.forEach(f => f());
};
const useStartseitenKontext = () =>
  useSyncExternalStore(
    f => { hoerer.add(f); return () => { hoerer.delete(f); }; },
    () => kontext,
    () => null,
  );

export const anfrageZiel = (houses: SelectableHouse[], k: StartseitenKontext | null = null): AnfrageZielId => {
  if (k && (k.kurz || k.lang)) return k.kurz ? "booking" : "wohnen-auf-zeit";
  if (houses.some(h => h.offer_short_term && h.direct_booking !== false)) return "booking";
  if (houses.some(h => h.offer_long_term)) return "wohnen-auf-zeit";
  return "booking";
};

export const useAnfrageBeschriftung = (houses: SelectableHouse[]) => {
  const { t } = useTranslation();
  const k = useStartseitenKontext();
  const ziel = anfrageZiel(houses, k);
  const direkt = k && (k.kurz || k.lang)
    ? k.kurz && k.direkt
    : houses.some(h => h.offer_short_term && h.direct_booking !== false);
  if (ziel === "wohnen-auf-zeit") {
    return { ziel, knopf: t("navigation.requestNow"), menue: t("navigation.request") };
  }
  return {
    ziel,
    /** großer Knopf oben rechts: direkt buchbar → „Jetzt buchen“, sonst (Plattform) → „Buchungsanfrage“ */
    knopf: direkt ? t("navigation.bookNow") : t("navigation.bookingRequest"),
    /** Menüpunkt */
    menue: t("navigation.booking"),
  };
};

/** Startseite: Ziel ansteuern (Index.tsx hört auf das Ereignis). */
export const zumAnfrageZiel = (ziel: AnfrageZielId) => {
  window.dispatchEvent(new CustomEvent(ZIEL_EREIGNIS, { detail: ziel }));
};
