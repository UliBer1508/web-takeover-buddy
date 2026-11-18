import { supabase } from "@/integrations/supabase/client";

/**
 * Video-Rundgang aus den Galerie-Bildern eines Hauses (seit 18.11.2026).
 * Eine Zeichenfunktion für beides:
 *  - Website: Abschnitt „Rundgang“ (VirtualTour.tsx) spielt live im Browser ab
 *  - Admin: „Video“ (TourVideoDialog.tsx) nimmt dieselbe Animation als MP4/WebM auf
 * Keine Hausinhalte im Code: Bilder, Titel, Kategorien kommen aus gallery_images/categories.
 */

export interface TourBild {
  url: string;
  titel: string | null;      // gallery_images.title / title_en
  kategorie: string | null;  // übersetzter Kategoriename
}

export interface TourTexte {
  haus: string;
  zeile: string | null;      // z. B. Ort
  zusatz: string | null;     // z. B. „Wohnen auf Zeit · ab 6 Monaten“
  schluss: string;           // z. B. „Anfrage: steinbockchalets.com“
  marke: string;             // „Steinbock Chalets“
}

export interface TourPlan {
  bilder: HTMLImageElement[];
  infos: TourBild[];
  texte: TourTexte;
  dauerTitel: number;
  dauerBild: number;
  dauerSchluss: number;
  blende: number;
  gesamt: number;
}

const TITEL_S = 3.5;
const BILD_S = 4.5;
const SCHLUSS_S = 4;
const BLENDE_S = 1;

/** Reihenfolge: Titelbild zuerst, dann nach Kategorie (categories.sort_order), dann sort_order. */
export const ladeTourBilder = async (
  houseId: string,
  kategorieName: (name: string, fallback: string) => string,
  sprache: "de" | "en",
  maxBilder = 24
): Promise<TourBild[]> => {
  const { data, error } = await supabase
    .from("gallery_images")
    .select("url, title, title_en, is_hero, sort_order, category:categories(name, display_name, sort_order)")
    .eq("house_id", houseId);
  if (error) throw error;
  const zeilen = (data || []) as any[];
  zeilen.sort((a, b) => {
    if (a.is_hero !== b.is_hero) return a.is_hero ? -1 : 1;
    const ka = a.category?.sort_order ?? 999, kb = b.category?.sort_order ?? 999;
    if (ka !== kb) return ka - kb;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });
  return zeilen.slice(0, maxBilder).map(z => ({
    url: z.url,
    titel: (sprache === "en" && z.title_en?.trim() ? z.title_en : z.title)?.trim() || null,
    kategorie: z.category ? kategorieName(z.category.name, z.category.display_name) : null,
  }));
};

/** Bilder laden (crossOrigin, damit die Aufnahme nicht am „verunreinigten“ Canvas scheitert). */
export const bilderLaden = (infos: TourBild[]): Promise<{ bilder: HTMLImageElement[]; infos: TourBild[] }> =>
  Promise.all(
    infos.map(
      info =>
        new Promise<{ img: HTMLImageElement | null; info: TourBild }>(resolve => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve({ img, info });
          img.onerror = () => resolve({ img: null, info });
          img.src = info.url;
        })
    )
  ).then(liste => {
    const ok = liste.filter(x => x.img) as { img: HTMLImageElement; info: TourBild }[];
    return { bilder: ok.map(x => x.img), infos: ok.map(x => x.info) };
  });

export const planErstellen = (bilder: HTMLImageElement[], infos: TourBild[], texte: TourTexte): TourPlan => ({
  bilder, infos, texte,
  dauerTitel: TITEL_S, dauerBild: BILD_S, dauerSchluss: SCHLUSS_S, blende: BLENDE_S,
  gesamt: TITEL_S + bilder.length * BILD_S + SCHLUSS_S,
});

const ease = (x: number) => x * x * (3 - 2 * x);

/** Bild formatfüllend mit langsamer Fahrt (Ken Burns). Richtung wechselt je Bild. */
const bildZeichnen = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number, p: number, i: number) => {
  const reinzoomen = i % 2 === 0;
  const z = reinzoomen ? 1.04 + 0.1 * p : 1.14 - 0.1 * p;
  const s = Math.max(w / img.width, h / img.height) * z;
  const bw = img.width * s, bh = img.height * s;
  const richtungen = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1]];
  const [dx, dy] = richtungen[i % richtungen.length];
  const spielX = (bw - w) / 2, spielY = (bh - h) / 2;
  const x = (w - bw) / 2 + dx * spielX * (p - 0.5) * 0.8;
  const y = (h - bh) / 2 + dy * spielY * (p - 0.5) * 0.8;
  ctx.drawImage(img, x, y, bw, bh);
};

const text = (
  ctx: CanvasRenderingContext2D, t: string, x: number, y: number, px: number,
  gewicht = 600, farbe = "#fff", ausrichtung: CanvasTextAlign = "left", maxBreite?: number
) => {
  ctx.font = `${gewicht} ${Math.round(px)}px Inter, "Segoe UI", system-ui, sans-serif`;
  ctx.fillStyle = farbe;
  ctx.textAlign = ausrichtung;
  ctx.textBaseline = "alphabetic";
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = px * 0.35;
  ctx.fillText(t, x, y, maxBreite);
  ctx.shadowBlur = 0;
};

const karte = (ctx: CanvasRenderingContext2D, plan: TourPlan, w: number, h: number, art: "titel" | "schluss", p: number) => {
  const hinter = art === "titel" ? plan.bilder[0] : plan.bilder[plan.bilder.length - 1];
  if (hinter) bildZeichnen(ctx, hinter, w, h, p, art === "titel" ? 1 : 0);
  ctx.fillStyle = "rgba(18,30,24,0.55)";
  ctx.fillRect(0, 0, w, h);
  const basis = Math.min(w, h);
  const mitte = w / 2;
  const a = ease(Math.min(1, p * 3));
  ctx.globalAlpha *= a;
  if (art === "titel") {
    text(ctx, plan.texte.marke.toUpperCase(), mitte, h * 0.38, basis * 0.035, 600, "rgba(255,255,255,0.85)", "center", w * 0.9);
    text(ctx, plan.texte.haus, mitte, h * 0.5, basis * 0.085, 700, "#fff", "center", w * 0.9);
    if (plan.texte.zeile) text(ctx, plan.texte.zeile, mitte, h * 0.58, basis * 0.04, 400, "#fff", "center", w * 0.9);
    if (plan.texte.zusatz) text(ctx, plan.texte.zusatz, mitte, h * 0.66, basis * 0.04, 600, "#dcebc4", "center", w * 0.9);
  } else {
    text(ctx, plan.texte.haus, mitte, h * 0.45, basis * 0.07, 700, "#fff", "center", w * 0.9);
    text(ctx, plan.texte.schluss, mitte, h * 0.56, basis * 0.045, 600, "#dcebc4", "center", w * 0.9);
    text(ctx, plan.texte.marke, mitte, h * 0.64, basis * 0.035, 400, "rgba(255,255,255,0.85)", "center", w * 0.9);
  }
};

const beschriftung = (ctx: CanvasRenderingContext2D, info: TourBild, w: number, h: number, a: number) => {
  if (!info.kategorie && !info.titel) return;
  const basis = Math.min(w, h);
  const g = ctx.createLinearGradient(0, h * 0.7, 0, h);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.save();
  ctx.globalAlpha *= a;
  ctx.fillStyle = g;
  ctx.fillRect(0, h * 0.7, w, h * 0.3);
  const rand = basis * 0.06;
  if (info.kategorie) text(ctx, info.kategorie, rand, h - rand - (info.titel ? basis * 0.055 : 0), basis * 0.05, 700, "#fff", "left", w - 2 * rand);
  if (info.titel) text(ctx, info.titel, rand, h - rand, basis * 0.035, 400, "rgba(255,255,255,0.92)", "left", w - 2 * rand);
  ctx.restore();
};

/** Ein Bild der Animation zum Zeitpunkt t (Sekunden). */
export const zeichneFrame = (ctx: CanvasRenderingContext2D, plan: TourPlan, t: number) => {
  const { width: w, height: h } = ctx.canvas;
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#1e2a23";
  ctx.fillRect(0, 0, w, h);

  // Abschnitte: [Titel][Bild 1]…[Bild n][Schluss], jeweils mit Überblendung in den nächsten
  const abschnitte: { start: number; dauer: number; zeichne: (p: number) => void }[] = [];
  let start = 0;
  abschnitte.push({ start, dauer: plan.dauerTitel, zeichne: p => karte(ctx, plan, w, h, "titel", p) });
  start += plan.dauerTitel;
  plan.bilder.forEach((img, i) => {
    const info = plan.infos[i];
    abschnitte.push({
      start, dauer: plan.dauerBild,
      zeichne: p => {
        bildZeichnen(ctx, img, w, h, p, i);
        const a = ease(Math.min(1, p * 4)) * ease(Math.min(1, (1 - p) * 5));
        beschriftung(ctx, info, w, h, a);
      },
    });
    start += plan.dauerBild;
  });
  abschnitte.push({ start, dauer: plan.dauerSchluss, zeichne: p => karte(ctx, plan, w, h, "schluss", p) });

  for (let k = 0; k < abschnitte.length; k++) {
    const ab = abschnitte[k];
    const ende = ab.start + ab.dauer;
    if (t < ab.start || t > ende + plan.blende) continue;
    // nach dem Ende blendet der Abschnitt über plan.blende aus (der nächste liegt darüber)
    const p = Math.min(1, Math.max(0, (t - ab.start) / (ab.dauer + plan.blende)));
    const einblenden = k === 0 ? 1 : ease(Math.min(1, (t - ab.start) / plan.blende));
    ctx.globalAlpha = einblenden;
    ab.zeichne(p);
  }

  // Marke oben links (nicht auf Titel/Schluss)
  if (t > plan.dauerTitel && t < plan.gesamt - plan.dauerSchluss) {
    ctx.globalAlpha = 0.85;
    const basis = Math.min(w, h);
    text(ctx, plan.texte.marke, basis * 0.05, basis * 0.08, basis * 0.032, 600, "#fff");
  }
  ctx.restore();
};

/** Bestes Aufnahmeformat des Browsers: MP4 (H.264), sonst WebM. */
export const aufnahmeFormat = (): { mime: string; endung: "mp4" | "webm" } | null => {
  if (typeof MediaRecorder === "undefined") return null;
  const kandidaten: [string, "mp4" | "webm"][] = [
    ["video/mp4;codecs=avc1.640028", "mp4"],
    ["video/mp4;codecs=avc1.42E01E", "mp4"],
    ["video/mp4", "mp4"],
    ["video/webm;codecs=vp9", "webm"],
    ["video/webm;codecs=vp8", "webm"],
    ["video/webm", "webm"],
  ];
  const treffer = kandidaten.find(([m]) => MediaRecorder.isTypeSupported(m));
  return treffer ? { mime: treffer[0], endung: treffer[1] } : null;
};

/**
 * Nimmt die Animation in Echtzeit auf (MediaRecorder auf captureStream).
 * Läuft so lange wie das Video; das Browserfenster muss dabei sichtbar bleiben.
 */
export const aufnehmen = (
  plan: TourPlan, w: number, h: number,
  onFortschritt: (anteil: number) => void,
  abbruch: { abgebrochen: boolean }
): Promise<{ blob: Blob; endung: "mp4" | "webm" }> =>
  new Promise((resolve, reject) => {
    const format = aufnahmeFormat();
    if (!format) { reject(new Error("Dieser Browser kann keine Videos aufnehmen.")); return; }
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) { reject(new Error("Canvas nicht verfügbar.")); return; }
    zeichneFrame(ctx, plan, 0);
    const stream = canvas.captureStream(30);
    const rec = new MediaRecorder(stream, { mimeType: format.mime, videoBitsPerSecond: w * h > 1.5e6 ? 10_000_000 : 6_000_000 });
    const teile: BlobPart[] = [];
    rec.ondataavailable = e => { if (e.data.size) teile.push(e.data); };
    rec.onstop = () => {
      stream.getTracks().forEach(tr => tr.stop());
      if (abbruch.abgebrochen) { reject(new Error("abgebrochen")); return; }
      resolve({ blob: new Blob(teile, { type: format.mime.split(";")[0] }), endung: format.endung });
    };
    rec.onerror = () => reject(new Error("Aufnahme fehlgeschlagen."));
    const beginn = performance.now();
    rec.start(1000);
    const timer = window.setInterval(() => {
      const t = (performance.now() - beginn) / 1000;
      if (abbruch.abgebrochen || t >= plan.gesamt) {
        window.clearInterval(timer);
        zeichneFrame(ctx, plan, plan.gesamt);
        rec.stop();
        return;
      }
      zeichneFrame(ctx, plan, t);
      onFortschritt(t / plan.gesamt);
    }, 1000 / 30);
  });
