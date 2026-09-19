# steinbockchalets.com — Master-Dokumentation der Website

> **Pflichtlektüre vor jeder Arbeit an der Website.** Wer (Mensch oder KI) an
> diesem Repo etwas ändert, eine Aussage über den Code trifft oder SQL
> schreibt, liest zuerst dieses Dokument und danach die Session-Dokumente in
> `docs/`. Grund: Am 18.09.2026 ging über eine Stunde verloren, weil nirgends
> stand, welche Datenbank die Website benutzt.
>
> **Stand:** 19.09.2026 · **Repo:** github.com/UliBer1508/web-takeover-buddy ·
> **Live:** https://steinbockchalets.com

**Lesereihenfolge**

1. Dieses Dokument (Überblick, Infrastruktur, Datenmodell, Regeln)
2. `docs/Session-2026-09-18-Datenbank-Umzug-und-zwei-Haeuser.md` (wie die
   eigene Datenbank entstand, Zwei-Häuser-Umbau)
3. `docs/Session-2026-09-19-Hausinhalte-aus-Datenbank.md` (Beschreibung,
   Highlights, Ausstattung nur noch aus der DB; Kennzahlen-Leiste)
4. Für das Gesamtsystem (Hausverwaltung, Max, Portale):
   `hausmanagement-selfhosted/docs/Steinbock-Chalets-Gesamtdokumentation-MASTER.md`
   sowie dort `PROJEKT-REGELN.md` und `ARBEITSWEISE-CLAUDE-LESSONS.md`.
   Die dortigen Arbeitsregeln (erst lesen, dann reden; echter Compiler-Lauf;
   Doku im selben Schritt pflegen) gelten hier genauso.

---

## 1. Überblick

Öffentliche Website von Steinbock Chalets mit zwei Häusern:

| Haus | `houses.name` | `houses.slug` | Ort | Kalender-ID in der Hausverwaltung (`external_house_id`) |
|---|---|---|---|---|
| Venediger | Venedigersiedlung Chalet | `haupthaus` | Neukirchen am Großvenediger | `f5b4588b-96cf-46f7-b84a-5f6750f7088e` |
| Wald | Wald Chalet | `wald-chalet` | Wald im Pinzgau | `a2b4d1f7-f396-40a5-b83f-174ccafa55fd` |

> Achtung: `supabase/migrations/20260918_zwei_haeuser.sql` legt Wald mit dem
> Slug `wald` an. Tatsächlich wurde Wald über das Admin-Panel mit dem Slug
> `wald-chalet` angelegt (Abfrage vom 18.09.2026). Im Code nie auf einen Slug
> oder Namen verlassen — immer über `houses.id`.

Beide Häuser werden **gleich dargestellt**, jedes mit **eigenen Daten** aus der
Datenbank. Gäste wählen oben ein Haus; alles darunter (Beschreibung,
Kennzahlen, Ausstattung, Galerie, Kalender, Anfrage) bezieht sich auf das
gewählte Haus.

Das Wald Chalet wird derzeit ausschließlich über Belvilla vermietet. Es wird
auf der Website erst dauerhaft freigeschaltet, wenn es nicht mehr allein über
Belvilla laufen soll (Schalter im Admin-Panel).

---

## 2. Infrastruktur

### 2.1 Hosting und Deploy

- **Vercel**, Projekt `web-takeover-buddy`, Framework Vite, Build
  `npm run build`, Ausgabe `dist`.
- **Jeder Commit auf `main` geht sofort live.** Es gibt keine Staging-Umgebung.
- Uli lädt Dateien über GitHub → *Add file → Upload files* hoch. **Zusammen
  gehörende Dateien immer in EINEM Commit hochladen**, sonst ist die Seite
  zwischen zwei Commits in einem halben Zustand.
- Wenn eine Änderung Datenbank-Spalten oder -Tabellen braucht: **zuerst das
  SQL ausführen, dann den Code hochladen.**
- Domain bei IONOS: `A @ → 216.198.79.1`, `CNAME www → Vercel`, `www` leitet
  per 308 auf die Hauptdomain um (Details: `docs/Session-2026-08-04-…`).

### 2.2 Umgebungsvariablen (Vercel → Settings → Environment Variables)

| Variable | Wert | Hinweis |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://wlmdjljyzdwvpqefwdmy.supabase.co` | maßgeblich |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | anon-Key des Projekts `wlmdjljyzdwvpqefwdmy` | öffentlich, landet im Browser |
| `VITE_SUPABASE_PROJECT_ID` | `wlmdjljyzdwvpqefwdmy` | wird im Code **nicht** gelesen |

- Die Werte sind in Vercel als *Secret* gespeichert und lassen sich dort nicht
  mehr anzeigen. Die tatsächlich benutzte Datenbank zeigt die Browser-Konsole
  auf steinbockchalets.com:
  ```js
  performance.getEntriesByType('resource').map(e=>e.name).filter(n=>n.includes('supabase')).join('\n')
  ```
  Erwartet: `wlmdjljyzdwvpqefwdmy` (Website) und `usblrulkcgucxtkhugck`
  (Kalender/Anfragen der Hausverwaltung).
- `VITE_`-Variablen werden **beim Build** eingebaut. Nach einer Änderung in
  Vercel: *Deployments → Redeploy* (ohne Build-Cache). Neu laden reicht nicht.

### 2.3 Zwei Datenbanken — nicht verwechseln

| | Website-Datenbank | Hausverwaltung |
|---|---|---|
| Supabase-Ref | **`wlmdjljyzdwvpqefwdmy`** | `usblrulkcgucxtkhugck` |
| Projektname | `steinbockchalets-webseite` | `supabase-ferienhausmanagement2` |
| Supabase-Konto | **steinbockchalets@gmail.com** | uli.berresheim@hotmail.de (Organisation über Vercel Marketplace) |
| Organisation | „steinbockchalets webseite“ | über Vercel Marketplace verwaltet |
| Region | West EU (Irland) | Central EU (Frankfurt) |
| Tarif / Backups | Free, **keine Backups** | Free, **keine Backups** |
| Code-Zugriff | `src/integrations/supabase/client.ts` (`supabase`), über Vercel-Variablen | `src/integrations/external-supabase/client.ts` (`externalSupabase`), URL und anon-Key **fest im Code** |
| Was die Website dort tut | alles: Häuser, Texte, Bilder, Bewertungen, Aktionen, Anfragen, Login/Admin | **liest** Belegung (`public_availability`), **schreibt** Buchungsanfragen (`booking_inquiries`) |
| SQL-Editor | https://supabase.com/dashboard/project/wlmdjljyzdwvpqefwdmy/sql/new | https://supabase.com/dashboard/project/usblrulkcgucxtkhugck/sql/new |

**Stillgelegt:** `xcohqbdgzprkixeycdhk` — die ursprüngliche Lovable-Cloud-
Datenbank. Kein Zugang (liegt in keiner Supabase-Organisation von Uli, das
Lovable-Projekt existiert nicht mehr). Sie wurde beim Umzug nicht angefasst und
wird nicht mehr benutzt. `supabase/config.toml` im Repo zeigt noch auf sie —
siehe offene Punkte.

---

## 3. Datenmodell der Website-Datenbank (`wlmdjljyzdwvpqefwdmy`)

Neun Tabellen aus dem Umzug plus `house_features` (neu am 18.09.2026).
Generierte Typen: `src/integrations/supabase/types.ts` — **veraltet**, kennt
`house_features` und die neuen `houses`-Spalten nicht (daher die
TypeScript-Warnungen, siehe Abschnitt 8).

### 3.1 `houses` — ein Datensatz je Haus

| Spalte | Bedeutung | gepflegt im Admin unter |
|---|---|---|
| `id` (uuid) | Primärschlüssel; Venediger hat historisch `00000000-0000-0000-0000-000000000001` | — |
| `name`, `slug` | Anzeigename, Kürzel | Texte & Daten |
| `location` | Ort (über der Beschreibung) | Texte & Daten |
| `short_description` | Kurztext auf der Hauskarte | Texte & Daten |
| `description` | Beschreibung; Leerzeile = neuer Absatz | Texte & Daten |
| `highlights` (text[]) | kurze Merkmale auf der Hauskarte (ChaletCards) | Texte & Daten |
| `bedrooms`, `bathrooms`, `square_meters` | Kennzahlen | Texte & Daten |
| `max_guests` | Maximalbelegung (Kennzahl + Anfrageformular) | Texte & Daten |
| `external_house_id` | ID des Hauses in der Hausverwaltung (Kalender + Anfragen) | Texte & Daten |
| `is_active` | für Gäste sichtbar | Schalter im Admin-Panel |
| `direct_booking` | direkt über die Website buchbar (seit 19.09.2026, Standard `true`) | Vermietung |
| `sort_order` | Reihenfolge; bestimmt auch die Hausfarbe | Texte & Daten |
| `price_winter`, `price_summer`, `price_offseason`, `min_nights`, `cleaning_fee`, `service_fee`, `bed_linen_fee`, `tourist_tax`, `check_in_time`, `check_out_time` | Preise und Gebühren | Preise |

### 3.1a Zweisprachigkeit (seit 19.09.2026)

**Regel: Jeder Text, den Gäste sehen, gibt es auf Deutsch und Englisch.**
- Oberfläche (Knöpfe, Überschriften, Fehlermeldungen): `src/i18n/locales/de.json` + `en.json`,
  beide Dateien haben dieselben Schlüssel. Kein deutscher Text direkt im Code.
- Inhalte aus der DB: je Feld eine `_en`-Spalte bzw. `_de`/`_en`-Paar. Leeres Englisch →
  die englische Seite zeigt Deutsch (`lokal()` in `src/lib/sprache.ts`).

| Tabelle | zweisprachige Felder |
|---|---|
| `houses` | `description`/`description_en`, `short_description`/`short_description_en`, `highlights`/`highlights_en` |
| `house_features` | `title`/`title_en`, `description`/`description_en` |
| `house_directions` | alle Textfelder `_de`/`_en` (Adresse einsprachig) |
| `house_booking_info` | `title_de/_en`, `text_de/_en` |
| `gallery_images` | `title`/`title_en` |
| `promotions` | `description_de`/`description_en` |
| `reviews` | `text`/`text_en` |
| `categories`, `seasons` | feste Liste, Übersetzung über i18n `gallery.categories.*`/`gallery.seasons.*` |

Nicht übersetzt (Eigennamen): Hausname, Ort, Plattformnamen, Marke „Steinbock Chalets“.
Admin-Oberfläche ist nur Deutsch (nur Uli).

### 3.2 `house_features` — Highlights und Ausstattung je Haus

```
id uuid pk · house_id uuid → houses(id) on delete cascade
section text check in ('highlight','feature')
icon text default 'sparkles' · title text not null · description text
sort_order int default 0 · created_at timestamptz
Index (house_id, section, sort_order)
RLS: lesen für alle (anon, authenticated); schreiben nur is_admin()
```

- `section = 'highlight'`: die Kacheln unter der Hausbeschreibung (vier wirken am besten)
- `section = 'feature'`: die Karten im Abschnitt „Ausstattung & Highlights“
- `icon` ist ein Schlüssel aus `src/lib/featureIcons.ts` (z. B. `mountain`,
  `sauna`, `wifi`). Unbekannte Schlüssel werden als Sterne angezeigt. Neue
  Symbole nur dort ergänzen — die Datenbank muss dafür nicht geändert werden.
- Texte nur auf Deutsch; es gibt keine englischen Spalten. Die englische
  Seite zeigt dieselben deutschen Texte.

### 3.3 `house_directions` — Anfahrt je Haus (seit 19.09.2026)

```
house_id uuid pk → houses(id) on delete cascade
address · latitude numeric(9,6) · longitude numeric(9,6) · plus_code
warning_title_de/_en · warning_text_de/_en · steps_de/_en text[]
parking_de/_en · by_car_de/_en · airport_de/_en · train_station_de/_en
winter_de/_en · house_image_url · map_image_url · map_caption_de/_en · updated_at
RLS: lesen nur für sichtbare Häuser (exists houses.is_active); Admins lesen/schreiben alles
```

- Eine Zeile je Haus, gepflegt im Admin unter **„Anfahrt“** (`HouseDirectionsDialog.tsx`).
- Leeres englisches Feld → die englische Seite zeigt den deutschen Text.
- Leere Felder werden auf der Anfahrtsseite weggelassen. Ohne Koordinaten keine Maps-Knöpfe.
- Bilder werden in den Bucket `gallery` unter `anfahrt/` hochgeladen.
- Startwerte (SQL `20260919_anfahrt_je_haus.sql`): Venediger mit den bisherigen
  Angaben (erkannt über `external_house_id`), **Wald bewusst leer**.

### 3.4 `house_booking_info` — Hinweis „wird über Plattform vermietet“ (seit 19.09.2026)

```
house_id uuid pk → houses(id) on delete cascade
title_de/_en · text_de/_en · main_label · main_url
platforms jsonb  [{ "name": "...", "url": "..." | null }]   · updated_at
RLS: lesen nur für sichtbare Häuser; Admins lesen/schreiben alles
```

Wirkt nur, wenn `houses.direct_booking = false`. Gepflegt im Admin unter **„Vermietung“**
(`HouseBookingInfoDialog.tsx`), dort auch der Schalter.

### 3.4a `house_places` — „In der Nähe“ (seit 19.09.2026)

```
id uuid pk · house_id → houses(id) on delete cascade
category text  check in ('bakery','cafe','supermarket','doctor','hospital','pharmacy',
                         'restaurant','spa','ski_lift','bus_stop','fuel','ev_charging')
name text · latitude/longitude numeric(9,6) not null
note_de/_en · url · osm_id ('node/123', unique je Haus) · sort_order · created_at
RLS: lesen nur für sichtbare Häuser; Admins lesen/schreiben alles
```

- **Entfernung wird nicht gespeichert.** Die Website rechnet sie (Luftlinie, Haversine)
  aus den Hauskoordinaten in `house_directions.latitude/longitude` und den Koordinaten
  des Orts. Fehlen die Hauskoordinaten, gibt es keine Entfernung und keine Karte, nur die Liste.
- **Kategorien** sind eine feste Liste im Code (`src/lib/placeCategories.ts`: Symbol,
  Farbe, OSM-Suchfilter, Suchradius). Beschriftung de/en in i18n `nearby.categories.*`.
  Neue Kategorie = Eintrag dort + i18n + `check` in der Tabelle erweitern.
- Gepflegt im Admin unter **„Umgebung“** (`HousePlacesDialog.tsx`).

### 3.5 Weitere Tabellen

| Tabelle | Inhalt |
|---|---|
| `gallery_images` | Bilder je Haus (`house_id`, `url`, `is_hero`, `category_id`, `season_id`, `sort_order`, `title`, `title_en`). Titelbild ist je Haus eindeutig. |
| `categories`, `seasons` | Galerie-Kategorien und Jahreszeiten |
| `reviews` | Gästebewertungen (`house_id`, `rating`, `is_visible`, …) |
| `promotions` | Aktionsbanner / Rabatte |
| `booking_inquiries`, `booking_statuses` | Anfragen, die über die Website eingehen (lokale Kopie) |
| `user_roles` | Admin-Rechte (`user_id`, `role = 'admin'`) |

**Storage:** öffentlicher Bucket `gallery` (lesen für alle, schreiben nur Admins).
Die Adressen in `gallery_images.url` zeigen auf `wlmdjljyzdwvpqefwdmy`.

**Rechte (RLS):** Lesen öffentlich; Schreiben (insert/update/delete) nur, wenn
`public.is_admin()` wahr ist. Die Funktion prüft `user_roles`. In der alten
Lovable-Datenbank fehlte das INSERT-Recht für Admins — daran scheiterte das
Anlegen des Wald Chalets, und das war der Anlass für den Umzug.

**Login:** Supabase Auth im Projekt `wlmdjljyzdwvpqefwdmy`. Der Admin-Nutzer
wurde beim Umzug neu angelegt; das alte Login galt nur in der alten Datenbank.

---

## 4. Grundsatz: keine fest codierten Hausinhalte

**Vorgabe von Uli (19.09.2026):** Beschreibung, Highlights, Ausstattung und
Kennzahlen stehen **nicht im Code**. Alles liegt je Haus in der Datenbank und
wird von dort gelesen. Beide Häuser starten mit denselben Werten; Uli ändert sie
danach je Haus im Admin.

Folgen für den Code:

- Kein Rückfall auf feste Texte aus `src/i18n/locales/*.json`, wenn ein Haus
  keine Einträge hat. Fehlt etwas, wird der Block **weggelassen**, nicht mit
  Platzhaltern oder den Texten des anderen Hauses gefüllt.
- Keine Sonderbehandlung einzelner Häuser (nicht über ID, Name oder Slug).
- Keine erfundenen Werte (z. B. die frühere feste „4,9 ★“: Die Note wird jetzt
  aus den sichtbaren Bewertungen des Hauses berechnet; ohne Bewertungen
  entfällt sie).

Die alten Texte `about.description1/2`, `about.highlights.*` und
`features.items.*` in `de.json`/`en.json` werden im Code nicht mehr benutzt.
Sie bleiben vorerst als Quelle stehen (siehe offene Punkte).

**Verstöße, die noch fest im Code stehen** (werden Stück für Stück umgestellt,
siehe Abschnitt 9):
- `HouseSettingsDialog.tsx`: Vorschlagswerte, wenn ein Preisfeld leer ist
  (Reinigung 240, Winter 450, Sommer 380, Nebensaison 320)
- `pages/Index.tsx`: strukturierte Daten (JSON-LD) mit Adresse Venedigersiedlung 316
- Hero-Titel und SEO-Texte aus i18n (markenbezogen, nicht hausbezogen)

---

## 5. Aufbau der Startseite (`src/pages/Index.tsx`)

Reihenfolge von oben nach unten und woher die Daten kommen:

| Abschnitt | Komponente | Daten |
|---|---|---|
| Navigation | `Navigation.tsx` | — |
| Titelbild mit Hauskarten | `Hero.tsx` + `ChaletCards.tsx` | `gallery_images` (Titelbild je Haus), `houses` |
| Admin-Panel (nur für Admins) | `AdminHousesPanel.tsx` | `houses` (alle, auch ausgeblendete), `house_features` (Zähler) |
| Haus-Umschalter | `HouseSelector.tsx` | `houses` (aktive) |
| Über das Haus | `About.tsx` | `houses.location/name/description`, `house_features` (highlight) |
| Kennzahlen-Leiste | `Stats.tsx` | `houses.bedrooms/max_guests/square_meters`, Durchschnitt aus `reviews` des Hauses |
| Ausstattung | `Features.tsx` | `house_features` (feature) |
| In der Nähe | `NearbyPlaces.tsx` | `house_places` des Hauses, Mittelpunkt aus `house_directions`; fehlt ganz, wenn keine Orte eingetragen sind |
| Bewertungen | `Testimonials.tsx` | `reviews` (**alle Häuser, ohne Hausfilter**) |
| Galerie | `Gallery.tsx` | `gallery_images` des Hauses |
| Verfügbarkeit | `AvailabilityCalendar.tsx` | **Hausverwaltung**: View `public_availability`, gefiltert über `external_house_id` aller aktiven Häuser |
| Anfrage | `BookingForm.tsx` | `houses`, `booking_statuses`, `promotions`; schreibt `booking_inquiries` in **beide** Datenbanken |
| Footer | `Footer.tsx` | — |

**Hausauswahl:** `useHouseSelection()` (`src/hooks/useHouseSelection.ts`) lädt
die aktiven Häuser (Query-Key `houses-active`), wählt standardmäßig das erste
und springt zurück, wenn ein gewähltes Haus ausgeschaltet wird. Die Farbe je
Haus kommt aus `src/lib/houseColors.ts` (nach Position, nicht aus der DB).

**Hausinhalte:** `useHouseFeatures(houseId)` (`src/hooks/useHouseFeatures.ts`)
lädt alle `house_features` eines Hauses in einer Abfrage (Query-Key
`["house-features", houseId]`) und teilt sie in `highlights` und `features`.

**Buchungsanfrage (Datenfluss):**
1. Insert in `booking_inquiries` der Website-DB (mit Preisaufschlüsselung).
2. Insert in `booking_inquiries` der **Hausverwaltung** mit
   `house_id = external_house_id`. Dort läuft die weitere Bearbeitung (Max,
   Annahme/Ablehnung).
3. Scheitert Schritt 2 oder fehlt `external_house_id`, bekommt der Gast den
   Hinweis, sich bei ausbleibender Antwort per E-Mail zu melden.

**Kalender:** eine Abfrage für alle Häuser mit `external_house_id`. Angezeigt
wird die Belegung aller Häuser; gebucht wird das gewählte. Aktualisierung alle
5 Minuten. Ein aktives Haus **ohne** `external_house_id` zeigt einen leeren
Kalender — jeder Zeitraum wirkt frei (das Admin-Panel warnt davor).

---

## 5a. Anfahrt je Haus (seit 19.09.2026)

**Ablauf (Entscheidung Uli, 19.09.2026 — „Mischform“):**

| Adresse | Inhalt |
|---|---|
| `/anfahrt/<slug>` (engl. `/directions/<slug>`) | Anfahrt eines Hauses. **Das ist der Link, den Uli Gästen nach der Buchung schickt** (Booking, Airbnb, Belvilla). Oben Hausname + Ort, darunter Umschalter zu den anderen sichtbaren Häusern. |
| `/anfahrt` (engl. `/directions`) | Auswahl der sichtbaren Häuser |
| Menü/Footer „Anfahrt“ | → `/anfahrt` (Auswahl) |
| Hausbereich der Startseite („Über das Haus“) | Link „Anfahrt“ → `/anfahrt/<slug>` des gewählten Hauses |

- Der `slug` kommt aus `houses.slug` (Admin → Texte & Daten). **Wird der Slug geändert,
  ändert sich der Gäste-Link** — bereits verschickte Links funktionieren dann nicht mehr.
- Im Admin je Haus: Knopf **„Gäste-Link“** kopiert `https://steinbockchalets.com/anfahrt/<slug>`.
- Ein auf der Website ausgeblendetes Haus hat keine Anfahrtsseite (Vorgabe: keine Infos
  über ausgeblendete Häuser).
- Code: `pages/Anfahrt.tsx`, `hooks/useHouseDirections.ts`, `components/HouseDirectionsDialog.tsx`,
  Routen in `App.tsx`. Im Code stehen nur Oberflächen-Beschriftungen (i18n `directions.*`).

## 5b. Vermietung über Plattform (seit 19.09.2026)

Je Haus zwei Schalter: **sichtbar** (`is_active`) und **direkt buchbar** (`direct_booking`).
Ist „direkt buchbar“ aus (Wald Chalet, vermietet über Belvilla, Objekt 100015656):

| Bereich | Verhalten |
|---|---|
| Kalender | **wird angezeigt** (Belegung aus der Hausverwaltung) |
| „ab … €“ auf der Hauskarte | ausgeblendet (`abPreis()` liefert `null`) |
| Anfrageformular, Preisliste, Gebühren | ersetzt durch `ExternalBookingInfo.tsx` |
| Inhalt des Hinweises | `house_booking_info`: Überschrift, Text (de/en), Knopf, Plattformliste |

- Kein Sonderfall „Wald“ im Code — Venediger steht auf `direct_booking = true`.
- Startwerte (SQL `20260919_vermietung_ueber_plattform.sql`): Wald `direct_booking = false`,
  Knopf „Belvilla“ → belvilla.de/at/100015656, 25 Plattformen laut Belvilla-Partnerseite;
  Links nur bei gesicherter Zuordnung: Belvilla, Vrbo (8842832ha), Traum-Ferienwohnungen (240927).
- Recherche 19.09.2026: Airbnb-Inserat nicht gefunden; Booking.com vermutlich als
  „Chalet Trattenbach“ (nur über Weiterverkäufer belegt).

## 5c. In der Nähe (seit 19.09.2026)

Vorbild: Umgebungskarte bei Belvilla. Entscheidung Uli: OpenStreetMap, Kategorien wie
Belvilla, Platz im Hausbereich unter „Ausstattung“; Skigebiete folgen als eigener Abschnitt.

**Website (`NearbyPlaces.tsx`, Abschnitt `#nearby`):**
- Links Kategorien mit Häkchen — nur Kategorien, zu denen es Orte gibt; Standard: alle an.
- Rechts Liste der Orte, nach Entfernung sortiert (Name, ggf. Link, Kategorie, Hinweis de/en, Entfernung).
- Knopf **„Karte anzeigen“**: erst dann wird Leaflet nachgeladen und die Kartenkacheln
  kommen von `tile.openstreetmap.org` (Namensnennung eingeblendet). **Ohne Klick keine
  Verbindung zu OSM** — daher kein Cookie-/Einwilligungsbanner nötig; Hinweis unter dem Knopf
  und Abschnitt „Karte (OpenStreetMap)“ in der Datenschutzerklärung (`legal.privacy.mapTitle/mapText`).
- Marker: Haus (dunkel, Haus-Symbol) + je Ort ein farbiger Kreis mit Kategoriesymbol.
- Kein Ort eingetragen → Abschnitt fehlt (Grundsatz: fehlende Werte = Block weglassen).

**Admin „Umgebung“ (`HousePlacesDialog.tsx`):**
1. **„Vorschläge laden“** fragt die Overpass-API (`overpass-api.de`) **aus dem Browser des
   Admins** ab — rund um die Hauskoordinaten, je Kategorie mit eigenem Radius
   (z. B. Bus 2 km, Krankenhaus 45 km). Nur Einträge mit Namen; gleicher Name + Kategorie
   innerhalb 200 m nur einmal (Bushaltestelle je Fahrtrichtung). Bereits übernommene
   `osm_id` werden nicht erneut vorgeschlagen.
   (Aus der Claude-Sandbox sind OSM/Overpass gesperrt — deshalb im Browser.)
2. Vorschläge ankreuzen → „übernehmen“ → erscheinen als Zeilen.
3. Zeilen frei bearbeiten oder von Hand ergänzen (Kategorie, Name, Breite, Länge,
   Hinweis de/en, Link). Koordinaten z. B. aus Google Maps (Rechtsklick → Koordinaten).
4. **Speichern** löscht alle Orte des Hauses und schreibt die Liste neu.

Voraussetzung: Hauskoordinaten in „Anfahrt“ eingetragen (sonst kein „Vorschläge laden“).

**Bibliothek:** `leaflet@1.9.4` (+ `@types/leaflet`), dynamisch importiert — landet in
einem eigenen Bundle-Teil, die Startseite lädt es nicht mit.

## 6. Admin-Bereich

Anmelden über „Admin“ oben rechts (Seite `/auth`). Admin ist, wer in
`user_roles` mit `role = 'admin'` steht (`src/hooks/useAdmin.ts`).

Unter dem Titelbild erscheint das Panel **„Häuser auf der Website“**
(`AdminHousesPanel.tsx`). Je Haus:

| Knopf | Dialog | schreibt in |
|---|---|---|
| Bilder | Admin-Vorschau der Galerie dieses Hauses (auch wenn ausgeschaltet) | `gallery_images`, Storage `gallery` |
| Texte & Daten (Stift) | `HouseFormDialog.tsx` | `houses` (Name, Ort, Texte, Merkmale, Kennzahlen, Kalender-ID, Reihenfolge) |
| Ausstattung | `HouseFeaturesDialog.tsx` | `house_features` des Hauses |
| Anfahrt | `HouseDirectionsDialog.tsx` | `house_directions` des Hauses |
| Umgebung | `HousePlacesDialog.tsx` | `house_places` des Hauses (Vorschläge aus OpenStreetMap) |
| Vermietung | `HouseBookingInfoDialog.tsx` | `houses.direct_booking` + `house_booking_info` |
| Gäste-Link | — | kopiert `https://steinbockchalets.com/anfahrt/<slug>` |
| Preise | `HouseSettingsDialog.tsx` | `houses` (Preise, Gebühren, Zeiten) |
| Schalter | — | `houses.is_active` |
| Haus anlegen | `HouseFormDialog.tsx` (neu) | `houses`, **immer ausgeschaltet** angelegt |

**Speichern im Ausstattungs-Dialog:** löscht alle `house_features` des Hauses
und schreibt die Liste neu (in einem Rutsch). Zeilen ohne Überschrift werden
verworfen. Die Reihenfolge ergibt sich aus der Position in der Liste (Pfeile).
Werden alle Einträge gelöscht und gespeichert, zeigt die Website für dieses
Haus keine Kacheln bzw. keinen Ausstattungsabschnitt.

---

## 7. SQL-Dateien und Reihenfolge

Die Website-DB wird **nicht** über `supabase db push` gepflegt, sondern per SQL
im SQL-Editor von `wlmdjljyzdwvpqefwdmy`. Die Dateien unter
`supabase/migrations/` dienen der Nachvollziehbarkeit.

| Datei | wann | Inhalt |
|---|---|---|
| `01-schema.sql` (nicht im Repo) | 18.09.2026 | Tabellen, `is_admin()`, RLS, Bucket `gallery` — Umzug |
| `02-daten.sql` (nicht im Repo) | 18.09.2026 | Daten aus der alten DB, Bild-URLs umgeschrieben — Umzug |
| `20260918_zwei_haeuser.sql` | 18.09.2026 | Umbenennung, Wald anlegen (ausgeschaltet), Admin-Policy — **teilweise überholt**, Wald wurde über das Admin-Panel angelegt |
| `03-startseite.sql` (nicht im Repo) | 18.09.2026 | `houses.location`, `houses.highlights` |
| Kennzahlen/Ausstattung (nicht im Repo) | 18.09.2026 | `bedrooms`, `bathrooms`, `square_meters`, Tabelle `house_features` + RLS, `houses.highlights` → Highlight-Kacheln |
| `20260919_hausdaten_voreintragen.sql` | 19.09.2026 | Startwerte für jedes Haus (nur wo leer) |
| `20260919_anfahrt_je_haus.sql` | 19.09.2026 | Tabelle `house_directions` + RLS, Venediger-Anfahrt übernommen |
| `20260919_vermietung_ueber_plattform.sql` | 19.09.2026 | `houses.direct_booking`, Tabelle `house_booking_info`, Wald über Belvilla |
| `20260919_texte_englisch.sql` | 19.09.2026 | `_en`-Spalten in `houses` und `house_features`, englische Startwerte |
| `20260919_in_der_naehe.sql` | 19.09.2026 | Tabelle `house_places` + RLS (leer; Befüllung im Admin „Umgebung“) |

> Die Umzugs- und Zwischen-SQL-Dateien vom 18.09.2026 liegen nicht im Repo.
> Das Tabellenschema von `house_features` ist oben in 3.2 festgehalten. Wer das
> Schema braucht: im SQL-Editor abfragen, nicht raten.

---

## 8. Bekannte Fallen

- **Veraltete Typen.** `src/integrations/supabase/types.ts` kennt
  `house_features` und die neuen `houses`-Spalten nicht. `tsc` meldet deshalb
  10 Fehler in `useHouseFeatures.ts`, `HouseFeaturesDialog.tsx` u. a. Der
  Vite-Build läuft trotzdem durch. **Prüfregel:** Die Zahl der Fehler vor und
  nach einer Änderung vergleichen (`npx tsc --noEmit -p tsconfig.app.json 2>&1 | grep -c "^src"`),
  neue Fehler sind echte Fehler.
- **Beobachter vor Daten.** Komponenten, die erst nach dem Laden erscheinen,
  dürfen `IntersectionObserver`/Refs nicht nur beim ersten Rendern einrichten
  (Fehler in `Stats.tsx`, behoben 19.09.2026).
- **Gemeinsame Query-Keys.** Zwei Abfragen mit gleichem Key, aber
  unterschiedlicher Spaltenliste überschreiben sich gegenseitig im Cache.
  `BookingForm.tsx` nutzt deshalb `houses-booking`, nicht `houses-active`.
- **Slug/Name sind keine Schlüssel.** Die Migration nennt Wald `wald`, die DB
  `wald-chalet`; das Venediger-Haus hieß schon „Haupthaus“, „Steinbock
  Chalet“, „Venediger Chalets“ und „Venedigersiedlung Chalet“.
- **SQL „nur wo leer“ gleicht nicht an.** Ein Skript, das nur Häuser ohne
  Einträge befüllt, lässt vorhandene Einträge stehen. Wer gleiche Werte für
  alle Häuser will, muss ausdrücklich ersetzen (siehe Session 19.09.2026).
- **Direktes Hochladen = live.** Code, der neue Spalten braucht, vor dem SQL
  hochgeladen → Fehler oder leere Bereiche auf der Live-Seite.

---

## 9. Offene Punkte

1. `supabase/config.toml` zeigt noch auf `xcohqbdgzprkixeycdhk` → auf
   `wlmdjljyzdwvpqefwdmy` ändern.
2. `.env.example`: Kommentar „Supabase / Lovable Cloud connection“ ist irreführend.
3. `src/integrations/supabase/types.ts` neu erzeugen (Supabase CLI
   `gen types` gegen `wlmdjljyzdwvpqefwdmy`), damit `tsc` wieder sauber ist.
4. Edge Function `translate-review` im neuen Projekt bereitstellen (samt
   API-Schlüssel). Ob das geschehen ist, ist **nicht verifiziert**. Solange sie
   fehlt, funktioniert die automatische Übersetzung von Bewertungen nicht. Sie
   ruft außerdem `ai.gateway.lovable.dev` auf — das Lovable-Gateway gibt es
   für dieses Projekt nicht mehr; die Funktion muss auf einen eigenen
   KI-Zugang umgestellt werden.
5. `Testimonials.tsx` zeigt die Bewertungen aller Häuser, nicht nur die des
   gewählten.
6. Strukturierte Daten (`index.html`, `Index.tsx`), SEO-Texte, `llms.txt`, Regionsseite
   kennen nur Neukirchen. (Anfahrt: erledigt 19.09.2026.)
7. Vorschlagswerte für Preise in `HouseSettingsDialog.tsx` fest im Code.
8. Ungenutzte i18n-Texte (`about.description1/2`, `about.highlights.*`,
   `features.items.*`) entfernen, sobald beide Häuser gepflegt sind.
9. ~~Englische Texte für Beschreibung/Highlights/Ausstattung~~ — erledigt 19.09.2026 (3.1a).
10. Backups: Beide Datenbanken sind im Free-Tarif ohne Backups. Regelmäßigen
    Export oder bezahlten Tarif erwägen.
11. Ungenutzte Supabase-Datenbanken im Vercel-Team (Überbleibsel aus Lovable-
    und Vercel-Experimenten) aufräumen.
13. Datenschutzerklärung, Abschnitt „Hosting“ nennt noch „Supabase und Lovable Cloud“ —
    tatsächlich Vercel (Hosting) + Supabase (Datenbank). Text von Uli freigeben lassen.
14. Skigebiete (Karten wie bei Belvilla) — nächster Schritt nach „In der Nähe“.
12. `hausmanagement-selfhosted/docs/Steinbock-Chalets-Gesamtdokumentation-MASTER.md`
    nennt noch die alte Website-DB → Einfügetext
    `MASTER-Einfuegetext-Website-2026-09-19.md` einarbeiten.

---

## 10. Änderungsprotokoll dieser Doku

| Datum | Änderung |
|---|---|
| 19.09.2026 | In der Nähe (3.4a, 5c), Datenschutz-Abschnitt OpenStreetMap |
| 19.09.2026 | Zweisprachigkeit (3.1a) |
| 19.09.2026 | Vermietung über Plattform (3.4, 5b) |
| 19.09.2026 | Anfahrt je Haus (3.3, 5a), Belvilla-Konzept festgehalten |
| 19.09.2026 | Erstfassung: Infrastruktur, Datenbanken, Datenmodell, Grundsatz „alles aus der DB“, Seitenaufbau, Admin, SQL, Fallen, offene Punkte |
