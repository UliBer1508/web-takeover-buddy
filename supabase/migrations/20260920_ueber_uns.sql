-- „Über uns“: Abschnitt über die Gastgeber (gilt für die ganze Website, nicht je Haus)
-- Im SQL-Editor von wlmdjljyzdwvpqefwdmy ausführen, BEVOR der Code hochgeladen wird.
--
-- Genau eine Zeile (id = true). Gepflegt im Admin unter „Über uns“.
-- Kein Startinhalt: Solange kein Text eingetragen und „anzeigen“ an ist, fehlen
-- Abschnitt und Menüpunkt „Über uns“ auf der Website (kein Ersatztext).

create table if not exists public.about_us (
  id          boolean primary key default true check (id),
  title_de    text,
  title_en    text,
  text_de     text,          -- Absätze durch Leerzeile getrennt
  text_en     text,
  image_url   text,          -- Foto (Storage gallery/ueber-uns/)
  is_active   boolean not null default false,
  updated_at  timestamptz not null default now()
);

alter table public.about_us enable row level security;

drop policy if exists "oeffentlich lesen" on public.about_us;
create policy "oeffentlich lesen" on public.about_us
  for select to anon, authenticated using (is_active);

drop policy if exists "admins lesen alles" on public.about_us;
create policy "admins lesen alles" on public.about_us
  for select to authenticated using (public.is_admin());

drop policy if exists "admins verwalten" on public.about_us;
create policy "admins verwalten" on public.about_us
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

insert into public.about_us (id) values (true) on conflict (id) do nothing;

-- Kontrolle
select id, is_active, title_de, left(text_de, 40) as text_de from public.about_us;
