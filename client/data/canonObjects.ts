// AUTO-GENERATED FROM import/adventure.yaml - DO NOT EDIT MANUALLY
// Generated: 2026-02-21T22:34:21.992Z
// Run: npx tsx tools/importOpenAdventure.ts to regenerate

import { TURN_THRESHOLDS } from "./generatedStory";

export const INVLIMIT = 7;

export interface CanonObject {
  id: string;
  name: string;
  words: string[];
  startLocation: string;
  fixedLocation?: string;
  immovable?: boolean;
  treasure?: boolean;
  treasureValue?: number;
  descriptions: string[];
}

export const TREASURE_DEPOSIT_LOCATION = "building";

export const OBJECT_START_LOCATIONS: Record<string, string> = {
  "keys": "building",
  "lamp": "building",
  "cage": "cobble",
  "rod": "debris",
  "bird": "birdchamber",
  "pillow": "softroom",
  "clam": "shellroom",
  "magazine": "anteroom",
  "food": "building",
  "bottle": "building",
  "rabbitfoot": "forest22",
  "nugget": "nugget",
  "obj_51": "westbank",
  "obj_52": "floorhole",
  "obj_53": "southside",
  "coins": "westside",
  "eggs": "giantroom",
  "trident": "waterfall",
  "vase": "oriental",
  "emerald": "plover",
  "pyramid": "darkroom",
  "obj_63": "boulders2",
  "ruby": "storeroom",
  "sapph": "ledge",
  "obj_69": "reachdead"
};

export const OGRE_LOCATION = "large";

export const SNAKE_LOCATION = "kinghall";
export const DRAGON_LOCATIONS = ["secret4","secret6"];
export const TROLL_LOCATIONS = ["swchasm","nechasm"];
export const BEAR_LOCATION = "barrenroom";
export const PLANT_LOCATION = "westpit";
export const CLAM_LOCATION = "shellroom";
export const URN_LOCATION = "cliff";
export const CAVITY_LOCATION = "cliff";

export const TREASURE_IDS: string[] = [
  "nugget",
  "obj_51",
  "obj_52",
  "obj_53",
  "coins",
  "chest",
  "eggs",
  "trident",
  "vase",
  "emerald",
  "pyramid",
  "pearl",
  "rug",
  "obj_63",
  "chain",
  "ruby",
  "jade",
  "amber",
  "sapph",
  "obj_69"
];

export const TREASURE_VALUES: Record<string, number> = {
  "nugget": 12,
  "obj_51": 12,
  "obj_52": 12,
  "obj_53": 12,
  "coins": 12,
  "chest": 14,
  "eggs": 16,
  "trident": 16,
  "vase": 16,
  "emerald": 16,
  "pyramid": 16,
  "pearl": 16,
  "rug": 16,
  "obj_63": 16,
  "chain": 16,
  "ruby": 16,
  "jade": 16,
  "amber": 16,
  "sapph": 16,
  "obj_69": 16
};

export const IMMOVABLE_OBJECTS = new Set([
  "grate",
  "steps",
  "door",
  "snake",
  "fissure",
  "obj_13",
  "dwarf",
  "mirror",
  "plant",
  "plant2",
  "obj_26",
  "obj_27",
  "obj_29",
  "obj_30",
  "dragon",
  "chasm",
  "troll",
  "troll2",
  "bear",
  "messag",
  "volcano",
  "vend",
  "obj_40",
  "ogre",
  "urn",
  "cavity",
  "blood",
  "reser",
  "obj_47",
  "obj_48",
  "sign",
  "rug",
  "chain"
]);

export function buildInitialObjectLocations(): Record<string, string> {
  const locations: Record<string, string> = {};
  for (const [objId, locId] of Object.entries(OBJECT_START_LOCATIONS)) {
    locations[objId] = locId;
  }
  locations["snake"] = SNAKE_LOCATION;
  locations["troll"] = TROLL_LOCATIONS[0];
  locations["ogre"] = OGRE_LOCATION;
  locations["dragon"] = DRAGON_LOCATIONS[0];
  locations["fissure"] = "eastbank";
  locations["door"] = "immense";
  locations["chasm"] = "swchasm";
  return locations;
}

export const HINT_PENALTIES: Record<number, number> = {
  "1": 2,
  "2": 2,
  "3": 2,
  "4": 4,
  "5": 5,
  "6": 3,
  "7": 2,
  "8": 2,
  "9": 4,
  "10": 4
};

export function calculateScore(state: {
  objectLocations: Record<string, string>;
  inventory: string[];
  flags: Record<string, boolean>;
  deathState: { numdie: number; maxDeaths: number };
  hintState: { hintsGiven: number[] };
  stats: { turns: number; endgameBonus?: number };
  thresholdsTriggered: number[];
  milestonesCompleted: string[];
  dwarfState?: { dflag: number };
}): { score: number; maxScore: number; breakdown: Record<string, number> } {
  const breakdown: Record<string, number> = {};
  let score = 0;

  let treasurePoints = 0;
  for (const tid of TREASURE_IDS) {
    const value = TREASURE_VALUES[tid] || 0;
    const loc = state.objectLocations[tid];
    const inInventory = state.inventory.includes(tid);

    if (loc || inInventory) {
      treasurePoints += 2;
    }
    if (loc === TREASURE_DEPOSIT_LOCATION) {
      treasurePoints += (value - 2);
    }
  }
  breakdown.treasures = treasurePoints;
  score += treasurePoints;

  const dflag = state.dwarfState?.dflag ?? 0;
  if (dflag > 0 || state.flags.reachedDeep) {
    breakdown.exploration = 25;
    score += 25;
  }

  const survivalBonus = (state.deathState.maxDeaths - state.deathState.numdie) * 10;
  breakdown.survival = survivalBonus;
  score += survivalBonus;

  if (!state.flags.gameQuit) {
    breakdown.completion = 4;
    score += 4;
  }

  if (state.flags.closingReached) {
    breakdown.closing = 25;
    score += 25;
  }

  if (state.flags.endgameVictory) {
    breakdown.endgame = 45;
    score += 45;
  } else if (state.flags.endgameDefeat) {
    const bonus = state.stats.endgameBonus ?? 25;
    breakdown.endgame = bonus;
    score += bonus;
  }

  if (state.objectLocations.magazine === "wittsend") {
    breakdown.magazine = 1;
    score += 1;
  }

  breakdown.roundout = 2;
  score += 2;

  let hintDeductions = 0;
  for (const hintNum of state.hintState.hintsGiven) {
    hintDeductions += HINT_PENALTIES[hintNum] ?? 0;
  }
  if (hintDeductions > 0) {
    breakdown.hintPenalty = -hintDeductions;
    score -= hintDeductions;
  }

  let turnDeductions = 0;
  for (const t of TURN_THRESHOLDS) {
    if (state.stats.turns >= t.threshold) {
      turnDeductions += t.pointLoss;
    }
  }
  if (turnDeductions > 0) {
    breakdown.turnPenalty = -turnDeductions;
    score -= turnDeductions;
  }

  return { score, maxScore: 430, breakdown };
}

export function getScoreClass(score: number): string {
  if (score >= 430) return "Adventuredom stands in awe -- you have now joined the ranks of the W O R L D C H A M P I O N A D V E N T U R E R S ! It may interest you to know that the Dungeon-Master himself has, to my knowledge, never achieved this threshold in fewer than 330 turns.";
  if (score >= 430) return "All of Adventuredom gives tribute to you, Adventurer Grandmaster!";
  if (score >= 427) return "Your score puts you in Master Adventurer Class A.";
  if (score >= 411) return "Your score puts you in Master Adventurer Class B.";
  if (score >= 376) return "Your score puts you in Master Adventurer Class C.";
  if (score >= 321) return "You have reached \"Junior Master\" status.";
  if (score >= 251) return "You may now consider yourself a \"Seasoned Adventurer\".";
  if (score >= 171) return "You have achieved the rating: \"Experienced Adventurer\".";
  if (score >= 121) return "Your score qualifies you as a novice class adventurer.";
  if (score >= 46) return "You are obviously a rank amateur. Better luck next time.";
  return "You are obviously a rank amateur.";
}
