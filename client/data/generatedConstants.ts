// AUTO-GENERATED FROM import/adventure.yaml - DO NOT EDIT MANUALLY
// Generated: 2026-03-06T09:33:14.910Z
// Run: npx tsx tools/importOpenAdventure.ts to regenerate

// ============================================================
// OBJECT STATE CONSTANTS
// ============================================================
export const LAMP_DARK = 0;
export const LAMP_BRIGHT = 1;
export const GRATE_CLOSED = 0;
export const GRATE_OPEN = 1;
export const STEPS_DOWN = 0;
export const STEPS_UP = 1;
export const BIRD_UNCAGED = 0;
export const BIRD_CAGED = 1;
export const BIRD_FOREST_UNCAGED = 2;
export const DOOR_RUSTED = 0;
export const DOOR_UNRUSTED = 1;
export const SNAKE_BLOCKS = 0;
export const SNAKE_CHASED = 1;
export const UNBRIDGED = 0;
export const BRIDGED = 1;
export const WATER_BOTTLE = 0;
export const EMPTY_BOTTLE = 1;
export const OIL_BOTTLE = 2;
export const MIRROR_UNBROKEN = 0;
export const MIRROR_BROKEN = 1;
export const PLANT_THIRSTY = 0;
export const PLANT_BELLOWING = 1;
export const PLANT_GROWN = 2;
export const AXE_HERE = 0;
export const AXE_LOST = 1;
export const DRAGON_BARS = 0;
export const DRAGON_DEAD = 1;
export const DRAGON_BLOODLESS = 2;
export const TROLL_BRIDGE = 0;
export const BRIDGE_WRECKED = 1;
export const TROLL_UNPAID = 0;
export const TROLL_PAIDONCE = 1;
export const TROLL_GONE = 2;
export const UNTAMED_BEAR = 0;
export const SITTING_BEAR = 1;
export const CONTENTED_BEAR = 2;
export const BEAR_DEAD = 3;
export const VEND_BLOCKS = 0;
export const VEND_UNBLOCKS = 1;
export const FRESH_BATTERIES = 0;
export const DEAD_BATTERIES = 1;
export const URN_EMPTY = 0;
export const URN_DARK = 1;
export const URN_LIT = 2;
export const CAVITY_FULL = 0;
export const CAVITY_EMPTY = 1;
export const WATERS_UNPARTED = 0;
export const WATERS_PARTED = 1;
export const INGAME_SIGN = 0;
export const ENDGAME_SIGN = 1;
export const EGGS_HERE = 0;
export const EGGS_VANISHED = 1;
export const EGGS_DONE = 2;
export const VASE_WHOLE = 0;
export const VASE_DROPPED = 1;
export const VASE_BROKEN = 2;
export const RUG_FLOOR = 0;
export const RUG_DRAGON = 1;
export const RUG_HOVER = 2;
export const CHAIN_HEAP = 0;
export const CHAINING_BEAR = 1;
export const CHAIN_FIXED = 2;
export const AMBER_IN_URN = 0;
export const AMBER_IN_ROCK = 1;

// ============================================================
// DWARF CONFIGURATION
// ============================================================
export const NDWARVES = 5;
export const PIRATE_INDEX = 5;
export const DWARF_START_LOCS: string[] = [
  "kinghall",
  "westbank",
  "y2",
  "alike3",
  "complex",
  "mazeend12"
];
export const DALTLC = "nugget";
export const CHEST_HIDE_LOC = "mazeend12";
export const MESSAGE_HIDE_LOC = "mazeend2";

// ============================================================
// STORY MESSAGES (dwarf, pirate, NPC combat messages)
// ============================================================
export const STORY_MESSAGES: Record<string, string> = {
  "DWARF_BLOCK": "A little dwarf with a big knife blocks your way.",
  "DWARF_RAN": "A little dwarf just walked around a corner, saw you, threw a little axe at you which missed, cursed, and ran away.",
  "DWARF_PACK": "There are %d threatening little dwarves in the room with you.",
  "DWARF_SINGLE": "There is a threatening little dwarf in the room with you!",
  "KNIFE_THROWN": "One sharp nasty knife is thrown at you!",
  "GETS_YOU": "It gets you!",
  "MISSES_YOU": "It misses!",
  "KILLED_DWARF": "You killed a little dwarf.",
  "DWARF_DODGES": "You attack a little dwarf, but he dodges out of the way.",
  "PIRATE_RUSTLES": "There are faint rustling noises from the darkness behind you.",
  "PIRATE_POUNCES": "Out from the shadows behind you pounces a bearded pirate! \"Har, har,\" he chortles, \"I'll just take all this booty and hide it away with me chest deep in the maze!\" He snatches your treasure and vanishes into the gloom.",
  "PIRATE_SPOTTED": "There are faint rustling noises from the darkness behind you. As you turn toward them, the beam of your lamp falls across a bearded pirate. He is carrying a large chest. \"Shiver me timbers!\" he cries, \"I've been spotted! I'd best hie meself off to the maze to hide me chest!\" With that, he vanishes into the gloom.",
  "KNIVES_VANISH": "The dwarves' knives vanish as they strike the walls of the cave.",
  "BEAR_BLOCKS": "There is no way to get past the bear to unlock the chain, which is probably just as well.",
  "BIRD_ATTACKS": "The little bird attacks the green snake, and in an astounding flurry drives the snake away.",
  "BIRD_DEAD": "The little bird is now dead. Its body disappears.",
  "BIRD_DEVOURED": "The snake has now devoured your bird.",
  "BIRD_PINING": "It's not hungry (it's merely pinin' for the fjords). Besides, you have no bird seed.",
  "BIRD_EVADES": "The bird seemed unafraid at first, but as you approach it becomes disturbed and you cannot catch it.",
  "CANNOT_CARRY": "You can catch the bird, but you cannot carry it.",
  "SNAKE_WARNING": "Attacking the snake both doesn't work and is very dangerous.",
  "OGRE_SNARL": "The ogre snarls and shoves you back.",
  "CARRY_LIMIT": "You can't carry anything more. You'll have to drop something first."
};

// ============================================================
// MOTION VOCABULARY (from motions section)
// ============================================================
export const MOTION_VOCABULARY: Record<string, string[]> = {
  "MOT_2": [
    "road",
    "hill"
  ],
  "ENTER": [
    "enter"
  ],
  "MOT_4": [
    "upstr"
  ],
  "MOT_5": [
    "downs"
  ],
  "MOT_6": [
    "fores"
  ],
  "FORWARD": [
    "forwa",
    "conti",
    "onwar"
  ],
  "BACK": [
    "back",
    "retur",
    "retre"
  ],
  "MOT_9": [
    "valle"
  ],
  "MOT_10": [
    "stair"
  ],
  "OUTSIDE": [
    "out",
    "outsi",
    "exit",
    "leave"
  ],
  "MOT_12": [
    "build",
    "house"
  ],
  "MOT_13": [
    "gully"
  ],
  "STREAM": [
    "strea"
  ],
  "MOT_15": [
    "fork"
  ],
  "MOT_16": [
    "bed"
  ],
  "CRAWL": [
    "crawl"
  ],
  "MOT_18": [
    "cobbl"
  ],
  "INSIDE": [
    "inwar",
    "insid",
    "in"
  ],
  "MOT_20": [
    "surfa"
  ],
  "NUL": [
    "null",
    "nowhe"
  ],
  "MOT_22": [
    "dark"
  ],
  "MOT_23": [
    "passa",
    "tunne"
  ],
  "MOT_24": [
    "low"
  ],
  "MOT_25": [
    "canyo"
  ],
  "MOT_26": [
    "awkwa"
  ],
  "MOT_27": [
    "giant"
  ],
  "MOT_28": [
    "view"
  ],
  "UP": [
    "upwar",
    "up",
    "u",
    "above",
    "ascen"
  ],
  "DOWN": [
    "d",
    "downw",
    "down",
    "desce"
  ],
  "MOT_31": [
    "pit"
  ],
  "MOT_32": [
    "outdo"
  ],
  "MOT_33": [
    "crack"
  ],
  "MOT_34": [
    "steps"
  ],
  "MOT_35": [
    "dome"
  ],
  "LEFT": [
    "left"
  ],
  "RIGHT": [
    "right"
  ],
  "MOT_38": [
    "hall"
  ],
  "MOT_39": [
    "jump"
  ],
  "MOT_40": [
    "barre"
  ],
  "MOT_41": [
    "over"
  ],
  "MOT_42": [
    "acros"
  ],
  "EAST": [
    "east",
    "e"
  ],
  "WEST": [
    "west",
    "w"
  ],
  "NORTH": [
    "north",
    "n"
  ],
  "SOUTH": [
    "south",
    "s"
  ],
  "NE": [
    "ne"
  ],
  "SE": [
    "se"
  ],
  "SW": [
    "sw"
  ],
  "NW": [
    "nw"
  ],
  "MOT_51": [
    "debri"
  ],
  "MOT_52": [
    "hole"
  ],
  "MOT_53": [
    "wall"
  ],
  "MOT_54": [
    "broke"
  ],
  "MOT_55": [
    "y2"
  ],
  "MOT_56": [
    "climb"
  ],
  "LOOK": [
    "l",
    "x",
    "look",
    "exami",
    "touch",
    "descr"
  ],
  "MOT_58": [
    "floor"
  ],
  "MOT_59": [
    "room"
  ],
  "MOT_60": [
    "slit"
  ],
  "MOT_61": [
    "slab",
    "slabr"
  ],
  "XYZZY": [
    "xyzzy"
  ],
  "DEPRESSION": [
    "depre"
  ],
  "ENTRANCE": [
    "entra"
  ],
  "PLUGH": [
    "plugh"
  ],
  "MOT_66": [
    "secre"
  ],
  "CAVE": [
    "cave"
  ],
  "CROSS": [
    "cross"
  ],
  "BEDQUILT": [
    "bedqu"
  ],
  "PLOVER": [
    "plove"
  ],
  "ORIENTAL": [
    "orien"
  ],
  "CAVERN": [
    "caver"
  ],
  "SHELLROOM": [
    "shell"
  ],
  "RESERVOIR": [
    "reser"
  ],
  "OFFICE": [
    "main",
    "offic"
  ]
};

// ============================================================
// ACTION VERB VOCABULARY (from actions section)
// ============================================================
export const ACTION_VOCABULARY: Record<string, string[]> = {
  "CARRY": [
    "g",
    "carry",
    "take",
    "keep",
    "catch",
    "steal",
    "captu",
    "get",
    "tote",
    "snarf"
  ],
  "DROP": [
    "drop",
    "relea",
    "free",
    "disca",
    "dump"
  ],
  "SAY": [
    "say",
    "chant",
    "sing",
    "utter",
    "mumbl"
  ],
  "UNLOCK": [
    "unloc",
    "open"
  ],
  "NOTHING": [
    "z",
    "nothi"
  ],
  "LOCK": [
    "lock",
    "close"
  ],
  "LIGHT": [
    "light",
    "on"
  ],
  "EXTINGUISH": [
    "extin",
    "off"
  ],
  "WAVE": [
    "wave",
    "shake",
    "swing"
  ],
  "TAME": [
    "calm",
    "placa",
    "tame"
  ],
  "GO": [
    "walk",
    "run",
    "trave",
    "go",
    "proce",
    "conti",
    "explo",
    "follo",
    "turn"
  ],
  "ATTACK": [
    "attac",
    "kill",
    "fight",
    "hit",
    "strik",
    "slay"
  ],
  "POUR": [
    "pour"
  ],
  "EAT": [
    "eat",
    "devou"
  ],
  "DRINK": [
    "drink"
  ],
  "RUB": [
    "rub"
  ],
  "THROW": [
    "throw",
    "toss"
  ],
  "QUIT": [
    "quit"
  ],
  "FIND": [
    "find",
    "where"
  ],
  "INVENTORY": [
    "i",
    "inven"
  ],
  "FEED": [
    "feed"
  ],
  "FILL": [
    "fill"
  ],
  "BLAST": [
    "blast",
    "deton",
    "ignit",
    "blowu"
  ],
  "SCORE": [
    "score"
  ],
  "FEE": [
    "fee"
  ],
  "FIE": [
    "fie"
  ],
  "FOE": [
    "foe"
  ],
  "FOO": [
    "foo"
  ],
  "FUM": [
    "fum"
  ],
  "BRIEF": [
    "brief"
  ],
  "READ": [
    "read",
    "perus"
  ],
  "BREAK": [
    "break",
    "shatt",
    "smash"
  ],
  "WAKE": [
    "wake",
    "distu"
  ],
  "SAVE": [
    "suspe",
    "pause",
    "save"
  ],
  "RESUME": [
    "resum",
    "resta"
  ],
  "FLY": [
    "fly"
  ],
  "LISTEN": [
    "liste"
  ],
  "PART": [
    "z'zzz"
  ],
  "SEED": [
    "seed"
  ],
  "WASTE": [
    "waste"
  ],
  "THANKYOU": [
    "thank"
  ],
  "INVALIDMAGIC": [
    "sesam",
    "opens",
    "abra",
    "abrac",
    "shaza",
    "hocus",
    "pocus"
  ],
  "HELP": [
    "help",
    "?"
  ],
  "NO": [
    "no"
  ],
  "TREE": [
    "tree",
    "trees"
  ],
  "DIG": [
    "dig",
    "excav"
  ],
  "LOST": [
    "lost"
  ],
  "MIST": [
    "mist"
  ],
  "FBOMB": [
    "fuck"
  ],
  "STOP": [
    "stop"
  ],
  "INFO": [
    "info",
    "infor"
  ],
  "SWIM": [
    "swim"
  ],
  "WIZARD": [
    "wizar"
  ],
  "YES": [
    "yes"
  ],
  "NEWS": [
    "news"
  ],
  "ACT_VERSION": [
    "versi"
  ]
};

// ============================================================
// DIRECTION SYNONYMS (derived from motions)
// ============================================================
export const YAML_DIRECTION_SYNONYMS: Record<string, string> = {
  "enter": "enter",
  "out": "out",
  "outsi": "out",
  "exit": "out",
  "leave": "out",
  "inwar": "in",
  "insid": "in",
  "in": "in",
  "upwar": "up",
  "up": "up",
  "u": "up",
  "above": "up",
  "ascen": "up",
  "d": "down",
  "downw": "down",
  "down": "down",
  "desce": "down",
  "east": "east",
  "e": "east",
  "west": "west",
  "w": "west",
  "north": "north",
  "n": "north",
  "south": "south",
  "s": "south",
  "ne": "ne",
  "se": "se",
  "sw": "sw",
  "nw": "nw"
};

// ============================================================
// NOUN SYNONYMS (derived from object words)
// ============================================================
export const YAML_NOUN_SYNONYMS: Record<string, string[]> = {
  "keys": [
    "keys",
    "key"
  ],
  "lamp": [
    "lamp",
    "lante"
  ],
  "grate": [
    "grate"
  ],
  "cage": [
    "cage"
  ],
  "rod": [
    "rod"
  ],
  "rod2": [
    "rod"
  ],
  "steps": [
    "steps"
  ],
  "bird": [
    "bird"
  ],
  "door": [
    "door"
  ],
  "pillow": [
    "pillo",
    "velve"
  ],
  "snake": [
    "snake"
  ],
  "fissure": [
    "fissu"
  ],
  "obj_13": [
    "table"
  ],
  "clam": [
    "clam"
  ],
  "oyster": [
    "oyste"
  ],
  "magazine": [
    "magaz",
    "issue",
    "spelu",
    "\"spel"
  ],
  "dwarf": [
    "dwarf",
    "dwarv"
  ],
  "knife": [
    "knife",
    "knive"
  ],
  "food": [
    "food",
    "ratio"
  ],
  "bottle": [
    "bottl",
    "jar"
  ],
  "water": [
    "water",
    "h2o"
  ],
  "oil": [
    "oil"
  ],
  "mirror": [
    "mirro"
  ],
  "plant": [
    "plant",
    "beans"
  ],
  "plant2": [
    "plant"
  ],
  "obj_26": [
    "stala"
  ],
  "obj_27": [
    "shado",
    "figur",
    "windo"
  ],
  "axe": [
    "axe"
  ],
  "obj_29": [
    "drawi"
  ],
  "obj_30": [
    "pirat",
    "genie",
    "djinn"
  ],
  "dragon": [
    "drago"
  ],
  "chasm": [
    "chasm"
  ],
  "troll": [
    "troll"
  ],
  "troll2": [
    "troll"
  ],
  "bear": [
    "bear"
  ],
  "messag": [
    "messa"
  ],
  "volcano": [
    "volca",
    "geyse"
  ],
  "vend": [
    "machi",
    "vendi"
  ],
  "battery": [
    "batte"
  ],
  "obj_40": [
    "carpe",
    "moss"
  ],
  "ogre": [
    "ogre"
  ],
  "urn": [
    "urn"
  ],
  "cavity": [
    "cavit"
  ],
  "blood": [
    "blood"
  ],
  "reser": [
    "reser"
  ],
  "rabbitfoot": [
    "appen",
    "lepor"
  ],
  "obj_47": [
    "mud"
  ],
  "obj_48": [
    "note"
  ],
  "sign": [
    "sign"
  ],
  "nugget": [
    "gold",
    "nugge"
  ],
  "obj_51": [
    "diamo"
  ],
  "obj_52": [
    "silve",
    "bars"
  ],
  "obj_53": [
    "jewel"
  ],
  "coins": [
    "coins"
  ],
  "chest": [
    "chest",
    "box",
    "treas"
  ],
  "eggs": [
    "eggs",
    "egg",
    "nest"
  ],
  "trident": [
    "tride"
  ],
  "vase": [
    "vase",
    "ming",
    "shard",
    "potte"
  ],
  "emerald": [
    "emera"
  ],
  "pyramid": [
    "plati",
    "pyram"
  ],
  "pearl": [
    "pearl"
  ],
  "rug": [
    "rug",
    "persi"
  ],
  "obj_63": [
    "spice"
  ],
  "chain": [
    "chain"
  ],
  "ruby": [
    "ruby"
  ],
  "jade": [
    "jade",
    "neckl"
  ],
  "amber": [
    "amber",
    "gemst"
  ],
  "sapph": [
    "sapph"
  ],
  "obj_69": [
    "ebony",
    "statu"
  ]
};

// ============================================================
// VERB SYNONYMS (derived from actions vocabulary + NLP extensions)
// ============================================================
export const YAML_VERB_SYNONYMS: Record<string, string> = {
  "carry": "take",
  "take": "take",
  "keep": "take",
  "catch": "take",
  "steal": "take",
  "captu": "take",
  "get": "take",
  "tote": "take",
  "snarf": "take",
  "grab": "take",
  "pick": "take",
  "collect": "take",
  "acquire": "take",
  "snag": "take",
  "retrieve": "take",
  "nab": "take",
  "snatch": "take",
  "seize": "take",
  "swipe": "take",
  "pocket": "take",
  "pluck": "take",
  "gather": "take",
  "obtain": "take",
  "hold": "take",
  "fetch": "take",
  "claim": "take",
  "capture": "take",
  "drop": "drop",
  "relea": "drop",
  "free": "drop",
  "disca": "drop",
  "dump": "drop",
  "discard": "drop",
  "put down": "drop",
  "abandon": "drop",
  "ditch": "drop",
  "throw away": "drop",
  "lay down": "drop",
  "place": "drop",
  "deposit": "drop",
  "leave behind": "drop",
  "get rid of": "drop",
  "say": "say",
  "chant": "say",
  "sing": "say",
  "utter": "say",
  "mumbl": "say",
  "unloc": "open",
  "open": "open",
  "lift": "open",
  "pry": "open",
  "force": "open",
  "unseal": "open",
  "lock": "close",
  "close": "close",
  "slam": "close",
  "seal": "close",
  "bar": "close",
  "fasten": "close",
  "light": "light",
  "on": "light",
  "burn": "light",
  "ignite": "light",
  "kindle": "light",
  "spark": "light",
  "set fire": "light",
  "extin": "extinguish",
  "off": "extinguish",
  "wave": "wave",
  "shake": "wave",
  "swing": "wave",
  "brandish": "wave",
  "flourish": "wave",
  "calm": "tame",
  "placa": "tame",
  "tame": "tame",
  "walk": "go",
  "run": "go",
  "trave": "go",
  "go": "go",
  "proce": "go",
  "conti": "go",
  "explo": "go",
  "follo": "go",
  "turn": "turn",
  "move": "go",
  "head": "go",
  "travel": "go",
  "proceed": "go",
  "crawl": "go",
  "climb": "go",
  "return": "back",
  "back": "back",
  "enter": "go",
  "exit": "go",
  "leave": "go",
  "sprint": "go",
  "dash": "go",
  "wander": "go",
  "venture": "go",
  "trek": "go",
  "hike": "go",
  "stride": "go",
  "attac": "attack",
  "kill": "attack",
  "fight": "attack",
  "hit": "attack",
  "strik": "attack",
  "slay": "attack",
  "punch": "attack",
  "stab": "attack",
  "hack": "attack",
  "bash": "attack",
  "whack": "attack",
  "swing at": "attack",
  "assault": "attack",
  "battle": "attack",
  "pour": "pour",
  "spill": "pour",
  "splash": "pour",
  "tip": "pour",
  "eat": "eat",
  "devou": "eat",
  "munch": "eat",
  "chew": "eat",
  "bite": "eat",
  "nibble": "eat",
  "taste": "eat",
  "snack": "eat",
  "dine": "eat",
  "feast": "eat",
  "swallow": "eat",
  "ingest": "eat",
  "drink": "drink",
  "swig": "drink",
  "chug": "drink",
  "imbibe": "drink",
  "slurp": "drink",
  "sample": "drink",
  "rub": "rub",
  "polish": "rub",
  "buff": "rub",
  "stroke": "rub",
  "caress": "rub",
  "wipe": "rub",
  "clean": "rub",
  "massage": "rub",
  "shine": "rub",
  "throw": "throw",
  "toss": "throw",
  "fling": "throw",
  "hurl": "throw",
  "lob": "throw",
  "launch": "throw",
  "chuck": "throw",
  "pitch": "throw",
  "heave": "throw",
  "quit": "quit",
  "find": "find",
  "where": "find",
  "i": "inventory",
  "inven": "inventory",
  "feed": "feed",
  "fill": "fill",
  "top off": "fill",
  "load": "fill",
  "blast": "blast",
  "deton": "blast",
  "ignit": "blast",
  "blowu": "blast",
  "score": "score",
  "brief": "brief",
  "read": "read",
  "perus": "read",
  "decipher": "read",
  "translate": "read",
  "break": "break",
  "shatt": "break",
  "smash": "break",
  "shatter": "break",
  "wreck": "break",
  "crush": "break",
  "bust": "break",
  "demolish": "break",
  "wake": "wake",
  "distu": "wake",
  "liste": "listen",
  "help": "help",
  "?": "help",
  "commands": "help",
  "what can i do": "help",
  "how to play": "help",
  "instructions": "help",
  "hint": "help",
  "what do i do": "help",
  "stuck": "help",
  "clue": "help",
  "dig": "dig",
  "excav": "dig",
  "swim": "swim",
  "look": "look",
  "examine": "look",
  "inspect": "look",
  "check": "look",
  "see": "look",
  "look around": "look",
  "look at": "look",
  "observe": "look",
  "describe": "look",
  "where am i": "look",
  "what do i see": "look",
  "study": "look",
  "search": "look",
  "scan": "look",
  "view": "look",
  "peer": "look",
  "gaze": "look",
  "survey": "look",
  "scrutinize": "look",
  "peek": "look",
  "glance": "look",
  "what is here": "look",
  "surroundings": "look",
  "describe room": "look",
  "what do i have": "inventory",
  "what am i carrying": "inventory",
  "items": "inventory",
  "check inventory": "inventory",
  "show inventory": "inventory",
  "my items": "inventory",
  "bag": "inventory",
  "backpack": "inventory",
  "pockets": "inventory",
  "what am i holding": "inventory",
  "check bag": "inventory",
  "possessions": "inventory",
  "belongings": "inventory",
  "use": "use",
  "apply": "use",
  "activate": "use",
  "employ": "use",
  "utilize": "use",
  "operate": "use",
  "try": "use",
  "wield": "use",
  "engage": "use",
  "interact": "use",
  "work": "use",
  "push": "push",
  "shove": "push",
  "press": "push",
  "nudge": "push",
  "bump": "push",
  "pull": "pull",
  "yank": "pull",
  "tug": "pull",
  "drag": "pull",
  "haul": "pull",
  "cut": "cut",
  "slash": "cut",
  "carve": "cut",
  "chop": "cut",
  "slice": "cut",
  "sever": "cut",
  "insert": "insert",
  "give": "give",
  "offer": "give",
  "hand": "give",
  "present": "give",
  "donate": "give",
  "pass": "give",
  "empty": "empty",
  "go back": "back",
  "retreat": "back",
  "turn back": "back",
  "retrace": "back",
  "new": "new",
  "new game": "new",
  "restart": "new",
  "start over": "new",
  "directions": "directions",
  "exits": "directions",
  "where can i go": "directions",
  "which way": "directions",
  "paths": "directions",
  "ways": "directions",
  "available exits": "directions",
  "show exits": "directions"
};

// ============================================================
// MOVE VERBS (derived from GO action + NLP extensions)
// ============================================================
export const YAML_MOVE_VERBS: string[] = [
  "walk",
  "run",
  "trave",
  "go",
  "proce",
  "conti",
  "explo",
  "follo",
  "turn",
  "move",
  "head",
  "travel",
  "proceed",
  "crawl",
  "climb",
  "return",
  "back",
  "enter",
  "exit",
  "leave",
  "sprint",
  "dash",
  "wander",
  "venture",
  "trek",
  "hike",
  "stride"
];

// ============================================================
// TARGET-FIRST VERBS (verbs where the object typically precedes the action)
// ============================================================
export const YAML_TARGET_FIRST_VERBS: string[] = [
  "open",
  "unloc",
  "lift",
  "pry",
  "force",
  "unseal",
  "break",
  "shatt",
  "smash",
  "shatter",
  "wreck",
  "crush",
  "bust",
  "demolish",
  "light",
  "on",
  "burn",
  "ignite",
  "kindle",
  "spark",
  "set fire",
  "pour",
  "spill",
  "splash",
  "tip",
  "close",
  "lock",
  "slam",
  "seal",
  "bar",
  "fasten",
  "throw",
  "toss",
  "fling",
  "hurl",
  "lob",
  "launch",
  "chuck",
  "pitch",
  "heave",
  "fill",
  "top off",
  "load",
  "drop",
  "relea",
  "free",
  "disca",
  "dump",
  "discard",
  "put down",
  "abandon",
  "ditch",
  "throw away",
  "lay down",
  "place",
  "deposit",
  "leave behind",
  "get rid of",
  "feed",
  "attack",
  "attac",
  "kill",
  "fight",
  "hit",
  "strik",
  "slay",
  "punch",
  "stab",
  "hack",
  "bash",
  "whack",
  "swing at",
  "assault",
  "battle",
  "eat",
  "devou",
  "munch",
  "chew",
  "bite",
  "nibble",
  "taste",
  "snack",
  "dine",
  "feast",
  "swallow",
  "ingest",
  "drink",
  "swig",
  "chug",
  "imbibe",
  "slurp",
  "sample",
  "rub",
  "polish",
  "buff",
  "stroke",
  "caress",
  "wipe",
  "clean",
  "massage",
  "shine",
  "wave",
  "shake",
  "swing",
  "brandish",
  "flourish",
  "read",
  "perus",
  "decipher",
  "translate",
  "push",
  "shove",
  "press",
  "nudge",
  "bump",
  "pull",
  "yank",
  "tug",
  "drag",
  "haul",
  "cut",
  "slash",
  "carve",
  "chop",
  "slice",
  "sever",
  "insert",
  "give",
  "offer",
  "hand",
  "present",
  "donate",
  "pass",
  "empty"
];

// ============================================================
// MAZE SCENE IDS (derived from location conditions)
// ============================================================
export const YAML_MAZE_SCENE_IDS: string[] = [
  "alike1",
  "alike10",
  "alike11",
  "alike12",
  "alike13",
  "alike14",
  "alike2",
  "alike3",
  "alike4",
  "alike5",
  "alike6",
  "alike7",
  "alike8",
  "alike9",
  "deadend13",
  "different1",
  "different10",
  "different11",
  "different2",
  "different3",
  "different4",
  "different5",
  "different6",
  "different7",
  "different8",
  "different9",
  "mazeend1",
  "mazeend10",
  "mazeend11",
  "mazeend12",
  "mazeend2",
  "mazeend3",
  "mazeend4",
  "mazeend5",
  "mazeend6",
  "mazeend8",
  "mazeend9",
  "pitbrink",
  "topstalactite"
];

// ============================================================
// SCORE CLASSES (from classes section)
// ============================================================
export interface ScoreClass {
  threshold: number;
  message: string;
}
export const SCORE_CLASSES: ScoreClass[] = [
  {
    "threshold": 45,
    "message": "You are obviously a rank amateur. Better luck next time."
  },
  {
    "threshold": 120,
    "message": "Your score qualifies you as a novice class adventurer."
  },
  {
    "threshold": 170,
    "message": "You have achieved the rating: \"Experienced Adventurer\"."
  },
  {
    "threshold": 250,
    "message": "You may now consider yourself a \"Seasoned Adventurer\"."
  },
  {
    "threshold": 320,
    "message": "You have reached \"Junior Master\" status."
  },
  {
    "threshold": 375,
    "message": "Your score puts you in Master Adventurer Class C."
  },
  {
    "threshold": 410,
    "message": "Your score puts you in Master Adventurer Class B."
  },
  {
    "threshold": 426,
    "message": "Your score puts you in Master Adventurer Class A."
  },
  {
    "threshold": 429,
    "message": "All of Adventuredom gives tribute to you, Adventurer Grandmaster!"
  },
  {
    "threshold": 9999,
    "message": "Adventuredom stands in awe -- you have now joined the ranks of the W O R L D C H A M P I O N A D V E N T U R E R S ! It may interest you to know that the Dungeon-Master himself has, to my knowledge, never achieved this threshold in fewer than 330 turns."
  }
];
