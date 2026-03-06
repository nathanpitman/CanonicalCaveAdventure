import * as path from "path";

const generatedPath = path.resolve("client/data/generatedConstants.ts");

async function main() {
  const mod = await import(generatedPath);
  const verbSynonyms: Record<string, string> = mod.YAML_VERB_SYNONYMS;
  const moveVerbs: string[] = mod.YAML_MOVE_VERBS;
  const targetFirstVerbs: string[] = mod.YAML_TARGET_FIRST_VERBS;

  let failures = 0;
  let passes = 0;

  function check(label: string, condition: boolean, detail: string) {
    if (condition) {
      passes++;
    } else {
      failures++;
      console.error(`FAIL: ${label} — ${detail}`);
    }
  }

  const EXPECTED_VERB_MAPPINGS: Record<string, string> = {
    "carry": "take", "take": "take", "keep": "take", "catch": "take",
    "steal": "take", "get": "take",
    "grab": "take", "pick": "take", "collect": "take", "acquire": "take",
    "snag": "take", "retrieve": "take", "nab": "take", "snatch": "take",
    "seize": "take", "swipe": "take", "pocket": "take", "pluck": "take",
    "gather": "take", "obtain": "take", "hold": "take", "fetch": "take",
    "claim": "take", "capture": "take",

    "drop": "drop", "dump": "drop",
    "discard": "drop", "put down": "drop", "abandon": "drop",
    "ditch": "drop", "throw away": "drop", "lay down": "drop", "place": "drop",
    "deposit": "drop", "leave behind": "drop", "get rid of": "drop",

    "toss": "throw",

    "look": "look", "examine": "look", "inspect": "look", "check": "look",
    "see": "look", "look around": "look", "look at": "look", "observe": "look",
    "describe": "look", "where am i": "look", "what do i see": "look",
    "study": "look", "search": "look", "scan": "look", "view": "look",
    "peer": "look", "gaze": "look", "survey": "look", "scrutinize": "look",
    "peek": "look", "glance": "look", "what is here": "look",
    "surroundings": "look", "describe room": "look",

    "inven": "inventory",
    "what do i have": "inventory", "what am i carrying": "inventory",
    "items": "inventory", "check inventory": "inventory",
    "show inventory": "inventory", "my items": "inventory",
    "bag": "inventory", "backpack": "inventory", "pockets": "inventory",
    "what am i holding": "inventory", "check bag": "inventory",
    "possessions": "inventory", "belongings": "inventory",

    "use": "use", "apply": "use", "activate": "use", "employ": "use",
    "utilize": "use", "operate": "use", "try": "use", "wield": "use",
    "engage": "use", "interact": "use", "work": "use",

    "unloc": "open", "open": "open",
    "lift": "open", "pry": "open", "force": "open", "unseal": "open",

    "attac": "attack", "kill": "attack", "fight": "attack",
    "hit": "attack", "strik": "attack", "slay": "attack",
    "punch": "attack", "stab": "attack", "hack": "attack",
    "bash": "attack", "whack": "attack", "swing at": "attack",
    "assault": "attack", "battle": "attack",

    "break": "break", "shatt": "break", "smash": "break",
    "shatter": "break", "wreck": "break", "crush": "break",
    "bust": "break", "demolish": "break",

    "light": "light",
    "burn": "light", "ignite": "light", "kindle": "light",
    "spark": "light", "set fire": "light",

    "pour": "pour", "spill": "pour", "splash": "pour", "tip": "pour",

    "fill": "fill", "top off": "fill", "load": "fill",

    "drink": "drink",
    "swig": "drink", "chug": "drink", "imbibe": "drink",
    "slurp": "drink", "sample": "drink",

    "eat": "eat", "devou": "eat",
    "munch": "eat", "chew": "eat", "bite": "eat", "nibble": "eat",
    "taste": "eat", "snack": "eat", "dine": "eat", "feast": "eat",
    "swallow": "eat", "ingest": "eat",

    "throw": "throw",
    "fling": "throw", "hurl": "throw", "lob": "throw",
    "launch": "throw", "chuck": "throw", "pitch": "throw", "heave": "throw",

    "push": "push", "shove": "push", "press": "push", "nudge": "push", "bump": "push",
    "pull": "pull", "yank": "pull", "tug": "pull", "drag": "pull", "haul": "pull",
    "turn": "turn",

    "lock": "close", "close": "close",
    "slam": "close", "seal": "close", "bar": "close", "fasten": "close",

    "cut": "cut", "slash": "cut", "carve": "cut", "chop": "cut",
    "slice": "cut", "sever": "cut",

    "insert": "insert",

    "give": "give", "offer": "give", "hand": "give", "present": "give",
    "donate": "give", "pass": "give",

    "feed": "feed",

    "rub": "rub", "polish": "rub", "buff": "rub", "stroke": "rub",
    "caress": "rub", "wipe": "rub", "clean": "rub", "massage": "rub", "shine": "rub",

    "wave": "wave", "shake": "wave", "swing": "wave",
    "brandish": "wave", "flourish": "wave",

    "read": "read", "perus": "read",
    "decipher": "read", "translate": "read",

    "help": "help", "?": "help",
    "commands": "help", "what can i do": "help", "how to play": "help",
    "instructions": "help", "hint": "help", "what do i do": "help",
    "stuck": "help", "clue": "help",

    "back": "back", "go back": "back", "return": "back",
    "retreat": "back", "turn back": "back", "retrace": "back",

    "new": "new", "new game": "new", "restart": "new", "start over": "new",

    "directions": "directions", "exits": "directions",
    "where can i go": "directions", "which way": "directions",
    "paths": "directions", "ways": "directions",
    "available exits": "directions", "show exits": "directions",

    "empty": "empty",

    "quit": "quit",
    "score": "score",
    "brief": "brief",
    "blast": "blast",
  };

  console.log("=== Verb Synonym Tests ===");
  for (const [word, expectedVerb] of Object.entries(EXPECTED_VERB_MAPPINGS)) {
    check(
      `VERB_SYNONYMS["${word}"]`,
      verbSynonyms[word] === expectedVerb,
      `expected "${expectedVerb}", got "${verbSynonyms[word] || "(missing)"}"`
    );
  }

  console.log("\n=== Move Verb Tests ===");
  const moveVerbSet = new Set(moveVerbs);
  const EXPECTED_MOVE_VERBS = [
    "walk", "run", "go", "move", "head", "travel", "proceed",
    "crawl", "climb", "return", "back", "enter", "exit", "leave",
    "sprint", "dash", "wander", "venture", "trek", "hike", "stride",
  ];
  for (const verb of EXPECTED_MOVE_VERBS) {
    check(
      `MOVE_VERBS has "${verb}"`,
      moveVerbSet.has(verb),
      `"${verb}" missing from YAML_MOVE_VERBS`
    );
  }

  console.log("\n=== Target-First Verb Tests ===");
  const targetSet = new Set(targetFirstVerbs);
  const EXPECTED_TARGET_FIRST = [
    "open", "break", "light", "pour", "close", "lock",
    "fill", "drop", "feed", "smash",
    "slash", "carve", "chop", "slice", "sever",
    "pry", "force", "unseal",
    "shatter", "wreck", "crush", "bust", "demolish",
    "ignite", "kindle", "spark",
    "spill", "splash", "tip",
    "shove", "press", "nudge", "bump",
    "yank", "tug", "drag", "haul",
    "offer", "hand", "present", "donate", "pass",
    "slam", "seal", "bar", "fasten",
    "load", "swig", "chug", "imbibe", "slurp", "sample",
    "abandon", "toss", "ditch", "place", "deposit",
    "push", "pull", "cut", "insert", "give", "empty",
  ];
  for (const verb of EXPECTED_TARGET_FIRST) {
    check(
      `TARGET_FIRST_VERBS has "${verb}"`,
      targetSet.has(verb),
      `"${verb}" missing from YAML_TARGET_FIRST_VERBS`
    );
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`Passed: ${passes}`);
  console.log(`Failed: ${failures}`);

  if (failures > 0) {
    console.error(`\n${failures} test(s) FAILED`);
    process.exit(1);
  } else {
    console.log(`\nAll ${passes} tests PASSED`);
  }
}

main().catch((err) => {
  console.error("Test script error:", err);
  process.exit(1);
});
