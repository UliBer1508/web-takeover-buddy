# Info-Galerie mit verlinkten Tour-Karten

Neue Sektion **Info Galerie** unterhalb der Bildergalerie – im exakt gleichen Layout (Themen-Tabs + Karten-Grid + Detail-Dialog wie das Lightbox-Pattern).

## Erste drei Karten (Thema „Radwege")

| Karte | Quelle (externer Link) |
|---|---|
| Tauernradweg | tauernradweg.at |
| Alpe-Adria-Radweg | alpe-adria-radweg.com |
| Radregion Pinzgau & Pongau | salzburgerland.com |

Jede Karte zeigt eigene Kurzbeschreibung, Eckdaten (km, Etappen, Schwierigkeit), Highlight-Liste und einen prominenten Button **„Zur offiziellen Webseite ↗"** mit `target="_blank" rel="noopener noreferrer"`. Quellen-Attribution sichtbar im Dialog.

## Themen-Tabs

`Alle | Radwege | Wandern | Ski | Kultur` – Phase 1 nur „Radwege" befüllt; leere Tabs zeigen „Bald verfügbar".

## Neue Dateien

- `src/content/info-articles/types.ts` – TypeScript-Typen
- `src/content/info-articles/articles/tauernradweg.ts`
- `src/content/info-articles/articles/alpe-adria.ts`
- `src/content/info-articles/articles/pinzgau-pongau.ts`
- `src/content/info-articles/index.ts` – Registry + Topic-Liste
- `src/components/InfoGallery.tsx` – Tabs + Grid (gleiches Pattern wie `Gallery.tsx`)
- `src/components/InfoArticleDialog.tsx` – Detail-Dialog

## Geänderte Dateien

- `src/components/Gallery.tsx` – `<InfoGallery />` am Ende der Sektion `#galerie` einbinden
- `src/i18n/locales/de.json` + `en.json` – neuer `infoGallery`-Block (Titel, Untertitel, Topics, Stats-Labels, Artikel-Inhalte mit Sections + Bullets)

## Layout & Design

- Identische Tab-Buttons (`variant="default"|"outline"`, Count-Badge)
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- Karten: `aspect-[4/3]`, abgerundete Ecken, Hover-Zoom, Gradient-Overlay
- Cover als gestalteter Gradient-Hintergrund mit großem Lucide-Icon (kein fremdes Bildmaterial → keine Lizenzprobleme)
- Alle Farben über semantische Tokens (`--primary`, `--accent`, `--wood`, `--mountain-blue`)
- Detail-Dialog im Stil des Lightbox: `max-w-3xl`, scrollbarer Body, Header mit Cover-Gradient

## Datenmodell

Phase 1: Statisch als TS-Module (volle Designkontrolle, mehrsprachig via `useTranslation`).
Phase 2 (optional, bei Bedarf): Migration auf normalisierte Tabellen `info_topics` (Stammdaten) + `info_articles` (mit `topic_id` FK) + `info_article_sections` – 3NF, vollständig relational.

## Out of Scope (Phase 1)

- Admin-UI zum Bearbeiten der Artikel
- Eigenes Cover-Foto-Upload (kommt später, falls gewünscht)
- Inhalte für Wandern/Ski/Kultur (Tabs nur als Vorschau)
