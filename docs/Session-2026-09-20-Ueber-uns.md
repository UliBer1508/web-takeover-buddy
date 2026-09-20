# Session 20.09.2026 — „Über uns“

**Anlass:** Uli (Screenshot): Klick auf „Über uns“ öffnet die Beschreibung des
Venediger-Hauses.

**Befund:** `Navigation.tsx` und `Footer.tsx` verlinkten „Über uns“ auf `#about`.
`#about` ist `About.tsx` = Beschreibung des gewählten Hauses. Einen Abschnitt über die
Gastgeber gab es nie (Überbleibsel aus der Ein-Haus-Zeit, als „Über uns“ = „über das Haus“ war).

**Entscheidung Uli:** echtes „Über uns“ bauen (statt umbenennen oder entfernen).

**Umgesetzt:**
- SQL `supabase/migrations/20260920_ueber_uns.sql`: Tabelle `about_us` (genau eine Zeile,
  `id = true`), Titel/Text de+en, Foto, `is_active`; RLS wie üblich. Startzeile leer + aus.
- `src/hooks/useAboutUs.ts` (`useAboutUs`, `aboutUsText`).
- `src/components/AboutUs.tsx`: Abschnitt `#ueber-uns`, in `Index.tsx` nach dem Anfrageformular,
  vor dem Footer (gilt für die ganze Website, daher außerhalb des Hausbereichs).
- `Navigation.tsx`, `Footer.tsx`: Link auf `#ueber-uns`, nur sichtbar wenn Inhalt da.
- Admin: Knopf „Über uns“ oben im Panel → `src/components/AboutUsDialog.tsx`.
- i18n: `navigation.about` de „Über Uns“ → „Über uns“ (Rechtschreibung).

**Prüfung:** Build ok, `tsc` 10 bekannte Fehler. Browser-Test mit nachgestellten Daten:
ohne Inhalt kein Menüpunkt und kein Abschnitt; mit Inhalt Menüpunkt da, Klick scrollt zu
`#ueber-uns`.

**Offen:** Text (de/en) und ggf. Foto liefert Uli im Admin.
