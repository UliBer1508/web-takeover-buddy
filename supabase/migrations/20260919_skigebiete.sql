-- Skigebiete: eine gemeinsame Liste für alle Häuser
-- Im SQL-Editor von wlmdjljyzdwvpqefwdmy ausführen, BEVOR der Code hochgeladen wird.
--
-- Entscheidung Uli (19.09.2026): Alle Häuser nutzen dieselben Skigebiete
-- (Venediger und Wald liegen ~1,6 km auseinander) → keine Zuordnung je Haus.
-- Gepflegt im Admin unter „Skigebiete“. Leere Felder werden auf der Website
-- nicht angezeigt (kein Ersatztext).
--
-- Startwerte: Recherche 19.09.2026. Vorrang haben Zahlen der Bergbahnen selbst;
-- wo es die nicht gab, die des Tourismusverbands (steht in facts_source).
-- Unsichere Werte bleiben LEER und werden von Uli nachgetragen.
-- Anfahrt (km/min) = Schätzung ab Neukirchen, bitte prüfen.

create table if not exists public.ski_areas (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  region_de       text,
  region_en       text,
  description_de  text,
  description_en  text,
  website_url     text,
  piste_map_url   text,          -- offizieller Pistenplan (PDF oder Seite)
  image_url       text,          -- eigenes Foto (Storage gallery/skigebiete/)
  elevation_min   integer,       -- m
  elevation_max   integer,       -- m
  slopes_km       numeric(5,1),  -- gesamt
  slopes_blue_km  numeric(5,1),
  slopes_red_km   numeric(5,1),
  slopes_black_km numeric(5,1),
  lifts           integer,
  season_de       text,
  season_en       text,
  distance_km     numeric(5,1),  -- Anfahrt ab den Chalets
  drive_minutes   integer,
  facts_as_of     date,          -- Stand der Zahlen
  facts_source    text,          -- Quelle (nur Admin)
  is_active       boolean not null default true,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.ski_areas enable row level security;

drop policy if exists "oeffentlich lesen" on public.ski_areas;
create policy "oeffentlich lesen" on public.ski_areas
  for select to anon, authenticated using (is_active);

drop policy if exists "admins lesen alles" on public.ski_areas;
create policy "admins lesen alles" on public.ski_areas
  for select to authenticated using (public.is_admin());

drop policy if exists "admins verwalten" on public.ski_areas;
create policy "admins verwalten" on public.ski_areas
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Startwerte (nur wenn die Tabelle noch leer ist) ------------------------------
insert into public.ski_areas
  (sort_order, name, region_de, region_en, website_url, piste_map_url,
   elevation_min, elevation_max, slopes_km, slopes_blue_km, slopes_red_km, slopes_black_km,
   lifts, season_de, season_en, distance_km, drive_minutes, facts_as_of, facts_source)
select * from (values
  (1, 'Wildkogel-Arena', 'Neukirchen & Bramberg', 'Neukirchen & Bramberg',
   'https://www.wildkogel-arena.at', null,
   null::int, null::int, 75::numeric, 35::numeric, 30::numeric, null::numeric,
   20, null, null, 3::numeric, 5,
   date '2026-09-19',
   '75 km: wildkogel-arena.at; 35/30 km und 20 Lifte: salzburgerland.com. Höhen uneinheitlich (820–2150 / 823–2129 / 2100) → leer. Kein offizieller Pistenplan-Link gefunden.'),
  (2, 'Zillertal Arena', 'Gerlos · Königsleiten · Zell am Ziller', 'Gerlos · Königsleiten · Zell am Ziller',
   'https://www.zillertalarena.com',
   'https://www.zillertalarena.com/fileadmin/userdaten/bilder/panorama-plaene/ZilleralArena-Winterpanorama-2627.pdf',
   575, 2500, 150, null, null, null,
   52, '04.12.2026 – 11.04.2027', 'Dec 4, 2026 – Apr 11, 2027', 20, 30,
   date '2026-09-19',
   'Alles zillertalarena.com (FAQ, Lifte & Pisten, Betriebszeiten, Pistenplan 2026/27). Belvilla-Angabe „52 km“ ist falsch (52 = Lifte).'),
  (3, 'KitzSki', 'Kitzbühel · Kirchberg · Pass Thurn', 'Kitzbühel · Kirchberg · Pass Thurn',
   'https://www.kitzski.at', 'https://map.kitzski.at/en/winter/',
   800, 2000, 233, null, null, null,
   57, null, null, 13, 15,
   date '2026-09-19',
   '57 Lifte: kitzski.at (Liftstatus); 233 km inkl. Skirouten: kitzbuehel.com; Höhen: tirol.at. Anfahrt: Panoramabahn Hollersbach → Resterhöhe.'),
  (4, 'Kitzsteinhorn · Maiskogel', 'Kaprun', 'Kaprun',
   'https://www.kitzsteinhorn.at', 'https://www.kitzsteinhorn.at/pdfs/panorama-winter.pdf',
   768, 3029, 62.5, null, null, null,
   24, 'ab 10.10.2026 (je nach Schnee)', 'from Oct 10, 2026 (snow permitting)', 55, 55,
   date '2026-09-19',
   'Alles kitzsteinhorn.at (Presse Winter 2026/27, Pistenplan).'),
  (5, 'Skicircus Saalbach Hinterglemm Leogang Fieberbrunn', 'Saalbach', 'Saalbach',
   'https://www.saalbach.com', 'https://www.saalbach.com/de/winter/skigebiet/pistenplan',
   null, null, 270, 140, 112, 18,
   70, '27.11.2026 – 04.04.2027', 'Nov 27, 2026 – Apr 4, 2027', 75, 70,
   date '2026-09-19',
   'Alles saalbach.com. Höhen dort nicht angegeben → leer.'),
  (6, 'Ski- & Gletscherwelt Zillertal 3000', 'Mayrhofen · Hintertuxer Gletscher', 'Mayrhofen · Hintertux Glacier',
   'https://www.hintertuxergletscher.at', 'https://www.hintertuxergletscher.at/de/skifahren/skigebietsinfo/pistenplaene/',
   630, 3250, 206, null, null, null,
   65, 'Gletscher ganzjährig · Mayrhofen 04.12.2026 – 11.04.2027', 'Glacier all year · Mayrhofen Dec 4, 2026 – Apr 11, 2027', 57, 70,
   date '2026-09-19',
   '206 km, 65 Lifte, 630–3250 m: tux.at / zillertal.at (Tourismus); Hintertux selbst: „über 200 km“. Saison: mayrhofen.at, hintertuxergletscher.at.')
) as v
where not exists (select 1 from public.ski_areas);

-- Kontrolle
select sort_order, name, slopes_km, lifts, elevation_min, elevation_max, distance_km, drive_minutes
from public.ski_areas order by sort_order;
