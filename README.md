# Steinbock Chalets — Website

Öffentliche Website unter **[steinbockchalets.com](https://steinbockchalets.com)**.
Zeigt die Ferienhäuser, einen Verfügbarkeitskalender und nimmt
Buchungsanfragen entgegen.

---

## Technik

| | |
|---|---|
| Aufbau | Vite · React · TypeScript · Tailwind · shadcn/ui |
| Datenbank | Supabase (eigene Instanz, **nicht** die der Hausverwaltung) |
| Hosting | Vercel — baut automatisch bei jedem Commit auf `main` |
| PWA | `vite-plugin-pwa`, Service Worker nur im Produktionsbuild aktiv |

---

## Entwicklung

```sh
npm install
npm run dev
```

Läuft auf Port 8080. Vor `dev` und `build` erzeugt ein Vorschritt
(`scripts/generate-sitemap.ts`) die Datei `public/sitemap.xml`.

Zwei Umgebungsvariablen sind nötig — Vorlage in `.env.example`:

```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Die Datei `.env` gehört **nicht** ins Repository. In Vercel stehen die
Werte unter *Settings → Environment Variables*.

---

## Veröffentlichen

Jeder Commit auf `main` löst bei Vercel einen Build aus und geht nach
wenigen Sekunden live. Es ist kein weiterer Schritt nötig.

Ein Commit auf einen anderen Branch erzeugt eine Vorschau-Adresse, ohne
die Live-Seite zu berühren.

---

## Buchungsanfragen

Das Formular (`src/components/BookingForm.tsx`) **löst keine Zahlung aus**.
Beim Absenden passieren genau zwei Dinge:

1. Eintrag in `booking_inquiries` der **Website-Datenbank**
2. Eintrag in `booking_inquiries` der **Hausverwaltungs-Datenbank** —
   nur wenn beim Haus `external_house_id` gesetzt ist. Fehlt sie, wird das
   protokolliert und der Gast erhält den Hinweis, sich bei ausbleibender
   Antwort zusätzlich per E-Mail zu melden.

Der angezeigte Preis stammt aus `calculatePriceBreakdown()` und den
**website-eigenen** Hausdaten (`price_winter` / `price_summer` /
`price_offseason`). Die dynamische Preis-Engine der Hausverwaltung ist daran
nicht beteiligt — die Preise können daher voneinander abweichen.

Die Stripe-Zahlungsaufforderung entsteht **erst in der Hausverwaltung**,
nachdem aus der Anfrage eine Buchung geworden ist. Details in
`hausmanagement-selfhosted/docs/CODE-INDEX.md`, Abschnitt 11b.

---

## Edge Function

`supabase/functions/translate-review` — übersetzt Gästebewertungen.
Deployment über die Supabase CLI, unabhängig vom Website-Build.

---

## Historie

Das Projekt entstand ursprünglich mit Lovable. Im August 2026 wurde die
Verbindung gelöst und das Hosting auf Vercel umgestellt; die Domain zeigt
seitdem nicht mehr auf Lovables Edge-IP. Das alte Lovable-Projekt bleibt
als Sicherung unter `web-takeover-buddy.lovable.app` bestehen, wird aber
nicht mehr gepflegt.

In `src/main.tsx` steht weiterhin eine Prüfung auf Lovable-Hostnamen. Sie
verhindert, dass sich dort ein Service Worker registriert, und bleibt
absichtlich erhalten, solange die Sicherung existiert.
