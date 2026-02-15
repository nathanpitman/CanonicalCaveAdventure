import { CANON_TRAVEL_VERBS, CANON_OBJECTS } from "./generatedStory";

const canonVerbSet = new Set(CANON_TRAVEL_VERBS);
const canonObjectIds = new Set(CANON_OBJECTS.map(o => o.id.toLowerCase()));
const canonObjectNames = new Map<string, string>();
CANON_OBJECTS.forEach(o => {
  canonObjectNames.set(o.name.toLowerCase(), o.id.toLowerCase());
  o.name.toLowerCase().split(" ").forEach(word => {
    if (word.length > 2) canonObjectNames.set(word, o.id.toLowerCase());
  });
});

export const STOPWORDS = new Set([
  "the", "a", "an", "to", "into", "onto", "at", "my", "some", "please",
  "this", "that", "those", "these", "just", "now", "then", "here", "there"
]);

export const ARTICLES = new Set(["the", "a", "an", "my", "that", "this", "some"]);

export const DIRECTION_SYNONYMS: Record<string, string> = {
  "north": "north", "n": "north", "northward": "north", "northwards": "north",
  "south": "south", "s": "south", "southward": "south", "southwards": "south",
  "east": "east", "e": "east", "eastward": "east", "eastwards": "east",
  "west": "west", "w": "west", "westward": "west", "westwards": "west",
  "up": "up", "u": "up", "upward": "up", "upwards": "up", "ascend": "up", "climb up": "up",
  "upwar": "up",
  "down": "down", "d": "down", "downward": "down", "downwards": "down", "descend": "down", "climb down": "down",
  "northeast": "ne", "ne": "ne",
  "northwest": "nw", "nw": "nw",
  "southeast": "se", "se": "se",
  "southwest": "sw", "sw": "sw",
  "in": "in", "inside": "in", "inward": "in", "inwards": "in",
  "inwar": "in", "insid": "in",
  "out": "out", "outside": "out", "outward": "out", "outwards": "out", "exit": "out", "leave": "out",
  "outsi": "out", "outdo": "out",
  "enter": "enter",
};

export const VERB_SYNONYMS: Record<string, string> = {
  "take": "take", "get": "take", "grab": "take", "pick": "take", "collect": "take",
  "acquire": "take", "snag": "take", "retrieve": "take",
  "drop": "drop", "discard": "drop", "put down": "drop",
  "look": "look", "examine": "look", "inspect": "look", "check": "look", "see": "look",
  "look around": "look", "look at": "look", "observe": "look", "describe": "look",
  "where am i": "look", "what do i see": "look",
  "inventory": "inventory", "inv": "inventory", "i": "inventory",
  "what do i have": "inventory", "what am i carrying": "inventory",
  "items": "inventory", "check inventory": "inventory", "show inventory": "inventory",
  "my items": "inventory", "bag": "inventory", "backpack": "inventory", "pockets": "inventory",
  "use": "use", "apply": "use", "activate": "use",
  "unlock": "open", "open": "open", "lift": "open",
  "break": "break", "smash": "break",
  "light": "light", "burn": "light",
  "pour": "pour", "fill": "fill", "empty": "empty",
  "drink": "drink", "eat": "eat",
  "push": "push", "pull": "pull", "turn": "turn",
  "close": "close", "lock": "close",
  "cut": "cut",
  "insert": "insert",
  "give": "give", "feed": "feed",
  "rub": "rub", "wave": "wave", "read": "read",
  "help": "help", "?": "help", "commands": "help",
  "what can i do": "help", "how to play": "help", "instructions": "help",
  "back": "back", "go back": "back", "return": "back", "retreat": "back",
  "turn back": "back", "retrace": "back",
  "new": "new", "new game": "new", "restart": "new", "start over": "new",
};

export const PREPOSITIONS = new Set([
  "to", "on", "with", "using", "into", "onto", "from", "at",
]);

export const MOVE_VERBS = new Set([
  "go", "move", "walk", "head", "travel", "proceed", "run", "crawl", "climb",
  "return", "back", "enter", "exit", "leave"
]);

export const TARGET_FIRST_VERBS = new Set([
  "unlock", "open", "lift", "break", "light", "pour",
  "push", "pull", "turn", "insert", "drop", "give", "feed",
  "close", "lock", "smash", "cut", "fill", "empty", "drink",
]);

export const NOUN_SYNONYMS: Record<string, string[]> = {
  "building": ["build", "building", "house", "wellhouse", "well house"],
  "house": ["build", "building", "house"],
  "well house": ["build", "building"],
  "wellhouse": ["build", "building"],
  "grate": ["grate", "enter", "in"],
  "depression": ["depre", "depression"],
  "stream": ["strea", "stream", "streambed"],
  "streambed": ["strea", "stream"],
  "valley": ["valle", "valley"],
  "forest": ["fores", "forest"],
  "road": ["road"],
  "hill": ["hill"],
  "slit": ["slit"],
  "pit": ["pit"],
  "passage": ["passa", "passage"],
  "canyon": ["canyo", "canyon"],
  "tunnel": ["tunne", "tunnel"],
  "cobbles": ["cobbl", "cobbles"],
  "debris": ["debri", "debris"],
  "stairs": ["stair", "stairs"],
  "hall": ["hall"],
  "room": ["room"],
  "cave": ["caver", "cavern", "cave"],
  "cavern": ["caver", "cavern"],
  "surface": ["surfa", "surface"],
  "oriental": ["orien", "oriental"],
  "shell": ["shell"],
  "reservoir": ["reser", "reservoir"],
  "bedquilt": ["bedqu", "bedquilt"],
  "y2": ["y2"],
};

export const MAGIC_WORD_VERBS = new Set([
  "say", "speak", "cast", "chant", "utter", "invoke",
]);

export function stripArticles(text: string): string {
  return text.split(/\s+/).filter(w => !ARTICLES.has(w)).join(" ").trim();
}

export function resolveItemId(phrase: string): string | null {
  const clean = stripArticles(phrase).toLowerCase();
  if (!clean) return null;
  if (canonObjectIds.has(clean)) return clean;
  const mapped = canonObjectNames.get(clean);
  if (mapped) return mapped;
  for (const word of clean.split(/\s+/)) {
    if (canonObjectIds.has(word)) return word;
    const m = canonObjectNames.get(word);
    if (m) return m;
  }
  return null;
}

export function isCanonicalVerb(token: string): boolean {
  return canonVerbSet.has(token.toLowerCase());
}

export function isCanonicalObject(token: string): boolean {
  const lower = token.toLowerCase();
  return canonObjectIds.has(lower) || canonObjectNames.has(lower);
}

export function getCanonicalObjectId(token: string): string | null {
  const lower = token.toLowerCase();
  if (canonObjectIds.has(lower)) return lower;
  return canonObjectNames.get(lower) || null;
}
