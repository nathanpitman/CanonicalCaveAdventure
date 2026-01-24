import * as fs from "fs";
import * as path from "path";
import { parse } from "yaml";

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
  NE: { actionId: "go_ne", label: "GO NORTHEAST" },
  NW: { actionId: "go_nw", label: "GO NORTHWEST" },
  SE: { actionId: "go_se", label: "GO SOUTHEAST" },
  SW: { actionId: "go_sw", label: "GO SOUTHWEST" },
  ENTER: { actionId: "go_in", label: "ENTER" },
  CRAWL: { actionId: "go_crawl", label: "CRAWL" },
};

const DISPLAY_NAME_MAP: Record<string, string> = {
  LAMP: "Brass Lantern",
  KEYS: "Set of Keys",
  FOOD: "Tasty Rations",
  BOTTLE: "Water Bottle",
  CAGE: "Wicker Cage",
  ROD: "Black Rod",
  PILLOW: "Velvet Pillow",
  BIRD: "Little Bird",
  OIL: "Lamp Oil",
  MAGAZINE: "Magazine",
  AXE: "Dwarf's Axe",
};

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

function main() {
  const yamlPath = path.resolve("adventure.yaml");
  if (!fs.existsSync(yamlPath)) {
    console.error("adventure.yaml not found at", yamlPath);
    process.exit(1);
  }

  console.log("Reading adventure.yaml...");
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
        if (actionType !== "goto") continue;

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

    const sceneItems: string[] = [];
    const itemDescriptions: Record<string, string> = {};

    const locItems = objectsByLocation.get(locId) || [];
    for (const objId of locItems) {
      const obj = objects.get(objId);
      if (!obj) continue;

      const itemId = toItemId(objId);
      sceneItems.push(itemId);

      const itemDesc = obj.descriptions?.[0] || `You see ${DISPLAY_NAME_MAP[objId] || titleCase(objId)} here.`;
      itemDescriptions[itemId] = itemDesc;

      actions.push({
        id: `take_${itemId}`,
        label: `TAKE ${(DISPLAY_NAME_MAP[objId] || titleCase(objId)).toUpperCase()}`,
        type: "event",
        addsItem: itemId,
        removesAction: true,
      });

      if (!ITEMS[itemId]) {
        const displayName = DISPLAY_NAME_MAP[objId] || obj.inventory || titleCase(objId);
        const itemDescription = obj.descriptions?.[0] || `A ${displayName.toLowerCase()}.`;

        const item: Item = {
          id: itemId,
          name: displayName.replace(/^\*/, ""),
          description: itemDescription,
          usable: false,
        };

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
      actions,
    };

    if (sceneItems.length > 0) {
      scene.items = sceneItems;
      scene.itemDescriptions = itemDescriptions;
    }

    SCENES[sceneId] = scene;
  }

  SCENES["chasm_base"] = {
    id: "chasm_base",
    title: "Base of the Chasm",
    description:
      "Cold air. Dust. You lie at the bottom of a vertical mining shaft, the distant sky a pale disc far above. Rough-hewn walls rise around you, disappearing into shadow. A faint draft whispers from a tunnel to the east.\n\nAn old oil lamp lies nearby, its glass clouded but intact.",
    descriptionWithoutItems:
      "Cold air. Dust. You lie at the bottom of a vertical mining shaft, the distant sky a pale disc far above. Rough-hewn walls rise around you, disappearing into shadow. A faint draft whispers from a tunnel to the east.",
    itemDescriptions: {
      lamp: "An old oil lamp lies nearby, its glass clouded but intact.",
    },
    actions: [
      { id: "look", label: "LOOK AROUND", type: "command", command: "look" },
      {
        id: "take_lamp",
        label: "TAKE LAMP",
        type: "event",
        addsItem: "lamp",
        setsFlag: "hasLamp",
        removesAction: true,
      },
      { id: "go_east", label: "GO EAST", type: "move", to: "start" },
    ],
    items: ["lamp"],
  };

  ITEMS["lamp"] = {
    id: "lamp",
    name: "Oil Lamp",
    description: "A battered oil lamp. Its warm glow pushes back the darkness.",
    usable: false,
  };

  ITEMS["fuel"] = {
    id: "fuel",
    name: "Lamp Fuel",
    description: "A small canister of lamp oil. Could restore some light.",
    usable: true,
    useEffect: {
      lightBonus: 30,
      message: "You refill the lamp. The flame burns brighter.",
    },
  };

  if (!SCENES["start"]) {
    console.error("WARNING: LOC_START not found, checking available scenes...");
    const availableScenes = Object.keys(SCENES).slice(0, 10);
    console.log("Available scenes:", availableScenes);
  }

  console.log("\n--- VALIDATION ---");
  console.log(`Total scenes: ${Object.keys(SCENES).length}`);
  console.log(`Total items: ${Object.keys(ITEMS).length}`);
  console.log(`chasm_base exists: ${!!SCENES["chasm_base"]}`);
  console.log(`start exists: ${!!SCENES["start"]}`);

  if (SCENES["start"]) {
    const startExits = SCENES["start"].actions.filter((a) => a.type === "move").length;
    console.log(`start scene has ${startExits} exits`);
  }

  if (ignoredDirections.size > 0) {
    console.log("\nIgnored direction verbs:", Array.from(ignoredDirections).join(", "));
  }

  const INTRO_MESSAGES = [
    {
      type: "narration" as const,
      text: "You fell.\n\nOne moment, solid ground. The next, darkness and the shriek of breaking timber.",
    },
    {
      type: "narration" as const,
      text: "You don't know how long you were unconscious. Hours? Days? Your head throbs. Your supplies are gone—scattered somewhere in the collapse above.",
    },
    {
      type: "narration" as const,
      text: "Only one thing is certain: you must find a way out.",
    },
  ];

  const HELP_TEXT = `COMMANDS:
You can use natural language! Try phrases like:

LOOKING AROUND:
• "look" or "look around" or "examine"

ITEMS:
• "pick up the lamp" or "take lamp" or "grab cage"
• "use fuel" or "light the lamp"
• "inventory" or "what do I have"

MOVEMENT:
• "go north" or "head east" or just "north"
• "go up" or "go down" or "go in" or "go out"

OTHER:
• "help" or "?" - show commands

Your progress is saved automatically.`;

  const output = `export interface Action {
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

export const ITEMS: Record<string, Item> = ${JSON.stringify(ITEMS, null, 2)};

export const SCENES: Record<string, Scene> = ${JSON.stringify(SCENES, null, 2)};

export const INTRO_MESSAGES = ${JSON.stringify(INTRO_MESSAGES, null, 2)};

export const HELP_TEXT = ${JSON.stringify(HELP_TEXT)};
`;

  const outPath = path.resolve("client/data/generatedStory.ts");
  fs.writeFileSync(outPath, output, "utf-8");
  console.log(`\nGenerated: ${outPath}`);
  console.log("Done!");
}

main();
