## Ziel
Das versehentlich committete `.env` aus dem Git-Repository entfernen, `.gitignore` vervollständigen und eine `.env.example` als Vorlage erstellen.

## Schritte

1. **`.env` aus Git-Tracking entfernen**
   - `git rm --cached .env` ausführen, damit die Datei lokal erhalten bleibt, aber nicht mehr versioniert wird.

2. **`.gitignore` vervollständigen**
   - Prüfen, ob `.env`, `.env.local` und `.env.*.local` eingetragen sind.
   - Falls `.env.*.local` fehlt, ergänzen.

3. **`.env.example` erstellen**
   - Platzhalter-Datei mit denselben Variablennamen, aber ohne echte Werte:
     ```
     VITE_SUPABASE_URL="https://DEIN-PROJEKT.supabase.co"
     VITE_SUPABASE_PROJECT_ID="dein-projekt-id"
     VITE_SUPABASE_PUBLISHABLE_KEY="dein-anon-key"
     ```

4. **Commit**
   - Nachricht: `chore: remove .env from repo, add .env.example`

## Hinweis
- Die App funktioniert unverändert weiter, da die Umgebungsvariablen in Lovable intern hinterlegt sind.
- Die Supabase-Verbindungslogik im Code wird nicht geändert.

**Die Git-Befehle (`git rm --cached` und `git commit`) müssen anschließend manuell oder über GitHub ausgeführt werden.**