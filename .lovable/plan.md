# Helle Naturbilder für die Radwege

Die zwei Radweg-Artikel im Info-Bereich (**Tauernradweg** und **Alpe-Adria-Radweg**) bekommen frisch kuratierte, sonnige Naturbilder mit echtem Radsport-Bezug – Rennrad/Gravelbike vor Bergpanorama, türkise Bergseen, sonnige Bergstraßen –, die radbegeisterte Gäste sofort ansprechen.

## Was sich ändert

Nur die Cover- und Galeriebilder in zwei Dateien werden ausgetauscht. Texte, Statistiken, Sektionen und Layout bleiben unverändert.

### Tauernradweg
- **Cover**: Rennradfahrer in sonnigem Alpenpanorama
- **Galerie**:
  1. Genussradeln im goldenen Licht entlang der Salzach
  2. Türkisblauer Bergsee als Etappenziel
  3. Sonniger Radweg durch lichten Bergwald
  4. Pinzgauer Bergdorf im Sonnenlicht

### Alpe-Adria-Radweg
- **Cover**: Gravelbike vor Alpenpanorama
- **Galerie**:
  1. Rennrad-Etappe über sonnige Alpenpässe
  2. Glasklarer Bergsee in Kärnten
  3. Eindrucksvolle Brückenpassage mit Bergblick
  4. Sonniger Süden – Ankunft an der Adria

Alle Bildunterschriften werden zweisprachig (DE/EN) aktualisiert, passend zum neuen Motiv.

## Technische Details

- **Geänderte Dateien**:
  - `src/content/info-articles/articles/tauernradweg.ts` (Zeilen 13–31: `coverImage` + `gallery`)
  - `src/content/info-articles/articles/alpe-adria.ts` (Zeilen 13–31: `coverImage` + `gallery`)
- **Bildquelle**: Lizenzfreie Unsplash-Fotos (gleiche `UNSPLASH(id)`-Helper wie bisher, nur neue, bewährte Foto-IDs mit Radsport-/Alpenbezug)
- **Keine Schema-Änderungen**, keine neuen Dependencies, kein Auto-Layout-Eingriff
- Verifikation per `tsc --noEmit`

## Was unberührt bleibt

- Wander-Artikel (Berndlalm, Krimml, Smaragdweg, Wildkogel, Kürsingerhütte) – die wurden bereits zuletzt mit hellen Naturmotiven versorgt
- Komponenten `InfoGallery.tsx` und `InfoArticleDialog.tsx`
- Lokalisierungsdateien
