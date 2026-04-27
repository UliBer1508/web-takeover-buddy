## 5 Wanderrouten unter dem Tab „Wandern"

Alle Touren starten in oder unmittelbar bei **Neukirchen am Großvenediger** und sind so gewählt, dass für jeden Gast etwas dabei ist – von kinderwagentauglich bis hochalpin.

### 1. Wanderung zur Berndlalm (leicht, klassisch)
- **Start:** Hopffeldboden / Obersulzbachtal-Parkplatz
- **Länge / Höhenmeter / Dauer:** ca. 6 km · 350 hm · 2 h hin
- **Charakter:** Familientauglich, breiter Almweg durch das wilde Obersulzbachtal, urige Alm mit Großvenediger-Blick
- **Highlights:** Sulzbach-Wasserfälle · Berndlalm-Kapelle · einkehrfreundlich
- **Quelle:** bergfex.at / outdooractive.com

### 2. Krimmler Wasserfälle – Wasserfallweg (leicht, ikonisch)
- **Start:** Krimml, Eingang Wasserfälle
- **Länge / Höhenmeter / Dauer:** ca. 4 km · 460 hm · 1,5–2 h
- **Charakter:** Höchste Wasserfälle Österreichs (380 m), gut ausgebaute Aussichtskanzeln
- **Highlights:** Drei Fallstufen · WasserWunderWelt · Tauernhaus oben als Einkehr
- **Quelle:** wasserfaelle-krimml.at

### 3. Smaragdweg im Habachtal (leicht-mittel, für Familien & Schatzsucher)
- **Start:** Habachtal-Parkplatz, Bramberg (Nachbarort)
- **Länge / Höhenmeter / Dauer:** ca. 13 km · 500 hm · 4 h
- **Charakter:** Themenweg entlang des Habachs durchs einzige Smaragdvorkommen Europas
- **Highlights:** Mineralien-Stationen · Schaubergwerk-Atmosphäre · Thurnerkaser-Alm
- **Quelle:** hohetauern.at / habachtal.at

### 4. Wildkogel-Gipfeltour (mittel, Panorama)
- **Start:** Bergstation Smaragdbahn (Auffahrt empfohlen) oder Talstation Neukirchen
- **Länge / Höhenmeter / Dauer:** ab Bergstation ca. 5 km · 350 hm · 2 h Rundweg
- **Charakter:** 360°-Panorama auf Hohe Tauern und Großvenediger
- **Highlights:** Gipfelkreuz Wildkogel (2.224 m) · Geißstein-Blick · Erlebniswelt am Berg
- **Quelle:** wildkogel-arena.at

### 5. Kürsingerhütte über Berndlalm (anspruchsvoll, hochalpin)
- **Start:** Hopffeldboden / Obersulzbachtal
- **Länge / Höhenmeter / Dauer:** ca. 13 km · 1.400 hm · 5–6 h hin
- **Charakter:** Aufstieg zur Schutzhütte (2.558 m) am Großvenediger – für trittsichere, geübte Wanderer
- **Highlights:** Großvenediger-Blick · Gletscherzunge · Übernachtung auf der Hütte möglich
- **Quelle:** bergwelten.com / outdooractive.com

## Umsetzung

Pro Tour ein TS-Modul wie bei den Radtouren (`src/content/info-articles/articles/`):
- `topic: "hiking"`
- `icon`: passend (`Footprints`, `Mountain`, `Droplet`/`Waves`, `Gem`, `Trees`)
- `gradient`: Fallback-Farbverlauf
- `coverImage` + 4-Bilder-Galerie (Unsplash, lizenzfrei)
- `stats`: Länge · Höhenmeter · Dauer · Schwierigkeit
- `sections`: Streckenverlauf · Highlights · Gut zu wissen
- `externalUrl`: Link zur Originalquelle (bergfex / wildkogel-arena / hohetauern.at etc.)

Keine Datenbankänderung nötig – die statische TS-Struktur bleibt erhalten (3. Normalform der DB unangetastet). Die Karten erscheinen automatisch unter dem **Wandern**-Tab in der Infogalerie und der Counter springt von 0 auf 5.

Sind die fünf Touren so passend? Falls du andere Routen bevorzugst (z. B. Postalm, Thüringer Hütte, Untersulzbachtal mit Wasserfall, Tauernhöhenweg-Etappe), einfach sagen – dann tauschen wir aus, bevor ich umsetze.