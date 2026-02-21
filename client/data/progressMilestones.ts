export const PROGRESS_MILESTONES = [
  "entered_cave",
  "lamp_obtained_or_lit",
  "first_depth_unlock",
  "bird_resolved",
  "snake_removed",
  "crystal_bridge_formed",
  "pirate_event",
  "first_treasure_secured",
  "maze_mastery",
  "dragon_event",
  "late_region_unlocked",
  "treasury_resolved",
  "ascent_triggered",
  "game_complete",
] as const;

export type MilestoneId = (typeof PROGRESS_MILESTONES)[number];

export const MILESTONE_SCENE_TRIGGERS: Record<string, MilestoneId> = {
  belowgrate: "entered_cave",
  cobble: "entered_cave",
  misthall: "first_depth_unlock",
  kinghall: "first_depth_unlock",
  bedquilt: "late_region_unlocked",
  swisscheese: "late_region_unlocked",
  oriental: "late_region_unlocked",
  plover: "late_region_unlocked",
  reservoir: "late_region_unlocked",
};

export const MILESTONE_ITEM_TRIGGERS: Record<string, MilestoneId> = {
  lamp: "lamp_obtained_or_lit",
  bird: "bird_resolved",
  nugget: "first_treasure_secured",
  coins: "first_treasure_secured",
  eggs: "first_treasure_secured",
  trident: "first_treasure_secured",
  emerald: "first_treasure_secured",
  pyramid: "first_treasure_secured",
  ruby: "first_treasure_secured",
  sapph: "first_treasure_secured",
};

export const MILESTONE_FLAG_TRIGGERS: Record<string, MilestoneId> = {
  grateOpen: "first_depth_unlock",
  escaped: "game_complete",
};

import { YAML_MAZE_SCENE_IDS } from "./generatedConstants";

export const MAZE_SCENE_IDS = YAML_MAZE_SCENE_IDS;
