# Session 18.11.2026 (Teil 3) — Wohnen auf Zeit: Anfragen und Angebote in die Hausverwaltung

## Anlass

Uli: „In der Hausverwaltung haben wir das Anfrage-Management eingebaut, warum benutzen wir das
nicht?“ Befund beim Lesen der Hausverwaltung: Dort gibt es den Tab **Mieter** (Dauermiete) mit
Verträgen, Mietzahlungen, Mieterhöhungen und Betriebskosten (AT/DE), Venediger Chalet steht dort
schon auf `rental_type = long_term`. Das Anfrage-Management (`booking_inquiries`) ist dagegen auf
Urlaubsbuchungen gebaut (Check-in/Check-out, „Annehmen“ erzeugt eine Buchung, Max
`accept_booking_inquiry`). Entscheidung: **eigene Mietinteressenten-Tabellen in der
Hausverwaltung**, Website schreibt/liest nur noch dorthin.

## Was sich auf der Website ändert

| Datei | Änderung |
|---|---|
| `src/components/LongTermRental.tsx` | Mietanfrage → `externalSupabase` → Hausverwaltung `rental_inquiries`, `house_id = external_house_id` |
| `src/pages/Angebot.tsx` | liest/antwortet über `externalSupabase.rpc("get_rental_offer" / "respond_rental_offer")` |
| `src/lib/euro.ts` (neu) | Euro-Format (vorher in `longTermCalc.ts`) |
| `src/components/AdminHousesPanel.tsx` | Knöpfe „Mietanfragen“ und „Kalkulation“ entfernt |
| `src/pages/Index.tsx`, `de.json`, `en.json` | Unterzeile Titelbild nennt „Wohnen auf Zeit“ (`hero.brandSubtitleBoth` / `…LongTerm`) |
| **gelöscht** | `src/components/LongTermInquiriesDialog.tsx`, `LongTermCalculationDialog.tsx`, `LongTermOfferDialog.tsx`, `src/lib/longTermCalc.ts` |
| `supabase/migrations/20261118c_wohnen_auf_zeit_umzug_hausverwaltung.sql` | löscht die kurzzeitig angelegten Website-Tabellen (bricht ab, wenn noch Zeilen da sind) |
| `docs/WEBSITE-MASTER.md` | 2.3, 3.4e (ersetzt 3.4e/g/h), 5f, 6, 7, 9, 10 |

## Hausverwaltung (Repo hausmanagement-selfhosted)

Siehe dort `docs/Konzept-Wohnen-auf-Zeit.md`. SQL 72 ist bereits live angewendet.

## Prüfung

- SQL 72 lokal (PostgreSQL 16) und live: anon liest nichts, darf nur Anfragen mit Status `new`
  anlegen; Entwurf per Token unsichtbar; Admin-Aufruf zählt nicht als geöffnet; Rückfrage, Annahme,
  zweite Annahme → `not_found`.
- Website: `vite build` ok, `tsc` 10 Fehler vorher/nachher. Browser-Test mit Testdaten: Mietanfrage
  geht an die Hausverwaltung (nicht mehr an die Website-DB), Angebotsseite zeigt das Angebot aus der
  Hausverwaltung, Unterzeile „Ferienhäuser und Wohnen auf Zeit …“. Keine JS-Fehler.
- Hausverwaltung: `vite build` ok, `tsc` 178 Fehler vorher/nachher (alle bekannt). Oberfläche
  der Hausverwaltung nicht im Browser getestet (Anmeldung nötig) — die Dialoge sind die gleichen,
  die auf der Website im Browser geprüft wurden, nur mit anderen Tabellennamen.

## Einspielen

1. Hausverwaltung: SQL 72 ist schon angewendet. ZIP `Hausverwaltung-Wohnen-auf-Zeit.zip` in
   einem Commit ins Repo `hausmanagement-selfhosted`.
2. Website: ZIP `Website-Umzug-Hausverwaltung.zip` in einem Commit ins Repo `web-takeover-buddy`
   **und** die vier Dateien oben unter „gelöscht“ in GitHub löschen (sonst bleiben sie als toter
   Code liegen; die Seite läuft auch mit ihnen).
3. Danach in der Website-DB `20261118c_…sql` ausführen.
