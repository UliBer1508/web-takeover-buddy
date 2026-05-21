## Ziel

Das bestehende `Erlebnisse-Ausfluege.docx` um Bilder erweitern, damit die Gäste zu jedem Erlebnis ein visuelles Cover sehen.

## Was geändert wird

- Pro Eintrag wird das Cover-Bild (`coverImage` aus dem jeweiligen Artikel) groß über dem Titel eingefügt (volle Spaltenbreite, ca. 9000 DXA, Höhe proportional ~ 4500 DXA).
- Falls in `gallery` mehrere Bilder vorhanden sind: zusätzlich bis zu 2 weitere Bilder kleiner (je halbe Breite) nach dem Text mit der zugehörigen DE/EN-Caption.
- Bilder werden direkt aus `src/assets/...` per `fs.readFileSync` geladen und mit `ImageRun` (type `jpg`/`png` je nach Endung) eingebettet.
- Falls ein Bild nicht ladbar ist: Eintrag wird trotzdem erzeugt, mit Hinweis-Platzhalter (kein Abbruch).

## Sonst bleibt alles wie gehabt

- Gleiche Struktur: Deckblatt, Inhaltsverzeichnis nach Themen, pro Eintrag DE + EN, Stats-Tabelle, Bullets, offizieller Link.
- Gleiches Styling (Arial, Akzentbraun `#8B5E3C`, Tabellen-Shading `#F6F1E9`).

## Vorgehen

1. Skript `/tmp/build-erlebnisse-docx.mjs` erweitern:
   - Helper `loadImage(relPath)` löst `@/assets/...` → `src/assets/...` auf, liest die Datei, ermittelt MIME aus Endung.
   - Beim Aufbau jedes Eintrags vor dem Titel ein Paragraph mit großem `ImageRun` einfügen, danach Titel/Untertitel/Stats/Text/Galerie/Link.
2. Skript ausführen → `/mnt/documents/Erlebnisse-Ausfluege.docx` überschreiben (Version `_v2` zusätzlich, damit Vergleich möglich).
3. QA: docx → PDF via LibreOffice → erste, mittlere und letzte Seiten als JPG prüfen, dass Bilder vorhanden, nicht überdimensioniert und nicht abgeschnitten sind.
4. Artefakt als `<presentation-artifact>` ausliefern.

## Dateien

- Geändert (temporär): `/tmp/build-erlebnisse-docx.mjs`
- Output: `/mnt/documents/Erlebnisse-Ausfluege_v2.docx`

Keine Änderungen am App-Code.