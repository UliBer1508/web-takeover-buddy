# Session 2026-08-04 — Website von Lovable auf Vercel, Anfahrtsseite, Gästeimport

> Zweck: Nachvollziehbarkeit für künftige Sitzungen (Mensch oder KI).
> Ergänzt `docs/CODE-INDEX.md` (Module „Einstellungen", „Preise") und
> `docs/ARBEITSWEISE-CLAUDE-LESSONS.md`.
> Betrifft **zwei Repositories**: `hausmanagement-selfhosted` und
> `web-takeover-buddy`.

---

## 1. Website: Umzug von Lovable auf Vercel

### Ausgangslage

`steinbockchalets.com` zeigte per A-Eintrag auf **185.158.133.1** — Lovables
Edge-IP. Die GitHub-Verbindung war nach dem 18.07.2026 getrennt worden, das
Repo `web-takeover-buddy` war also weiter als der ausgelieferte Stand.
Änderungen im Repo gingen nicht live.

`www.steinbockchalets.com` löste **gar nicht** auf — der DNS-Eintrag fehlte.

Cloudflare bedient nur `steinbockchalets-charge.com` (Ladesteuerung), nicht die
Website. Registrar ist **IONOS**.

### Durchgeführt

**Build-Vorbereitung** (`package.json`):
- `bunx tsx` → `npx tsx` in `predev`, `prebuild`, `build:dev`. Vercel baut mit
  npm; `bunx` hätte den Build abgebrochen.
- `tsx@^4.23.5` als devDependency ergänzt — war vorher nirgends deklariert und
  wurde zur Laufzeit nachgeladen.
- `bun.lockb` gelöscht (lag neben `package-lock.json`; bei zwei Sperrdateien ist
  Vercels Paketmanager-Wahl nicht vorhersagbar).
- `lovable-tagger` aus `package.json` und `vite.config.ts` entfernt.

**`.env` aus dem Repo entfernt.** Sie stand zwar in `.gitignore`, war aber
bereits eingecheckt — `.gitignore` wirkt nicht auf getrackte Dateien. Inhalt
waren drei `VITE_`-Variablen (Anon-Key, im Browser ohnehin sichtbar), also kein
kritisches Leck. Werte liegen jetzt in den Vercel-Umgebungsvariablen.

**Vercel-Projekt** `web-takeover-buddy`, Framework Vite, Build `npm run build`,
Ausgabe `dist`. Umgebungsvariablen `VITE_SUPABASE_URL` und
`VITE_SUPABASE_PUBLISHABLE_KEY` (ohne Anführungszeichen — die `.env`-Syntax
gehört nicht in Vercel). `VITE_SUPABASE_PROJECT_ID` wird im Code nirgends
gelesen und ist weggelassen.

**DNS bei IONOS:**

| Typ | Hostname | vorher | nachher |
|---|---|---|---|
| A | `@` | 185.158.133.1 | **216.198.79.1** |
| CNAME | `www` | — | **5b3f27a4829ffad5.vercel-dns-017.com** |
| TXT | `_lovable` | `lovable_verify=…` | von IONOS automatisch deaktiviert |

MX-, SPF-, DKIM- und `autodiscover`-Einträge blieben unangetastet — sie tragen
die E-Mail-Zustellung. `wallbox` (CNAME) ebenfalls unberührt.

**In Vercel** wurden zwei Domains eingetragen: `steinbockchalets.com` mit
Production verbunden, `www.steinbockchalets.com` als **308 Permanent Redirect**
darauf. Bewusst **nicht** umgekehrt: Die Seite lief immer ohne `www`, die
Sitemap nutzt `https://steinbockchalets.com` als `BASE_URL`.

**In Lovable** wurde die Domain aus dem Projekt gelöst. Das Projekt bleibt unter
`web-takeover-buddy.lovable.app` als Sicherung des Stands vom 18.07.2026.

### Ergebnis

Jeder Commit auf `main` löst einen Vercel-Build aus und geht live — dieselbe
Arbeitsweise wie bei der Hausverwaltung. `www` funktioniert erstmals.

### Was absichtlich stehen blieb

`src/main.tsx` prüft weiterhin auf Lovable-Hostnamen (`lovable.app`,
`lovableproject.com`, `id-preview--`) und unterdrückt dort die
Service-Worker-Registrierung. Solange die Lovable-Sicherung existiert, ist das
sinnvoll.

---

## 2. Website: Adresse und Koordinaten korrigiert

**Problem:** Google ordnet die Adresssuche „Venedigersiedlung 315" einem
Nachbargebäude zu; Gäste landeten am falschen Haus.

Vier Fundstellen korrigiert:

| Datei | was |
|---|---|
| `src/components/Footer.tsx` | Anschrift 315 → **316**, Google-Maps-Link entfernt |
| `src/pages/Impressum.tsx` | Anschrift 315 → 316 |
| `src/pages/Index.tsx` | `streetAddress` 315 → 316 |
| `src/pages/Index.tsx` | Koordinaten 47.2547/12.2725 → **47.249878/12.254109** |

Die alten Koordinaten lagen rund 1,4 km östlich und 550 m nördlich vom Haus.

**Regel für die Zukunft: keine Adresssuche für dieses Objekt.** Immer
Koordinaten oder den Plus Code **67X3+XJ5** verwenden.

---

## 3. Website: neue Anfahrtsseite

**Zweck:** Eine Adresse, die Uli direkt an Gäste in Airbnb oder Booking geben
kann — mit Hausbild zur Wiedererkennung, Koordinaten zum Übernehmen ins Navi
und Wegbeschreibung.

**Erreichbar unter `/anfahrt` und `/directions`** (beide Routen, dieselbe
Komponente; die Sprache richtet sich wie überall nach i18next).

### Neue und geänderte Dateien

| Datei | Art |
|---|---|
| `src/pages/Anfahrt.tsx` | neu |
| `public/chalet-anfahrt.jpg` | neu (Hausfoto, 1600×900, 333 KB) |
| `public/anfahrt-karte.jpg` | neu (Google-Ausschnitt mit eingezeichnetem Weg, 916×889, 152 KB) |
| `src/App.tsx` | zwei Routen ergänzt |
| `src/components/Navigation.tsx` | Menüpunkt + Seitenwechsel-Logik (siehe 4.) |
| `src/i18n/locales/de.json`, `en.json` | Block `directions` (30 Schlüssel) |
| `scripts/generate-sitemap.ts` | beide Pfade eingetragen |

### Inhalt der Seite

Hausbild · Warnung vor der Adresssuche · Koordinaten und Plus Code jeweils mit
Kopierknopf · Buttons für Google Maps und Apple Karten (beide starten direkt die
Routenführung) · vier Wegschritte · Kartenausschnitt · Anreiseübersicht (Auto,
Parken, Flughafen Salzburg, Bahnhof **Mittersill**) · Winterreifen-Hinweis.

### Wegbeschreibung (von Uli)

1. Auf der B165 (Gerlos Straße) bis Neukirchen am Großvenediger
2. Hinter Neukirchen beim **Hotel Venedigerblick** rechts abbiegen
3. Durch die S-Kurve bis zur Weggabelung, dort **scharf rechts**
4. Das Chalet ist auf der linken Straßenseite bereits zu sehen

### Bewusst KEINE eingebettete Karte

Ein Google-Maps-iframe würde beim Seitenaufruf Daten an Google übertragen und
Cookies setzen. `src/pages/Datenschutz.tsx` erwähnt Google **mit keinem Wort**
(geprüft: 0 Treffer) — es bräuchte also erst eine Ergänzung der
Datenschutzerklärung plus Einwilligungsbanner. Stattdessen: statisches
Kartenbild und Buttons, die die App des Gastes öffnen. Kein externer Aufruf beim
Laden der Seite.

**Falls das später doch gewünscht wird:** OpenStreetMap wäre die
datenschutzfreundlichere Einbettung (keine Cookies, kein Tracking), überträgt
aber ebenfalls die IP und gehört dann in die Datenschutzerklärung.

---

## 4. Website: Navigation und Footer

### Navigation war auf Unterseiten unsichtbar

Die Leiste ist für die Startseite gebaut: Über dem dunklen Hero-Bild transparent
mit weißer Schrift, ab 50 px Scroll deckend. Auf Unterseiten (heller
Hintergrund, kein Hero) blieb sie transparent — **weiße Schrift auf hellem
Grund**.

Behoben durch:

```javascript
const istStartseite = location.pathname === "/";
const isScrolled = scrollPosition || !istStartseite;
```

Betraf auch Impressum, Datenschutz, AGB und die Region-Seiten; dort war es nur
nie aufgefallen.

### Menülinks funktionierten nur auf der Startseite

Alle Links riefen `scrollToSection(id)` auf. Auf einer Unterseite existieren
diese Abschnitte nicht → nichts passierte. Das betraf auch **den „Jetzt
buchen"-Knopf** (zweimal) und **das Logo**.

Neu: `handleNavClick()` unterscheidet drei Fälle — eigener Pfad (`path`),
Abschnitt auf der Startseite (`id`, dort scrollen), Abschnitt von einer
Unterseite aus (`navigate("/#" + id)`). Es gibt **keinen** direkten
`scrollToSection`-Aufruf außerhalb dieser Funktion mehr.

> **Offen:** Ob React Router beim Wechsel auf `/#booking` tatsächlich zum
> Abschnitt scrollt, wurde nicht verifiziert. Falls nicht, wäre `Index.tsx` die
> Stelle — dort gibt es mit `startAtGallery` bereits ein ähnliches Muster.

### Footer

- Google-Maps-Link **entfernt**, stattdessen Verweis auf `/anfahrt`
- `www.steinbockchalets.com` unter der E-Mail ergänzt (Globus-Symbol)
- „Anfahrt" in den Quick Links
- **Copyright-Jahr aus der Systemzeit:** Text ist jetzt `© {{year}} …`,
  gefüllt über `t("footer.copyright", { year: new Date().getFullYear() })`.
  Vorher stand „2025" fest im Text.
- `package.json` Version 0.0.0 → **1.0.0** (erscheint als `v1.0.0` im Footer;
  nützlich, um zu erkennen, ob ein neuer Build angekommen ist)

**Scroll-Position beim Seitenwechsel:** React Router behält sie. Da die
Footer-Links ganz unten stehen, landete man auf der neuen Seite wieder am
Fußende — es sah aus, als sei nichts passiert. Alle fünf `<Link>`-Elemente im
Footer haben jetzt `onClick={nachObenScrollen}`. Betraf auch Impressum,
Datenschutz und AGB.

---

## 5. Website: Galerie-Umschalter

**Problem:** „Erlebnisse & Ausflüge" stand als `variant="outline"` neben dem
aktiven „Bilder" und wirkte nachrangig; Gäste verstanden nicht, was dahinter
liegt.

Geändert in `src/components/Gallery.tsx`:

- „Bilder" → **„Hausbilder"** (englisch „House photos")
- „Erlebnisse & Ausflüge" englisch als **„Things to do"** (gebräuchlicher als
  eine wörtliche Übersetzung)
- Erlebnisse-Knopf immer gefüllt in **Bernstein `#c87f2a`** (hover `#b3701f`),
  Kartensymbol statt Info-Zeichen
- **Grüner Signalpunkt** `#2f6b4f` oben rechts, nur solange `view !== "info"`
- **Erklärzeile darunter** (`gallery.viewToggle.infoHint`), ebenfalls nur solange
  der Bereich nicht geöffnet ist, in `text-sm font-medium` und demselben Grün
- Auf schmalen Bildschirmen stehen die Knöpfe untereinander
  (`flex-col sm:flex-row`)

Punkt und Erklärzeile verschwinden nach dem Öffnen — das Signal hat dann seinen
Zweck erfüllt.

---

## 6. Hausverwaltung: Gästeimport (`GuestImportCard.tsx`)

### Ausgangslage

Der Import erwartet **Meldeschein-Exporte** (Blatt-Nr., Anreise, Abreise), nicht
das Gäste-Adressbuch. Ein Export ohne An-/Abreise scheitert an jeder Zeile.

Die Vorschautabelle hat 13 Spalten; der Bearbeiten-Stift steht in der letzten.
In der schmalen Einstellungskarte war er praktisch unerreichbar — der Hinweis
„Prüfe und korrigiere die Daten" lief ins Leere.

### Durchgeführt

**Vollbild-Dialog.** Der Vorschau-Block liegt in einer Konstante
`previewSection` und wird an zwei Stellen gerendert (Karte und Dialog) —
**keine Kopie**, ein Zustand. Muster übernommen von
`Houses/LinenInventoryDialog.tsx`: `max-w-[95vw] w-full h-[90vh] p-0 gap-0`.

Die Karte zeigt nur noch eine **Zusammenfassung** (Anzahl, vier Kacheln:
neu / Ergänzung / Konflikt / zu prüfen) plus Knopf „Vorschau öffnen und prüfen".
Tabelle, Suche und Speichern-Knopf liegen ausschließlich im Vollbild.

**Auf dem Handy** wird die Upload-Fläche ausgeblendet
(`className={isMobile ? "hidden" : …}`, bewusst ohne zusätzliche Klammer) und
durch einen Hinweis ersetzt: der Import läuft am Computer. Die Karte bleibt
sichtbar, damit die Funktion auffindbar ist.

**PLZ ergänzt.** Die Excel-Spalte wurde nicht gelesen, obwohl
`bookings.guest_postal_code` und `guests.postal_code` existieren. Jetzt in der
ganzen Kette: `getField(mainBooker, 'PLZ', 'Postleitzahl', 'Plz')` → Interface →
Tabellenspalte → Bearbeiten-Modus → `guest_postal_code` im Insert der Edge
Function `import-guest-list`.

**Fußzeilen-Filter.** Die letzte Zeile des Exports enthält
`Gewählter Zeitraum: …` in der Blatt-Nr.-Spalte und wurde als Buchung
interpretiert. Jetzt:

```javascript
if (!blattNr || !/^\d+$/.test(String(blattNr).trim())) continue;
```

Gegenprobe an der echten Datei: 59 Zeilen kommen durch (19 Buchungen), genau
eine wird gefiltert. **Annahme:** Blatt-Nummern sind rein numerisch.

**Abgleich mit vorhandenen Buchungen (nur lesend).** Sobald Haus und Datei
gewählt sind, werden die Buchungen des Hauses im Zeitraum geladen und
verglichen. Vier Einstufungen: `neu`, `ergänzt`, `Konflikt`,
`Zeitraum weicht ab`, `keine Buchung`.

### Vier Korrekturen an der Zuordnungslogik — alle von Uli angestoßen

| Fehler | Ursache | Korrektur |
|---|---|---|
| 12 von 19 als „unklar" | `bookings.check_in` ist **timestamp** (`2026-01-03 14:00:00+00`), die Excel liefert reine Daten. Stringvergleich schlug immer fehl. | `tag()`-Helfer, Vergleich auf `slice(0,10)` |
| Storno als Treffer | Abfrage lud auch `cancelled` — im Wald Chalet lag eine stornierte Buchung im selben Zeitraum | `.neq('status', 'cancelled')` |
| Zuordnung über Zeitraum statt Name | **Falsches Modell.** Uli trägt jede Buchung auf den Namen des Buchenden ein; nur für diesen sind Meldescheindaten verwertbar. | Erst Namenssuche (`nameAehnlich`), Zeitraum bestätigt |
| Fremde Buchung verknüpft | Ohne Namenstreffer wurde die zeitgleiche Buchung eines anderen Gastes genommen und deren Felder verglichen → Scheinkonflikte | Kein Treffer = **keine Zuordnung**. Status `keine Buchung`, keine `bookingId`, keine Feldvergleiche |

**Vergleich gegen `guests`, nicht gegen `bookings`.** Laut
`Guest-Booking-Separation-Plan.md` (Archiv) sind die `guest_*`-Spalten in
`bookings` als DEPRECATED markiert; `GuestEditDialog.tsx` schreibt sie nur noch
„zur Abwärtskompatibilität". Maßgeblich ist der Gästestammsatz. Die Abfrage
nutzt jetzt `guests!bookings_guest_id_fkey(...)` — dasselbe Muster wie
`ConnectedBookingView.tsx` und `useBookings.ts`.

Datenlage geprüft: 123 Buchungen, **alle mit `guest_id`**; 2 Abweichungen bei
Straße, 3 bei Stadt, 1 beim Namen zwischen Buchungskopie und Stammsatz.

### Was NICHT gebaut wurde

**Der Ergänzungspfad.** Der Import überspringt vorhandene Buchungen weiterhin
(`skipped++; continue;`) — es wird **nichts geschrieben**. Teil 1 ist reine
Diagnose.

Grund: Die Datenlage ist komplexer als angenommen (siehe unten). Vor dem Bauen
müssten Verhalten und Konfliktregeln festgelegt sein.

### Erkenntnisse zur Datenlage (wichtig für später)

**Ein Meldeschein ist nicht eine Buchung.** Gäste füllen ihn selbst aus,
teilweise doppelt. Belegt an zwei Zeiträumen:

| Zeitraum | Blätter | Personen | Buchung im System |
|---|---|---|---|
| 10.01.–17.01.2026 | …065 (1 P.) + …057 (4 P.) | 5 | Prazienka, 5 Personen |
| 01.02.–08.02.2026 | …063 + …062 + …059 | 3 | — |

**Regel (von Uli):** Nur Meldescheine, deren Hauptgemeldeter einem Gast im
System entspricht, sind verwertbar. Alle anderen werden **ignoriert** — keine
Buchung anlegen, kein Konflikt, keine Warnung.

**Zwei verschiedene Exporte aus dem Meldeportal:**

| Export | Zeilen | Inhalt |
|---|---|---|
| `Export_…xlsx` (Meldescheine) | 19 Aufenthalte | Zeitraum, Personen, Abgabe — **keine E-Mail/Telefon** |
| `Export_DetailedExcel_…xlsx` (Gästeliste) | 132 Gäste | **Telefon, E-Mail**, Nutzung Marketing, Anz. Aufenthalte, Reisemotiv, Gast-Interessen — **kein Zeitraum** |

**Der wertvollere Import ist die Gästeliste.** Buchungsportale liefern
anonymisierte Adressen; im Meldeschein trägt der Gast seine echte E-Mail ein,
weil er darüber die Gästekarte bekommt. Von 38 E-Mails in der Gästeliste ist
**keine einzige** ein Portal-Platzhalter.

Ist-Zustand in `guests` (Stand 04.08.2026): 119 Gäste, **78 ohne E-Mail**,
13 Portal-Platzhalter, nur 28 mit brauchbarer Adresse.

**Der Abgabenbetrag** (Kurtaxe) steht in der Excel **pro Person**, nicht pro
Buchung — z. B. 24,85 / 24,85 / 0,00 / 24,85 = 74,55. Er wird nicht importiert;
in `bookings` gibt es kein Feld dafür. Die Kurtaxe lebt als Regel in
`houses.pricing_config.tourist_tax` und als Forderung in `booking_charges`.

### Offene Entscheidungen

1. **Ergänzungspfad bauen?** Wenn ja: `update` statt `continue`, mit den vom
   Nutzer freigegebenen Feldern.
2. **Gastname im Trigger.** `sync_guest_from_booking()` setzt
   `name = NEW.guest_name` **ohne** `COALESCE`. Ein schlichtes `COALESCE` wäre
   wirkungslos, weil `guest_name` NOT NULL ist. Nötig wäre:
   `CASE WHEN TG_OP='UPDATE' AND NEW.guest_name IS DISTINCT FROM OLD.guest_name
   THEN NEW.guest_name ELSE name END` — an **beiden** UPDATE-Stellen.
3. **Abgabenbetrag** übernehmen? Bräuchte ein neues Feld und Summierung über
   alle Blatt-Zeilen.
4. **Gästeliste importieren?** Wäre ein eigener Import ohne Buchungsbezug.

---

## 7. Befunde zur Preisgestaltung (nichts geändert)

Alle nur festgestellt, **keine Korrektur eingespielt**:

- **PriceLabs ist nicht implementiert und wird es nicht** (Kosten, keine
  belastbaren Daten für den Oberpinzgau). `pricelabs-sync` existiert nicht;
  `usePriceLabs.ts` ruft sie an Zeile 44 und 155 dennoch auf. **Achtung:** Die
  Datei darf nicht gelöscht werden — `useHousePricingConfig` und
  `useSaveHousePricingConfig` daraus versorgen `PricingConfigCard.tsx`.
- **`scrape-competitor-prices` / `search-competitors` liefern nichts** — die
  Portale sperren Scraper aus. Der Cron `monthly-competitor-price-scraping`
  läuft weiter.
- **`daily-pricing` hat keinen Cron** und wird nicht ausgeführt. Die Funktion
  trägt eine völlig andere Saisonkurve als `pricing-engine` (Januar 0.75 statt
  1.40).
- **`booking-analysis` (Selbstkalibrierung) wird nirgends aufgerufen.**
  `pricing_config.calibration` ist bei beiden Häusern `null`. Sie blendet gegen
  eine generische Vorlage statt gegen die Pinzgau-Kurve; `pricing-engine` liest
  von vier Faktorgruppen ohnehin nur `season`.
- **Faktoren-Drift:** `PricingFactorsConfig.tsx` und `pricing-engine` wichen
  voneinander ab (August 1.40 statt 1.55, Samstag 1.20 statt 1.35). Der
  UI-Schlüssel `holiday.both` wird von der Engine gar nicht gelesen (dort
  `at_plus_de`). Bei Venediger Chalet war der falsche Satz gespeichert.
- **Die Deckelung relativiert das:** `pricing-engine` kappt auf
  `min_price`/`max_price`. Bei Venediger (545/445/650) ergibt das einen Korridor
  von **0.82–1.19**; rund 70 % der Tage liegen an einem Anschlag. Der Drift
  wirkt nur in der Übergangszeit.
- **180-Tage-Lücke:** `PricingDashboard.tsx` ruft
  `bulkUpdatePricesV2({ daysAhead: 180 })`. In `daily_pricing` standen zwei
  Generationen nebeneinander (Lauf 06.05.2026 mit Grenzen 425/750 für
  27.01.–06.05.2027, Lauf 30.07.2026 mit 445/650 für 03.08.2026–26.01.2027).
  Die Lücke **wandert mit** jedem Lauf.
- **AirROI liefert echte Daten, aber grob:** Neukirchen, 454 Tage, nur **4**
  verschiedene ADR-Werte (310–324 €). Stille Fallbacks (`occupancy 0.6`,
  `adr 120`) machen einen Totalausfall unsichtbar.
- **Wald Chalet wird ausschließlich über Belvilla vermietet; Belvilla setzt dort
  die Preise.** Sämtliche Preislogik betrifft nur Venediger Chalet.

---

## 8. Lessons (gehören nach `ARBEITSWEISE-CLAUDE-LESSONS.md`)

Diese Sitzung lief über weite Strecken schlecht. Die Fehler sind alle vom selben
Typ.

**8.1 Doku „gelesen" heißt vollständig gelesen.** Der Typ von `check_in`
(`timestamp`) steht in `Database-Relational-Assessment.md` Zeile 305; die
Gäste-Trennung in `Guest-Booking-Separation-Plan.md`. Beide liegen im
Archiv `docs/alle doc zu hausverwaltung bis einschlieslich 8.7.26.zip`, das
zunächst nur nach Überschriften überflogen wurde. **Ein `grep` durchsucht keine
ZIP-Archive** — vor „ist nicht dokumentiert" ins Archiv sehen.

**8.2 Abwesenheit ist kein Beleg.** Fehlende Cron-Jobs bedeuteten
„ausgeschaltet" (Karte „Max: Zeiten der Automatik" legt sie an und löscht sie),
nicht „defekt". Die Aktivitäten-Crons gehören zu einer anderen Anwendung auf
derselben Datenbank.

**8.3 Eine Unsicherheit auflösen, nicht weiterreichen.** Der Fremdschlüsselname
`bookings_guest_id_fkey` wurde als „nicht verifiziert" an den Nutzer gegeben,
obwohl er in `supabase/migrations/20251217170709_*.sql` ausdrücklich steht und
im Bestandscode zehnmal verwendet wird.

**8.4 esbuild prüft nur Syntax.** Eine gelieferte Datei verwendete
`selectedHouseName`, bevor `selectedHouseId` deklariert war — temporale
Todeszone, die Seite stürzte ab. esbuild meldete grün. **Bei skriptgesteuerten
Umbauten zusätzlich prüfen:** Deklarationsreihenfolge, Spaltenzahl über alle
Tabellen-Zweige, Import für jeden neu verwendeten Bezeichner.

**8.5 Beim Ausschneiden von JSX-Blöcken gehen Bedingungen verloren.** Aus
`{processedBookings.length > 0 && !importResult && (…)}` wurde beim Verschieben
nur `{!showFullscreen && previewSection}` — die Vorschau wäre immer erschienen.

**8.6 Fachliche Regeln erfragen, nicht setzen.** Die Zuordnungsregel für
Meldescheine wurde dreimal geändert, jedes Mal nach einem Gegenbeispiel des
Nutzers. Das ist Raten mit Nachbesserung. Die richtige Frage wäre gewesen:
„Woran erkennst *du*, welcher Meldeschein zu welcher Buchung gehört?"

**8.7 Vor „das gibt es nicht" alle Schreibweisen prüfen.** „Rechnungen an Gäste
existieren nicht" war falsch — die Suche lief auf „invoice/Rechnung", die
Funktion heißt bei euch `booking_charges` + Stripe-Zahlungslink.

**8.8 Neue Seiten am Bestand ausrichten.** Die Anfahrtsseite bekam
`py-24 md:py-32`, alle anderen Unterseiten haben `py-16 md:py-24`. Vor dem Bauen
eine bestehende Seite desselben Typs ansehen.

---

## 9. Was noch offen ist

**Website:**
- Wegbeschreibung Schritt 1 prüfen (kommen Gäste auch aus Richtung Mittersill?)
- `directions.parkingText` präzisieren (Carport? Anzahl Stellplätze?)
- `/#booking` von einer Unterseite: scrollt React Router zum Abschnitt?
- Buchungsanfrage über das Formular einmal durchtesten — sie schreibt in **zwei**
  Datenbanken und wurde seit dem Umzug nicht geprüft

**Hausverwaltung:**
- Die vier offenen Entscheidungen aus Abschnitt 6
- `docs/CODE-INDEX.md` und `docs/Steinbock-Chalets-Gesamtdokumentation-MASTER.md`
  um die Befunde aus Abschnitt 7 ergänzen
- `docs/SQL-README.md` und `supabase/SQL/README.md` sind Doppelgänger mit
  unterschiedlichem Stand (`reschedule_cleaning`-Lücke: behoben vs. offen)

---

*Erstellt am 04.08.2026. Betrifft `hausmanagement-selfhosted` (Abschnitte 6–8)
und `web-takeover-buddy` (Abschnitte 1–5).*
