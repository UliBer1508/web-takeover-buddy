## Ziel

Den Galerie-Bereich um einen klaren Umschalter zwischen **Bildergalerie** und **Infogalerie** erweitern. Beide Inhalte teilen sich denselben Section-Container (`#galerie`), aber der Gast sieht immer nur eine der beiden Ansichten.

Aktuell wird `<InfoGallery />` zwar unterhalb der Bildergalerie gerendert, aber sie ist für den Gast nicht auffindbar (zu weit unten, kein Hinweis, dass es sie gibt). Außerdem wirkt das Aneinanderreihen zweier umfangreicher Galerien überladen.

## Lösung

Ein zweistufiges Tab-System direkt unter dem Section-Titel "Galerie":

```text
┌────────────────────────────────────────────┐
│              Galerie                       │
│       Eindrücke & Informationen            │
│                                            │
│   [ 📷 Bilder ]   [ ℹ️ Infos ]              │  <- Haupt-Umschalter
│                                            │
│   (je nach Auswahl)                        │
│   - Bilder: Saison-Filter + Bild-Grid      │
│   - Infos:  Themen-Filter + Info-Karten    │
└────────────────────────────────────────────┘
```

### Verhalten

- Standard-Ansicht beim Laden: **Bilder** (so wie heute gewohnt).
- Klick auf "Infos" blendet Bilder-Grid, Saison-Filter und Upload-Button aus und zeigt stattdessen die Infogalerie (Themen-Tabs + Karten).
- Beide Ansichten behalten ihren bisherigen internen Filter (Saisons bzw. Themen).
- Smooth Fade beim Umschalten (gleiches `animate-fade-in` Pattern wie auf der Seite üblich).
- Lightbox, Upload-, Edit- und Delete-Dialoge bleiben unverändert und nur in der Bilder-Ansicht aktiv.

### i18n

Neue Keys in `de.json` / `en.json`:

```
gallery.viewToggle.photos  -> "Bilder" / "Photos"
gallery.viewToggle.info    -> "Infos"  / "Info"
```

Subtitle der Section leicht anpassen, sodass beide Inhalte angekündigt werden:
- DE: "Eindrücke und Wissenswertes rund um Ihren Aufenthalt"
- EN: "Impressions and useful info around your stay"

## Technische Umsetzung

**Datei:** `src/components/Gallery.tsx`

1. Neuer State: `const [view, setView] = useState<"photos" | "info">("photos")`.
2. Direkt nach dem Section-Header zwei Toggle-Buttons rendern (gleicher Button-Style wie die Saison-Tabs, mit Lucide-Icons `Image` und `Info`).
3. Den bisherigen Block (Saison-Tabs, Upload-Button, Empty-State, Bild-Grid) in `{view === "photos" && (...)}` einwickeln.
4. `<InfoGallery />` (ohne den eigenen `mt-20 pt-16 border-t` Rahmen, da nicht mehr nötig) in `{view === "info" && (...)}` rendern.
5. In `InfoGallery.tsx` den umschließenden `mt-20 pt-16 border-t border-border` Wrapper entfernen / optional machen, damit es als eigenständige Ansicht ohne Trennlinie erscheint. Eigener H3-Titel + Subtitle entfällt, da der Section-Titel schon "Galerie" sagt — stattdessen nur noch die Themen-Tabs und das Karten-Grid.
6. Lightbox / Upload / Edit / Delete Dialoge bleiben am Section-Ende, werden aber nur relevant wenn `view === "photos"` (kein zusätzlicher Code-Aufwand, da sie von Bild-Klicks getriggert werden, die in der Info-Ansicht gar nicht existieren).

**Datei:** `src/i18n/locales/de.json` und `en.json`
- Neuen Block `gallery.viewToggle` mit `photos` und `info` ergänzen.
- Subtitle in `gallery.subtitle` ggf. anpassen (oder unverändert lassen, wenn er bereits passend ist).

**Datenmodell / Datenbank:** keine Änderungen nötig. Die Infogalerie-Inhalte sind statische TS-Module (`src/content/info-articles/`), die DB bleibt unangetastet und damit weiterhin in 3. Normalform.

## Was bleibt unverändert

- Bestehende Bildergalerie-Funktionalität (Saisons, Upload, Drag&Drop, Lightbox, Admin-Aktionen).
- Die drei vorhandenen Info-Artikel (Tauernradweg, Alpe-Adria, Pinzgau-Pongau) und ihre Detail-Dialoge.
- Layout, Farben, Spacings — es kommen nur zwei Toggle-Buttons hinzu.