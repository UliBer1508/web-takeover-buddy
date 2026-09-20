import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
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

interface AboutUsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LEER = { title_de: "", title_en: "", text_de: "", text_en: "", image_url: "", is_active: false };

/** Admin: Abschnitt „Über uns“ (eine Zeile in public.about_us, id = true). */
const AboutUsDialog = ({ open, onOpenChange }: AboutUsDialogProps) => {
  const queryClient = useQueryClient();
  const [w, setW] = useState(LEER);
  const [laedt, setLaedt] = useState(false);
  const [speichert, setSpeichert] = useState(false);
  const [hochladen, setHochladen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLaedt(true);
    (supabase as any).from("about_us").select("*").eq("id", true).maybeSingle().then(({ data, error }: any) => {
      if (error) toast({ title: "„Über uns“ konnte nicht geladen werden", description: error.message, variant: "destructive" });
      setW({
        title_de: data?.title_de ?? "", title_en: data?.title_en ?? "",
        text_de: data?.text_de ?? "", text_en: data?.text_en ?? "",
        image_url: data?.image_url ?? "", is_active: data?.is_active ?? false,
      });
      setLaedt(false);
    });
  }, [open]);

  const setze = (k: keyof typeof LEER, v: string | boolean) => setW(x => ({ ...x, [k]: v }));

  const bildHochladen = async (datei: File | undefined) => {
    if (!datei) return;
    setHochladen(true);
    try {
      const endung = datei.name.split(".").pop() || "jpg";
      const pfad = `ueber-uns/${Date.now()}.${endung}`;
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
    if (w.is_active && !w.text_de.trim()) {
      toast({ title: "Text fehlt", description: "Zum Anzeigen braucht es mindestens den deutschen Text.", variant: "destructive" });
      return;
    }
    setSpeichert(true);
    const leerZuNull = (s: string) => s.trim() || null;
    const { error } = await (supabase as any).from("about_us").upsert({
      id: true,
      title_de: leerZuNull(w.title_de), title_en: leerZuNull(w.title_en),
      text_de: leerZuNull(w.text_de), text_en: leerZuNull(w.text_en),
      image_url: leerZuNull(w.image_url), is_active: w.is_active,
      updated_at: new Date().toISOString(),
    });
    setSpeichert(false);
    if (error) {
      toast({ title: "Speichern fehlgeschlagen", description: error.message, variant: "destructive" });
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["about-us"] });
    toast({ title: "Gespeichert", description: w.is_active ? "„Über uns“ ist auf der Website sichtbar." : "„Über uns“ ist ausgeblendet." });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Über uns</DialogTitle>
          <DialogDescription>
            Abschnitt über euch als Gastgeber — gilt für die ganze Website. Absätze durch eine
            Leerzeile trennen. Ist „anzeigen“ aus oder kein Text da, fehlen Abschnitt und
            Menüpunkt „Über uns“.
          </DialogDescription>
        </DialogHeader>

        {laedt ? (
          <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" /><span className="text-sm">Wird geladen…</span>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={w.is_active} onCheckedChange={v => setze("is_active", v)} />
              auf der Website anzeigen
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="uu-title-de" className="text-xs">Überschrift Deutsch (leer = „Über uns“)</Label>
                <Input id="uu-title-de" value={w.title_de} onChange={e => setze("title_de", e.target.value)} placeholder="z. B. Ihre Gastgeber" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="uu-title-en" className="text-xs">Überschrift Englisch (leer = „About us“)</Label>
                <Input id="uu-title-en" value={w.title_en} onChange={e => setze("title_en", e.target.value)} placeholder="e.g. Your hosts" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="uu-text-de" className="text-xs">Text Deutsch</Label>
                <Textarea id="uu-text-de" rows={10} value={w.text_de} onChange={e => setze("text_de", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="uu-text-en" className="text-xs">Text Englisch (leer = deutscher Text)</Label>
                <Textarea id="uu-text-en" rows={10} value={w.text_en} onChange={e => setze("text_en", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Foto (optional)</Label>
              <div className="flex flex-wrap items-center gap-3">
                {w.image_url && (
                  <div className="relative">
                    <img src={w.image_url} alt="" className="h-20 w-16 object-cover rounded-md border" />
                    <button type="button" aria-label="Bild entfernen" onClick={() => setze("image_url", "")}
                      className="absolute -top-2 -right-2 bg-background border rounded-full p-0.5"><X className="h-3 w-3" /></button>
                  </div>
                )}
                <Input type="file" accept="image/*" className="max-w-xs" disabled={hochladen}
                  onChange={e => bildHochladen(e.target.files?.[0])} />
                {hochladen && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
            </div>
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

export default AboutUsDialog;
