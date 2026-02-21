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
  keys: "building",
  lamp: "building",
  food: "building",
  bottle: "building",
  cage: "cobble",
  rod: "debris",
  rod2: "kinghall",
  bird: "birdchamber",
  nugget: "nuggetroom",
  obj_51: "westfissure",
  obj_52: "floorhole",
  obj_53: "southside",
  coins: "westside",
  eggs: "giantroom",
  trident: "waterfall",
  pillow: "softroom",
  vase: "oriental",
  emerald: "plover",
  pyramid: "darkroom",
  clam: "shellroom",
  magazine: "anteroom",
  obj_63: "boulders2",
  ruby: "storeroom",
  rabbitfoot: "forest22",
  sapph: "ledge",
  obj_69: "reachdead",
  axe: "_nowhere",
  chain: "barrenroom",
  rug: "secret_canyon_e",
  jade: "_nowhere",
};

export const OGRE_LOCATION = "large";

export const SNAKE_LOCATION = "kinghall";
export const DRAGON_LOCATIONS = ["secret_canyon_e", "secret_canyon_n"];
export const TROLL_LOCATIONS = ["swchasm", "nechasm"];
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
  "eggs",
  "trident",
  "vase",
  "emerald",
  "pyramid",
  "ruby",
  "sapph",
  "obj_63",
  "obj_69",
  "clam",
  "chain",
  "chest",
  "pearl",
  "rug",
  "jade",
  "amber",
];

export const TREASURE_VALUES: Record<string, number> = {
  nugget: 12,
  obj_51: 12,
  obj_52: 12,
  obj_53: 12,
  coins: 12,
  chest: 14,
  eggs: 16,
  trident: 16,
  vase: 16,
  emerald: 16,
  pyramid: 16,
  pearl: 16,
  rug: 16,
  obj_63: 16,
  chain: 16,
  ruby: 16,
  jade: 16,
  amber: 16,
  sapph: 16,
  obj_69: 16,
};

export const IMMOVABLE_OBJECTS = new Set([
  "grate", "steps", "door", "snake", "fissure", "plant", "plant2",
  "stalactite", "shadow", "mirror", "dragon", "chasm", "troll", "troll2",
  "bear", "messag", "volcano", "vend", "carpet", "ogre", "urn", "cavity",
  "blood", "reser", "mud", "note", "sign",
]);

export function buildInitialObjectLocations(): Record<string, string> {
  const locations: Record<string, string> = {};
  for (const [objId, locId] of Object.entries(OBJECT_START_LOCATIONS)) {
    locations[objId] = locId;
  }
  locations["snake"] = SNAKE_LOCATION;
  locations["troll"] = "swchasm";
  locations["ogre"] = OGRE_LOCATION;
  locations["dragon"] = "secret_canyon_e";
  locations["fissure"] = "eastbank";
  locations["door"] = "immensenwpass";
  locations["chasm"] = "swchasm";
  return locations;
}

export const HINT_PENALTIES: Record<number, number> = {
  0: 2,
  1: 2,
  2: 2,
  3: 4,
  4: 5,
  5: 3,
  6: 2,
  7: 2,
  8: 2,
  9: 4,
};

export function calculateScore(state: {
  objectLocations: Record<string, string>;
  inventory: string[];
  flags: Record<string, boolean>;
  deathState: { numdie: number; maxDeaths: number };
  hintState: { hintsGiven: number[] };
  stats: { turns: number };
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
    const bonus = (state as any).flags?.endgameDefeatBonus || 25;
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
  const turnThresholds = [
    { threshold: 350, loss: 2 },
    { threshold: 500, loss: 3 },
    { threshold: 1000, loss: 5 },
    { threshold: 2500, loss: 10 },
  ];
  for (const t of turnThresholds) {
    if (state.stats.turns >= t.threshold) {
      turnDeductions += t.loss;
    }
  }
  if (turnDeductions > 0) {
    breakdown.turnPenalty = -turnDeductions;
    score -= turnDeductions;
  }

  return { score, maxScore: 430, breakdown };
}

export function getScoreClass(score: number): string {
  if (score >= 430) return "You are now the WORLD CHAMPION ADVENTURER!!";
  if (score >= 427) return "You have achieved the rank of Adventurer Grandmaster.";
  if (score >= 411) return "You have achieved the rank of Master Adventurer Class A.";
  if (score >= 376) return "You have achieved the rank of Master Adventurer Class B.";
  if (score >= 321) return "You have achieved the rank of Master Adventurer Class C.";
  if (score >= 251) return "You have achieved the rank of Junior Master.";
  if (score >= 171) return "You are a Seasoned Adventurer.";
  if (score >= 121) return "You are an Experienced Adventurer.";
  if (score >= 46) return "You are a Novice Class adventurer.";
  return "You are obviously a rank amateur.";
}
