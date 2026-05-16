import { Layers, Bike, Footprints, Snowflake, Landmark, Mountain, Waves, Users, Sparkles, Crown, type LucideIcon } from "lucide-react";
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
import kitzskiKitzbuehel from "./articles/kitzski-kitzbuehel";
import kitzsteinhorn from "./articles/kitzsteinhorn";
import schmittenhoehe from "./articles/schmittenhoehe";
import hochkoenig from "./articles/hochkoenig";
import grossarltal from "./articles/grossarltal";
import mayrhofenHintertux from "./articles/mayrhofen-hintertux";
import obertauern from "./articles/obertauern";
import rauris from "./articles/rauris";
import snowSpaceFlachau from "./articles/snow-space-flachau";
import nationalparkzentrum from "./articles/nationalparkzentrum";
import museumBramberg from "./articles/museum-bramberg";
import felberturm from "./articles/felberturm";
import grossglocknerHochalpenstrasse from "./articles/grossglockner-hochalpenstrasse";
import mooserbodenStauseen from "./articles/mooserboden-stauseen";
import sigmundThunKlamm from "./articles/sigmund-thun-klamm";
import liechtensteinklamm from "./articles/liechtensteinklamm";
import zellerSee from "./articles/zeller-see";
import hinterseeMittersill from "./articles/hintersee-mittersill";
import wildkogelFamilyFun from "./articles/wildkogel-family-fun";
import wildparkFerleiten from "./articles/wildpark-ferleiten";
import alpakawanderung from "./articles/alpakawanderung";
import tauernSpa from "./articles/tauern-spa";
import helikopterflugHoheTauern from "./articles/helikopterflug-hohe-tauern";
import bootstourZellerSee from "./articles/bootstour-zeller-see";
import pferdekutscheKitzbuehel from "./articles/pferdekutsche-kitzbuehel";
import salzburgAltstadt from "./articles/salzburg-altstadt";
import zellAmSeeAltstadt from "./articles/zell-am-see-altstadt";

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
  kitzskiKitzbuehel,
  kitzsteinhorn,
  schmittenhoehe,
  hochkoenig,
  grossarltal,
  mayrhofenHintertux,
  obertauern,
  rauris,
  snowSpaceFlachau,
  // Panorama
  grossglocknerHochalpenstrasse,
  mooserbodenStauseen,
  // Wasser & Seen
  sigmundThunKlamm,
  liechtensteinklamm,
  zellerSee,
  hinterseeMittersill,
  // Familie
  wildkogelFamilyFun,
  wildparkFerleiten,
  alpakawanderung,
  // Wellness
  tauernSpa,
  // Premium
  helikopterflugHoheTauern,
  bootstourZellerSee,
  pferdekutscheKitzbuehel,
  // Kultur & Städte
  nationalparkzentrum,
  museumBramberg,
  felberturm,
  salzburgAltstadt,
  zellAmSeeAltstadt,
];

export type TopicFilter = "all" | InfoTopic;

export interface TopicDefinition {
  id: TopicFilter;
  icon: LucideIcon;
  labelKey: string;
}

export const infoTopics: TopicDefinition[] = [
  { id: "all", icon: Layers, labelKey: "infoGallery.topics.all" },
  { id: "panorama", icon: Mountain, labelKey: "infoGallery.topics.panorama" },
  { id: "water", icon: Waves, labelKey: "infoGallery.topics.water" },
  { id: "hiking", icon: Footprints, labelKey: "infoGallery.topics.hiking" },
  { id: "cycling", icon: Bike, labelKey: "infoGallery.topics.cycling" },
  { id: "family", icon: Users, labelKey: "infoGallery.topics.family" },
  { id: "wellness", icon: Sparkles, labelKey: "infoGallery.topics.wellness" },
  { id: "premium", icon: Crown, labelKey: "infoGallery.topics.premium" },
  { id: "skiing", icon: Snowflake, labelKey: "infoGallery.topics.skiing" },
  { id: "culture", icon: Landmark, labelKey: "infoGallery.topics.culture" },
];

export type { InfoArticle, InfoTopic } from "./types";
