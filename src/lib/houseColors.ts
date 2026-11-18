// Eine Farbe je Haus. Die Reihenfolge folgt sort_order aus der houses-Tabelle,
// damit Umschalter, Kalenderpunkte und Admin-Liste immer dieselbe Farbe
// fuer dasselbe Haus zeigen. Vierter Eintrag ist Reserve fuer weitere Haeuser.
// Seit 18.11.2026 aus der Farbwelt „Blattgrün“: Waldgrün, Steinblau, Ziegelrot, Reserve Violett.
export const HOUSE_COLORS = ["#2f6b3a", "#3c6e8f", "#b5532f", "#7c3aed"] as const;

export const houseColor = (index: number): string =>
  HOUSE_COLORS[index % HOUSE_COLORS.length];
