# Umsetzungskonzept: Fixes & Verbesserungen

## 1. Footer-Korrekturen (`src/components/Footer.tsx`)

- **E-Mail-Fix**: `href="mailto:steinbockchalets@gmail.com"` (einheitlich mit sichtbarem Text).
- **Google-Maps-Link** unter der Adresse: `https://www.google.com/maps/search/?api=1&query=Venedigersiedlung+315+5741+Neukirchen` mit `MapPin`-Icon, Text „Auf Google Maps öffnen →", `target="_blank"`.
- **Social-Media-Spalte** (3. Spalte, aktuell leer) befüllen:
  - Instagram-Icon → `https://instagram.com/steinbockchalets`
  - Facebook-Icon → `https://facebook.com/steinbockchalets`
  - WhatsApp-Link aus „Quick Links" hierher verschieben
  - Untertitel: „Folge uns für Angebote & Einblicke" (über i18n-Key `footer.followUs`)
- **Rechts-Links**: Impressum/Datenschutz/AGB als `<Link to="/impressum">` etc. statt funktionsloser Buttons.
- **Accessibility**: Allen Scroll-Buttons `aria-label` geben (z. B. „Zur Galerie scrollen").

## 2. Rechtsseiten (neue Routen)

Drei neue Seiten in `src/pages/`:
- `Impressum.tsx` (Route `/impressum`) — § 5 ECG-Inhalt:
  - Name: **[BITTE EINTRAGEN]** (Platzhalter, mit Hinweisbox)
  - Adresse: Venedigersiedlung 315, 5741 Neukirchen am Großvenediger
  - E-Mail: steinbockchalets@gmail.com
  - Telefon: +49 15757153466
- `Datenschutz.tsx` (Route `/datenschutz`) — DSGVO-Grundtext (Kontaktformular, Supabase-Hosting, Cookies, Rechte der Betroffenen).
- `AGB.tsx` (Route `/agb`) — Standard-Buchungs-AGB (Buchung, Zahlung, Stornierung, Haftung, Gerichtsstand).

Alle drei Seiten zweisprachig (DE/EN über i18n) und im bestehenden Warm/Holz-Stil mit Navigation + Footer.

Registrierung in `src/App.tsx` als neue `<Route>`-Einträge.

## 3. Dark Mode (`src/index.css`)

Den `.dark`-Block durch die vorgegebene warme Palette ersetzen (Holz-/Stein-Töne statt kaltem shadcn-Blau). Werte 1:1 übernommen wie im Prompt aufgelistet.

## 4. SEO-Verbesserungen (`src/pages/Index.tsx`)

- **og:image** in `<Helmet>` ergänzen (`https://steinbockchalets.com/og-preview.jpg` + `og:image:width/height`).
- **JSON-LD Schema.org** (`LodgingBusiness`) mit Name, Adresse, Telefon, E-Mail, Geo-Koordinaten, Sterne, Preisbereich.
- **`public/og-preview.jpg`**: ein bestehendes Galerie-/Hero-Bild als Fallback kopieren (1200×630).

## 5. Hero (`src/components/Hero.tsx`)

- Loading-State: sofort sichtbarer warmer Gradient-Hintergrund + Titel; `Loader2` nur noch klein in der Ecke als Overlay-Spinner.
- `aria-label="Zur nächsten Sektion scrollen"` am `ChevronDown`-Button.

## 6. .env / Git-Sicherheit

- `.env` zu `.gitignore` hinzufügen (falls nicht vorhanden).
- **Hinweis an dich**: Die in Git veröffentlichten Supabase-Schlüssel sollten in Lovable Cloud → Secrets rotiert/neu hinterlegt werden. Der **Anon Key** ist öffentlich unproblematisch (durch RLS geschützt), aber falls ein **Service-Role-Key** oder DB-Passwort committet wurde, **muss** dieser sofort rotiert werden.

## i18n-Ergänzungen

Neue Translation-Keys (DE+EN):
- `footer.followUs`, `footer.openInMaps`, `footer.aria.scrollTo*`
- `legal.imprint.*`, `legal.privacy.*`, `legal.terms.*`

## Technische Details

- **Routing**: React Router (`BrowserRouter` bereits aktiv) → drei neue `<Route path="/impressum|/datenschutz|/agb">` in `App.tsx` oberhalb der Catch-All-Route.
- **Footer-Links**: `import { Link } from "react-router-dom"`.
- **Icons**: `Instagram`, `Facebook` aus `lucide-react`.
- **og:image-Datei**: per `code--exec cp` aus `src/assets/` nach `public/og-preview.jpg`.
- **Helmet**: `react-helmet-async` ist bereits eingebunden (Index.tsx nutzt es).

## Was ich NICHT mache ohne deine Bestätigung

- **Echten Namen/Firmierung** im Impressum eintragen — bleibt `[BITTE EINTRAGEN]`, bis du ihn nennst.
- Social-Media-URLs sind **Platzhalter** — sag mir die echten Handles, falls abweichend.
