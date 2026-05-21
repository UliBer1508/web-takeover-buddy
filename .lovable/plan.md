## Ziel

Komplette Migration weg von Lovable Cloud — **alle Daten, Auth und Bilder ausschließlich im externen Supabase** (`usblrulkcgucxtkhugck`). Damit fallen für Lovable Cloud keine Storage-/DB-/Auth-Kosten mehr an.

## Ausgangslage (Ist-Zustand)

Aktuell ist die App ein Mischbetrieb, obwohl laut Projektgedächtnis nur das externe Supabase genutzt werden soll:

- **Lovable Cloud** (`xcohqbdgzprkixeycdhk`) — wird benutzt von: `Hero`, `Gallery`, `ImageUploadDialog` (Storage-Bucket `gallery`), `ImageEditDialog`, `Testimonials`, `PromotionBanner`, `PromotionSettingsEmbedded`, `HouseSelector`, `HouseSettingsDialog`, `ReviewAddDialog`, `ReviewEditDialog`, `useAuth`, `useAdmin`, `useHouseSelection`, `Auth`-Page, sowie das parallele Schreiben in `BookingForm`.
- **External Supabase** — wird nur benutzt für: `AvailabilityCalendar` (Lesen) und `BookingForm` (zusätzliches Schreiben).

Bilder liegen im Lovable-Cloud-Bucket `gallery`, die DB-Tabelle `gallery_images` (mit URLs) liegt in Lovable Cloud.

## Plan

### 1. Externes Supabase vorbereiten
- Prüfen, welche Tabellen/Policies/Functions im externen Projekt bereits existieren (`houses`, `gallery_images`, `reviews`, `promotions`, `booking_inquiries`, `booking_statuses`, `categories`, `seasons`, `user_roles`, Funktionen `is_admin` / `has_role`).
- Fehlende Tabellen + RLS-Policies + Trigger im externen Supabase neu anlegen, identisches Schema wie heute in Lovable Cloud (3NF beibehalten, Foreign Keys ergänzen wo heute fehlend).
- Storage-Bucket `gallery` (public) im externen Supabase anlegen inkl. Policies (Public Read, Admin Write/Delete).

### 2. Daten- und Bild-Migration
- Einmaliges Migrationsskript (Node, lokal mit Service-Role-Keys beider Projekte):
  1. Alle Rows aus Lovable-Cloud-Tabellen lesen und ins externe Supabase einfügen (mit gleichen UUIDs).
  2. Alle Dateien aus Lovable-Cloud-Bucket `gallery` herunterladen und in den externen Bucket hochladen.
  3. URLs in `gallery_images.url` von alter Cloud-Domain auf neue externe Domain umschreiben.
- Stichprobenprüfung: Bilder im Frontend laden, Buchungen sichtbar, Reviews sichtbar.

### 3. Code-Umstellung auf einen einzigen Client
- `src/integrations/external-supabase/client.ts` wird zum **einzigen aktiven Client** für die App. Datei mit generierten Types versehen (oder vorerst untypisiert lassen).
- Globaler Refactor: alle `import { supabase } from "@/integrations/supabase/client"` → `import { supabase } from "@/integrations/external-supabase/client"` (Re-Export unter altem Pfad, damit kein Massen-Diff nötig ist).
- `BookingForm`: doppeltes Schreiben entfernen, nur noch externer Insert.
- `useAuth` / `useAdmin` / `Auth`-Page: nutzen jetzt externe Auth. Bestehende Admin-User muss im externen Supabase neu angelegt werden (Magic Link oder Passwort).

### 4. Lovable Cloud abklemmen
- `.env`-Variablen (`VITE_SUPABASE_URL`, …) im Code nicht mehr verwenden.
- Hinweis an dich: Lovable Cloud lässt sich nachträglich nicht „abschalten", verursacht aber ohne Nutzung keine Kosten — der freie $25-Topf bleibt ungenutzt.

### 5. Sicherheit & Cleanup
- Externer Anon-Key bleibt im Frontend (ist publishable, RLS schützt).
- Sicherstellen, dass externer Service-Role-Key **nie** ins Repo gelangt — wird nur lokal für das Migrationsskript benutzt.
- `gallery_images` Foreign Keys (`house_id`, `season_id`, `category_id`) im externen Supabase als echte FKs anlegen — derzeit fehlen sie und verletzen die 3NF-Vorgabe.

## Was du dafür brauchst / entscheiden musst

1. **Service-Role-Keys**: Ich brauche Zugriff (über Lovable-Secrets, nicht im Code) auf
   - Lovable Cloud Service-Role (zum Auslesen/Download)
   - Externer Supabase Service-Role (zum Schreiben/Upload)
   Alternativ kannst du das Migrationsskript lokal selbst ausführen — ich liefere es dir fertig.
2. **Admin-User**: Soll dein heutiger Admin-Login im externen Supabase mit gleicher E-Mail neu angelegt werden?
3. **Reihenfolge**: Soll ich erst Schritt 1+2 (Schema + Datenmigration) machen und dir zur Prüfung zeigen, bevor ich Schritt 3 (Code-Switch) ausführe? Empfohlen: ja, sonst ist die Seite während der Umstellung leer.

## Technische Details

- Re-Export-Trick in `src/integrations/supabase/client.ts`:
  ```ts
  export { externalSupabase as supabase } from '../external-supabase/client';
  ```
  → minimal-invasiv, Types werden untypisiert bis wir `supabase gen types` gegen das externe Projekt laufen lassen.
- Migrationsskript-Reihenfolge wegen FKs: `seasons`, `categories`, `booking_statuses`, `houses` → `gallery_images`, `promotions`, `reviews`, `booking_inquiries` → `user_roles`.
- Storage-Migration via `supabase.storage.from('gallery').list()` + `download()` + Upload in Ziel-Bucket; URLs in DB anschließend per `UPDATE` umsetzen.
- Lovable-Cloud-spezifische Edge Functions (falls vorhanden) bleiben außen vor — aktuell sind keine in Nutzung erkennbar.
