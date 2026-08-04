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

## Anfahrtsseite

`/anfahrt` (deutsch) und `/directions` (englisch) führen auf dieselbe
Komponente `src/pages/Anfahrt.tsx`. Die Adresse ist zum Weitergeben an Gäste
gedacht (Airbnb, Booking).

**Hintergrund:** Google ordnet die Adresssuche „Venedigersiedlung 316“ einem
Nachbargebäude zu. Deshalb werden überall **Koordinaten** verwendet:

```
47.249878, 12.254109      Plus Code: 67X3+XJ5
```

Diese Werte stehen als Konstanten oben in `Anfahrt.tsx` und zusätzlich in
`src/pages/Index.tsx` (strukturierte Daten für Suchmaschinen). Bei einer
Änderung **beide** Stellen anpassen.

**Keine eingebettete Karte.** Ein Google-Maps-iframe würde Daten an Google
übertragen und Cookies setzen; `src/pages/Datenschutz.tsx` deckt das nicht ab.
Stattdessen ein statisches Bild (`public/anfahrt-karte.jpg`) und Buttons, die
die Navigations-App des Gastes öffnen.

Bilder: `public/chalet-anfahrt.jpg` (Hausfoto zur Wiedererkennung) und
`public/anfahrt-karte.jpg` (Kartenausschnitt mit eingezeichnetem Weg).
Alle Texte liegen in `src/i18n/locales/{de,en}.json` unter `directions`.

---

## Navigation

Die Leiste ist auf der Startseite über dem Hero-Bild transparent und wird ab
50 px Scroll deckend. **Auf Unterseiten ist sie immer deckend** — sonst stünde
weiße Schrift auf hellem Grund (`istStartseite` in `Navigation.tsx`).

Menülinks mit `id` scrollen zu einem Abschnitt der Startseite, Links mit `path`
wechseln die Seite. Von einer Unterseite aus wird bei `id`-Links zuerst zur
Startseite navigiert (`/#abschnitt`). Alles läuft über `handleNavClick()` —
**kein direkter `scrollToSection`-Aufruf**, sonst funktionieren Links auf
Unterseiten nicht.

Die `<Link>`-Elemente im Footer scrollen beim Klick nach oben; React Router
behält sonst die Scroll-Position und man landet auf der neuen Seite wieder am
Fußende.

---

## Edge Function

`supabase/functions/translate-review` — übersetzt Gästebewertungen.
Deployment über die Supabase CLI, unabhängig vom Website-Build.

---

## Historie

Das Projekt entstand ursprünglich mit Lovable. Am 04.08.2026 wurde die
Verbindung gelöst und das Hosting auf Vercel umgestellt; die Domain zeigt
seitdem nicht mehr auf Lovables Edge-IP. Das alte Lovable-Projekt bleibt
als Sicherung unter `web-takeover-buddy.lovable.app` bestehen, wird aber
nicht mehr gepflegt.

In `src/main.tsx` steht weiterhin eine Prüfung auf Lovable-Hostnamen. Sie
verhindert, dass sich dort ein Service Worker registriert, und bleibt
absichtlich erhalten, solange die Sicherung existiert.
