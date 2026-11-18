# Session 18.11.2026 — Wohnen auf Zeit (Schritt 1 + 2)

## Anlass

Das Haus Venedigersiedlung 316 darf nicht mehr kurzzeitig touristisch vermietet werden
(Verfahren der Gemeinde Neukirchen). Die Website bekommt deshalb eine zweite
Vermietungsart **„Wohnen auf Zeit“**: möbliert, ab 6 Monaten, mit Anmeldung bei der Gemeinde.
Sie soll für jedes Haus wählbar sein (Venediger, Wald, spätere Häuser).

Vorbild für den Ablauf war Mr. Lodge (München): ab 6 Monaten, Besichtigung vor Ort oder per Video,
Entscheidung durch den Vermieter, Vertrag, Kaution vor Einzug, Übergabe mit Protokoll.

## Entscheidungen Uli (18.11.2026)

1. **Beide Vermietungsarten wählbar**, je Haus in den Admin-Einstellungen; Venediger und Wald
   bekommen beide Optionen.
2. **Keine Preise auf der Website.** Der Preis wird intern berechnet und festgelegt. Ablauf:
   Interessent fragt an → Besichtigung oder Videogespräch → bei Interesse Preise und Konditionen
   **nur an diesen Kunden**, und nur mit Ulis Zustimmung.
3. **Ab 6 Monaten.** Formulierung **„Anmeldung bei der Gemeinde notwendig“** (statt „Hauptwohnsitz“).
4. **Umschalter „Urlaub | Wohnen auf Zeit“** über den Hauskarten — ein/aus in den Admin-Einstellungen.
5. **Schrittweise umsetzen:** Schritt 1 (Vermietungsarten) und 2 (Darstellung ohne Preise) zuerst,
   ansehen, dann Schritt 3 (interne Kalkulation + persönliches Angebot).

## Umsetzung Schritt 1 + 2

### Datenbank (`supabase/migrations/20261118_wohnen_auf_zeit.sql`, Website-DB `wlmdjljyzdwvpqefwdmy`)

| Änderung | Zweck |
|---|---|
| `houses.offer_short_term` (default `true`) | Vermietungsart Urlaub — alle Häuser bleiben wie bisher |
| `houses.offer_long_term` (default `false`) | Vermietungsart Wohnen auf Zeit — wird nirgends eingeschaltet |
| Tabelle `house_long_term` | öffentliche Angaben je Haus **ohne Preise**: Mindest-/Höchstdauer, frei ab, Anmeldung Gemeinde, Einleitung, „Inklusive“ (de/en). Startzeile je Haus. |
| Tabelle `long_term_inquiries` | Mietanfragen. Gäste dürfen nur anlegen, nicht lesen. |
| Tabelle `site_settings` (eine Zeile) | `show_mode_switch` (aus) |

Das Skript schaltet **nichts** ein. Nach dem Ausführen sieht die Website genauso aus wie vorher.

### Code

| Datei | Änderung |
|---|---|
| `src/hooks/useLongTerm.ts` (neu) | `useHouseLongTerm`, `useSiteSettings`, Typ `Mietart` |
| `src/hooks/useHouseSelection.ts` | lädt `offer_short_term/offer_long_term`; `abPreis()` = `null` ohne Urlaub |
| `src/components/LongTermRental.tsx` (neu) | Abschnitt `#wohnen-auf-zeit` mit Angaben, Ablauf, Mietanfrage |
| `src/components/RentalModeSwitch.tsx` (neu) | Umschalter „Urlaub \| Wohnen auf Zeit“ |
| `src/components/ChaletCards.tsx` | Hinweis „Wohnen auf Zeit“, kein Preis im Langzeitmodus, auch einzelne Karte mit Umschalter |
| `src/pages/Index.tsx` | Vermietungsart-Logik: Umschalter, Kartenfilter, Kalender/Anfrage nur bei Urlaub, Abschnitt Wohnen auf Zeit |
| `src/components/HouseBookingInfoDialog.tsx` | Admin „Vermietung“: zwei Schalter Vermietungsarten + Felder Wohnen auf Zeit; Urlaubsteil wie bisher |
| `src/components/SiteSettingsDialog.tsx` (neu) | Admin „Einstellungen“: Umschalter ein/aus |
| `src/components/LongTermInquiriesDialog.tsx` (neu) | Admin „Mietanfragen“: Liste, Status setzen |
| `src/components/AdminHousesPanel.tsx` | Knöpfe „Mietanfragen (n neu)“ und „Einstellungen“; Statuszeile je Haus zeigt die Vermietungsarten |
| `src/i18n/locales/de.json`, `en.json` | `longTerm.*`, `modeSwitch.*`, `chalets.longTerm` |

Details zu Verhalten und Datenmodell: WEBSITE-MASTER 3.4d–f und 5f.

### Prüfung

- `npx vite build`: erfolgreich.
- `npx tsc --noEmit -p tsconfig.app.json`: 10 Fehler vorher, 10 nachher (alle bekannt, veraltete
  `types.ts`, siehe WEBSITE-MASTER 8). Keine neuen Fehler.
- Darstellung mit Testdaten im Browser geprüft (PC 1366 px, Handy 390 px): Umschalter, Hauskarten
  mit „Wohnen auf Zeit“ ohne Preis, Abschnitt mit Angaben, Ablauf und Formular.

## Einspielen (Reihenfolge!)

1. SQL `20261118_wohnen_auf_zeit.sql` im SQL-Editor von **wlmdjljyzdwvpqefwdmy** ausführen,
   Kontrollabfragen am Ende prüfen (alle Häuser: Urlaub an, Wohnen auf Zeit aus).
2. **Danach** alle Dateien aus dem Paket in **einem** Commit hochladen. Ohne SQL schlägt das Laden
   der Häuser fehl (neue Spalten), und die Startseite bleibt leer.
3. Im Admin unter „Vermietung“ je Haus einstellen, unter „Einstellungen“ den Umschalter.

## Offen / nächste Schritte

- **Schritt 3:** interne Preiskalkulation je Haus (nur Admin lesbar) und persönliches Angebot
  per Link nach der Besichtigung.
- Mietanfragen gehen noch **nicht** an die Hausverwaltung und lösen **keine** Benachrichtigung aus.
  Vor einer Anbindung prüfen, wie Max Anfragen verarbeitet.
- Menü „Buchen“ zeigt auf `#booking`, das im reinen Langzeitmodus fehlt.
- Eigene Seite `/wohnen-auf-zeit`, SEO, strukturierte Daten.
- Rechtlich (Uli): mit der Gemeinde klären, dass möblierte Vermietung ab 6 Monaten mit Anmeldung
  für Venedigersiedlung 316 zulässig ist; Mietvertrag prüfen lassen.
