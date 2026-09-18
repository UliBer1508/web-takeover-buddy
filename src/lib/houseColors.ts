// Eine Farbe je Haus. Die Reihenfolge folgt sort_order aus der houses-Tabelle,
// damit Umschalter, Kalenderpunkte und Admin-Liste immer dieselbe Farbe
// fuer dasselbe Haus zeigen. Vierter Eintrag ist Reserve fuer weitere Haeuser.
export const HOUSE_COLORS = ["#b45309", "#0891b2", "#7c3aed", "#be123c"] as const;

export const houseColor = (index: number): string =>
  HOUSE_COLORS[index % HOUSE_COLORS.length];
