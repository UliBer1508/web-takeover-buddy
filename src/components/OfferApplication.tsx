import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Check, Upload, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { externalSupabase } from "@/integrations/external-supabase/client";

interface OfferApplicationProps {
  token: string;
  guestName: string;
  applicationSubmitted: boolean;
  documents: { name: string; at: string }[];
  onChanged: () => void;
}

const ARTEN = ["id", "income", "self", "other"] as const;
type Art = typeof ARTEN[number];
const MAX_BYTES = 20 * 1024 * 1024;
const ENDUNGEN = ["pdf", "jpg", "jpeg", "png", "heic", "heif", "webp"];

/** Aufruf der Edge Function rental-portal in der Hausverwaltung (Kunde nicht angemeldet). */
const portal = async <T,>(body: Record<string, unknown>): Promise<T> => {
  const { data, error } = await (externalSupabase as any).functions.invoke("rental-portal", { body });
  if (error) {
    let code = "server";
    try { code = (await error.context?.json())?.error ?? code; } catch { /* kein JSON */ }
    throw new Error(code);
  }
  return data as T;
};

/** Datei in Blöcken direkt zu Microsoft (Vielfache von 320 KiB), wie in der Hausverwaltung. */
const putInChunks = async (uploadUrl: string, file: File, onProgress: (p: number) => void) => {
  const CHUNK = 5 * 320 * 1024;
  let start = 0;
  let last: any = null;
  while (start < file.size) {
    const end = Math.min(start + CHUNK, file.size);
    const res = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Range": `bytes ${start}-${end - 1}/${file.size}` },
      body: file.slice(start, end),
    });
    if (!res.ok && res.status !== 202) throw new Error("upload");
    if (res.status !== 202) last = await res.json();
    start = end;
    onProgress(Math.round((start / file.size) * 100));
  }
  if (!last?.id) throw new Error("upload");
  return last.id as string;
};

/**
 * Nach der Zusage: Selbstauskunft und Unterlagen (Ausweis, Einkommensnachweis …).
 * Gespeichert in der Hausverwaltung (rental_applications, Dokumentenverwaltung/OneDrive)
 * über die Edge Function rental-portal; geprüft wird über den Angebots-Token. SQL 73.
 */
const OfferApplication = ({ token, guestName, applicationSubmitted, documents, onChanged }: OfferApplicationProps) => {
  const { t } = useTranslation();
  const [formularOffen, setFormularOffen] = useState(!applicationSubmitted);
  const [w, setW] = useState({
    full_name: guestName, birth_date: "", current_address: "", occupation: "", employer: "",
    employed_since: "", net_income_month: "", adults: "", children: "", pets: "",
    previous_landlord: "", remarks: "", no_debt_enforcement: false, consent_privacy: false,
  });
  const [sendet, setSendet] = useState(false);
  const [art, setArt] = useState<Art>("id");
  const [fortschritt, setFortschritt] = useState<number | null>(null);

  const setze = (k: keyof typeof w, v: string | boolean) => setW(a => ({ ...a, [k]: v }));

  const absenden = async (e: React.FormEvent) => {
    e.preventDefault();
    if (w.full_name.trim().length < 2 || !w.consent_privacy) {
      toast({ title: t("offer.app.missing"), variant: "destructive" });
      return;
    }
    setSendet(true);
    try {
      await portal({ action: "submitApplication", token, data: w });
      toast({ title: t("offer.app.savedTitle") });
      setFormularOffen(false);
      onChanged();
    } catch {
      toast({ title: t("offer.errorTitle"), description: t("offer.errorDesc"), variant: "destructive" });
    } finally {
      setSendet(false);
    }
  };

  const hochladen = async (file: File) => {
    const endung = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ENDUNGEN.includes(endung)) { toast({ title: t("offer.app.wrongType"), variant: "destructive" }); return; }
    if (file.size > MAX_BYTES) { toast({ title: t("offer.app.tooLarge"), variant: "destructive" }); return; }
    setFortschritt(0);
    try {
      const { uploadUrl } = await portal<{ uploadUrl: string }>({
        action: "uploadSession", token, kind: art, fileName: file.name, size: file.size,
      });
      const itemId = await putInChunks(uploadUrl, file, setFortschritt);
      await portal({ action: "uploadComplete", token, kind: art, itemId });
      toast({ title: t("offer.app.uploadedTitle"), description: file.name });
      onChanged();
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      toast({
        title: t("offer.app.uploadError"),
        description: code === "too_many" ? t("offer.app.tooMany") : t("offer.errorDesc"),
        variant: "destructive",
      });
    } finally {
      setFortschritt(null);
    }
  };

  const feld = (k: keyof typeof w, label: string, typ = "text", breit = false) => (
    <div className={breit ? "sm:col-span-2" : ""}>
      <Label htmlFor={`sa-${k}`}>{label}</Label>
      <Input id={`sa-${k}`} type={typ} value={w[k] as string}
        min={typ === "number" ? 0 : undefined} onChange={e => setze(k, e.target.value)} />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("offer.app.title")}</CardTitle>
        <CardDescription>{t("offer.app.intro")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selbstauskunft */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold">{t("offer.app.selfTitle")}</h3>
            {applicationSubmitted && !formularOffen && (
              <span className="flex items-center gap-2 text-sm text-primary">
                <Check className="h-4 w-4" />{t("offer.app.received")}
                <Button size="sm" variant="ghost" onClick={() => setFormularOffen(true)}>{t("offer.app.edit")}</Button>
              </span>
            )}
          </div>
          {formularOffen && (
            <form onSubmit={absenden} className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                {feld("full_name", t("offer.app.fullName"), "text", true)}
                {feld("birth_date", t("offer.app.birthDate"), "date")}
                {feld("current_address", t("offer.app.address"))}
                {feld("occupation", t("offer.app.occupation"))}
                {feld("employer", t("offer.app.employer"))}
                {feld("employed_since", t("offer.app.employedSince"))}
                {feld("net_income_month", t("offer.app.income"), "number")}
                {feld("adults", t("offer.app.adults"), "number")}
                {feld("children", t("offer.app.children"), "number")}
                {feld("pets", t("offer.app.pets"))}
                {feld("previous_landlord", t("offer.app.previousLandlord"))}
                <div className="sm:col-span-2">
                  <Label htmlFor="sa-remarks">{t("offer.app.remarks")}</Label>
                  <Textarea id="sa-remarks" rows={3} maxLength={2000} value={w.remarks}
                    onChange={e => setze("remarks", e.target.value)} />
                </div>
              </div>
              <label className="flex items-start gap-2.5 text-sm cursor-pointer">
                <Checkbox checked={w.no_debt_enforcement} onCheckedChange={v => setze("no_debt_enforcement", v === true)} className="mt-0.5" />
                <span>{t("offer.app.noDebt")}</span>
              </label>
              <label className="flex items-start gap-2.5 text-sm cursor-pointer">
                <Checkbox checked={w.consent_privacy} onCheckedChange={v => setze("consent_privacy", v === true)} className="mt-0.5" />
                <span>{t("offer.app.consent")}</span>
              </label>
              <Button type="submit" disabled={sendet || !w.consent_privacy}>
                {sendet && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}{t("offer.app.submit")}
              </Button>
            </form>
          )}
        </section>

        {/* Unterlagen */}
        <section className="space-y-3">
          <h3 className="font-semibold">{t("offer.app.docsTitle")}</h3>
          <p className="text-sm text-muted-foreground">{t("offer.app.docsText")}</p>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={art} onValueChange={v => setArt(v as Art)}>
              <SelectTrigger className="w-56" aria-label={t("offer.app.docType")}><SelectValue /></SelectTrigger>
              <SelectContent>
                {ARTEN.map(a => <SelectItem key={a} value={a}>{t(`offer.app.kinds.${a}`)}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button asChild variant="outline" disabled={fortschritt !== null}>
              <label className="cursor-pointer">
                {fortschritt !== null
                  ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{fortschritt} %</>
                  : <><Upload className="h-4 w-4 mr-2" />{t("offer.app.choose")}</>}
                <input type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png,.heic,.heif,.webp"
                  disabled={fortschritt !== null}
                  onChange={e => { const f = e.target.files?.[0]; e.target.value = ""; if (f) hochladen(f); }} />
              </label>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">{t("offer.app.limits")}</p>
          {documents.length > 0 && (
            <ul className="space-y-1 text-sm">
              {documents.map((d, i) => (
                <li key={`${d.name}-${i}`} className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary shrink-0" />{d.name}
                </li>
              ))}
            </ul>
          )}
        </section>
      </CardContent>
    </Card>
  );
};

export default OfferApplication;
