## Problem
Aktuell gibt es nur die Startseite `steinbockchalets.com`. Wenn du oder ein Gast `steinbockchalets.com/galerie/info` direkt im Browser eingibst (oder den Link aus einer Booking.com-Nachricht klickt), funktioniert das nicht – es gibt keine solche Route.

Die Inhalte (Foto-Galerie + Info-Bereich mit Region-Tipps) **existieren bereits** als Sektion auf der Startseite (`<Gallery />` mit Foto/Info-Toggle). Sie haben nur keine eigene URL.

## Ziel
Echte, direkt aufrufbare URLs erstellen:
- **`steinbockchalets.com/galerie`** → öffnet die Galerie-Sektion mit der **Foto-Ansicht** aktiv
- **`steinbockchalets.com/galerie/info`** → öffnet die Galerie-Sektion mit der **Info-Ansicht** aktiv (für Gäste)
- **`steinbockchalets.com/gallery`** und **`/gallery/info`** → englische Varianten (gleiche Seite)

Beim Aufruf landet der Gast auf der **kompletten Startseite** (mit Hero, Haus-Infos, Galerie/Info-Bereich, Verfügbarkeitskalender und Buchungsformular) und scrollt automatisch zum Galerie-Abschnitt – mit der richtigen Ansicht (Fotos oder Info) bereits ausgewählt.

So erreichst du dein Ziel: Gäste klicken den Link, sehen sofort die wertvollen Region-Infos – und haben gleichzeitig auf derselben Seite Zugang zu Hausinfos, Verfügbarkeit und Direktbuchung.

## Was gebaut wird

### 1. Routen in `src/App.tsx` registrieren
Vier neue Routen, alle rendern die bestehende `<Index />`-Seite mit unterschiedlichen Props:
```tsx
<Route path="/galerie" element={<Index initialGalleryView="photos" />} />
<Route path="/galerie/info" element={<Index initialGalleryView="info" />} />
<Route path="/gallery" element={<Index initialGalleryView="photos" />} />
<Route path="/gallery/info" element={<Index initialGalleryView="info" />} />
```

### 2. `src/pages/Index.tsx` erweitern
- Neuer optionaler Prop `initialGalleryView?: "photos" | "info"`
- Wird an `<Gallery />` weitergereicht
- `useEffect`: wenn `initialGalleryView` gesetzt ist → automatisches sanftes Scrollen zur Galerie-Sektion (`#galerie`) nach dem ersten Render

### 3. `src/components/Gallery.tsx` minimal anpassen
- Neuer optionaler Prop `initialView?: "photos" | "info"`
- `useState` initial-Wert nutzt diesen Prop (Fallback: `"photos"`)
- Sonst keine Änderung – die Toggle-Buttons funktionieren weiterhin normal

### 4. SEO/Share-Vorschau für `/galerie/info`
Damit die URL beim Teilen in Booking.com/WhatsApp/E-Mail eine schöne Vorschau zeigt:
- Im `useEffect` von `Index.tsx`: `document.title` dynamisch setzen, z. B. "Gäste-Infos & Region-Tipps – Steinbock Chalets" wenn `initialGalleryView === "info"`
- Open-Graph-Meta-Tags (`og:title`, `og:description`, `og:image`) dynamisch via DOM-Manipulation setzen, mit Hero-Bild aus der DB als `og:image`

## Was du nach dem Bauen tust
In deine Booking.com-/Airbnb-Nachricht einfügen:
```
Liebe Gäste, hier finden Sie unsere Region-Tipps und alle Infos zum Haus:
https://steinbockchalets.com/galerie/info
```

## Technische Details
- **Keine Datenbankänderungen, keine neuen Seiten** – nur Routing-Erweiterung der bestehenden Index-Seite.
- **SPA-Routing**: Lovable-Hosting löst Deep-Links wie `/galerie/info` automatisch auf `index.html` auf. Sobald die Route in `App.tsx` registriert ist, funktioniert der direkte Browser-Aufruf und der Klick aus E-Mails.
- **Auto-Scroll**: nach Mount mit `setTimeout` + `scrollIntoView({ behavior: 'smooth', block: 'start' })` auf `#galerie`. Verzögerung ~300 ms, damit Lazy-Loading-Inhalte (z. B. Hero-Bild) die Layout-Position nicht mehr verschieben.
- **Bestehende Funktionalität bleibt erhalten**: Startseite `/` zeigt weiterhin alles wie gewohnt ohne Auto-Scroll und mit Default-Ansicht "Fotos".

## Geänderte Dateien
- `src/App.tsx` (4 neue Routen)
- `src/pages/Index.tsx` (neuer Prop + Auto-Scroll + Meta-Tags)
- `src/components/Gallery.tsx` (neuer optionaler Prop `initialView`)