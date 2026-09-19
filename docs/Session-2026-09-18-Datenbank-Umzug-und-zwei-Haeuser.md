# Session 2026-09-18 — Eigene Website-Datenbank und zwei Häuser

> Zweck: Nachvollziehbarkeit für künftige Sitzungen (Mensch oder KI).
> Überblick und aktueller Stand: `docs/WEBSITE-MASTER.md` — **zuerst lesen**.
> Dieses Dokument hält fest, **was am 18.09.2026 passiert ist und warum**.

---

## 1. Ausgangslage

- Ziel: Das **Wald Chalet** als zweites Haus auf steinbockchalets.com aufnehmen:
  eigene Bilder und Preise, Kalender mit der Belegung beider Häuser, jedes Haus
  separat anfragbar. Anfragen sollen in der Hausverwaltung genauso ankommen
  wie beim bestehenden Haus. Das bestehende Haus soll „Venediger …“ heißen.
- Die Website lief auf der Supabase-Datenbank **`xcohqbdgzprkixeycdhk`**. Sie
  war ursprünglich von **Lovable Cloud** angelegt worden.
- **Blocker:** Diese Datenbank lag in keiner Supabase-Organisation von Uli, das
  Lovable-Projekt existierte nicht mehr. Kein Dashboard, kein SQL-Editor, keine
  Policy-Änderung möglich. Die RLS-Policies erlaubten Admins auf `houses` **kein
  INSERT** → das Wald Chalet ließ sich über das neue Admin-Panel nicht anlegen
  („new row violates row-level security policy“).
- Die Master-Doku der Hausverwaltung nannte die Website-DB zwar, aber nicht,
  unter welchem Konto sie liegt. Die Suche (Supabase-Organisationen, Vercel
  Storage mit rund einem Dutzend Supabase-Ressourcen, Vercel-Umgebungsvariablen
  als Secret nicht lesbar, Browser-Konsole) kostete über eine Stunde.

**Entscheidung (Uli):** eigene, neue Supabase-Datenbank anlegen, alle
Website-Daten dorthin übertragen und die Website umstellen.

---

## 2. Neues Supabase-Projekt

- Das Hauptkonto **uli.berresheim@hotmail.de** hatte das Limit von zwei
  kostenlosen Projekten erreicht. Deshalb wurde ein zweites Supabase-Konto
  unter **steinbockchalets@gmail.com** angelegt.
- Organisation: **„steinbockchalets webseite“**
- Projekt: **`steinbockchalets-webseite`**, Ref **`wlmdjljyzdwvpqefwdmy`**
- Region: **West EU (Irland)** (geplant war Frankfurt; bewusst so belassen, der
  Unterschied liegt bei wenigen Millisekunden. Ändern ginge nur mit neuem Projekt.)
- Datenbank-Passwort: beim Anlegen erzeugt, im Passwortmanager gesichert.
- Security: „Enable Data API“ an (braucht `supabase-js`), automatische
  API-Freigabe neuer Tabellen an; Schutz über RLS.
- Keine GitHub-Verbindung; das Schema wird über den SQL-Editor eingespielt.

---

## 3. Ablauf des Umzugs

Die alte Datenbank wurde **nicht angefasst**. Umgeschaltet wurde erst ganz am
Ende über die Umgebungsvariablen in Vercel — der Rückweg blieb bis zuletzt offen.

### 3.1 Sicherung aus der alten Datenbank (Browser-Konsole)

Da es keinen Datenbankzugang gab, wurde über die Website selbst gesichert:

1. Auf steinbockchalets.com **als Admin angemeldet** (sonst liefern
   `booking_inquiries` und `user_roles` wegen RLS nichts).
2. Ein Konsolen-Skript las den anon-Key aus dem ausgelieferten JavaScript,
   exportierte die neun Tabellen `houses`, `gallery_images`, `categories`,
   `seasons`, `reviews`, `promotions`, `booking_inquiries`, `booking_statuses`,
   `user_roles` als JSON.
3. Ein zweites Skript lud alle **34 Galeriebilder** als ZIP herunter.

Tabellenliste und Spalten stammen aus `src/integrations/supabase/types.ts`.

### 3.2 Einspielen in die neue Datenbank

| Schritt | Datei / Ort | Inhalt |
|---|---|---|
| 1 | `01-schema.sql` im SQL-Editor | Tabellen, Rollen-Funktion `is_admin()`, RLS-Policies, Storage-Bucket `gallery` (öffentlich lesbar, Admins verwalten) |
| 2 | `02-daten.sql` im SQL-Editor | 1 Haus, 34 Bildeinträge, 7 Kategorien, 5 Jahreszeiten, 3 Bewertungen, 3 Buchungsstatus, 7 Buchungsanfragen; am Ende werden alle Bild-URLs auf `wlmdjljyzdwvpqefwdmy` umgeschrieben |
| 3 | Storage → `gallery` → Upload | alle 34 Dateien aus dem ZIP, **Dateinamen unverändert, keine Unterordner** |
| 4 | Authentication → Users → Add user | neuer Admin-Nutzer; danach `insert into public.user_roles (user_id, role) values ('<user-id>', 'admin');` |

Bewusst **anders als in der alten Datenbank**:
- Admins dürfen auch **INSERT** (die Ursache des Wald-Problems).
- Das Titelbild (`gallery_images.is_hero`) ist **je Haus** eindeutig, nicht global.
- `user_roles` wurde nicht übernommen; das alte Login lebte in der alten DB.

Die beiden SQL-Dateien und die Ablaufbeschreibung wurden im Chat übergeben
und liegen **nicht im Repo**.

### 3.3 Umschalten

Vercel → `web-takeover-buddy` → Settings → Environment Variables:

- `VITE_SUPABASE_URL` → `https://wlmdjljyzdwvpqefwdmy.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` → anon-Key des neuen Projekts
- `VITE_SUPABASE_PROJECT_ID` → `wlmdjljyzdwvpqefwdmy`

Danach **Deployments → Redeploy ohne Build-Cache**. (Beim ersten Versuch wurde
kein neuer Build angestoßen; der oberste Eintrag war noch der alte. Erst der
Redeploy brachte die neuen Werte in die Seite.)

### 3.4 Prüfung

- Browser-Konsole zeigte Anfragen an `wlmdjljyzdwvpqefwdmy` (Website) und
  `usblrulkcgucxtkhugck` (Kalender der Hausverwaltung, unverändert).
- Titelbild und Galerie erschienen → Bilder kommen aus der neuen DB.
- Anmeldung mit dem **neuen** Login, Admin-Panel sichtbar.
- **Wald Chalet über das Admin-Panel angelegt** — ohne RLS-Fehler.

---

## 4. Zwei-Häuser-Umbau (Frontend)

Nach dem Umzug wurde die Website hausabhängig gebaut. Neue bzw. stark
geänderte Dateien (hochgeladen am 18.09.2026):

| Datei | Änderung |
|---|---|
| `components/AdminHousesPanel.tsx` (neu) | Panel „Häuser auf der Website“: je Haus Bilder, Texte & Daten, Ausstattung, Preise, Ein/Aus-Schalter; Haus anlegen; Hinweis, was noch fehlt; Warnung bei aktivem Haus ohne Kalender-ID |
| `components/HouseFormDialog.tsx` (neu) | Name, Slug, Ort, Kurztext, Beschreibung, Merkmale, Schlafzimmer, Bäder, m², Gäste, Kalender-ID, Reihenfolge. Neue Häuser werden ausgeschaltet angelegt |
| `components/HouseFeaturesDialog.tsx` (neu) | Highlights und Ausstattung je Haus mit Symbolauswahl und Reihenfolge |
| `components/ChaletCards.tsx` (neu) | Hauskarten im Titelbild (Titelbild, Ort, Kurztext, Gäste, Merkmale, Ab-Preis) |
| `components/Hero.tsx` | Marke „Steinbock Chalets“ statt einzelnes Haus; Titelbild je Haus |
| `components/HouseSelector.tsx`, `Navigation.tsx` | Umschalter, Menüpunkt „Unsere Chalets“ |
| `components/About.tsx`, `Features.tsx`, `Stats.tsx` | Inhalte je Haus aus der DB (mit Rückfall auf feste Texte — am 19.09.2026 entfernt) |
| `components/AvailabilityCalendar.tsx` | Belegung aller Häuser in einem Kalender, eine Abfrage über `external_house_id` |
| `components/BookingForm.tsx` | Anfrage für das gewählte Haus; eigener Query-Key `houses-booking` |
| `components/Gallery.tsx` | Galerie je Haus, Admin-Vorschau für ausgeschaltete Häuser |
| `hooks/useHouseSelection.ts`, `hooks/useHouseFeatures.ts` (neu) | Hausauswahl, Hausinhalte |
| `lib/featureIcons.ts`, `lib/houseColors.ts` (neu) | Symbolliste, Farbe je Haus |
| `pages/Index.tsx` | Seitenaufbau: Titelbild mit Karten → Admin-Panel → Umschalter → Inhalte des gewählten Hauses |

### Datenbank-Erweiterungen (SQL-Editor, `wlmdjljyzdwvpqefwdmy`)

1. `20260918_zwei_haeuser.sql` (im Repo): Umbenennung des bestehenden Hauses,
   Wald anlegen (ausgeschaltet), Admin-Policy. **Teilweise überholt** — Wald
   wurde nach dem Umzug über das Admin-Panel angelegt (Slug `wald-chalet`).
2. `03-startseite.sql`: `houses.location`, `houses.highlights`; beide Häuser
   mit Ort vorbefüllt.
3. Kennzahlen und Ausstattung: `houses.bedrooms`, `bathrooms`,
   `square_meters`; Tabelle `house_features` mit RLS (Schema in
   `WEBSITE-MASTER.md` 3.2); die vier Merkmale aus `houses.highlights`
   („Private Sauna“, „Kaminofen“, „Panoramaterrasse“, „Gletscherblick“) wurden
   beim Venediger-Haus als Highlight-Kacheln übernommen.

Stand nach der Abfrage vom 18.09.2026:

| name | slug | location | is_active |
|---|---|---|---|
| Venedigersiedlung Chalet | haupthaus | Neukirchen am Großvenediger | true |
| Wald Chalet | wald-chalet | Wald im Pinzgau | true |

### Entscheidungen

- **Leere Felder werden weggelassen statt geraten.** Ohne m² zeigt die
  Kennzahlen-Leiste diese Kachel nicht.
- **Die feste „4,9 ★“ entfällt.** Die Note wird aus den sichtbaren Bewertungen
  des Hauses berechnet; ohne Bewertungen keine Kachel.
- Alle Hausinhalte sollen über den Admin je Haus pflegbar sein (Uli: „da wir
  jetzt die DB unter Kontrolle haben, sollen alle diese Werte in der DB sein“).

---

## 5. Am Ende offen gebliebene Punkte (Stand 18.09.2026 abends)

- Kennzahlen-Leiste zeigte 0 → am 19.09.2026 behoben (siehe dortige Session).
- Cache-Konflikt `houses-active` zwischen `useHouseSelection` und
  `BookingForm` → `BookingForm` nutzt jetzt `houses-booking` (im Code verifiziert 19.09.2026).
- Nacharbeiten des Umzugs → `WEBSITE-MASTER.md`, Abschnitt 9.

## 6. Lehre aus dieser Sitzung

Die fehlende Angabe „Website-DB = Projekt X unter Konto Y“ hat über eine
Stunde gekostet. **Jede Infrastruktur-Änderung (DB, Konto, Domain,
Umgebungsvariable) wird im selben Schritt in `WEBSITE-MASTER.md` festgehalten.**
