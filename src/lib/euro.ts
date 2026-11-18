/** Betrag in Euro, deutsch (de-AT) oder englisch formatiert. */
export const euro = (wert: number, sprache: "de" | "en" = "de") =>
  new Intl.NumberFormat(sprache === "en" ? "en-IE" : "de-AT", {
    style: "currency", currency: "EUR", maximumFractionDigits: 2, minimumFractionDigits: 0,
  }).format(wert);
