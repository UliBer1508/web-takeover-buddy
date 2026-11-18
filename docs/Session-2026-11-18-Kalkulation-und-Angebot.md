# Session 18.11.2026 (Teil 2) — Wohnen auf Zeit: Kalkulation und Angebot (Schritt 3 + 4)

Fortsetzung von `Session-2026-11-18-Wohnen-auf-Zeit.md` (Schritt 1 + 2 sind live).

## Vorgabe Uli

„Wir rechnen intern den notwendigen Preis, veröffentlichen ihn aber nur mit meiner Zustimmung:
Kunde ist interessiert → Besichtigung oder Videokonferenz → bei Interesse Preise und Konditionen
an diesen Kunden.“

Offene Detailfragen wurden mit Standardwerten entschieden (jederzeit änderbar):
- Kostenarten wie vorgeschlagen **plus AfA** und **frei benennbare weitere Posten** (mit Häkchen „zählt zu
  den Nebenkosten“).
- Angebot als **persönlicher Link** (kein PDF).
- **Max / Hausverwaltung bleiben unberührt.**

## Ablauf für Uli

1. **Kalkulation** je Haus einmal ausfüllen (Admin → Haus → „Kalkulation“, nur bei Häusern mit
   Wohnen auf Zeit). Rechts erscheint sofort der Vorschlag: Grundmiete, Nebenkosten, Gesamt, Kaution.
2. Mietanfrage kommt rein → Admin → „Mietanfragen“ → Kunde kontaktieren, Status setzen
   (kontaktiert / Besichtigung).
3. Nach der Besichtigung: **„Angebot erstellen“**. Werte sind aus der Kalkulation und der Anfrage
   vorbelegt, alles änderbar. **„Als Entwurf speichern“** → der Kunde sieht nichts.
4. **„Freigeben“** → Link `steinbockchalets.com/angebot/<code>` wird kopiert; Knopf „E-Mail“ öffnet
   eine fertige Mail (Deutsch oder Englisch je nach Sprache des Angebots).
5. Kunde öffnet den Link → Status „vom Kunden geöffnet“. Er kann **annehmen** oder eine
   **Rückfrage** stellen. Im Admin steht dann „Mietanfragen (1 Antwort)“, die Nachricht steht im Angebot.
6. „Zurückziehen“ macht den Link wirkungslos. Ein angenommenes Angebot ist gesperrt; danach
   Mietvertrag außerhalb der Website, Anfrage auf „erledigt“ setzen.

## Rechenweg (`src/lib/longTermCalc.ts`)

```
Kosten/Jahr         = Fixkosten + Energie + Rücklagen/Betrieb + weitere Posten
vermietete Monate   = 12 − Leerstand
Gesamt/Monat (roh)  = (Kosten/Jahr + Gewinnziel) / vermietete Monate
Nebenkosten/Monat   = NK-Posten/Jahr / 12                     → aufrunden auf 5 €
Grundmiete/Monat    = Gesamt (roh) − Nebenkosten/Monat         → aufrunden auf 10 €
Kaution             = Kaution-Monate × (Grundmiete + NK)       → aufrunden auf 10 €
```
NK-Posten: Kanal/Müll/Wasser, Internet/TV, Strom, Heizung, weitere Posten mit Häkchen „NK“.
Beispiel (Test): Kosten 17.530 €/Jahr, Gewinnziel 6.000 €, 1 Monat Leerstand, NK 3.980 €/Jahr →
Grundmiete 1.810 €, NK 335 €, gesamt 2.145 €/Monat, Kaution 4.290 €.

## Sicherheit / Datenschutz

- `long_term_calculation` und `long_term_offers`: RLS **nur Admins**. Es gibt keine öffentliche Policy.
- Kunden kommen nur über `get_long_term_offer(token)` an **ihr** Angebot, und nur wenn es freigegeben
  ist. Token: 64 Zeichen Zufall (2 × UUID v4) — nicht erratbar.
- Antworten nur über `respond_long_term_offer(...)`; Annehmen nur bis „gültig bis“.
- Seite `/angebot/...` hat `noindex, nofollow`.
- Ruft Uli (eingeloggt) den Link auf, zählt das nicht als „vom Kunden geöffnet“.

## Dateien

| Datei | |
|---|---|
| `supabase/migrations/20261118b_wohnen_auf_zeit_kalkulation_angebot.sql` | neu: Tabellen, RLS, 2 Funktionen, Startzeile Kalkulation je Haus |
| `src/lib/longTermCalc.ts` | neu: Kostenposten, Rechenweg, Euro-Format |
| `src/components/LongTermCalculationDialog.tsx` | neu: Admin „Kalkulation“ |
| `src/components/LongTermOfferDialog.tsx` | neu: Admin „Angebot“ (Entwurf, Freigabe, Link, Zurückziehen) |
| `src/components/LongTermInquiriesDialog.tsx` | Angebots-Status je Anfrage, Knopf „Angebot erstellen/öffnen“, `useLongTermOffers` |
| `src/components/AdminHousesPanel.tsx` | Knopf „Kalkulation“ je Haus, Zähler „Antworten“ |
| `src/pages/Angebot.tsx` | neu: Kundenseite |
| `src/App.tsx` | Routen `/angebot/:token`, `/offer/:token` |
| `src/i18n/locales/de.json`, `en.json` | `offer.*` |
| `docs/WEBSITE-MASTER.md` | 3.4g, 3.4h, 5f, 6, 7, 9, 10 |

## Prüfung

- SQL lokal mit PostgreSQL 16 (Rollen anon/authenticated, `is_admin()` nachgebildet): zweimal
  ausgeführt (wiederholbar); anon sieht weder Anfragen noch Kalkulation noch Angebote; Entwurf per
  Token unsichtbar; Freigabe → Kunde sieht es, Status „viewed“; Admin-Aufruf zählt nicht; Rückfrage → ok;
  Annehmen → ok; zweites Annehmen → not_found; falscher Token → not_found; abgelaufen → expired;
  Rückfrage bleibt nach Annahme ohne Text erhalten.
- `npx vite build` erfolgreich; `tsc`: 10 Fehler vorher, 10 nachher (bekannt, WEBSITE-MASTER 8).
- Ganzer Ablauf im Browser mit Testdaten: Kalkulation → Speichern → Mietanfragen → Angebot erstellen
  → Freigeben → Kundenseite (Handy) → Annehmen → Admin zeigt „1 Antwort“. Keine JS-Fehler.

## Einspielen

1. SQL `20261118b_wohnen_auf_zeit_kalkulation_angebot.sql` im SQL-Editor von **wlmdjljyzdwvpqefwdmy**
   (Konto steinbockchalets@gmail.com, oben links „steinbockchalets-webseite“). **Nicht** in der
   Hausverwaltung. Kontrolle am Ende: je Haus eine Kalkulationszeile, 0 Angebote.
2. Danach alle Dateien in **einem** Commit hochladen.
3. Nach dem Deploy ggf. Strg + Umschalt + R (Service Worker).

## Offen

- Keine Benachrichtigung bei neuer Anfrage oder Antwort (nur Admin-Zähler). Möglich später:
  E-Mail über eine Supabase Edge Function oder über die Hausverwaltung/Max.
- Mietvertrag (Vorlage/PDF) ist nicht Teil der Website.
- Eigene Seite `/wohnen-auf-zeit`, SEO, Menü „Buchen“ im reinen Langzeitmodus.
