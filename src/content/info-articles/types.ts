import type { LucideIcon } from "lucide-react";

export type InfoTopic = "cycling" | "hiking" | "skiing" | "culture";

export interface LocalizedText {
  de: string;
  en: string;
}

export interface InfoArticleStat {
  label: LocalizedText;
  value: LocalizedText;
}

export interface InfoArticleSection {
  heading: LocalizedText;
  body?: LocalizedText;
  bullets?: LocalizedText[];
}

export interface InfoArticleImage {
  /** Direct image URL (e.g. images.unsplash.com/photo-...) */
  url: string;
  caption: LocalizedText;
}

export interface InfoArticle {
  id: string;
  topic: InfoTopic;
  icon: LucideIcon;
  /** Tailwind gradient classes, used as fallback if cover image fails */
  gradient: string;
  /** Cover image URL — used as card background and dialog header */
  coverImage: string;
  /** 3–5 images shown as a mini-gallery inside the detail dialog */
  gallery: InfoArticleImage[];
  title: LocalizedText;
  subtitle: LocalizedText;
  shortDescription: LocalizedText;
  stats: InfoArticleStat[];
  sections: InfoArticleSection[];
  externalUrl: string;
  sourceLabel: string;
}
