import {
  STOPWORDS,
  ARTICLES,
  DIRECTION_SYNONYMS,
  VERB_SYNONYMS,
  MOVE_VERBS,
  TARGET_FIRST_VERBS,
  PREPOSITIONS,
  MAGIC_WORD_VERBS,
  stripArticles,
  resolveItemId,
} from "@/data/lexicon";

export interface ParsedCommand {
  raw: string;
  intent: "move" | "use" | "take" | "drop" | "look" | "inventory" | "help" | "back" | "new" | "lamp_on" | "lamp_off" | "score" | "brief" | "wait" | "attack" | "throw" | "feed" | "fill" | "pour" | "break" | "wave" | "open" | "unlock" | "drink" | "read" | "say" | "yes" | "unknown";
  verb?: string;
  itemPhrase?: string;
  targetPhrase?: string;
  locationPhrase?: string;
  direction?: string;
  itemToken?: string;
  targetToken?: string;
}

function cleanInput(raw: string): string {
  return raw.trim().toLowerCase().replace(/[.,!?;:'"]/g, "").replace(/\s+/g, " ").trim();
}

function removeStopwords(text: string): string {
  return text.split(/\s+/).filter(w => !STOPWORDS.has(w)).join(" ").trim();
}

export function parseInput(raw: string): ParsedCommand {
  const cleaned = cleanInput(raw);
  const tokens = cleaned.split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return { raw, intent: "unknown" };
  }

  const base: ParsedCommand = { raw, intent: "unknown" };

  if (tryLampToggle(cleaned, base)) return base;
  if (tryMeta(cleaned, tokens, base)) return base;
  if (tryBack(cleaned, base)) return base;
  if (tryMagicWord(cleaned, tokens, base)) return base;
  if (tryNewVerbs(cleaned, tokens, base)) return base;
  if (tryStructuredUse(cleaned, base)) return base;
  if (tryMovement(cleaned, tokens, base)) return base;
  if (tryTake(cleaned, base)) return base;
  if (tryDrop(cleaned, base)) return base;
  if (trySimpleUse(cleaned, base)) return base;
  if (trySingleToken(tokens, base)) return base;

  return base;
}

function tryLampToggle(text: string, out: ParsedCommand): boolean {
  const lampOnPatterns = [
    "lamp on", "light lamp", "turn on lamp", "turn lamp on",
    "lantern on", "light lantern", "turn on lantern", "turn lantern on",
    "torch on", "light torch", "turn on torch", "turn torch on",
    "on lamp", "on lantern", "on torch",
  ];
  const lampOffPatterns = [
    "lamp off", "extinguish lamp", "turn off lamp", "turn lamp off",
    "lantern off", "extinguish lantern", "turn off lantern", "turn lantern off",
    "torch off", "extinguish torch", "turn off torch", "turn torch off",
    "off lamp", "off lantern", "off torch",
    "douse lamp", "douse lantern", "douse torch",
  ];

  if (lampOnPatterns.includes(text)) {
    out.intent = "lamp_on";
    return true;
  }
  if (lampOffPatterns.includes(text)) {
    out.intent = "lamp_off";
    return true;
  }
  return false;
}

function tryMeta(text: string, tokens: string[], out: ParsedCommand): boolean {
  const resolved = VERB_SYNONYMS[text];
  if (resolved === "look") {
    out.intent = "look";
    out.verb = "look";
    return true;
  }
  if (resolved === "inventory") {
    out.intent = "inventory";
    return true;
  }
  if (resolved === "help") {
    out.intent = "help";
    return true;
  }
  if (resolved === "new") {
    out.intent = "new";
    return true;
  }

  if (text === "look" || text === "examine room" || text === "examine surroundings" ||
      text === "check surroundings") {
    out.intent = "look";
    out.verb = "look";
    return true;
  }

  return false;
}

function tryBack(text: string, out: ParsedCommand): boolean {
  const resolved = VERB_SYNONYMS[text];
  if (resolved === "back") {
    out.intent = "back";
    return true;
  }
  if (text === "go back the way i came" || text === "retrace my steps") {
    out.intent = "back";
    return true;
  }
  return false;
}

function tryMagicWord(text: string, tokens: string[], out: ParsedCommand): boolean {
  if (tokens.length === 2 && MAGIC_WORD_VERBS.has(tokens[0])) {
    out.intent = "move";
    out.locationPhrase = tokens[1];
    return true;
  }
  return false;
}

function tryStructuredUse(text: string, out: ParsedCommand): boolean {
  const useWithTarget = /^(use|apply|activate)\s+(.+?)\s+(to|on|with|using|into|onto|at)\s+(.+)$/;
  const m1 = text.match(useWithTarget);
  if (m1) {
    const itemRaw = stripArticles(m1[2]);
    const targetRaw = stripArticles(m1[4]);
    out.intent = "use";
    out.verb = "use";
    out.itemPhrase = itemRaw;
    out.targetPhrase = targetRaw;
    out.itemToken = resolveItemId(itemRaw) || undefined;
    out.targetToken = resolveItemId(targetRaw) || undefined;
    return true;
  }

  const useToVerb = /^(use|apply|activate)\s+(.+?)\s+to\s+(open|unlock|lift|break|light|pour|push|pull|turn|insert|close|lock|smash|cut|fill|empty)\s+(.+)$/;
  const m2 = text.match(useToVerb);
  if (m2) {
    const itemRaw = stripArticles(m2[2]);
    const targetRaw = stripArticles(m2[4]);
    out.intent = "use";
    out.verb = m2[3];
    out.itemPhrase = itemRaw;
    out.targetPhrase = targetRaw;
    out.itemToken = resolveItemId(itemRaw) || undefined;
    out.targetToken = resolveItemId(targetRaw) || undefined;
    return true;
  }

  const verbTargetWith = /^(unlock|open|lift|break|light|pour|push|pull|turn|insert|close|lock|smash|cut|fill|empty|drink)\s+(.+?)\s+(with|using|from)\s+(.+)$/;
  const m3 = text.match(verbTargetWith);
  if (m3) {
    const targetRaw = stripArticles(m3[2]);
    const itemRaw = stripArticles(m3[4]);
    out.intent = "use";
    out.verb = m3[1];
    out.itemPhrase = itemRaw;
    out.targetPhrase = targetRaw;
    out.itemToken = resolveItemId(itemRaw) || undefined;
    out.targetToken = resolveItemId(targetRaw) || undefined;
    return true;
  }

  const singleVerbItem = /^(light|drink|pour|eat|burn|rub|wave|read|fill|empty)\s+(.+)$/;
  const m4 = text.match(singleVerbItem);
  if (m4) {
    const itemRaw = stripArticles(m4[2]);
    const itemId = resolveItemId(itemRaw);
    if (itemId) {
      out.intent = "use";
      out.verb = m4[1];
      out.itemPhrase = itemRaw;
      out.itemToken = itemId;
      return true;
    }
  }

  return false;
}

function tryMovement(text: string, tokens: string[], out: ParsedCommand): boolean {
  const goToPattern = /^(go|move|walk|head|travel|proceed|run|crawl|climb)\s+(to|toward|towards|into)\s+(.+)$/;
  const goToMatch = text.match(goToPattern);
  if (goToMatch) {
    const noun = stripArticles(goToMatch[3]);
    out.intent = "move";
    out.locationPhrase = noun;
    return true;
  }

  const enterPattern = /^(enter|go\s+in|go\s+into|go\s+inside)\s+(.+)$/;
  const enterMatch = text.match(enterPattern);
  if (enterMatch) {
    const noun = stripArticles(enterMatch[2]);
    out.intent = "move";
    out.locationPhrase = noun;
    return true;
  }

  const dirPrefixPattern = /^(go|move|walk|head|travel|proceed|run|crawl|climb)\s+(.+)$/;
  const dirMatch = text.match(dirPrefixPattern);
  if (dirMatch) {
    const rest = dirMatch[2].replace(/ward(s)?$/i, "");
    const canonical = DIRECTION_SYNONYMS[rest];
    if (canonical) {
      out.intent = "move";
      out.direction = canonical;
      return true;
    }
    const noun = stripArticles(rest);
    if (noun && !MOVE_VERBS.has(noun)) {
      out.intent = "move";
      out.locationPhrase = noun;
      return true;
    }
  }

  if (tokens.length === 1) {
    const canonical = DIRECTION_SYNONYMS[tokens[0]];
    if (canonical) {
      out.intent = "move";
      out.direction = canonical;
      return true;
    }
  }

  return false;
}

function tryTake(text: string, out: ParsedCommand): boolean {
  const takePattern = /^(take|get|grab|pick up|collect|pick|acquire|snag|retrieve)\s+(.+)$/;
  const m = text.match(takePattern);
  if (m) {
    const itemRaw = stripArticles(m[2]);
    if (itemRaw) {
      out.intent = "take";
      out.verb = "take";
      out.itemPhrase = itemRaw;
      out.itemToken = resolveItemId(itemRaw) || undefined;
      return true;
    }
  }
  return false;
}

function trySimpleUse(text: string, out: ParsedCommand): boolean {
  const usePattern = /^(use|activate|apply|consume)\s+(.+)$/;
  const m = text.match(usePattern);
  if (m) {
    const itemRaw = stripArticles(m[2]);
    if (itemRaw) {
      out.intent = "use";
      out.verb = "use";
      out.itemPhrase = itemRaw;
      out.itemToken = resolveItemId(itemRaw) || undefined;
      return true;
    }
  }
  return false;
}

function tryDrop(text: string, out: ParsedCommand): boolean {
  const dropPattern = /^(drop|put down|discard|release|dump|leave|set down)\s+(.+)$/;
  const m = text.match(dropPattern);
  if (m) {
    const itemRaw = stripArticles(m[2]);
    if (itemRaw) {
      out.intent = "drop";
      out.verb = "drop";
      out.itemPhrase = itemRaw;
      out.itemToken = resolveItemId(itemRaw) || undefined;
      return true;
    }
  }
  return false;
}

function tryNewVerbs(text: string, tokens: string[], out: ParsedCommand): boolean {
  if (text === "score" || text === "what is my score" || text === "show score") {
    out.intent = "score";
    return true;
  }
  if (text === "brief") {
    out.intent = "brief";
    return true;
  }
  if (text === "wait" || text === "z" || text === "nothing" || text === "do nothing") {
    out.intent = "wait";
    return true;
  }

  const attackPattern = /^(attack|kill|fight|hit|strike|slay)\s*(.*)$/;
  const am = text.match(attackPattern);
  if (am) {
    out.intent = "attack";
    out.verb = "attack";
    const target = stripArticles(am[2] || "");
    if (target) {
      out.targetPhrase = target;
      out.targetToken = resolveItemId(target) || undefined;
    }
    return true;
  }

  const throwPattern = /^(throw|toss)\s+(.+?)(?:\s+(at|to|toward|towards|across)\s+(.+))?$/;
  const tm = text.match(throwPattern);
  if (tm) {
    const itemRaw = stripArticles(tm[2]);
    out.intent = "throw";
    out.verb = "throw";
    out.itemPhrase = itemRaw;
    out.itemToken = resolveItemId(itemRaw) || undefined;
    if (tm[4]) {
      const targetRaw = stripArticles(tm[4]);
      out.targetPhrase = targetRaw;
      out.targetToken = resolveItemId(targetRaw) || undefined;
    }
    return true;
  }

  const feedPattern = /^feed\s+(.+?)(?:\s+to\s+(.+))?$/;
  const fm = text.match(feedPattern);
  if (fm) {
    out.intent = "feed";
    out.verb = "feed";
    out.itemPhrase = stripArticles(fm[1]);
    out.itemToken = resolveItemId(fm[1]) || undefined;
    if (fm[2]) {
      out.targetPhrase = stripArticles(fm[2]);
      out.targetToken = resolveItemId(fm[2]) || undefined;
    }
    return true;
  }

  const wavePattern = /^(wave|shake|swing)\s+(.+)$/;
  const wm = text.match(wavePattern);
  if (wm) {
    out.intent = "wave";
    out.verb = "wave";
    out.itemPhrase = stripArticles(wm[2]);
    out.itemToken = resolveItemId(wm[2]) || undefined;
    return true;
  }

  if (tokens.length === 1) {
    const t = tokens[0];
    if (t === "attack" || t === "kill" || t === "fight") {
      out.intent = "attack";
      out.verb = "attack";
      return true;
    }
    if (t === "drop" || t === "discard" || t === "dump") {
      out.intent = "drop";
      out.verb = "drop";
      return true;
    }
    if (t === "throw" || t === "toss") {
      out.intent = "throw";
      out.verb = "throw";
      return true;
    }
    if (t === "score") {
      out.intent = "score";
      return true;
    }
  }

  const waterPattern = /^(water|pour)\s*(.*)$/;
  const wpm = text.match(waterPattern);
  if (wpm) {
    out.intent = "pour";
    out.verb = "pour";
    const target = stripArticles(wpm[2] || "");
    if (target) {
      out.targetPhrase = target;
      out.targetToken = resolveItemId(target) || undefined;
    }
    return true;
  }

  const fillPattern = /^fill\s*(.*)$/;
  const flm = text.match(fillPattern);
  if (flm) {
    out.intent = "fill";
    out.verb = "fill";
    const target = stripArticles(flm[1] || "");
    if (target) {
      out.targetPhrase = target;
      out.targetToken = resolveItemId(target) || undefined;
    }
    return true;
  }

  const openPattern = /^(open|pry|crack)\s*(.*)$/;
  const om = text.match(openPattern);
  if (om) {
    out.intent = "open";
    out.verb = "open";
    const target = stripArticles(om[2] || "");
    if (target) {
      out.targetPhrase = target;
      out.targetToken = resolveItemId(target) || undefined;
    }
    return true;
  }

  const unlockPattern = /^(unlock|unchain|free|release)\s*(.*)$/;
  const um = text.match(unlockPattern);
  if (um) {
    out.intent = "unlock";
    out.verb = "unlock";
    const target = stripArticles(um[2] || "");
    if (target) {
      out.targetPhrase = target;
      out.targetToken = resolveItemId(target) || undefined;
    }
    return true;
  }

  const drinkPattern = /^(drink|quaff|sip|gulp)\s*(.*)$/;
  const dm = text.match(drinkPattern);
  if (dm) {
    out.intent = "drink";
    out.verb = "drink";
    const target = stripArticles(dm[2] || "");
    if (target) {
      out.targetPhrase = target;
      out.targetToken = resolveItemId(target) || undefined;
    }
    return true;
  }

  const readPattern = /^read\s*(.*)$/;
  const rm = text.match(readPattern);
  if (rm) {
    out.intent = "read";
    out.verb = "read";
    const target = stripArticles(rm[1] || "");
    if (target) {
      out.targetPhrase = target;
      out.targetToken = resolveItemId(target) || undefined;
    }
    return true;
  }

  const sayPattern = /^(say|speak|utter)\s+(.+)$/;
  const sm = text.match(sayPattern);
  if (sm) {
    out.intent = "say";
    out.verb = "say";
    out.targetPhrase = stripArticles(sm[2]);
    return true;
  }

  if (text === "yes" || text === "y") {
    out.intent = "yes";
    return true;
  }

  return false;
}

function trySingleToken(tokens: string[], out: ParsedCommand): boolean {
  if (tokens.length !== 1) return false;
  const token = tokens[0];

  const verbResolved = VERB_SYNONYMS[token];
  if (verbResolved === "take") {
    out.intent = "take";
    out.verb = "take";
    return true;
  }
  if (verbResolved === "drop") {
    out.intent = "drop";
    out.verb = "drop";
    return true;
  }
  if (verbResolved === "use") {
    out.intent = "use";
    out.verb = "use";
    return true;
  }

  if (token === "water" || token === "pour") {
    out.intent = "pour";
    out.verb = "pour";
    return true;
  }
  if (token === "fill") {
    out.intent = "fill";
    out.verb = "fill";
    return true;
  }
  if (token === "open") {
    out.intent = "open";
    out.verb = "open";
    return true;
  }
  if (token === "unlock" || token === "unchain") {
    out.intent = "unlock";
    out.verb = "unlock";
    return true;
  }
  if (token === "drink") {
    out.intent = "drink";
    out.verb = "drink";
    return true;
  }
  if (token === "read") {
    out.intent = "read";
    out.verb = "read";
    return true;
  }
  if (token === "yes" || token === "y") {
    out.intent = "yes";
    return true;
  }

  out.intent = "move";
  out.locationPhrase = token;
  return true;
}
