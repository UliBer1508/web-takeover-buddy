## Ziel

In der Info-Galerie erscheinen aktuell nur Rad- und Wander-Karten. Die Filter "Skifahren" und "Kultur" sind leer. Wir ergänzen je **3 Karten** mit **echten Fotos** der Skigebiete bzw. Kulturziele in der Region rund um Neukirchen am Großvenediger.

## Neue Artikel

### Skifahren (3 Karten)
1. **Skiarena Wildkogel** – Hausberg-Skigebiet von Neukirchen/Bramberg, 75 km Pisten
2. **Smaragd-Skischaukel Königsleiten–Gerlos (Zillertal Arena)** – verbundenes Großskigebiet
3. **Weltcuporte Hinterglemm/Saalbach** – Skicircus, ca. 45 Min. Anfahrt

### Kultur (3 Karten)
1. **Nationalparkzentrum Hohe Tauern (Mittersill)** – interaktive Erlebnisausstellung
2. **Bramberg Smaragd- & Heimatmuseum** – größte Bergkristall-/Smaragd-Sammlung Europas
3. **Felberturm-Museum Mittersill** – ältestes Heimatmuseum des Pinzgaus, Saumhandel über die Tauern

## Bildquellen (echte Fotos)

Für jede Karte 3–5 reale Fotos – analog zum bisherigen Vorgehen mit Stockenbaumalm/Baumgartenalm:

| Artikel | Quelle |
|---|---|
| Skiarena Wildkogel | wildkogel-arena.at (offizielle Bildergalerie) |
| Königsleiten/Gerlos | zillertalarena.com / koenigsleiten.com |
| Saalbach Hinterglemm | saalbach.com (Mediencenter) |
| Nationalparkzentrum | nationalparkzentrum.at |
| Bramberg Museum | museumbramberg.at |
| Felberturm | felberturmmuseum.at |

Falls ein Quellbild nicht abrufbar ist, weiche ich auf Wikimedia Commons (CC BY-SA) für das jeweilige Motiv aus.

## Vorgehen technisch

1. Fotos je Quelle herunterladen → `src/assets/skiing/` und `src/assets/culture/` (neue Ordner)
2. Pro Artikel eine Datei in `src/content/info-articles/articles/` anlegen, identische Struktur wie bestehende Artikel:
   - `topic: "skiing"` bzw. `"culture"`
   - passendes Lucide-Icon (z. B. `Snowflake`, `Mountain`, `Landmark`, `Gem`)
   - `coverImage`, `gallery` (3–4 Bilder), `stats`, `sections`, `externalUrl`
3. Alle 6 Artikel in `src/content/info-articles/index.ts` registrieren
4. TypeScript-Build prüfen (`bunx tsc --noEmit`)

Keine Änderungen an UI-Komponenten oder Filterlogik nötig – die Karten erscheinen automatisch unter den Filtern „Skifahren" und „Kultur".

## Bestätigung

Soll ich mit diesen 6 Artikeln (3 Ski + 3 Kultur) und den genannten Quellen starten? Falls du andere Skigebiete oder Kulturziele bevorzugst (z. B. Kitzbüheler Alpen, Krimmler Tauernhaus, Talmuseum Wald), sag kurz Bescheid.