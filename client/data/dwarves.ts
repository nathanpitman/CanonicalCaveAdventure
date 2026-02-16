import { SCENES } from "./story";
import { TREASURE_IDS } from "./canonObjects";

export const NDWARVES = 5;
export const PIRATE_INDEX = 5;

export const DWARF_START_LOCS = [
  "kinghall",
  "westbank",
  "y2",
  "alike3",
  "complex",
  "mazeend12",
];

export const DALTLC = "nugget";

export const CHEST_HIDE_LOC = "mazeend12";
export const MESSAGE_HIDE_LOC = "mazeend13";

export const PIT_KILL_PROB = 35;

export interface DwarfState {
  loc: string;
  oldloc: string;
  seen: boolean;
  alive: boolean;
}

export interface DwarfSystemState {
  dflag: number;
  dwarves: DwarfState[];
  knfloc: string | null;
  chloc: string;
  chloc2: string;
  chestPlaced: boolean;
}

export function buildInitialDwarfState(): DwarfSystemState {
  const dwarves: DwarfState[] = DWARF_START_LOCS.map((loc) => ({
    loc,
    oldloc: loc,
    seen: false,
    alive: true,
  }));

  return {
    dflag: 0,
    dwarves,
    knfloc: null,
    chloc: CHEST_HIDE_LOC,
    chloc2: MESSAGE_HIDE_LOC,
    chestPlaced: false,
  };
}

export function isDeepCave(sceneId: string): boolean {
  const scene = SCENES[sceneId];
  return !!(scene?.conditions?.["DEEP"]);
}

export function isNoBack(sceneId: string): boolean {
  const scene = SCENES[sceneId];
  return !!(scene?.conditions?.["NOBACK"]);
}

function lcgRandom(seed: number): { value: number; nextSeed: number } {
  const LCG_A = 1093;
  const LCG_C = 221587;
  const LCG_M = 1048576;
  const nextSeed = (seed * LCG_A + LCG_C) % LCG_M;
  return { value: nextSeed, nextSeed };
}

function getDeepCaveSceneIds(): string[] {
  return Object.keys(SCENES).filter((id) => isDeepCave(id));
}

interface DwarfMoveResult {
  state: DwarfSystemState;
  messages: string[];
  playerDied: boolean;
  seed: number;
}

export function processDwarfTurn(
  state: DwarfSystemState,
  playerLoc: string,
  playerInventory: string[],
  objectLocations: Record<string, string>,
  lampLit: boolean,
  treasureTally: number,
  seed: number,
): DwarfMoveResult {
  const messages: string[] = [];
  let playerDied = false;
  const newState: DwarfSystemState = {
    ...state,
    dwarves: state.dwarves.map((d) => ({ ...d })),
  };

  if (!isDeepCave(playerLoc)) {
    if (newState.dflag === 0) {
      return { state: newState, messages, playerDied, seed };
    }
  }

  if (newState.dflag === 0) {
    newState.dflag = 1;
    return { state: newState, messages, playerDied, seed };
  }

  if (newState.dflag === 1) {
    const r = lcgRandom(seed);
    seed = r.nextSeed;

    if (r.value % 100 < 5 || isNoBack(playerLoc)) {
      newState.dflag = 2;

      for (let i = 0; i < NDWARVES; i++) {
        if (newState.dwarves[i].loc === playerLoc) {
          newState.dwarves[i].loc = DALTLC;
          newState.dwarves[i].oldloc = DALTLC;
        }
      }

      const killCount = r.value % 3;
      for (let k = 0; k < killCount && k < NDWARVES; k++) {
        const killIdx = (r.value + k) % NDWARVES;
        newState.dwarves[killIdx].alive = false;
      }

      messages.push(
        "A little dwarf just walked around a corner, saw you, threw a little axe at you (which missed), cursed, and ran away."
      );

      return { state: newState, messages, playerDied, seed };
    }
    return { state: newState, messages, playerDied, seed };
  }

  const deepScenes = getDeepCaveSceneIds();
  let attackCount = 0;
  let stickCount = 0;

  for (let i = 0; i < NDWARVES; i++) {
    const dwarf = newState.dwarves[i];
    if (!dwarf.alive) continue;

    const validDests = deepScenes.filter(
      (s) => s !== dwarf.loc && s !== dwarf.oldloc
    );

    let newLoc: string;
    if (dwarf.seen && isDeepCave(playerLoc)) {
      newLoc = playerLoc;
    } else if (validDests.length > 0) {
      const r = lcgRandom(seed);
      seed = r.nextSeed;
      newLoc = validDests[r.value % validDests.length];
    } else {
      newLoc = dwarf.oldloc;
    }

    dwarf.oldloc = dwarf.loc;
    dwarf.loc = newLoc;

    if (
      (dwarf.seen && isDeepCave(playerLoc)) ||
      dwarf.loc === playerLoc ||
      dwarf.oldloc === playerLoc
    ) {
      dwarf.seen = true;
    }

    if (dwarf.loc === playerLoc && dwarf.oldloc === playerLoc) {
      attackCount++;
      newState.knfloc = playerLoc;

      const r = lcgRandom(seed);
      seed = r.nextSeed;

      const hitChance = 95 * (newState.dflag - 2);
      if (r.value % 1000 < hitChance) {
        stickCount++;
      }

      if (newState.dflag < 10) {
        newState.dflag++;
      }
    }
  }

  if (attackCount > 0) {
    if (attackCount === 1) {
      messages.push("There is a threatening little dwarf in the room with you!");
      messages.push("One sharp nasty knife is thrown at you!");
    } else {
      messages.push(
        `There are ${attackCount} threatening little dwarves in the room with you!`
      );
      messages.push(
        `${attackCount} of them throw knives at you!`
      );
    }

    if (stickCount > 0) {
      if (stickCount === 1) {
        messages.push("One of them gets you!");
      } else {
        messages.push(`${stickCount} of them get you!`);
      }
      playerDied = true;
    } else {
      if (attackCount === 1) {
        messages.push("It misses!");
      } else {
        messages.push("None of them hit you!");
      }
    }
  } else {
    let dwarvesHere = 0;
    for (let i = 0; i < NDWARVES; i++) {
      if (newState.dwarves[i].alive && newState.dwarves[i].loc === playerLoc) {
        dwarvesHere++;
      }
    }
    if (dwarvesHere === 1) {
      messages.push("There is a threatening little dwarf in the room with you!");
    } else if (dwarvesHere > 1) {
      messages.push(
        `There are ${dwarvesHere} threatening little dwarves in the room with you!`
      );
    }
  }

  const pirateResult = processPirateTurn(
    newState,
    playerLoc,
    playerInventory,
    objectLocations,
    lampLit,
    treasureTally,
    seed,
  );
  seed = pirateResult.seed;
  if (pirateResult.messages.length > 0) {
    messages.push(...pirateResult.messages);
  }

  return {
    state: {
      ...newState,
      chestPlaced: pirateResult.chestPlaced || newState.chestPlaced,
    },
    messages,
    playerDied,
    seed,
  };
}

interface PirateResult {
  stolenItems: string[];
  messages: string[];
  chestPlaced: boolean;
  seed: number;
}

function processPirateTurn(
  state: DwarfSystemState,
  playerLoc: string,
  playerInventory: string[],
  objectLocations: Record<string, string>,
  lampLit: boolean,
  treasureTally: number,
  seed: number,
): PirateResult {
  const pirate = state.dwarves[PIRATE_INDEX];
  const stolenItems: string[] = [];
  const messages: string[] = [];
  let chestPlaced = state.chestPlaced;

  if (!pirate || !pirate.alive) {
    return { stolenItems, messages, chestPlaced, seed };
  }

  const deepScenes = getDeepCaveSceneIds();
  const validDests = deepScenes.filter(
    (s) => s !== pirate.loc && s !== pirate.oldloc
  );

  let newLoc: string;
  if (pirate.seen && isDeepCave(playerLoc)) {
    newLoc = playerLoc;
  } else if (validDests.length > 0) {
    const r = lcgRandom(seed);
    seed = r.nextSeed;
    newLoc = validDests[r.value % validDests.length];
  } else {
    newLoc = pirate.oldloc;
  }

  pirate.oldloc = pirate.loc;
  pirate.loc = newLoc;

  if (pirate.loc === playerLoc || pirate.oldloc === playerLoc) {
    pirate.seen = true;
  }

  if (playerLoc === state.chloc || chestPlaced) {
    return { stolenItems, messages, chestPlaced, seed };
  }

  if (pirate.loc !== playerLoc) {
    if (pirate.seen) {
      const r = lcgRandom(seed);
      seed = r.nextSeed;
      if (r.value % 100 < 20) {
        messages.push(
          "There are faint rustling noises from the darkness behind you."
        );
      }
    }
    return { stolenItems, messages, chestPlaced, seed };
  }

  const carriedTreasures = playerInventory.filter(
    (id) =>
      TREASURE_IDS.includes(id) &&
      !(id === "pyramid" && (playerLoc === "plover" || playerLoc === "darkroom"))
  );

  if (carriedTreasures.length > 0) {
    for (const tid of carriedTreasures) {
      stolenItems.push(tid);
    }
    chestPlaced = true;
    messages.push(
      "Out from the shadows behind you pounces a bearded pirate! \"Har, har,\" he chortles. \"I'll just take all this booty and hide it away with me chest deep in the maze!\" He vanishes into the gloom."
    );
  } else if (treasureTally === 1 && !chestPlaced && lampLit) {
    chestPlaced = true;
    messages.push(
      "There are faint rustling noises from the darkness behind you. As you turn toward them, the beam of your lamp falls across a bearded pirate. He is carrying a large chest. \"Shiver me timbers!\" he cries, \"I've been spotted! I'd best hie meself off to the maze to hide me chest!\" With that, he vanishes into the gloom."
    );
  }

  return { stolenItems, messages, chestPlaced, seed };
}

export function getKnifeMessage(): string {
  return "The dwarves' knives vanish as they strike the walls of the cave.";
}
