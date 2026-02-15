// AUTO-GENERATED FROM adventure.yaml - DO NOT EDIT
// Generated: 2026-02-15T19:19:01.103Z
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

export const HINTS: HintEntry[] = [
  {
    "number": 1,
    "name": "CAVE",
    "turns": 4,
    "penalty": 2,
    "question": "Are you trying to get into the cave?",
    "hint": "The grate is very solid and has a hardened steel lock. You cannot enter without a key, and there are no keys nearby. I would recommend looking elsewhere for the keys."
  },
  {
    "number": 2,
    "name": "BIRD",
    "turns": 5,
    "penalty": 2,
    "question": "Are you trying to catch the bird?",
    "hint": "Something about you seems to be frightening the bird. Perhaps you might figure out what it is."
  },
  {
    "number": 3,
    "name": "SNAKE",
    "turns": 8,
    "penalty": 2,
    "question": "Are you trying to somehow deal with the snake?",
    "hint": "You can't kill the snake, or drive it away, or avoid it, or anything like that. There is a way to get by, but you don't have the necessary resources right now."
  },
  {
    "number": 4,
    "name": "MAZE",
    "turns": 75,
    "penalty": 4,
    "question": "Do you need help getting out of the maze?",
    "hint": "You can make the passages look less alike by dropping things."
  },
  {
    "number": 5,
    "name": "DARK",
    "turns": 25,
    "penalty": 5,
    "question": "Are you trying to explore beyond the plover room?",
    "hint": "There is a way to explore that region without having to worry about falling into a pit. None of the objects available is immediately useful in discovering the secret."
  },
  {
    "number": 6,
    "name": "WITT",
    "turns": 20,
    "penalty": 3,
    "question": "Do you need help getting out of here?",
    "hint": "Don't go west.\\n"
  },
  {
    "number": 7,
    "name": "CLIFF",
    "turns": 8,
    "penalty": 2,
    "question": "Are you wondering what to do here?",
    "hint": "This section is quite advanced. Find the cave first.\\n"
  },
  {
    "number": 8,
    "name": "WOODS",
    "turns": 25,
    "penalty": 2,
    "question": "Would you like to be shown out of the forest?",
    "hint": "Go east ten times. If that doesn't get you out, then go south, then west twice, then south."
  },
  {
    "number": 9,
    "name": "OGRE",
    "turns": 10,
    "penalty": 4,
    "question": "Do you need help dealing with the ogre?",
    "hint": "There is nothing the presence of which will prevent you from defeating him; thus it can't hurt to fetch everything you possibly can."
  },
  {
    "number": 10,
    "name": "JADE",
    "turns": 1,
    "penalty": 4,
    "question": "You're missing only one other treasure. Do you need help finding it?",
    "hint": "Once you've found all the other treasures, it is no longer possible to locate the one you're now missing."
  }
];

export const OBITUARIES: ObituaryEntry[] = [
  {
    "query": "Oh dear, you seem to have gotten yourself killed. I might be able to help you out, but I've never really done this before. Do you want me to try to reincarnate you?",
    "yesResponse": "All right. But don't blame me if something goes wr...... --- POOF!! --- You are engulfed in a cloud of orange smoke. Coughing and gasping, you emerge from the smoke and find...."
  },
  {
    "query": "You clumsy oaf, you've done it again! I don't know how long I can keep this up. Do you want me to try reincarnating you again?",
    "yesResponse": "Okay, now where did I put my orange smoke?.... >POOF!< Everything disappears in a dense cloud of orange smoke."
  },
  {
    "query": "Now you've really done it! I'm out of orange smoke! You don't expect me to do a decent reincarnation without any orange smoke, do you?",
    "yesResponse": "Okay, if you're so smart, do it yourself! I'm leaving!"
  }
];

export const TURN_THRESHOLDS: TurnThresholdEntry[] = [
  {
    "threshold": 350,
    "pointLoss": 2,
    "message": "Tsk! A wizard wouldn't have to take 350 turns. This is going to cost you a couple of points."
  },
  {
    "threshold": 500,
    "pointLoss": 3,
    "message": "500 turns? That's another few points you've lost."
  },
  {
    "threshold": 1000,
    "pointLoss": 5,
    "message": "Are you still at it? Five points off for exceeding 1000 turns!"
  },
  {
    "threshold": 2500,
    "pointLoss": 10,
    "message": "Good grief, don't you *EVER* give up? Do you realize you've spent over 2500 turns at this? That's another ten points off, a total of twenty points lost for taking so long."
  }
];

export const LAMP_MESSAGES: Record<string, string> = {
  "PITCH_DARK": "It is now pitch dark. If you proceed you will likely fall into a pit.",
  "LAMP_DIM": "Your lamp is getting dim. You'd best start wrapping this up, unless you can find some fresh batteries. I seem to recall there's a vending machine in the maze. Bring some coins with you.",
  "LAMP_OUT": "Your lamp has run out of power.",
  "GET_BATTERIES": "Your lamp is getting dim. You'd best go back for those batteries.",
  "REPLACE_BATTERIES": "Your lamp is getting dim. I'm taking the liberty of replacing the batteries.",
  "MISSING_BATTERIES": "Your lamp is getting dim, and you're out of spare batteries. You'd best start wrapping this up.",
  "LAMP_OFF": "Your lamp is now off.",
  "LAMP_ON": "Your lamp is now on."
};

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
    "description": {
      "long": "You are standing at the end of a road before a small brick building. Around you is a forest. A small stream flows out of the building and down a gully.",
      "short": "You're in front of building."
    },
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
    ],
    "sound": "STREAM_GURGLES",
    "conditions": {
      "FLUID": true,
      "ABOVE": true,
      "LIT": true
    }
  },
  "hill": {
    "id": "hill",
    "title": "Hill In Road",
    "description": {
      "long": "You have walked up a hill, still in the forest. The road slopes back down the other side of the hill. There is a building in the distance.",
      "short": "You're at hill in road."
    },
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
    ],
    "conditions": {
      "ABOVE": true,
      "LIT": true
    }
  },
  "building": {
    "id": "building",
    "title": "Building",
    "description": {
      "long": "You are inside a building, a well house for a large spring.",
      "short": "You're inside building."
    },
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
    },
    "sound": "STREAM_GURGLES",
    "conditions": {
      "FLUID": true,
      "ABOVE": true,
      "LIT": true
    }
  },
  "valley": {
    "id": "valley",
    "title": "Valley",
    "description": {
      "long": "You are in a valley in the forest beside a stream tumbling along a rocky bed.",
      "short": "You're in valley."
    },
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
    ],
    "sound": "STREAM_GURGLES",
    "conditions": {
      "FLUID": true,
      "ABOVE": true,
      "LIT": true
    }
  },
  "roadend": {
    "id": "roadend",
    "title": "End Of Road",
    "description": {
      "long": "The road, which approaches from the east, ends here amid the trees.",
      "short": "You're at end of road."
    },
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
    ],
    "conditions": {
      "ABOVE": true,
      "LIT": true
    }
  },
  "cliff": {
    "id": "cliff",
    "title": "Cliff",
    "description": {
      "long": "The forest thins out here to reveal a steep cliff. There is no way down, but a small ledge can be seen to the west across the chasm.",
      "short": "You're at cliff."
    },
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
    ],
    "conditions": {
      "ABOVE": true,
      "NOBACK": true,
      "LIT": true
    },
    "hints": [
      7
    ]
  },
  "slit": {
    "id": "slit",
    "title": "Slit In Streambed",
    "description": {
      "long": "At your feet all the water of the stream splashes into a 2-inch slit in the rock. Downstream the streambed is bare rock.",
      "short": "You're at slit in streambed."
    },
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
    ],
    "sound": "STREAM_GURGLES",
    "conditions": {
      "FLUID": true,
      "ABOVE": true,
      "LIT": true
    }
  },
  "grate": {
    "id": "grate",
    "title": "Grate",
    "description": {
      "long": "You are in a 20-foot depression floored with bare dirt. Set into the dirt is a strong steel grate mounted in concrete. A dry streambed leads into the depression.",
      "short": "You're outside grate."
    },
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
    ],
    "conditions": {
      "ABOVE": true,
      "LIT": true
    },
    "hints": [
      1,
      10
    ]
  },
  "belowgrate": {
    "id": "belowgrate",
    "title": "Below The Grate",
    "description": {
      "long": "You are in a small chamber beneath a 3x3 steel grate to the surface. A low crawl over cobbles leads inward to the west.",
      "short": "You're below the grate."
    },
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
    ],
    "conditions": {
      "LIT": true
    }
  },
  "cobble": {
    "id": "cobble",
    "title": "Cobble Crawl",
    "description": {
      "long": "You are crawling over cobbles in a low passage. There is a dim light at the east end of the passage.",
      "short": "You're in cobble crawl."
    },
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
    },
    "conditions": {
      "LIT": true
    }
  },
  "debris": {
    "id": "debris",
    "title": "Debris Room",
    "description": {
      "long": "You are in a debris room filled with stuff washed in from the surface. A low wide passage with cobbles becomes plugged with mud and debris here, but an awkward canyon leads upward and west. In the mud someone has scrawled, \"MAGIC WORD XYZZY\".",
      "short": "You're in debris room."
    },
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
    "description": {
      "long": "You are in an awkward sloping east/west canyon.",
      "short": "You are in an awkward sloping east/west canyon.",
      "maptag": "Awkward canyon."
    },
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
    "description": {
      "long": "You are in a splendid chamber thirty feet high. The walls are frozen rivers of orange stone. An awkward canyon and a good passage exit from east and west sides of the chamber.",
      "short": "You're in bird chamber."
    },
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
    },
    "hints": [
      2
    ]
  },
  "pittop": {
    "id": "pittop",
    "title": "Top Of Small Pit",
    "description": {
      "long": "At your feet is a small pit breathing traces of white mist. An east passage ends here except for a small crack leading on.",
      "short": "You're at top of small pit."
    },
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
    "description": {
      "long": "You are at one end of a vast hall stretching forward out of sight to the west. There are openings to either side. Nearby, a wide stone staircase leads downward. The hall is filled with wisps of white mist swaying to and fro almost as if alive. A cold wind blows up the staircase. There is a passage at the top of a dome behind you.",
      "short": "You're in Hall of Mists."
    },
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
    ],
    "sound": "WIND_WHISTLES",
    "conditions": {
      "DEEP": true
    },
    "hints": [
      10
    ]
  },
  "crack": {
    "id": "crack",
    "title": "Crack",
    "description": {
      "long": "The crack is far too small for you to follow. At its widest it is barely wide enough to admit your foot.",
      "short": "The crack is far too small for you to follow. At its widest it is barely wide enough to admit your foot."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "eastbank": {
    "id": "eastbank",
    "title": "East Bank Of Fissure",
    "description": {
      "long": "You are on the east bank of a fissure slicing clear across the hall. The mist is quite thick here, and the fissure is too wide to jump.",
      "short": "You're on east bank of fissure."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "nugget": {
    "id": "nugget",
    "title": "Nugget-of-gold Room",
    "description": {
      "long": "This is a low room with a crude note on the wall. The note says, \"You won't get it up the steps\".",
      "short": "You're in nugget-of-gold room."
    },
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
    },
    "conditions": {
      "DEEP": true
    }
  },
  "kinghall": {
    "id": "kinghall",
    "title": "Hall Of Mt King",
    "description": {
      "long": "You are in the Hall of the Mountain King, with passages off in all directions.",
      "short": "You're in Hall of Mt King."
    },
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
    ],
    "conditions": {
      "DEEP": true
    },
    "hints": [
      3
    ]
  },
  "neckbroke": {
    "id": "neckbroke",
    "title": "Neckbroke",
    "description": {
      "long": "You are at the bottom of the pit with a broken neck.",
      "short": "You are at the bottom of the pit with a broken neck.",
      "maptag": "Pit bottom"
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "nomake": {
    "id": "nomake",
    "title": "Nomake",
    "description": {
      "long": "You didn't make it.",
      "short": "You didn't make it."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "dome": {
    "id": "dome",
    "title": "Dome",
    "description": {
      "long": "The dome is unclimbable.",
      "short": "The dome is unclimbable."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "westend": {
    "id": "westend",
    "title": "West End Of Twopit Room",
    "description": {
      "long": "You are at the west end of the Twopit Room. There is a large hole in the wall above the pit at this end of the room.",
      "short": "You're at west end of Twopit Room."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "eastpit": {
    "id": "eastpit",
    "title": "East Pit",
    "description": {
      "long": "You are at the bottom of the eastern pit in the Twopit Room. There is a small pool of oil in one corner of the pit.",
      "short": "You're in east pit."
    },
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
    ],
    "conditions": {
      "FLUID": true,
      "DEEP": true,
      "OILY": true
    }
  },
  "westpit": {
    "id": "westpit",
    "title": "West Pit",
    "description": {
      "long": "You are at the bottom of the western pit in the Twopit Room. There is a large hole in the wall about 25 feet above you.",
      "short": "You're in west pit."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "climbstalk": {
    "id": "climbstalk",
    "title": "Climbstalk",
    "description": {
      "long": "You clamber up the plant and scurry through the hole at the top.",
      "short": "You clamber up the plant and scurry through the hole at the top."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "westbank": {
    "id": "westbank",
    "title": "West Bank Of Fissure",
    "description": {
      "long": "You are on the west side of the fissure in the Hall of Mists.",
      "short": "You're on west bank of fissure."
    },
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
    },
    "conditions": {
      "DEEP": true
    }
  },
  "floorhole": {
    "id": "floorhole",
    "title": "N/s Passage Above E/w Passage",
    "description": {
      "long": "You are in a low n/s passage at a hole in the floor. The hole goes down to an e/w passage.",
      "short": "You're in n/s passage above e/w passage.",
      "maptag": "Floor hole."
    },
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
    },
    "conditions": {
      "DEEP": true
    }
  },
  "southside": {
    "id": "southside",
    "title": "Southside",
    "description": {
      "long": "You are in the south side chamber.",
      "short": "You are in the south side chamber."
    },
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
    },
    "conditions": {
      "DEEP": true
    }
  },
  "westside": {
    "id": "westside",
    "title": "The West Side Chamber",
    "description": {
      "long": "You are in the west side chamber of the Hall of the Mountain King. A passage continues west and up here.",
      "short": "You're in the west side chamber."
    },
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
    },
    "conditions": {
      "DEEP": true
    }
  },
  "snakeblock": {
    "id": "snakeblock",
    "title": "Snakeblock",
    "description": {
      "long": "You can't get by the snake.",
      "short": "You can't get by the snake."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "y2": {
    "id": "y2",
    "title": "\"y2\"",
    "description": {
      "long": "You are in a large room, with a passage to the south, a passage to the west, and a wall of broken rock to the east. There is a large \"Y2\" on a rock in the room's center.",
      "short": "You're at \"Y2\".",
      "maptag": "Y2."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "jumble": {
    "id": "jumble",
    "title": "Jumble",
    "description": {
      "long": "You are in a jumble of rock, with cracks everywhere.",
      "short": "You are in a jumble of rock, with cracks everywhere.",
      "maptag": "Rock jumble"
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "window1": {
    "id": "window1",
    "title": "Window On Pit",
    "description": {
      "long": "You're at a low window overlooking a huge pit, which extends up out of sight. A floor is indistinctly visible over 50 feet below. Traces of white mist cover the floor of the pit, becoming thicker to the right. Marks in the dust around the window would seem to indicate that someone has been here recently. Directly across the pit from you and 25 feet away there is a similar window looking into a lighted room. A shadowy figure can be seen there peering back at you.",
      "short": "You're at window on pit."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "broken": {
    "id": "broken",
    "title": "Dirty Passage",
    "description": {
      "long": "You are in a dirty broken passage. To the east is a crawl. To the west is a large passage. Above you is a hole to another passage.",
      "short": "You're in dirty passage."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "smallpitbrink": {
    "id": "smallpitbrink",
    "title": "Brink Of Small Pit",
    "description": {
      "long": "You are on the brink of a small clean climbable pit. A crawl leads west.",
      "short": "You're at brink of small pit."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "smallpit": {
    "id": "smallpit",
    "title": "Bottom Of Pit With Stream",
    "description": {
      "long": "You are in the bottom of a small pit with a little stream, which enters and exits through tiny slits.",
      "short": "You're at bottom of pit with stream.",
      "maptag": "Small pit bottom"
    },
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
    ],
    "sound": "STREAM_GURGLES",
    "conditions": {
      "FLUID": true,
      "DEEP": true
    }
  },
  "dusty": {
    "id": "dusty",
    "title": "Dusty Rock Room",
    "description": {
      "long": "You are in a large room full of dusty rocks. There is a big hole in the floor. There are cracks everywhere, and a passage leading east.",
      "short": "You're in dusty rock room."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "parallel1": {
    "id": "parallel1",
    "title": "Parallel1",
    "description": {
      "long": "You have crawled through a very low wide passage parallel to and north of the Hall of Mists.",
      "short": "You have crawled through a very low wide passage parallel to and north of the Hall of Mists."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "mistwest": {
    "id": "mistwest",
    "title": "West End Of Hall Of Mists",
    "description": {
      "long": "You are at the west end of the Hall of Mists. A low wide crawl continues west and another goes north. To the south is a little passage 6 feet off the floor.",
      "short": "You're at west end of Hall of Mists."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "alike1": {
    "id": "alike1",
    "title": "Alike1",
    "description": {
      "long": "You are in a maze of twisty little passages, all alike.",
      "short": "You are in a maze of twisty little passages, all alike.",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLALIKE": true
    },
    "hints": [
      4
    ]
  },
  "alike2": {
    "id": "alike2",
    "title": "Alike2",
    "description": {
      "long": "You are in a maze of twisty little passages, all alike.",
      "short": "You are in a maze of twisty little passages, all alike.",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLALIKE": true
    },
    "hints": [
      4
    ]
  },
  "alike3": {
    "id": "alike3",
    "title": "Alike3",
    "description": {
      "long": "You are in a maze of twisty little passages, all alike.",
      "short": "You are in a maze of twisty little passages, all alike.",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLALIKE": true
    },
    "hints": [
      4
    ]
  },
  "alike4": {
    "id": "alike4",
    "title": "Alike4",
    "description": {
      "long": "You are in a maze of twisty little passages, all alike.",
      "short": "You are in a maze of twisty little passages, all alike.",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLALIKE": true
    },
    "hints": [
      4
    ]
  },
  "mazeend1": {
    "id": "mazeend1",
    "title": "Mazeend1",
    "description": {
      "long": "Dead end",
      "short": "Dead end",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOARRR": true,
      "ALLALIKE": true
    },
    "hints": [
      4
    ]
  },
  "mazeend2": {
    "id": "mazeend2",
    "title": "Mazeend2",
    "description": {
      "long": "Dead end",
      "short": "Dead end",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOARRR": true,
      "ALLALIKE": true
    },
    "hints": [
      4
    ]
  },
  "mazeend3": {
    "id": "mazeend3",
    "title": "Mazeend3",
    "description": {
      "long": "Dead end",
      "short": "Dead end",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOARRR": true,
      "ALLALIKE": true
    },
    "hints": [
      4
    ]
  },
  "alike5": {
    "id": "alike5",
    "title": "Alike5",
    "description": {
      "long": "You are in a maze of twisty little passages, all alike.",
      "short": "You are in a maze of twisty little passages, all alike.",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLALIKE": true
    },
    "hints": [
      4
    ]
  },
  "alike6": {
    "id": "alike6",
    "title": "Alike6",
    "description": {
      "long": "You are in a maze of twisty little passages, all alike.",
      "short": "You are in a maze of twisty little passages, all alike.",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLALIKE": true
    },
    "hints": [
      4
    ]
  },
  "alike7": {
    "id": "alike7",
    "title": "Alike7",
    "description": {
      "long": "You are in a maze of twisty little passages, all alike.",
      "short": "You are in a maze of twisty little passages, all alike.",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLALIKE": true
    },
    "hints": [
      4
    ]
  },
  "alike8": {
    "id": "alike8",
    "title": "Alike8",
    "description": {
      "long": "You are in a maze of twisty little passages, all alike.",
      "short": "You are in a maze of twisty little passages, all alike.",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLALIKE": true
    },
    "hints": [
      4
    ]
  },
  "alike9": {
    "id": "alike9",
    "title": "Alike9",
    "description": {
      "long": "You are in a maze of twisty little passages, all alike.",
      "short": "You are in a maze of twisty little passages, all alike.",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLALIKE": true
    },
    "hints": [
      4
    ]
  },
  "mazeend4": {
    "id": "mazeend4",
    "title": "Mazeend4",
    "description": {
      "long": "Dead end",
      "short": "Dead end",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOARRR": true,
      "ALLALIKE": true
    },
    "hints": [
      4
    ]
  },
  "alike10": {
    "id": "alike10",
    "title": "Alike10",
    "description": {
      "long": "You are in a maze of twisty little passages, all alike.",
      "short": "You are in a maze of twisty little passages, all alike.",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLALIKE": true
    },
    "hints": [
      4
    ]
  },
  "mazeend5": {
    "id": "mazeend5",
    "title": "Mazeend5",
    "description": {
      "long": "Dead end",
      "short": "Dead end",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOARRR": true,
      "ALLALIKE": true
    },
    "hints": [
      4
    ]
  },
  "pitbrink": {
    "id": "pitbrink",
    "title": "Brink Of Pit",
    "description": {
      "long": "You are on the brink of a thirty foot pit with a massive orange column down one wall. You could climb down here but you could not get back up. The maze continues at this level.",
      "short": "You're at brink of pit."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLALIKE": true
    }
  },
  "mazeend6": {
    "id": "mazeend6",
    "title": "Mazeend6",
    "description": {
      "long": "Dead end",
      "short": "Dead end",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "NOARRR": true,
      "DEEP": true,
      "ALLALIKE": true
    }
  },
  "parallel2": {
    "id": "parallel2",
    "title": "Parallel2",
    "description": {
      "long": "You have crawled through a very low wide passage parallel to and north of the Hall of Mists.",
      "short": "You have crawled through a very low wide passage parallel to and north of the Hall of Mists.",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "longeast": {
    "id": "longeast",
    "title": "East End Of Long Hall",
    "description": {
      "long": "You are at the east end of a very long hall apparently without side chambers. To the east a low wide crawl slants up. To the north a round two foot hole slants down.",
      "short": "You're at east end of long hall.",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "longwest": {
    "id": "longwest",
    "title": "West End Of Long Hall",
    "description": {
      "long": "You are at the west end of a very long featureless hall. The hall joins up with a narrow north/south passage.",
      "short": "You're at west end of long hall.",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "crossover": {
    "id": "crossover",
    "title": "Crossover",
    "description": {
      "long": "You are at a crossover of a high n/s passage and a low e/w one.",
      "short": "You are at a crossover of a high n/s passage and a low e/w one.",
      "maptag": "Passage crossover."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "deadend7": {
    "id": "deadend7",
    "title": "Deadend7",
    "description": {
      "long": "Dead end",
      "short": "Dead end",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "complex": {
    "id": "complex",
    "title": "Complex Junction",
    "description": {
      "long": "You are at a complex junction. A low hands and knees passage from the north joins a higher crawl from the east to make a walking passage going west. There is also a large room above. The air is damp here.",
      "short": "You're at complex junction."
    },
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
    ],
    "sound": "WIND_WHISTLES",
    "conditions": {
      "DEEP": true
    },
    "hints": [
      10
    ]
  },
  "bedquilt": {
    "id": "bedquilt",
    "title": "Bedquilt",
    "description": {
      "long": "You are in Bedquilt, a long east/west passage with holes everywhere. To explore at random select north, south, up, or down.",
      "short": "You're in Bedquilt."
    },
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
        "message": "You have crawled around in some little holes and wound up back in the main passage.",
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
        "message": "You have crawled around in some little holes and wound up back in the main passage.",
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
        "message": "You have crawled around in some little holes and wound up back in the main passage.",
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
        "message": "You have crawled around in some little holes and wound up back in the main passage.",
        "uiHint": "hidden"
      },
      {
        "id": "go_down",
        "label": "GO DOWN",
        "type": "move",
        "to": "anteroom"
      }
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "swisscheese": {
    "id": "swisscheese",
    "title": "Swiss Cheese Room",
    "description": {
      "long": "You are in a room whose walls resemble Swiss cheese. Obvious passages go west, east, ne, and nw. Part of the room is occupied by a large bedrock block.",
      "short": "You're in Swiss Cheese Room."
    },
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
        "message": "You have crawled around in some little holes and wound up back in the main passage.",
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
        "message": "You have crawled around in some little holes and wound up back in the main passage.",
        "uiHint": "hidden"
      },
      {
        "id": "go_oriental",
        "label": "ORIENTAL",
        "type": "move",
        "to": "oriental"
      }
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "eastend": {
    "id": "eastend",
    "title": "East End Of Twopit Room",
    "description": {
      "long": "You are at the east end of the Twopit Room. The floor here is littered with thin rock slabs, which make it easy to descend the pits. There is a path here bypassing the pits to connect passages from east and west. There are holes all over, but the only big one is on the wall directly over the west pit where you can't get to it.",
      "short": "You're at east end of Twopit Room."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "slab": {
    "id": "slab",
    "title": "Slab Room",
    "description": {
      "long": "You are in a large low circular chamber whose floor is an immense slab fallen from the ceiling (Slab Room). East and west there once were large passages, but they are now filled with boulders. Low small passages go north and south, and the south one quickly bends west around the boulders.",
      "short": "You're in Slab Room."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "secret1": {
    "id": "secret1",
    "title": "Secret1",
    "description": {
      "long": "You are in a secret n/s canyon above a large room.",
      "short": "You are in a secret n/s canyon above a large room."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "secret2": {
    "id": "secret2",
    "title": "Secret2",
    "description": {
      "long": "You are in a secret n/s canyon above a sizable passage.",
      "short": "You are in a secret n/s canyon above a sizable passage.",
      "maptag": "Secret canyon"
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "threejunction": {
    "id": "threejunction",
    "title": "Junction Of Three Secret Canyons",
    "description": {
      "long": "You are in a secret canyon at a junction of three canyons, bearing north, south, and se. The north one is as tall as the other two combined.",
      "short": "You're at junction of three secret canyons.",
      "maptag": "Secret canyon junction"
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "lowroom": {
    "id": "lowroom",
    "title": "Large Low Room",
    "description": {
      "long": "You are in a large low room. Crawls lead north, se, and sw.",
      "short": "You're in large low room."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "deadcrawl": {
    "id": "deadcrawl",
    "title": "Deadcrawl",
    "description": {
      "long": "Dead end crawl.",
      "short": "Dead end crawl."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "secret3": {
    "id": "secret3",
    "title": "Secret E/w Canyon Above Tight Canyon",
    "description": {
      "long": "You are in a secret canyon which here runs e/w. It crosses over a very tight canyon 15 feet below. If you go down you may not be able to get back up.",
      "short": "You're in secret e/w canyon above tight canyon.",
      "maptag": "Secret e/w canyon"
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "wideplace": {
    "id": "wideplace",
    "title": "Wideplace",
    "description": {
      "long": "You are at a wide place in a very tight n/s canyon.",
      "short": "You are at a wide place in a very tight n/s canyon.",
      "maptag": "Wide place"
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "tightplace": {
    "id": "tightplace",
    "title": "Tightplace",
    "description": {
      "long": "The canyon here becomes too tight to go further south.",
      "short": "The canyon here becomes too tight to go further south.",
      "maptag": "Tight canyon"
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "tall": {
    "id": "tall",
    "title": "Tall",
    "description": {
      "long": "You are in a tall e/w canyon. A low tight crawl goes 3 feet north and seems to open up.",
      "short": "You are in a tall e/w canyon. A low tight crawl goes 3 feet north and seems to open up.",
      "maptag": "Tall canyon"
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "boulders1": {
    "id": "boulders1",
    "title": "Boulders1",
    "description": {
      "long": "The canyon runs into a mass of boulders -- dead end.",
      "short": "The canyon runs into a mass of boulders -- dead end.",
      "maptag": "Boulders"
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "sewer": {
    "id": "sewer",
    "title": "Sewer",
    "description": {
      "long": "The stream flows out through a pair of 1 foot diameter sewer pipes. It would be advisable to use the exit.",
      "short": "The stream flows out through a pair of 1 foot diameter sewer pipes. It would be advisable to use the exit."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "alike11": {
    "id": "alike11",
    "title": "Alike11",
    "description": {
      "long": "You are in a maze of twisty little passages, all alike.",
      "short": "You are in a maze of twisty little passages, all alike.",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLALIKE": true
    },
    "hints": [
      4
    ]
  },
  "mazeend8": {
    "id": "mazeend8",
    "title": "Mazeend8",
    "description": {
      "long": "Dead end",
      "short": "Dead end",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "ALLALIKE": true
    },
    "hints": [
      4
    ]
  },
  "mazeend9": {
    "id": "mazeend9",
    "title": "Mazeend9",
    "description": {
      "long": "Dead end",
      "short": "Dead end",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOARRR": true,
      "ALLALIKE": true
    },
    "hints": [
      4
    ]
  },
  "alike12": {
    "id": "alike12",
    "title": "Alike12",
    "description": {
      "long": "You are in a maze of twisty little passages, all alike.",
      "short": "You are in a maze of twisty little passages, all alike.",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLALIKE": true
    }
  },
  "alike13": {
    "id": "alike13",
    "title": "Alike13",
    "description": {
      "long": "You are in a maze of twisty little passages, all alike.",
      "short": "You are in a maze of twisty little passages, all alike.",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLALIKE": true
    }
  },
  "mazeend10": {
    "id": "mazeend10",
    "title": "Mazeend10",
    "description": {
      "long": "Dead end",
      "short": "Dead end",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "NOARRR": true,
      "DEEP": true,
      "ALLALIKE": true
    }
  },
  "mazeend11": {
    "id": "mazeend11",
    "title": "Mazeend11",
    "description": {
      "long": "Dead end",
      "short": "Dead end",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOARRR": true,
      "ALLALIKE": true
    },
    "hints": [
      4
    ]
  },
  "alike14": {
    "id": "alike14",
    "title": "Alike14",
    "description": {
      "long": "You are in a maze of twisty little passages, all alike.",
      "short": "You are in a maze of twisty little passages, all alike.",
      "maptag": "Maze all alike."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLALIKE": true
    },
    "hints": [
      4
    ]
  },
  "narrow": {
    "id": "narrow",
    "title": "Narrow Corridor",
    "description": {
      "long": "You are in a long, narrow corridor stretching out of sight to the west. At the eastern end is a hole through which you can see a profusion of leaves.",
      "short": "You're in narrow corridor."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "noclimb": {
    "id": "noclimb",
    "title": "Noclimb",
    "description": {
      "long": "There is nothing here to climb. Use \"up\" or \"out\" to leave the pit.",
      "short": "There is nothing here to climb. Use \"up\" or \"out\" to leave the pit."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "planttop": {
    "id": "planttop",
    "title": "Planttop",
    "description": {
      "long": "You have climbed up the plant and out of the pit.",
      "short": "You have climbed up the plant and out of the pit."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "incline": {
    "id": "incline",
    "title": "Steep Incline Above Large Room",
    "description": {
      "long": "You are at the top of a steep incline above a large room. You could climb down here, but you would not be able to climb up. There is a passage leading back to the north.",
      "short": "You're at steep incline above large room."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "giantroom": {
    "id": "giantroom",
    "title": "Giant Room",
    "description": {
      "long": "You are in the Giant Room. The ceiling here is too high up for your lamp to show it. Cavernous passages lead east, north, and south. On the west wall is scrawled the inscription, \"FEE FIE FOE FOO\" [sic].",
      "short": "You're in Giant Room."
    },
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
    },
    "conditions": {
      "DEEP": true
    }
  },
  "cavein": {
    "id": "cavein",
    "title": "Cavein",
    "description": {
      "long": "The passage here is blocked by a recent cave-in.",
      "short": "The passage here is blocked by a recent cave-in.",
      "maptag": "Cave-in blockage"
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "immense": {
    "id": "immense",
    "title": "Immense",
    "description": {
      "long": "You are at one end of an immense north/south passage.",
      "short": "You are at one end of an immense north/south passage.",
      "maptag": "Immense passage end."
    },
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
    ],
    "sound": "WIND_WHISTLES",
    "conditions": {
      "DEEP": true
    }
  },
  "waterfall": {
    "id": "waterfall",
    "title": "Cavern With Waterfall",
    "description": {
      "long": "You are in a magnificent cavern with a rushing stream, which cascades over a sparkling waterfall into a roaring whirlpool which disappears through a hole in the floor. Passages exit to the south and west.",
      "short": "You're in cavern with waterfall."
    },
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
    },
    "sound": "STREAM_SPLASHES",
    "conditions": {
      "FLUID": true,
      "DEEP": true
    }
  },
  "softroom": {
    "id": "softroom",
    "title": "Soft Room",
    "description": {
      "long": "You are in the Soft Room. The walls are covered with heavy curtains, the floor with a thick pile carpet. Moss covers the ceiling.",
      "short": "You're in Soft Room."
    },
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
    },
    "conditions": {
      "DEEP": true
    }
  },
  "oriental": {
    "id": "oriental",
    "title": "Oriental Room",
    "description": {
      "long": "This is the Oriental Room. Ancient oriental cave drawings cover the walls. A gently sloping passage leads upward to the north, another passage leads se, and a hands and knees crawl leads west.",
      "short": "You're in Oriental Room."
    },
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
    },
    "conditions": {
      "DEEP": true
    }
  },
  "misty": {
    "id": "misty",
    "title": "Misty Cavern",
    "description": {
      "long": "You are following a wide path around the outer edge of a large cavern. Far below, through a heavy white mist, strange splashing noises can be heard. The mist rises up through a fissure in the ceiling. The path exits to the south and west.",
      "short": "You're in misty cavern."
    },
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
    ],
    "sound": "NO_MEANING",
    "conditions": {
      "DEEP": true
    }
  },
  "alcove": {
    "id": "alcove",
    "title": "Alcove",
    "description": {
      "long": "You are in an alcove. A small nw path seems to widen after a short distance. An extremely tight tunnel leads east. It looks like a very tight squeeze. An eerie light can be seen at the other end.",
      "short": "You're in alcove."
    },
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
    ],
    "conditions": {
      "DEEP": true
    },
    "hints": [
      5
    ]
  },
  "plover": {
    "id": "plover",
    "title": "Plover Room",
    "description": {
      "long": "You're in a small chamber lit by an eerie green light. An extremely narrow tunnel exits to the west. A dark corridor leads ne.",
      "short": "You're in Plover Room."
    },
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
    },
    "conditions": {
      "DEEP": true,
      "LIT": true
    },
    "hints": [
      5
    ]
  },
  "darkroom": {
    "id": "darkroom",
    "title": "Dark-room",
    "description": {
      "long": "You're in the dark-room. A corridor leading south is the only exit.",
      "short": "You're in dark-room."
    },
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
    },
    "conditions": {
      "DEEP": true
    },
    "hints": [
      5
    ]
  },
  "arched": {
    "id": "arched",
    "title": "Arched Hall",
    "description": {
      "long": "You are in an arched hall. A coral passage once continued up and east from here, but is now blocked by debris. The air smells of sea water.",
      "short": "You're in arched hall."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "shellroom": {
    "id": "shellroom",
    "title": "Shell Room",
    "description": {
      "long": "You're in a large room carved out of sedimentary rock. The floor and walls are littered with bits of shells embedded in the stone. A shallow passage proceeds downward, and a somewhat steeper one leads up. A low hands and knees passage enters from the south.",
      "short": "You're in Shell Room."
    },
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
    },
    "conditions": {
      "DEEP": true
    }
  },
  "sloping1": {
    "id": "sloping1",
    "title": "Sloping1",
    "description": {
      "long": "You are in a long sloping corridor with ragged sharp walls.",
      "short": "You are in a long sloping corridor with ragged sharp walls.",
      "maptag": "Sloping corridor"
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "culdesac": {
    "id": "culdesac",
    "title": "Culdesac",
    "description": {
      "long": "You are in a cul-de-sac about eight feet across.",
      "short": "You are in a cul-de-sac about eight feet across.",
      "maptag": "Cul-de-sac."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "anteroom": {
    "id": "anteroom",
    "title": "Anteroom",
    "description": {
      "long": "You are in an anteroom leading to a large passage to the east. Small passages go west and up. The remnants of recent digging are evident. A sign in midair here says \"Cave under construction beyond this point. Proceed at own risk. [Witt Construction Company]\"",
      "short": "You're in anteroom."
    },
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
    },
    "conditions": {
      "DEEP": true
    }
  },
  "different1": {
    "id": "different1",
    "title": "Different1",
    "description": {
      "long": "You are in a maze of twisty little passages, all different.",
      "short": "You are in a maze of twisty little passages, all different.",
      "maptag": "Maze all different"
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLDIFFERENT": true
    }
  },
  "wittsend": {
    "id": "wittsend",
    "title": "Witt's End",
    "description": {
      "long": "You are at Witt's End. Passages lead off in *ALL* directions.",
      "short": "You're at Witt's End."
    },
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
        "message": "You have crawled around in some little holes and wound up back in the main passage.",
        "uiHint": "hidden"
      },
      {
        "id": "say_futile_crawl_north",
        "label": "North",
        "type": "event",
        "message": "You have crawled around in some little holes and wound up back in the main passage.",
        "uiHint": "hidden"
      },
      {
        "id": "say_futile_crawl_south",
        "label": "South",
        "type": "event",
        "message": "You have crawled around in some little holes and wound up back in the main passage.",
        "uiHint": "hidden"
      },
      {
        "id": "say_futile_crawl_ne",
        "label": "Ne",
        "type": "event",
        "message": "You have crawled around in some little holes and wound up back in the main passage.",
        "uiHint": "hidden"
      },
      {
        "id": "say_futile_crawl_se",
        "label": "Se",
        "type": "event",
        "message": "You have crawled around in some little holes and wound up back in the main passage.",
        "uiHint": "hidden"
      },
      {
        "id": "say_futile_crawl_sw",
        "label": "Sw",
        "type": "event",
        "message": "You have crawled around in some little holes and wound up back in the main passage.",
        "uiHint": "hidden"
      },
      {
        "id": "say_futile_crawl_nw",
        "label": "Nw",
        "type": "event",
        "message": "You have crawled around in some little holes and wound up back in the main passage.",
        "uiHint": "hidden"
      },
      {
        "id": "say_futile_crawl_upwar",
        "label": "Upwar",
        "type": "event",
        "message": "You have crawled around in some little holes and wound up back in the main passage.",
        "uiHint": "hidden"
      },
      {
        "id": "say_futile_crawl_down",
        "label": "Down",
        "type": "event",
        "message": "You have crawled around in some little holes and wound up back in the main passage.",
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
        "message": "You have crawled around in some little holes and found your way blocked by a recent cave-in. You are now back in the main passage.",
        "uiHint": "hidden"
      }
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true
    },
    "hints": [
      6
    ]
  },
  "mirrorcanyon": {
    "id": "mirrorcanyon",
    "title": "Mirror Canyon",
    "description": {
      "long": "You are in a north/south canyon about 25 feet across. The floor is covered by white mist seeping in from the north. The walls extend upward for well over 100 feet. Suspended from some unseen point far above you, an enormous two-sided mirror is hanging parallel to and midway between the canyon walls. (The mirror is obviously provided for the use of the dwarves who, as you know, are extremely vain.) A small window can be seen in either wall, some fifty feet up.",
      "short": "You're in Mirror Canyon."
    },
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
    ],
    "sound": "WIND_WHISTLES",
    "conditions": {
      "DEEP": true
    },
    "hints": [
      10
    ]
  },
  "window2": {
    "id": "window2",
    "title": "Window On Pit",
    "description": {
      "long": "You're at a low window overlooking a huge pit, which extends up out of sight. A floor is indistinctly visible over 50 feet below. Traces of white mist cover the floor of the pit, becoming thicker to the left. Marks in the dust around the window would seem to indicate that someone has been here recently. Directly across the pit from you and 25 feet away there is a similar window looking into a lighted room. A shadowy figure can be seen there peering back at you.",
      "short": "You're at window on pit."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "topstalactite": {
    "id": "topstalactite",
    "title": "Top Of Stalactite",
    "description": {
      "long": "A large stalactite extends from the roof and almost reaches the floor below. You could climb down it, and jump from it to the floor, but having done so you would be unable to reach it to climb back up.",
      "short": "You're at top of stalactite."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "ALLALIKE": true
    }
  },
  "different2": {
    "id": "different2",
    "title": "Different2",
    "description": {
      "long": "You are in a little maze of twisting passages, all different.",
      "short": "You are in a little maze of twisting passages, all different.",
      "maptag": "Maze all different"
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLDIFFERENT": true
    }
  },
  "reservoir": {
    "id": "reservoir",
    "title": "Reservoir",
    "description": {
      "long": "You are at the edge of a large underground reservoir. An opaque cloud of white mist fills the room and rises rapidly upward. The lake is fed by a stream, which tumbles out of a hole in the wall about 10 feet overhead and splashes noisily into the water somewhere within the mist. There is a passage going back toward the south.",
      "short": "You're at reservoir."
    },
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
    ],
    "sound": "STREAM_SPLASHES",
    "conditions": {
      "FLUID": true,
      "DEEP": true
    }
  },
  "mazeend12": {
    "id": "mazeend12",
    "title": "Mazeend12",
    "description": {
      "long": "Dead end",
      "short": "Dead end"
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "ALLALIKE": true
    }
  },
  "ne": {
    "id": "ne",
    "title": "Ne End",
    "description": {
      "long": "You are at the northeast end of an immense room, even larger than the Giant Room. It appears to be a repository for the \"Adventure\" program. Massive torches far overhead bathe the room with smoky yellow light. Scattered about you can be seen a pile of bottles (all of them empty), a nursery of young beanstalks murmuring quietly, a bed of oysters, a bundle of black rods with rusty stars on their ends, and a collection of brass lanterns. Off to one side a great many dwarves are sleeping on the floor, snoring loudly. A notice nearby reads: \"Do not disturb the dwarves!\" An immense mirror is hanging against one wall, and stretches to the other end of the room, where various other sundry objects can be glimpsed dimly in the distance.",
      "short": "You're at ne end.",
      "maptag": "Repository ne end"
    },
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
    ],
    "sound": "MURMURING_SNORING",
    "conditions": {
      "DEEP": true,
      "LIT": true
    }
  },
  "sw": {
    "id": "sw",
    "title": "Sw End",
    "description": {
      "long": "You are at the southwest end of the repository. To one side is a pit full of fierce green snakes. On the other side is a row of small wicker cages, each of which contains a little sulking bird. In one corner is a bundle of black rods with rusty marks on their ends. A large number of velvet pillows are scattered about on the floor. A vast mirror stretches off to the northeast. At your feet is a large steel grate, next to which is a sign that reads, \"Treasure Vault. Keys in main office.\"",
      "short": "You're at sw end.",
      "maptag": "Repository sw end"
    },
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
    ],
    "sound": "SNAKES_HISSING",
    "conditions": {
      "DEEP": true,
      "LIT": true
    }
  },
  "swchasm": {
    "id": "swchasm",
    "title": "Sw Side Of Chasm",
    "description": {
      "long": "You are on one side of a large, deep chasm. A heavy white mist rising up from below obscures all view of the far side. A sw path leads away from the chasm into a winding corridor.",
      "short": "You're on sw side of chasm."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "winding": {
    "id": "winding",
    "title": "Sloping Corridor",
    "description": {
      "long": "You are in a long winding corridor sloping out of sight in both directions.",
      "short": "You're in sloping corridor."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "secret4": {
    "id": "secret4",
    "title": "Secret4",
    "description": {
      "long": "You are in a secret canyon which exits to the north and east.",
      "short": "You are in a secret canyon which exits to the north and east.",
      "maptag": "Secret canyon"
    },
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
        "message": "The dragon looks rather nasty. You'd best not try to get by.",
        "uiHint": "hidden"
      },
      {
        "id": "say_nasty_dragon_forwa",
        "label": "Forwa",
        "type": "event",
        "message": "The dragon looks rather nasty. You'd best not try to get by.",
        "uiHint": "hidden"
      }
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "secret5": {
    "id": "secret5",
    "title": "Secret5",
    "description": {
      "long": "You are in a secret canyon which exits to the north and east.",
      "short": "You are in a secret canyon which exits to the north and east.",
      "maptag": "Secret canyon"
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "secret6": {
    "id": "secret6",
    "title": "Secret6",
    "description": {
      "long": "You are in a secret canyon which exits to the north and east.",
      "short": "You are in a secret canyon which exits to the north and east.",
      "maptag": "Secret canyon"
    },
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
        "message": "The dragon looks rather nasty. You'd best not try to get by.",
        "uiHint": "hidden"
      },
      {
        "id": "say_nasty_dragon_forwa",
        "label": "Forwa",
        "type": "event",
        "message": "The dragon looks rather nasty. You'd best not try to get by.",
        "uiHint": "hidden"
      }
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "nechasm": {
    "id": "nechasm",
    "title": "Ne Side Of Chasm",
    "description": {
      "long": "You are on the far side of the chasm. A ne path leads away from the chasm on this side.",
      "short": "You're on ne side of chasm."
    },
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
    ],
    "conditions": {
      "NOARRR": true,
      "DEEP": true
    }
  },
  "corridor": {
    "id": "corridor",
    "title": "Corridor",
    "description": {
      "long": "You're in a long east/west corridor. A faint rumbling noise can be heard in the distance.",
      "short": "You're in corridor.",
      "maptag": "e/w canyon"
    },
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
    ],
    "sound": "DULL_RUMBLING",
    "conditions": {
      "NOARRR": true,
      "DEEP": true
    }
  },
  "fork": {
    "id": "fork",
    "title": "Fork In Path",
    "description": {
      "long": "The path forks here. The left fork leads northeast. A dull rumbling seems to get louder in that direction. The right fork leads southeast down a gentle slope. The main corridor enters from the west.",
      "short": "You're at fork in path."
    },
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
    ],
    "sound": "DULL_RUMBLING",
    "conditions": {
      "NOARRR": true,
      "DEEP": true
    }
  },
  "warmwalls": {
    "id": "warmwalls",
    "title": "Junction With Warm Walls",
    "description": {
      "long": "The walls are quite warm here. From the north can be heard a steady roar, so loud that the entire cave seems to be trembling. Another passage leads south, and a low crawl goes east.",
      "short": "You're at junction with warm walls.",
      "maptag": "Warm junction"
    },
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
    ],
    "sound": "LOUD_ROAR",
    "conditions": {
      "NOARRR": true,
      "DEEP": true
    }
  },
  "breathtaking": {
    "id": "breathtaking",
    "title": "Breath-taking View",
    "description": {
      "long": "You are on the edge of a breath-taking view. Far below you is an active volcano, from which great gouts of molten lava come surging out, cascading back down into the depths. The glowing rock fills the farthest reaches of the cavern with a blood-red glare, giving every- thing an eerie, macabre appearance. The air is filled with flickering sparks of ash and a heavy smell of brimstone. The walls are hot to the touch, and the thundering of the volcano drowns out all other sounds. Embedded in the jagged roof far overhead are myriad twisted formations composed of pure white alabaster, which scatter the murky light into sinister apparitions upon the walls. To one side is a deep gorge, filled with a bizarre chaos of tortured rock which seems to have been crafted by the devil himself. An immense river of fire crashes out from the depths of the volcano, burns its way through the gorge, and plummets into a bottomless pit far off to your left. To the right, an immense geyser of blistering steam erupts continuously from a barren island in the center of a sulfurous lake, which bubbles ominously. The far right wall is aflame with an incandescence of its own, which lends an additional infernal splendor to the already hellish scene. A dark, foreboding passage exits to the south.",
      "short": "You're at breath-taking view."
    },
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
    ],
    "sound": "TOTAL_ROAR",
    "conditions": {
      "NOARRR": true,
      "LIT": true,
      "DEEP": true
    },
    "hints": [
      10
    ]
  },
  "boulders2": {
    "id": "boulders2",
    "title": "Chamber Of Boulders",
    "description": {
      "long": "You are in a small chamber filled with large boulders. The walls are very warm, causing the air in the room to be almost stifling from the heat. The only exit is a crawl heading west, through which is coming a low rumbling.",
      "short": "You're in Chamber of Boulders."
    },
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
    },
    "sound": "DULL_RUMBLING",
    "conditions": {
      "NOARRR": true,
      "DEEP": true
    }
  },
  "limestone": {
    "id": "limestone",
    "title": "Limestone Passage",
    "description": {
      "long": "You are walking along a gently sloping north/south passage lined with oddly shaped limestone formations.",
      "short": "You're in limestone passage."
    },
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
    ],
    "conditions": {
      "NOARRR": true,
      "DEEP": true
    }
  },
  "barrenfront": {
    "id": "barrenfront",
    "title": "Front Of Barren Room",
    "description": {
      "long": "You are standing at the entrance to a large, barren room. A notice above the entrance reads: \"Caution! Bear in room!\"",
      "short": "You're in front of Barren Room."
    },
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
    ],
    "conditions": {
      "NOARRR": true,
      "DEEP": true
    }
  },
  "barrenroom": {
    "id": "barrenroom",
    "title": "Barren Room",
    "description": {
      "long": "You are inside a barren room. The center of the room is completely empty except for some dust. Marks in the dust lead away toward the far end of the room. The only exit is the way you came in.",
      "short": "You're in Barren Room."
    },
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
    ],
    "conditions": {
      "NOARRR": true,
      "DEEP": true
    }
  },
  "different3": {
    "id": "different3",
    "title": "Different3",
    "description": {
      "long": "You are in a maze of twisting little passages, all different.",
      "short": "You are in a maze of twisting little passages, all different.",
      "maptag": "Maze all different."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLDIFFERENT": true
    }
  },
  "different4": {
    "id": "different4",
    "title": "Different4",
    "description": {
      "long": "You are in a little maze of twisty passages, all different.",
      "short": "You are in a little maze of twisty passages, all different.",
      "maptag": "Maze all different."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLDIFFERENT": true
    }
  },
  "different5": {
    "id": "different5",
    "title": "Different5",
    "description": {
      "long": "You are in a twisting maze of little passages, all different.",
      "short": "You are in a twisting maze of little passages, all different.",
      "maptag": "Maze all different."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLDIFFERENT": true
    }
  },
  "different6": {
    "id": "different6",
    "title": "Different6",
    "description": {
      "long": "You are in a twisting little maze of passages, all different.",
      "short": "You are in a twisting little maze of passages, all different.",
      "maptag": "Maze all different."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLDIFFERENT": true
    }
  },
  "different7": {
    "id": "different7",
    "title": "Different7",
    "description": {
      "long": "You are in a twisty little maze of passages, all different.",
      "short": "You are in a twisty little maze of passages, all different.",
      "maptag": "Maze all different."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLDIFFERENT": true
    }
  },
  "different8": {
    "id": "different8",
    "title": "Different8",
    "description": {
      "long": "You are in a twisty maze of little passages, all different.",
      "short": "You are in a twisty maze of little passages, all different.",
      "maptag": "Maze all different."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLDIFFERENT": true
    }
  },
  "different9": {
    "id": "different9",
    "title": "Different9",
    "description": {
      "long": "You are in a little twisty maze of passages, all different.",
      "short": "You are in a little twisty maze of passages, all different.",
      "maptag": "Maze all different."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLDIFFERENT": true
    }
  },
  "different10": {
    "id": "different10",
    "title": "Different10",
    "description": {
      "long": "You are in a maze of little twisting passages, all different.",
      "short": "You are in a maze of little twisting passages, all different.",
      "maptag": "Maze all different."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLDIFFERENT": true
    }
  },
  "different11": {
    "id": "different11",
    "title": "Different11",
    "description": {
      "long": "You are in a maze of little twisty passages, all different.",
      "short": "You are in a maze of little twisty passages, all different.",
      "maptag": "Maze all different."
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "NOBACK": true,
      "ALLDIFFERENT": true
    }
  },
  "deadend13": {
    "id": "deadend13",
    "title": "Deadend13",
    "description": {
      "long": "Dead end",
      "short": "Dead end"
    },
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
    ],
    "conditions": {
      "DEEP": true,
      "ALLDIFFERENT": true
    }
  },
  "roughhewn": {
    "id": "roughhewn",
    "title": "Roughhewn",
    "description": {
      "long": "You are in a long, rough-hewn, north/south corridor.",
      "short": "You are in a long, rough-hewn, north/south corridor.",
      "maptag": "Rough-hewn corridor"
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "baddirection": {
    "id": "baddirection",
    "title": "Baddirection",
    "description": {
      "long": "There is no way to go that direction.",
      "short": "There is no way to go that direction."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "large": {
    "id": "large",
    "title": "Large",
    "description": {
      "long": "You are in a large chamber with passages to the west and north.",
      "short": "You are in a large chamber with passages to the west and north.",
      "maptag": "Large chamber."
    },
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
    ],
    "conditions": {
      "DEEP": true
    },
    "hints": [
      9
    ]
  },
  "storeroom": {
    "id": "storeroom",
    "title": "Storeroom",
    "description": {
      "long": "You are in the ogre's storeroom. The only exit is to the south.",
      "short": "You are in the ogre's storeroom. The only exit is to the south.",
      "maptag": "Ogre's storeroom."
    },
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
    },
    "conditions": {
      "DEEP": true
    }
  },
  "forest1": {
    "id": "forest1",
    "title": "Forest1",
    "description": {
      "long": "You are wandering aimlessly through the forest.",
      "short": "You are wandering aimlessly through the forest.",
      "maptag": "Forest."
    },
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
    ],
    "conditions": {
      "FOREST": true,
      "NOBACK": true,
      "LIT": true
    },
    "hints": [
      8
    ]
  },
  "forest2": {
    "id": "forest2",
    "title": "Forest2",
    "description": {
      "long": "You are wandering aimlessly through the forest.",
      "short": "You are wandering aimlessly through the forest.",
      "maptag": "Forest."
    },
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
    ],
    "conditions": {
      "FOREST": true,
      "NOBACK": true,
      "LIT": true
    },
    "hints": [
      8
    ]
  },
  "forest3": {
    "id": "forest3",
    "title": "Forest3",
    "description": {
      "long": "You are wandering aimlessly through the forest.",
      "short": "You are wandering aimlessly through the forest.",
      "maptag": "Forest."
    },
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
    ],
    "conditions": {
      "FOREST": true,
      "NOBACK": true,
      "LIT": true
    },
    "hints": [
      8
    ]
  },
  "forest4": {
    "id": "forest4",
    "title": "Forest4",
    "description": {
      "long": "You are wandering aimlessly through the forest.",
      "short": "You are wandering aimlessly through the forest.",
      "maptag": "Forest."
    },
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
    ],
    "conditions": {
      "FOREST": true,
      "NOBACK": true,
      "LIT": true
    },
    "hints": [
      8
    ]
  },
  "forest5": {
    "id": "forest5",
    "title": "Forest5",
    "description": {
      "long": "You are wandering aimlessly through the forest.",
      "short": "You are wandering aimlessly through the forest.",
      "maptag": "Forest."
    },
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
    ],
    "conditions": {
      "FOREST": true,
      "NOBACK": true,
      "LIT": true
    },
    "hints": [
      8
    ]
  },
  "forest6": {
    "id": "forest6",
    "title": "Forest6",
    "description": {
      "long": "You are wandering aimlessly through the forest.",
      "short": "You are wandering aimlessly through the forest.",
      "maptag": "Forest."
    },
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
    ],
    "conditions": {
      "FOREST": true,
      "NOBACK": true,
      "LIT": true
    },
    "hints": [
      8
    ]
  },
  "forest7": {
    "id": "forest7",
    "title": "Forest7",
    "description": {
      "long": "You are wandering aimlessly through the forest.",
      "short": "You are wandering aimlessly through the forest.",
      "maptag": "Forest."
    },
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
    ],
    "conditions": {
      "FOREST": true,
      "NOBACK": true,
      "LIT": true
    },
    "hints": [
      8
    ]
  },
  "forest8": {
    "id": "forest8",
    "title": "Forest8",
    "description": {
      "long": "You are wandering aimlessly through the forest.",
      "short": "You are wandering aimlessly through the forest.",
      "maptag": "Forest."
    },
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
    ],
    "conditions": {
      "FOREST": true,
      "NOBACK": true,
      "LIT": true
    },
    "hints": [
      8
    ]
  },
  "forest9": {
    "id": "forest9",
    "title": "Forest9",
    "description": {
      "long": "You are wandering aimlessly through the forest.",
      "short": "You are wandering aimlessly through the forest.",
      "maptag": "Forest."
    },
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
    ],
    "conditions": {
      "FOREST": true,
      "NOBACK": true,
      "LIT": true
    },
    "hints": [
      8
    ]
  },
  "forest10": {
    "id": "forest10",
    "title": "Forest10",
    "description": {
      "long": "You are wandering aimlessly through the forest.",
      "short": "You are wandering aimlessly through the forest.",
      "maptag": "Forest."
    },
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
    ],
    "conditions": {
      "FOREST": true,
      "NOBACK": true,
      "LIT": true
    },
    "hints": [
      8
    ]
  },
  "forest11": {
    "id": "forest11",
    "title": "Forest11",
    "description": {
      "long": "You are wandering aimlessly through the forest.",
      "short": "You are wandering aimlessly through the forest.",
      "maptag": "Forest."
    },
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
    ],
    "conditions": {
      "FOREST": true,
      "NOBACK": true,
      "LIT": true
    },
    "hints": [
      8
    ]
  },
  "forest12": {
    "id": "forest12",
    "title": "Forest12",
    "description": {
      "long": "You are wandering aimlessly through the forest.",
      "short": "You are wandering aimlessly through the forest.",
      "maptag": "Forest."
    },
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
    ],
    "conditions": {
      "FOREST": true,
      "NOBACK": true,
      "LIT": true
    },
    "hints": [
      8
    ]
  },
  "forest13": {
    "id": "forest13",
    "title": "Forest13",
    "description": {
      "long": "You are wandering aimlessly through the forest.",
      "short": "You are wandering aimlessly through the forest.",
      "maptag": "Forest."
    },
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
    ],
    "conditions": {
      "FOREST": true,
      "NOBACK": true,
      "LIT": true
    },
    "hints": [
      8
    ]
  },
  "forest14": {
    "id": "forest14",
    "title": "Forest14",
    "description": {
      "long": "You are wandering aimlessly through the forest.",
      "short": "You are wandering aimlessly through the forest.",
      "maptag": "Forest."
    },
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
    ],
    "conditions": {
      "FOREST": true,
      "NOBACK": true,
      "LIT": true
    },
    "hints": [
      8
    ]
  },
  "forest15": {
    "id": "forest15",
    "title": "Forest15",
    "description": {
      "long": "You are wandering aimlessly through the forest.",
      "short": "You are wandering aimlessly through the forest.",
      "maptag": "Forest."
    },
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
    ],
    "conditions": {
      "FOREST": true,
      "NOBACK": true,
      "LIT": true
    },
    "hints": [
      8
    ]
  },
  "forest16": {
    "id": "forest16",
    "title": "Forest16",
    "description": {
      "long": "You are wandering aimlessly through the forest.",
      "short": "You are wandering aimlessly through the forest.",
      "maptag": "Forest."
    },
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
    ],
    "conditions": {
      "FOREST": true,
      "NOBACK": true,
      "LIT": true
    },
    "hints": [
      8
    ]
  },
  "forest17": {
    "id": "forest17",
    "title": "Forest17",
    "description": {
      "long": "You are wandering aimlessly through the forest.",
      "short": "You are wandering aimlessly through the forest.",
      "maptag": "Forest."
    },
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
    ],
    "conditions": {
      "FOREST": true,
      "NOBACK": true,
      "LIT": true
    },
    "hints": [
      8
    ]
  },
  "forest18": {
    "id": "forest18",
    "title": "Forest18",
    "description": {
      "long": "You are wandering aimlessly through the forest.",
      "short": "You are wandering aimlessly through the forest.",
      "maptag": "Forest."
    },
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
    ],
    "conditions": {
      "FOREST": true,
      "NOBACK": true,
      "LIT": true
    },
    "hints": [
      8
    ]
  },
  "forest19": {
    "id": "forest19",
    "title": "Forest19",
    "description": {
      "long": "You are wandering aimlessly through the forest.",
      "short": "You are wandering aimlessly through the forest.",
      "maptag": "Forest."
    },
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
    ],
    "conditions": {
      "FOREST": true,
      "NOBACK": true,
      "LIT": true
    },
    "hints": [
      8
    ]
  },
  "forest20": {
    "id": "forest20",
    "title": "Forest20",
    "description": {
      "long": "You are wandering aimlessly through the forest.",
      "short": "You are wandering aimlessly through the forest.",
      "maptag": "Forest."
    },
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
    ],
    "conditions": {
      "FOREST": true,
      "NOBACK": true,
      "LIT": true
    },
    "hints": [
      8
    ]
  },
  "forest21": {
    "id": "forest21",
    "title": "Forest21",
    "description": {
      "long": "You are wandering aimlessly through the forest.",
      "short": "You are wandering aimlessly through the forest.",
      "maptag": "Forest."
    },
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
    ],
    "conditions": {
      "FOREST": true,
      "NOBACK": true,
      "LIT": true
    },
    "hints": [
      8
    ]
  },
  "forest22": {
    "id": "forest22",
    "title": "Forest22",
    "description": {
      "long": "You are wandering aimlessly through the forest.",
      "short": "You are wandering aimlessly through the forest.",
      "maptag": "Forest."
    },
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
    },
    "conditions": {
      "FOREST": true,
      "NOBACK": true,
      "LIT": true
    },
    "hints": [
      8
    ]
  },
  "ledge": {
    "id": "ledge",
    "title": "Ledge",
    "description": {
      "long": "You are on a small ledge on one face of a sheer cliff. There are no paths away from the ledge. Across the chasm is a small clearing surrounded by forest.",
      "short": "You're on ledge."
    },
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
    },
    "conditions": {
      "ABOVE": true,
      "LIT": true
    }
  },
  "resbottom": {
    "id": "resbottom",
    "title": "Bottom Of Reservoir",
    "description": {
      "long": "You are walking across the bottom of the reservoir. Walls of water rear up on either side. The roar of the water cascading past is nearly deafening, and the mist is so thick you can barely see.",
      "short": "You're at bottom of reservoir."
    },
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
    ],
    "sound": "TOTAL_ROAR",
    "conditions": {
      "FLUID": true,
      "DEEP": true
    }
  },
  "resnorth": {
    "id": "resnorth",
    "title": "North Of Reservoir",
    "description": {
      "long": "You are at the northern edge of the reservoir. A northwest passage leads sharply up from here.",
      "short": "You're north of reservoir."
    },
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
    ],
    "sound": "WATERS_CRASHING",
    "conditions": {
      "FLUID": true,
      "DEEP": true
    }
  },
  "treacherous": {
    "id": "treacherous",
    "title": "Treacherous",
    "description": {
      "long": "You are scrambling along a treacherously steep, rocky passage.",
      "short": "You are scrambling along a treacherously steep, rocky passage.",
      "maptag": "Rocky passage."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "steep": {
    "id": "steep",
    "title": "Steep",
    "description": {
      "long": "You are on a very steep incline, which widens at it goes upward.",
      "short": "You are on a very steep incline, which widens at it goes upward.",
      "maptag": "Steep incline"
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "cliffbase": {
    "id": "cliffbase",
    "title": "Base Of Cliff",
    "description": {
      "long": "You are at the base of a nearly vertical cliff. There are some slim footholds which would enable you to climb up, but it looks extremely dangerous. Here at the base of the cliff lie the remains of several earlier adventurers who apparently failed to make it.",
      "short": "You're at base of cliff."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "clifface": {
    "id": "clifface",
    "title": "Clifface",
    "description": {
      "long": "You are climbing along a nearly vertical cliff.",
      "short": "You are climbing along a nearly vertical cliff.",
      "maptag": "Vertical cliff."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "footslip": {
    "id": "footslip",
    "title": "Footslip",
    "description": {
      "long": "Just as you reach the top, your foot slips on a loose rock and you tumble several hundred feet to join the other unlucky adventurers.",
      "short": "Just as you reach the top, your foot slips on a loose rock and you tumble several hundred feet to join the other unlucky adventurers."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "clifftop": {
    "id": "clifftop",
    "title": "Clifftop",
    "description": {
      "long": "Just as you reach the top, your foot slips on a loose rock and you make one last desperate grab. Your luck holds, as does your grip. With an enormous heave, you lift yourself to the ledge above.",
      "short": "Just as you reach the top, your foot slips on a loose rock and you make one last desperate grab. Your luck holds, as does your grip. With an enormous heave, you lift yourself to the ledge above."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "cliffledge": {
    "id": "cliffledge",
    "title": "Top Of Cliff",
    "description": {
      "long": "You are on a small ledge at the top of a nearly vertical cliff. There is a low crawl leading off to the northeast.",
      "short": "You're at top of cliff.",
      "maptag": "Clifftop"
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "reachdead": {
    "id": "reachdead",
    "title": "Reachdead",
    "description": {
      "long": "You have reached a dead end.",
      "short": "You have reached a dead end.",
      "maptag": "Dead end."
    },
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
    },
    "conditions": {
      "DEEP": true
    }
  },
  "gruesome": {
    "id": "gruesome",
    "title": "Gruesome",
    "description": {
      "long": "There is now one more gruesome aspect to the spectacular vista.",
      "short": "There is now one more gruesome aspect to the spectacular vista."
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "foof1": {
    "id": "foof1",
    "title": "Foof1",
    "description": {
      "long": ">>Foof!<<",
      "short": ">>Foof!<<"
    },
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
    "description": {
      "long": ">>Foof!<<",
      "short": ">>Foof!<<"
    },
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
    ],
    "conditions": {
      "ABOVE": true
    }
  },
  "foof3": {
    "id": "foof3",
    "title": "Foof3",
    "description": {
      "long": ">>Foof!<<",
      "short": ">>Foof!<<"
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "foof4": {
    "id": "foof4",
    "title": "Foof4",
    "description": {
      "long": ">>Foof!<<",
      "short": ">>Foof!<<"
    },
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
    ],
    "conditions": {
      "ABOVE": true
    }
  },
  "foof5": {
    "id": "foof5",
    "title": "Foof5",
    "description": {
      "long": ">>Foof!<<",
      "short": ">>Foof!<<"
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  },
  "foof6": {
    "id": "foof6",
    "title": "Foof6",
    "description": {
      "long": ">>Foof!<<",
      "short": ">>Foof!<<"
    },
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
    ],
    "conditions": {
      "DEEP": true
    }
  }
};
