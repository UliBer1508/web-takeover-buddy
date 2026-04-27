import { Layers, Bike, Footprints, Snowflake, Landmark, type LucideIcon } from "lucide-react";
import type { InfoArticle, InfoTopic } from "./types";
import tauernradweg from "./articles/tauernradweg";
import alpeAdria from "./articles/alpe-adria";
import pinzgauPongau from "./articles/pinzgau-pongau";
import pinzgauerLokalbahnRad from "./articles/pinzgauer-lokalbahn-rad";
import hoheTauernBikeTrailEt12 from "./articles/hohe-tauern-bike-trail-et12";
import salzachtalKrimmlMittersill from "./articles/salzachtal-krimml-mittersill";
import berndlalm from "./articles/berndlalm";
import krimmlerWasserfaelle from "./articles/krimmler-wasserfaelle";
import smaragdwegHabachtal from "./articles/smaragdweg-habachtal";
import wildkogelGipfel from "./articles/wildkogel-gipfel";
import kuersingerhuette from "./articles/kuersingerhuette";
import stockenbaumalm from "./articles/stockenbaumalm";
import wildalm from "./articles/wildalm";
import wildkogelalm from "./articles/wildkogelalm";
import baumgartenalm from "./articles/baumgartenalm";
import skiarenaWildkogel from "./articles/skiarena-wildkogel";
import zillertalArena from "./articles/zillertal-arena";
import saalbachHinterglemm from "./articles/saalbach-hinterglemm";
import nationalparkzentrum from "./articles/nationalparkzentrum";
import museumBramberg from "./articles/museum-bramberg";
import felberturm from "./articles/felberturm";

export const infoArticles: InfoArticle[] = [
  tauernradweg,
  alpeAdria,
  pinzgauPongau,
  pinzgauerLokalbahnRad,
  salzachtalKrimmlMittersill,
  hoheTauernBikeTrailEt12,
  berndlalm,
  stockenbaumalm,
  baumgartenalm,
  wildalm,
  wildkogelalm,
  krimmlerWasserfaelle,
  smaragdwegHabachtal,
  wildkogelGipfel,
  kuersingerhuette,
  skiarenaWildkogel,
  zillertalArena,
  saalbachHinterglemm,
  nationalparkzentrum,
  museumBramberg,
  felberturm,
];

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
