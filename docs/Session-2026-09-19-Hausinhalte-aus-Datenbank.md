# Session 2026-09-19 — Hausinhalte nur noch aus der Datenbank

> Zweck: Nachvollziehbarkeit für künftige Sitzungen (Mensch oder KI).
> Überblick und aktueller Stand: `docs/WEBSITE-MASTER.md` — **zuerst lesen**.

---

## 1. Auslöser

Beim Wald Chalet zeigte die Website unter „Ausstattung“ die Karten
„3 Schlafzimmer, Gourmet-Küche, Wellness & Sauna, Terrasse & Garten,
High-Speed WLAN, Parkplätze“, der Einstellungsdialog „Highlights & Ausstattung
— Wald Chalet“ war aber leer („Noch nichts eingetragen — solange hier nichts
steht, zeigt die Website die allgemeinen Texte“).

Ursache: `About.tsx` und `Features.tsx` hatten einen **Rückfall auf feste
Texte** aus `src/i18n/locales/de.json` (`about.highlights.*`,
`features.items.*`), sobald ein Haus keine eigenen `house_features` hatte. Die
angezeigten Karten standen also im Code, nicht in der Datenbank — und damit
auch nicht im Dialog.

## 2. Verlauf der Entscheidung (drei Anläufe)

1. **Erster Ansatz (verworfen):** feste Texte nur beim Venediger-Haus zeigen,
   beim Wald nichts. → Uli: Texte auch bei Wald behalten, aber änderbar.
2. **Zweiter Ansatz (verworfen):** feste Texte für alle Häuser, im Dialog
   vorbefüllt, beim Speichern in die DB übernommen. → Uli: nein.
3. **Umgesetzt — Vorgabe Uli:** *„Es werden keine Werte wie Ausstattung hart
   codiert, alles geht in die Datenbank und wird daraus gelesen. Für beide
   Häuser werden die Werte voreingetragen — die, die bei Wald angezeigt
   werden. Ich ändere diese dann.“*

Die ersten beiden Ansätze gingen **nie live** (Push in dieser Sitzung nicht
möglich, Dateien wurden durch Stand 3 ersetzt).

## 3. Code-Änderungen

| Datei (`src/components/`) | Vorher | Nachher |
|---|---|---|
| `About.tsx` | Beschreibung: bei leerem `houses.description` die festen Absätze `about.description1/2`. Highlights: bei fehlenden `house_features` die vier festen Kacheln | Beschreibung **nur** aus `houses.description`; Highlight-Kacheln **nur** aus `house_features` (`section='highlight'`), ohne Einträge entfällt das Raster |
| `Features.tsx` | bei fehlenden `house_features` sechs feste Karten | **nur** `house_features` (`section='feature'`); ohne Einträge entfällt der ganze Abschnitt |
| `HouseFeaturesDialog.tsx` | Hinweistext „zeigt die allgemeinen Texte“ | Hinweis „die Website zeigt hier für dieses Haus nichts an“; lädt und speichert unverändert nur `house_features` |
| `Stats.tsx` | Kennzahlen blieben auf **0** stehen | zählen hoch (siehe 3.1) |

Unverändert: `useHouseFeatures.ts`, `featureIcons.ts`, Datenmodell.
Die i18n-Texte bleiben in `de.json`/`en.json` stehen, werden aber nicht mehr
benutzt (offener Punkt in `WEBSITE-MASTER.md`).

### 3.1 Fehler Kennzahlen-Leiste (Stats.tsx)

Symptom: braune Leiste mit „0 Schlafzimmer · 0 Gäste · 0 Quadratmeter“,
obwohl die Werte in `houses` stehen (sonst wäre die Leiste gar nicht
erschienen — sie blendet sich ohne Werte aus).

Ursache: Der `IntersectionObserver`, der das Hochzählen startet, wurde in einem
`useEffect` mit leerer Abhängigkeitsliste eingerichtet — also beim ersten
Rendern. Zu diesem Zeitpunkt waren die Hausdaten noch nicht geladen, die
Komponente gab `null` zurück, `sectionRef.current` war leer, und der Beobachter
beobachtete nichts. Sobald die Daten kamen, erschien die Leiste, aber
`isVisible` wurde nie `true` → dauerhaft „0“.

Lösung: `hatWerte = stats.length > 0`; der Effekt hängt von `hatWerte` ab und
setzt erst an, wenn die Leiste im DOM steht.

### 3.2 Prüfung

- `npx vite build` → erfolgreich.
- `npx tsc --noEmit -p tsconfig.app.json` → 10 Fehler vor und nach der
  Änderung (alle aus den veralteten `types.ts`, siehe `WEBSITE-MASTER.md` 8).
  Keine neuen Fehler.
- Live-Prüfung im Browser: **noch offen**, erst nach dem Hochladen möglich.

## 4. Datenbank

### 4.1 Startwerte eintragen — `supabase/migrations/20260919_hausdaten_voreintragen.sql`

Im SQL-Editor von `wlmdjljyzdwvpqefwdmy` ausgeführt (19.09.2026, 07:06).
Trägt für **jedes Haus** ein, **nur wo noch nichts steht**:

- `houses.description`: die zwei bisherigen Absätze (enthalten noch
  „das Steinbock Chalet“ → je Haus anpassen)
- Highlights (4): Bergpanorama · Luxusausstattung · Wellness · Wohlfühloase
- Ausstattung (6): 3 Schlafzimmer · Gourmet-Küche · Wellness & Sauna ·
  Terrasse & Garten · High-Speed WLAN · Parkplätze

Ergebnis der Kontrollabfrage:

| name | section | anzahl |
|---|---|---|
| Venedigersiedlung Chalet | feature | 1 |
| Venedigersiedlung Chalet | highlight | 4 |
| Wald Chalet | feature | 6 |
| Wald Chalet | highlight | 4 |

Das Venediger-Haus hatte schon vorher Einträge und wurde deshalb
**übersprungen**:
- 4 Highlights = die eigenen vom 18.09.2026 („Private Sauna“, „Kaminofen“,
  „Panoramaterrasse“, „Gletscherblick“)
- 1 Ausstattungseintrag unbekannten Inhalts (vermutlich ein früheres Speichern
  im Dialog)

### 4.2 Angleichen — Venediger exakt wie Wald

Damit beide Häuser dieselben Startwerte haben, übernimmt dieses SQL alle
`house_features` des Wald Chalets für das Venedigersiedlung Chalet und
**ersetzt** dessen bisherige Einträge. Vorher Schritt 1 ausführen und die
eigenen Einträge notieren, falls sie behalten werden sollen.

```sql
-- Schritt 1: ansehen
select f.section, f.sort_order, f.icon, f.title, f.description
from public.house_features f
join public.houses h on h.id = f.house_id
where h.name = 'Venedigersiedlung Chalet'
order by f.section, f.sort_order;

-- Schritt 2: ersetzen
begin;
delete from public.house_features
where house_id = (select id from public.houses where name = 'Venedigersiedlung Chalet');
insert into public.house_features (house_id, section, icon, title, description, sort_order)
select (select id from public.houses where name = 'Venedigersiedlung Chalet'),
       f.section, f.icon, f.title, f.description, f.sort_order
from public.house_features f
where f.house_id = (select id from public.houses where name = 'Wald Chalet');
commit;
```

**Stand bei Abschluss der Doku:** Ob Schritt 2 ausgeführt wurde, ist nicht
bestätigt. Erwartetes Ergebnis danach: beide Häuser 4 Highlights und
6 Ausstattungseinträge.

## 5. Reihenfolge beim Ausrollen

1. SQL 4.1 im SQL-Editor (erledigt), ggf. 4.2.
2. Dann die Dateien in **einem** Commit hochladen:
   - `src/components/About.tsx`
   - `src/components/Features.tsx`
   - `src/components/HouseFeaturesDialog.tsx`
   - `src/components/Stats.tsx`
   - `supabase/migrations/20260919_hausdaten_voreintragen.sql` (nur Dokumentation)
   - `docs/…` (diese Doku)
3. Nach dem Vercel-Build prüfen: beide Häuser zeigen Beschreibung, Kacheln,
   Ausstattung, Kennzahlen zählen hoch; Dialog zeigt dieselben Einträge wie die
   Website.

## 6. Lehren

- **„Rückfall auf feste Texte“ widerspricht dem Grundsatz „alles aus der DB“.**
  Er täuscht Inhalte vor, die im Admin nicht auftauchen. Fehlt ein Wert, wird
  der Block weggelassen.
- **Vor dem Bauen die Doku und den Vortag lesen.** Der Grundsatz „alle Werte
  in der DB“ stand bereits am 18.09.2026 fest; die ersten beiden Anläufe
  hätten nicht entstehen müssen.
- **„Nur wo leer“ ist kein Angleichen.** Soll jedes Haus dieselben Werte
  haben, muss das SQL vorhandene Einträge ausdrücklich ersetzen — und vorher
  zeigen, was ersetzt wird.
- **Nicht über Namen/IDs einzelne Häuser sonderbehandeln.** Der erste Ansatz
  erkannte das Venediger-Haus an einer ID aus der alten DB bzw. am Namen —
  fragil und gegen die Vorgabe.

---

## 7. Nachtrag: Anfahrt je Haus

**Befund:** Die Anfahrtsseite (seit 04.08.2026) stand komplett im Code und
kannte nur das Venedigersiedlung Chalet — Verstoß gegen den Grundsatz „alles aus
der DB“. In der Erstfassung dieser Doku war sie fälschlich als „bekannte Ausnahme“
geführt.

**Entscheidungen Uli:**
- Ablauf „Mischform“: eigener Link je Haus `/anfahrt/<slug>` (für Gäste nach der
  Buchung, auch über Belvilla), `/anfahrt` = Auswahl, Umschalter auf der Seite.
- Ausgeblendete Häuser zeigen keine Infos, auch keine Anfahrt.
- Wald wird nicht ausgeblendet, sondern „nicht direkt buchbar“ (Belvilla) —
  Konzept in `WEBSITE-MASTER.md` 5a, Umsetzung als nächster Schritt.

**Umgesetzt:** Tabelle `house_directions` (SQL `20260919_anfahrt_je_haus.sql`),
`pages/Anfahrt.tsx` liest nur noch aus der DB, Admin-Dialog „Anfahrt“ und Knopf
„Gäste-Link“, Link „Anfahrt“ im Hausbereich, Routen `/anfahrt/:slug` und
`/directions/:slug`, Beschriftungen `directions.address/noData/chooseHouse/
houseNotFound/toDirections` in de/en. Venediger-Werte per SQL übernommen,
Wald leer.

**Prüfung:** `vite build` ok, `tsc` unverändert 10 bekannte Fehler.
Live-Prüfung nach dem Hochladen offen.

**Achtung Slug:** Venediger hat den Slug `haupthaus` → Gäste-Link heißt
`/anfahrt/haupthaus`. Soll er sprechender werden, im Admin unter „Texte & Daten“
ändern, **bevor** Links an Gäste gehen.

**Nicht mehr benutzt:** i18n-Schlüssel `directions.step1–4`, `byCarText`,
`parkingText`, `airportText`, `trainStationText`, `winterText`, `warningTitle`,
`warningText`, `metaTitle`, `metaDescription`, `imageAlt`, `mapAlt`, `mapCaption`
(Inhalte jetzt in der DB). Dateien `public/chalet-anfahrt.jpg` und
`public/anfahrt-karte.jpg` bleiben, weil die Venediger-Zeile auf sie verweist.

---

## 8. Nachtrag: Vermietung über Belvilla

**Vorgabe Uli:** Wald wird nicht ausgeblendet. Stattdessen je Haus ein zweiter
Schalter „direkt buchbar“. Aus = Kalender bleibt, Preise weg, statt Anfrageformular
ein Hinweis, dass das Haus über Belvilla vermietet wird, mit den Plattformen, auf
denen Belvilla es anbietet. Nur Wald nutzt das; Venediger vermietet Uli selbst.

**Recherche:** Wald = Belvilla-Objekt **100015656** „Chalet in Wald nahe Wildkogel
Ski Arena“ (6 Gäste, 3 SZ, 100 m², Sauna). Gefunden auf Belvilla, Vrbo (8842832ha),
Traum-Ferienwohnungen (240927, Name dort „Susan Peter“ — ungeklärt), Gites.fr,
Booking.com vermutlich als „Chalet Trattenbach“ (nur über Weiterverkäufer).
Plattformliste laut partner.belvilla.de.

**Umgesetzt:** SQL `20260919_vermietung_ueber_plattform.sql`; neu
`hooks/useHouseBookingInfo.ts`, `components/ExternalBookingInfo.tsx`,
`components/HouseBookingInfoDialog.tsx`; geändert `useHouseSelection.ts`
(`direct_booking`, `abPreis`), `BookingForm.tsx` (Hinweis statt Formular/Preisen),
`AdminHousesPanel.tsx` (Knopf „Vermietung“, Statuszeile).

**Achtung:** `useHouseSelection` liest `direct_booking` — Code erst NACH dem SQL
hochladen, sonst lädt die Seite keine Häuser.

**Prüfung:** `vite build` ok, `tsc` unverändert 10 bekannte Fehler.

---

## 9. Nachtrag: alle Texte zweisprachig

**Auslöser:** Bei gewählter englischer Sprache blieben Beschreibung und
Highlights deutsch. **Vorgabe Uli:** Alle Texte müssen auf Deutsch und Englisch
anzeigbar sein.

**Befund:** DB-Inhalte `houses` (Beschreibung, Kurztext, Merkmale) und
`house_features` (Highlights, Ausstattung) hatten nur eine Sprachspalte.
16 benutzte i18n-Schlüssel fehlten in beiden Sprachdateien (Hauskarten,
Titelbild-Untertitel, Menü, App-Hinweis) → englische Seite zeigte die deutschen
Standardtexte. Fehlermeldungen des Anfrageformulars und einige Beschriftungen
standen fest auf Deutsch im Code.

**Umgesetzt:**
- SQL `20260919_texte_englisch.sql`: `_en`-Spalten + englische Startwerte für
  die bekannten Texte (nur wo leer); Kontrollabfrage listet, was noch fehlt.
- `src/lib/sprache.ts` (`useSprache`, `lokal`, `lokalListe`).
- Anzeige: `About.tsx`, `Features.tsx`, `ChaletCards.tsx`, `useHouseSelection.ts`,
  `useHouseFeatures.ts`.
- Admin: Englisch-Felder in `HouseFormDialog.tsx` und `HouseFeaturesDialog.tsx`,
  `AdminHousesPanel.tsx` reicht sie durch.
- i18n: fehlende Schlüssel ergänzt; Formular-Fehlermeldungen, „auf Anfrage“,
  Hinweistexte, aria-Beschriftungen (`BookingForm`, `Hero`, `Navigation`,
  `HouseSelector`, `Gallery`, `AvailabilityCalendar`) übersetzt;
  `stats.rating` „Booking Bewertung“ → „Gästebewertung“ (die Note stammt aus den
  eigenen Bewertungen, nicht von Booking).

**Prüfung:** `vite build` ok, `tsc` unverändert 10 bekannte Fehler; Schlüssel
in `de.json` und `en.json` identisch.

## 10. Nachtrag: „In der Nähe“ (Umgebungskarte)

**Anlass:** Uli zeigte die Umgebungskarte von Belvilla (Kategorien mit Häkchen,
Karte mit farbigen Markern). Entscheidung: OpenStreetMap statt Google, dieselben
Kategorien, Platz im Hausbereich unter „Ausstattung“, danach Skigebiet-Karten.

**Umgesetzt:**
- SQL `20260919_in_der_naehe.sql`: Tabelle `house_places` (je Haus und Ort eine
  Zeile, Kategorie aus fester Liste, Koordinaten, Hinweis de/en, Link, `osm_id`) + RLS.
  Entfernung wird nicht gespeichert, sondern aus den Anfahrt-Koordinaten gerechnet.
- `src/lib/placeCategories.ts` (Kategorien: Symbol, Farbe, OSM-Filter, Radius;
  Entfernung, Formatierung), `src/hooks/useHousePlaces.ts`.
- Website: `src/components/NearbyPlaces.tsx` in `Index.tsx` nach `Features`.
  Karte (Leaflet + OSM-Kacheln) lädt erst nach Klick auf „Karte anzeigen“.
- Admin: Knopf „Umgebung“ → `src/components/HousePlacesDialog.tsx`; Vorschläge
  per Overpass-API aus dem Browser, prüfen, übernehmen, ergänzen, speichern.
- i18n `nearby.*` (Titel, Knopf, Hinweise, 12 Kategorien) de/en;
  Datenschutzerklärung: neuer Abschnitt „Karte (OpenStreetMap)“ (`Datenschutz.tsx`,
  `legal.privacy.mapTitle/mapText`).
- `package.json`/`package-lock.json`: `leaflet`, `@types/leaflet`. Die Lockfile
  war veraltet (enthielt noch `lovable-tagger`, es fehlten `tsx` und
  `react-helmet-async`) und ist jetzt neu erzeugt.

**Prüfung:** `vite build` ok, `tsc` unverändert 10 bekannte Fehler. Browser-Test mit
nachgestellten DB-Antworten: Abschnitt erscheint, Häkchen filtern Liste und Karte,
Karte zeigt Haus- und Ortsmarker, Entfernungen stimmen (Beispiel 150 m / 640 m / 5,7 km).
Echte OSM-Abfrage aus der Sandbox nicht möglich (gesperrt) → erster echter Test
durch Uli im Admin.

**Offen:** Datenschutz-Abschnitt „Hosting“ nennt noch Lovable Cloud (Master 9, Nr. 13).
