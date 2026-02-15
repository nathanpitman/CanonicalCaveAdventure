import { ParsedCommand } from "./commandParser";
import { Action, Item, Scene } from "@/data/generatedStory";
import {
  NOUN_SYNONYMS,
  DIRECTION_SYNONYMS,
  resolveObjectToken,
  FuzzyCandidate,
  FuzzyResult,
} from "@/data/lexicon";

export type Resolution =
  | { type: "action"; action: Action; correction?: string }
  | { type: "useItem"; itemId: string; correction?: string }
  | { type: "takeItem"; itemId: string; actionId: string; correction?: string }
  | { type: "move"; toSceneId: string; correction?: string }
  | { type: "direction"; direction: string; correction?: string }
  | { type: "message"; text: string }
  | { type: "look" }
  | { type: "inventory" }
  | { type: "help" }
  | { type: "back" }
  | { type: "new" }
  | { type: "lamp_on" }
  | { type: "lamp_off" }
  | { type: "fallback" };

export interface ResolverContext {
  availableActions: Action[];
  inventory: string[];
  items: Record<string, Item>;
  scenes: Record<string, Scene>;
}

function buildInventoryCandidates(ctx: ResolverContext): FuzzyCandidate[] {
  return ctx.inventory.map(id => ({
    id,
    name: ctx.items[id]?.name,
  }));
}

function buildSceneTargetCandidates(ctx: ResolverContext): FuzzyCandidate[] {
  const seen = new Set<string>();
  const candidates: FuzzyCandidate[] = [];

  for (const action of ctx.availableActions) {
    const tokens: string[] = [];

    const idToken = action.id.replace(/^(go_|take_|use_|event_)/, "").toLowerCase();
    if (idToken && idToken.length > 1) tokens.push(idToken);

    const labelWords = action.label.toLowerCase().replace(/^(go |take |use |get )/, "").trim();
    if (labelWords) tokens.push(labelWords);

    if (action.requiresItem) {
      tokens.push(action.requiresItem.toLowerCase());
    }

    for (const t of tokens) {
      if (!seen.has(t)) {
        seen.add(t);
        candidates.push({ id: t, name: action.label });
      }
    }
  }

  return candidates;
}

function buildMovementCandidates(ctx: ResolverContext): FuzzyCandidate[] {
  const candidates: FuzzyCandidate[] = [];
  const seen = new Set<string>();
  for (const action of ctx.availableActions) {
    if (action.type !== "move") continue;
    const token = action.id.replace(/^go_/, "").toLowerCase();
    if (!seen.has(token)) {
      seen.add(token);
      candidates.push({ id: token, name: action.label });
    }
  }

  for (const [synonym, canonical] of Object.entries(DIRECTION_SYNONYMS)) {
    if (seen.has(canonical) && !seen.has(synonym)) {
      candidates.push({ id: synonym, name: canonical });
    }
  }

  return candidates;
}

function correctionNote(correctedFrom: string, correctedTo: string): string {
  return `(interpreting '${correctedFrom}' as '${correctedTo}')`;
}

function applyFuzzyItem(
  phrase: string,
  candidates: FuzzyCandidate[],
  failMsg: string
): { itemId: string; correction?: string } | { message: string } {
  const result = resolveObjectToken(phrase, candidates);

  if (result.confidence === "exact" && result.matchId) {
    return { itemId: result.matchId };
  }

  if (result.confidence === "corrected" && result.matchId) {
    const note = result.correctedFrom
      ? correctionNote(result.correctedFrom, result.suggestion || result.matchId)
      : undefined;
    return { itemId: result.matchId, correction: note };
  }

  if (result.confidence === "suggestion" && result.suggestion) {
    return { message: `I couldn't find that item. Did you mean '${result.suggestion}'?` };
  }

  return { message: failMsg };
}

function applyFuzzyTarget(
  phrase: string,
  candidates: FuzzyCandidate[]
): FuzzyResult {
  return resolveObjectToken(phrase, candidates);
}

function applyFuzzyMovement(
  phrase: string,
  candidates: FuzzyCandidate[]
): FuzzyResult {
  return resolveObjectToken(phrase, candidates);
}

export function resolve(parsed: ParsedCommand, ctx: ResolverContext): Resolution {
  switch (parsed.intent) {
    case "look":
      return { type: "look" };
    case "inventory":
      return { type: "inventory" };
    case "help":
      return { type: "help" };
    case "back":
      return { type: "back" };
    case "new":
      return { type: "new" };
    case "lamp_on":
      return { type: "lamp_on" };
    case "lamp_off":
      return { type: "lamp_off" };

    case "move":
      return resolveMove(parsed, ctx);

    case "use":
      return resolveUse(parsed, ctx);

    case "take":
      return resolveTake(parsed, ctx);

    case "drop":
      return { type: "message", text: "You can't drop items in this adventure." };

    case "unknown":
      return { type: "fallback" };
  }

  return { type: "fallback" };
}

function resolveMove(parsed: ParsedCommand, ctx: ResolverContext): Resolution {
  const { availableActions } = ctx;

  if (parsed.direction) {
    const actionId = `go_${parsed.direction}`;
    const action = availableActions.find(a => a.id === actionId && a.type === "move");
    if (action) {
      return { type: "direction", direction: parsed.direction };
    }

    const moveCandidates = buildMovementCandidates(ctx);
    const fuzzy = applyFuzzyMovement(parsed.direction, moveCandidates);
    if (fuzzy.confidence === "corrected" && fuzzy.matchId) {
      const matchedAction = availableActions.find(a =>
        a.id === `go_${fuzzy.matchId}` || a.id.replace(/^go_/, "") === fuzzy.matchId
      );
      if (matchedAction && matchedAction.to) {
        const note = fuzzy.correctedFrom
          ? ` ${correctionNote(fuzzy.correctedFrom, fuzzy.suggestion || fuzzy.matchId)}`
          : "";
        return { type: "action", action: matchedAction, correction: note || undefined };
      }
    }
    if (fuzzy.confidence === "suggestion" && fuzzy.suggestion) {
      return { type: "message", text: `Did you mean '${fuzzy.suggestion}'?` };
    }

    return { type: "message", text: "You can't go that way." };
  }

  if (parsed.locationPhrase) {
    const phrase = parsed.locationPhrase.toLowerCase();
    const moveActions = availableActions.filter(a => a.type === "move");

    for (const action of moveActions) {
      const actionToken = action.id.replace(/^go_/, "").toLowerCase();
      const label = action.label.toLowerCase();
      if (actionToken === phrase || label === phrase ||
          label === `go ${phrase}` || label === `go to ${phrase}`) {
        if (action.to) {
          return { type: "action", action };
        }
      }
    }

    const synonyms = NOUN_SYNONYMS[phrase] || [phrase];
    for (const synonym of synonyms) {
      for (const action of moveActions) {
        const actionToken = action.id.replace(/^go_/, "").toLowerCase();
        if (actionToken === synonym) {
          if (action.to) {
            return { type: "action", action };
          }
        }
      }
    }

    const enterAction = moveActions.find(a => a.id === "go_enter" || a.id === "go_in");
    if (enterAction && enterAction.to) {
      return { type: "action", action: enterAction };
    }

    const eventAction = availableActions.find(a => {
      if (a.type !== "event" || !(a as any).message) return false;
      const label = a.label.toLowerCase();
      const id = a.id.toLowerCase();
      return label === phrase || id.includes(phrase);
    });
    if (eventAction) {
      return { type: "action", action: eventAction };
    }

    const moveCandidates = buildMovementCandidates(ctx);
    const fuzzy = applyFuzzyMovement(phrase, moveCandidates);

    if ((fuzzy.confidence === "exact" || fuzzy.confidence === "corrected") && fuzzy.matchId) {
      const matchedAction = moveActions.find(a =>
        a.id === `go_${fuzzy.matchId}` || a.id.replace(/^go_/, "") === fuzzy.matchId
      );
      if (matchedAction && matchedAction.to) {
        const note = fuzzy.confidence === "corrected" && fuzzy.correctedFrom
          ? correctionNote(fuzzy.correctedFrom, fuzzy.suggestion || fuzzy.matchId)
          : undefined;
        return { type: "action", action: matchedAction, correction: note };
      }
    }

    if (fuzzy.confidence === "suggestion" && fuzzy.suggestion) {
      return { type: "message", text: `Did you mean '${fuzzy.suggestion}'?` };
    }

    return { type: "message", text: "You can't go that way." };
  }

  return { type: "fallback" };
}

function resolveUse(parsed: ParsedCommand, ctx: ResolverContext): Resolution {
  const { availableActions, inventory, items } = ctx;
  const itemPhrase = parsed.itemPhrase || parsed.itemToken;

  if (!itemPhrase) {
    return { type: "message", text: "Use what?" };
  }

  const inventoryCandidates = buildInventoryCandidates(ctx);
  const itemResult = applyFuzzyItem(itemPhrase, inventoryCandidates, "You don't have that.");

  if ("message" in itemResult) {
    return { type: "message", text: itemResult.message };
  }

  const inventoryItemId = itemResult.itemId;
  const itemCorrection = itemResult.correction;
  const item = items[inventoryItemId];

  if (item && item.usable && item.useEffect) {
    return { type: "useItem", itemId: inventoryItemId, correction: itemCorrection };
  }

  const targetPhrase = parsed.targetPhrase || parsed.targetToken;
  if (targetPhrase) {
    const directAction = availableActions.find(a => {
      if (a.requiresItem === inventoryItemId) return true;
      const idLower = a.id.toLowerCase();
      const labelLower = a.label.toLowerCase();
      return idLower.includes(targetPhrase.toLowerCase()) || labelLower.includes(targetPhrase.toLowerCase());
    });
    if (directAction) {
      return { type: "action", action: directAction, correction: itemCorrection };
    }

    const sceneCandidates = buildSceneTargetCandidates(ctx);
    const fuzzyTarget = applyFuzzyTarget(targetPhrase, sceneCandidates);

    if ((fuzzyTarget.confidence === "exact" || fuzzyTarget.confidence === "corrected") && fuzzyTarget.matchId) {
      const matchedAction = availableActions.find(a => {
        const idLower = a.id.toLowerCase();
        const labelLower = a.label.toLowerCase();
        return idLower.includes(fuzzyTarget.matchId!) || labelLower.includes(fuzzyTarget.matchId!) ||
               a.requiresItem === inventoryItemId;
      });
      if (matchedAction) {
        const targetNote = fuzzyTarget.confidence === "corrected" && fuzzyTarget.correctedFrom
          ? correctionNote(fuzzyTarget.correctedFrom, fuzzyTarget.suggestion || fuzzyTarget.matchId)
          : undefined;
        const combined = [itemCorrection, targetNote].filter(Boolean).join(" ") || undefined;
        return { type: "action", action: matchedAction, correction: combined };
      }
    }

    if (fuzzyTarget.confidence === "suggestion" && fuzzyTarget.suggestion) {
      return { type: "message", text: `I don't see that here. Did you mean '${fuzzyTarget.suggestion}'?` };
    }

    return { type: "message", text: "You don't see that here." };
  }

  if (item && item.usable) {
    return { type: "useItem", itemId: inventoryItemId, correction: itemCorrection };
  }

  return { type: "message", text: "That doesn't seem to work here." };
}

function resolveTake(parsed: ParsedCommand, ctx: ResolverContext): Resolution {
  const { availableActions, items } = ctx;
  const itemPhrase = parsed.itemPhrase || parsed.itemToken;

  if (!itemPhrase) {
    return { type: "message", text: "Take what?" };
  }

  const takeCandidates: FuzzyCandidate[] = availableActions
    .filter(a => a.addsItem)
    .map(a => ({
      id: a.addsItem!,
      name: items[a.addsItem!]?.name,
    }));

  if (takeCandidates.length === 0) {
    return { type: "message", text: "You don't see that here." };
  }

  const fuzzy = resolveObjectToken(itemPhrase, takeCandidates);

  if ((fuzzy.confidence === "exact" || fuzzy.confidence === "corrected") && fuzzy.matchId) {
    const matchedAction = availableActions.find(a => a.addsItem === fuzzy.matchId);
    if (matchedAction && matchedAction.addsItem) {
      const note = fuzzy.confidence === "corrected" && fuzzy.correctedFrom
        ? correctionNote(fuzzy.correctedFrom, fuzzy.suggestion || fuzzy.matchId)
        : undefined;
      return { type: "takeItem", itemId: matchedAction.addsItem, actionId: matchedAction.id, correction: note };
    }
  }

  if (fuzzy.confidence === "suggestion" && fuzzy.suggestion) {
    return { type: "message", text: `You don't see that here. Did you mean '${fuzzy.suggestion}'?` };
  }

  return { type: "message", text: "You don't see that here." };
}
