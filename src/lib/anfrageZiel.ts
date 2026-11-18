import { useTranslation } from "react-i18next";
import { SelectableHouse } from "@/hooks/useHouseSelection";

/**
 * Wohin „Jetzt buchen“ / „Buchen“ (Menü, Footer) führt und wie der Knopf heißt
 * (Wunsch Uli, 18.11.2026: „Jetzt buchen“ ging ins Leere, wenn kein Haus direkt buchbar ist).
 *
 *  - Mindestens ein Haus ist im Urlaub DIREKT buchbar  → „Jetzt buchen“ → #booking
 *  - sonst, mindestens ein Haus bietet Wohnen auf Zeit → „Anfrage senden“ → #wohnen-auf-zeit
 *  - sonst (nur Plattform, z. B. Belvilla)            → „Buchen“ → #booking (Plattform-Hinweis)
 *
 * Geklickt wird über ein Ereignis an die Startseite (Index.tsx): Die wählt bei Bedarf ein
 * passendes Haus aus (der Abschnitt gibt es nur für das gewählte Haus) und scrollt dann.
 */
export type AnfrageZielId = "booking" | "wohnen-auf-zeit";

export const ZIEL_EREIGNIS = "steinbock:anfrage-ziel";

export const anfrageZiel = (houses: SelectableHouse[]): AnfrageZielId => {
  if (houses.some(h => h.offer_short_term && h.direct_booking !== false)) return "booking";
  if (houses.some(h => h.offer_long_term)) return "wohnen-auf-zeit";
  return "booking";
};

export const useAnfrageBeschriftung = (houses: SelectableHouse[]) => {
  const { t } = useTranslation();
  const ziel = anfrageZiel(houses);
  const direkt = houses.some(h => h.offer_short_term && h.direct_booking !== false);
  return {
    ziel,
    /** großer Knopf oben rechts */
    knopf: direkt || ziel === "booking" ? t("navigation.bookNow") : t("navigation.requestNow"),
    /** Menüpunkt */
    menue: direkt || ziel === "booking" ? t("navigation.booking") : t("navigation.request"),
  };
};

/** Startseite: Ziel ansteuern (Index.tsx hört auf das Ereignis). */
export const zumAnfrageZiel = (ziel: AnfrageZielId) => {
  window.dispatchEvent(new CustomEvent(ZIEL_EREIGNIS, { detail: ziel }));
};
