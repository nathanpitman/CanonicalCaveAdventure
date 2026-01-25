import * as fs from "fs";
import * as path from "path";
import { parse } from "yaml";

// ============================================================
// TYPE DEFINITIONS
// ============================================================
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
}

interface Scene {
  id: string;
  title: string;
  description: string;
  descriptionWithoutItems?: string;
  itemDescriptions?: Record<string, string>;
  actions: Action[];
  items?: string[];
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
  ENTER: { actionId: "go_in", label: "ENTER" },
  CRAWL: { actionId: "go_crawl", label: "CRAWL" },
  CROSS: { actionId: "go_cross", label: "CROSS" },
  D: { actionId: "go_down", label: "GO DOWN" },
  U: { actionId: "go_up", label: "GO UP" },
  BUILD: { actionId: "go_building", label: "GO TO BUILDING" },
  XYZZY: { actionId: "go_xyzzy", label: "XYZZY" },
  PLUGH: { actionId: "go_plugh", label: "PLUGH" },
  PLOVE: { actionId: "go_plover", label: "PLOVER" },
  JUMP: { actionId: "go_jump", label: "JUMP" },
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
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
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

  console.log(`Found ${locations.size} locations`);
  console.log(`Found ${objects.size} objects`);

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
  const ignoredDirections = new Set<string>();
  const complexTravelRules: string[] = [];

  // ============================================================
  // PARSE ALL LOCATIONS INTO SCENES (canonical, no modifications)
  // ============================================================
  for (const [locId, loc] of locations) {
    if (locId === "LOC_NOWHERE") continue;
    if (!loc.description?.long) continue;

    const sceneId = toSceneId(locId);
    const title = extractTitle(locId, loc.description);
    const description = loc.description.long || loc.description.short || "A mysterious place.";

    const actions: Action[] = [
      { id: "look", label: "LOOK AROUND", type: "command", command: "look" },
    ];

    const seenDirections = new Set<string>();

    if (loc.travel) {
      for (const travel of loc.travel) {
        if (!travel.action) continue;
        const [actionType, target] = travel.action;
        
        // Only handle simple goto actions
        if (actionType !== "goto") {
          if (actionType === "speak" || actionType === "special") {
            complexTravelRules.push(`${locId}: ${actionType} action not modeled`);
          }
          continue;
        }

        // Check for conditional travel
        if (travel.cond) {
          complexTravelRules.push(`${locId} -> ${target}: conditional travel (${JSON.stringify(travel.cond)})`);
        }

        for (const verb of travel.verbs || []) {
          const dirInfo = DIRECTION_MAP[verb];
          if (dirInfo && !seenDirections.has(dirInfo.actionId)) {
            seenDirections.add(dirInfo.actionId);
            actions.push({
              id: dirInfo.actionId,
              label: dirInfo.label,
              type: "move",
              to: toSceneId(target),
            });
          } else if (!dirInfo && !DIRECTION_MAP[verb]) {
            ignoredDirections.add(verb);
          }
        }
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
      const itemDesc = obj.descriptions?.[0] || `You see ${displayName} here.`;
      itemDescriptions[itemId] = itemDesc;

      actions.push({
        id: `take_${itemId}`,
        label: `TAKE ${displayName.toUpperCase()}`,
        type: "event",
        addsItem: itemId,
        removesAction: true,
      });

      if (!ITEMS[itemId]) {
        const itemDescription = obj.descriptions?.[0] || `A ${displayName.toLowerCase()}.`;

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

        ITEMS[itemId] = item;
      }
    }

    const scene: Scene = {
      id: sceneId,
      title,
      description,
      descriptionWithoutItems: description,
      actions,
    };

    if (sceneItems.length > 0) {
      scene.items = sceneItems;
      scene.itemDescriptions = itemDescriptions;
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
      const text = `${scene.title} ${scene.description}`.toLowerCase();
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
  // VALIDATION
  // ============================================================
  console.log(`\n=== VALIDATION ===`);
  
  const sceneCount = Object.keys(SCENES).length;
  const itemCount = Object.keys(ITEMS).length;
  
  console.log(`Scene count: ${sceneCount} (expected > 100)`);
  console.log(`Item count: ${itemCount} (expected > 20)`);
  
  if (sceneCount <= 100) {
    console.warn("WARNING: Scene count below expected threshold!");
  }
  if (itemCount <= 20) {
    console.warn("WARNING: Item count below expected threshold!");
  }
  if (!SCENES[START_SCENE_ID]) {
    console.error("ERROR: START_SCENE_ID does not exist in SCENES!");
    process.exit(1);
  }

  // Validate move actions point to existing scenes
  let brokenLinks = 0;
  for (const [sceneId, scene] of Object.entries(SCENES)) {
    for (const action of scene.actions) {
      if (action.type === "move" && action.to && !SCENES[action.to]) {
        console.warn(`WARNING: ${sceneId} has move to non-existent scene: ${action.to}`);
        brokenLinks++;
      }
    }
  }
  console.log(`Broken move links: ${brokenLinks}`);

  if (ignoredDirections.size > 0) {
    console.log(`\nIgnored direction verbs: ${Array.from(ignoredDirections).join(", ")}`);
  }

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
- USE <item>: Use an item
- GO <direction>: Move (north, south, east, west, up, down, in, out, ne, nw, se, sw)
- GO BACK / BACK: Return to previous room
- HELP: Show this message

DIRECTIONS: north (n), south (s), east (e), west (w), up (u), down (d), in, out, northeast (ne), northwest (nw), southeast (se), southwest (sw)

SPECIAL WORDS: xyzzy, plugh, plover (try them in the right places!)`;

  const output = `// AUTO-GENERATED FROM adventure.yaml - DO NOT EDIT
// Generated: ${new Date().toISOString()}
// Canonical Open Adventure import - no modifications

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
}

export interface Scene {
  id: string;
  title: string;
  description: string;
  descriptionWithoutItems?: string;
  itemDescriptions?: Record<string, string>;
  actions: Action[];
  items?: string[];
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

export const START_SCENE_ID: string = ${JSON.stringify(START_SCENE_ID)};

export const INTRO_MESSAGES: string[] = ${JSON.stringify(introMessages, null, 2)};

export const HELP_TEXT: string = ${JSON.stringify(helpText)};

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
  console.log(`\nImport complete!`);
}

main();
