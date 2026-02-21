import { CANON_TRAVEL_VERBS, CANON_OBJECTS } from "./generatedStory";
import { YAML_DIRECTION_SYNONYMS, YAML_NOUN_SYNONYMS } from "./generatedConstants";

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

const EXTRA_DIRECTION_SYNONYMS: Record<string, string> = {
  "northward": "north", "northwards": "north",
  "southward": "south", "southwards": "south",
  "eastward": "east", "eastwards": "east",
  "westward": "west", "westwards": "west",
  "upward": "up", "upwards": "up", "ascend": "up", "climb up": "up",
  "downward": "down", "downwards": "down", "descend": "down", "climb down": "down",
  "northeast": "ne",
  "northwest": "nw",
  "southeast": "se",
  "southwest": "sw",
  "inward": "in", "inwards": "in",
  "outward": "out", "outwards": "out", "exit": "out", "leave": "out",
};

export const DIRECTION_SYNONYMS: Record<string, string> = {
  ...YAML_DIRECTION_SYNONYMS,
  ...EXTRA_DIRECTION_SYNONYMS,
};

export const NARRATIVE_SYNONYMS: Record<string, string> = {
  "downstream": "downs",
  "down stream": "downs",
  "down the stream": "downs",
  "follow stream downstream": "downs",
  "follow the stream": "downs",
  "follow stream": "downs",
  "upstream": "upstr",
  "up stream": "upstr",
  "up the stream": "upstr",
  "follow stream upstream": "upstr",
  "streambed": "bed",
  "stream bed": "bed",
  "riverbed": "bed",
  "entrance": "entra",
  "entryway": "entra",
  "barren": "barre",
  "barren room": "barre",
  "broken": "broke",
  "secret": "secre",
  "secret passage": "secre",
  "secret room": "secre",
  "across": "acros",
  "across the chasm": "acros",
  "forward": "forward",
  "ahead": "forward",
  "straight": "forward",
  "straight ahead": "forward",
  "onward": "forward",
  "continue": "forward",
  "crawlway": "crawl",
  "crawlspace": "crawl",
  "crawl space": "crawl",
  "stairway": "stairs",
  "staircase": "stairs",
  "stairwell": "stairs",
  "cobblestones": "cobbles",
  "cobblestone": "cobbles",
  "passageway": "passage",
  "corridor": "passage",
  "tunnel": "passage",
  "crevice": "crack",
  "fissure": "crack",
  "opening": "hole",
  "gorge": "canyon",
  "ravine": "gully",
  "chasm": "pit",
  "abyss": "pit",
  "junction": "fork",
  "intersection": "fork",
  "branching": "fork",
  "woods": "forest",
  "trees": "forest",
  "path": "road",
  "trail": "road",
  "above": "surface",
  "topside": "surface",
  "aboveground": "surface",
  "chamber": "room",
  "over the wall": "over",
  "over wall": "over",
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

const EXTRA_NOUN_SYNONYMS: Record<string, string[]> = {
  "building": ["build", "building", "house", "wellhouse", "well house"],
  "house": ["build", "building", "house"],
  "well house": ["build", "building"],
  "wellhouse": ["build", "building"],
  "grate": ["grate", "enter", "in"],
  "depression": ["depre", "depression"],
  "streambed": ["strea", "stream"],
  "cave": ["caver", "cavern", "cave"],
  "cavern": ["caver", "cavern"],
  "oriental": ["orien", "oriental"],
  "reservoir": ["reser", "reservoir"],
  "bedquilt": ["bedqu", "bedquilt"],
  "y2": ["y2"],
};

export const NOUN_SYNONYMS: Record<string, string[]> = {
  ...YAML_NOUN_SYNONYMS,
  ...EXTRA_NOUN_SYNONYMS,
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

export interface FuzzyCandidate {
  id: string;
  name?: string;
}

export interface FuzzyResult {
  matchId: string | null;
  confidence: "exact" | "corrected" | "suggestion" | "none";
  suggestion?: string;
  correctedFrom?: string;
}

export function normalizeToken(s: string): string {
  return s.toLowerCase().replace(/[.,!?;:'"]/g, "").replace(/\s+/g, " ").trim();
}

function tokenize(phrase: string): string[] {
  const clean = stripArticles(normalizeToken(phrase));
  if (!clean) return [];
  return clean.split(/\s+/).filter(Boolean);
}

function singularize(word: string): string[] {
  const forms = [word];
  if (word.endsWith("ies") && word.length > 4) {
    forms.push(word.slice(0, -3) + "y");
  } else if (word.endsWith("es") && word.length > 3) {
    forms.push(word.slice(0, -2));
  } else if (word.endsWith("s") && !word.endsWith("ss") && word.length > 2) {
    forms.push(word.slice(0, -1));
  }
  return forms;
}

function pluralize(word: string): string[] {
  const forms = [word];
  if (!word.endsWith("s")) {
    forms.push(word + "s");
  }
  if (word.endsWith("y") && word.length > 2) {
    forms.push(word.slice(0, -1) + "ies");
  }
  return forms;
}

function expandForms(word: string): string[] {
  const all = new Set<string>();
  for (const s of singularize(word)) {
    all.add(s);
    for (const p of pluralize(s)) all.add(p);
  }
  for (const p of pluralize(word)) {
    all.add(p);
    for (const s of singularize(p)) all.add(s);
  }
  return Array.from(all);
}

export function editDistanceAtMost2(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (Math.abs(m - n) > 2) return 3;

  let prev2: number[] | null = null;
  let prev1 = new Array(n + 1);
  let curr = new Array(n + 1);

  for (let j = 0; j <= n; j++) prev1[j] = j;

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    let rowMin = curr[0];

    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev1[j] + 1,
        curr[j - 1] + 1,
        prev1[j - 1] + cost
      );
      if (
        i > 1 && j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1] &&
        prev2 !== null
      ) {
        curr[j] = Math.min(curr[j], prev2[j - 2] + cost);
      }
      if (curr[j] < rowMin) rowMin = curr[j];
    }

    if (rowMin > 2) return 3;

    prev2 = prev1;
    prev1 = curr;
    curr = new Array(n + 1);
  }

  return Math.min(prev1[n], 3);
}

function getCandidateTokens(cand: FuzzyCandidate): string[] {
  const tokens = new Set<string>();
  for (const form of expandForms(cand.id.toLowerCase())) tokens.add(form);
  if (cand.name) {
    for (const w of cand.name.toLowerCase().split(/\s+/)) {
      if (w.length > 2) {
        for (const form of expandForms(w)) tokens.add(form);
      }
    }
  }
  return Array.from(tokens);
}

interface MatchResult {
  candidate: FuzzyCandidate;
  distance: number;
  matchedToken: string;
  inputToken: string;
}

function findBestTokenMatch(
  inputWord: string,
  candidates: FuzzyCandidate[]
): MatchResult[] {
  const results: MatchResult[] = [];

  for (const cand of candidates) {
    const candTokens = getCandidateTokens(cand);
    let bestDist = 3;
    let bestToken = "";

    for (const ct of candTokens) {
      const d = editDistanceAtMost2(inputWord, ct);
      if (d < bestDist) {
        bestDist = d;
        bestToken = ct;
        if (d === 0) break;
      }
    }

    if (bestDist <= 2) {
      results.push({
        candidate: cand,
        distance: bestDist,
        matchedToken: bestToken,
        inputToken: inputWord,
      });
    }
  }

  results.sort((a, b) => {
    if (a.distance !== b.distance) return a.distance - b.distance;
    if (a.matchedToken[0] === a.inputToken[0] && b.matchedToken[0] !== b.inputToken[0]) return -1;
    if (b.matchedToken[0] === b.inputToken[0] && a.matchedToken[0] !== a.inputToken[0]) return 1;
    return 0;
  });

  return results;
}

export function resolveObjectToken(
  phrase: string,
  candidates: FuzzyCandidate[]
): FuzzyResult {
  if (!phrase || candidates.length === 0) {
    return { matchId: null, confidence: "none" };
  }

  const inputTokens = tokenize(phrase);
  if (inputTokens.length === 0) {
    return { matchId: null, confidence: "none" };
  }

  for (const inputWord of inputTokens) {
    const inputForms = expandForms(inputWord);

    for (const cand of candidates) {
      const candTokens = getCandidateTokens(cand);
      for (const form of inputForms) {
        if (candTokens.includes(form)) {
          return { matchId: cand.id, confidence: "exact" };
        }
      }
    }
  }

  const allMatches: MatchResult[] = [];
  for (const inputWord of inputTokens) {
    const matches = findBestTokenMatch(inputWord, candidates);
    allMatches.push(...matches);
  }

  if (allMatches.length === 0) {
    return { matchId: null, confidence: "none" };
  }

  allMatches.sort((a, b) => {
    if (a.distance !== b.distance) return a.distance - b.distance;
    if (a.matchedToken[0] === a.inputToken[0] && b.matchedToken[0] !== b.inputToken[0]) return -1;
    if (b.matchedToken[0] === b.inputToken[0] && a.matchedToken[0] !== a.inputToken[0]) return 1;
    return 0;
  });

  const best = allMatches[0];

  if (best.distance === 1) {
    const tiedAtD1 = allMatches.filter(m => m.distance === 1);
    const uniqueCands = new Set(tiedAtD1.map(m => m.candidate.id));
    if (uniqueCands.size > 1) {
      return { matchId: null, confidence: "none" };
    }
    if (best.inputToken.length >= 4) {
      return {
        matchId: best.candidate.id,
        confidence: "corrected",
        suggestion: best.candidate.name || best.candidate.id,
        correctedFrom: best.inputToken,
      };
    }
    return {
      matchId: best.candidate.id,
      confidence: "suggestion",
      suggestion: best.candidate.name || best.candidate.id,
    };
  }

  if (best.distance === 2) {
    const tiedAtD2 = allMatches.filter(m => m.distance === 2);
    const uniqueCands = new Set(tiedAtD2.map(m => m.candidate.id));
    if (uniqueCands.size > 1) {
      return { matchId: null, confidence: "none" };
    }
    return {
      matchId: best.candidate.id,
      confidence: "suggestion",
      suggestion: best.candidate.name || best.candidate.id,
    };
  }

  return { matchId: null, confidence: "none" };
}
