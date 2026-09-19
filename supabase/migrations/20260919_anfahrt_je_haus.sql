-- Anfahrt je Haus
-- Im SQL-Editor von wlmdjljyzdwvpqefwdmy ausführen, BEVOR der Code hochgeladen wird.
--
-- Bisher stand die gesamte Anfahrt (Koordinaten, Plus Code, Route, Parken,
-- Anreise, Hinweise, zwei Bilder) fest im Code und galt nur für das
-- Venedigersiedlung Chalet. Ab jetzt liegt sie je Haus in dieser Tabelle und
-- wird im Admin unter "Anfahrt" gepflegt. Deutsch und Englisch getrennt;
-- ist ein englisches Feld leer, zeigt die englische Seite den deutschen Text.

-- 1) Tabelle ----------------------------------------------------------------
create table if not exists public.house_directions (
  house_id            uuid primary key references public.houses(id) on delete cascade,
  address             text,
  latitude            numeric(9,6),
  longitude           numeric(9,6),
  plus_code           text,
  warning_title_de    text,
  warning_title_en    text,
  warning_text_de     text,
  warning_text_en     text,
  steps_de            text[],
  steps_en            text[],
  parking_de          text,
  parking_en          text,
  by_car_de           text,
  by_car_en           text,
  airport_de          text,
  airport_en          text,
  train_station_de    text,
  train_station_en    text,
  winter_de           text,
  winter_en           text,
  house_image_url     text,
  map_image_url       text,
  map_caption_de      text,
  map_caption_en      text,
  updated_at          timestamptz not null default now()
);

alter table public.house_directions enable row level security;

-- Lesen nur für Häuser, die auf der Website sichtbar sind. Die Unterabfrage
-- auf houses unterliegt deren eigener Regel: Gäste sehen ausgeblendete Häuser
-- nicht - und damit auch deren Anfahrt nicht. Admins sehen alles.
drop policy if exists "oeffentlich lesen" on public.house_directions;
create policy "oeffentlich lesen" on public.house_directions
  for select to anon, authenticated
  using (exists (select 1 from public.houses h where h.id = house_id and h.is_active));

drop policy if exists "admins lesen alles" on public.house_directions;
create policy "admins lesen alles" on public.house_directions
  for select to authenticated using (public.is_admin());

drop policy if exists "admins verwalten" on public.house_directions;
create policy "admins verwalten" on public.house_directions
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- 2) Venedigersiedlung Chalet: die bisherigen Angaben übernehmen --------------
-- Erkannt über die Kalender-ID der Hausverwaltung (stabil, anders als Name/Slug).
-- Das Wald Chalet bekommt bewusst KEINE Werte: Venediger-Koordinaten beim Wald
-- würden Gäste zum falschen Haus schicken. Seine Anfahrt trägst du im Admin ein.
insert into public.house_directions (
  house_id, address, latitude, longitude, plus_code,
  warning_title_de, warning_title_en, warning_text_de, warning_text_en,
  steps_de, steps_en,
  parking_de, parking_en, by_car_de, by_car_en,
  airport_de, airport_en, train_station_de, train_station_en,
  winter_de, winter_en,
  house_image_url, map_image_url
)
select
  h.id,
  'Venedigersiedlung 316, 5741 Neukirchen am Großvenediger',
  47.249878, 12.254109, '67X3+XJ5',
  'Nicht die Adresse ins Navi eingeben',
  'Do not enter the street address',
  'Manche Navigationsgeräte führen bei der Adresssuche zu einem Nachbargebäude. Verwenden Sie bitte die Koordinaten oder den Plus Code.',
  'Some navigation systems lead to a neighbouring building when searching by address. Please use the coordinates or the Plus Code.',
  array[
    'Auf der B165 (Gerlos Straße) bis Neukirchen am Großvenediger.',
    'Hinter Neukirchen beim Hotel Venedigerblick rechts abbiegen.',
    'Durch die S-Kurve bis zur Weggabelung, dort scharf rechts.',
    'Das Chalet ist auf der linken Straßenseite bereits zu sehen — siehe Foto oben.'
  ],
  array[
    'Take the B165 (Gerlos Straße) to Neukirchen am Großvenediger.',
    'Just past Neukirchen, turn right at Hotel Venedigerblick.',
    'Follow the S-bend to the fork in the road, then turn sharp right.',
    'The chalet is already visible on the left-hand side — see the photo above.'
  ],
  'Stellplätze befinden sich direkt am Haus.',
  'Parking spaces are available directly at the house.',
  'Über die B165 (Gerlos Straße).',
  'Via the B165 (Gerlos Straße).',
  'Salzburg, ca. 1,5 Stunden',
  'Salzburg, approx. 1.5 hours',
  'Mittersill',
  'Mittersill',
  'Winterreifen sind in Österreich von 1. November bis 15. April vorgeschrieben.',
  'Winter tyres are mandatory in Austria from 1 November to 15 April.',
  '/chalet-anfahrt.jpg',
  '/anfahrt-karte.jpg'
from public.houses h
where h.external_house_id = 'f5b4588b-96cf-46f7-b84a-5f6750f7088e'
on conflict (house_id) do nothing;

-- Kontrolle: Venediger mit Koordinaten, Wald ohne Zeile
select h.name, d.address, d.latitude, d.longitude, d.plus_code,
       coalesce(array_length(d.steps_de, 1), 0) as schritte
from public.houses h
left join public.house_directions d on d.house_id = h.id
order by h.sort_order;
