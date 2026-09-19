-- "In der Nähe": Orte rund um jedes Haus
-- Im SQL-Editor von wlmdjljyzdwvpqefwdmy ausführen, BEVOR der Code hochgeladen wird.
--
-- Eine Zeile je Ort und Haus. Gepflegt im Admin unter "Umgebung"; dort lassen
-- sich Vorschläge aus OpenStreetMap laden, prüfen und übernehmen.
-- Die Entfernung wird NICHT gespeichert, sondern auf der Website aus den
-- Koordinaten des Hauses (house_directions) und des Orts berechnet (Luftlinie).
-- Kategorien = feste Liste mit Symbol und Beschriftung (de/en) im Code.

create table if not exists public.house_places (
  id          uuid primary key default gen_random_uuid(),
  house_id    uuid not null references public.houses(id) on delete cascade,
  category    text not null check (category in (
                'bakery','cafe','supermarket','doctor','hospital','pharmacy',
                'restaurant','spa','ski_lift','bus_stop','fuel','ev_charging')),
  name        text not null,
  latitude    numeric(9,6) not null,
  longitude   numeric(9,6) not null,
  note_de     text,
  note_en     text,
  url         text,
  osm_id      text,          -- z. B. "node/123456"; verhindert doppelte Übernahme
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists house_places_haus_idx on public.house_places (house_id, category);
create unique index if not exists house_places_osm_uniq on public.house_places (house_id, osm_id)
  where osm_id is not null;

alter table public.house_places enable row level security;

drop policy if exists "oeffentlich lesen" on public.house_places;
create policy "oeffentlich lesen" on public.house_places
  for select to anon, authenticated
  using (exists (select 1 from public.houses h where h.id = house_id and h.is_active));

drop policy if exists "admins lesen alles" on public.house_places;
create policy "admins lesen alles" on public.house_places
  for select to authenticated using (public.is_admin());

drop policy if exists "admins verwalten" on public.house_places;
create policy "admins verwalten" on public.house_places
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Kontrolle
select h.name, count(p.id) as orte
from public.houses h left join public.house_places p on p.house_id = h.id
group by h.name order by h.name;
