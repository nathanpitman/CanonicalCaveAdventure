import * as fs from "fs";
import * as path from "path";
import { parse } from "yaml";

// ============================================================
// ASCENT MODE CONFIGURATION
// ============================================================
const ASCENT_MODE = true;
const ASCENT_START_ROOM_ID = ""; // Leave empty for auto-detection (deepest room)
const ASCENT_EXIT_ROOM_ID = "";  // Leave empty for auto-detection (surface building)

// Keywords for identifying deep cave rooms
const DEEP_ROOM_KEYWORDS = [
  "cave", "cavern", "chamber", "maze", "pit", "hall", "bedquilt", 
  "deep", "complex", "end of", "low", "below", "y2", "underground",
  "passage", "crawl", "tunnel", "dark", "narrow", "dead end"
];

// Keywords for identifying surface/near-surface rooms (to exclude from deep start)
const SURFACE_KEYWORDS = [
  "building", "forest", "road", "valley", "streambed", "outside", 
  "house", "end of road", "hill", "gully", "depression", "slit"
];

// Critical items that need to be placed along the escape path
const CRITICAL_ITEMS = [
  { id: "lamp", milestone: 0, windowSize: 1 },      // At chasm_base (start)
  { id: "oil", milestone: 0.1, windowSize: 10 },    // Early - within first 10% of path
  { id: "keys", milestone: 0.15, windowSize: 15 },  // Early
  { id: "food", milestone: 0.2, windowSize: 20 },   // Within first 20%
  { id: "bottle", milestone: 0.25, windowSize: 20 },// After water-themed room
  { id: "cage", milestone: 0.3, windowSize: 15 },   // Before bird
  { id: "bird", milestone: 0.4, windowSize: 15 },   // Mid-path
  { id: "rod", milestone: 0.5, windowSize: 15 },    // Mid-path
  { id: "rescue_key", milestone: 0.85, windowSize: 10 }, // Late, near exit
];

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
// DIRECTION MAPPING
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
  OBJ_13: "Stone Tablet",
  OBJ_26: "Stalactite",
  OBJ_27: "Shadowy Figure",
  OBJ_29: "Cave Drawings",
  OBJ_30: "Pirate",
  OBJ_40: "Carpet",
  OBJ_47: "Mud",
  OBJ_48: "Note",
  OBJ_51: "Diamonds",
  OBJ_52: "Silver Bars",
  OBJ_53: "Precious Jewelry",
  OBJ_63: "Rare Spices",
  OBJ_69: "Ebony Statuette",
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

function matchesKeywords(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some(kw => lower.includes(kw.toLowerCase()));
}

// ============================================================
// GRAPH ALGORITHMS
// ============================================================
function buildGraph(scenes: Record<string, Scene>): Map<string, Set<string>> {
  const graph = new Map<string, Set<string>>();
  
  for (const [sceneId, scene] of Object.entries(scenes)) {
    if (!graph.has(sceneId)) {
      graph.set(sceneId, new Set());
    }
    for (const action of scene.actions) {
      if (action.type === "move" && action.to && scenes[action.to]) {
        graph.get(sceneId)!.add(action.to);
        // Add reverse edge for undirected graph
        if (!graph.has(action.to)) {
          graph.set(action.to, new Set());
        }
        graph.get(action.to)!.add(sceneId);
      }
    }
  }
  
  return graph;
}

function bfsDistances(graph: Map<string, Set<string>>, startNodes: string[]): Map<string, number> {
  const distances = new Map<string, number>();
  const queue: string[] = [];
  
  for (const start of startNodes) {
    if (graph.has(start)) {
      distances.set(start, 0);
      queue.push(start);
    }
  }
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentDist = distances.get(current)!;
    
    for (const neighbor of graph.get(current) || []) {
      if (!distances.has(neighbor)) {
        distances.set(neighbor, currentDist + 1);
        queue.push(neighbor);
      }
    }
  }
  
  return distances;
}

function bfsPath(graph: Map<string, Set<string>>, start: string, end: string): string[] {
  if (start === end) return [start];
  
  const visited = new Set<string>();
  const parent = new Map<string, string>();
  const queue: string[] = [start];
  visited.add(start);
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    
    for (const neighbor of graph.get(current) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent.set(neighbor, current);
        queue.push(neighbor);
        
        if (neighbor === end) {
          // Reconstruct path
          const path: string[] = [end];
          let node = end;
          while (parent.has(node)) {
            node = parent.get(node)!;
            path.unshift(node);
          }
          return path;
        }
      }
    }
  }
  
  return []; // No path found
}

// ============================================================
// ASCENT MODE FUNCTIONS
// ============================================================
function findDeepStartRoom(
  scenes: Record<string, Scene>,
  graph: Map<string, Set<string>>,
  surfaceNodes: string[]
): { roomId: string; distance: number; reason: string } {
  const distances = bfsDistances(graph, surfaceNodes);
  
  // Find candidate deep rooms
  const candidates: Array<{ id: string; dist: number; score: number }> = [];
  
  for (const [sceneId, scene] of Object.entries(scenes)) {
    if (sceneId === "chasm_base") continue;
    
    const dist = distances.get(sceneId) || 0;
    const text = `${scene.title} ${scene.description}`;
    
    // Skip surface rooms
    if (matchesKeywords(text, SURFACE_KEYWORDS)) continue;
    
    // Calculate score: distance + keyword bonus
    let score = dist;
    if (matchesKeywords(text, DEEP_ROOM_KEYWORDS)) {
      score += 5; // Bonus for cave-like rooms
    }
    
    candidates.push({ id: sceneId, dist, score });
  }
  
  // Sort by score descending
  candidates.sort((a, b) => b.score - a.score);
  
  // Pick from top 5% by distance
  const topCandidates = candidates.slice(0, Math.max(5, Math.ceil(candidates.length * 0.05)));
  const chosen = topCandidates[0];
  
  return {
    roomId: chosen.id,
    distance: chosen.dist,
    reason: `Chosen as deepest (distance ${chosen.dist}, score ${chosen.score})`
  };
}

function findSurfaceExitRoom(
  scenes: Record<string, Scene>,
  graph: Map<string, Set<string>>
): { roomId: string; reason: string } {
  // Look for the building/wellhouse area first
  const candidates: Array<{ id: string; priority: number }> = [];
  
  for (const [sceneId, scene] of Object.entries(scenes)) {
    const text = `${scene.title} ${scene.description}`.toLowerCase();
    
    // Prioritize building-related rooms
    if (text.includes("building") || text.includes("well house") || text.includes("wellhouse")) {
      candidates.push({ id: sceneId, priority: 10 });
    } else if (text.includes("end of road") || text.includes("forest")) {
      candidates.push({ id: sceneId, priority: 5 });
    } else if (text.includes("outside") || text.includes("road")) {
      candidates.push({ id: sceneId, priority: 3 });
    }
  }
  
  candidates.sort((a, b) => b.priority - a.priority);
  
  if (candidates.length > 0) {
    return {
      roomId: candidates[0].id,
      reason: `Surface exit (priority ${candidates[0].priority})`
    };
  }
  
  // Fallback to "start" if it exists
  if (scenes["start"]) {
    return { roomId: "start", reason: "Default start location as exit" };
  }
  
  return { roomId: Object.keys(scenes)[0], reason: "First available room" };
}

function placeItemsAlongPath(
  scenes: Record<string, Scene>,
  items: Record<string, Item>,
  escapePath: string[],
  startRoomId: string
): Map<string, string> {
  const placements = new Map<string, string>(); // itemId -> sceneId
  
  console.log("\n--- ITEM PLACEMENT ---");
  
  for (const criticalItem of CRITICAL_ITEMS) {
    const itemId = criticalItem.id;
    
    // Skip if item already placed at a good position
    let existingScene: string | null = null;
    for (const [sceneId, scene] of Object.entries(scenes)) {
      if (scene.items?.includes(itemId)) {
        existingScene = sceneId;
        break;
      }
    }
    
    // Calculate target index on path
    const targetIndex = Math.floor(escapePath.length * criticalItem.milestone);
    const windowStart = Math.max(0, targetIndex - Math.floor(criticalItem.windowSize / 2));
    const windowEnd = Math.min(escapePath.length - 1, targetIndex + Math.floor(criticalItem.windowSize / 2));
    
    // Check if existing placement is within window
    if (existingScene) {
      const existingIndex = escapePath.indexOf(existingScene);
      if (existingIndex >= windowStart && existingIndex <= windowEnd) {
        placements.set(itemId, existingScene);
        console.log(`  ${itemId}: keeping at ${existingScene} (index ${existingIndex})`);
        continue;
      }
    }
    
    // Special case: lamp goes to chasm_base
    if (itemId === "lamp") {
      placements.set(itemId, "chasm_base");
      console.log(`  ${itemId}: placed at chasm_base (start room)`);
      continue;
    }
    
    // Place item in a room within the window
    const targetRoomIndex = Math.min(windowEnd, Math.max(windowStart, targetIndex));
    let targetRoom = escapePath[targetRoomIndex];
    
    // For rescue_key, ensure it's not in the exit room
    if (itemId === "rescue_key" && targetRoom === escapePath[escapePath.length - 1]) {
      targetRoom = escapePath[Math.max(0, escapePath.length - 3)];
    }
    
    placements.set(itemId, targetRoom);
    console.log(`  ${itemId}: placed at ${targetRoom} (index ${targetRoomIndex}, target was ${targetIndex})`);
  }
  
  return placements;
}

function applyItemPlacements(
  scenes: Record<string, Scene>,
  items: Record<string, Item>,
  placements: Map<string, string>
): void {
  for (const [itemId, sceneId] of placements) {
    const scene = scenes[sceneId];
    if (!scene) continue;
    
    // Ensure item exists
    if (!items[itemId]) {
      // Create the item if it doesn't exist
      if (itemId === "rescue_key") {
        items[itemId] = {
          id: "rescue_key",
          name: "Rescue Gate Key",
          description: "A heavy brass key that might unlock the exit gate.",
          usable: false,
        };
      } else {
        items[itemId] = {
          id: itemId,
          name: titleCase(itemId),
          description: `A ${itemId}.`,
          usable: false,
        };
      }
    }
    
    // Add to scene's items array
    if (!scene.items) {
      scene.items = [];
    }
    if (!scene.items.includes(itemId)) {
      scene.items.push(itemId);
    }
    
    // Add item description
    if (!scene.itemDescriptions) {
      scene.itemDescriptions = {};
    }
    if (!scene.itemDescriptions[itemId]) {
      scene.itemDescriptions[itemId] = items[itemId].description;
    }
    
    // Add take action if not present
    const takeActionId = `take_${itemId}`;
    const hasTakeAction = scene.actions.some(a => a.id === takeActionId);
    if (!hasTakeAction) {
      scene.actions.push({
        id: takeActionId,
        label: `TAKE ${items[itemId].name.toUpperCase()}`,
        type: "event",
        addsItem: itemId,
        removesAction: true,
      });
    }
  }
}

function addEscapeAction(scene: Scene): void {
  // Check if escape action already exists
  if (scene.actions.some(a => a.id === "escape")) return;
  
  scene.actions.push({
    id: "escape",
    label: "UNLOCK THE GATE",
    type: "event",
    requiresItem: "rescue_key",
    setsFlag: "escaped",
    removesAction: true,
  });
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

  // ============================================================
  // PARSE ALL LOCATIONS INTO SCENES
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

  // ============================================================
  // ASCENT MODE: RELOCATE START AND EXIT
  // ============================================================
  let ascentStartRoom = "";
  let ascentExitRoom = "";
  let escapePath: string[] = [];

  if (ASCENT_MODE) {
    console.log("\n=== ASCENT MODE ENABLED ===");
    
    // Build the room graph
    const graph = buildGraph(SCENES);
    
    // Find surface nodes for distance calculation
    const surfaceNodes: string[] = [];
    for (const [sceneId, scene] of Object.entries(SCENES)) {
      const text = `${scene.title} ${scene.description}`;
      if (matchesKeywords(text, ["building", "well house", "wellhouse", "end of road"])) {
        surfaceNodes.push(sceneId);
      }
    }
    if (surfaceNodes.length === 0 && SCENES["start"]) {
      surfaceNodes.push("start");
    }
    console.log(`Surface reference nodes: ${surfaceNodes.join(", ")}`);

    // Determine deep start room
    if (ASCENT_START_ROOM_ID) {
      ascentStartRoom = ASCENT_START_ROOM_ID;
      console.log(`Using configured start room: ${ascentStartRoom}`);
    } else {
      const startResult = findDeepStartRoom(SCENES, graph, surfaceNodes);
      ascentStartRoom = startResult.roomId;
      console.log(`Auto-selected deep start: ${ascentStartRoom} - ${startResult.reason}`);
    }

    // Determine surface exit room
    if (ASCENT_EXIT_ROOM_ID) {
      ascentExitRoom = ASCENT_EXIT_ROOM_ID;
      console.log(`Using configured exit room: ${ascentExitRoom}`);
    } else {
      const exitResult = findSurfaceExitRoom(SCENES, graph);
      ascentExitRoom = exitResult.roomId;
      console.log(`Auto-selected surface exit: ${ascentExitRoom} - ${exitResult.reason}`);
    }

    // Calculate escape path
    escapePath = bfsPath(graph, ascentStartRoom, ascentExitRoom);
    console.log(`Escape path length: ${escapePath.length} rooms`);
    if (escapePath.length > 0) {
      console.log(`  From: ${ascentStartRoom} (${SCENES[ascentStartRoom]?.title})`);
      console.log(`  To: ${ascentExitRoom} (${SCENES[ascentExitRoom]?.title})`);
    }

    // Place items along escape path
    if (escapePath.length > 0) {
      const placements = placeItemsAlongPath(SCENES, ITEMS, escapePath, ascentStartRoom);
      applyItemPlacements(SCENES, ITEMS, placements);
    }

    // Add escape action to exit room
    if (SCENES[ascentExitRoom]) {
      addEscapeAction(SCENES[ascentExitRoom]);
      console.log(`Added escape action to: ${ascentExitRoom}`);
    }
  }

  // ============================================================
  // CREATE CHASM_BASE (always required)
  // ============================================================
  const chasmBaseExitRoom = ASCENT_MODE && ascentStartRoom ? ascentStartRoom : "start";
  const chasmBaseExitTitle = SCENES[chasmBaseExitRoom]?.title || "unknown";
  
  SCENES["chasm_base"] = {
    id: "chasm_base",
    title: "Base of the Chasm",
    description:
      `Cold air. Dust. You lie at the bottom of a vertical mining shaft, the distant sky a pale disc far above. Rough-hewn walls rise around you, disappearing into shadow. A faint draft whispers from a passage to the east.\n\nAn old oil lamp lies nearby, its glass clouded but intact.`,
    descriptionWithoutItems:
      `Cold air. Dust. You lie at the bottom of a vertical mining shaft, the distant sky a pale disc far above. Rough-hewn walls rise around you, disappearing into shadow. A faint draft whispers from a passage to the east.`,
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
      { id: "go_east", label: "GO EAST", type: "move", to: chasmBaseExitRoom },
    ],
    items: ["lamp"],
  };

  console.log(`\nchasm_base connects east to: ${chasmBaseExitRoom} (${chasmBaseExitTitle})`);

  // ============================================================
  // ENSURE ALL CRITICAL ITEMS EXIST
  // ============================================================
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

  if (ASCENT_MODE && !ITEMS["rescue_key"]) {
    ITEMS["rescue_key"] = {
      id: "rescue_key",
      name: "Rescue Gate Key",
      description: "A heavy brass key that might unlock the exit gate.",
      usable: false,
    };
  }

  // ============================================================
  // VALIDATION
  // ============================================================
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

  // ============================================================
  // DEPENDENCY REPORT
  // ============================================================
  if (ASCENT_MODE && escapePath.length > 0) {
    console.log("\n=== DEPENDENCY REPORT ===");
    console.log(`Start room: ${ascentStartRoom} (${SCENES[ascentStartRoom]?.title})`);
    console.log(`Exit room: ${ascentExitRoom} (${SCENES[ascentExitRoom]?.title})`);
    console.log(`Path length: ${escapePath.length} rooms`);
    console.log("\nCritical item placements:");
    
    for (const criticalItem of CRITICAL_ITEMS) {
      const itemId = criticalItem.id;
      let foundScene: string | null = null;
      let foundIndex = -1;
      
      // Check chasm_base first
      if (SCENES["chasm_base"]?.items?.includes(itemId)) {
        foundScene = "chasm_base";
        foundIndex = -1; // Before escape path
      } else {
        // Check escape path
        for (let i = 0; i < escapePath.length; i++) {
          const scene = SCENES[escapePath[i]];
          if (scene?.items?.includes(itemId)) {
            foundScene = escapePath[i];
            foundIndex = i;
            break;
          }
        }
      }
      
      const targetIndex = Math.floor(escapePath.length * criticalItem.milestone);
      const status = foundScene 
        ? (foundIndex <= targetIndex || foundIndex === -1 ? "OK" : "WARN: late placement")
        : "NOT FOUND";
      
      console.log(`  ${itemId}: ${foundScene || "missing"} (index ${foundIndex}, target ${targetIndex}) - ${status}`);
    }
  }

  // ============================================================
  // GENERATE OUTPUT
  // ============================================================
  const INTRO_MESSAGES: Array<{ type: "narration"; text: string }> = [
    {
      type: "narration",
      text: "You fell.\n\nOne moment, solid ground. The next, darkness and the shriek of breaking timber.",
    },
    {
      type: "narration",
      text: "You don't know how long you were unconscious. Hours? Days? Your head throbs. Your supplies are gone—scattered somewhere in the collapse above.",
    },
    {
      type: "narration",
      text: "Only one thing is certain: you must find a way out.",
    },
  ];

  const HELP_TEXT = ASCENT_MODE 
    ? `COMMANDS:
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

GOAL:
Find the RESCUE GATE KEY to unlock the exit and escape!

OTHER:
• "help" or "?" - show commands

Your progress is saved automatically.`
    : `COMMANDS:
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

export const INTRO_MESSAGES: Array<{ type: "narration"; text: string }> = ${JSON.stringify(INTRO_MESSAGES, null, 2)};

export const HELP_TEXT = ${JSON.stringify(HELP_TEXT)};
`;

  const outPath = path.resolve("client/data/generatedStory.ts");
  fs.writeFileSync(outPath, output, "utf-8");
  console.log(`\nGenerated: ${outPath}`);
  console.log("Done!");
}

main();
