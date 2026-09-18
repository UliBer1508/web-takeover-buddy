-- Zwei Häuser auf steinbockchalets.com
--
-- WICHTIG: Vor dem Ausführen einmal nachsehen, wie die Häuser aktuell heißen:
--
--   select id, name, slug, is_active, sort_order, external_house_id
--   from public.houses order by sort_order;
--
-- Die UPDATE-Zeile unten ggf. auf den tatsächlichen Namen anpassen.

-- 1) Bestehendes Haus umbenennen -------------------------------------------
update public.houses
set name = 'Venediger Chalets'
where name in ('Steinbock Chalet', 'Venediger Chalet');

-- 2) Wald Chalet anlegen – zunächst ausgeschaltet ---------------------------
-- is_active = false: Das Haus existiert in der Datenbank, taucht aber nirgends
-- auf der Website auf. Freigeschaltet wird es später über den Schalter im
-- Admin-Bereich, nicht per SQL.
insert into public.houses (name, slug, is_active, sort_order, max_guests)
select 'Wald Chalet', 'wald', false, 2, 6
where not exists (select 1 from public.houses where slug = 'wald');

-- Preise und Gebühren bleiben absichtlich leer: Die trägst du im Admin über
-- die Hauseinstellungen ein, zusammen mit external_house_id (Kalender),
-- min_nights und den Check-in-/Check-out-Zeiten.

-- 3) Admins müssen auch ausgeschaltete Häuser sehen -------------------------
-- Der Schalter im Admin-Bereich liest ALLE Häuser, nicht nur die aktiven.
-- Falls die SELECT-Policy auf houses nur is_active = true zulässt, sieht ein
-- Admin das Wald Chalet nicht und kann es nicht einschalten.
--
-- Prüfen mit:
--   select policyname, cmd, qual from pg_policies
--   where schemaname = 'public' and tablename = 'houses';
--
-- Falls nötig, zusätzliche Policy für Admins:
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'houses'
      and policyname = 'Admins can view all houses'
  ) then
    create policy "Admins can view all houses"
      on public.houses
      for select
      to authenticated
      using (
        exists (
          select 1 from public.user_roles
          where user_roles.user_id = auth.uid()
            and user_roles.role = 'admin'
        )
      );
  end if;
end $$;
