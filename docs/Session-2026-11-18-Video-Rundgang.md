# Session 18.11.2026 – Video-Rundgang (Paket C)

Ziel (Uli): Video-Rundgang aus den vorhandenen Galerie-Bildern, für die Website und für Portale/Social Media.
Entscheidung: Generator im Website-Admin (kein externer Dienst, keine Kosten, kein SQL).

## Neue Dateien
| Datei | Inhalt |
|---|---|
| `src/lib/tour.ts` | `ladeTourBilder`, `bilderLaden`, `planErstellen`, `zeichneFrame`, `aufnahmeFormat`, `aufnehmen`; Typen `TourBild`, `TourTexte`, `TourPlan` |
| `src/components/VirtualTour.tsx` | Abschnitt `#rundgang` (live), Hooks `useTourTexte(house)`, `useTourPlan(house, maxBilder, aktiv)` (React Query `["tour-plan", …]`) |
| `src/components/TourVideoDialog.tsx` | Admin-Dialog: Format, Bildanzahl, Vorschau, Aufnahme, Download |

## Geänderte Dateien
| Datei | Änderung |
|---|---|
| `src/pages/Index.tsx` | `<VirtualTour house={selectedHouse} />` vor der Galerie (nicht auf `/galerie`, nicht in der Admin-Hausvorschau) |
| `src/components/AdminHousesPanel.tsx` | Knopf „Video“ je Haus, State `videoFuer`, `<TourVideoDialog …/>` |
| `src/i18n/locales/de.json`, `en.json` | Block `tour.*` |
| `docs/WEBSITE-MASTER.md` | 5 (Tabelle), 5g neu, 6 (Admin-Tabelle), Änderungsprotokoll |

## Datenbank
Keine Änderung. Gelesen werden `gallery_images` und `categories` (wie die Galerie).

## Technik
- Canvas-Zeichnung mit Ken-Burns-Zoom, Einblendungen Kategorie/Titel, Titel- und Schlusskarte, Überblendung 1 s.
- Zeiten: Titel 3,5 s, Bild 4,5 s, Schluss 4 s.
- Aufnahme: `canvas.captureStream(30)` + `MediaRecorder`, MP4/H.264 wenn verfügbar, sonst WebM; Echtzeit.
- Bilder `crossOrigin="anonymous"` (sonst Canvas „tainted“).
- Fehler unterwegs: Vorschau im Dialog blieb leer, weil `useEffect` vor dem Einhängen des Dialog-Canvas lief → Callback-Ref + `key={format}`.

## Getestet (Playwright, gemockte Supabase)
- Abschnitt erscheint, spielt ab, keine JS-Fehler.
- Aufnahme MP4 1920×1080 H.264, 25,5 s bei 4 Bildern; Einzelbilder geprüft (Titelkarte, Bild mit Einblendung, Schlusskarte).
- Dialog quer und hoch: Vorschau sichtbar.
- `tsc`: 10 Fehler = Ausgangswert (bekannt, types.ts); `vite build` ok.

## Bedienung
Admin → Häuser auf der Website → beim Haus „Video“ → Format + Bildanzahl → „Video erzeugen“ → Fenster offen lassen → „Herunterladen“.
Englische Fassung: oben auf EN umschalten, Dialog neu öffnen, erneut erzeugen.

## Offen
- Echte Aufnahme mit den Live-Bildern durch Uli prüfen (CORS des Storage).
- Optional später: Hintergrundmusik, eigene Reihenfolge/Auswahl der Bilder fürs Video.
