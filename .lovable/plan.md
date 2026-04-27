## Ziel

Jede Info-Karte bekommt einen passenden, lizenzfreien Foto-Hintergrund, und der Detail-Dialog wird um eine kleine Bildergalerie (3–5 Bilder) ergänzt. Bildquelle: **Unsplash** (CC0 / Unsplash-Lizenz, kommerziell frei nutzbar, keine Attribution Pflicht).

## Auswahl der Bilder

Pro Artikel ein Cover + 3–4 Galerie-Bilder, kuratiert nach Thema:

**Tauernradweg** (cycling)
- Cover: Salzach-Flusslandschaft mit Alpen
- Galerie: Krimmler Wasserfälle · Radfahrer am Fluss · Festung Hohenwerfen · Salzburg Altstadt

**Alpe-Adria-Radweg** (cycling)
- Cover: Bergpass Richtung Süden / Alpenpanorama
- Galerie: Großglockner-Region · Italienische Hügellandschaft · Adria-Küste bei Grado · Bahn-Begleitung

**Pinzgau & Pongau** (culture / region)
- Cover: Pinzgauer Bergpanorama
- Galerie: Almlandschaft · Bergsee · Traditionelles Bauernhaus · Wanderweg

Alle URLs werden direkt von `images.unsplash.com` geladen (mit `?w=…&q=80&auto=format` Parametern für Performance). Quellen werden im Code kommentiert dokumentiert.

## Technische Umsetzung

### 1. Datenmodell erweitern (`src/content/info-articles/types.ts`)

```ts
export interface InfoArticle {
  // ... bestehend
  coverImage: string;           // Unsplash URL für Karten-Hintergrund + Dialog-Header
  gallery: {
    url: string;
    caption: LocalizedText;
  }[];                          // 3-5 Bilder pro Artikel
}
```

`gradient` und `icon` bleiben als Fallback erhalten (z. B. wenn ein Bild nicht lädt → `onError` zeigt Gradient).

### 2. Bilder in jeden Artikel ergänzen
`tauernradweg.ts`, `alpe-adria.ts`, `pinzgau-pongau.ts` bekommen jeweils `coverImage` und `gallery: [...]` mit kuratierten Unsplash-URLs und bilingualen Captions.

### 3. `InfoGallery.tsx` – Karten mit Bildhintergrund
- `<img src={article.coverImage} ... className="absolute inset-0 w-full h-full object-cover" />` statt Gradient-Wrapper.
- Icon klein oben links als Badge auf dem Bild (mit Backdrop-Blur), Topic-Label + Titel + Kurzbeschreibung im unteren Verlauf wie bisher.
- `loading="lazy"` für Performance.
- Hover: bestehender Scale-Effekt bleibt, wirkt mit Foto noch stärker.

### 4. `InfoArticleDialog.tsx` – Header-Bild + Mini-Galerie
- Oben: großes Cover-Bild (`aspect-[16/9]`) mit Titel-Overlay.
- Nach den Sections, vor dem External-Link: neuer Block "Impressionen" mit 3-spaltigem Grid (mobil 2 Spalten) der Galerie-Bilder; Klick auf ein Bild öffnet es im bestehenden Lightbox-Stil (kleine eigene Lightbox im Dialog).
- Captions als Bildunterschrift sichtbar (klein, muted).

### 5. i18n-Ergänzung
Neue Keys in `de.json` / `en.json`:
- `infoGallery.dialog.impressions` → "Impressionen" / "Impressions"
- `infoGallery.dialog.imageSource` → "Bilder: Unsplash" / "Images: Unsplash"

### 6. Datenbank
Keine Änderungen — Inhalte bleiben statische TS-Module (3. Normalform der DB unangetastet).

## Was bleibt unverändert
- Toggle Bilder/Infos, Themen-Filter, externe Links zu offiziellen Seiten.
- Bestehende Bildergalerie und Booking-Flow.
- Komplette Bilingualität.