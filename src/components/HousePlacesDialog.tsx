import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PLACE_CATEGORIES, placeCategory, entfernungKm, formatKm } from "@/lib/placeCategories";
import type { HousePlace } from "@/hooks/useHousePlaces";

interface HousePlacesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  houseId: string | null;
  houseName: string;
}

interface Zeile {
  id?: string;
  category: string;
  name: string;
  latitude: string;
  longitude: string;
  note_de: string;
  note_en: string;
  url: string;
  osm_id: string | null;
}

interface Vorschlag {
  osm_id: string;
  category: string;
  name: string;
  latitude: number;
  longitude: number;
  km: number;
  ort: string;
}

const ausDb = (p: HousePlace): Zeile => ({
  id: p.id, category: p.category, name: p.name,
  latitude: String(p.latitude), longitude: String(p.longitude),
  note_de: p.note_de ?? "", note_en: p.note_en ?? "", url: p.url ?? "", osm_id: p.osm_id,
});

/**
 * "Umgebung" eines Hauses: Orte fuer den Abschnitt "In der Naehe" pflegen.
 * Vorschlaege kommen aus OpenStreetMap (Overpass-API, Abfrage im Browser des
 * Admins, Umkreis je Kategorie). Gespeichert wird nur, was angehakt wurde.
 */
const HousePlacesDialog = ({ open, onOpenChange, houseId, houseName }: HousePlacesDialogProps) => {
  const queryClient = useQueryClient();
  const [zeilen, setZeilen] = useState<Zeile[]>([]);
  const [mitte, setMitte] = useState<{ lat: number; lon: number } | null>(null);
  const [laedt, setLaedt] = useState(false);
  const [speichert, setSpeichert] = useState(false);
  const [sucht, setSucht] = useState(false);
  const [vorschlaege, setVorschlaege] = useState<Vorschlag[]>([]);
  const [gewaehlt, setGewaehlt] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open || !houseId) return;
    setLaedt(true);
    setVorschlaege([]);
    setGewaehlt(new Set());
    Promise.all([
      (supabase as any).from("house_places").select("*").eq("house_id", houseId).order("sort_order"),
      (supabase as any).from("house_directions").select("latitude, longitude").eq("house_id", houseId).maybeSingle(),
    ]).then(([orte, anfahrt]: any[]) => {
      if (orte.error) toast({ title: "Konnte nicht geladen werden", description: orte.error.message, variant: "destructive" });
      setZeilen(((orte.data || []) as HousePlace[]).map(ausDb));
      const d = anfahrt.data;
      setMitte(d?.latitude != null && d?.longitude != null ? { lat: Number(d.latitude), lon: Number(d.longitude) } : null);
      setLaedt(false);
    });
  }, [open, houseId]);

  const aendern = (i: number, teil: Partial<Zeile>) =>
    setZeilen(l => l.map((z, j) => (j === i ? { ...z, ...teil } : z)));

  const vorhandeneOsm = useMemo(() => new Set(zeilen.map(z => z.osm_id).filter(Boolean)), [zeilen]);

  const vorschlaegeLaden = async () => {
    if (!mitte) return;
    setSucht(true);
    try {
      const teile = PLACE_CATEGORIES.flatMap(k =>
        k.osm.map(f => `${f}(around:${k.radius},${mitte.lat},${mitte.lon});`)
      );
      const abfrage = `[out:json][timeout:60];(${teile.join("")});out center tags;`;
      const antwort = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: new URLSearchParams({ data: abfrage }),
      });
      if (!antwort.ok) throw new Error(`OpenStreetMap antwortet mit ${antwort.status}. Bitte später erneut versuchen.`);
      const json = await antwort.json();

      const passt = (tags: Record<string, string>, key: string): boolean => {
        switch (key) {
          case "supermarket": return /^(supermarket|convenience)$/.test(tags.shop ?? "");
          case "bakery": return tags.shop === "bakery";
          case "restaurant": return /^(restaurant|fast_food)$/.test(tags.amenity ?? "");
          case "cafe": return /^(cafe|bar|pub)$/.test(tags.amenity ?? "");
          case "doctor": return /^(doctors|clinic)$/.test(tags.amenity ?? "") || tags.healthcare === "doctor";
          case "hospital": return tags.amenity === "hospital";
          case "pharmacy": return tags.amenity === "pharmacy";
          case "spa": return /^(spa|sauna|water_park)$/.test(tags.leisure ?? "") || tags.amenity === "public_bath";
          case "ski_lift": return tags.aerialway === "station";
          case "bus_stop": return tags.highway === "bus_stop";
          case "fuel": return tags.amenity === "fuel";
          case "ev_charging": return tags.amenity === "charging_station";
          default: return false;
        }
      };

      const liste: Vorschlag[] = [];
      for (const el of json.elements || []) {
        const tags = el.tags || {};
        const lat = el.lat ?? el.center?.lat;
        const lon = el.lon ?? el.center?.lon;
        if (lat == null || lon == null) continue;
        const kat = PLACE_CATEGORIES.find(k => passt(tags, k.key));
        if (!kat) continue;
        const name = tags.name || tags.brand || tags.operator;
        if (!name) continue;
        const osm_id = `${el.type}/${el.id}`;
        if (vorhandeneOsm.has(osm_id)) continue;
        // gleicher Name + Kategorie im Umkreis von 200 m (z. B. Bushaltestelle je Fahrtrichtung) nur einmal
        if (liste.some(v => v.category === kat.key && v.name === name && entfernungKm(v.latitude, v.longitude, lat, lon) < 0.2)) continue;
        liste.push({
          osm_id, category: kat.key, name, latitude: lat, longitude: lon,
          km: entfernungKm(mitte.lat, mitte.lon, lat, lon),
          ort: tags["addr:city"] || tags["addr:place"] || "",
        });
      }
      liste.sort((a, b) => a.category.localeCompare(b.category) || a.km - b.km);
      setVorschlaege(liste);
      if (liste.length === 0) toast({ title: "Keine neuen Vorschläge gefunden" });
    } catch (error: any) {
      toast({ title: "Vorschläge konnten nicht geladen werden", description: error?.message, variant: "destructive" });
    } finally {
      setSucht(false);
    }
  };

  const uebernehmen = () => {
    const neu = vorschlaege.filter(v => gewaehlt.has(v.osm_id)).map<Zeile>(v => ({
      category: v.category, name: v.name,
      latitude: v.latitude.toFixed(6), longitude: v.longitude.toFixed(6),
      note_de: "", note_en: "", url: "", osm_id: v.osm_id,
    }));
    setZeilen(z => [...z, ...neu]);
    setVorschlaege(v => v.filter(x => !gewaehlt.has(x.osm_id)));
    setGewaehlt(new Set());
  };

  const speichern = async () => {
    if (!houseId) return;
    const ungueltig = zeilen.find(z => !z.name.trim() || isNaN(Number(z.latitude)) || isNaN(Number(z.longitude)) || !z.latitude || !z.longitude);
    if (ungueltig) {
      toast({ title: "Eintrag unvollständig", description: "Jeder Ort braucht Name, Breite und Länge.", variant: "destructive" });
      return;
    }
    setSpeichert(true);
    try {
      const { error: e1 } = await (supabase as any).from("house_places").delete().eq("house_id", houseId);
      if (e1) throw e1;
      if (zeilen.length > 0) {
        const { error: e2 } = await (supabase as any).from("house_places").insert(
          zeilen.map((z, i) => ({
            house_id: houseId,
            category: z.category,
            name: z.name.trim(),
            latitude: Number(z.latitude),
            longitude: Number(z.longitude),
            note_de: z.note_de.trim() || null,
            note_en: z.note_en.trim() || null,
            url: z.url.trim() || null,
            osm_id: z.osm_id,
            sort_order: i,
          }))
        );
        if (e2) throw e2;
      }
      queryClient.invalidateQueries({ queryKey: ["house-places"] });
      toast({ title: "Gespeichert", description: `${houseName}: ${zeilen.length} Orte in der Umgebung.` });
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Konnte nicht gespeichert werden", description: error?.message ?? "Unbekannter Fehler.", variant: "destructive" });
    } finally {
      setSpeichert(false);
    }
  };

  const km = (lat: string, lon: string) =>
    mitte && lat && lon && !isNaN(Number(lat)) && !isNaN(Number(lon))
      ? formatKm(entfernungKm(mitte.lat, mitte.lon, Number(lat), Number(lon)), "de")
      : "–";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Umgebung — {houseName}</DialogTitle>
          <DialogDescription>
            Orte für den Abschnitt „In der Nähe“. Entfernung = Luftlinie ab den Koordinaten
            aus der Anfahrt. Hinweis optional, z. B. „Brötchen-Lieferservice“.
          </DialogDescription>
        </DialogHeader>

        {laedt ? (
          <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" /><span className="text-sm">Wird geladen…</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Vorschlaege */}
            <section className="rounded-lg border p-3 space-y-3 bg-muted/30">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold">Vorschläge aus OpenStreetMap</h3>
                <Button variant="outline" size="sm" onClick={vorschlaegeLaden} disabled={!mitte || sucht}>
                  {sucht ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                  Vorschläge laden
                </Button>
              </div>
              {!mitte && (
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Zuerst unter „Anfahrt“ Breite und Länge des Hauses eintragen.
                </p>
              )}
              {vorschlaege.length > 0 && (
                <>
                  <div className="max-h-72 overflow-y-auto divide-y border rounded-md bg-background">
                    {vorschlaege.map(v => {
                      const k = placeCategory(v.category);
                      const Symbol = k?.icon;
                      return (
                        <label key={v.osm_id} htmlFor={`vorschlag-${v.osm_id}`} className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-muted/40">
                          <input
                            id={`vorschlag-${v.osm_id}`}
                            type="checkbox"
                            className="h-4 w-4 accent-primary"
                            checked={gewaehlt.has(v.osm_id)}
                            onChange={() => setGewaehlt(s => { const n = new Set(s); n.has(v.osm_id) ? n.delete(v.osm_id) : n.add(v.osm_id); return n; })}
                          />
                          {Symbol && <Symbol className="h-4 w-4 shrink-0" style={{ color: k!.color }} />}
                          <span className="flex-1 min-w-0 truncate">{v.name}{v.ort && <span className="text-muted-foreground"> · {v.ort}</span>}</span>
                          <span className="text-xs text-muted-foreground tabular-nums">{formatKm(v.km, "de")}</span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm" onClick={uebernehmen} disabled={gewaehlt.size === 0}>
                      {gewaehlt.size} übernehmen
                    </Button>
                  </div>
                </>
              )}
            </section>

            {/* Gespeicherte Orte */}
            <section className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">Orte ({zeilen.length})</h3>
                <Button variant="outline" size="sm" onClick={() => setZeilen([...zeilen, {
                  category: "supermarket", name: "", latitude: "", longitude: "", note_de: "", note_en: "", url: "", osm_id: null,
                }])}>
                  <Plus className="h-4 w-4 mr-1" />Von Hand hinzufügen
                </Button>
              </div>
              {zeilen.length === 0 && (
                <p className="text-sm text-muted-foreground border rounded-lg px-3 py-4">
                  Noch keine Orte — die Website zeigt den Abschnitt „In der Nähe“ für dieses Haus nicht an.
                </p>
              )}
              {zeilen.map((z, i) => (
                <div key={z.id ?? z.osm_id ?? `neu-${i}`} className="border rounded-lg p-2.5 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={z.category}
                      onChange={e => aendern(i, { category: e.target.value })}
                      aria-label="Kategorie"
                      className="h-9 rounded-md border bg-background px-2 text-sm"
                    >
                      {PLACE_CATEGORIES.map(k => <option key={k.key} value={k.key}>{k.key}</option>)}
                    </select>
                    <Input className="flex-1 min-w-[10rem]" value={z.name} placeholder="Name" aria-label="Name"
                      onChange={e => aendern(i, { name: e.target.value })} />
                    <span className="text-xs text-muted-foreground tabular-nums w-16 text-right">{km(z.latitude, z.longitude)}</span>
                    <Button variant="ghost" size="icon" aria-label="Entfernen" onClick={() => setZeilen(zeilen.filter((_, j) => j !== i))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
                    <Input value={z.latitude} placeholder="Breite" aria-label="Breite" inputMode="decimal"
                      onChange={e => aendern(i, { latitude: e.target.value.replace(",", ".") })} />
                    <Input value={z.longitude} placeholder="Länge" aria-label="Länge" inputMode="decimal"
                      onChange={e => aendern(i, { longitude: e.target.value.replace(",", ".") })} />
                    <Input value={z.note_de} placeholder="Hinweis Deutsch" aria-label="Hinweis Deutsch"
                      onChange={e => aendern(i, { note_de: e.target.value })} />
                    <Input value={z.note_en} placeholder="Hinweis Englisch" aria-label="Hinweis Englisch"
                      onChange={e => aendern(i, { note_en: e.target.value })} />
                    <Input value={z.url} placeholder="Link (optional)" aria-label="Link"
                      onChange={e => aendern(i, { url: e.target.value })} />
                  </div>
                </div>
              ))}
            </section>
            <Label className="sr-only">Umgebung</Label>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-3 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
          <Button onClick={speichern} disabled={speichert || laedt}>{speichert ? "Speichert…" : "Speichern"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HousePlacesDialog;
