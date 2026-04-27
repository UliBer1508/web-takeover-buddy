# Info-Galerie umsetzen

Setze den bereits erstellten Plan (`.lovable/plan.md`) vollständig um. Inhalte und Datentypen sind bereits angelegt – jetzt folgen UI-Komponenten, Integration und Übersetzungen.

## Schritte

1. **Content-Module finalisieren** (`src/content/info-articles/`)
   - Sicherstellen, dass `tauernradweg.ts`, `alpe-adria.ts`, `pinzgau-pongau.ts` vollständige Daten enthalten (Eckdaten, Sections, Bullets, externer Link, Quellen-Attribution).
   - `index.ts` exportiert Artikel-Liste + Topic-Definition (`all | cycling | hiking | skiing | culture`).

2. **`InfoArticleDialog.tsx`** (neu)
   - Basiert auf `Dialog` (`max-w-3xl`, scrollbarer Body).
   - Header: Gradient-Cover mit großem Lucide-Icon, Titel, Untertitel.
   - Body: Stat-Badges (km, Etappen, Schwierigkeit), Sections (Heading + Text/Bullets).
   - Footer: prominenter Button „Zur offiziellen Webseite ↗" (`target="_blank" rel="noopener noreferrer"`) + sichtbare Quellen-Attribution.

3. **`InfoGallery.tsx`** (neu)
   - Topic-Tabs als Buttons (gleiches Pattern wie bestehende Bildergalerie: `variant="default"|"outline"`, Count-Badge).
   - Grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`, Karten `aspect-[4/3]` mit Hover-Zoom + Gradient-Overlay.
   - Karte zeigt Icon, Titel, Kurzbeschreibung; Klick öffnet `InfoArticleDialog`.
   - Leere Topics zeigen „Bald verfügbar".

4. **Integration in `Gallery.tsx`**
   - `<InfoGallery />` am Ende der Sektion `#galerie` einfügen, mit eigenem Sub-Header (Titel + Untertitel über i18n).

5. **i18n** (`src/i18n/locales/de.json` + `en.json`)
   - Neuer Block `infoGallery`: Section-Titel, Subtitle, Topic-Labels, Stats-Labels, „Bald verfügbar", „Zur offiziellen Webseite", „Quelle".
   - Artikel-Inhalte (Titel, Untertitel, alle Sections + Bullets) für DE und EN.

## Technische Hinweise

- Keine externen Bilder → keine Lizenzprobleme. Cover ist Tailwind-Gradient + Lucide-Icon.
- Alle Farben über semantische Tokens (`--primary`, `--accent`, `--wood`, `--mountain-blue`).
- Datenmodell bleibt Phase 1 (statische TS-Module, mehrsprachig via `useTranslation`). Eine spätere Migration auf normalisierte DB-Tabellen (3NF: `info_topics`, `info_articles`, `info_article_sections`) ist im Plan dokumentiert, aber nicht Teil dieser Umsetzung.

## Out of Scope

- Admin-UI zum Bearbeiten der Artikel
- Eigene Cover-Fotos
- Inhalte für Wandern / Ski / Kultur (Tabs nur als Vorschau mit „Bald verfügbar")
