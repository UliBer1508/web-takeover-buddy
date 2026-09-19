import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { HouseDirections } from "@/hooks/useHouseDirections";

interface HouseDirectionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  houseId: string | null;
  houseName: string;
}

/** Texte je Sprache - Schluessel = Spaltenname ohne _de/_en. */
const SPRACHFELDER = [
  { feld: "warning_title", label: "Hinweis – Überschrift", mehrzeilig: false,
    hilfe: "z. B. „Nicht die Adresse ins Navi eingeben“. Leer = kein Hinweiskasten." },
  { feld: "warning_text", label: "Hinweis – Text", mehrzeilig: true, hilfe: "" },
  { feld: "by_car", label: "Mit dem Auto", mehrzeilig: false, hilfe: "" },
  { feld: "parking", label: "Parken", mehrzeilig: false, hilfe: "" },
  { feld: "airport", label: "Nächster Flughafen", mehrzeilig: false, hilfe: "" },
  { feld: "train_station", label: "Nächster Bahnhof", mehrzeilig: false, hilfe: "" },
  { feld: "winter", label: "Im Winter", mehrzeilig: true, hilfe: "" },
  { feld: "map_caption", label: "Bildunterschrift zur Karte", mehrzeilig: false, hilfe: "" },
] as const;

type Werte = Record<string, string>;

const leer = (): Werte => {
  const w: Werte = {
    address: "", latitude: "", longitude: "", plus_code: "",
    steps_de: "", steps_en: "", house_image_url: "", map_image_url: "",
  };
  SPRACHFELDER.forEach(({ feld }) => { w[`${feld}_de`] = ""; w[`${feld}_en`] = ""; });
  return w;
};

const ausDatensatz = (d: HouseDirections | null): Werte => {
  const w = leer();
  if (!d) return w;
  Object.keys(w).forEach(k => {
    const v = (d as any)[k];
    if (Array.isArray(v)) w[k] = v.join("\n");
    else if (v != null) w[k] = String(v);
  });
  return w;
};

const textOderNull = (v: string) => (v.trim() ? v.trim() : null);
const zahlOderNull = (v: string) => {
  const t = v.trim().replace(",", ".");
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : NaN;
};
const schritte = (v: string) => {
  const liste = v.split("\n").map(s => s.trim()).filter(Boolean);
  return liste.length > 0 ? liste : null;
};

/**
 * Anfahrt eines Hauses pflegen: Adresse, Koordinaten, Plus Code, Wegschritte,
 * Hinweise (deutsch/englisch) und die zwei Bilder der Anfahrtsseite.
 * Gespeichert wird in public.house_directions (eine Zeile je Haus).
 */
const HouseDirectionsDialog = ({ open, onOpenChange, houseId, houseName }: HouseDirectionsDialogProps) => {
  const queryClient = useQueryClient();
  const [werte, setWerte] = useState<Werte>(leer());
  const [laedt, setLaedt] = useState(false);
  const [speichert, setSpeichert] = useState(false);
  const [hochladen, setHochladen] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !houseId) return;
    setLaedt(true);
    (supabase as any)
      .from("house_directions")
      .select("*")
      .eq("house_id", houseId)
      .maybeSingle()
      .then(({ data, error }: { data: HouseDirections | null; error: any }) => {
        if (error) {
          toast({ title: "Konnte nicht geladen werden", description: error.message, variant: "destructive" });
        } else {
          setWerte(ausDatensatz(data));
        }
        setLaedt(false);
      });
  }, [open, houseId]);

  const setze = (k: string, v: string) => setWerte(w => ({ ...w, [k]: v }));

  const bildHochladen = async (feld: "house_image_url" | "map_image_url", datei: File | undefined) => {
    if (!datei || !houseId) return;
    setHochladen(feld);
    try {
      const endung = datei.name.split(".").pop() || "jpg";
      const pfad = `anfahrt/${houseId}-${feld === "house_image_url" ? "haus" : "karte"}-${Date.now()}.${endung}`;
      const { error } = await supabase.storage.from("gallery").upload(pfad, datei);
      if (error) throw error;
      const { data } = supabase.storage.from("gallery").getPublicUrl(pfad);
      setze(feld, data.publicUrl);
    } catch (error: any) {
      toast({ title: "Bild konnte nicht hochgeladen werden", description: error?.message, variant: "destructive" });
    } finally {
      setHochladen(null);
    }
  };

  const speichern = async () => {
    if (!houseId) return;
    const lat = zahlOderNull(werte.latitude);
    const lon = zahlOderNull(werte.longitude);
    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      toast({ title: "Koordinaten prüfen", description: "Breite und Länge als Zahl eingeben, z. B. 47.249878.", variant: "destructive" });
      return;
    }
    if ((lat == null) !== (lon == null)) {
      toast({ title: "Koordinaten unvollständig", description: "Bitte Breite UND Länge eintragen oder beide leer lassen.", variant: "destructive" });
      return;
    }

    const zeile: Record<string, unknown> = {
      house_id: houseId,
      address: textOderNull(werte.address),
      latitude: lat,
      longitude: lon,
      plus_code: textOderNull(werte.plus_code),
      steps_de: schritte(werte.steps_de),
      steps_en: schritte(werte.steps_en),
      house_image_url: textOderNull(werte.house_image_url),
      map_image_url: textOderNull(werte.map_image_url),
      updated_at: new Date().toISOString(),
    };
    SPRACHFELDER.forEach(({ feld }) => {
      zeile[`${feld}_de`] = textOderNull(werte[`${feld}_de`]);
      zeile[`${feld}_en`] = textOderNull(werte[`${feld}_en`]);
    });

    setSpeichert(true);
    try {
      const { error } = await (supabase as any)
        .from("house_directions")
        .upsert(zeile, { onConflict: "house_id" });
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["house-directions"] });
      toast({ title: "Gespeichert", description: `${houseName}: Anfahrt aktualisiert.` });
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Konnte nicht gespeichert werden", description: error?.message ?? "Unbekannter Fehler.", variant: "destructive" });
    } finally {
      setSpeichert(false);
    }
  };

  const bildFeld = (feld: "house_image_url" | "map_image_url", titel: string, hilfe: string) => (
    <div className="space-y-2">
      <Label htmlFor={`anfahrt-${feld}`}>{titel}</Label>
      <p className="text-xs text-muted-foreground">{hilfe}</p>
      {werte[feld] && (
        <div className="relative">
          <img src={werte[feld]} alt="" className="w-full max-h-48 object-cover rounded-md border" />
          <Button
            type="button" variant="secondary" size="icon"
            className="absolute top-2 right-2 h-8 w-8" aria-label="Bild entfernen"
            onClick={() => setze(feld, "")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="flex gap-2 items-center">
        <Input
          id={`anfahrt-${feld}`} type="file" accept="image/*"
          disabled={hochladen !== null}
          onChange={e => bildHochladen(feld, e.target.files?.[0])}
        />
        {hochladen === feld && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
      </div>
    </div>
  );

  const sprachBlock = (lang: "de" | "en") => (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor={`anfahrt-steps-${lang}`}>Wegbeschreibung</Label>
        <p className="text-xs text-muted-foreground">Ein Schritt pro Zeile. Leer = kein Wegabschnitt.</p>
        <Textarea
          id={`anfahrt-steps-${lang}`} rows={5}
          value={werte[`steps_${lang}`]}
          onChange={e => setze(`steps_${lang}`, e.target.value)}
        />
      </div>
      {SPRACHFELDER.map(({ feld, label, mehrzeilig, hilfe }) => {
        const k = `${feld}_${lang}`;
        return (
          <div key={k} className="space-y-1.5">
            <Label htmlFor={`anfahrt-${k}`}>{label}</Label>
            {hilfe && <p className="text-xs text-muted-foreground">{hilfe}</p>}
            {mehrzeilig ? (
              <Textarea id={`anfahrt-${k}`} rows={2} value={werte[k]} onChange={e => setze(k, e.target.value)} />
            ) : (
              <Input id={`anfahrt-${k}`} value={werte[k]} onChange={e => setze(k, e.target.value)} />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Anfahrt — {houseName}</DialogTitle>
          <DialogDescription>
            Gilt nur für dieses Haus. Leere Felder erscheinen auf der Anfahrtsseite nicht.
            Ist ein englisches Feld leer, zeigt die englische Seite den deutschen Text.
          </DialogDescription>
        </DialogHeader>

        {laedt ? (
          <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Wird geladen…</span>
          </div>
        ) : (
          <div className="space-y-6">
            <section className="space-y-4">
              <h3 className="font-semibold">Lage</h3>
              <div className="space-y-1.5">
                <Label htmlFor="anfahrt-address">Adresse</Label>
                <Input
                  id="anfahrt-address" value={werte.address}
                  placeholder="Straße Nr., PLZ Ort"
                  onChange={e => setze("address", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="anfahrt-lat">Breite</Label>
                  <Input id="anfahrt-lat" inputMode="decimal" placeholder="47.249878"
                    value={werte.latitude} onChange={e => setze("latitude", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="anfahrt-lon">Länge</Label>
                  <Input id="anfahrt-lon" inputMode="decimal" placeholder="12.254109"
                    value={werte.longitude} onChange={e => setze("longitude", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="anfahrt-plus">Plus Code</Label>
                  <Input id="anfahrt-plus" placeholder="67X3+XJ5"
                    value={werte.plus_code} onChange={e => setze("plus_code", e.target.value)} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Aus den Koordinaten entstehen die Knöpfe für Google Maps und Apple Karten.
                Ohne Koordinaten erscheinen sie nicht.
              </p>
            </section>

            <section className="space-y-4 border-t pt-5">
              <h3 className="font-semibold">Bilder</h3>
              {bildFeld("house_image_url", "Hausfoto", "Oben auf der Anfahrtsseite — so erkennen Gäste das Haus.")}
              {bildFeld("map_image_url", "Kartenausschnitt", "Unter der Wegbeschreibung, z. B. mit eingezeichnetem Weg.")}
            </section>

            <section className="space-y-3 border-t pt-5">
              <h3 className="font-semibold">Texte</h3>
              <Tabs defaultValue="de">
                <TabsList>
                  <TabsTrigger value="de">Deutsch</TabsTrigger>
                  <TabsTrigger value="en">Englisch</TabsTrigger>
                </TabsList>
                <TabsContent value="de" className="pt-3">{sprachBlock("de")}</TabsContent>
                <TabsContent value="en" className="pt-3">{sprachBlock("en")}</TabsContent>
              </Tabs>
            </section>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-3 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
          <Button onClick={speichern} disabled={speichert || laedt || hochladen !== null}>
            {speichert ? "Speichert…" : "Speichern"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HouseDirectionsDialog;
