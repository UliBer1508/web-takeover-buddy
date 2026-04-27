# 4 zusätzliche Hüttenwanderungen mit Einkehr

Vier neue Wanderartikel werden im Info-Bereich unter "Wandern" hinzugefügt – alle mit garantierter Einkehrmöglichkeit, abgestimmt auf unterschiedliche Schwierigkeitsgrade und Gästetypen.

## Neue Touren

### 1. Stockenbaumalm via Sonnenweg (leicht)
- **Einkehr**: Gasthof Stockenbaum (ganzjährig bewirtschaftet)
- 3,5 km · 150 hm · 1–1,5 h
- Aussichtsreicher Höhenweg auf halber Höhe von Neukirchen, ideal für Familien & Genießer

### 2. Baumgartenalm Bramberg (leicht)
- **Einkehr**: Baumgartenalm (hausgemachte Mehlspeisen, Almkäse)
- 5 km · 350 hm · 2 h
- Familienfreundlich durch Wälder und blühende Almwiesen, ruhige Alternative

### 3. Wildalm im Untersulzbachtal (mittel)
- **Einkehr**: Wildalm (urige Hütte, Buttermilch & Kaspressknödel)
- 7 km · 450 hm · 2,5 h
- Romantische Almwanderung im Naturschutzgebiet, klassische "Jausen-Tour"

### 4. Wildkogelalm vom Gipfel (leicht, mit Bergbahn)
- **Einkehr**: Wildkogelalm (2.089 m, große Sonnenterrasse)
- 4 km · 100 hm · 2 h
- Bequeme Smaragdbahn-Auffahrt, 360°-Panorama – perfekt für ältere Gäste

## Technische Umsetzung

- **4 neue Module** in `src/content/info-articles/articles/`:
  - `stockenbaumalm.ts`
  - `baumgartenalm.ts`
  - `wildalm.ts`
  - `wildkogelalm.ts`
- Jeder Artikel folgt dem `InfoArticle`-Schema (id, topic="hiking", icon, gradient, coverImage, gallery 4 Bilder, title, subtitle, shortDescription, stats, sections, externalUrl, sourceLabel) – DE/EN
- **Icons** (Lucide): `Sun`, `Flower2`, `Trees`, `Mountain`
- **Bilder**: helle Unsplash-Naturbilder im bewährten Stil (Almwiesen, Bergwald, Panoramen)
- **Quellen verlinkt**: wildkogel-arena.at, bergfex.at, outdooractive.com, sentres.com
- **Registrierung** in `src/content/info-articles/index.ts` – Reihenfolge: leicht → mittel, gruppiert mit bestehenden Touren

## Was unberührt bleibt

- Bestehende 5 Wandertouren (Berndlalm, Krimml, Smaragdweg, Wildkogel-Gipfel, Kürsingerhütte) – unverändert
- Komponenten, Layouts, Lokalisierungsdateien – keine Änderungen nötig
- Validierung per `tsc --noEmit`
