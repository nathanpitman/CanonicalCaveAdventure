/**
 * ADDITIVE LEXICON LAYER
 * 
 * This module provides synonym mappings and input normalization to make the
 * text parser more forgiving while preserving canonical Open Adventure commands.
 * 
 * Design principles:
 * - ADDITIVE only: canonical commands always work unchanged
 * - Context-driven: uses available actions to resolve ambiguity
 * - No magic word hints: doesn't auto-correct into secret words
 */

import { CANON_TRAVEL_VERBS, CANON_OBJECTS, Action } from "./generatedStory";

// Build canonical sets for fast lookup
const canonVerbSet = new Set(CANON_TRAVEL_VERBS);
const canonObjectIds = new Set(CANON_OBJECTS.map(o => o.id.toLowerCase()));
const canonObjectNames = new Map<string, string>();
CANON_OBJECTS.forEach(o => {
  canonObjectNames.set(o.name.toLowerCase(), o.id.toLowerCase());
  o.name.toLowerCase().split(" ").forEach(word => {
    if (word.length > 2) canonObjectNames.set(word, o.id.toLowerCase());
  });
});

// Stopwords to strip from input
const STOPWORDS = new Set([
  "the", "a", "an", "to", "into", "onto", "at", "my", "some", "please",
  "this", "that", "those", "these", "just", "now", "then", "here", "there"
]);

const ARTICLES = new Set(["the", "a", "an", "my", "that", "this", "some"]);

// Direction synonyms -> canonical direction tokens
// Includes canonical YAML stems (inwar, upwar, outsi, etc.)
const DIRECTION_SYNONYMS: Record<string, string> = {
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

// Movement verb synonyms for "go to X" patterns
const MOVE_VERBS = new Set([
  "go", "move", "walk", "head", "travel", "proceed", "run", "crawl", "climb",
  "return", "back", "enter", "exit", "leave"
]);

// Action verb synonyms -> canonical action
const ACTION_SYNONYMS: Record<string, string> = {
  "take": "take", "get": "take", "grab": "take", "pick up": "take", "collect": "take",
  "pick": "take", "acquire": "take", "snag": "take", "retrieve": "take",
  "drop": "drop", "leave": "drop", "put down": "drop", "discard": "drop",
  "look": "look", "examine": "look", "inspect": "look", "check": "look", "see": "look",
  "look at": "look", "look around": "look",
  "inventory": "inventory", "inv": "inventory", "i": "inventory",
  "what do i have": "inventory", "what am i carrying": "inventory",
  "use": "use", "apply": "use", "activate": "use",
};

// Noun phrase synonyms -> canonical tokens (for "go to X" resolution)
const NOUN_SYNONYMS: Record<string, string[]> = {
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

// Verbs that can precede a target in "<verb> <target> with/using <item>" patterns
const TARGET_FIRST_VERBS = new Set([
  "unlock", "open", "lift", "break", "light", "pour",
  "push", "pull", "turn", "insert", "drop", "give", "feed",
  "close", "lock", "smash", "cut", "fill", "empty",
]);

// Prepositions that separate item from target
const PREPOSITIONS = new Set([
  "to", "on", "with", "using", "into", "onto", "from", "at",
]);

export interface NormalizedCommand {
  intent: "move" | "take" | "use" | "look" | "inventory" | "help" | "back" | "unknown";
  canonicalTokens: string[];
  rawTokens: string[];
  targetNoun?: string;
  resolvedActionId?: string;
  itemToken?: string;
  targetToken?: string;
  verbToken?: string;
  preposition?: string;
}

function stripArticles(text: string): string {
  return text.split(/\s+/).filter(w => !ARTICLES.has(w)).join(" ").trim();
}

function resolveItemId(phrase: string): string | null {
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

function tryStructuredParse(input: string): Pick<NormalizedCommand, "itemToken" | "targetToken" | "verbToken" | "preposition"> | null {
  const text = input.toLowerCase().replace(/[.,!?;:'"]/g, "").trim();

  // Pattern A1: use/apply/activate <item> (to|on|with|using|into) <target>
  const useWithTarget = /^(use|apply|activate)\s+(.+?)\s+(to|on|with|using|into|onto|at)\s+(.+)$/;
  const m1 = text.match(useWithTarget);
  if (m1) {
    const itemRaw = stripArticles(m1[2]);
    const prep = m1[3];
    const targetRaw = stripArticles(m1[4]);
    const itemId = resolveItemId(itemRaw);
    const targetId = resolveItemId(targetRaw);
    return {
      itemToken: itemId || itemRaw,
      targetToken: targetId || targetRaw,
      verbToken: "use",
      preposition: prep,
    };
  }

  // Pattern A2: use/apply/activate <item> to <verb> <target>
  const useToVerb = /^(use|apply|activate)\s+(.+?)\s+to\s+(open|unlock|lift|break|light|pour|push|pull|turn|insert|close|lock|smash|cut|fill|empty)\s+(.+)$/;
  const m2 = text.match(useToVerb);
  if (m2) {
    const itemRaw = stripArticles(m2[2]);
    const verb = m2[3];
    const targetRaw = stripArticles(m2[4]);
    const itemId = resolveItemId(itemRaw);
    const targetId = resolveItemId(targetRaw);
    return {
      itemToken: itemId || itemRaw,
      targetToken: targetId || targetRaw,
      verbToken: verb,
      preposition: "to",
    };
  }

  // Pattern A3: <verb> <target> (with|using) <item>
  const verbTargetWith = /^(unlock|open|lift|break|light|pour|push|pull|turn|insert|close|lock|smash|cut|fill|empty|drink)\s+(.+?)\s+(with|using|from)\s+(.+)$/;
  const m3 = text.match(verbTargetWith);
  if (m3) {
    const verb = m3[1];
    const targetRaw = stripArticles(m3[2]);
    const prep = m3[3];
    const itemRaw = stripArticles(m3[4]);
    const itemId = resolveItemId(itemRaw);
    const targetId = resolveItemId(targetRaw);
    return {
      itemToken: itemId || itemRaw,
      targetToken: targetId || targetRaw,
      verbToken: verb,
      preposition: prep,
    };
  }

  // Pattern A4: <verb> <item> (no target, single-verb item actions)
  // e.g. "light lamp", "drink water", "pour oil"
  const singleVerbItem = /^(light|drink|pour|eat|burn|rub|wave|read|fill|empty)\s+(.+)$/;
  const m4 = text.match(singleVerbItem);
  if (m4) {
    const verb = m4[1];
    const itemRaw = stripArticles(m4[2]);
    const itemId = resolveItemId(itemRaw);
    if (itemId) {
      return {
        itemToken: itemId,
        targetToken: undefined,
        verbToken: verb,
        preposition: undefined,
      };
    }
  }

  return null;
}

/**
 * Normalize a command input, resolving synonyms to canonical tokens.
 * Uses context (available actions) to disambiguate.
 */
export function normalizeCommand(
  input: string,
  availableActions: Action[]
): NormalizedCommand {
  const raw = input.trim().toLowerCase();
  
  // Strip punctuation only for pattern matching (keep stopwords for patterns that need them)
  const withPunctuation = raw.replace(/[.,!?;:'"]/g, "");
  
  // Also create a version without stopwords for fallback matching
  const cleaned = withPunctuation
    .split(/\s+/)
    .filter(word => !STOPWORDS.has(word))
    .join(" ");
  
  const rawTokens = withPunctuation.split(/\s+/).filter(Boolean);
  
  // Build set of available action tokens for context
  const availableActionIds = new Set(availableActions.map(a => a.id.toLowerCase()));
  const availableMoveTargets = new Set<string>();
  availableActions.forEach(a => {
    if (a.type === "move") {
      const token = a.id.replace(/^go_/, "");
      availableMoveTargets.add(token);
      availableMoveTargets.add(a.label.toLowerCase());
    }
  });

  // === Structured item/target parsing (before generic action handling) ===
  const structured = tryStructuredParse(withPunctuation);
  if (structured && structured.itemToken) {
    return {
      intent: "use",
      canonicalTokens: [structured.itemToken],
      rawTokens,
      targetNoun: structured.targetToken,
      itemToken: structured.itemToken,
      targetToken: structured.targetToken,
      verbToken: structured.verbToken,
      preposition: structured.preposition,
    };
  }
  
  // === Pattern 1: "go to X" / "head to X" / "return to X" ===
  const goToPattern = /^(go|move|walk|head|travel|return|proceed)\s+(to|toward|towards|into)\s+(.+)$/;
  const goToMatch = withPunctuation.match(goToPattern);
  if (goToMatch) {
    const nounPhrase = goToMatch[3];
    const resolved = resolveNounToAction(nounPhrase, availableActions);
    if (resolved) {
      return {
        intent: "move",
        canonicalTokens: [resolved.token],
        rawTokens,
        targetNoun: nounPhrase,
        resolvedActionId: resolved.actionId,
      };
    }
  }
  
  // === Pattern 2: "enter X" / "go in X" / "go into X" / "go inside X" ===
  const enterPattern = /^(enter|go\s+in|go\s+into|go\s+inside)\s+(.+)$/;
  const enterMatch = withPunctuation.match(enterPattern);
  if (enterMatch) {
    const nounPhrase = enterMatch[2];
    const resolved = resolveNounToAction(nounPhrase, availableActions);
    if (resolved) {
      return {
        intent: "move",
        canonicalTokens: [resolved.token],
        rawTokens,
        targetNoun: nounPhrase,
        resolvedActionId: resolved.actionId,
      };
    }
    // Check if "enter" or "in" is available as a move
    if (availableMoveTargets.has("enter")) {
      return {
        intent: "move",
        canonicalTokens: ["enter"],
        rawTokens,
        resolvedActionId: "go_enter",
      };
    }
    if (availableMoveTargets.has("in")) {
      return {
        intent: "move",
        canonicalTokens: ["in"],
        rawTokens,
        resolvedActionId: "go_in",
      };
    }
  }
  
  // === Pattern 3: Direct direction with prefix ===
  const dirPattern = /^(go|move|walk|head|travel|proceed|run)\s+(.+)$/;
  const dirMatch = withPunctuation.match(dirPattern);
  if (dirMatch) {
    const dirWord = dirMatch[2];
    if (DIRECTION_SYNONYMS[dirWord]) {
      const canonical = DIRECTION_SYNONYMS[dirWord];
      return {
        intent: "move",
        canonicalTokens: [canonical],
        rawTokens,
        resolvedActionId: `go_${canonical}`,
      };
    }
  }
  
  // === Pattern 4: Single direction word ===
  if (rawTokens.length === 1 && DIRECTION_SYNONYMS[rawTokens[0]]) {
    const canonical = DIRECTION_SYNONYMS[rawTokens[0]];
    return {
      intent: "move",
      canonicalTokens: [canonical],
      rawTokens,
      resolvedActionId: `go_${canonical}`,
    };
  }
  
  // === Pattern 5: Single token that matches available move action ===
  if (rawTokens.length === 1) {
    const token = rawTokens[0];
    // Check if it's a canonical travel verb in this scene
    if (availableMoveTargets.has(token)) {
      return {
        intent: "move",
        canonicalTokens: [token],
        rawTokens,
        resolvedActionId: `go_${token}`,
      };
    }
  }
  
  // === Pattern 6: Action verb patterns ===
  for (const [phrase, canonical] of Object.entries(ACTION_SYNONYMS)) {
    if (cleaned === phrase || cleaned.startsWith(phrase + " ")) {
      const remainder = cleaned.slice(phrase.length).trim();

      if (canonical === "use" && remainder) {
        const itemId = resolveItemId(remainder);
        return {
          intent: "use",
          canonicalTokens: [canonical, ...remainder.split(/\s+/).filter(Boolean)],
          rawTokens,
          targetNoun: remainder || undefined,
          itemToken: itemId || remainder,
        };
      }

      return {
        intent: canonical as any,
        canonicalTokens: [canonical, ...remainder.split(/\s+/).filter(Boolean)],
        rawTokens,
        targetNoun: remainder || undefined,
      };
    }
  }
  
  // === Pattern 7: "back" / "go back" ===
  if (cleaned === "back" || cleaned === "go back" || cleaned === "return") {
    return {
      intent: "back",
      canonicalTokens: ["back"],
      rawTokens,
    };
  }
  
  // Not matched by lexicon - return unknown for fallback to existing parser
  return {
    intent: "unknown",
    canonicalTokens: rawTokens,
    rawTokens,
  };
}

/**
 * Resolve a noun phrase to an available move action.
 * Returns the canonical token and action ID if found.
 */
function resolveNounToAction(
  nounPhrase: string,
  availableActions: Action[]
): { token: string; actionId: string } | null {
  // Strip articles from the noun phrase
  const phrase = nounPhrase.toLowerCase().trim()
    .replace(/^(the|a|an)\s+/, "")
    .trim();
  
  // Get available move actions
  const moveActions = availableActions.filter(a => a.type === "move");
  
  // Try direct match on action label or if label contains the phrase
  for (const action of moveActions) {
    const label = action.label.toLowerCase();
    if (label === phrase ||
        label === `go ${phrase}` ||
        label === `go to ${phrase}` ||
        label.includes(phrase) ||
        action.id.replace(/^go_/, "") === phrase) {
      return { token: action.id.replace(/^go_/, ""), actionId: action.id };
    }
  }
  
  // Try matching via noun synonyms
  const synonyms = NOUN_SYNONYMS[phrase] || [phrase];
  for (const synonym of synonyms) {
    for (const action of moveActions) {
      const actionToken = action.id.replace(/^go_/, "").toLowerCase();
      if (actionToken === synonym || actionToken.startsWith(synonym.slice(0, 5))) {
        return { token: actionToken, actionId: action.id };
      }
    }
  }
  
  // Try matching partial token in action ID
  for (const action of moveActions) {
    const actionToken = action.id.replace(/^go_/, "").toLowerCase();
    if (actionToken.includes(phrase.slice(0, 4)) || phrase.includes(actionToken.slice(0, 4))) {
      return { token: actionToken, actionId: action.id };
    }
  }
  
  return null;
}

/**
 * Check if a token is a canonical travel verb.
 */
export function isCanonicalVerb(token: string): boolean {
  return canonVerbSet.has(token.toLowerCase());
}

/**
 * Check if a token matches a canonical object.
 */
export function isCanonicalObject(token: string): boolean {
  const lower = token.toLowerCase();
  return canonObjectIds.has(lower) || canonObjectNames.has(lower);
}

/**
 * Get the canonical object ID for a token.
 */
export function getCanonicalObjectId(token: string): string | null {
  const lower = token.toLowerCase();
  if (canonObjectIds.has(lower)) return lower;
  return canonObjectNames.get(lower) || null;
}
