// AUTO-GENERATED FROM adventure.yaml - DO NOT EDIT
// Generated: 2026-02-01T21:15:24.397Z
// Canonical Open Adventure import with travel mechanics

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

export const START_SCENE_ID: string = "start";

export const INTRO_MESSAGES: string[] = [
  "Welcome to ADVENTURE!",
  "Somewhere nearby is Colossal Cave, where others have found fortunes in treasure and gold, though it is rumored that some who enter are never seen again.",
  "Magic is said to work in the cave.",
  "Type HELP for a list of commands."
];

export const HELP_TEXT: string = "COMMANDS:\n- LOOK: Examine your surroundings\n- INVENTORY / INV: Check what you're carrying\n- TAKE <item>: Pick up an item\n- USE <item>: Use an item (e.g., USE KEYS to unlock the grate)\n- GO <direction>: Move (north, south, east, west, up, down, in, out, ne, nw, se, sw)\n- GO BACK / BACK: Return to previous room\n- HELP: Show this message\n\nDIRECTIONS: north (n), south (s), east (e), west (w), up (u), down (d), in, out, northeast (ne), northwest (nw), southeast (se), southwest (sw)\n\nSPECIAL WORDS: xyzzy, plugh, plover (try them in the right places!)";

// Canonical vocabulary extracted from YAML for lexicon
export const CANON_TRAVEL_VERBS: string[] = [
  "acros",
  "barre",
  "bed",
  "bedqu",
  "broke",
  "build",
  "canyo",
  "caver",
  "climb",
  "cobbl",
  "crack",
  "crawl",
  "dark",
  "debri",
  "depre",
  "dome",
  "down",
  "downs",
  "east",
  "enter",
  "entra",
  "floor",
  "fores",
  "fork",
  "forwa",
  "giant",
  "gully",
  "hall",
  "hole",
  "inwar",
  "jump",
  "left",
  "low",
  "ne",
  "north",
  "nw",
  "orien",
  "out",
  "outdo",
  "over",
  "passa",
  "pit",
  "plove",
  "plugh",
  "reser",
  "right",
  "road",
  "room",
  "se",
  "secre",
  "shell",
  "slab",
  "south",
  "stair",
  "steps",
  "strea",
  "surfa",
  "sw",
  "upstr",
  "upwar",
  "view",
  "wall",
  "west",
  "xyzzy",
  "y2"
];

export const CANON_OBJECTS: { id: string; name: string }[] = [
  {
    "id": "keys",
    "name": "Set of Keys"
  },
  {
    "id": "lamp",
    "name": "Brass Lantern"
  },
  {
    "id": "food",
    "name": "Tasty Rations"
  },
  {
    "id": "bottle",
    "name": "Water Bottle"
  },
  {
    "id": "cage",
    "name": "Wicker Cage"
  },
  {
    "id": "rod",
    "name": "Black Rod"
  },
  {
    "id": "bird",
    "name": "Little Bird"
  },
  {
    "id": "nugget",
    "name": "Large gold nugget"
  },
  {
    "id": "obj_51",
    "name": "Several diamonds"
  },
  {
    "id": "obj_52",
    "name": "Bars of silver"
  },
  {
    "id": "obj_53",
    "name": "Precious jewelry"
  },
  {
    "id": "coins",
    "name": "Rare Coins"
  },
  {
    "id": "eggs",
    "name": "Golden Eggs"
  },
  {
    "id": "trident",
    "name": "Jeweled Trident"
  },
  {
    "id": "pillow",
    "name": "Velvet Pillow"
  },
  {
    "id": "vase",
    "name": "Ming Vase"
  },
  {
    "id": "emerald",
    "name": "Egg-sized Emerald"
  },
  {
    "id": "pyramid",
    "name": "Platinum Pyramid"
  },
  {
    "id": "clam",
    "name": "Giant Clam"
  },
  {
    "id": "magazine",
    "name": "Magazine"
  },
  {
    "id": "obj_63",
    "name": "Rare spices"
  },
  {
    "id": "ruby",
    "name": "Fist-sized Ruby"
  },
  {
    "id": "rabbitfoot",
    "name": "Leporine appendage"
  },
  {
    "id": "sapph",
    "name": "Star Sapphire"
  },
  {
    "id": "obj_69",
    "name": "Ebony statuette"
  }
];

export const ITEMS: Record<string, Item> = {
  "keys": {
    "id": "keys",
    "name": "Set of Keys",
    "description": "There are some keys on the ground here.",
    "usable": true,
    "useEffect": {
      "message": "You unlock the grate with the keys.",
      "setsFlag": "grateOpen"
    }
  },
  "lamp": {
    "id": "lamp",
    "name": "Brass Lantern",
    "description": "There is a shiny brass lamp nearby.",
    "usable": false
  },
  "food": {
    "id": "food",
    "name": "Tasty Rations",
    "description": "There is food here.",
    "usable": false
  },
  "bottle": {
    "id": "bottle",
    "name": "Water Bottle",
    "description": "There is a bottle of water here.",
    "usable": false
  },
  "cage": {
    "id": "cage",
    "name": "Wicker Cage",
    "description": "There is a small wicker cage discarded nearby.",
    "usable": false
  },
  "rod": {
    "id": "rod",
    "name": "Black Rod",
    "description": "A three foot black rod with a rusty star on an end lies nearby.",
    "usable": false
  },
  "bird": {
    "id": "bird",
    "name": "Little Bird",
    "description": "A cheerful little bird is sitting here singing.",
    "usable": false
  },
  "nugget": {
    "id": "nugget",
    "name": "Large gold nugget",
    "description": "There is a large sparkling nugget of gold here!",
    "usable": false
  },
  "obj_51": {
    "id": "obj_51",
    "name": "Several diamonds",
    "description": "There are diamonds here!",
    "usable": false
  },
  "obj_52": {
    "id": "obj_52",
    "name": "Bars of silver",
    "description": "There are bars of silver here!",
    "usable": false
  },
  "obj_53": {
    "id": "obj_53",
    "name": "Precious jewelry",
    "description": "There is precious jewelry here!",
    "usable": false
  },
  "coins": {
    "id": "coins",
    "name": "Rare Coins",
    "description": "There are many coins here!",
    "usable": false
  },
  "eggs": {
    "id": "eggs",
    "name": "Golden Eggs",
    "description": "There is a large nest here, full of golden eggs!",
    "usable": false
  },
  "trident": {
    "id": "trident",
    "name": "Jeweled Trident",
    "description": "There is a jewel-encrusted trident here!",
    "usable": false
  },
  "pillow": {
    "id": "pillow",
    "name": "Velvet Pillow",
    "description": "A small velvet pillow lies on the floor.",
    "usable": false
  },
  "vase": {
    "id": "vase",
    "name": "Ming Vase",
    "description": "There is a delicate, precious, ming vase here!",
    "usable": false
  },
  "emerald": {
    "id": "emerald",
    "name": "Egg-sized Emerald",
    "description": "There is an emerald here the size of a plover's egg!",
    "usable": false
  },
  "pyramid": {
    "id": "pyramid",
    "name": "Platinum Pyramid",
    "description": "There is a platinum pyramid here, 8 inches on a side!",
    "usable": false
  },
  "clam": {
    "id": "clam",
    "name": "Giant Clam",
    "description": "There is an enormous clam here with its shell tightly closed.",
    "usable": false
  },
  "magazine": {
    "id": "magazine",
    "name": "Magazine",
    "description": "There are a few recent issues of \"Spelunker Today\" magazine here.",
    "usable": false
  },
  "obj_63": {
    "id": "obj_63",
    "name": "Rare spices",
    "description": "There are rare spices here!",
    "usable": false
  },
  "ruby": {
    "id": "ruby",
    "name": "Fist-sized Ruby",
    "description": "There is an enormous ruby here!",
    "usable": false
  },
  "rabbitfoot": {
    "id": "rabbitfoot",
    "name": "Leporine appendage",
    "description": "Your keen eye spots a severed leporine appendage lying on the ground.",
    "usable": false
  },
  "sapph": {
    "id": "sapph",
    "name": "Star Sapphire",
    "description": "A brilliant blue star sapphire is here!",
    "usable": false
  },
  "obj_69": {
    "id": "obj_69",
    "name": "Ebony statuette",
    "description": "There is a richly-carved ebony statuette here!",
    "usable": false
  }
};

export const SCENES: Record<string, Scene> = {
  "start": {
    "id": "start",
    "title": "Front Of Building",
    "description": "You are standing at the end of a road before a small brick building.\nAround you is a forest.  A small stream flows out of the building and\ndown a gully.",
    "descriptionWithoutItems": "You are standing at the end of a road before a small brick building.\nAround you is a forest.  A small stream flows out of the building and\ndown a gully.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_road",
        "label": "ROAD",
        "type": "move",
        "to": "hill"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "hill"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "hill"
      },
      {
        "id": "go_enter",
        "label": "ENTER",
        "type": "move",
        "to": "building"
      },
      {
        "id": "go_building",
        "label": "GO TO BUILDING",
        "type": "move",
        "to": "building"
      },
      {
        "id": "go_in",
        "label": "GO IN",
        "type": "move",
        "to": "building"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "building"
      },
      {
        "id": "go_downs",
        "label": "Downs",
        "type": "move",
        "to": "valley"
      },
      {
        "id": "go_gully",
        "label": "GULLY",
        "type": "move",
        "to": "valley"
      },
      {
        "id": "go_stream",
        "label": "STREAM",
        "type": "move",
        "to": "valley"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "valley"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "valley"
      },
      {
        "id": "go_forest",
        "label": "FOREST",
        "type": "move",
        "to": "forest1"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "forest1"
      },
      {
        "id": "go_depression",
        "label": "DEPRESSION",
        "type": "move",
        "to": "grate"
      }
    ]
  },
  "hill": {
    "id": "hill",
    "title": "Hill In Road",
    "description": "You have walked up a hill, still in the forest.  The road slopes back\ndown the other side of the hill.  There is a building in the distance.",
    "descriptionWithoutItems": "You have walked up a hill, still in the forest.  The road slopes back\ndown the other side of the hill.  There is a building in the distance.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_building",
        "label": "GO TO BUILDING",
        "type": "move",
        "to": "start"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "start"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "roadend"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "forest20"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "forest13"
      },
      {
        "id": "go_forest",
        "label": "FOREST",
        "type": "move",
        "to": "forest13"
      },
      {
        "id": "say_which_way_down",
        "label": "Down",
        "type": "event",
        "message": "Which way?",
        "uiHint": "hidden"
      }
    ]
  },
  "building": {
    "id": "building",
    "title": "Building",
    "description": "You are inside a building, a well house for a large spring.",
    "descriptionWithoutItems": "You are inside a building, a well house for a large spring.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "start"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "start"
      },
      {
        "id": "go_xyzzy",
        "label": "XYZZY",
        "type": "move",
        "to": "foof1"
      },
      {
        "id": "go_plugh",
        "label": "PLUGH",
        "type": "move",
        "to": "foof3"
      },
      {
        "id": "go_downs",
        "label": "Downs",
        "type": "move",
        "to": "sewer"
      },
      {
        "id": "go_stream",
        "label": "STREAM",
        "type": "move",
        "to": "sewer"
      },
      {
        "id": "take_keys",
        "label": "TAKE SET OF KEYS",
        "type": "event",
        "addsItem": "keys",
        "removesAction": true
      },
      {
        "id": "take_lamp",
        "label": "TAKE BRASS LANTERN",
        "type": "event",
        "addsItem": "lamp",
        "removesAction": true
      },
      {
        "id": "take_food",
        "label": "TAKE TASTY RATIONS",
        "type": "event",
        "addsItem": "food",
        "removesAction": true
      },
      {
        "id": "take_bottle",
        "label": "TAKE WATER BOTTLE",
        "type": "event",
        "addsItem": "bottle",
        "removesAction": true
      }
    ],
    "items": [
      "keys",
      "lamp",
      "food",
      "bottle"
    ],
    "itemDescriptions": {
      "keys": "There are some keys on the ground here.",
      "lamp": "There is a shiny brass lamp nearby.",
      "food": "There is food here.",
      "bottle": "There is a bottle of water here."
    }
  },
  "valley": {
    "id": "valley",
    "title": "Valley",
    "description": "You are in a valley in the forest beside a stream tumbling along a\nrocky bed.",
    "descriptionWithoutItems": "You are in a valley in the forest beside a stream tumbling along a\nrocky bed.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_upstr",
        "label": "Upstr",
        "type": "move",
        "to": "start"
      },
      {
        "id": "go_building",
        "label": "GO TO BUILDING",
        "type": "move",
        "to": "start"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "start"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "forest6"
      },
      {
        "id": "go_forest",
        "label": "FOREST",
        "type": "move",
        "to": "forest6"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest12"
      },
      {
        "id": "go_downs",
        "label": "Downs",
        "type": "move",
        "to": "slit"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "slit"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "slit"
      },
      {
        "id": "go_depression",
        "label": "DEPRESSION",
        "type": "move",
        "to": "grate"
      },
      {
        "id": "say_upstream_downstream_strea",
        "label": "Strea",
        "type": "event",
        "message": "Upstream or downstream?",
        "uiHint": "hidden"
      }
    ]
  },
  "roadend": {
    "id": "roadend",
    "title": "End Of Road",
    "description": "The road, which approaches from the east, ends here amid the trees.",
    "descriptionWithoutItems": "The road, which approaches from the east, ends here amid the trees.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_road",
        "label": "ROAD",
        "type": "move",
        "to": "hill"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "hill"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "hill"
      },
      {
        "id": "go_building",
        "label": "GO TO BUILDING",
        "type": "move",
        "to": "start"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "forest14"
      },
      {
        "id": "go_forest",
        "label": "FOREST",
        "type": "move",
        "to": "forest14"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest15"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "forest21"
      }
    ]
  },
  "cliff": {
    "id": "cliff",
    "title": "Cliff",
    "description": "The forest thins out here to reveal a steep cliff.  There is no way\ndown, but a small ledge can be seen to the west across the chasm.",
    "descriptionWithoutItems": "The forest thins out here to reveal a steep cliff.  There is no way\ndown, but a small ledge can be seen to the west across the chasm.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "forest17"
      },
      {
        "id": "go_forest",
        "label": "FOREST",
        "type": "move",
        "to": "forest17"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "forest19"
      },
      {
        "id": "go_jump",
        "label": "JUMP",
        "type": "move",
        "to": "nomake"
      }
    ]
  },
  "slit": {
    "id": "slit",
    "title": "Slit In Streambed",
    "description": "At your feet all the water of the stream splashes into a 2-inch slit\nin the rock.  Downstream the streambed is bare rock.",
    "descriptionWithoutItems": "At your feet all the water of the stream splashes into a 2-inch slit\nin the rock.  Downstream the streambed is bare rock.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_building",
        "label": "GO TO BUILDING",
        "type": "move",
        "to": "start"
      },
      {
        "id": "go_upstr",
        "label": "Upstr",
        "type": "move",
        "to": "valley"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "valley"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "forest6"
      },
      {
        "id": "go_forest",
        "label": "FOREST",
        "type": "move",
        "to": "forest6"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest10"
      },
      {
        "id": "go_downs",
        "label": "Downs",
        "type": "move",
        "to": "grate"
      },
      {
        "id": "go_bed",
        "label": "Bed",
        "type": "move",
        "to": "grate"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "grate"
      },
      {
        "id": "go_depression",
        "label": "DEPRESSION",
        "type": "move",
        "to": "grate"
      },
      {
        "id": "say_dont_fit_slit",
        "label": "Slit",
        "type": "event",
        "message": "You don't fit through a two-inch slit!",
        "uiHint": "hidden"
      },
      {
        "id": "say_dont_fit_strea",
        "label": "Strea",
        "type": "event",
        "message": "You don't fit through a two-inch slit!",
        "uiHint": "hidden"
      },
      {
        "id": "say_dont_fit_down",
        "label": "Down",
        "type": "event",
        "message": "You don't fit through a two-inch slit!",
        "uiHint": "hidden"
      },
      {
        "id": "say_dont_fit_inwar",
        "label": "Inwar",
        "type": "event",
        "message": "You don't fit through a two-inch slit!",
        "uiHint": "hidden"
      },
      {
        "id": "say_dont_fit_enter",
        "label": "Enter",
        "type": "event",
        "message": "You don't fit through a two-inch slit!",
        "uiHint": "hidden"
      }
    ]
  },
  "grate": {
    "id": "grate",
    "title": "Grate",
    "description": "You are in a 20-foot depression floored with bare dirt.  Set into the\ndirt is a strong steel grate mounted in concrete.  A dry streambed\nleads into the depression.",
    "descriptionWithoutItems": "You are in a 20-foot depression floored with bare dirt.  Set into the\ndirt is a strong steel grate mounted in concrete.  A dry streambed\nleads into the depression.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "forest7"
      },
      {
        "id": "go_forest",
        "label": "FOREST",
        "type": "move",
        "to": "forest7"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "forest10"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest9"
      },
      {
        "id": "go_building",
        "label": "GO TO BUILDING",
        "type": "move",
        "to": "start"
      },
      {
        "id": "go_upstr",
        "label": "Upstr",
        "type": "move",
        "to": "slit"
      },
      {
        "id": "go_gully",
        "label": "GULLY",
        "type": "move",
        "to": "slit"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "slit"
      },
      {
        "id": "go_enter",
        "label": "ENTER",
        "type": "move",
        "to": "belowgrate",
        "requiresFlag": "grateOpen"
      },
      {
        "id": "go_in",
        "label": "GO IN",
        "type": "move",
        "to": "belowgrate",
        "requiresFlag": "grateOpen"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "belowgrate",
        "requiresFlag": "grateOpen"
      },
      {
        "id": "say_grate_noway_enter",
        "label": "Enter",
        "type": "event",
        "message": "You can't go through a locked steel grate!",
        "uiHint": "hidden"
      }
    ]
  },
  "belowgrate": {
    "id": "belowgrate",
    "title": "Below The Grate",
    "description": "You are in a small chamber beneath a 3x3 steel grate to the surface.\nA low crawl over cobbles leads inward to the west.",
    "descriptionWithoutItems": "You are in a small chamber beneath a 3x3 steel grate to the surface.\nA low crawl over cobbles leads inward to the west.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "grate",
        "requiresFlag": "grateOpen"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "grate",
        "requiresFlag": "grateOpen"
      },
      {
        "id": "say_grate_noway_out",
        "label": "Out",
        "type": "event",
        "message": "You can't go through a locked steel grate!",
        "uiHint": "hidden"
      },
      {
        "id": "go_crawl",
        "label": "CRAWL",
        "type": "move",
        "to": "cobble"
      },
      {
        "id": "go_cobbles",
        "label": "COBBLES",
        "type": "move",
        "to": "cobble"
      },
      {
        "id": "go_in",
        "label": "GO IN",
        "type": "move",
        "to": "cobble"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "cobble"
      },
      {
        "id": "go_pit",
        "label": "PIT",
        "type": "move",
        "to": "pittop"
      },
      {
        "id": "go_debris",
        "label": "DEBRIS",
        "type": "move",
        "to": "debris"
      }
    ]
  },
  "cobble": {
    "id": "cobble",
    "title": "Cobble Crawl",
    "description": "You are crawling over cobbles in a low passage.  There is a dim light\nat the east end of the passage.",
    "descriptionWithoutItems": "You are crawling over cobbles in a low passage.  There is a dim light\nat the east end of the passage.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "belowgrate"
      },
      {
        "id": "go_surface",
        "label": "SURFACE",
        "type": "move",
        "to": "belowgrate"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "belowgrate"
      },
      {
        "id": "go_in",
        "label": "GO IN",
        "type": "move",
        "to": "debris"
      },
      {
        "id": "go_dark",
        "label": "DARK",
        "type": "move",
        "to": "debris"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "debris"
      },
      {
        "id": "go_debris",
        "label": "DEBRIS",
        "type": "move",
        "to": "debris"
      },
      {
        "id": "go_pit",
        "label": "PIT",
        "type": "move",
        "to": "pittop"
      },
      {
        "id": "take_cage",
        "label": "TAKE WICKER CAGE",
        "type": "event",
        "addsItem": "cage",
        "removesAction": true
      }
    ],
    "items": [
      "cage"
    ],
    "itemDescriptions": {
      "cage": "There is a small wicker cage discarded nearby."
    }
  },
  "debris": {
    "id": "debris",
    "title": "Debris Room",
    "description": "You are in a debris room filled with stuff washed in from the surface.\nA low wide passage with cobbles becomes plugged with mud and debris\nhere, but an awkward canyon leads upward and west.  In the mud someone\nhas scrawled, \"MAGIC WORD XYZZY\".",
    "descriptionWithoutItems": "You are in a debris room filled with stuff washed in from the surface.\nA low wide passage with cobbles becomes plugged with mud and debris\nhere, but an awkward canyon leads upward and west.  In the mud someone\nhas scrawled, \"MAGIC WORD XYZZY\".",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_depression",
        "label": "DEPRESSION",
        "type": "move",
        "to": "grate",
        "requiresFlag": "grateOpen"
      },
      {
        "id": "go_entra",
        "label": "Entra",
        "type": "move",
        "to": "belowgrate"
      },
      {
        "id": "go_crawl",
        "label": "CRAWL",
        "type": "move",
        "to": "cobble"
      },
      {
        "id": "go_cobbles",
        "label": "COBBLES",
        "type": "move",
        "to": "cobble"
      },
      {
        "id": "go_passage",
        "label": "PASSAGE",
        "type": "move",
        "to": "cobble"
      },
      {
        "id": "go_low",
        "label": "LOW",
        "type": "move",
        "to": "cobble"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "cobble"
      },
      {
        "id": "go_canyon",
        "label": "CANYON",
        "type": "move",
        "to": "awkward"
      },
      {
        "id": "go_in",
        "label": "GO IN",
        "type": "move",
        "to": "awkward"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "awkward"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "awkward"
      },
      {
        "id": "go_xyzzy",
        "label": "XYZZY",
        "type": "move",
        "to": "foof2"
      },
      {
        "id": "go_pit",
        "label": "PIT",
        "type": "move",
        "to": "pittop"
      },
      {
        "id": "take_rod",
        "label": "TAKE BLACK ROD",
        "type": "event",
        "addsItem": "rod",
        "removesAction": true
      }
    ],
    "items": [
      "rod"
    ],
    "itemDescriptions": {
      "rod": "A three foot black rod with a rusty star on an end lies nearby."
    }
  },
  "awkward": {
    "id": "awkward",
    "title": "Awkward",
    "description": "You are in an awkward sloping east/west canyon.",
    "descriptionWithoutItems": "You are in an awkward sloping east/west canyon.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_depression",
        "label": "DEPRESSION",
        "type": "move",
        "to": "grate",
        "requiresFlag": "grateOpen"
      },
      {
        "id": "go_entra",
        "label": "Entra",
        "type": "move",
        "to": "belowgrate"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "debris"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "debris"
      },
      {
        "id": "go_debris",
        "label": "DEBRIS",
        "type": "move",
        "to": "debris"
      },
      {
        "id": "go_in",
        "label": "GO IN",
        "type": "move",
        "to": "birdchamber"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "birdchamber"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "birdchamber"
      },
      {
        "id": "go_pit",
        "label": "PIT",
        "type": "move",
        "to": "pittop"
      }
    ]
  },
  "birdchamber": {
    "id": "birdchamber",
    "title": "Bird Chamber",
    "description": "You are in a splendid chamber thirty feet high.  The walls are frozen\nrivers of orange stone.  An awkward canyon and a good passage exit\nfrom east and west sides of the chamber.",
    "descriptionWithoutItems": "You are in a splendid chamber thirty feet high.  The walls are frozen\nrivers of orange stone.  An awkward canyon and a good passage exit\nfrom east and west sides of the chamber.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_depression",
        "label": "DEPRESSION",
        "type": "move",
        "to": "grate",
        "requiresFlag": "grateOpen"
      },
      {
        "id": "go_entra",
        "label": "Entra",
        "type": "move",
        "to": "belowgrate"
      },
      {
        "id": "go_debris",
        "label": "DEBRIS",
        "type": "move",
        "to": "debris"
      },
      {
        "id": "go_canyon",
        "label": "CANYON",
        "type": "move",
        "to": "awkward"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "awkward"
      },
      {
        "id": "go_passage",
        "label": "PASSAGE",
        "type": "move",
        "to": "pittop"
      },
      {
        "id": "go_pit",
        "label": "PIT",
        "type": "move",
        "to": "pittop"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "pittop"
      },
      {
        "id": "take_bird",
        "label": "TAKE LITTLE BIRD",
        "type": "event",
        "addsItem": "bird",
        "removesAction": true
      }
    ],
    "items": [
      "bird"
    ],
    "itemDescriptions": {
      "bird": "A cheerful little bird is sitting here singing."
    }
  },
  "pittop": {
    "id": "pittop",
    "title": "Top Of Small Pit",
    "description": "At your feet is a small pit breathing traces of white mist.  An east\npassage ends here except for a small crack leading on.",
    "descriptionWithoutItems": "At your feet is a small pit breathing traces of white mist.  An east\npassage ends here except for a small crack leading on.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_depression",
        "label": "DEPRESSION",
        "type": "move",
        "to": "grate",
        "requiresFlag": "grateOpen"
      },
      {
        "id": "go_entra",
        "label": "Entra",
        "type": "move",
        "to": "belowgrate"
      },
      {
        "id": "go_debris",
        "label": "DEBRIS",
        "type": "move",
        "to": "debris"
      },
      {
        "id": "go_passage",
        "label": "PASSAGE",
        "type": "move",
        "to": "birdchamber"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "birdchamber"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "neckbroke"
      },
      {
        "id": "go_pit",
        "label": "PIT",
        "type": "move",
        "to": "neckbroke"
      },
      {
        "id": "go_steps",
        "label": "STEPS",
        "type": "move",
        "to": "neckbroke"
      },
      {
        "id": "go_crack",
        "label": "CRACK",
        "type": "move",
        "to": "crack"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "crack"
      }
    ]
  },
  "misthall": {
    "id": "misthall",
    "title": "Hall Of Mists",
    "description": "You are at one end of a vast hall stretching forward out of sight to\nthe west.  There are openings to either side.  Nearby, a wide stone\nstaircase leads downward.  The hall is filled with wisps of white mist\nswaying to and fro almost as if alive.  A cold wind blows up the\nstaircase.  There is a passage at the top of a dome behind you.",
    "descriptionWithoutItems": "You are at one end of a vast hall stretching forward out of sight to\nthe west.  There are openings to either side.  Nearby, a wide stone\nstaircase leads downward.  The hall is filled with wisps of white mist\nswaying to and fro almost as if alive.  A cold wind blows up the\nstaircase.  There is a passage at the top of a dome behind you.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_left",
        "label": "LEFT",
        "type": "move",
        "to": "nugget"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "nugget"
      },
      {
        "id": "go_forward",
        "label": "FORWARD",
        "type": "move",
        "to": "eastbank"
      },
      {
        "id": "go_hall",
        "label": "HALL",
        "type": "move",
        "to": "eastbank"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "eastbank"
      },
      {
        "id": "go_stairs",
        "label": "STAIRS",
        "type": "move",
        "to": "kinghall"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "kinghall"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "kinghall"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "dome"
      },
      {
        "id": "go_pit",
        "label": "PIT",
        "type": "move",
        "to": "dome"
      },
      {
        "id": "go_steps",
        "label": "STEPS",
        "type": "move",
        "to": "dome"
      },
      {
        "id": "go_dome",
        "label": "Dome",
        "type": "move",
        "to": "dome"
      },
      {
        "id": "go_passage",
        "label": "PASSAGE",
        "type": "move",
        "to": "dome"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "dome"
      },
      {
        "id": "go_y2",
        "label": "Y2",
        "type": "move",
        "to": "jumble"
      }
    ]
  },
  "crack": {
    "id": "crack",
    "title": "Crack",
    "description": "The crack is far too small for you to follow.  At its widest it is\nbarely wide enough to admit your foot.",
    "descriptionWithoutItems": "The crack is far too small for you to follow.  At its widest it is\nbarely wide enough to admit your foot.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_default",
        "label": "CONTINUE",
        "type": "move",
        "to": "pittop"
      }
    ]
  },
  "eastbank": {
    "id": "eastbank",
    "title": "East Bank Of Fissure",
    "description": "You are on the east bank of a fissure slicing clear across the hall.\nThe mist is quite thick here, and the fissure is too wide to jump.",
    "descriptionWithoutItems": "You are on the east bank of a fissure slicing clear across the hall.\nThe mist is quite thick here, and the fissure is too wide to jump.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_hall",
        "label": "HALL",
        "type": "move",
        "to": "misthall"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "misthall"
      },
      {
        "id": "say_cross_bridge_jump",
        "label": "Jump",
        "type": "event",
        "message": "I respectfully suggest you go across the bridge instead of jumping.",
        "uiHint": "hidden"
      },
      {
        "id": "go_forward",
        "label": "FORWARD",
        "type": "move",
        "to": "nomake"
      },
      {
        "id": "say_no_cross_over",
        "label": "Over",
        "type": "event",
        "message": "There is no way across the fissure.",
        "uiHint": "hidden"
      },
      {
        "id": "say_no_cross_acros",
        "label": "Acros",
        "type": "event",
        "message": "There is no way across the fissure.",
        "uiHint": "hidden"
      },
      {
        "id": "say_no_cross_west",
        "label": "West",
        "type": "event",
        "message": "There is no way across the fissure.",
        "uiHint": "hidden"
      },
      {
        "id": "say_no_cross_cross",
        "label": "Cross",
        "type": "event",
        "message": "There is no way across the fissure.",
        "uiHint": "hidden"
      },
      {
        "id": "go_over",
        "label": "Over",
        "type": "move",
        "to": "westbank"
      }
    ]
  },
  "nugget": {
    "id": "nugget",
    "title": "Nugget-of-gold Room",
    "description": "This is a low room with a crude note on the wall.  The note says,\n\"You won't get it up the steps\".",
    "descriptionWithoutItems": "This is a low room with a crude note on the wall.  The note says,\n\"You won't get it up the steps\".",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_hall",
        "label": "HALL",
        "type": "move",
        "to": "misthall"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "misthall"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "misthall"
      },
      {
        "id": "take_nugget",
        "label": "TAKE LARGE GOLD NUGGET",
        "type": "event",
        "addsItem": "nugget",
        "removesAction": true
      }
    ],
    "items": [
      "nugget"
    ],
    "itemDescriptions": {
      "nugget": "There is a large sparkling nugget of gold here!"
    }
  },
  "kinghall": {
    "id": "kinghall",
    "title": "Hall Of Mt King",
    "description": "You are in the Hall of the Mountain King, with passages off in all\ndirections.",
    "descriptionWithoutItems": "You are in the Hall of the Mountain King, with passages off in all\ndirections.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_stairs",
        "label": "STAIRS",
        "type": "move",
        "to": "misthall"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "misthall"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "misthall"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "floorhole"
      },
      {
        "id": "go_right",
        "label": "RIGHT",
        "type": "move",
        "to": "floorhole"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "southside"
      },
      {
        "id": "go_left",
        "label": "LEFT",
        "type": "move",
        "to": "southside"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "westside"
      },
      {
        "id": "go_forward",
        "label": "FORWARD",
        "type": "move",
        "to": "westside"
      },
      {
        "id": "go_sw",
        "label": "GO SOUTHWEST",
        "type": "move",
        "to": "secret3"
      },
      {
        "id": "go_secre",
        "label": "Secre",
        "type": "move",
        "to": "secret3"
      }
    ]
  },
  "neckbroke": {
    "id": "neckbroke",
    "title": "Neckbroke",
    "description": "You are at the bottom of the pit with a broken neck.",
    "descriptionWithoutItems": "You are at the bottom of the pit with a broken neck.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_default",
        "label": "CONTINUE",
        "type": "move",
        "to": "nowhere"
      }
    ]
  },
  "nomake": {
    "id": "nomake",
    "title": "Nomake",
    "description": "You didn't make it.",
    "descriptionWithoutItems": "You didn't make it.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_default",
        "label": "CONTINUE",
        "type": "move",
        "to": "nowhere"
      }
    ]
  },
  "dome": {
    "id": "dome",
    "title": "Dome",
    "description": "The dome is unclimbable.",
    "descriptionWithoutItems": "The dome is unclimbable.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_default",
        "label": "CONTINUE",
        "type": "move",
        "to": "misthall"
      }
    ]
  },
  "westend": {
    "id": "westend",
    "title": "West End Of Twopit Room",
    "description": "You are at the west end of the Twopit Room.  There is a large hole in\nthe wall above the pit at this end of the room.",
    "descriptionWithoutItems": "You are at the west end of the Twopit Room.  There is a large hole in\nthe wall above the pit at this end of the room.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "eastend"
      },
      {
        "id": "go_acros",
        "label": "Acros",
        "type": "move",
        "to": "eastend"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "slab"
      },
      {
        "id": "go_slab",
        "label": "SLAB",
        "type": "move",
        "to": "slab"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "westpit"
      },
      {
        "id": "go_pit",
        "label": "PIT",
        "type": "move",
        "to": "westpit"
      },
      {
        "id": "say_too_far_hole",
        "label": "Hole",
        "type": "event",
        "message": "It is too far up for you to reach.",
        "uiHint": "hidden"
      }
    ]
  },
  "eastpit": {
    "id": "eastpit",
    "title": "East Pit",
    "description": "You are at the bottom of the eastern pit in the Twopit Room.  There is\na small pool of oil in one corner of the pit.",
    "descriptionWithoutItems": "You are at the bottom of the eastern pit in the Twopit Room.  There is\na small pool of oil in one corner of the pit.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "eastend"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "eastend"
      }
    ]
  },
  "westpit": {
    "id": "westpit",
    "title": "West Pit",
    "description": "You are at the bottom of the western pit in the Twopit Room.  There is\na large hole in the wall about 25 feet above you.",
    "descriptionWithoutItems": "You are at the bottom of the western pit in the Twopit Room.  There is\na large hole in the wall about 25 feet above you.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "westend"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "westend"
      },
      {
        "id": "go_climb",
        "label": "CLIMB",
        "type": "move",
        "to": "building1"
      }
    ]
  },
  "climbstalk": {
    "id": "climbstalk",
    "title": "Climbstalk",
    "description": "You clamber up the plant and scurry through the hole at the top.",
    "descriptionWithoutItems": "You clamber up the plant and scurry through the hole at the top.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_default",
        "label": "CONTINUE",
        "type": "move",
        "to": "narrow"
      }
    ]
  },
  "westbank": {
    "id": "westbank",
    "title": "West Bank Of Fissure",
    "description": "You are on the west side of the fissure in the Hall of Mists.",
    "descriptionWithoutItems": "You are on the west side of the fissure in the Hall of Mists.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "say_cross_bridge_jump",
        "label": "Jump",
        "type": "event",
        "message": "I respectfully suggest you go across the bridge instead of jumping.",
        "uiHint": "hidden"
      },
      {
        "id": "go_forward",
        "label": "FORWARD",
        "type": "move",
        "to": "nomake"
      },
      {
        "id": "say_no_cross_over",
        "label": "Over",
        "type": "event",
        "message": "There is no way across the fissure.",
        "uiHint": "hidden"
      },
      {
        "id": "say_no_cross_acros",
        "label": "Acros",
        "type": "event",
        "message": "There is no way across the fissure.",
        "uiHint": "hidden"
      },
      {
        "id": "say_no_cross_east",
        "label": "East",
        "type": "event",
        "message": "There is no way across the fissure.",
        "uiHint": "hidden"
      },
      {
        "id": "say_no_cross_cross",
        "label": "Cross",
        "type": "event",
        "message": "There is no way across the fissure.",
        "uiHint": "hidden"
      },
      {
        "id": "go_over",
        "label": "Over",
        "type": "move",
        "to": "eastbank"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "parallel1"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "mistwest"
      },
      {
        "id": "take_obj_51",
        "label": "TAKE SEVERAL DIAMONDS",
        "type": "event",
        "addsItem": "obj_51",
        "removesAction": true
      }
    ],
    "items": [
      "obj_51"
    ],
    "itemDescriptions": {
      "obj_51": "There are diamonds here!"
    }
  },
  "floorhole": {
    "id": "floorhole",
    "title": "N/s Passage Above E/w Passage",
    "description": "You are in a low n/s passage at a hole in the floor.  The hole goes\ndown to an e/w passage.",
    "descriptionWithoutItems": "You are in a low n/s passage at a hole in the floor.  The hole goes\ndown to an e/w passage.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_hall",
        "label": "HALL",
        "type": "move",
        "to": "kinghall"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "kinghall"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "kinghall"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "y2"
      },
      {
        "id": "go_y2",
        "label": "Y2",
        "type": "move",
        "to": "y2"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "broken"
      },
      {
        "id": "go_hole",
        "label": "HOLE",
        "type": "move",
        "to": "broken"
      },
      {
        "id": "take_obj_52",
        "label": "TAKE BARS OF SILVER",
        "type": "event",
        "addsItem": "obj_52",
        "removesAction": true
      }
    ],
    "items": [
      "obj_52"
    ],
    "itemDescriptions": {
      "obj_52": "There are bars of silver here!"
    }
  },
  "southside": {
    "id": "southside",
    "title": "Southside",
    "description": "You are in the south side chamber.",
    "descriptionWithoutItems": "You are in the south side chamber.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_hall",
        "label": "HALL",
        "type": "move",
        "to": "kinghall"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "kinghall"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "kinghall"
      },
      {
        "id": "take_obj_53",
        "label": "TAKE PRECIOUS JEWELRY",
        "type": "event",
        "addsItem": "obj_53",
        "removesAction": true
      }
    ],
    "items": [
      "obj_53"
    ],
    "itemDescriptions": {
      "obj_53": "There is precious jewelry here!"
    }
  },
  "westside": {
    "id": "westside",
    "title": "The West Side Chamber",
    "description": "You are in the west side chamber of the Hall of the Mountain King.\nA passage continues west and up here.",
    "descriptionWithoutItems": "You are in the west side chamber of the Hall of the Mountain King.\nA passage continues west and up here.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_hall",
        "label": "HALL",
        "type": "move",
        "to": "kinghall"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "kinghall"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "kinghall"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "crossover"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "crossover"
      },
      {
        "id": "take_coins",
        "label": "TAKE RARE COINS",
        "type": "event",
        "addsItem": "coins",
        "removesAction": true
      }
    ],
    "items": [
      "coins"
    ],
    "itemDescriptions": {
      "coins": "There are many coins here!"
    }
  },
  "snakeblock": {
    "id": "snakeblock",
    "title": "Snakeblock",
    "description": "You can't get by the snake.",
    "descriptionWithoutItems": "You can't get by the snake.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_default",
        "label": "CONTINUE",
        "type": "move",
        "to": "kinghall"
      }
    ]
  },
  "y2": {
    "id": "y2",
    "title": "\"y2\"",
    "description": "You are in a large room, with a passage to the south, a passage to the\nwest, and a wall of broken rock to the east.  There is a large \"Y2\" on\na rock in the room's center.",
    "descriptionWithoutItems": "You are in a large room, with a passage to the south, a passage to the\nwest, and a wall of broken rock to the east.  There is a large \"Y2\" on\na rock in the room's center.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_plugh",
        "label": "PLUGH",
        "type": "move",
        "to": "foof4"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "floorhole"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "jumble"
      },
      {
        "id": "go_wall",
        "label": "WALL",
        "type": "move",
        "to": "jumble"
      },
      {
        "id": "go_broke",
        "label": "Broke",
        "type": "move",
        "to": "jumble"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "window1"
      },
      {
        "id": "go_plover",
        "label": "PLOVER",
        "type": "move",
        "to": "foof5"
      }
    ]
  },
  "jumble": {
    "id": "jumble",
    "title": "Jumble",
    "description": "You are in a jumble of rock, with cracks everywhere.",
    "descriptionWithoutItems": "You are in a jumble of rock, with cracks everywhere.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "y2"
      },
      {
        "id": "go_y2",
        "label": "Y2",
        "type": "move",
        "to": "y2"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "misthall"
      }
    ]
  },
  "window1": {
    "id": "window1",
    "title": "Window On Pit",
    "description": "You're at a low window overlooking a huge pit, which extends up out of\nsight.  A floor is indistinctly visible over 50 feet below.  Traces of\nwhite mist cover the floor of the pit, becoming thicker to the right.\nMarks in the dust around the window would seem to indicate that\nsomeone has been here recently.  Directly across the pit from you and\n25 feet away there is a similar window looking into a lighted room.  A\nshadowy figure can be seen there peering back at you.",
    "descriptionWithoutItems": "You're at a low window overlooking a huge pit, which extends up out of\nsight.  A floor is indistinctly visible over 50 feet below.  Traces of\nwhite mist cover the floor of the pit, becoming thicker to the right.\nMarks in the dust around the window would seem to indicate that\nsomeone has been here recently.  Directly across the pit from you and\n25 feet away there is a similar window looking into a lighted room.  A\nshadowy figure can be seen there peering back at you.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "y2"
      },
      {
        "id": "go_y2",
        "label": "Y2",
        "type": "move",
        "to": "y2"
      },
      {
        "id": "go_jump",
        "label": "JUMP",
        "type": "move",
        "to": "neckbroke"
      }
    ]
  },
  "broken": {
    "id": "broken",
    "title": "Dirty Passage",
    "description": "You are in a dirty broken passage.  To the east is a crawl.  To the\nwest is a large passage.  Above you is a hole to another passage.",
    "descriptionWithoutItems": "You are in a dirty broken passage.  To the east is a crawl.  To the\nwest is a large passage.  Above you is a hole to another passage.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "smallpitbrink"
      },
      {
        "id": "go_crawl",
        "label": "CRAWL",
        "type": "move",
        "to": "smallpitbrink"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "floorhole"
      },
      {
        "id": "go_hole",
        "label": "HOLE",
        "type": "move",
        "to": "floorhole"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "dusty"
      },
      {
        "id": "go_bedquilt",
        "label": "BEDQUILT",
        "type": "move",
        "to": "bedquilt"
      }
    ]
  },
  "smallpitbrink": {
    "id": "smallpitbrink",
    "title": "Brink Of Small Pit",
    "description": "You are on the brink of a small clean climbable pit.  A crawl leads\nwest.",
    "descriptionWithoutItems": "You are on the brink of a small clean climbable pit.  A crawl leads\nwest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "broken"
      },
      {
        "id": "go_crawl",
        "label": "CRAWL",
        "type": "move",
        "to": "broken"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "smallpit"
      },
      {
        "id": "go_pit",
        "label": "PIT",
        "type": "move",
        "to": "smallpit"
      },
      {
        "id": "go_climb",
        "label": "CLIMB",
        "type": "move",
        "to": "smallpit"
      }
    ]
  },
  "smallpit": {
    "id": "smallpit",
    "title": "Bottom Of Pit With Stream",
    "description": "You are in the bottom of a small pit with a little stream, which\nenters and exits through tiny slits.",
    "descriptionWithoutItems": "You are in the bottom of a small pit with a little stream, which\nenters and exits through tiny slits.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_climb",
        "label": "CLIMB",
        "type": "move",
        "to": "smallpitbrink"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "smallpitbrink"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "smallpitbrink"
      },
      {
        "id": "say_dont_fit_slit",
        "label": "Slit",
        "type": "event",
        "message": "You don't fit through a two-inch slit!",
        "uiHint": "hidden"
      },
      {
        "id": "say_dont_fit_strea",
        "label": "Strea",
        "type": "event",
        "message": "You don't fit through a two-inch slit!",
        "uiHint": "hidden"
      },
      {
        "id": "say_dont_fit_down",
        "label": "Down",
        "type": "event",
        "message": "You don't fit through a two-inch slit!",
        "uiHint": "hidden"
      },
      {
        "id": "say_dont_fit_upstr",
        "label": "Upstr",
        "type": "event",
        "message": "You don't fit through a two-inch slit!",
        "uiHint": "hidden"
      },
      {
        "id": "say_dont_fit_downs",
        "label": "Downs",
        "type": "event",
        "message": "You don't fit through a two-inch slit!",
        "uiHint": "hidden"
      },
      {
        "id": "say_dont_fit_enter",
        "label": "Enter",
        "type": "event",
        "message": "You don't fit through a two-inch slit!",
        "uiHint": "hidden"
      },
      {
        "id": "say_dont_fit_inwar",
        "label": "Inwar",
        "type": "event",
        "message": "You don't fit through a two-inch slit!",
        "uiHint": "hidden"
      }
    ]
  },
  "dusty": {
    "id": "dusty",
    "title": "Dusty Rock Room",
    "description": "You are in a large room full of dusty rocks.  There is a big hole in\nthe floor.  There are cracks everywhere, and a passage leading east.",
    "descriptionWithoutItems": "You are in a large room full of dusty rocks.  There is a big hole in\nthe floor.  There are cracks everywhere, and a passage leading east.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "broken"
      },
      {
        "id": "go_passage",
        "label": "PASSAGE",
        "type": "move",
        "to": "broken"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "complex"
      },
      {
        "id": "go_hole",
        "label": "HOLE",
        "type": "move",
        "to": "complex"
      },
      {
        "id": "go_floor",
        "label": "FLOOR",
        "type": "move",
        "to": "complex"
      },
      {
        "id": "go_bedquilt",
        "label": "BEDQUILT",
        "type": "move",
        "to": "bedquilt"
      }
    ]
  },
  "parallel1": {
    "id": "parallel1",
    "title": "Parallel1",
    "description": "You have crawled through a very low wide passage parallel to and north\nof the Hall of Mists.",
    "descriptionWithoutItems": "You have crawled through a very low wide passage parallel to and north\nof the Hall of Mists.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_default",
        "label": "CONTINUE",
        "type": "move",
        "to": "mistwest"
      }
    ]
  },
  "mistwest": {
    "id": "mistwest",
    "title": "West End Of Hall Of Mists",
    "description": "You are at the west end of the Hall of Mists.  A low wide crawl\ncontinues west and another goes north.  To the south is a little\npassage 6 feet off the floor.",
    "descriptionWithoutItems": "You are at the west end of the Hall of Mists.  A low wide crawl\ncontinues west and another goes north.  To the south is a little\npassage 6 feet off the floor.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "alike1"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "alike1"
      },
      {
        "id": "go_passage",
        "label": "PASSAGE",
        "type": "move",
        "to": "alike1"
      },
      {
        "id": "go_climb",
        "label": "CLIMB",
        "type": "move",
        "to": "alike1"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "westbank"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "parallel2"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "longeast"
      },
      {
        "id": "go_crawl",
        "label": "CRAWL",
        "type": "move",
        "to": "longeast"
      }
    ]
  },
  "alike1": {
    "id": "alike1",
    "title": "Alike1",
    "description": "You are in a maze of twisty little passages, all alike.",
    "descriptionWithoutItems": "You are in a maze of twisty little passages, all alike.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "mistwest"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "alike1"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "alike2"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "alike4"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "alike11"
      }
    ]
  },
  "alike2": {
    "id": "alike2",
    "title": "Alike2",
    "description": "You are in a maze of twisty little passages, all alike.",
    "descriptionWithoutItems": "You are in a maze of twisty little passages, all alike.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "alike1"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "alike3"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "alike4"
      }
    ]
  },
  "alike3": {
    "id": "alike3",
    "title": "Alike3",
    "description": "You are in a maze of twisty little passages, all alike.",
    "descriptionWithoutItems": "You are in a maze of twisty little passages, all alike.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "alike2"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "mazeend3"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "alike6"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "mazeend9"
      }
    ]
  },
  "alike4": {
    "id": "alike4",
    "title": "Alike4",
    "description": "You are in a maze of twisty little passages, all alike.",
    "descriptionWithoutItems": "You are in a maze of twisty little passages, all alike.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "alike1"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "alike2"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "mazeend1"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "mazeend2"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "alike14"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "alike14"
      }
    ]
  },
  "mazeend1": {
    "id": "mazeend1",
    "title": "Mazeend1",
    "description": "Dead end",
    "descriptionWithoutItems": "Dead end",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "alike4"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "alike4"
      }
    ]
  },
  "mazeend2": {
    "id": "mazeend2",
    "title": "Mazeend2",
    "description": "Dead end",
    "descriptionWithoutItems": "Dead end",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "alike4"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "alike4"
      }
    ]
  },
  "mazeend3": {
    "id": "mazeend3",
    "title": "Mazeend3",
    "description": "Dead end",
    "descriptionWithoutItems": "Dead end",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "alike3"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "alike3"
      }
    ]
  },
  "alike5": {
    "id": "alike5",
    "title": "Alike5",
    "description": "You are in a maze of twisty little passages, all alike.",
    "descriptionWithoutItems": "You are in a maze of twisty little passages, all alike.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "alike6"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "alike7"
      }
    ]
  },
  "alike6": {
    "id": "alike6",
    "title": "Alike6",
    "description": "You are in a maze of twisty little passages, all alike.",
    "descriptionWithoutItems": "You are in a maze of twisty little passages, all alike.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "alike3"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "alike5"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "alike7"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "alike8"
      }
    ]
  },
  "alike7": {
    "id": "alike7",
    "title": "Alike7",
    "description": "You are in a maze of twisty little passages, all alike.",
    "descriptionWithoutItems": "You are in a maze of twisty little passages, all alike.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "alike5"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "alike6"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "alike8"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "alike9"
      }
    ]
  },
  "alike8": {
    "id": "alike8",
    "title": "Alike8",
    "description": "You are in a maze of twisty little passages, all alike.",
    "descriptionWithoutItems": "You are in a maze of twisty little passages, all alike.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "alike6"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "alike7"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "alike8"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "alike9"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "alike10"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "mazeend11"
      }
    ]
  },
  "alike9": {
    "id": "alike9",
    "title": "Alike9",
    "description": "You are in a maze of twisty little passages, all alike.",
    "descriptionWithoutItems": "You are in a maze of twisty little passages, all alike.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "alike7"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "alike8"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "mazeend4"
      }
    ]
  },
  "mazeend4": {
    "id": "mazeend4",
    "title": "Mazeend4",
    "description": "Dead end",
    "descriptionWithoutItems": "Dead end",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "alike9"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "alike9"
      }
    ]
  },
  "alike10": {
    "id": "alike10",
    "title": "Alike10",
    "description": "You are in a maze of twisty little passages, all alike.",
    "descriptionWithoutItems": "You are in a maze of twisty little passages, all alike.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "alike8"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "alike10"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "mazeend5"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "pitbrink"
      }
    ]
  },
  "mazeend5": {
    "id": "mazeend5",
    "title": "Mazeend5",
    "description": "Dead end",
    "descriptionWithoutItems": "Dead end",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "alike10"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "alike10"
      }
    ]
  },
  "pitbrink": {
    "id": "pitbrink",
    "title": "Brink Of Pit",
    "description": "You are on the brink of a thirty foot pit with a massive orange column\ndown one wall.  You could climb down here but you could not get back\nup.  The maze continues at this level.",
    "descriptionWithoutItems": "You are on the brink of a thirty foot pit with a massive orange column\ndown one wall.  You could climb down here but you could not get back\nup.  The maze continues at this level.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "birdchamber"
      },
      {
        "id": "go_climb",
        "label": "CLIMB",
        "type": "move",
        "to": "birdchamber"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "alike10"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "mazeend6"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "alike12"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "alike13"
      }
    ]
  },
  "mazeend6": {
    "id": "mazeend6",
    "title": "Mazeend6",
    "description": "Dead end",
    "descriptionWithoutItems": "Dead end",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "pitbrink"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "pitbrink"
      }
    ]
  },
  "parallel2": {
    "id": "parallel2",
    "title": "Parallel2",
    "description": "You have crawled through a very low wide passage parallel to and north\nof the Hall of Mists.",
    "descriptionWithoutItems": "You have crawled through a very low wide passage parallel to and north\nof the Hall of Mists.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_default",
        "label": "CONTINUE",
        "type": "move",
        "to": "westbank"
      }
    ]
  },
  "longeast": {
    "id": "longeast",
    "title": "East End Of Long Hall",
    "description": "You are at the east end of a very long hall apparently without side\nchambers.  To the east a low wide crawl slants up.  To the north a\nround two foot hole slants down.",
    "descriptionWithoutItems": "You are at the east end of a very long hall apparently without side\nchambers.  To the east a low wide crawl slants up.  To the north a\nround two foot hole slants down.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "mistwest"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "mistwest"
      },
      {
        "id": "go_crawl",
        "label": "CRAWL",
        "type": "move",
        "to": "mistwest"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "longwest"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "crossover"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "crossover"
      },
      {
        "id": "go_hole",
        "label": "HOLE",
        "type": "move",
        "to": "crossover"
      }
    ]
  },
  "longwest": {
    "id": "longwest",
    "title": "West End Of Long Hall",
    "description": "You are at the west end of a very long featureless hall.  The hall\njoins up with a narrow north/south passage.",
    "descriptionWithoutItems": "You are at the west end of a very long featureless hall.  The hall\njoins up with a narrow north/south passage.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "longeast"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "crossover"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "different1"
      }
    ]
  },
  "crossover": {
    "id": "crossover",
    "title": "Crossover",
    "description": "You are at a crossover of a high n/s passage and a low e/w one.",
    "descriptionWithoutItems": "You are at a crossover of a high n/s passage and a low e/w one.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "longeast"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "deadend7"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "westside"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "longwest"
      }
    ]
  },
  "deadend7": {
    "id": "deadend7",
    "title": "Deadend7",
    "description": "Dead end",
    "descriptionWithoutItems": "Dead end",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "crossover"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "crossover"
      }
    ]
  },
  "complex": {
    "id": "complex",
    "title": "Complex Junction",
    "description": "You are at a complex junction.  A low hands and knees passage from the\nnorth joins a higher crawl from the east to make a walking passage\ngoing west.  There is also a large room above.  The air is damp here.",
    "descriptionWithoutItems": "You are at a complex junction.  A low hands and knees passage from the\nnorth joins a higher crawl from the east to make a walking passage\ngoing west.  There is also a large room above.  The air is damp here.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "dusty"
      },
      {
        "id": "go_climb",
        "label": "CLIMB",
        "type": "move",
        "to": "dusty"
      },
      {
        "id": "go_room",
        "label": "ROOM",
        "type": "move",
        "to": "dusty"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "bedquilt"
      },
      {
        "id": "go_bedquilt",
        "label": "BEDQUILT",
        "type": "move",
        "to": "bedquilt"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "shellroom"
      },
      {
        "id": "go_shell",
        "label": "SHELL",
        "type": "move",
        "to": "shellroom"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "anteroom"
      }
    ]
  },
  "bedquilt": {
    "id": "bedquilt",
    "title": "Bedquilt",
    "description": "You are in Bedquilt, a long east/west passage with holes everywhere.\nTo explore at random select north, south, up, or down.",
    "descriptionWithoutItems": "You are in Bedquilt, a long east/west passage with holes everywhere.\nTo explore at random select north, south, up, or down.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "complex"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "swisscheese"
      },
      {
        "id": "say_futile_crawl_south",
        "label": "South",
        "type": "event",
        "message": "You have crawled around in some little holes and wound up back in the\nmain passage.",
        "uiHint": "hidden"
      },
      {
        "id": "go_slab",
        "label": "SLAB",
        "type": "move",
        "to": "slab"
      },
      {
        "id": "say_futile_crawl_upwar",
        "label": "Upwar",
        "type": "event",
        "message": "You have crawled around in some little holes and wound up back in the\nmain passage.",
        "uiHint": "hidden"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "secret2"
      },
      {
        "id": "say_futile_crawl_north",
        "label": "North",
        "type": "event",
        "message": "You have crawled around in some little holes and wound up back in the\nmain passage.",
        "uiHint": "hidden"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "lowroom"
      },
      {
        "id": "say_futile_crawl_down",
        "label": "Down",
        "type": "event",
        "message": "You have crawled around in some little holes and wound up back in the\nmain passage.",
        "uiHint": "hidden"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "anteroom"
      }
    ]
  },
  "swisscheese": {
    "id": "swisscheese",
    "title": "Swiss Cheese Room",
    "description": "You are in a room whose walls resemble Swiss cheese.  Obvious passages\ngo west, east, ne, and nw.  Part of the room is occupied by a large\nbedrock block.",
    "descriptionWithoutItems": "You are in a room whose walls resemble Swiss cheese.  Obvious passages\ngo west, east, ne, and nw.  Part of the room is occupied by a large\nbedrock block.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_ne",
        "label": "GO NORTHEAST",
        "type": "move",
        "to": "bedquilt"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "eastend"
      },
      {
        "id": "say_futile_crawl_south",
        "label": "South",
        "type": "event",
        "message": "You have crawled around in some little holes and wound up back in the\nmain passage.",
        "uiHint": "hidden"
      },
      {
        "id": "go_canyon",
        "label": "CANYON",
        "type": "move",
        "to": "tall"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "softroom"
      },
      {
        "id": "say_futile_crawl_nw",
        "label": "Nw",
        "type": "event",
        "message": "You have crawled around in some little holes and wound up back in the\nmain passage.",
        "uiHint": "hidden"
      },
      {
        "id": "go_oriental",
        "label": "ORIENTAL",
        "type": "move",
        "to": "oriental"
      }
    ]
  },
  "eastend": {
    "id": "eastend",
    "title": "East End Of Twopit Room",
    "description": "You are at the east end of the Twopit Room.  The floor here is\nlittered with thin rock slabs, which make it easy to descend the pits.\nThere is a path here bypassing the pits to connect passages from east\nand west.  There are holes all over, but the only big one is on the\nwall directly over the west pit where you can't get to it.",
    "descriptionWithoutItems": "You are at the east end of the Twopit Room.  The floor here is\nlittered with thin rock slabs, which make it easy to descend the pits.\nThere is a path here bypassing the pits to connect passages from east\nand west.  There are holes all over, but the only big one is on the\nwall directly over the west pit where you can't get to it.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "swisscheese"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "westend"
      },
      {
        "id": "go_acros",
        "label": "Acros",
        "type": "move",
        "to": "westend"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "eastpit"
      },
      {
        "id": "go_pit",
        "label": "PIT",
        "type": "move",
        "to": "eastpit"
      }
    ]
  },
  "slab": {
    "id": "slab",
    "title": "Slab Room",
    "description": "You are in a large low circular chamber whose floor is an immense slab\nfallen from the ceiling (Slab Room).  East and west there once were\nlarge passages, but they are now filled with boulders.  Low small\npassages go north and south, and the south one quickly bends west\naround the boulders.",
    "descriptionWithoutItems": "You are in a large low circular chamber whose floor is an immense slab\nfallen from the ceiling (Slab Room).  East and west there once were\nlarge passages, but they are now filled with boulders.  Low small\npassages go north and south, and the south one quickly bends west\naround the boulders.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "westend"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "secret1"
      },
      {
        "id": "go_climb",
        "label": "CLIMB",
        "type": "move",
        "to": "secret1"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "bedquilt"
      }
    ]
  },
  "secret1": {
    "id": "secret1",
    "title": "Secret1",
    "description": "You are in a secret n/s canyon above a large room.",
    "descriptionWithoutItems": "You are in a secret n/s canyon above a large room.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "slab"
      },
      {
        "id": "go_slab",
        "label": "SLAB",
        "type": "move",
        "to": "slab"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "secret5"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "mirrorcanyon"
      },
      {
        "id": "go_reservoir",
        "label": "RESERVOIR",
        "type": "move",
        "to": "reservoir"
      }
    ]
  },
  "secret2": {
    "id": "secret2",
    "title": "Secret2",
    "description": "You are in a secret n/s canyon above a sizable passage.",
    "descriptionWithoutItems": "You are in a secret n/s canyon above a sizable passage.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "threejunction"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "bedquilt"
      },
      {
        "id": "go_passage",
        "label": "PASSAGE",
        "type": "move",
        "to": "bedquilt"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "topstalactite"
      }
    ]
  },
  "threejunction": {
    "id": "threejunction",
    "title": "Junction Of Three Secret Canyons",
    "description": "You are in a secret canyon at a junction of three canyons, bearing\nnorth, south, and se.  The north one is as tall as the other two\ncombined.",
    "descriptionWithoutItems": "You are in a secret canyon at a junction of three canyons, bearing\nnorth, south, and se.  The north one is as tall as the other two\ncombined.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_se",
        "label": "GO SOUTHEAST",
        "type": "move",
        "to": "bedquilt"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "secret2"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "window2"
      }
    ]
  },
  "lowroom": {
    "id": "lowroom",
    "title": "Large Low Room",
    "description": "You are in a large low room.  Crawls lead north, se, and sw.",
    "descriptionWithoutItems": "You are in a large low room.  Crawls lead north, se, and sw.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_bedquilt",
        "label": "BEDQUILT",
        "type": "move",
        "to": "bedquilt"
      },
      {
        "id": "go_sw",
        "label": "GO SOUTHWEST",
        "type": "move",
        "to": "winding"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "deadcrawl"
      },
      {
        "id": "go_se",
        "label": "GO SOUTHEAST",
        "type": "move",
        "to": "oriental"
      },
      {
        "id": "go_oriental",
        "label": "ORIENTAL",
        "type": "move",
        "to": "oriental"
      }
    ]
  },
  "deadcrawl": {
    "id": "deadcrawl",
    "title": "Deadcrawl",
    "description": "Dead end crawl.",
    "descriptionWithoutItems": "Dead end crawl.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "lowroom"
      },
      {
        "id": "go_crawl",
        "label": "CRAWL",
        "type": "move",
        "to": "lowroom"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "lowroom"
      }
    ]
  },
  "secret3": {
    "id": "secret3",
    "title": "Secret E/w Canyon Above Tight Canyon",
    "description": "You are in a secret canyon which here runs e/w.  It crosses over a\nvery tight canyon 15 feet below.  If you go down you may not be able\nto get back up.",
    "descriptionWithoutItems": "You are in a secret canyon which here runs e/w.  It crosses over a\nvery tight canyon 15 feet below.  If you go down you may not be able\nto get back up.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "kinghall"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "secret5"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "wideplace"
      }
    ]
  },
  "wideplace": {
    "id": "wideplace",
    "title": "Wideplace",
    "description": "You are at a wide place in a very tight n/s canyon.",
    "descriptionWithoutItems": "You are at a wide place in a very tight n/s canyon.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "tightplace"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "tall"
      }
    ]
  },
  "tightplace": {
    "id": "tightplace",
    "title": "Tightplace",
    "description": "The canyon here becomes too tight to go further south.",
    "descriptionWithoutItems": "The canyon here becomes too tight to go further south.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "wideplace"
      }
    ]
  },
  "tall": {
    "id": "tall",
    "title": "Tall",
    "description": "You are in a tall e/w canyon.  A low tight crawl goes 3 feet north and\nseems to open up.",
    "descriptionWithoutItems": "You are in a tall e/w canyon.  A low tight crawl goes 3 feet north and\nseems to open up.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "wideplace"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "boulders1"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "swisscheese"
      },
      {
        "id": "go_crawl",
        "label": "CRAWL",
        "type": "move",
        "to": "swisscheese"
      }
    ]
  },
  "boulders1": {
    "id": "boulders1",
    "title": "Boulders1",
    "description": "The canyon runs into a mass of boulders -- dead end.",
    "descriptionWithoutItems": "The canyon runs into a mass of boulders -- dead end.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "tall"
      }
    ]
  },
  "sewer": {
    "id": "sewer",
    "title": "Sewer",
    "description": "The stream flows out through a pair of 1 foot diameter sewer pipes.\nIt would be advisable to use the exit.",
    "descriptionWithoutItems": "The stream flows out through a pair of 1 foot diameter sewer pipes.\nIt would be advisable to use the exit.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_default",
        "label": "CONTINUE",
        "type": "move",
        "to": "building"
      }
    ]
  },
  "alike11": {
    "id": "alike11",
    "title": "Alike11",
    "description": "You are in a maze of twisty little passages, all alike.",
    "descriptionWithoutItems": "You are in a maze of twisty little passages, all alike.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "alike1"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "alike11"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "alike11"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "mazeend8"
      }
    ]
  },
  "mazeend8": {
    "id": "mazeend8",
    "title": "Mazeend8",
    "description": "Dead end",
    "descriptionWithoutItems": "Dead end",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "alike11"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "alike11"
      }
    ]
  },
  "mazeend9": {
    "id": "mazeend9",
    "title": "Mazeend9",
    "description": "Dead end",
    "descriptionWithoutItems": "Dead end",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "alike3"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "alike3"
      }
    ]
  },
  "alike12": {
    "id": "alike12",
    "title": "Alike12",
    "description": "You are in a maze of twisty little passages, all alike.",
    "descriptionWithoutItems": "You are in a maze of twisty little passages, all alike.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "pitbrink"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "alike13"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "mazeend10"
      }
    ]
  },
  "alike13": {
    "id": "alike13",
    "title": "Alike13",
    "description": "You are in a maze of twisty little passages, all alike.",
    "descriptionWithoutItems": "You are in a maze of twisty little passages, all alike.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "pitbrink"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "alike12"
      },
      {
        "id": "go_nw",
        "label": "GO NORTHWEST",
        "type": "move",
        "to": "mazeend12"
      }
    ]
  },
  "mazeend10": {
    "id": "mazeend10",
    "title": "Mazeend10",
    "description": "Dead end",
    "descriptionWithoutItems": "Dead end",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "alike12"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "alike12"
      }
    ]
  },
  "mazeend11": {
    "id": "mazeend11",
    "title": "Mazeend11",
    "description": "Dead end",
    "descriptionWithoutItems": "Dead end",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "alike8"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "alike8"
      }
    ]
  },
  "alike14": {
    "id": "alike14",
    "title": "Alike14",
    "description": "You are in a maze of twisty little passages, all alike.",
    "descriptionWithoutItems": "You are in a maze of twisty little passages, all alike.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "alike4"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "alike4"
      }
    ]
  },
  "narrow": {
    "id": "narrow",
    "title": "Narrow Corridor",
    "description": "You are in a long, narrow corridor stretching out of sight to the\nwest.  At the eastern end is a hole through which you can see a\nprofusion of leaves.",
    "descriptionWithoutItems": "You are in a long, narrow corridor stretching out of sight to the\nwest.  At the eastern end is a hole through which you can see a\nprofusion of leaves.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "westpit"
      },
      {
        "id": "go_climb",
        "label": "CLIMB",
        "type": "move",
        "to": "westpit"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "westpit"
      },
      {
        "id": "go_jump",
        "label": "JUMP",
        "type": "move",
        "to": "neckbroke"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "giantroom"
      },
      {
        "id": "go_giant",
        "label": "GIANT",
        "type": "move",
        "to": "giantroom"
      }
    ]
  },
  "noclimb": {
    "id": "noclimb",
    "title": "Noclimb",
    "description": "There is nothing here to climb.  Use \"up\" or \"out\" to leave the pit.",
    "descriptionWithoutItems": "There is nothing here to climb.  Use \"up\" or \"out\" to leave the pit.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_default",
        "label": "CONTINUE",
        "type": "move",
        "to": "westpit"
      }
    ]
  },
  "planttop": {
    "id": "planttop",
    "title": "Planttop",
    "description": "You have climbed up the plant and out of the pit.",
    "descriptionWithoutItems": "You have climbed up the plant and out of the pit.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_default",
        "label": "CONTINUE",
        "type": "move",
        "to": "westend"
      }
    ]
  },
  "incline": {
    "id": "incline",
    "title": "Steep Incline Above Large Room",
    "description": "You are at the top of a steep incline above a large room.  You could\nclimb down here, but you would not be able to climb up.  There is a\npassage leading back to the north.",
    "descriptionWithoutItems": "You are at the top of a steep incline above a large room.  You could\nclimb down here, but you would not be able to climb up.  There is a\npassage leading back to the north.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "waterfall"
      },
      {
        "id": "go_cavern",
        "label": "CAVERN",
        "type": "move",
        "to": "waterfall"
      },
      {
        "id": "go_passage",
        "label": "PASSAGE",
        "type": "move",
        "to": "waterfall"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "lowroom"
      },
      {
        "id": "go_climb",
        "label": "CLIMB",
        "type": "move",
        "to": "lowroom"
      }
    ]
  },
  "giantroom": {
    "id": "giantroom",
    "title": "Giant Room",
    "description": "You are in the Giant Room.  The ceiling here is too high up for your\nlamp to show it.  Cavernous passages lead east, north, and south.  On\nthe west wall is scrawled the inscription, \"FEE FIE FOE FOO\" [sic].",
    "descriptionWithoutItems": "You are in the Giant Room.  The ceiling here is too high up for your\nlamp to show it.  Cavernous passages lead east, north, and south.  On\nthe west wall is scrawled the inscription, \"FEE FIE FOE FOO\" [sic].",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "narrow"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "cavein"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "immense"
      },
      {
        "id": "take_eggs",
        "label": "TAKE GOLDEN EGGS",
        "type": "event",
        "addsItem": "eggs",
        "removesAction": true
      }
    ],
    "items": [
      "eggs"
    ],
    "itemDescriptions": {
      "eggs": "There is a large nest here, full of golden eggs!"
    }
  },
  "cavein": {
    "id": "cavein",
    "title": "Cavein",
    "description": "The passage here is blocked by a recent cave-in.",
    "descriptionWithoutItems": "The passage here is blocked by a recent cave-in.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "giantroom"
      },
      {
        "id": "go_giant",
        "label": "GIANT",
        "type": "move",
        "to": "giantroom"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "giantroom"
      }
    ]
  },
  "immense": {
    "id": "immense",
    "title": "Immense",
    "description": "You are at one end of an immense north/south passage.",
    "descriptionWithoutItems": "You are at one end of an immense north/south passage.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "giantroom"
      },
      {
        "id": "go_giant",
        "label": "GIANT",
        "type": "move",
        "to": "giantroom"
      },
      {
        "id": "go_passage",
        "label": "PASSAGE",
        "type": "move",
        "to": "giantroom"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "waterfall"
      },
      {
        "id": "go_enter",
        "label": "ENTER",
        "type": "move",
        "to": "waterfall"
      },
      {
        "id": "go_cavern",
        "label": "CAVERN",
        "type": "move",
        "to": "waterfall"
      },
      {
        "id": "say_rusty_door_north",
        "label": "North",
        "type": "event",
        "message": "The door is extremely rusty and refuses to open.",
        "uiHint": "hidden"
      }
    ]
  },
  "waterfall": {
    "id": "waterfall",
    "title": "Cavern With Waterfall",
    "description": "You are in a magnificent cavern with a rushing stream, which cascades\nover a sparkling waterfall into a roaring whirlpool which disappears\nthrough a hole in the floor.  Passages exit to the south and west.",
    "descriptionWithoutItems": "You are in a magnificent cavern with a rushing stream, which cascades\nover a sparkling waterfall into a roaring whirlpool which disappears\nthrough a hole in the floor.  Passages exit to the south and west.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "immense"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "immense"
      },
      {
        "id": "go_giant",
        "label": "GIANT",
        "type": "move",
        "to": "giantroom"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "incline"
      },
      {
        "id": "take_trident",
        "label": "TAKE JEWELED TRIDENT",
        "type": "event",
        "addsItem": "trident",
        "removesAction": true
      }
    ],
    "items": [
      "trident"
    ],
    "itemDescriptions": {
      "trident": "There is a jewel-encrusted trident here!"
    }
  },
  "softroom": {
    "id": "softroom",
    "title": "Soft Room",
    "description": "You are in the Soft Room.  The walls are covered with heavy curtains,\nthe floor with a thick pile carpet.  Moss covers the ceiling.",
    "descriptionWithoutItems": "You are in the Soft Room.  The walls are covered with heavy curtains,\nthe floor with a thick pile carpet.  Moss covers the ceiling.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "swisscheese"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "swisscheese"
      },
      {
        "id": "take_pillow",
        "label": "TAKE VELVET PILLOW",
        "type": "event",
        "addsItem": "pillow",
        "removesAction": true
      }
    ],
    "items": [
      "pillow"
    ],
    "itemDescriptions": {
      "pillow": "A small velvet pillow lies on the floor."
    }
  },
  "oriental": {
    "id": "oriental",
    "title": "Oriental Room",
    "description": "This is the Oriental Room.  Ancient oriental cave drawings cover the\nwalls.  A gently sloping passage leads upward to the north, another\npassage leads se, and a hands and knees crawl leads west.",
    "descriptionWithoutItems": "This is the Oriental Room.  Ancient oriental cave drawings cover the\nwalls.  A gently sloping passage leads upward to the north, another\npassage leads se, and a hands and knees crawl leads west.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_se",
        "label": "GO SOUTHEAST",
        "type": "move",
        "to": "swisscheese"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "lowroom"
      },
      {
        "id": "go_crawl",
        "label": "CRAWL",
        "type": "move",
        "to": "lowroom"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "misty"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "misty"
      },
      {
        "id": "go_cavern",
        "label": "CAVERN",
        "type": "move",
        "to": "misty"
      },
      {
        "id": "take_vase",
        "label": "TAKE MING VASE",
        "type": "event",
        "addsItem": "vase",
        "removesAction": true
      }
    ],
    "items": [
      "vase"
    ],
    "itemDescriptions": {
      "vase": "There is a delicate, precious, ming vase here!"
    }
  },
  "misty": {
    "id": "misty",
    "title": "Misty Cavern",
    "description": "You are following a wide path around the outer edge of a large cavern.\nFar below, through a heavy white mist, strange splashing noises can be\nheard.  The mist rises up through a fissure in the ceiling.  The path\nexits to the south and west.",
    "descriptionWithoutItems": "You are following a wide path around the outer edge of a large cavern.\nFar below, through a heavy white mist, strange splashing noises can be\nheard.  The mist rises up through a fissure in the ceiling.  The path\nexits to the south and west.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "oriental"
      },
      {
        "id": "go_oriental",
        "label": "ORIENTAL",
        "type": "move",
        "to": "oriental"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "alcove"
      }
    ]
  },
  "alcove": {
    "id": "alcove",
    "title": "Alcove",
    "description": "You are in an alcove.  A small nw path seems to widen after a short\ndistance.  An extremely tight tunnel leads east.  It looks like a very\ntight squeeze.  An eerie light can be seen at the other end.",
    "descriptionWithoutItems": "You are in an alcove.  A small nw path seems to widen after a short\ndistance.  An extremely tight tunnel leads east.  It looks like a very\ntight squeeze.  An eerie light can be seen at the other end.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_nw",
        "label": "GO NORTHWEST",
        "type": "move",
        "to": "misty"
      },
      {
        "id": "go_cavern",
        "label": "CAVERN",
        "type": "move",
        "to": "misty"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "plover"
      }
    ]
  },
  "plover": {
    "id": "plover",
    "title": "Plover Room",
    "description": "You're in a small chamber lit by an eerie green light.  An extremely\nnarrow tunnel exits to the west.  A dark corridor leads ne.",
    "descriptionWithoutItems": "You're in a small chamber lit by an eerie green light.  An extremely\nnarrow tunnel exits to the west.  A dark corridor leads ne.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "alcove"
      },
      {
        "id": "go_plover",
        "label": "PLOVER",
        "type": "move",
        "to": "foof6"
      },
      {
        "id": "go_ne",
        "label": "GO NORTHEAST",
        "type": "move",
        "to": "darkroom"
      },
      {
        "id": "go_dark",
        "label": "DARK",
        "type": "move",
        "to": "darkroom"
      },
      {
        "id": "take_emerald",
        "label": "TAKE EGG-SIZED EMERALD",
        "type": "event",
        "addsItem": "emerald",
        "removesAction": true
      }
    ],
    "items": [
      "emerald"
    ],
    "itemDescriptions": {
      "emerald": "There is an emerald here the size of a plover's egg!"
    }
  },
  "darkroom": {
    "id": "darkroom",
    "title": "Dark-room",
    "description": "You're in the dark-room.  A corridor leading south is the only exit.",
    "descriptionWithoutItems": "You're in the dark-room.  A corridor leading south is the only exit.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "plover"
      },
      {
        "id": "go_plover",
        "label": "PLOVER",
        "type": "move",
        "to": "plover"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "plover"
      },
      {
        "id": "take_pyramid",
        "label": "TAKE PLATINUM PYRAMID",
        "type": "event",
        "addsItem": "pyramid",
        "removesAction": true
      }
    ],
    "items": [
      "pyramid"
    ],
    "itemDescriptions": {
      "pyramid": "There is a platinum pyramid here, 8 inches on a side!"
    }
  },
  "arched": {
    "id": "arched",
    "title": "Arched Hall",
    "description": "You are in an arched hall.  A coral passage once continued up and east\nfrom here, but is now blocked by debris.  The air smells of sea water.",
    "descriptionWithoutItems": "You are in an arched hall.  A coral passage once continued up and east\nfrom here, but is now blocked by debris.  The air smells of sea water.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "shellroom"
      },
      {
        "id": "go_shell",
        "label": "SHELL",
        "type": "move",
        "to": "shellroom"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "shellroom"
      }
    ]
  },
  "shellroom": {
    "id": "shellroom",
    "title": "Shell Room",
    "description": "You're in a large room carved out of sedimentary rock.  The floor and\nwalls are littered with bits of shells embedded in the stone.  A\nshallow passage proceeds downward, and a somewhat steeper one leads\nup.  A low hands and knees passage enters from the south.",
    "descriptionWithoutItems": "You're in a large room carved out of sedimentary rock.  The floor and\nwalls are littered with bits of shells embedded in the stone.  A\nshallow passage proceeds downward, and a somewhat steeper one leads\nup.  A low hands and knees passage enters from the south.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "arched"
      },
      {
        "id": "go_hall",
        "label": "HALL",
        "type": "move",
        "to": "arched"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "sloping1"
      },
      {
        "id": "say_clam_blocker_south",
        "label": "South",
        "type": "event",
        "message": "You can't fit this five-foot clam through that little passage!",
        "uiHint": "hidden"
      },
      {
        "id": "say_oyster_blocker_south",
        "label": "South",
        "type": "event",
        "message": "You can't fit this five-foot oyster through that little passage!",
        "uiHint": "hidden"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "complex"
      },
      {
        "id": "take_clam",
        "label": "TAKE GIANT CLAM",
        "type": "event",
        "addsItem": "clam",
        "removesAction": true
      }
    ],
    "items": [
      "clam"
    ],
    "itemDescriptions": {
      "clam": "There is an enormous clam here with its shell tightly closed."
    }
  },
  "sloping1": {
    "id": "sloping1",
    "title": "Sloping1",
    "description": "You are in a long sloping corridor with ragged sharp walls.",
    "descriptionWithoutItems": "You are in a long sloping corridor with ragged sharp walls.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "shellroom"
      },
      {
        "id": "go_shell",
        "label": "SHELL",
        "type": "move",
        "to": "shellroom"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "culdesac"
      }
    ]
  },
  "culdesac": {
    "id": "culdesac",
    "title": "Culdesac",
    "description": "You are in a cul-de-sac about eight feet across.",
    "descriptionWithoutItems": "You are in a cul-de-sac about eight feet across.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "sloping1"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "sloping1"
      },
      {
        "id": "go_shell",
        "label": "SHELL",
        "type": "move",
        "to": "shellroom"
      }
    ]
  },
  "anteroom": {
    "id": "anteroom",
    "title": "Anteroom",
    "description": "You are in an anteroom leading to a large passage to the east.  Small\npassages go west and up.  The remnants of recent digging are evident.\nA sign in midair here says \"Cave under construction beyond this point.\nProceed at own risk.  [Witt Construction Company]\"",
    "descriptionWithoutItems": "You are in an anteroom leading to a large passage to the east.  Small\npassages go west and up.  The remnants of recent digging are evident.\nA sign in midair here says \"Cave under construction beyond this point.\nProceed at own risk.  [Witt Construction Company]\"",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "complex"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "bedquilt"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "wittsend"
      },
      {
        "id": "take_magazine",
        "label": "TAKE MAGAZINE",
        "type": "event",
        "addsItem": "magazine",
        "removesAction": true
      }
    ],
    "items": [
      "magazine"
    ],
    "itemDescriptions": {
      "magazine": "There are a few recent issues of \"Spelunker Today\" magazine here."
    }
  },
  "different1": {
    "id": "different1",
    "title": "Different1",
    "description": "You are in a maze of twisty little passages, all different.",
    "descriptionWithoutItems": "You are in a maze of twisty little passages, all different.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "different3"
      },
      {
        "id": "go_sw",
        "label": "GO SOUTHWEST",
        "type": "move",
        "to": "different4"
      },
      {
        "id": "go_ne",
        "label": "GO NORTHEAST",
        "type": "move",
        "to": "different5"
      },
      {
        "id": "go_se",
        "label": "GO SOUTHEAST",
        "type": "move",
        "to": "different6"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "different7"
      },
      {
        "id": "go_nw",
        "label": "GO NORTHWEST",
        "type": "move",
        "to": "different8"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "different9"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "different10"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "different11"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "longwest"
      }
    ]
  },
  "wittsend": {
    "id": "wittsend",
    "title": "Witt's End",
    "description": "You are at Witt's End.  Passages lead off in *ALL* directions.",
    "descriptionWithoutItems": "You are at Witt's End.  Passages lead off in *ALL* directions.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "say_futile_crawl_east",
        "label": "East",
        "type": "event",
        "message": "You have crawled around in some little holes and wound up back in the\nmain passage.",
        "uiHint": "hidden"
      },
      {
        "id": "say_futile_crawl_north",
        "label": "North",
        "type": "event",
        "message": "You have crawled around in some little holes and wound up back in the\nmain passage.",
        "uiHint": "hidden"
      },
      {
        "id": "say_futile_crawl_south",
        "label": "South",
        "type": "event",
        "message": "You have crawled around in some little holes and wound up back in the\nmain passage.",
        "uiHint": "hidden"
      },
      {
        "id": "say_futile_crawl_ne",
        "label": "Ne",
        "type": "event",
        "message": "You have crawled around in some little holes and wound up back in the\nmain passage.",
        "uiHint": "hidden"
      },
      {
        "id": "say_futile_crawl_se",
        "label": "Se",
        "type": "event",
        "message": "You have crawled around in some little holes and wound up back in the\nmain passage.",
        "uiHint": "hidden"
      },
      {
        "id": "say_futile_crawl_sw",
        "label": "Sw",
        "type": "event",
        "message": "You have crawled around in some little holes and wound up back in the\nmain passage.",
        "uiHint": "hidden"
      },
      {
        "id": "say_futile_crawl_nw",
        "label": "Nw",
        "type": "event",
        "message": "You have crawled around in some little holes and wound up back in the\nmain passage.",
        "uiHint": "hidden"
      },
      {
        "id": "say_futile_crawl_upwar",
        "label": "Upwar",
        "type": "event",
        "message": "You have crawled around in some little holes and wound up back in the\nmain passage.",
        "uiHint": "hidden"
      },
      {
        "id": "say_futile_crawl_down",
        "label": "Down",
        "type": "event",
        "message": "You have crawled around in some little holes and wound up back in the\nmain passage.",
        "uiHint": "hidden"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "anteroom"
      },
      {
        "id": "say_way_blocked_west",
        "label": "West",
        "type": "event",
        "message": "You have crawled around in some little holes and found your way\nblocked by a recent cave-in.  You are now back in the main passage.",
        "uiHint": "hidden"
      }
    ]
  },
  "mirrorcanyon": {
    "id": "mirrorcanyon",
    "title": "Mirror Canyon",
    "description": "You are in a north/south canyon about 25 feet across.  The floor is\ncovered by white mist seeping in from the north.  The walls extend\nupward for well over 100 feet.  Suspended from some unseen point far\nabove you, an enormous two-sided mirror is hanging parallel to and\nmidway between the canyon walls.  (The mirror is obviously provided\nfor the use of the dwarves who, as you know, are extremely vain.)  A\nsmall window can be seen in either wall, some fifty feet up.",
    "descriptionWithoutItems": "You are in a north/south canyon about 25 feet across.  The floor is\ncovered by white mist seeping in from the north.  The walls extend\nupward for well over 100 feet.  Suspended from some unseen point far\nabove you, an enormous two-sided mirror is hanging parallel to and\nmidway between the canyon walls.  (The mirror is obviously provided\nfor the use of the dwarves who, as you know, are extremely vain.)  A\nsmall window can be seen in either wall, some fifty feet up.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "secret1"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "reservoir"
      },
      {
        "id": "go_reservoir",
        "label": "RESERVOIR",
        "type": "move",
        "to": "reservoir"
      }
    ]
  },
  "window2": {
    "id": "window2",
    "title": "Window On Pit",
    "description": "You're at a low window overlooking a huge pit, which extends up out of\nsight.  A floor is indistinctly visible over 50 feet below.  Traces of\nwhite mist cover the floor of the pit, becoming thicker to the left.\nMarks in the dust around the window would seem to indicate that\nsomeone has been here recently.  Directly across the pit from you and\n25 feet away there is a similar window looking into a lighted room.  A\nshadowy figure can be seen there peering back at you.",
    "descriptionWithoutItems": "You're at a low window overlooking a huge pit, which extends up out of\nsight.  A floor is indistinctly visible over 50 feet below.  Traces of\nwhite mist cover the floor of the pit, becoming thicker to the left.\nMarks in the dust around the window would seem to indicate that\nsomeone has been here recently.  Directly across the pit from you and\n25 feet away there is a similar window looking into a lighted room.  A\nshadowy figure can be seen there peering back at you.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "threejunction"
      },
      {
        "id": "go_jump",
        "label": "JUMP",
        "type": "move",
        "to": "neckbroke"
      }
    ]
  },
  "topstalactite": {
    "id": "topstalactite",
    "title": "Top Of Stalactite",
    "description": "A large stalactite extends from the roof and almost reaches the floor\nbelow.  You could climb down it, and jump from it to the floor, but\nhaving done so you would be unable to reach it to climb back up.",
    "descriptionWithoutItems": "A large stalactite extends from the roof and almost reaches the floor\nbelow.  You could climb down it, and jump from it to the floor, but\nhaving done so you would be unable to reach it to climb back up.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "secret2"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "alike6"
      },
      {
        "id": "go_jump",
        "label": "JUMP",
        "type": "move",
        "to": "alike6"
      },
      {
        "id": "go_climb",
        "label": "CLIMB",
        "type": "move",
        "to": "alike6"
      }
    ]
  },
  "different2": {
    "id": "different2",
    "title": "Different2",
    "description": "You are in a little maze of twisting passages, all different.",
    "descriptionWithoutItems": "You are in a little maze of twisting passages, all different.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_sw",
        "label": "GO SOUTHWEST",
        "type": "move",
        "to": "different3"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "different4"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "different5"
      },
      {
        "id": "go_nw",
        "label": "GO NORTHWEST",
        "type": "move",
        "to": "different6"
      },
      {
        "id": "go_se",
        "label": "GO SOUTHEAST",
        "type": "move",
        "to": "different7"
      },
      {
        "id": "go_ne",
        "label": "GO NORTHEAST",
        "type": "move",
        "to": "different8"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "different9"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "different10"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "different11"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "deadend13"
      }
    ]
  },
  "reservoir": {
    "id": "reservoir",
    "title": "Reservoir",
    "description": "You are at the edge of a large underground reservoir.  An opaque cloud\nof white mist fills the room and rises rapidly upward.  The lake is\nfed by a stream, which tumbles out of a hole in the wall about 10 feet\noverhead and splashes noisily into the water somewhere within the\nmist.  There is a passage going back toward the south.",
    "descriptionWithoutItems": "You are at the edge of a large underground reservoir.  An opaque cloud\nof white mist fills the room and rises rapidly upward.  The lake is\nfed by a stream, which tumbles out of a hole in the wall about 10 feet\noverhead and splashes noisily into the water somewhere within the\nmist.  There is a passage going back toward the south.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "mirrorcanyon"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "mirrorcanyon"
      },
      {
        "id": "say_bad_direction_north",
        "label": "North",
        "type": "event",
        "message": "There is no way to go that direction.",
        "uiHint": "hidden"
      },
      {
        "id": "say_bad_direction_acros",
        "label": "Acros",
        "type": "event",
        "message": "There is no way to go that direction.",
        "uiHint": "hidden"
      },
      {
        "id": "say_bad_direction_cross",
        "label": "Cross",
        "type": "event",
        "message": "There is no way to go that direction.",
        "uiHint": "hidden"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "resbottom"
      }
    ]
  },
  "mazeend12": {
    "id": "mazeend12",
    "title": "Mazeend12",
    "description": "Dead end",
    "descriptionWithoutItems": "Dead end",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_se",
        "label": "GO SOUTHEAST",
        "type": "move",
        "to": "alike13"
      }
    ]
  },
  "ne": {
    "id": "ne",
    "title": "Ne End",
    "description": "You are at the northeast end of an immense room, even larger than the\nGiant Room.  It appears to be a repository for the \"Adventure\"\nprogram.  Massive torches far overhead bathe the room with smoky\nyellow light.  Scattered about you can be seen a pile of bottles (all\nof them empty), a nursery of young beanstalks murmuring quietly, a bed\nof oysters, a bundle of black rods with rusty stars on their ends, and\na collection of brass lanterns.  Off to one side a great many dwarves\nare sleeping on the floor, snoring loudly.  A notice nearby reads: \"Do\nnot disturb the dwarves!\"  An immense mirror is hanging against one\nwall, and stretches to the other end of the room, where various other\nsundry objects can be glimpsed dimly in the distance.",
    "descriptionWithoutItems": "You are at the northeast end of an immense room, even larger than the\nGiant Room.  It appears to be a repository for the \"Adventure\"\nprogram.  Massive torches far overhead bathe the room with smoky\nyellow light.  Scattered about you can be seen a pile of bottles (all\nof them empty), a nursery of young beanstalks murmuring quietly, a bed\nof oysters, a bundle of black rods with rusty stars on their ends, and\na collection of brass lanterns.  Off to one side a great many dwarves\nare sleeping on the floor, snoring loudly.  A notice nearby reads: \"Do\nnot disturb the dwarves!\"  An immense mirror is hanging against one\nwall, and stretches to the other end of the room, where various other\nsundry objects can be glimpsed dimly in the distance.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_sw",
        "label": "GO SOUTHWEST",
        "type": "move",
        "to": "sw"
      }
    ]
  },
  "sw": {
    "id": "sw",
    "title": "Sw End",
    "description": "You are at the southwest end of the repository.  To one side is a pit\nfull of fierce green snakes.  On the other side is a row of small\nwicker cages, each of which contains a little sulking bird.  In one\ncorner is a bundle of black rods with rusty marks on their ends.  A\nlarge number of velvet pillows are scattered about on the floor.  A\nvast mirror stretches off to the northeast.  At your feet is a large\nsteel grate, next to which is a sign that reads, \"Treasure Vault.\nKeys in main office.\"",
    "descriptionWithoutItems": "You are at the southwest end of the repository.  To one side is a pit\nfull of fierce green snakes.  On the other side is a row of small\nwicker cages, each of which contains a little sulking bird.  In one\ncorner is a bundle of black rods with rusty marks on their ends.  A\nlarge number of velvet pillows are scattered about on the floor.  A\nvast mirror stretches off to the northeast.  At your feet is a large\nsteel grate, next to which is a sign that reads, \"Treasure Vault.\nKeys in main office.\"",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_ne",
        "label": "GO NORTHEAST",
        "type": "move",
        "to": "ne"
      },
      {
        "id": "say_grate_noway_down",
        "label": "Down",
        "type": "event",
        "message": "You can't go through a locked steel grate!",
        "uiHint": "hidden"
      }
    ]
  },
  "swchasm": {
    "id": "swchasm",
    "title": "Sw Side Of Chasm",
    "description": "You are on one side of a large, deep chasm.  A heavy white mist rising\nup from below obscures all view of the far side.  A sw path leads away\nfrom the chasm into a winding corridor.",
    "descriptionWithoutItems": "You are on one side of a large, deep chasm.  A heavy white mist rising\nup from below obscures all view of the far side.  A sw path leads away\nfrom the chasm into a winding corridor.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_sw",
        "label": "GO SOUTHWEST",
        "type": "move",
        "to": "winding"
      },
      {
        "id": "say_troll_blocks_over",
        "label": "Over",
        "type": "event",
        "message": "The troll refuses to let you cross.",
        "uiHint": "hidden"
      },
      {
        "id": "say_troll_blocks_acros",
        "label": "Acros",
        "type": "event",
        "message": "The troll refuses to let you cross.",
        "uiHint": "hidden"
      },
      {
        "id": "say_troll_blocks_cross",
        "label": "Cross",
        "type": "event",
        "message": "The troll refuses to let you cross.",
        "uiHint": "hidden"
      },
      {
        "id": "say_troll_blocks_ne",
        "label": "Ne",
        "type": "event",
        "message": "The troll refuses to let you cross.",
        "uiHint": "hidden"
      },
      {
        "id": "say_bridge_gone_over",
        "label": "Over",
        "type": "event",
        "message": "There is no longer any way across the chasm.",
        "uiHint": "hidden"
      },
      {
        "id": "go_jump",
        "label": "JUMP",
        "type": "move",
        "to": "nomake"
      },
      {
        "id": "say_cross_bridge_jump",
        "label": "Jump",
        "type": "event",
        "message": "I respectfully suggest you go across the bridge instead of jumping.",
        "uiHint": "hidden"
      }
    ]
  },
  "winding": {
    "id": "winding",
    "title": "Sloping Corridor",
    "description": "You are in a long winding corridor sloping out of sight in both\ndirections.",
    "descriptionWithoutItems": "You are in a long winding corridor sloping out of sight in both\ndirections.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "lowroom"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "swchasm"
      }
    ]
  },
  "secret4": {
    "id": "secret4",
    "title": "Secret4",
    "description": "You are in a secret canyon which exits to the north and east.",
    "descriptionWithoutItems": "You are in a secret canyon which exits to the north and east.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "secret1"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "secret1"
      },
      {
        "id": "say_nasty_dragon_east",
        "label": "East",
        "type": "event",
        "message": "The dragon looks rather nasty.  You'd best not try to get by.",
        "uiHint": "hidden"
      },
      {
        "id": "say_nasty_dragon_forwa",
        "label": "Forwa",
        "type": "event",
        "message": "The dragon looks rather nasty.  You'd best not try to get by.",
        "uiHint": "hidden"
      }
    ]
  },
  "secret5": {
    "id": "secret5",
    "title": "Secret5",
    "description": "You are in a secret canyon which exits to the north and east.",
    "descriptionWithoutItems": "You are in a secret canyon which exits to the north and east.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "secret1"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "secret3"
      }
    ]
  },
  "secret6": {
    "id": "secret6",
    "title": "Secret6",
    "description": "You are in a secret canyon which exits to the north and east.",
    "descriptionWithoutItems": "You are in a secret canyon which exits to the north and east.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "secret3"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "secret3"
      },
      {
        "id": "say_nasty_dragon_north",
        "label": "North",
        "type": "event",
        "message": "The dragon looks rather nasty.  You'd best not try to get by.",
        "uiHint": "hidden"
      },
      {
        "id": "say_nasty_dragon_forwa",
        "label": "Forwa",
        "type": "event",
        "message": "The dragon looks rather nasty.  You'd best not try to get by.",
        "uiHint": "hidden"
      }
    ]
  },
  "nechasm": {
    "id": "nechasm",
    "title": "Ne Side Of Chasm",
    "description": "You are on the far side of the chasm.  A ne path leads away from the\nchasm on this side.",
    "descriptionWithoutItems": "You are on the far side of the chasm.  A ne path leads away from the\nchasm on this side.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_ne",
        "label": "GO NORTHEAST",
        "type": "move",
        "to": "corridor"
      },
      {
        "id": "say_troll_blocks_over",
        "label": "Over",
        "type": "event",
        "message": "The troll refuses to let you cross.",
        "uiHint": "hidden"
      },
      {
        "id": "say_troll_blocks_acros",
        "label": "Acros",
        "type": "event",
        "message": "The troll refuses to let you cross.",
        "uiHint": "hidden"
      },
      {
        "id": "say_troll_blocks_cross",
        "label": "Cross",
        "type": "event",
        "message": "The troll refuses to let you cross.",
        "uiHint": "hidden"
      },
      {
        "id": "say_troll_blocks_sw",
        "label": "Sw",
        "type": "event",
        "message": "The troll refuses to let you cross.",
        "uiHint": "hidden"
      },
      {
        "id": "say_cross_bridge_jump",
        "label": "Jump",
        "type": "event",
        "message": "I respectfully suggest you go across the bridge instead of jumping.",
        "uiHint": "hidden"
      },
      {
        "id": "go_fork",
        "label": "FORK",
        "type": "move",
        "to": "fork"
      },
      {
        "id": "go_view",
        "label": "VIEW",
        "type": "move",
        "to": "breathtaking"
      },
      {
        "id": "go_barre",
        "label": "Barre",
        "type": "move",
        "to": "barrenfront"
      }
    ]
  },
  "corridor": {
    "id": "corridor",
    "title": "Corridor",
    "description": "You're in a long east/west corridor.  A faint rumbling noise can be\nheard in the distance.",
    "descriptionWithoutItems": "You're in a long east/west corridor.  A faint rumbling noise can be\nheard in the distance.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "nechasm"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "fork"
      },
      {
        "id": "go_fork",
        "label": "FORK",
        "type": "move",
        "to": "fork"
      },
      {
        "id": "go_view",
        "label": "VIEW",
        "type": "move",
        "to": "breathtaking"
      },
      {
        "id": "go_barre",
        "label": "Barre",
        "type": "move",
        "to": "barrenfront"
      }
    ]
  },
  "fork": {
    "id": "fork",
    "title": "Fork In Path",
    "description": "The path forks here.  The left fork leads northeast.  A dull rumbling\nseems to get louder in that direction.  The right fork leads southeast\ndown a gentle slope.  The main corridor enters from the west.",
    "descriptionWithoutItems": "The path forks here.  The left fork leads northeast.  A dull rumbling\nseems to get louder in that direction.  The right fork leads southeast\ndown a gentle slope.  The main corridor enters from the west.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "corridor"
      },
      {
        "id": "go_ne",
        "label": "GO NORTHEAST",
        "type": "move",
        "to": "warmwalls"
      },
      {
        "id": "go_left",
        "label": "LEFT",
        "type": "move",
        "to": "warmwalls"
      },
      {
        "id": "go_se",
        "label": "GO SOUTHEAST",
        "type": "move",
        "to": "limestone"
      },
      {
        "id": "go_right",
        "label": "RIGHT",
        "type": "move",
        "to": "limestone"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "limestone"
      },
      {
        "id": "go_view",
        "label": "VIEW",
        "type": "move",
        "to": "breathtaking"
      },
      {
        "id": "go_barre",
        "label": "Barre",
        "type": "move",
        "to": "barrenfront"
      }
    ]
  },
  "warmwalls": {
    "id": "warmwalls",
    "title": "Junction With Warm Walls",
    "description": "The walls are quite warm here.  From the north can be heard a steady\nroar, so loud that the entire cave seems to be trembling.  Another\npassage leads south, and a low crawl goes east.",
    "descriptionWithoutItems": "The walls are quite warm here.  From the north can be heard a steady\nroar, so loud that the entire cave seems to be trembling.  Another\npassage leads south, and a low crawl goes east.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "fork"
      },
      {
        "id": "go_fork",
        "label": "FORK",
        "type": "move",
        "to": "fork"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "breathtaking"
      },
      {
        "id": "go_view",
        "label": "VIEW",
        "type": "move",
        "to": "breathtaking"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "boulders2"
      },
      {
        "id": "go_crawl",
        "label": "CRAWL",
        "type": "move",
        "to": "boulders2"
      }
    ]
  },
  "breathtaking": {
    "id": "breathtaking",
    "title": "Breath-taking View",
    "description": "You are on the edge of a breath-taking view.  Far below you is an\nactive volcano, from which great gouts of molten lava come surging\nout, cascading back down into the depths.  The glowing rock fills the\nfarthest reaches of the cavern with a blood-red glare, giving every-\nthing an eerie, macabre appearance.  The air is filled with flickering\nsparks of ash and a heavy smell of brimstone.  The walls are hot to\nthe touch, and the thundering of the volcano drowns out all other\nsounds.  Embedded in the jagged roof far overhead are myriad twisted\nformations composed of pure white alabaster, which scatter the murky\nlight into sinister apparitions upon the walls.  To one side is a deep\ngorge, filled with a bizarre chaos of tortured rock which seems to\nhave been crafted by the devil himself.  An immense river of fire\ncrashes out from the depths of the volcano, burns its way through the\ngorge, and plummets into a bottomless pit far off to your left.  To\nthe right, an immense geyser of blistering steam erupts continuously\nfrom a barren island in the center of a sulfurous lake, which bubbles\nominously.  The far right wall is aflame with an incandescence of its\nown, which lends an additional infernal splendor to the already\nhellish scene.  A dark, foreboding passage exits to the south.",
    "descriptionWithoutItems": "You are on the edge of a breath-taking view.  Far below you is an\nactive volcano, from which great gouts of molten lava come surging\nout, cascading back down into the depths.  The glowing rock fills the\nfarthest reaches of the cavern with a blood-red glare, giving every-\nthing an eerie, macabre appearance.  The air is filled with flickering\nsparks of ash and a heavy smell of brimstone.  The walls are hot to\nthe touch, and the thundering of the volcano drowns out all other\nsounds.  Embedded in the jagged roof far overhead are myriad twisted\nformations composed of pure white alabaster, which scatter the murky\nlight into sinister apparitions upon the walls.  To one side is a deep\ngorge, filled with a bizarre chaos of tortured rock which seems to\nhave been crafted by the devil himself.  An immense river of fire\ncrashes out from the depths of the volcano, burns its way through the\ngorge, and plummets into a bottomless pit far off to your left.  To\nthe right, an immense geyser of blistering steam erupts continuously\nfrom a barren island in the center of a sulfurous lake, which bubbles\nominously.  The far right wall is aflame with an incandescence of its\nown, which lends an additional infernal splendor to the already\nhellish scene.  A dark, foreboding passage exits to the south.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "warmwalls"
      },
      {
        "id": "go_passage",
        "label": "PASSAGE",
        "type": "move",
        "to": "warmwalls"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "warmwalls"
      },
      {
        "id": "go_fork",
        "label": "FORK",
        "type": "move",
        "to": "fork"
      },
      {
        "id": "say_ridiculous_attempt_down",
        "label": "Down",
        "type": "event",
        "message": "Don't be ridiculous!",
        "uiHint": "hidden"
      },
      {
        "id": "go_jump",
        "label": "JUMP",
        "type": "move",
        "to": "gruesome"
      }
    ]
  },
  "boulders2": {
    "id": "boulders2",
    "title": "Chamber Of Boulders",
    "description": "You are in a small chamber filled with large boulders.  The walls are\nvery warm, causing the air in the room to be almost stifling from the\nheat.  The only exit is a crawl heading west, through which is coming\na low rumbling.",
    "descriptionWithoutItems": "You are in a small chamber filled with large boulders.  The walls are\nvery warm, causing the air in the room to be almost stifling from the\nheat.  The only exit is a crawl heading west, through which is coming\na low rumbling.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "warmwalls"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "warmwalls"
      },
      {
        "id": "go_crawl",
        "label": "CRAWL",
        "type": "move",
        "to": "warmwalls"
      },
      {
        "id": "go_fork",
        "label": "FORK",
        "type": "move",
        "to": "fork"
      },
      {
        "id": "go_view",
        "label": "VIEW",
        "type": "move",
        "to": "breathtaking"
      },
      {
        "id": "take_obj_63",
        "label": "TAKE RARE SPICES",
        "type": "event",
        "addsItem": "obj_63",
        "removesAction": true
      }
    ],
    "items": [
      "obj_63"
    ],
    "itemDescriptions": {
      "obj_63": "There are rare spices here!"
    }
  },
  "limestone": {
    "id": "limestone",
    "title": "Limestone Passage",
    "description": "You are walking along a gently sloping north/south passage lined with\noddly shaped limestone formations.",
    "descriptionWithoutItems": "You are walking along a gently sloping north/south passage lined with\noddly shaped limestone formations.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "fork"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "fork"
      },
      {
        "id": "go_fork",
        "label": "FORK",
        "type": "move",
        "to": "fork"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "barrenfront"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "barrenfront"
      },
      {
        "id": "go_barre",
        "label": "Barre",
        "type": "move",
        "to": "barrenfront"
      },
      {
        "id": "go_view",
        "label": "VIEW",
        "type": "move",
        "to": "breathtaking"
      }
    ]
  },
  "barrenfront": {
    "id": "barrenfront",
    "title": "Front Of Barren Room",
    "description": "You are standing at the entrance to a large, barren room.  A notice\nabove the entrance reads:  \"Caution!  Bear in room!\"",
    "descriptionWithoutItems": "You are standing at the entrance to a large, barren room.  A notice\nabove the entrance reads:  \"Caution!  Bear in room!\"",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "limestone"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "limestone"
      },
      {
        "id": "go_fork",
        "label": "FORK",
        "type": "move",
        "to": "fork"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "barrenroom"
      },
      {
        "id": "go_in",
        "label": "GO IN",
        "type": "move",
        "to": "barrenroom"
      },
      {
        "id": "go_barre",
        "label": "Barre",
        "type": "move",
        "to": "barrenroom"
      },
      {
        "id": "go_enter",
        "label": "ENTER",
        "type": "move",
        "to": "barrenroom"
      },
      {
        "id": "go_view",
        "label": "VIEW",
        "type": "move",
        "to": "breathtaking"
      }
    ]
  },
  "barrenroom": {
    "id": "barrenroom",
    "title": "Barren Room",
    "description": "You are inside a barren room.  The center of the room is completely\nempty except for some dust.  Marks in the dust lead away toward the\nfar end of the room.  The only exit is the way you came in.",
    "descriptionWithoutItems": "You are inside a barren room.  The center of the room is completely\nempty except for some dust.  Marks in the dust lead away toward the\nfar end of the room.  The only exit is the way you came in.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "barrenfront"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "barrenfront"
      },
      {
        "id": "go_fork",
        "label": "FORK",
        "type": "move",
        "to": "fork"
      },
      {
        "id": "go_view",
        "label": "VIEW",
        "type": "move",
        "to": "breathtaking"
      }
    ]
  },
  "different3": {
    "id": "different3",
    "title": "Different3",
    "description": "You are in a maze of twisting little passages, all different.",
    "descriptionWithoutItems": "You are in a maze of twisting little passages, all different.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "different1"
      },
      {
        "id": "go_se",
        "label": "GO SOUTHEAST",
        "type": "move",
        "to": "different4"
      },
      {
        "id": "go_nw",
        "label": "GO NORTHWEST",
        "type": "move",
        "to": "different5"
      },
      {
        "id": "go_sw",
        "label": "GO SOUTHWEST",
        "type": "move",
        "to": "different6"
      },
      {
        "id": "go_ne",
        "label": "GO NORTHEAST",
        "type": "move",
        "to": "different7"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "different8"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "different9"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "different10"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "different11"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "different2"
      }
    ]
  },
  "different4": {
    "id": "different4",
    "title": "Different4",
    "description": "You are in a little maze of twisty passages, all different.",
    "descriptionWithoutItems": "You are in a little maze of twisty passages, all different.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_nw",
        "label": "GO NORTHWEST",
        "type": "move",
        "to": "different1"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "different3"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "different5"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "different6"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "different7"
      },
      {
        "id": "go_sw",
        "label": "GO SOUTHWEST",
        "type": "move",
        "to": "different8"
      },
      {
        "id": "go_ne",
        "label": "GO NORTHEAST",
        "type": "move",
        "to": "different9"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "different10"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "different11"
      },
      {
        "id": "go_se",
        "label": "GO SOUTHEAST",
        "type": "move",
        "to": "different2"
      }
    ]
  },
  "different5": {
    "id": "different5",
    "title": "Different5",
    "description": "You are in a twisting maze of little passages, all different.",
    "descriptionWithoutItems": "You are in a twisting maze of little passages, all different.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "different1"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "different3"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "different4"
      },
      {
        "id": "go_ne",
        "label": "GO NORTHEAST",
        "type": "move",
        "to": "different6"
      },
      {
        "id": "go_sw",
        "label": "GO SOUTHWEST",
        "type": "move",
        "to": "different7"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "different8"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "different9"
      },
      {
        "id": "go_nw",
        "label": "GO NORTHWEST",
        "type": "move",
        "to": "different10"
      },
      {
        "id": "go_se",
        "label": "GO SOUTHEAST",
        "type": "move",
        "to": "different11"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "different2"
      }
    ]
  },
  "different6": {
    "id": "different6",
    "title": "Different6",
    "description": "You are in a twisting little maze of passages, all different.",
    "descriptionWithoutItems": "You are in a twisting little maze of passages, all different.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_ne",
        "label": "GO NORTHEAST",
        "type": "move",
        "to": "different1"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "different3"
      },
      {
        "id": "go_nw",
        "label": "GO NORTHWEST",
        "type": "move",
        "to": "different4"
      },
      {
        "id": "go_se",
        "label": "GO SOUTHEAST",
        "type": "move",
        "to": "different5"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "different7"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "different8"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "different9"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "different10"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "different11"
      },
      {
        "id": "go_sw",
        "label": "GO SOUTHWEST",
        "type": "move",
        "to": "different2"
      }
    ]
  },
  "different7": {
    "id": "different7",
    "title": "Different7",
    "description": "You are in a twisty little maze of passages, all different.",
    "descriptionWithoutItems": "You are in a twisty little maze of passages, all different.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "different1"
      },
      {
        "id": "go_se",
        "label": "GO SOUTHEAST",
        "type": "move",
        "to": "different3"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "different4"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "different5"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "different6"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "different8"
      },
      {
        "id": "go_sw",
        "label": "GO SOUTHWEST",
        "type": "move",
        "to": "different9"
      },
      {
        "id": "go_ne",
        "label": "GO NORTHEAST",
        "type": "move",
        "to": "different10"
      },
      {
        "id": "go_nw",
        "label": "GO NORTHWEST",
        "type": "move",
        "to": "different11"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "different2"
      }
    ]
  },
  "different8": {
    "id": "different8",
    "title": "Different8",
    "description": "You are in a twisty maze of little passages, all different.",
    "descriptionWithoutItems": "You are in a twisty maze of little passages, all different.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "different1"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "different3"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "different4"
      },
      {
        "id": "go_sw",
        "label": "GO SOUTHWEST",
        "type": "move",
        "to": "different5"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "different6"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "different7"
      },
      {
        "id": "go_nw",
        "label": "GO NORTHWEST",
        "type": "move",
        "to": "different9"
      },
      {
        "id": "go_se",
        "label": "GO SOUTHEAST",
        "type": "move",
        "to": "different10"
      },
      {
        "id": "go_ne",
        "label": "GO NORTHEAST",
        "type": "move",
        "to": "different11"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "different2"
      }
    ]
  },
  "different9": {
    "id": "different9",
    "title": "Different9",
    "description": "You are in a little twisty maze of passages, all different.",
    "descriptionWithoutItems": "You are in a little twisty maze of passages, all different.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_se",
        "label": "GO SOUTHEAST",
        "type": "move",
        "to": "different1"
      },
      {
        "id": "go_ne",
        "label": "GO NORTHEAST",
        "type": "move",
        "to": "different3"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "different4"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "different5"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "different6"
      },
      {
        "id": "go_nw",
        "label": "GO NORTHWEST",
        "type": "move",
        "to": "different7"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "different8"
      },
      {
        "id": "go_sw",
        "label": "GO SOUTHWEST",
        "type": "move",
        "to": "different10"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "different11"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "different2"
      }
    ]
  },
  "different10": {
    "id": "different10",
    "title": "Different10",
    "description": "You are in a maze of little twisting passages, all different.",
    "descriptionWithoutItems": "You are in a maze of little twisting passages, all different.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "different1"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "different3"
      },
      {
        "id": "go_ne",
        "label": "GO NORTHEAST",
        "type": "move",
        "to": "different4"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "different5"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "different6"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "different7"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "different8"
      },
      {
        "id": "go_se",
        "label": "GO SOUTHEAST",
        "type": "move",
        "to": "different9"
      },
      {
        "id": "go_sw",
        "label": "GO SOUTHWEST",
        "type": "move",
        "to": "different11"
      },
      {
        "id": "go_nw",
        "label": "GO NORTHWEST",
        "type": "move",
        "to": "different2"
      }
    ]
  },
  "different11": {
    "id": "different11",
    "title": "Different11",
    "description": "You are in a maze of little twisty passages, all different.",
    "descriptionWithoutItems": "You are in a maze of little twisty passages, all different.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_sw",
        "label": "GO SOUTHWEST",
        "type": "move",
        "to": "different1"
      },
      {
        "id": "go_nw",
        "label": "GO NORTHWEST",
        "type": "move",
        "to": "different3"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "different4"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "different5"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "different6"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "different7"
      },
      {
        "id": "go_se",
        "label": "GO SOUTHEAST",
        "type": "move",
        "to": "different8"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "different9"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "different10"
      },
      {
        "id": "go_ne",
        "label": "GO NORTHEAST",
        "type": "move",
        "to": "different2"
      }
    ]
  },
  "deadend13": {
    "id": "deadend13",
    "title": "Deadend13",
    "description": "Dead end",
    "descriptionWithoutItems": "Dead end",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "different2"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "different2"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "roughhewn"
      }
    ]
  },
  "roughhewn": {
    "id": "roughhewn",
    "title": "Roughhewn",
    "description": "You are in a long, rough-hewn, north/south corridor.",
    "descriptionWithoutItems": "You are in a long, rough-hewn, north/south corridor.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "deadend13"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "large"
      }
    ]
  },
  "baddirection": {
    "id": "baddirection",
    "title": "Baddirection",
    "description": "There is no way to go that direction.",
    "descriptionWithoutItems": "There is no way to go that direction.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_default",
        "label": "CONTINUE",
        "type": "move",
        "to": "deadend13"
      }
    ]
  },
  "large": {
    "id": "large",
    "title": "Large",
    "description": "You are in a large chamber with passages to the west and north.",
    "descriptionWithoutItems": "You are in a large chamber with passages to the west and north.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "roughhewn"
      },
      {
        "id": "say_ogre_snarl_north",
        "label": "North",
        "type": "event",
        "message": "The ogre snarls and shoves you back.",
        "uiHint": "hidden"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "storeroom"
      }
    ]
  },
  "storeroom": {
    "id": "storeroom",
    "title": "Storeroom",
    "description": "You are in the ogre's storeroom.  The only exit is to the south.",
    "descriptionWithoutItems": "You are in the ogre's storeroom.  The only exit is to the south.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "large"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "large"
      },
      {
        "id": "take_ruby",
        "label": "TAKE FIST-SIZED RUBY",
        "type": "event",
        "addsItem": "ruby",
        "removesAction": true
      }
    ],
    "items": [
      "ruby"
    ],
    "itemDescriptions": {
      "ruby": "There is an enormous ruby here!"
    }
  },
  "forest1": {
    "id": "forest1",
    "title": "Forest1",
    "description": "You are wandering aimlessly through the forest.",
    "descriptionWithoutItems": "You are wandering aimlessly through the forest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "start"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest13"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "forest2"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "forest3"
      }
    ]
  },
  "forest2": {
    "id": "forest2",
    "title": "Forest2",
    "description": "You are wandering aimlessly through the forest.",
    "descriptionWithoutItems": "You are wandering aimlessly through the forest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "forest1"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest19"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "forest3"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "forest18"
      }
    ]
  },
  "forest3": {
    "id": "forest3",
    "title": "Forest3",
    "description": "You are wandering aimlessly through the forest.",
    "descriptionWithoutItems": "You are wandering aimlessly through the forest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "forest4"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest4"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "forest2"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "forest1"
      }
    ]
  },
  "forest4": {
    "id": "forest4",
    "title": "Forest4",
    "description": "You are wandering aimlessly through the forest.",
    "descriptionWithoutItems": "You are wandering aimlessly through the forest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "forest3"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "forest3"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest5"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "forest5"
      }
    ]
  },
  "forest5": {
    "id": "forest5",
    "title": "Forest5",
    "description": "You are wandering aimlessly through the forest.",
    "descriptionWithoutItems": "You are wandering aimlessly through the forest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "forest4"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "forest4"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest7"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "forest6"
      }
    ]
  },
  "forest6": {
    "id": "forest6",
    "title": "Forest6",
    "description": "You are wandering aimlessly through the forest.",
    "descriptionWithoutItems": "You are wandering aimlessly through the forest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "forest5"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest7"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "valley"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "slit"
      }
    ]
  },
  "forest7": {
    "id": "forest7",
    "title": "Forest7",
    "description": "You are wandering aimlessly through the forest.",
    "descriptionWithoutItems": "You are wandering aimlessly through the forest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "forest5"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest6"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "grate"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "forest8"
      }
    ]
  },
  "forest8": {
    "id": "forest8",
    "title": "Forest8",
    "description": "You are wandering aimlessly through the forest.",
    "descriptionWithoutItems": "You are wandering aimlessly through the forest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "forest9"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest11"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "forest22"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "forest7"
      }
    ]
  },
  "forest9": {
    "id": "forest9",
    "title": "Forest9",
    "description": "You are wandering aimlessly through the forest.",
    "descriptionWithoutItems": "You are wandering aimlessly through the forest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "forest11"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest8"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "forest10"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "grate"
      }
    ]
  },
  "forest10": {
    "id": "forest10",
    "title": "Forest10",
    "description": "You are wandering aimlessly through the forest.",
    "descriptionWithoutItems": "You are wandering aimlessly through the forest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "slit"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest11"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "forest9"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "grate"
      }
    ]
  },
  "forest11": {
    "id": "forest11",
    "title": "Forest11",
    "description": "You are wandering aimlessly through the forest.",
    "descriptionWithoutItems": "You are wandering aimlessly through the forest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "forest10"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest8"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "forest22"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "forest9"
      }
    ]
  },
  "forest12": {
    "id": "forest12",
    "title": "Forest12",
    "description": "You are wandering aimlessly through the forest.",
    "descriptionWithoutItems": "You are wandering aimlessly through the forest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "forest13"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest14"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "forest22"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "valley"
      }
    ]
  },
  "forest13": {
    "id": "forest13",
    "title": "Forest13",
    "description": "You are wandering aimlessly through the forest.",
    "descriptionWithoutItems": "You are wandering aimlessly through the forest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "forest1"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest12"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "forest20"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "hill"
      }
    ]
  },
  "forest14": {
    "id": "forest14",
    "title": "Forest14",
    "description": "You are wandering aimlessly through the forest.",
    "descriptionWithoutItems": "You are wandering aimlessly through the forest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "roadend"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest16"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "forest15"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "forest12"
      }
    ]
  },
  "forest15": {
    "id": "forest15",
    "title": "Forest15",
    "description": "You are wandering aimlessly through the forest.",
    "descriptionWithoutItems": "You are wandering aimlessly through the forest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "forest16"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest22"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "roadend"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "forest14"
      }
    ]
  },
  "forest16": {
    "id": "forest16",
    "title": "Forest16",
    "description": "You are wandering aimlessly through the forest.",
    "descriptionWithoutItems": "You are wandering aimlessly through the forest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "forest17"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "forest17"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest14"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "forest15"
      }
    ]
  },
  "forest17": {
    "id": "forest17",
    "title": "Forest17",
    "description": "You are wandering aimlessly through the forest.",
    "descriptionWithoutItems": "You are wandering aimlessly through the forest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "forest18"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest16"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "forest16"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "cliff"
      }
    ]
  },
  "forest18": {
    "id": "forest18",
    "title": "Forest18",
    "description": "You are wandering aimlessly through the forest.",
    "descriptionWithoutItems": "You are wandering aimlessly through the forest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "forest19"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest17"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "forest2"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "forest21"
      }
    ]
  },
  "forest19": {
    "id": "forest19",
    "title": "Forest19",
    "description": "You are wandering aimlessly through the forest.",
    "descriptionWithoutItems": "You are wandering aimlessly through the forest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "forest2"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest18"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "cliff"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "forest20"
      }
    ]
  },
  "forest20": {
    "id": "forest20",
    "title": "Forest20",
    "description": "You are wandering aimlessly through the forest.",
    "descriptionWithoutItems": "You are wandering aimlessly through the forest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "hill"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest21"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "forest19"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "forest13"
      }
    ]
  },
  "forest21": {
    "id": "forest21",
    "title": "Forest21",
    "description": "You are wandering aimlessly through the forest.",
    "descriptionWithoutItems": "You are wandering aimlessly through the forest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "forest20"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "roadend"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "forest18"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "forest21"
      }
    ]
  },
  "forest22": {
    "id": "forest22",
    "title": "Forest22",
    "description": "You are wandering aimlessly through the forest.",
    "descriptionWithoutItems": "You are wandering aimlessly through the forest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_east",
        "label": "GO EAST",
        "type": "move",
        "to": "forest8"
      },
      {
        "id": "go_west",
        "label": "GO WEST",
        "type": "move",
        "to": "forest11"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "forest15"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "forest12"
      },
      {
        "id": "take_rabbitfoot",
        "label": "TAKE LEPORINE APPENDAGE",
        "type": "event",
        "addsItem": "rabbitfoot",
        "removesAction": true
      }
    ],
    "items": [
      "rabbitfoot"
    ],
    "itemDescriptions": {
      "rabbitfoot": "Your keen eye spots a severed leporine appendage lying on the ground."
    }
  },
  "ledge": {
    "id": "ledge",
    "title": "Ledge",
    "description": "You are on a small ledge on one face of a sheer cliff.  There are no\npaths away from the ledge.  Across the chasm is a small clearing\nsurrounded by forest.",
    "descriptionWithoutItems": "You are on a small ledge on one face of a sheer cliff.  There are no\npaths away from the ledge.  Across the chasm is a small clearing\nsurrounded by forest.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_jump",
        "label": "JUMP",
        "type": "move",
        "to": "nomake"
      },
      {
        "id": "take_sapph",
        "label": "TAKE STAR SAPPHIRE",
        "type": "event",
        "addsItem": "sapph",
        "removesAction": true
      }
    ],
    "items": [
      "sapph"
    ],
    "itemDescriptions": {
      "sapph": "A brilliant blue star sapphire is here!"
    }
  },
  "resbottom": {
    "id": "resbottom",
    "title": "Bottom Of Reservoir",
    "description": "You are walking across the bottom of the reservoir.  Walls of water\nrear up on either side.  The roar of the water cascading past is\nnearly deafening, and the mist is so thick you can barely see.",
    "descriptionWithoutItems": "You are walking across the bottom of the reservoir.  Walls of water\nrear up on either side.  The roar of the water cascading past is\nnearly deafening, and the mist is so thick you can barely see.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_north",
        "label": "GO NORTH",
        "type": "move",
        "to": "resnorth"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "reservoir"
      }
    ]
  },
  "resnorth": {
    "id": "resnorth",
    "title": "North Of Reservoir",
    "description": "You are at the northern edge of the reservoir.  A northwest passage\nleads sharply up from here.",
    "descriptionWithoutItems": "You are at the northern edge of the reservoir.  A northwest passage\nleads sharply up from here.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "say_bad_direction_south",
        "label": "South",
        "type": "event",
        "message": "There is no way to go that direction.",
        "uiHint": "hidden"
      },
      {
        "id": "say_bad_direction_acros",
        "label": "Acros",
        "type": "event",
        "message": "There is no way to go that direction.",
        "uiHint": "hidden"
      },
      {
        "id": "say_bad_direction_cross",
        "label": "Cross",
        "type": "event",
        "message": "There is no way to go that direction.",
        "uiHint": "hidden"
      },
      {
        "id": "go_south",
        "label": "GO SOUTH",
        "type": "move",
        "to": "resbottom"
      },
      {
        "id": "go_nw",
        "label": "GO NORTHWEST",
        "type": "move",
        "to": "treacherous"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "treacherous"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "treacherous"
      }
    ]
  },
  "treacherous": {
    "id": "treacherous",
    "title": "Treacherous",
    "description": "You are scrambling along a treacherously steep, rocky passage.",
    "descriptionWithoutItems": "You are scrambling along a treacherously steep, rocky passage.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "steep"
      },
      {
        "id": "go_nw",
        "label": "GO NORTHWEST",
        "type": "move",
        "to": "steep"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "resnorth"
      },
      {
        "id": "go_se",
        "label": "GO SOUTHEAST",
        "type": "move",
        "to": "resnorth"
      }
    ]
  },
  "steep": {
    "id": "steep",
    "title": "Steep",
    "description": "You are on a very steep incline, which widens at it goes upward.",
    "descriptionWithoutItems": "You are on a very steep incline, which widens at it goes upward.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "treacherous"
      },
      {
        "id": "go_se",
        "label": "GO SOUTHEAST",
        "type": "move",
        "to": "treacherous"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "cliffbase"
      },
      {
        "id": "go_nw",
        "label": "GO NORTHWEST",
        "type": "move",
        "to": "cliffbase"
      }
    ]
  },
  "cliffbase": {
    "id": "cliffbase",
    "title": "Base Of Cliff",
    "description": "You are at the base of a nearly vertical cliff.  There are some\nslim footholds which would enable you to climb up, but it looks\nextremely dangerous.  Here at the base of the cliff lie the remains\nof several earlier adventurers who apparently failed to make it.",
    "descriptionWithoutItems": "You are at the base of a nearly vertical cliff.  There are some\nslim footholds which would enable you to climb up, but it looks\nextremely dangerous.  Here at the base of the cliff lie the remains\nof several earlier adventurers who apparently failed to make it.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "steep"
      },
      {
        "id": "go_se",
        "label": "GO SOUTHEAST",
        "type": "move",
        "to": "steep"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "clifface"
      },
      {
        "id": "go_climb",
        "label": "CLIMB",
        "type": "move",
        "to": "clifface"
      }
    ]
  },
  "clifface": {
    "id": "clifface",
    "title": "Clifface",
    "description": "You are climbing along a nearly vertical cliff.",
    "descriptionWithoutItems": "You are climbing along a nearly vertical cliff.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "cliffbase"
      },
      {
        "id": "go_up",
        "label": "GO UP",
        "type": "move",
        "to": "clifftop"
      }
    ]
  },
  "footslip": {
    "id": "footslip",
    "title": "Footslip",
    "description": "Just as you reach the top, your foot slips on a loose rock and you\ntumble several hundred feet to join the other unlucky adventurers.",
    "descriptionWithoutItems": "Just as you reach the top, your foot slips on a loose rock and you\ntumble several hundred feet to join the other unlucky adventurers.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_default",
        "label": "CONTINUE",
        "type": "move",
        "to": "nowhere"
      }
    ]
  },
  "clifftop": {
    "id": "clifftop",
    "title": "Clifftop",
    "description": "Just as you reach the top, your foot slips on a loose rock and you\nmake one last desperate grab.  Your luck holds, as does your grip.\nWith an enormous heave, you lift yourself to the ledge above.",
    "descriptionWithoutItems": "Just as you reach the top, your foot slips on a loose rock and you\nmake one last desperate grab.  Your luck holds, as does your grip.\nWith an enormous heave, you lift yourself to the ledge above.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_default",
        "label": "CONTINUE",
        "type": "move",
        "to": "cliffledge"
      }
    ]
  },
  "cliffledge": {
    "id": "cliffledge",
    "title": "Top Of Cliff",
    "description": "You are on a small ledge at the top of a nearly vertical cliff.\nThere is a low crawl leading off to the northeast.",
    "descriptionWithoutItems": "You are on a small ledge at the top of a nearly vertical cliff.\nThere is a low crawl leading off to the northeast.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_climb",
        "label": "CLIMB",
        "type": "move",
        "to": "clifface"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "clifface"
      },
      {
        "id": "go_ne",
        "label": "GO NORTHEAST",
        "type": "move",
        "to": "reachdead"
      },
      {
        "id": "go_crawl",
        "label": "CRAWL",
        "type": "move",
        "to": "reachdead"
      }
    ]
  },
  "reachdead": {
    "id": "reachdead",
    "title": "Reachdead",
    "description": "You have reached a dead end.",
    "descriptionWithoutItems": "You have reached a dead end.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_sw",
        "label": "GO SOUTHWEST",
        "type": "move",
        "to": "cliffledge"
      },
      {
        "id": "go_out",
        "label": "GO OUT",
        "type": "move",
        "to": "cliffledge"
      },
      {
        "id": "go_crawl",
        "label": "CRAWL",
        "type": "move",
        "to": "cliffledge"
      },
      {
        "id": "take_obj_69",
        "label": "TAKE EBONY STATUETTE",
        "type": "event",
        "addsItem": "obj_69",
        "removesAction": true
      }
    ],
    "items": [
      "obj_69"
    ],
    "itemDescriptions": {
      "obj_69": "There is a richly-carved ebony statuette here!"
    }
  },
  "gruesome": {
    "id": "gruesome",
    "title": "Gruesome",
    "description": "There is now one more gruesome aspect to the spectacular vista.",
    "descriptionWithoutItems": "There is now one more gruesome aspect to the spectacular vista.",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_default",
        "label": "CONTINUE",
        "type": "move",
        "to": "nowhere"
      }
    ]
  },
  "foof1": {
    "id": "foof1",
    "title": "Foof1",
    "description": ">>Foof!<<",
    "descriptionWithoutItems": ">>Foof!<<",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_default",
        "label": "CONTINUE",
        "type": "move",
        "to": "debris"
      }
    ]
  },
  "foof2": {
    "id": "foof2",
    "title": "Foof2",
    "description": ">>Foof!<<",
    "descriptionWithoutItems": ">>Foof!<<",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_default",
        "label": "CONTINUE",
        "type": "move",
        "to": "building"
      }
    ]
  },
  "foof3": {
    "id": "foof3",
    "title": "Foof3",
    "description": ">>Foof!<<",
    "descriptionWithoutItems": ">>Foof!<<",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_default",
        "label": "CONTINUE",
        "type": "move",
        "to": "y2"
      }
    ]
  },
  "foof4": {
    "id": "foof4",
    "title": "Foof4",
    "description": ">>Foof!<<",
    "descriptionWithoutItems": ">>Foof!<<",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_default",
        "label": "CONTINUE",
        "type": "move",
        "to": "building"
      }
    ]
  },
  "foof5": {
    "id": "foof5",
    "title": "Foof5",
    "description": ">>Foof!<<",
    "descriptionWithoutItems": ">>Foof!<<",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_default",
        "label": "CONTINUE",
        "type": "move",
        "to": "plover"
      }
    ]
  },
  "foof6": {
    "id": "foof6",
    "title": "Foof6",
    "description": ">>Foof!<<",
    "descriptionWithoutItems": ">>Foof!<<",
    "actions": [
      {
        "id": "look",
        "label": "LOOK AROUND",
        "type": "command",
        "command": "look"
      },
      {
        "id": "go_default",
        "label": "CONTINUE",
        "type": "move",
        "to": "y2"
      }
    ]
  }
};
