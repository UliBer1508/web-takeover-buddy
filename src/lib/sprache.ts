import { useTranslation } from "react-i18next";

export type Sprache = "de" | "en";

/** Aktuelle Sprache der Website: "en" oder "de". */
export const useSprache = (): Sprache => {
  const { i18n } = useTranslation();
  return i18n.language?.startsWith("en") ? "en" : "de";
};

/**
 * Text aus der Datenbank in der gewuenschten Sprache. Ist die englische
 * Fassung leer, gilt die deutsche - so erscheint nie ein leeres Feld.
 */
export const lokal = (
  de: string | null | undefined,
  en: string | null | undefined,
  sprache: Sprache
): string | null => {
  const wert = sprache === "en" && en?.trim() ? en : de;
  return wert?.trim() ? wert : null;
};

/** Wie lokal(), fuer Listen (z. B. Merkmale). */
export const lokalListe = (
  de: string[] | null | undefined,
  en: string[] | null | undefined,
  sprache: Sprache
): string[] => {
  const sauber = (l: string[] | null | undefined) => (l || []).map(s => s?.trim()).filter(Boolean) as string[];
  const d = sauber(de), e = sauber(en);
  return sprache === "en" && e.length > 0 ? e : d;
};
