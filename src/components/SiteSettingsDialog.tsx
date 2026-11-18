import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SiteSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Einstellungen, die für die ganze Website gelten (public.site_settings, eine Zeile). */
const SiteSettingsDialog = ({ open, onOpenChange }: SiteSettingsDialogProps) => {
  const queryClient = useQueryClient();
  const [umschalter, setUmschalter] = useState(false);
  const [laedt, setLaedt] = useState(false);
  const [speichert, setSpeichert] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLaedt(true);
    (supabase as any).from("site_settings").select("show_mode_switch").maybeSingle()
      .then(({ data, error }: { data: any; error: any }) => {
        if (error) toast({ title: "Konnte nicht geladen werden", description: error.message, variant: "destructive" });
        setUmschalter(!!data?.show_mode_switch);
        setLaedt(false);
      });
  }, [open]);

  const speichern = async () => {
    setSpeichert(true);
    const { error } = await (supabase as any).from("site_settings")
      .upsert({ id: true, show_mode_switch: umschalter, updated_at: new Date().toISOString() }, { onConflict: "id" });
    setSpeichert(false);
    if (error) {
      toast({ title: "Konnte nicht gespeichert werden", description: error.message, variant: "destructive" });
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    toast({ title: "Gespeichert" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Einstellungen der Website</DialogTitle>
          <DialogDescription>Gilt für alle Häuser.</DialogDescription>
        </DialogHeader>
        {laedt ? (
          <div className="flex items-center gap-2 text-muted-foreground py-6 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Wird geladen…</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
              <Label htmlFor="einst-umschalter" className="font-medium">
                Umschalter „Urlaub | Chalets auf Zeit“ über den Hauskarten
              </Label>
              <Switch id="einst-umschalter" checked={umschalter} onCheckedChange={setUmschalter} />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              An: Gäste wählen oben die Vermietungsart; Hauskarten und Bereich darunter zeigen nur diese.
              Erscheint nur, wenn es Häuser mit Urlaub UND Häuser mit Chalets auf Zeit gibt.
              Aus: jedes Haus zeigt alles, was es anbietet (Urlaub und darunter Chalets auf Zeit).
            </p>
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

export default SiteSettingsDialog;
