import { jsPDF } from "jspdf";
import { infoArticles, infoTopics, type InfoTopic } from "@/content/info-articles";

type Lang = "de" | "en";

const TOPIC_ORDER: InfoTopic[] = ["skiing", "hiking", "cycling", "culture"];

const TEXT = {
  de: {
    title: "Region-Guide",
    subtitle: "Hohe Tauern · Pinzgau · Pongau",
    welcome: "Willkommen in den Steinbock Chalets",
    intro:
      "Dieser Guide ist unser persönliches Geschenk an Sie: handverlesene Tipps für Skigebiete, Wanderungen, Almen und Kulturhighlights in der Region rund um Ihren Aufenthalt.",
    toc: "Inhaltsverzeichnis",
    moreInfo: "Mehr Infos:",
    topics: { skiing: "Skigebiete", hiking: "Wandern & Almen", cycling: "Radfahren", culture: "Kultur" },
    page: "Seite",
    footer: "Region-Guide · steinbockchalets.com",
  },
  en: {
    title: "Region Guide",
    subtitle: "Hohe Tauern · Pinzgau · Pongau",
    welcome: "Welcome to the Steinbock Chalets",
    intro:
      "This guide is our personal gift to you: handpicked tips for ski areas, hikes, alpine huts and cultural highlights in the region around your stay.",
    toc: "Table of Contents",
    moreInfo: "More info:",
    topics: { skiing: "Ski Areas", hiking: "Hiking & Huts", cycling: "Cycling", culture: "Culture" },
    page: "Page",
    footer: "Region Guide · steinbockchalets.com",
  },
} as const;

// A4: 210 x 297 mm
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_X = 20;
const CONTENT_W = PAGE_W - 2 * MARGIN_X;

const COLOR_PRIMARY: [number, number, number] = [120, 80, 45];
const COLOR_TEXT: [number, number, number] = [40, 30, 20];
const COLOR_MUTED: [number, number, number] = [120, 100, 80];
const COLOR_BG: [number, number, number] = [252, 248, 242];

async function loadImageAsDataUrl(src: string): Promise<string | null> {
  try {
    const res = await fetch(src);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === "string" ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function drawFooter(doc: jsPDF, lang: Lang, pageNum: number, totalPages: number) {
  const t = TEXT[lang];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_MUTED);
  doc.text(t.footer, MARGIN_X, PAGE_H - 10);
  doc.text(`${t.page} ${pageNum} / ${totalPages}`, PAGE_W - MARGIN_X, PAGE_H - 10, {
    align: "right",
  });
}

function ensureSpace(doc: jsPDF, currentY: number, needed: number): number {
  if (currentY + needed > PAGE_H - 20) {
    doc.addPage();
    return 25;
  }
  return currentY;
}

export async function generateWelcomeGuidePdf(lang: Lang = "de"): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const t = TEXT[lang];

  // ---------- COVER ----------
  doc.setFillColor(...COLOR_BG);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  // Top accent
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(0, 0, PAGE_W, 10, "F");

  // Brand
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("STEINBOCK CHALETS", PAGE_W / 2, 30, { align: "center" });

  // Cover image (use first article cover if available)
  const coverImg = await loadImageAsDataUrl(infoArticles[0]?.coverImage ?? "");
  if (coverImg) {
    try {
      doc.addImage(coverImg, "JPEG", MARGIN_X, 45, CONTENT_W, 100);
    } catch {
      // ignore image errors
    }
  }

  // Title block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(40);
  doc.setTextColor(...COLOR_TEXT);
  doc.text(t.title, PAGE_W / 2, 175, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(...COLOR_MUTED);
  doc.text(t.subtitle, PAGE_W / 2, 187, { align: "center" });

  // Divider
  doc.setDrawColor(200, 180, 150);
  doc.setLineWidth(0.4);
  doc.line(60, 200, PAGE_W - 60, 200);

  // Welcome
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...COLOR_TEXT);
  doc.text(t.welcome, PAGE_W / 2, 215, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_MUTED);
  const introLines = doc.splitTextToSize(t.intro, CONTENT_W - 20);
  doc.text(introLines, PAGE_W / 2, 225, { align: "center" });

  // ---------- TOC ----------
  doc.addPage();
  let y = 30;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...COLOR_TEXT);
  doc.text(t.toc, MARGIN_X, y);
  y += 4;
  doc.setDrawColor(...COLOR_PRIMARY);
  doc.setLineWidth(0.5);
  doc.line(MARGIN_X, y, MARGIN_X + 30, y);
  y += 12;

  for (const topic of TOPIC_ORDER) {
    const articles = infoArticles.filter((a) => a.topic === topic);
    if (articles.length === 0) continue;

    y = ensureSpace(doc, y, 14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...COLOR_PRIMARY);
    doc.text(t.topics[topic], MARGIN_X, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...COLOR_TEXT);
    for (const article of articles) {
      y = ensureSpace(doc, y, 6);
      doc.text(`•  ${article.title[lang]}`, MARGIN_X + 4, y);
      y += 5;
    }
    y += 4;
  }

  // ---------- ARTICLES ----------
  for (const topic of TOPIC_ORDER) {
    const articles = infoArticles.filter((a) => a.topic === topic);
    if (articles.length === 0) continue;

    // Topic divider page
    doc.addPage();
    doc.setFillColor(...COLOR_BG);
    doc.rect(0, 0, PAGE_W, PAGE_H, "F");
    doc.setFillColor(...COLOR_PRIMARY);
    doc.rect(0, 130, PAGE_W, 35, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(36);
    doc.setTextColor(255, 255, 255);
    doc.text(t.topics[topic], PAGE_W / 2, 155, { align: "center" });

    for (const article of articles) {
      doc.addPage();
      let cy = 25;

      // Cover image
      const img = await loadImageAsDataUrl(article.coverImage);
      if (img) {
        try {
          doc.addImage(img, "JPEG", MARGIN_X, cy, CONTENT_W, 70);
          cy += 75;
        } catch {
          cy += 5;
        }
      }

      // Topic label
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...COLOR_PRIMARY);
      doc.text(t.topics[topic].toUpperCase(), MARGIN_X, cy);
      cy += 6;

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(...COLOR_TEXT);
      const titleLines = doc.splitTextToSize(article.title[lang], CONTENT_W);
      doc.text(titleLines, MARGIN_X, cy);
      cy += titleLines.length * 8;

      // Subtitle
      doc.setFont("helvetica", "italic");
      doc.setFontSize(11);
      doc.setTextColor(...COLOR_MUTED);
      const subLines = doc.splitTextToSize(article.subtitle[lang], CONTENT_W);
      doc.text(subLines, MARGIN_X, cy);
      cy += subLines.length * 5 + 4;

      // Short description
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...COLOR_TEXT);
      const shortLines = doc.splitTextToSize(article.shortDescription[lang], CONTENT_W);
      doc.text(shortLines, MARGIN_X, cy);
      cy += shortLines.length * 5 + 6;

      // Stats line
      if (article.stats.length > 0) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...COLOR_MUTED);
        const statsText = article.stats
          .map((s) => `${s.label[lang]}: ${s.value[lang]}`)
          .join("   ·   ");
        const statsLines = doc.splitTextToSize(statsText, CONTENT_W);
        doc.text(statsLines, MARGIN_X, cy);
        cy += statsLines.length * 4.5 + 5;
      }

      // Sections
      for (const section of article.sections) {
        cy = ensureSpace(doc, cy, 18);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...COLOR_TEXT);
        doc.text(section.heading[lang], MARGIN_X, cy);
        cy += 6;

        if (section.body) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(...COLOR_TEXT);
          const bodyLines = doc.splitTextToSize(section.body[lang], CONTENT_W);
          for (const line of bodyLines) {
            cy = ensureSpace(doc, cy, 5);
            doc.text(line, MARGIN_X, cy);
            cy += 4.8;
          }
          cy += 2;
        }

        if (section.bullets) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(...COLOR_TEXT);
          for (const bullet of section.bullets) {
            const bulletLines = doc.splitTextToSize(bullet[lang], CONTENT_W - 6);
            for (let i = 0; i < bulletLines.length; i++) {
              cy = ensureSpace(doc, cy, 5);
              const prefix = i === 0 ? "•  " : "    ";
              doc.text(prefix + bulletLines[i], MARGIN_X, cy);
              cy += 4.8;
            }
          }
          cy += 2;
        }
        cy += 3;
      }

      // Source link
      cy = ensureSpace(doc, cy, 10);
      doc.setDrawColor(220, 200, 170);
      doc.setLineWidth(0.2);
      doc.line(MARGIN_X, cy, PAGE_W - MARGIN_X, cy);
      cy += 5;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(...COLOR_MUTED);
      doc.text(`${t.moreInfo} ${article.externalUrl}`, MARGIN_X, cy);
    }
  }

  // ---------- FOOTERS ----------
  const totalPages = doc.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, lang, i, totalPages);
  }

  doc.save(`region-guide-${lang}.pdf`);
}
