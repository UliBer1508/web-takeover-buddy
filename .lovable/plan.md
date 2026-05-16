## Ziel

Ein Word-Dokument (.docx) mit allen Einträgen aus der Info-Galerie, zweisprachig (DE + EN) je Eintrag, in voller Detailtiefe – zum Download und zum Einfügen in Airbnb.

## Inhalt pro Eintrag

- Titel (DE / EN)
- Untertitel (DE / EN)
- Kurzbeschreibung (DE / EN)
- Stats-Tabelle (4 Werte)
- Alle Sections mit Überschrift, Fließtext und Bullet-Listen (DE / EN)
- Offizieller Link (anklickbar)

## Struktur

1. Deckblatt: „Erlebnisse & Ausflüge rund um die Steinbock Chalets" (DE) / „Experiences & Excursions around Steinbock Chalets" (EN)
2. Inhaltsverzeichnis gruppiert nach Themen (Panorama, Seen & Klammen, Wandern, Radfahren, Familie, Wellness & Spa, Premium, Ski, Kultur & Städte)
3. Pro Thema: Überschrift + alle Artikel des Themas
4. Pro Artikel: H2-Titel, dann zwei Spalten/Blöcke DE und EN untereinander, Stats-Tabelle, Bullets, Link am Ende

## Vorgehen

- Skript liest alle Artikel-`.ts`-Dateien aus `src/content/info-articles/articles/` per Regex/Eval (TypeScript-Inhalt → einfache Extraktion der `LocalizedText`-Felder via tsx/Node).
- Generiert `Erlebnisse-Ausfluege.docx` via `docx`-npm-Package nach Skill-Konventionen (Arial, Heading-Styles, Tabellen mit DXA-Breiten, korrekte Bullet-Numbering, ExternalHyperlink).
- Schreibt das Ergebnis nach `/mnt/documents/` und liefert es als `<presentation-artifact>` zum Download.
- QA: docx-Datei mit LibreOffice nach PDF konvertieren, alle Seiten als Bilder prüfen, ggf. nachbessern.

## Dateien

- Neu (temporär): `/tmp/build-erlebnisse-docx.mjs`
- Output: `/mnt/documents/Erlebnisse-Ausfluege.docx`

Keine Änderungen am App-Code.
