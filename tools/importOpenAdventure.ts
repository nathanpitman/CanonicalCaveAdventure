import * as fs from "fs";
import * as path from "path";
import { parse } from "yaml";

// ============================================================
// TYPE DEFINITIONS
// ============================================================
interface ConditionalRoute {
  condition: {
    type: "carry" | "not" | "with" | "pct";
    item?: string;
    object?: string;
    state?: string;
    percent?: number;
  };
  to?: string;
  message?: string;
}

interface Action {
  id: string;
  label: string;
  type: "command" | "event" | "move";
  command?: string;
  to?: string;
  requiresItem?: string;
  removesAction?: boolean;
  addsItem?: string;
  setsFlag?: string;
  lightCost?: number;
  requiresFlag?: string;
  message?: string;
  uiHint?: "auto" | "nav" | "hidden";
  conditionalRoutes?: ConditionalRoute[];
}

interface SceneDescription {
  long: string;
  short: string;
  maptag?: string;
}

interface Scene {
  id: string;
  title: string;
  description: SceneDescription;
  itemDescriptions?: Record<string, string>;
  actions: Action[];
  items?: string[];
  sound?: string;
  conditions?: Record<string, boolean>;
  hints?: number[];
}

interface Item {
  id: string;
  name: string;
  description: string;
  usable: boolean;
  useEffect?: {
    lightBonus?: number;
    message: string;
    setsFlag?: string;
  };
}

// ============================================================
// DIRECTION MAPPING (canonical Open Adventure directions)
// ============================================================
const DIRECTION_MAP: Record<string, { actionId: string; label: string }> = {
  NORTH: { actionId: "go_north", label: "GO NORTH" },
  SOUTH: { actionId: "go_south", label: "GO SOUTH" },
  EAST: { actionId: "go_east", label: "GO EAST" },
  WEST: { actionId: "go_west", label: "GO WEST" },
  UPWAR: { actionId: "go_up", label: "GO UP" },
  UP: { actionId: "go_up", label: "GO UP" },
  DOWN: { actionId: "go_down", label: "GO DOWN" },
  INWAR: { actionId: "go_in", label: "GO IN" },
  INSID: { actionId: "go_in", label: "GO IN" },
  OUT: { actionId: "go_out", label: "GO OUT" },
  OUTSI: { actionId: "go_out", label: "GO OUT" },
  OUTDO: { actionId: "go_out", label: "GO OUT" },
  NE: { actionId: "go_ne", label: "GO NORTHEAST" },
  NW: { actionId: "go_nw", label: "GO NORTHWEST" },
  SE: { actionId: "go_se", label: "GO SOUTHEAST" },
  SW: { actionId: "go_sw", label: "GO SOUTHWEST" },
  ENTER: { actionId: "go_enter", label: "ENTER" },
  CRAWL: { actionId: "go_crawl", label: "CRAWL" },
  CROSS: { actionId: "go_cross", label: "CROSS" },
  D: { actionId: "go_down", label: "GO DOWN" },
  U: { actionId: "go_up", label: "GO UP" },
  BUILD: { actionId: "go_building", label: "GO TO BUILDING" },
  XYZZY: { actionId: "go_xyzzy", label: "XYZZY" },
  PLUGH: { actionId: "go_plugh", label: "PLUGH" },
  PLOVE: { actionId: "go_plover", label: "PLOVER" },
  JUMP: { actionId: "go_jump", label: "JUMP" },
  DEPRE: { actionId: "go_depression", label: "DEPRESSION" },
  STREA: { actionId: "go_stream", label: "STREAM" },
  TUNNE: { actionId: "go_tunnel", label: "TUNNEL" },
  PASSA: { actionId: "go_passage", label: "PASSAGE" },
  ROCK: { actionId: "go_rock", label: "ROCK" },
  BEDQU: { actionId: "go_bedquilt", label: "BEDQUILT" },
  ORIEN: { actionId: "go_oriental", label: "ORIENTAL" },
  CAVER: { actionId: "go_cavern", label: "CAVERN" },
  SHELL: { actionId: "go_shell", label: "SHELL" },
  RESER: { actionId: "go_reservoir", label: "RESERVOIR" },
  MAIN: { actionId: "go_main", label: "MAIN OFFICE" },
  FORK: { actionId: "go_fork", label: "FORK" },
  LEFT: { actionId: "go_left", label: "LEFT" },
  RIGHT: { actionId: "go_right", label: "RIGHT" },
  FORWA: { actionId: "go_forward", label: "FORWARD" },
  CONTI: { actionId: "go_forward", label: "CONTINUE" },
  BACK: { actionId: "go_back", label: "BACK" },
  SLAB: { actionId: "go_slab", label: "SLAB" },
  SECRET: { actionId: "go_secret", label: "SECRET" },
  HOLE: { actionId: "go_hole", label: "HOLE" },
  WALL: { actionId: "go_wall", label: "WALL" },
  HALL: { actionId: "go_hall", label: "HALL" },
  ROOM: { actionId: "go_room", label: "ROOM" },
  STAIR: { actionId: "go_stairs", label: "STAIRS" },
  FLOOR: { actionId: "go_floor", label: "FLOOR" },
  STEPS: { actionId: "go_steps", label: "STEPS" },
  DOOR: { actionId: "go_door", label: "DOOR" },
  CLIMB: { actionId: "go_climb", label: "CLIMB" },
  SLOP: { actionId: "go_slope", label: "SLOPE" },
  SURFA: { actionId: "go_surface", label: "SURFACE" },
  GULLY: { actionId: "go_gully", label: "GULLY" },
  ROAD: { actionId: "go_road", label: "ROAD" },
  HILL: { actionId: "go_hill", label: "HILL" },
  FORES: { actionId: "go_forest", label: "FOREST" },
  VALLE: { actionId: "go_valley", label: "VALLEY" },
  VIEW: { actionId: "go_view", label: "VIEW" },
  PIT: { actionId: "go_pit", label: "PIT" },
  CRACK: { actionId: "go_crack", label: "CRACK" },
  COBBL: { actionId: "go_cobbles", label: "COBBLES" },
  DEBRI: { actionId: "go_debris", label: "DEBRIS" },
  AWKWA: { actionId: "go_awkward", label: "AWKWARD" },
  GIANT: { actionId: "go_giant", label: "GIANT" },
  BARREN: { actionId: "go_barren", label: "BARREN" },
  Y2: { actionId: "go_y2", label: "Y2" },
  DARK: { actionId: "go_dark", label: "DARK" },
  LOW: { actionId: "go_low", label: "LOW" },
  CANYO: { actionId: "go_canyon", label: "CANYON" },
  NARRO: { actionId: "go_narrow", label: "NARROW" },
};

// Display names for objects (only cosmetic, no gameplay changes)
const DISPLAY_NAME_MAP: Record<string, string> = {
  LAMP: "Brass Lantern",
  KEYS: "Set of Keys",
  FOOD: "Tasty Rations",
  BOTTLE: "Water Bottle",
  CAGE: "Wicker Cage",
  ROD: "Black Rod",
  ROD2: "Black Rod",
  PILLOW: "Velvet Pillow",
  BIRD: "Little Bird",
  OIL: "Lamp Oil",
  WATER: "Water",
  MAGAZINE: "Magazine",
  AXE: "Dwarf's Axe",
  DWARF: "Threatening Dwarf",
  KNIFE: "Knife",
  CLAM: "Giant Clam",
  OYSTER: "Giant Oyster",
  COINS: "Rare Coins",
  CHEST: "Treasure Chest",
  EGGS: "Golden Eggs",
  TRIDENT: "Jeweled Trident",
  VASE: "Ming Vase",
  EMERALD: "Egg-sized Emerald",
  PYRAMID: "Platinum Pyramid",
  PEARL: "Glistening Pearl",
  RUG: "Persian Rug",
  SPICES: "Rare Spices",
  CHAIN: "Golden Chain",
  RUBY: "Fist-sized Ruby",
  JADE: "Jade Necklace",
  AMBER: "Amber in Resin",
  SAPPH: "Star Sapphire",
  GOLD: "Large Gold Nugget",
  DIAMO: "Several Diamonds",
  SILVE: "Bars of Silver",
  JEWEL: "Precious Jewelry",
  GRATE: "Steel Grate",
};

// Message lookup for speak actions
const ARBITRARY_MESSAGES: Record<string, string> = {
  GRATE_NOWAY: "The grate is locked and you don't have any keys.",
  ALREADY_OPEN: "It's already open.",
  ALREADY_LOCKED: "It's already locked.",
  NO_KEYS: "You don't have any keys.",
  NEED_LAMP: "You can't see anything without a lamp.",
  LAMP_OUT: "Your lamp has run out of power.",
  DONT_FIT: "You don't fit through the crack.",
  NO_CARRY: "You can't carry that.",
  BAD_DIRECTION: "There is no way to go in that direction.",
  UNSURE_FACING: "I am unsure what direction you are facing.",
  NO_MORE_DETAIL: "I can only tell you what I see.",
  NOTHING_HAPPENS: "Nothing happens.",
  OK_MAN: "OK.",
  DONT_UNDERSTAND: "I don't understand that!",
  PASSAGE_TOO_SMALL: "The passage is too small.",
  NEED_DETAIL: "I need more detailed instructions to do that.",
  CROSS_TROLL: "The troll refuses to let you cross.",
  TROLL_BLOCKS: "The troll stands by the bridge and insults you.",
  NO_BRIDGE: "There is no bridge across the chasm.",
  BRIDGE_GONE: "The bridge is gone.",
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function normaliseText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n{2,}/g, "\x00PARA\x00")
    .replace(/\n/g, " ")
    .replace(/\x00PARA\x00/g, "\n\n")
    .replace(/ {2,}/g, " ")
    .trim();
}

function toSceneId(locName: string): string {
  return locName.toLowerCase().replace(/^loc_/, "");
}

function toItemId(objName: string): string {
  return objName.toLowerCase();
}

function titleCase(str: string): string {
  return str
    .split(/[\s_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function extractTitle(locId: string, description: { short?: string; long?: string }): string {
  if (description.short && description.short !== "!!null") {
    const short = description.short.replace(/^You're /, "").replace(/\.$/, "");
    return titleCase(short.replace(/^(at |in |on |inside |outside |by |near )/, ""));
  }
  const name = locId.replace(/^LOC_/, "");
  return titleCase(name.replace(/_/g, " "));
}

function safeVerbId(verb: string): string {
  return verb.toLowerCase().replace(/[^a-z0-9_]/g, "");
}

function getVerbLabel(verb: string): string {
  const special = ["XYZZY", "PLUGH", "PLOVER", "Y2"];
  if (special.includes(verb.toUpperCase())) {
    return verb.toUpperCase();
  }
  return titleCase(verb);
}

// Check if travel rule has GRATE_CLOSED condition
function hasGrateClosedCondition(cond: any): boolean {
  if (!cond) return false;
  if (Array.isArray(cond)) {
    if (cond[0] === "not" && cond[2] === "GRATE_CLOSED") return true;
    return cond.some((c: any) => hasGrateClosedCondition(c));
  }
  return false;
}

function hasGrateOpenRequired(cond: any): boolean {
  if (!cond) return false;
  if (Array.isArray(cond)) {
    if (cond[0] === "not" && cond[2] === "GRATE_CLOSED") return true;
    return cond.some((c: any) => hasGrateOpenRequired(c));
  }
  return false;
}

const OBJECT_STATE_MAP: Record<string, number> = {
  SNAKE_BLOCKS: 0,
  UNBRIDGED: 0,
  BRIDGED: 1,
  PLANT_BELLOWING: 1,
  PLANT_GROWN: 2,
  DRAGON_BARS: 0,
  DOOR_RUSTED: 0,
  GRATE_CLOSED: 0,
};

function yamlCondToConditionalRoute(
  cond: any,
  actionType: string,
  target: string,
  messageTable: Record<string, string>
): ConditionalRoute | null {
  if (!cond || !Array.isArray(cond) || cond.length < 2) return null;
  if (hasGrateOpenRequired(cond)) return null;

  const condType = cond[0];
  const destSceneId = actionType === "goto" ? toSceneId(target) : undefined;
  const msgText = actionType === "speak"
    ? normaliseText(messageTable[target] || `[${target}] You can't go that way.`)
    : undefined;

  if (condType === "carry") {
    return {
      condition: { type: "carry", item: toItemId(cond[1]) },
      ...(destSceneId ? { to: destSceneId } : {}),
      ...(msgText ? { message: msgText } : {}),
    };
  }
  if (condType === "not") {
    const obj = cond[1];
    const stateName = cond[2];
    const stateNum = OBJECT_STATE_MAP[stateName] ?? 0;
    return {
      condition: { type: "not", object: toItemId(obj), state: String(stateNum) },
      ...(destSceneId ? { to: destSceneId } : {}),
      ...(msgText ? { message: msgText } : {}),
    };
  }
  if (condType === "with") {
    return {
      condition: { type: "with", object: toItemId(cond[1]) },
      ...(destSceneId ? { to: destSceneId } : {}),
      ...(msgText ? { message: msgText } : {}),
    };
  }
  if (condType === "pct") {
    return {
      condition: { type: "pct", percent: cond[1] },
      ...(destSceneId ? { to: destSceneId } : {}),
      ...(msgText ? { message: msgText } : {}),
    };
  }
  return null;
}

// ============================================================
// MAIN FUNCTION
// ============================================================
function main() {
  const yamlPath = path.resolve("adventure.yaml");
  if (!fs.existsSync(yamlPath)) {
    console.error("adventure.yaml not found at", yamlPath);
    process.exit(1);
  }

  console.log("=== CANONICAL OPEN ADVENTURE IMPORT ===");
  console.log(`YAML path: ${yamlPath}`);
  
  const content = fs.readFileSync(yamlPath, "utf-8");
  const data = parse(content);

  console.log("Top-level keys:", Object.keys(data));

  const locations: Map<string, any> = data.locations instanceof Map 
    ? data.locations 
    : new Map();
  const objects: Map<string, any> = data.objects instanceof Map 
    ? data.objects 
    : new Map();
  const arbitraryMsgs: Map<string, any> = data.arbitrary_messages instanceof Map
    ? data.arbitrary_messages
    : new Map();

  const hints: any[] = Array.isArray(data.hints) ? data.hints : [];
  const obituariesRaw: any[] = Array.isArray(data.obituaries) ? data.obituaries : [];
  const turnThresholdsRaw: any[] = Array.isArray(data.turn_thresholds) ? data.turn_thresholds : [];

  console.log(`Found ${locations.size} locations`);
  console.log(`Found ${objects.size} objects`);
  console.log(`Found ${arbitraryMsgs.size} arbitrary messages`);
  console.log(`Found ${hints.length} hints`);
  console.log(`Found ${obituariesRaw.length} obituaries`);
  console.log(`Found ${turnThresholdsRaw.length} turn thresholds`);

  // Extract canonical lamp messages
  const LAMP_MESSAGES: Record<string, string> = {};
  const lampMsgKeys = ['PITCH_DARK', 'LAMP_DIM', 'LAMP_OUT', 'GET_BATTERIES', 'REPLACE_BATTERIES', 'MISSING_BATTERIES'];
  for (const key of lampMsgKeys) {
    const msg = arbitraryMsgs.get(key);
    if (msg) {
      LAMP_MESSAGES[key] = normaliseText(msg);
    }
  }
  // Add lamp state change messages from lamp object
  const lampObj = objects.get('LAMP');
  if (lampObj && lampObj.changes) {
    LAMP_MESSAGES['LAMP_OFF'] = normaliseText(lampObj.changes[0]);
    LAMP_MESSAGES['LAMP_ON'] = normaliseText(lampObj.changes[1]);
  }

  // Build hints table
  interface HintEntry {
    number: number;
    name: string;
    turns: number;
    penalty: number;
    question: string;
    hint: string;
  }
  const HINTS: HintEntry[] = [];
  const hintNameToNumber: Map<string, number> = new Map();
  for (const h of hints) {
    const hintData = h.hint || h;
    if (hintData && hintData.name) {
      const num = hintData.number || (HINTS.length + 1);
      hintNameToNumber.set(hintData.name, num);
      HINTS.push({
        number: num,
        name: hintData.name,
        turns: hintData.turns || 0,
        penalty: hintData.penalty || 0,
        question: normaliseText(hintData.question || ""),
        hint: normaliseText(hintData.hint || ""),
      });
    }
  }

  // Build hint eligibility conditions keyed by hint name.
  // Scene-level checking (which scenes a hint can appear at) is already
  // handled by the hints[] array on each scene.  These conditions capture
  // the additional game-state requirements that must be true for the hint
  // to be eligible.  By pairing them with the hint NAME (which comes from
  // the YAML) the mapping survives re-imports even if hint numbers change.
  interface HintCondition {
    type: "flag_false" | "flag_true" | "not_carrying" | "carrying" | "treasure_count" | "always";
    flag?: string;
    item?: string;
    items?: string[];
    threshold?: number;
  }
  const HINT_CONDITIONS: Record<number, HintCondition> = {};
  for (const entry of HINTS) {
    switch (entry.name) {
      case "CAVE":
        HINT_CONDITIONS[entry.number] = { type: "flag_false", flag: "grateOpen" };
        break;
      case "BIRD":
        HINT_CONDITIONS[entry.number] = { type: "not_carrying", item: "bird" };
        break;
      case "SNAKE":
        HINT_CONDITIONS[entry.number] = { type: "not_carrying", item: "bird" };
        break;
      case "MAZE":
        HINT_CONDITIONS[entry.number] = { type: "not_carrying", item: "coins" };
        break;
      case "DARK":
        HINT_CONDITIONS[entry.number] = { type: "flag_false", flag: "crystalBridge" };
        break;
      case "WITT":
      case "CLIFF":
        HINT_CONDITIONS[entry.number] = { type: "always" };
        break;
      case "WOODS":
        HINT_CONDITIONS[entry.number] = { type: "not_carrying", item: "emerald" };
        break;
      case "OGRE":
        HINT_CONDITIONS[entry.number] = { type: "carrying", item: "emerald" };
        break;
      case "JADE":
        HINT_CONDITIONS[entry.number] = {
          type: "treasure_count",
          items: ["nugget", "coins", "eggs", "trident", "emerald", "pyramid",
                  "ruby", "sapph", "pearl", "chest", "rug", "spices", "chain"],
          threshold: 12,
        };
        break;
      default:
        HINT_CONDITIONS[entry.number] = { type: "always" };
        break;
    }
  }

  // Build obituaries table
  interface ObituaryEntry {
    query: string;
    yesResponse: string;
  }
  const OBITUARIES: ObituaryEntry[] = [];
  for (const obit of obituariesRaw) {
    if (obit && obit.query) {
      OBITUARIES.push({
        query: normaliseText(obit.query),
        yesResponse: normaliseText(obit.yes_response || ""),
      });
    }
  }

  // Build turn thresholds table
  interface TurnThresholdEntry {
    threshold: number;
    pointLoss: number;
    message: string;
  }
  const TURN_THRESHOLDS: TurnThresholdEntry[] = [];
  for (const tt of turnThresholdsRaw) {
    if (tt && tt.threshold) {
      TURN_THRESHOLDS.push({
        threshold: tt.threshold,
        pointLoss: tt.point_loss || 0,
        message: normaliseText(tt.message || ""),
      });
    }
  }

  // Build message lookup from YAML
  const messageTable: Record<string, string> = { ...ARBITRARY_MESSAGES };
  for (const [msgId, msg] of arbitraryMsgs) {
    if (typeof msg === "string") {
      messageTable[msgId] = normaliseText(msg);
    } else if (msg && typeof msg === "object" && msg.text) {
      messageTable[msgId] = normaliseText(msg.text);
    }
  }

  // Build map of items by their starting locations
  const objectsByLocation: Map<string, string[]> = new Map();
  for (const [objId, obj] of objects) {
    if (obj.immovable) continue;
    if (!obj.locations) continue;

    const locs = Array.isArray(obj.locations) ? obj.locations : [obj.locations];
    for (const loc of locs) {
      if (loc === "LOC_NOWHERE") continue;
      if (!objectsByLocation.has(loc)) {
        objectsByLocation.set(loc, []);
      }
      objectsByLocation.get(loc)!.push(objId);
    }
  }

  const SCENES: Record<string, Scene> = {};
  const ITEMS: Record<string, Item> = {};
  const scenesWithDefaultTravel: string[] = [];
  const complexTravelRules: string[] = [];
  
  // Collect canonical vocabulary for lexicon
  const canonTravelVerbs = new Set<string>();
  const canonObjects: { id: string; name: string }[] = [];

  // ============================================================
  // PARSE ALL LOCATIONS INTO SCENES (canonical, no modifications)
  // ============================================================
  for (const [locId, loc] of locations) {
    if (locId === "LOC_NOWHERE") continue;
    if (!loc.description?.long) continue;

    const sceneId = toSceneId(locId);
    const title = extractTitle(locId, loc.description);
    const longText = normaliseText(loc.description.long || loc.description.short || "A mysterious place.");
    const shortText = normaliseText(loc.description.short || loc.description.long || "A mysterious place.");
    const maptag = loc.description.maptag && loc.description.maptag !== "!!null" ? loc.description.maptag : undefined;

    const actions: Action[] = [
      { id: "look", label: "LOOK AROUND", type: "command", command: "look" },
    ];

    const seenActionIds = new Set<string>(["look"]);
    let hasDefaultTravel = false;

    if (loc.travel) {
      interface TravelEntry {
        actionType: string;
        target: string;
        cond: any;
      }
      const verbTravelGroups: Map<string, TravelEntry[]> = new Map();
      const defaultTravels: TravelEntry[] = [];
      const standaloneSpeak: { verb: string; msgId: string; msgText: string; cond: any }[] = [];

      for (const travel of loc.travel) {
        if (!travel.action) continue;
        const [actionType, target] = travel.action;
        const verbs: string[] = travel.verbs || [];
        const cond = travel.cond || null;

        if (verbs.length === 0) {
          defaultTravels.push({ actionType, target, cond });
          continue;
        }

        if (actionType === "special") {
          complexTravelRules.push(`${locId}: special action not modeled`);
          continue;
        }

        for (const verb of verbs) {
          canonTravelVerbs.add(verb.toLowerCase());

          const dirInfo = DIRECTION_MAP[verb];
          const verbLower = safeVerbId(verb);
          const actionId = dirInfo ? dirInfo.actionId : `go_${verbLower}`;

          if (!verbTravelGroups.has(actionId)) {
            verbTravelGroups.set(actionId, []);
          }
          verbTravelGroups.get(actionId)!.push({ actionType, target, cond });
        }
      }

      for (const dt of defaultTravels) {
        if (dt.actionType === "goto" && !hasDefaultTravel) {
          hasDefaultTravel = true;
          const destSceneId = toSceneId(dt.target);
          const defaultAction: Action = {
            id: "go_default",
            label: "CONTINUE",
            type: "move",
            to: destSceneId,
          };
          if (dt.cond) {
            const cr = yamlCondToConditionalRoute(dt.cond, dt.actionType, dt.target, messageTable);
            if (cr) {
              defaultAction.conditionalRoutes = [cr];
              defaultAction.to = destSceneId;
            }
          }
          actions.push(defaultAction);
          scenesWithDefaultTravel.push(`${sceneId} -> ${destSceneId}`);
        }
      }

      for (const [actionId, entries] of verbTravelGroups) {
        if (seenActionIds.has(actionId)) continue;
        seenActionIds.add(actionId);

        const firstVerb = entries[0];
        const verb = actionId.replace(/^go_/, "");
        const dirInfo = Object.values(DIRECTION_MAP).find(d => d.actionId === actionId);
        const label = dirInfo ? dirInfo.label : getVerbLabel(verb);

        const conditionalEntries = entries.filter(e => e.cond && !hasGrateOpenRequired(e.cond));
        const unconditionalGotos = entries.filter(e => !e.cond && e.actionType === "goto");
        const grateEntries = entries.filter(e => e.cond && hasGrateOpenRequired(e.cond) && e.actionType === "goto");
        const unconditionalSpeaks = entries.filter(e => !e.cond && e.actionType === "speak");

        if (unconditionalSpeaks.length > 0 && unconditionalGotos.length === 0 && conditionalEntries.length === 0) {
          const msgId = unconditionalSpeaks[0].target;
          const msgText = normaliseText(messageTable[msgId] || `[${msgId}] You can't go that way.`);
          actions.push({
            id: `say_${msgId.toLowerCase()}_${verb}`,
            label: label,
            type: "event",
            message: msgText,
            uiHint: "hidden",
          });
          continue;
        }

        if (grateEntries.length > 0 && unconditionalGotos.length === 0 && conditionalEntries.length === 0) {
          const destSceneId = toSceneId(grateEntries[0].target);
          actions.push({
            id: actionId,
            label: label,
            type: "move",
            to: destSceneId,
            requiresFlag: "grateOpen",
          });
          continue;
        }

        const conditionalRoutes: ConditionalRoute[] = [];
        let defaultDest: string | undefined;
        let requiresFlag: string | undefined;

        if (grateEntries.length > 0) {
          defaultDest = toSceneId(grateEntries[0].target);
          requiresFlag = "grateOpen";
        }

        for (const entry of conditionalEntries) {
          const cr = yamlCondToConditionalRoute(entry.cond, entry.actionType, entry.target, messageTable);
          if (cr) {
            conditionalRoutes.push(cr);
          }
        }

        if (unconditionalGotos.length > 0) {
          defaultDest = toSceneId(unconditionalGotos[0].target);
        }

        if (!defaultDest && unconditionalSpeaks.length > 0) {
          const msgId = unconditionalSpeaks[0].target;
          const msgText = normaliseText(messageTable[msgId] || `[${msgId}] You can't go that way.`);
          if (conditionalRoutes.length > 0) {
            const moveAction: Action = {
              id: actionId,
              label: label,
              type: "move",
              to: "__blocked__",
              conditionalRoutes: conditionalRoutes,
              message: msgText,
            };
            if (requiresFlag) moveAction.requiresFlag = requiresFlag;
            actions.push(moveAction);
          } else {
            actions.push({
              id: `say_${msgId.toLowerCase()}_${verb}`,
              label: label,
              type: "event",
              message: msgText,
              uiHint: "hidden",
            });
          }
          continue;
        }

        if (!defaultDest && conditionalRoutes.length > 0) {
          continue;
        }

        if (!defaultDest) {
          continue;
        }

        const moveAction: Action = {
          id: actionId,
          label: label,
          type: "move",
          to: defaultDest,
        };

        if (requiresFlag) {
          moveAction.requiresFlag = requiresFlag;
        }

        if (conditionalRoutes.length > 0) {
          moveAction.conditionalRoutes = conditionalRoutes;
        }

        actions.push(moveAction);
      }
    }

    // Add items from canonical locations
    const sceneItems: string[] = [];
    const itemDescriptions: Record<string, string> = {};

    const locItems = objectsByLocation.get(locId) || [];
    for (const objId of locItems) {
      const obj = objects.get(objId);
      if (!obj) continue;

      const itemId = toItemId(objId);
      sceneItems.push(itemId);

      const displayName = DISPLAY_NAME_MAP[objId] || obj.inventory || titleCase(objId);
      const itemDesc = normaliseText(obj.descriptions?.[0] || `You see ${displayName} here.`);
      itemDescriptions[itemId] = itemDesc;

      actions.push({
        id: `take_${itemId}`,
        label: `TAKE ${displayName.toUpperCase()}`,
        type: "event",
        addsItem: itemId,
        removesAction: true,
      });

      if (!ITEMS[itemId]) {
        const itemDescription = normaliseText(obj.descriptions?.[0] || `A ${displayName.toLowerCase()}.`);

        const item: Item = {
          id: itemId,
          name: displayName.replace(/^\*/, ""),
          description: itemDescription,
          usable: false,
        };

        // Mark oil as usable (canonical lamp refill behavior)
        if (objId === "OIL" || itemId === "oil") {
          item.usable = true;
          item.useEffect = {
            lightBonus: 30,
            message: "You refill the lamp. The flame burns brighter.",
          };
        }

        // Mark keys as usable for opening grate
        if (objId === "KEYS" || itemId === "keys") {
          item.usable = true;
          item.useEffect = {
            message: "You unlock the grate with the keys.",
            setsFlag: "grateOpen",
          };
        }

        ITEMS[itemId] = item;
        
        // Collect for lexicon
        canonObjects.push({ id: itemId, name: item.name });
      }
    }

    const sceneDescription: SceneDescription = {
      long: longText,
      short: shortText,
    };
    if (maptag) {
      sceneDescription.maptag = maptag;
    }

    const scene: Scene = {
      id: sceneId,
      title,
      description: sceneDescription,
      actions,
    };

    if (sceneItems.length > 0) {
      scene.items = sceneItems;
      scene.itemDescriptions = itemDescriptions;
    }

    if (loc.sound) {
      scene.sound = loc.sound;
    }

    if (loc.conditions && Object.keys(loc.conditions).length > 0) {
      scene.conditions = loc.conditions;
    }

    if (loc.hints && Array.isArray(loc.hints) && loc.hints.length > 0) {
      const hintNumbers: number[] = [];
      for (const hRef of loc.hints) {
        if (hRef && hRef.name) {
          const num = hintNameToNumber.get(hRef.name);
          if (num !== undefined) {
            hintNumbers.push(num);
          }
        }
      }
      if (hintNumbers.length > 0) {
        scene.hints = hintNumbers;
      }
    }

    SCENES[sceneId] = scene;
  }

  // ============================================================
  // DETERMINE CANONICAL START SCENE
  // ============================================================
  let START_SCENE_ID = "start";
  
  // Verify start scene exists
  if (!SCENES[START_SCENE_ID]) {
    // Fallback: find a scene with "end of road" or "brick building"
    for (const [sceneId, scene] of Object.entries(SCENES)) {
      const text = `${scene.title} ${scene.description.long}`.toLowerCase();
      if (text.includes("end of a road") || text.includes("brick building")) {
        START_SCENE_ID = sceneId;
        break;
      }
    }
  }

  console.log(`\n=== START SCENE ===`);
  console.log(`START_SCENE_ID: ${START_SCENE_ID}`);
  console.log(`Title: ${SCENES[START_SCENE_ID]?.title || "NOT FOUND"}`);

  // ============================================================
  // VALIDATION (4F)
  // ============================================================
  console.log(`\n=== VALIDATION ===`);
  
  const sceneCount = Object.keys(SCENES).length;
  const itemCount = Object.keys(ITEMS).length;
  
  console.log(`Scene count: ${sceneCount}`);
  console.log(`Item count: ${itemCount}`);

  // List scenes with go_default
  console.log(`\nScenes with go_default (${scenesWithDefaultTravel.length}):`);
  scenesWithDefaultTravel.forEach(s => console.log(`  - ${s}`));

  // Validate specific scenes
  console.log(`\n=== SPECIFIC VALIDATION ===`);
  
  // Check foof1 -> debris
  const foof1 = SCENES["foof1"];
  if (foof1) {
    const hasDefault = foof1.actions.some(a => a.id === "go_default");
    console.log(`foof1 has go_default: ${hasDefault}`);
    if (hasDefault) {
      const defaultAction = foof1.actions.find(a => a.id === "go_default");
      console.log(`  -> destination: ${defaultAction?.to}`);
    }
  } else {
    console.log(`foof1: NOT FOUND`);
  }

  // Check foof3 -> y2
  const foof3 = SCENES["foof3"];
  if (foof3) {
    const hasDefault = foof3.actions.some(a => a.id === "go_default");
    console.log(`foof3 has go_default: ${hasDefault}`);
    if (hasDefault) {
      const defaultAction = foof3.actions.find(a => a.id === "go_default");
      console.log(`  -> destination: ${defaultAction?.to}`);
    }
  } else {
    console.log(`foof3: NOT FOUND`);
  }

  // Check building has xyzzy/plugh
  const building = SCENES["building"] || SCENES["start"];
  if (building) {
    const hasXyzzy = building.actions.some(a => a.id === "go_xyzzy");
    const hasPlugh = building.actions.some(a => a.id === "go_plugh");
    console.log(`building/start has go_xyzzy: ${hasXyzzy}`);
    console.log(`building/start has go_plugh: ${hasPlugh}`);
    if (hasXyzzy) {
      const xyzzyAction = building.actions.find(a => a.id === "go_xyzzy");
      console.log(`  xyzzy -> ${xyzzyAction?.to}`);
    }
    if (hasPlugh) {
      const plughAction = building.actions.find(a => a.id === "go_plugh");
      console.log(`  plugh -> ${plughAction?.to}`);
    }
  }

  // Check grate has enter with requiresFlag and message event
  const grate = SCENES["grate"];
  if (grate) {
    const enterMove = grate.actions.find(a => a.type === "move" && (a.id === "go_enter" || a.id === "go_in"));
    const enterMessage = grate.actions.find(a => a.type === "event" && a.message && (a.label.toLowerCase().includes("enter") || a.id.includes("enter")));
    console.log(`grate has ENTER move action: ${!!enterMove}`);
    if (enterMove) {
      console.log(`  -> requires grateOpen: ${(enterMove as any).requiresFlag === "grateOpen"}`);
      console.log(`  -> destination: ${enterMove.to}`);
    }
    console.log(`grate has ENTER message event: ${!!enterMessage}`);
    if (enterMessage) {
      console.log(`  -> message: ${(enterMessage as any).message?.substring(0, 50)}...`);
    }
  } else {
    console.log(`grate: NOT FOUND`);
  }

  // Validate move actions point to existing scenes
  let brokenLinks = 0;
  for (const [sceneId, scene] of Object.entries(SCENES)) {
    for (const action of scene.actions) {
      if (action.type === "move" && action.to && !SCENES[action.to]) {
        if (brokenLinks < 10) {
          console.warn(`WARNING: ${sceneId} has move to non-existent scene: ${action.to}`);
        }
        brokenLinks++;
      }
    }
  }
  console.log(`\nBroken move links: ${brokenLinks}`);

  if (complexTravelRules.length > 0) {
    console.log(`\nComplex travel rules not modeled: ${complexTravelRules.length}`);
    complexTravelRules.slice(0, 5).forEach(r => console.log(`  - ${r}`));
    if (complexTravelRules.length > 5) {
      console.log(`  ... and ${complexTravelRules.length - 5} more`);
    }
  }

  // ============================================================
  // GENERATE OUTPUT
  // ============================================================
  const introMessages = [
    "Welcome to ADVENTURE!",
    "Somewhere nearby is Colossal Cave, where others have found fortunes in treasure and gold, though it is rumored that some who enter are never seen again.",
    "Magic is said to work in the cave.",
    "Type HELP for a list of commands."
  ];

  const helpText = `COMMANDS:
- LOOK: Examine your surroundings
- INVENTORY / INV: Check what you're carrying
- TAKE <item>: Pick up an item
- USE <item>: Use an item (e.g., USE KEYS to unlock the grate)
- GO <direction>: Move (north, south, east, west, up, down, in, out, ne, nw, se, sw)
- GO BACK / BACK: Return to previous room
- HELP: Show this message

DIRECTIONS: north (n), south (s), east (e), west (w), up (u), down (d), in, out, northeast (ne), northwest (nw), southeast (se), southwest (sw)

SPECIAL WORDS: xyzzy, plugh, plover (try them in the right places!)`;

  const output = `// AUTO-GENERATED FROM adventure.yaml - DO NOT EDIT
// Generated: ${new Date().toISOString()}
// Canonical Open Adventure import with travel mechanics

export interface ConditionalRoute {
  condition: {
    type: "carry" | "not" | "with" | "pct";
    item?: string;
    object?: string;
    state?: string;
    percent?: number;
  };
  to?: string;
  message?: string;
}

export interface Action {
  id: string;
  label: string;
  type: "command" | "event" | "move";
  command?: string;
  to?: string;
  requiresItem?: string;
  removesAction?: boolean;
  addsItem?: string;
  setsFlag?: string;
  lightCost?: number;
  requiresFlag?: string;
  message?: string;
  uiHint?: "auto" | "nav" | "hidden";
  conditionalRoutes?: ConditionalRoute[];
}

export interface SceneDescription {
  long: string;
  short: string;
  maptag?: string;
}

export interface Scene {
  id: string;
  title: string;
  description: SceneDescription;
  itemDescriptions?: Record<string, string>;
  actions: Action[];
  items?: string[];
  sound?: string;
  conditions?: Record<string, boolean>;
  hints?: number[];
}

export interface Item {
  id: string;
  name: string;
  description: string;
  usable: boolean;
  useEffect?: {
    lightBonus?: number;
    message: string;
    setsFlag?: string;
  };
}

export interface HintCondition {
  type: "flag_false" | "flag_true" | "not_carrying" | "carrying" | "treasure_count" | "always";
  flag?: string;
  item?: string;
  items?: string[];
  threshold?: number;
}

export interface HintEntry {
  number: number;
  name: string;
  turns: number;
  penalty: number;
  question: string;
  hint: string;
}

export interface ObituaryEntry {
  query: string;
  yesResponse: string;
}

export interface TurnThresholdEntry {
  threshold: number;
  pointLoss: number;
  message: string;
}

export type LampMessages = Record<string, string>;

export const START_SCENE_ID: string = ${JSON.stringify(START_SCENE_ID)};

export const INTRO_MESSAGES: string[] = ${JSON.stringify(introMessages, null, 2)};

export const HELP_TEXT: string = ${JSON.stringify(helpText)};

// Canonical vocabulary extracted from YAML for lexicon
export const CANON_TRAVEL_VERBS: string[] = ${JSON.stringify([...canonTravelVerbs].sort(), null, 2)};

export const CANON_OBJECTS: { id: string; name: string }[] = ${JSON.stringify(canonObjects, null, 2)};

export const HINTS: HintEntry[] = ${JSON.stringify(HINTS, null, 2)};

export const HINT_CONDITIONS: Record<number, HintCondition> = ${JSON.stringify(HINT_CONDITIONS, null, 2)};

export const OBITUARIES: ObituaryEntry[] = ${JSON.stringify(OBITUARIES, null, 2)};

export const TURN_THRESHOLDS: TurnThresholdEntry[] = ${JSON.stringify(TURN_THRESHOLDS, null, 2)};

export const LAMP_MESSAGES: Record<string, string> = ${JSON.stringify(LAMP_MESSAGES, null, 2)};

export const ITEMS: Record<string, Item> = ${JSON.stringify(ITEMS, null, 2)};

export const SCENES: Record<string, Scene> = ${JSON.stringify(SCENES, null, 2)};
`;

  const outputPath = path.resolve("client/data/generatedStory.ts");
  fs.writeFileSync(outputPath, output, "utf-8");

  console.log(`\n=== OUTPUT ===`);
  console.log(`Written to: ${outputPath}`);
  console.log(`Scene count: ${sceneCount}`);
  console.log(`Item count: ${itemCount}`);
  console.log(`START_SCENE_ID: ${START_SCENE_ID}`);

  // ============================================================
  // GENERATE canonObjects.ts
  // ============================================================
  console.log(`\n=== GENERATING canonObjects.ts ===`);

  const objectStartLocations: Record<string, string> = {};
  const treasureIds: string[] = [];
  const immovableObjects: string[] = [];
  const npcLocations: Record<string, string | string[]> = {};

  for (const [objId, obj] of objects) {
    const itemId = toItemId(objId);
    const locs = obj.locations
      ? (Array.isArray(obj.locations) ? obj.locations : [obj.locations])
      : [];
    const sceneIdLocs = locs
      .filter((l: string) => l !== "LOC_NOWHERE")
      .map((l: string) => toSceneId(l));

    if (obj.immovable) {
      immovableObjects.push(itemId);
      if (sceneIdLocs.length === 1) {
        npcLocations[itemId] = sceneIdLocs[0];
      } else if (sceneIdLocs.length > 1) {
        npcLocations[itemId] = sceneIdLocs;
      }
    } else if (sceneIdLocs.length > 0) {
      objectStartLocations[itemId] = sceneIdLocs[0];
    }

    if (obj.treasure) {
      treasureIds.push(itemId);
    }
  }

  const treasureValues: Record<string, number> = {};
  const SMALL_TREASURE_VALUE = 12;
  const LARGE_TREASURE_VALUE = 16;
  const smallTreasures = new Set(["nugget", "obj_51", "obj_52", "obj_53", "coins"]);
  for (const tid of treasureIds) {
    if (smallTreasures.has(tid)) {
      treasureValues[tid] = SMALL_TREASURE_VALUE;
    } else if (tid === "chest") {
      treasureValues[tid] = 14;
    } else {
      treasureValues[tid] = LARGE_TREASURE_VALUE;
    }
  }

  const snakeLoc = npcLocations["snake"] || "kinghall";
  const dragonLocs = Array.isArray(npcLocations["dragon"]) ? npcLocations["dragon"] : [npcLocations["dragon"] || "secret4"];
  const trollLocs = Array.isArray(npcLocations["troll"]) ? npcLocations["troll"] : [npcLocations["troll"] || "swchasm"];
  const ogreLoc = (typeof npcLocations["ogre"] === "string") ? npcLocations["ogre"] : "large";
  const bearLoc = (typeof npcLocations["bear"] === "string") ? npcLocations["bear"] : "barrenroom";
  const plantLoc = (typeof npcLocations["plant"] === "string") ? npcLocations["plant"] : "westpit";
  const clamLoc = (typeof npcLocations["clam"] === "string") ? npcLocations["clam"] : "shellroom";
  const doorLoc = (typeof npcLocations["door"] === "string") ? npcLocations["door"] : "immense";
  const fissureLocs = Array.isArray(npcLocations["fissure"]) ? npcLocations["fissure"] : [npcLocations["fissure"] || "eastbank"];
  const chasmLocs = Array.isArray(npcLocations["chasm"]) ? npcLocations["chasm"] : [npcLocations["chasm"] || "swchasm"];
  const urnLoc = (typeof npcLocations["urn"] === "string") ? npcLocations["urn"] : "cliff";
  const cavityLoc = (typeof npcLocations["cavity"] === "string") ? npcLocations["cavity"] : "cliff";

  const canonObjectsOutput = `// AUTO-GENERATED FROM adventure.yaml - DO NOT EDIT MANUALLY
// Generated: ${new Date().toISOString()}
// Run: npx tsx tools/importOpenAdventure.ts to regenerate

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

export const OBJECT_START_LOCATIONS: Record<string, string> = ${JSON.stringify(objectStartLocations, null, 2)};

export const OGRE_LOCATION = ${JSON.stringify(ogreLoc)};

export const SNAKE_LOCATION = ${JSON.stringify(typeof snakeLoc === "string" ? snakeLoc : snakeLoc[0])};
export const DRAGON_LOCATIONS = ${JSON.stringify(dragonLocs)};
export const TROLL_LOCATIONS = ${JSON.stringify(trollLocs)};
export const BEAR_LOCATION = ${JSON.stringify(bearLoc)};
export const PLANT_LOCATION = ${JSON.stringify(plantLoc)};
export const CLAM_LOCATION = ${JSON.stringify(clamLoc)};
export const URN_LOCATION = ${JSON.stringify(urnLoc)};
export const CAVITY_LOCATION = ${JSON.stringify(cavityLoc)};

export const TREASURE_IDS: string[] = ${JSON.stringify(treasureIds, null, 2)};

export const TREASURE_VALUES: Record<string, number> = ${JSON.stringify(treasureValues, null, 2)};

export const IMMOVABLE_OBJECTS = new Set(${JSON.stringify(immovableObjects, null, 2)});

export function buildInitialObjectLocations(): Record<string, string> {
  const locations: Record<string, string> = {};
  for (const [objId, locId] of Object.entries(OBJECT_START_LOCATIONS)) {
    locations[objId] = locId;
  }
  locations["snake"] = SNAKE_LOCATION;
  locations["troll"] = TROLL_LOCATIONS[0];
  locations["ogre"] = OGRE_LOCATION;
  locations["dragon"] = DRAGON_LOCATIONS[0];
  locations["fissure"] = ${JSON.stringify(fissureLocs[0])};
  locations["door"] = ${JSON.stringify(doorLoc)};
  locations["chasm"] = ${JSON.stringify(chasmLocs[0])};
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
`;

  const canonObjectsPath = path.resolve("client/data/canonObjects.ts");
  fs.writeFileSync(canonObjectsPath, canonObjectsOutput, "utf-8");
  console.log(`Written to: ${canonObjectsPath}`);
  console.log(`Object start locations: ${Object.keys(objectStartLocations).length}`);
  console.log(`Treasure IDs: ${treasureIds.length}`);
  console.log(`Immovable objects: ${immovableObjects.length}`);

  // Validate generated locations against scenes
  let canonMismatches = 0;
  for (const [itemId, loc] of Object.entries(objectStartLocations)) {
    if (loc !== "_nowhere" && !SCENES[loc]) {
      console.warn(`CANON WARNING: item ${itemId} start location ${loc} has no matching scene`);
      canonMismatches++;
    }
  }
  console.log(`Canon location mismatches: ${canonMismatches}`);

  console.log(`\nImport complete!`);

  console.log(`\n=== RUNNING NARRATIVE EXIT AUDIT ===`);
  try {
    const { execSync } = require("child_process");
    execSync("npx tsx tools/auditNarrativeExits.ts", { stdio: "inherit" });
  } catch (e) {
    console.warn("Narrative exit audit failed (non-fatal):", (e as Error).message);
  }
}

main();
