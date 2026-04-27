import { Layers, Bike, Footprints, Snowflake, Landmark, type LucideIcon } from "lucide-react";
import type { InfoArticle, InfoTopic } from "./types";
import tauernradweg from "./articles/tauernradweg";
import alpeAdria from "./articles/alpe-adria";
import pinzgauPongau from "./articles/pinzgau-pongau";

export const infoArticles: InfoArticle[] = [tauernradweg, alpeAdria, pinzgauPongau];

export type TopicFilter = "all" | InfoTopic;

export interface TopicDefinition {
  id: TopicFilter;
  icon: LucideIcon;
  labelKey: string;
}

export const infoTopics: TopicDefinition[] = [
  { id: "all", icon: Layers, labelKey: "infoGallery.topics.all" },
  { id: "cycling", icon: Bike, labelKey: "infoGallery.topics.cycling" },
  { id: "hiking", icon: Footprints, labelKey: "infoGallery.topics.hiking" },
  { id: "skiing", icon: Snowflake, labelKey: "infoGallery.topics.skiing" },
  { id: "culture", icon: Landmark, labelKey: "infoGallery.topics.culture" },
];

export type { InfoArticle, InfoTopic } from "./types";
