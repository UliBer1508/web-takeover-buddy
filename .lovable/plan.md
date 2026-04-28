## Ziel

Die 30 Region-Infos (Skigebiete, Wanderungen, Kultur, Radfahren) werden für Airbnb- und Booking.com-Gäste verfügbar gemacht — **plattformkonform**, ohne Risiko einer Sperrung.

## Was wird umgesetzt

### Phase 1 — Öffentliche Region-Guide-Seite

Neue eigenständige Seite, die wie ein neutraler Reise-Guide wirkt (kein Buchungs-Pitch).

- **Route**: `/region-guide` (Übersicht) und `/region-guide/:slug` (Detailseiten)
- **Eigener Header/Footer**: Branding zurückhaltend ("Region-Guide Hohe Tauern"), **keine** Buchungs-CTAs, **keine** Preise
- **Übersicht**: Alle 30 Artikel gruppiert nach Kategorie (Skigebiete, Wandern, Kultur, Radfahren) mit Bild-Karten
- **Detailseite**: Volle Artikel-Inhalte mit Galerie, Stats, Sektionen, Quellen-Link
- **SEO-optimiert**: Meta-Tags, Open Graph, Schema.org `TouristAttraction` pro Artikel — Gäste finden die Seite organisch via Google
- **Footer**: Dezenter Hinweis "Unterkunft in der Region verfügbar" mit Link zur Hauptseite (kein aggressiver CTA)
- **Sprachumschalter**: DE/EN, übernimmt aus bestehender i18n
- Reuse der bestehenden Artikel-Daten aus `src/content/info-articles/` (kein DB-Aufwand)

### Phase 2 — PDF-Welcome-Guide (automatisch nach Buchung)

Schönes PDF, das Gäste nach Buchungsbestätigung erhalten.

- **Edge Function** `generate-region-guide-pdf`:
  - Lädt alle 30 Artikel
  - Rendert ein PDF mit Cover, Inhaltsverzeichnis, Kategorien, Bildern
  - Speichert in neuem Storage Bucket `guest-guides` (public read, damit Link teilbar ist)
  - Gibt Download-URL zurück
- **Auto-Trigger**: Beim Anlegen einer `booking_inquiry` mit Status "confirmed" wird PDF generiert und der Download-Link in die Bestätigungs-E-Mail eingefügt (E-Mail-Versand ist bereits via Resend/Edge Function vorhanden — dort nur ergänzen)
- **Admin-Download-Button**: Im Admin-Bereich kannst du das PDF jederzeit manuell herunterladen, um es im Airbnb/Booking-Chat anzuhängen
- Generiert mit Puppeteer/Chromium oder `@react-pdf/renderer` in der Edge Function (HTML→PDF)

### Phase 3 — QR-Code-Druckvorlage

QR-Code für gedruckte Aufsteller im Chalet → führt zur Region-Guide-Seite.

- **Admin-Tool**: Im Admin-Bereich neuer Bereich "Gäste-Materialien"
  - Generiert QR-Code (PNG/SVG) → Link zu `https://steinbockchalets.com/region-guide`
  - Druckbare A5-PDF-Vorlage mit QR-Code, kurzem Begrüßungstext (DE/EN) und QR
- Kein Datenbank-Aufwand, rein clientseitig generiert mit `qrcode` lib + jsPDF

## Technische Details

### Neue Dateien

```
src/pages/RegionGuide.tsx              — Übersichtsseite
src/pages/RegionGuideArticle.tsx       — Detailseite pro Artikel
src/components/region-guide/
  ├── RegionGuideHeader.tsx            — Neutraler Header
  ├── RegionGuideFooter.tsx            — Neutraler Footer
  ├── ArticleCard.tsx                  — Kachel auf Übersicht
  └── CategorySection.tsx              — Kategorie-Gruppierung
src/components/admin/GuestMaterials.tsx — QR-Code & PDF-Download
supabase/functions/generate-region-guide-pdf/index.ts
```

### Geänderte Dateien

```
src/App.tsx                            — Neue Routes hinzufügen
src/content/info-articles/articles/*   — slug-Feld ergänzen (id wird zu slug)
supabase/functions/<existing-booking-email>/index.ts — PDF-Link einbinden
```

### Datenbank

- **Neuer Storage Bucket**: `guest-guides` (public read, admin write) für PDF-Speicherung
- **Keine Schema-Änderungen** an Tabellen nötig — Artikel bleiben als Code-Files (schnellste Umsetzung, behält 3NF im DB intakt)
- Optional später: Migration der Artikel in DB-Tabellen, wenn du sie über Admin-UI pflegen willst (eigener Folge-Schritt)

### Plattform-Konformität

- Region-Guide-Seite enthält **keine** direkten "Jetzt buchen"-Buttons, **keine** Preise
- PDF-Versand erfolgt **nach** Buchung (auf allen Plattformen erlaubt)
- QR-Code ist physisch im Chalet → vollständig regelkonform
- Keine Erwähnung der Region-Guide-URL in Airbnb/Booking-Listings — Gäste finden sie über Google oder QR

## Was du danach tun kannst

1. **Airbnb/Booking-Bestätigung**: PDF manuell aus Admin-Bereich herunterladen und im Plattform-Chat anhängen (oder Link teilen)
2. **Vor Ort**: QR-Code-Aufsteller drucken und im Chalet platzieren
3. **Organisch**: Google indiziert `/region-guide` — Gäste finden die Inhalte beim Recherchieren
4. **Direkt-Buchungen**: Bekommen den PDF-Link automatisch per E-Mail

## Reihenfolge der Umsetzung

1. Phase 1 (Region-Guide-Seite) — sofort sichtbar, keine externen Abhängigkeiten
2. Phase 3 (QR-Code-Tool) — schnell, zeigt Wert sofort
3. Phase 2 (PDF + E-Mail-Integration) — etwas aufwändiger (Edge Function + Storage Bucket)
