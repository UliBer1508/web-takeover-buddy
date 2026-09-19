import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2, ArrowUp, ArrowDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { skiAreaAusDb } from "@/hooks/useSkiAreas";

interface SkiAreasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Formularzustand: alles als Text, damit leere Felder leer bleiben. */
type Gebiet = { id?: string; is_active: boolean } & Record<(typeof TEXTE)[number] | (typeof ZAHLEN)[number], string>;

const TEXTE = [
  "name", "region_de", "region_en", "description_de", "description_en", "website_url",
  "piste_map_url", "image_url", "season_de", "season_en", "facts_as_of", "facts_source",
] as const;
const ZAHLEN = [
  "elevation_min", "elevation_max", "slopes_km", "slopes_blue_km", "slopes_red_km",
  "slopes_black_km", "lifts", "distance_km", "drive_minutes",
] as const;
const GANZZAHL = new Set(["elevation_min", "elevation_max", "lifts", "drive_minutes"]);

const leer = (): Gebiet => {
  const g: any = { is_active: true };
  [...TEXTE, ...ZAHLEN].forEach(k => (g[k] = ""));
  g.facts_as_of = new Date().toISOString().slice(0, 10);
  return g;
};

const ausDb = (z: any): Gebiet => {
  const r = skiAreaAusDb(z) as any;
  const g: any = { id: r.id, is_active: r.is_active };
  [...TEXTE, ...ZAHLEN].forEach(k => (g[k] = r[k] == null ? "" : String(r[k])));
  return g;
};

/**
 * Admin: Skigebiete (gemeinsam für alle Häuser). Links Liste, rechts Formular
 * des gewählten Gebiets. Speichern schreibt alle Gebiete (Reihenfolge = Liste)
 * und löscht entfernte.
 */
const SkiAreasDialog = ({ open, onOpenChange }: SkiAreasDialogProps) => {
  const queryClient = useQueryClient();
  const [gebiete, setGebiete] = useState<Gebiet[]>([]);
  const [geloescht, setGeloescht] = useState<string[]>([]);
  const [aktiv, setAktiv] = useState(0);
  const [laedt, setLaedt] = useState(false);
  const [speichert, setSpeichert] = useState(false);
  const [hochladen, setHochladen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLaedt(true);
    setGeloescht([]);
    setAktiv(0);
    (supabase as any).from("ski_areas").select("*").order("sort_order").then(({ data, error }: any) => {
      if (error) toast({ title: "Skigebiete konnten nicht geladen werden", description: error.message, variant: "destructive" });
      setGebiete((data || []).map(ausDb));
      setLaedt(false);
    });
  }, [open]);

  const g = gebiete[aktiv];
  const setze = (k: string, v: string | boolean) =>
    setGebiete(l => l.map((x, i) => (i === aktiv ? { ...x, [k]: v } : x)));

  const verschieben = (von: number, nach: number) => {
    if (nach < 0 || nach >= gebiete.length) return;
    const l = [...gebiete];
    const [x] = l.splice(von, 1);
    l.splice(nach, 0, x);
    setGebiete(l);
    setAktiv(nach);
  };

  const entfernen = (i: number) => {
    const x = gebiete[i];
    if (x.id) setGeloescht(d => [...d, x.id!]);
    setGebiete(l => l.filter((_, j) => j !== i));
    setAktiv(a => Math.max(0, Math.min(a, gebiete.length - 2)));
  };

  const bildHochladen = async (datei: File | undefined) => {
    if (!datei) return;
    setHochladen(true);
    try {
      const endung = datei.name.split(".").pop() || "jpg";
      const pfad = `skigebiete/${Date.now()}.${endung}`;
      const { error } = await supabase.storage.from("gallery").upload(pfad, datei);
      if (error) throw error;
      const { data } = supabase.storage.from("gallery").getPublicUrl(pfad);
      setze("image_url", data.publicUrl);
    } catch (error: any) {
      toast({ title: "Bild konnte nicht hochgeladen werden", description: error?.message, variant: "destructive" });
    } finally {
      setHochladen(false);
    }
  };

  const speichern = async () => {
    const ohneName = gebiete.findIndex(x => !x.name.trim());
    if (ohneName >= 0) {
      setAktiv(ohneName);
      toast({ title: "Name fehlt", description: "Jedes Skigebiet braucht einen Namen.", variant: "destructive" });
      return;
    }
    const zeilen: any[] = [];
    for (const [i, x] of gebiete.entries()) {
      const z: any = { sort_order: i + 1, is_active: x.is_active, updated_at: new Date().toISOString() };
      if (x.id) z.id = x.id;
      TEXTE.forEach(k => (z[k] = x[k].trim() || null));
      for (const k of ZAHLEN) {
        const roh = x[k].trim().replace(",", ".");
        if (!roh) { z[k] = null; continue; }
        const n = Number(roh);
        if (isNaN(n)) {
          setAktiv(i);
          toast({ title: "Ungültige Zahl", description: `${x.name}: „${x[k]}“`, variant: "destructive" });
          return;
        }
        z[k] = GANZZAHL.has(k) ? Math.round(n) : n;
      }
      zeilen.push(z);
    }

    setSpeichert(true);
    try {
      if (geloescht.length) {
        const { error } = await (supabase as any).from("ski_areas").delete().in("id", geloescht);
        if (error) throw error;
      }
      const alt = zeilen.filter(z => z.id);
      const neu = zeilen.filter(z => !z.id);
      if (alt.length) {
        const { error } = await (supabase as any).from("ski_areas").upsert(alt);
        if (error) throw error;
      }
      if (neu.length) {
        const { error } = await (supabase as any).from("ski_areas").insert(neu);
        if (error) throw error;
      }
      queryClient.invalidateQueries({ queryKey: ["ski-areas"] });
      toast({ title: "Gespeichert", description: `${zeilen.length} Skigebiete.` });
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Speichern fehlgeschlagen", description: error?.message, variant: "destructive" });
    } finally {
      setSpeichert(false);
    }
  };

  const feld = (k: keyof Gebiet, label: string, props: Record<string, any> = {}) => (
    <div className="space-y-1">
      <Label htmlFor={`ski-${k}`} className="text-xs">{label}</Label>
      <Input id={`ski-${k}`} value={(g as any)[k]} onChange={e => setze(k as string, e.target.value)} {...props} />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Skigebiete</DialogTitle>
          <DialogDescription>
            Gilt für alle Häuser. Leere Felder zeigt die Website nicht an. Zahlen bitte von der
            offiziellen Seite der Bergbahn übernehmen und „Stand“ anpassen.
          </DialogDescription>
        </DialogHeader>

        {laedt ? (
          <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" /><span className="text-sm">Wird geladen…</span>
          </div>
        ) : (
          <div className="grid md:grid-cols-[240px_1fr] gap-5">
            {/* Liste */}
            <div className="space-y-2">
              <div className="rounded-lg border divide-y">
                {gebiete.map((x, i) => (
                  <div key={x.id ?? `neu-${i}`} className={`flex items-center gap-1 px-2 py-1.5 ${i === aktiv ? "bg-muted" : ""}`}>
                    <button type="button" onClick={() => setAktiv(i)} className="flex-1 text-left text-sm truncate py-1">
                      <span className={x.is_active ? "" : "text-muted-foreground line-through"}>{x.name || "(ohne Namen)"}</span>
                    </button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Nach oben" onClick={() => verschieben(i, i - 1)}><ArrowUp className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Nach unten" onClick={() => verschieben(i, i + 1)}><ArrowDown className="h-3.5 w-3.5" /></Button>
                  </div>
                ))}
                {gebiete.length === 0 && <p className="text-sm text-muted-foreground p-3">Noch keine Skigebiete — die Website zeigt den Abschnitt nicht.</p>}
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => { setGebiete(l => [...l, leer()]); setAktiv(gebiete.length); }}>
                <Plus className="h-4 w-4 mr-1" />Skigebiet hinzufügen
              </Button>
            </div>

            {/* Formular */}
            {g && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <Switch checked={g.is_active} onCheckedChange={v => setze("is_active", v)} />
                    auf der Website anzeigen
                  </label>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => entfernen(aktiv)}>
                    <Trash2 className="h-4 w-4 mr-1" />Löschen
                  </Button>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  {feld("name", "Name")}
                  {feld("region_de", "Orte (Deutsch)")}
                  {feld("region_en", "Orte (Englisch)")}
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="ski-description_de" className="text-xs">Kurzbeschreibung (Deutsch, optional)</Label>
                    <Textarea id="ski-description_de" rows={2} value={g.description_de} onChange={e => setze("description_de", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ski-description_en" className="text-xs">Kurzbeschreibung (Englisch, optional)</Label>
                    <Textarea id="ski-description_en" rows={2} value={g.description_en} onChange={e => setze("description_en", e.target.value)} />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Zahlen</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {feld("elevation_min", "Höhe von (m)", { inputMode: "numeric" })}
                    {feld("elevation_max", "Höhe bis (m)", { inputMode: "numeric" })}
                    {feld("lifts", "Lifte (Anzahl)", { inputMode: "numeric" })}
                    {feld("slopes_km", "Pisten gesamt (km)", { inputMode: "decimal" })}
                    {feld("slopes_blue_km", "davon blau / leicht (km)", { inputMode: "decimal" })}
                    {feld("slopes_red_km", "davon rot / mittel (km)", { inputMode: "decimal" })}
                    {feld("slopes_black_km", "davon schwarz / schwer (km)", { inputMode: "decimal" })}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {feld("season_de", "Saison (Deutsch)", { placeholder: "z. B. 04.12.2026 – 11.04.2027" })}
                  {feld("season_en", "Saison (Englisch)", { placeholder: "e.g. Dec 4, 2026 – Apr 11, 2027" })}
                  {feld("distance_km", "Anfahrt ab den Chalets (km)", { inputMode: "decimal" })}
                  {feld("drive_minutes", "Fahrzeit (Minuten)", { inputMode: "numeric" })}
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {feld("website_url", "Website (Link)")}
                  {feld("piste_map_url", "Pistenplan (Link zu PDF oder Seite)")}
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Bild (eigenes Foto; ohne Bild erscheint ein dunkler Kopf)</Label>
                  <div className="flex flex-wrap items-center gap-3">
                    {g.image_url && (
                      <div className="relative">
                        <img src={g.image_url} alt="" className="h-16 w-28 object-cover rounded-md border" />
                        <button type="button" aria-label="Bild entfernen" onClick={() => setze("image_url", "")}
                          className="absolute -top-2 -right-2 bg-background border rounded-full p-0.5"><X className="h-3 w-3" /></button>
                      </div>
                    )}
                    <Input type="file" accept="image/*" className="max-w-xs" disabled={hochladen}
                      onChange={e => bildHochladen(e.target.files?.[0])} />
                    {hochladen && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                </div>

                <div className="grid sm:grid-cols-[180px_1fr] gap-3">
                  {feld("facts_as_of", "Stand der Zahlen", { type: "date" })}
                  <div className="space-y-1">
                    <Label htmlFor="ski-facts_source" className="text-xs">Quelle (nur hier sichtbar)</Label>
                    <Textarea id="ski-facts_source" rows={2} value={g.facts_source} onChange={e => setze("facts_source", e.target.value)} />
                  </div>
                </div>
              </div>
            )}
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

export default SkiAreasDialog;
