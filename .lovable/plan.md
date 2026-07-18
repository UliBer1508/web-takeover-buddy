## Ziel
Das Projekt mit einem externen GitHub-Repository verbinden, damit der Code auf GitHub synchronisiert und der GitHub-Link aktiv ist.

## Wichtiger Hinweis vorab
Lovable unterstützt **keinen Import bestehender GitHub-Repositories**. Die Integration erstellt immer ein **neues Repository** unter dem gewünschten GitHub-Account/Organization. Sollte ein bestimmtes, bereits existierendes GitHub-Repo verwendet werden müssen, ist das aktuell nicht möglich.

## Aktueller Stand
- Der Git-Remote zeigt nur auf Lovable's internen Storage (`git.private.lovable-gcp.code.storage`).
- GitHub-Sync ist nicht aktiv.
- **Kritisch**: Die Datei `.env` ist aktuell im Git-Repository enthalten. Bevor mit GitHub synchronisiert wird, muss sie aus dem Git-Tracking entfernt werden, sonst landen API-Keys und Secrets öffentlich auf GitHub.

## Schritte

### 1. Sicherheitsproblem beheben (vor GitHub-Verbindung)
- `.env` aus dem Git-Tracking entfernen (`git rm --cached .env`), damit sie lokal erhalten bleibt, aber nicht versioniert wird.
- `.gitignore` prüfen und sicherstellen, dass `.env`, `.env.local`, `.env.*.local` und ähnliche Dateien enthalten sind.
- `.env.example` als Vorlage mit leeren Platzhalterwerten erstellen.
- Commit vorbereiten: `chore: remove .env from repo, add .env.example`.

### 2. GitHub-Verbindung in Lovable herstellen (manuell im Editor)
Das muss der Benutzer im Lovable-Editor ausführen, da es OAuth-Autorisierung erfordert:
- Im Chat-Eingabefeld unten links auf **Plus (+)** → **GitHub** → **Connect project** klicken.
- Lovable GitHub App auf GitHub autorisieren.
- Gewünschten GitHub-Account/Organization auswählen.
- Repository-Namen festlegen (z. B. `steinbockchalets-website`).
- In Lovable auf **Create Repository** klicken.

### 3. Synchronisation prüfen
- Nach dem Verbinden sollte der Code automatisch nach GitHub gepusht werden.
- Überprüfen, ob der neue Git-Remote auf GitHub zeigt (`git remote -v`).
- Testen, ob eine Änderung in Lovable automatisch auf GitHub erscheint.

## Offene Fragen
1. Unter welchem GitHub-Account oder Organisation soll das Repository angelegt werden?
2. Welchen Repository-Namen möchtest du verwenden? (Vorschlag: `steinbockchalets-website`)
3. Soll die `.env`-Entfernung in diesem Zug mit erledigt werden, oder möchtest du das separat abwickeln?

## Technische Details
- Lovable erstellt ein neues GitHub-Repository und pusht den aktuellen Stand dorthin.
- Die Synchronisation läuft bidirektional: Änderungen in Lovable gehen zu GitHub, Änderungen auf GitHub (Pushes) kommen zurück zu Lovable.
- Datenbankinhalte werden **nicht** mit synchronisiert – nur der Code im Repository.
- Datenbank-Export ist separat möglich unter Cloud → Advanced settings → Export data.