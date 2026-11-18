import { useState } from "react";
import { useTranslation } from "react-i18next";
import { format, parseISO } from "date-fns";
import { de as deLocale, enGB } from "date-fns/locale";
import {
  CalendarClock, Clock, Landmark, Users, MessageSquare, Check, Home, Video, FileText, KeyRound, Send, Loader2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SelectableHouse } from "@/hooks/useHouseSelection";
import { useHouseLongTerm } from "@/hooks/useLongTerm";
import { useSprache, lokal, lokalListe } from "@/lib/sprache";

interface LongTermRentalProps {
  house: SelectableHouse | null;
}

const DAUERN = ["6", "9", "12", "24", "open"] as const;

interface Formular {
  name: string; email: string; phone: string; moveIn: string;
  duration: string; persons: string; purpose: string; purposeDetail: string;
  pets: boolean; registration: boolean; message: string;
}

const leer = (): Formular => ({
  name: "", email: "", phone: "", moveIn: "", duration: "", persons: "",
  purpose: "", purposeDetail: "", pets: false, registration: false, message: "",
});

/**
 * Abschnitt „Wohnen auf Zeit“ eines Hauses (houses.offer_long_term = true).
 * Zeigt Mindestdauer, „frei ab“, Anmeldung bei der Gemeinde, was inklusive ist,
 * den Ablauf und die Mietanfrage. KEINE Preise: Miete und Konditionen gibt es
 * nach der Besichtigung als persönliches Angebot (Schritt 3).
 * Inhalte aus public.house_long_term; fehlt ein Wert, entfällt die Zeile.
 */
const LongTermRental = ({ house }: LongTermRentalProps) => {
  const { t } = useTranslation();
  const sprache = useSprache();
  const { data: info } = useHouseLongTerm(house?.id, !!house?.offer_long_term);
  const [werte, setWerte] = useState<Formular>(leer());
  const [fehler, setFehler] = useState<Partial<Record<keyof Formular, string>>>({});
  const [sendet, setSendet] = useState(false);
  const [gesendet, setGesendet] = useState(false);

  if (!house || !house.offer_long_term) return null;

  const minMonate = info?.min_months ?? 6;
  const maxMonate = info?.max_months ?? null;
  const anmeldung = info?.registration_required ?? true;
  const einleitung = lokal(info?.text_de, info?.text_en, sprache);
  const inklusive = lokalListe(info?.included_de, info?.included_en, sprache);
  const heute = format(new Date(), "yyyy-MM-dd");

  const freiAb = (() => {
    if (!info?.available_from) return t("longTerm.byArrangement");
    const d = parseISO(info.available_from);
    if (format(d, "yyyy-MM-dd") <= heute) return t("longTerm.immediately");
    return format(d, sprache === "en" ? "d MMMM yyyy" : "d. MMMM yyyy", {
      locale: sprache === "en" ? enGB : deLocale,
    });
  })();

  const dauerText = maxMonate
    ? t("longTerm.durationRange", { min: minMonate, max: maxMonate })
    : t("longTerm.durationFrom", { min: minMonate });

  const dauern = DAUERN.filter(d =>
    d === "open" ? !maxMonate : Number(d) >= minMonate && (!maxMonate || Number(d) <= maxMonate)
  );

  const setze = <K extends keyof Formular>(k: K, v: Formular[K]) => {
    setWerte(w => ({ ...w, [k]: v }));
    setFehler(f => ({ ...f, [k]: undefined }));
  };

  const pruefen = () => {
    const f: Partial<Record<keyof Formular, string>> = {};
    if (werte.name.trim().length < 2) f.name = t("longTerm.validation.name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(werte.email.trim())) f.email = t("longTerm.validation.email");
    if (werte.phone.trim().length < 6) f.phone = t("longTerm.validation.phone");
    if (!werte.moveIn || werte.moveIn < heute) f.moveIn = t("longTerm.validation.moveIn");
    if (!werte.duration) f.duration = t("longTerm.validation.duration");
    const p = parseInt(werte.persons);
    if (!p || p < 1 || p > house.max_guests) f.persons = t("longTerm.validation.persons", { max: house.max_guests });
    if (!werte.purpose) f.purpose = t("longTerm.validation.purpose");
    if (anmeldung && !werte.registration) f.registration = t("longTerm.validation.registration");
    setFehler(f);
    return Object.keys(f).length === 0;
  };

  const absenden = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pruefen()) return;
    setSendet(true);
    try {
      const { error } = await (supabase as any).from("long_term_inquiries").insert({
        house_id: house.id,
        guest_name: werte.name.trim(),
        guest_email: werte.email.trim(),
        guest_phone: werte.phone.trim(),
        move_in: werte.moveIn,
        duration_months: werte.duration === "open" ? null : Number(werte.duration),
        persons: parseInt(werte.persons),
        purpose: werte.purpose,
        purpose_detail: werte.purposeDetail.trim() || null,
        pets: werte.pets,
        registration_confirmed: werte.registration,
        message: werte.message.trim() || null,
        language: sprache,
      });
      if (error) throw error;
      setGesendet(true);
      setWerte(leer());
      toast({ title: t("longTerm.successTitle"), description: t("longTerm.successDesc") });
    } catch (err) {
      console.error("Mietanfrage fehlgeschlagen:", err);
      toast({ title: t("longTerm.errorTitle"), description: t("longTerm.errorDesc"), variant: "destructive" });
    } finally {
      setSendet(false);
    }
  };

  const schritte = [
    { icon: Send, key: "inquiry" },
    { icon: Video, key: "viewing" },
    { icon: FileText, key: "offer" },
    { icon: Landmark, key: "contract" },
    { icon: KeyRound, key: "handover" },
  ];

  const fehlerText = (k: keyof Formular) =>
    fehler[k] ? <p className="text-sm font-medium text-destructive mt-1">{fehler[k]}</p> : null;

  return (
    <section id="wohnen-auf-zeit" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 h-7 px-3 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <Home className="h-3.5 w-3.5" />
            {t("longTerm.badge")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{t("longTerm.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("longTerm.subtitle", { house: house.name })}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Angaben */}
          <div className="lg:col-span-2 space-y-6">
            {einleitung && (
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                {einleitung.split(/\n\s*\n/).map((absatz, i) => <p key={i}>{absatz}</p>)}
              </div>
            )}

            <Card>
              <CardContent className="pt-6 space-y-3">
                <Zeile icon={Clock} label={t("longTerm.duration")} wert={dauerText} />
                <Zeile icon={CalendarClock} label={t("longTerm.availableFrom")} wert={freiAb} />
                <Zeile icon={Users} label={t("longTerm.maxPersons")} wert={String(house.max_guests)} />
                {anmeldung && (
                  <Zeile icon={Landmark} label={t("longTerm.registration")} wert={t("longTerm.registrationRequired")} />
                )}
                <div className="rounded-lg bg-muted/60 px-3 py-2.5 text-sm">
                  <span className="font-semibold">{t("longTerm.rent")}:</span>{" "}
                  {t("longTerm.rentAfterViewing")}
                </div>
              </CardContent>
            </Card>

            {inklusive.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">{t("longTerm.included")}</h3>
                <ul className="grid sm:grid-cols-2 gap-1.5">
                  {inklusive.map(punkt => (
                    <li key={punkt} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {punkt}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-3">{t("longTerm.processTitle")}</h3>
              <ol className="space-y-3">
                {schritte.map(({ icon: Icon, key }, i) => (
                  <li key={key} className="flex gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <div className="font-medium flex items-center gap-1.5">
                        <Icon className="h-4 w-4 text-primary" />
                        {t(`longTerm.steps.${key}.title`)}
                      </div>
                      <p className="text-sm text-muted-foreground">{t(`longTerm.steps.${key}.text`)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Mietanfrage */}
          <Card className="lg:col-span-3 shadow-xl">
            <CardHeader>
              <CardTitle>{t("longTerm.formTitle")}</CardTitle>
              <CardDescription>
                <span className="block font-medium text-foreground">{house.name}</span>
                <span className="block mt-1">{t("longTerm.formDescription")}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {gesendet ? (
                <div className="text-center py-10 space-y-3">
                  <Check className="h-10 w-10 text-primary mx-auto" />
                  <p className="font-semibold">{t("longTerm.successTitle")}</p>
                  <p className="text-muted-foreground">{t("longTerm.successDesc")}</p>
                  <Button variant="outline" onClick={() => setGesendet(false)}>{t("longTerm.another")}</Button>
                </div>
              ) : (
                <form onSubmit={absenden} noValidate className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Label htmlFor="lt-name">{t("booking.name")}</Label>
                      <Input id="lt-name" value={werte.name} maxLength={100} autoComplete="name"
                        onChange={e => setze("name", e.target.value)} />
                      {fehlerText("name")}
                    </div>
                    <div>
                      <Label htmlFor="lt-email">{t("booking.email")}</Label>
                      <Input id="lt-email" type="email" value={werte.email} maxLength={255} autoComplete="email"
                        onChange={e => setze("email", e.target.value)} />
                      {fehlerText("email")}
                    </div>
                    <div>
                      <Label htmlFor="lt-phone">{t("booking.phone")}</Label>
                      <Input id="lt-phone" type="tel" value={werte.phone} maxLength={40} autoComplete="tel"
                        onChange={e => setze("phone", e.target.value)} />
                      {fehlerText("phone")}
                    </div>
                    <div>
                      <Label htmlFor="lt-move-in">{t("longTerm.moveIn")}</Label>
                      <Input id="lt-move-in" type="date" min={heute} value={werte.moveIn}
                        onChange={e => setze("moveIn", e.target.value)} />
                      {fehlerText("moveIn")}
                    </div>
                    <div>
                      <Label>{t("longTerm.desiredDuration")}</Label>
                      <Select value={werte.duration} onValueChange={v => setze("duration", v)}>
                        <SelectTrigger aria-label={t("longTerm.desiredDuration")}>
                          <SelectValue placeholder={t("longTerm.choose")} />
                        </SelectTrigger>
                        <SelectContent>
                          {dauern.map(d => (
                            <SelectItem key={d} value={d}>
                              {d === "open" ? t("longTerm.durationOpen") : t("longTerm.months", { count: Number(d) })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fehlerText("duration")}
                    </div>
                    <div>
                      <Label htmlFor="lt-persons">{t("longTerm.persons")}</Label>
                      <Input id="lt-persons" type="number" min={1} max={house.max_guests} value={werte.persons}
                        onChange={e => setze("persons", e.target.value)} />
                      {fehlerText("persons")}
                    </div>
                    <div>
                      <Label>{t("longTerm.purpose")}</Label>
                      <Select value={werte.purpose} onValueChange={v => setze("purpose", v)}>
                        <SelectTrigger aria-label={t("longTerm.purpose")}>
                          <SelectValue placeholder={t("longTerm.choose")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="work">{t("longTerm.purposes.work")}</SelectItem>
                          <SelectItem value="home_office">{t("longTerm.purposes.home_office")}</SelectItem>
                          <SelectItem value="other">{t("longTerm.purposes.other")}</SelectItem>
                        </SelectContent>
                      </Select>
                      {fehlerText("purpose")}
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="lt-purpose-detail">{t("longTerm.purposeDetail")}</Label>
                      <Input id="lt-purpose-detail" value={werte.purposeDetail} maxLength={300}
                        placeholder={t("longTerm.purposeDetailPlaceholder")}
                        onChange={e => setze("purposeDetail", e.target.value)} />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="lt-message" className="flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4" />
                        {t("booking.message")}
                      </Label>
                      <Textarea id="lt-message" rows={4} value={werte.message} maxLength={2000}
                        onChange={e => setze("message", e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-3 rounded-lg border p-3">
                    <label className="flex items-start gap-2.5 text-sm cursor-pointer">
                      <Checkbox checked={werte.pets} onCheckedChange={v => setze("pets", v === true)} className="mt-0.5" />
                      {t("longTerm.pets")}
                    </label>
                    {anmeldung && (
                      <div>
                        <label className="flex items-start gap-2.5 text-sm cursor-pointer">
                          <Checkbox checked={werte.registration} onCheckedChange={v => setze("registration", v === true)} className="mt-0.5" />
                          <span>{t("longTerm.registrationConfirm")}</span>
                        </label>
                        {fehlerText("registration")}
                      </div>
                    )}
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={sendet}>
                    {sendet ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                    {sendet ? t("booking.submitting") : t("longTerm.submit")}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">{t("longTerm.noObligation")}</p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

const Zeile = ({ icon: Icon, label, wert }: { icon: typeof Clock; label: string; wert: string }) => (
  <div className="flex items-start gap-3 text-sm">
    <Icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
    <span className="text-muted-foreground min-w-[8rem]">{label}</span>
    <span className="font-medium">{wert}</span>
  </div>
);

export default LongTermRental;
