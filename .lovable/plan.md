## Ziel

Zusätzlich zu den 3 bestehenden Skigebieten (Wildkogel, Zillertal Arena/Königsleiten, Saalbach) **9 weitere Skigebiete** als Karten in der Info-Galerie ergänzen — jeweils mit echten Fotos (CC-lizenziert von Wikimedia Commons).

## Neue Skigebiete

| # | Skigebiet | Entfernung | Besonderheit |
|---|-----------|------------|--------------|
| 1 | KitzSki – Kitzbühel & Kirchberg | ~60 km | Hahnenkamm, 233 km Pisten |
| 2 | Kitzsteinhorn Kaprun | ~50 km | Gletscher, ganzjährig, 3.029 m |
| 3 | Schmittenhöhe Zell am See | ~45 km | Seenpanorama, 77 km |
| 4 | Hochkönig (Maria Alm/Dienten/Mühlbach) | ~70 km | Königstour, Ski amadé |
| 5 | Großarltal & Dorfgastein | ~90 km | „Tal der Almen" |
| 6 | Mayrhofen & Hintertuxer Gletscher | ~80 km | Harakiri, Ski 365 Tage |
| 7 | Obertauern | ~130 km | Schneesicherstes A-Gebiet |
| 8 | Skigebiet Rauris (Hochalmbahnen) | ~75 km | Familiär, Nationalpark |
| 9 | Snow Space Salzburg (Flachau/Wagrain/St. Johann) | ~110 km | FIS Nightrace, Ski amadé |

## Bilder

Bereits heruntergeladen (CC-lizenziert von Wikimedia Commons, valide JPG-Dateien zwischen 170 KB – 920 KB) in `src/assets/skiing/`:
- `kitzbuehel-hahnenkamm.jpg`, `kitzbuehel-may.jpg`
- `kitzsteinhorn.jpg`
- `schmittenhoehe.jpg`, `schmittenhoehe-zellsee.jpg`
- `hochkoenig-mariaalm.jpg`
- `grossarltal.jpg`
- `mayrhofen-penken.jpg`, `hintertux-gletscher.jpg`, `hintertux-piste.jpg`
- `obertauern.jpg`
- `rauris-hochalm.jpg`
- `flachau.jpg`

## Technische Umsetzung

1. **9 neue Artikel-Dateien** in `src/content/info-articles/articles/` (`kitzski-kitzbuehel.ts`, `kitzsteinhorn.ts`, `schmittenhoehe.ts`, `hochkoenig.ts`, `grossarltal.ts`, `mayrhofen-hintertux.ts`, `obertauern.ts`, `rauris.ts`, `snow-space-flachau.ts`) — alle mit `topic: "skiing"`, lokalisierten Titeln, Stats (Pisten-km, Höhenmeter, Entfernung), Highlights und externem Link zur offiziellen Tourismus-Webseite.
2. **Registrierung** in `src/content/info-articles/index.ts`: 9 Imports + 9 Einträge im `infoArticles`-Array.
3. **Quellenangabe**: jede Karte zeigt `sourceLabel` (offizielle Webseite + Wikimedia Commons).

## Ergebnis

Nach der Implementierung enthält die Info-Galerie unter Filter „Ski" **12 Karten** statt bisher 3.
