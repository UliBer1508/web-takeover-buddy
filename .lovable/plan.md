# Cover Pinzgau & Pongau tauschen + 3 neue Radtouren

## Cover-Bild Pinzgau & Pongau ersetzen
Das aktuelle Bild zeigt eine kurvige Bergstraße (eher Motorrad-Motiv). Wird ersetzt durch ein **echtes Fahrrad-Motiv**: Gravelbike vor sonnigem Alpenpanorama (`photo-1571068316344-75bc76f77890`).

## 3 neue Radtouren – passend zum Chalet

### 1. Pinzgauer Lokalbahn-Tour (leicht) 🚂🚴
- **Familienfreundlich**: Mit der historischen Schmalspurbahn (Fahrradmitnahme) nach Zell am See, gemütlich zurückradeln entlang der Salzach
- ~40 km · 100 hm · 3–4 h
- Nostalgie + flacher Tauernradweg, Ausstieg jederzeit möglich

### 2. Hohe Tauern Bike Trail – Etappe 12 (schwer) 🚵
- Offizielle MTB-Etappe ab Neukirchen durchs Obersulzbachtal nach Wald im Pinzgau
- ~30 km · 900 hm · 4–5 h
- Sportliches Highlight für ambitionierte Mountainbiker

### 3. Salzachtal: Krimml → Mittersill (leicht, E-Bike) 🚴
- Klassische Genussetappe entlang der Salzach, fast flach, asphaltiert
- ~25 km · 50 hm · 2 h
- Halbtagestour direkt am Chalet vorbei, Rückfahrt mit Lokalbahn möglich

## Technische Umsetzung

- **Geänderte Datei**:
  - `src/content/info-articles/articles/pinzgau-pongau.ts` (Zeile 13: `coverImage` ersetzen)
- **3 neue Module** in `src/content/info-articles/articles/`:
  - `pinzgauer-lokalbahn-rad.ts` (icon: `Train`)
  - `hohe-tauern-bike-trail-et12.ts` (icon: `Bike`)
  - `salzachtal-krimml-mittersill.ts` (icon: `Bike`)
- Alle folgen dem `InfoArticle`-Schema mit DE/EN-Inhalten, hellen Unsplash-Radsport-Bildern, Stats, Sektionen und externen Quellen-Links
- **Registrierung** in `src/content/info-articles/index.ts`: neue Imports + Aufnahme im `infoArticles`-Array direkt nach den bestehenden Radtouren
- Validierung per `tsc --noEmit`

## Was unberührt bleibt

- Restliche Cover-/Galeriebilder, Komponenten, Lokalisierung, alle Wandertouren
