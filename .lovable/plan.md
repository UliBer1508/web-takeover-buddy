# Echte Pinzgau-Naturfotos in alle 5 Radtouren einbinden

## Status
20 authentische Naturfotos aus der **Pinzgau / Hohe Tauern**-Region wurden bereits von **Wikimedia Commons** (CC BY-SA Lizenz) heruntergeladen und liegen unter `src/assets/bike-routes/`. Jetzt müssen sie nur noch in die Tour-Dateien eingebunden werden.

## Bildzuordnung pro Tour

### 1. Tauernradweg
- Cover: Wald im Pinzgau – Salzach
- Galerie: Salzach bei Neukirchen · Salzachtal Hollersbach · Sommerblick vom Plattenkogel

### 2. Radregion Pinzgau & Pongau
- Cover: Pass Thurn – Blick ins Salzachtal
- Galerie: Salzach Bramberg · Wildkogel über Hollersbach · Almlandschaft Sulzau

### 3. Pinzgauer Lokalbahn-Tour
- Cover: Landschaft entlang der Pinzgauer Lokalbahn
- Galerie: Bahnhof Krimml · Lokalbahnstrecke Neukirchen · Salzach Bramberg

### 4. Hohe Tauern Bike Trail – Etappe 12
- Cover: Oberes Obersulzbachtal
- Galerie: Hinteres Obersulzbachtal · Postalm-Blick · Schiedhofalm

### 5. Salzachtal Krimml → Mittersill
- Cover: Wald im Pinzgau Ortsansicht
- Galerie: Krimmler Wasserfälle · Salzach Bramberg · Brücke über Salzach Mittersill

## Technische Umsetzung
- **Geänderte Dateien** (5):
  - `src/content/info-articles/articles/tauernradweg.ts`
  - `src/content/info-articles/articles/pinzgau-pongau.ts`
  - `src/content/info-articles/articles/pinzgauer-lokalbahn-rad.ts`
  - `src/content/info-articles/articles/hohe-tauern-bike-trail-et12.ts`
  - `src/content/info-articles/articles/salzachtal-krimml-mittersill.ts`
- Pro Datei: Unsplash-Helper entfernen, lokale Asset-Imports aus `@/assets/bike-routes/` einsetzen, `coverImage` und `gallery` durch lokale Bilder + ortsspezifische DE/EN-Captions ersetzen
- Quellenkommentar (Wikimedia Commons CC BY-SA) im Header
- Validierung per `tsc --noEmit`

## Was unberührt bleibt
- Restliche Artikel (Wandern, Kultur, Skifahren), Komponenten, Tour-Inhalte/Stats/Sektionen
