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

export interface InfoArticle {
  id: string;
  topic: InfoTopic;
  icon: LucideIcon;
  /** Tailwind gradient classes, e.g. "from-primary to-accent" */
  gradient: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  shortDescription: LocalizedText;
  stats: InfoArticleStat[];
  sections: InfoArticleSection[];
  externalUrl: string;
  sourceLabel: string;
}
