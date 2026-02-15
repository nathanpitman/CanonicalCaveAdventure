import { ParsedCommand } from "./commandParser";
import { Action, Item, Scene } from "@/data/generatedStory";
import {
  NOUN_SYNONYMS,
  DIRECTION_SYNONYMS,
  resolveObjectToken,
  FuzzyCandidate,
} from "@/data/lexicon";

export type Resolution =
  | { type: "action"; action: Action }
  | { type: "useItem"; itemId: string }
  | { type: "takeItem"; itemId: string; actionId: string }
  | { type: "move"; toSceneId: string }
  | { type: "direction"; direction: string }
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
    const fuzzy = resolveObjectToken(parsed.direction, moveCandidates);
    if (fuzzy.confidence === "near" && fuzzy.suggestion) {
      return { type: "message", text: `You can't go that way. Did you mean '${fuzzy.suggestion}'?` };
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

    for (const action of moveActions) {
      const label = action.label.toLowerCase();
      const actionToken = action.id.replace(/^go_/, "").toLowerCase();
      if (actionToken.startsWith(phrase) || label.startsWith(phrase) ||
          label.startsWith(`go ${phrase}`)) {
        if (action.to) {
          return { type: "action", action };
        }
      }
    }

    if (phrase.length >= 4) {
      for (const action of moveActions) {
        const label = action.label.toLowerCase();
        const actionToken = action.id.replace(/^go_/, "").toLowerCase();
        if (label.includes(phrase) || actionToken.includes(phrase)) {
          if (action.to) {
            return { type: "action", action };
          }
        }
      }
    }

    const synonyms = NOUN_SYNONYMS[phrase] || [phrase];
    for (const synonym of synonyms) {
      for (const action of moveActions) {
        const actionToken = action.id.replace(/^go_/, "").toLowerCase();
        if (actionToken === synonym || actionToken.startsWith(synonym.slice(0, 5))) {
          if (action.to) {
            return { type: "action", action };
          }
        }
      }
    }

    for (const action of moveActions) {
      const actionToken = action.id.replace(/^go_/, "").toLowerCase();
      if (phrase.length >= 4 && actionToken.length >= 4) {
        if (actionToken.includes(phrase.slice(0, 4)) || phrase.includes(actionToken.slice(0, 4))) {
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
      return label === phrase || label.includes(phrase) || id.includes(phrase);
    });
    if (eventAction) {
      return { type: "action", action: eventAction };
    }

    const moveCandidates = buildMovementCandidates(ctx);
    const fuzzy = resolveObjectToken(phrase, moveCandidates);
    if (fuzzy.confidence === "high" && fuzzy.matchId) {
      const matchedAction = moveActions.find(a =>
        a.id === `go_${fuzzy.matchId}` || a.id.replace(/^go_/, "") === fuzzy.matchId
      );
      if (matchedAction && matchedAction.to) {
        return { type: "action", action: matchedAction };
      }
    }
    if (fuzzy.confidence === "near" && fuzzy.suggestion) {
      return { type: "message", text: `You can't go that way. Did you mean '${fuzzy.suggestion}'?` };
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

  const directMatch = inventory.find(id => {
    if (id.toLowerCase() === itemPhrase.toLowerCase()) return true;
    const item = items[id];
    if (item && item.name.toLowerCase().split(" ").some(w => w.toLowerCase() === itemPhrase.toLowerCase())) return true;
    return false;
  });

  let inventoryItemId: string | undefined;

  if (directMatch) {
    inventoryItemId = directMatch;
  } else if (parsed.itemToken && inventory.includes(parsed.itemToken)) {
    inventoryItemId = parsed.itemToken;
  } else {
    const fuzzyItem = resolveObjectToken(itemPhrase, inventoryCandidates);

    if (fuzzyItem.confidence === "high" && fuzzyItem.matchId) {
      inventoryItemId = fuzzyItem.matchId;
    } else if (fuzzyItem.confidence === "near" && fuzzyItem.suggestion) {
      return { type: "message", text: `I couldn't find that item. Did you mean '${fuzzyItem.suggestion}'?` };
    } else {
      return { type: "message", text: "You don't have that." };
    }
  }

  const item = items[inventoryItemId];

  if (item && item.usable && item.useEffect) {
    return { type: "useItem", itemId: inventoryItemId };
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
      return { type: "action", action: directAction };
    }

    const sceneCandidates = buildSceneTargetCandidates(ctx);
    const fuzzyTarget = resolveObjectToken(targetPhrase, sceneCandidates);

    if (fuzzyTarget.confidence === "high" && fuzzyTarget.matchId) {
      const matchedAction = availableActions.find(a => {
        const idLower = a.id.toLowerCase();
        const labelLower = a.label.toLowerCase();
        return idLower.includes(fuzzyTarget.matchId!) || labelLower.includes(fuzzyTarget.matchId!) ||
               a.requiresItem === inventoryItemId;
      });
      if (matchedAction) {
        return { type: "action", action: matchedAction };
      }
    }

    if (fuzzyTarget.confidence === "near" && fuzzyTarget.suggestion) {
      return { type: "message", text: `I don't see that here. Did you mean '${fuzzyTarget.suggestion}'?` };
    }

    return { type: "message", text: "You don't see that here." };
  }

  if (item && item.usable) {
    return { type: "useItem", itemId: inventoryItemId };
  }

  return { type: "message", text: "That doesn't seem to work here." };
}

function resolveTake(parsed: ParsedCommand, ctx: ResolverContext): Resolution {
  const { availableActions, items } = ctx;
  const itemPhrase = parsed.itemPhrase || parsed.itemToken;

  if (!itemPhrase) {
    return { type: "message", text: "Take what?" };
  }

  const target = itemPhrase.toLowerCase();

  const takeAction = availableActions.find(a => {
    if (!a.addsItem) return false;
    const itemId = a.addsItem.toLowerCase();
    const itemName = items[a.addsItem]?.name.toLowerCase() || "";
    return itemId.includes(target) || itemName.includes(target) ||
           target.includes(itemId) || target.split(/\s+/).some(w => itemId.includes(w) || itemName.includes(w));
  });

  if (takeAction && takeAction.addsItem) {
    return { type: "takeItem", itemId: takeAction.addsItem, actionId: takeAction.id };
  }

  const takeCandidates: FuzzyCandidate[] = availableActions
    .filter(a => a.addsItem)
    .map(a => ({
      id: a.addsItem!,
      name: items[a.addsItem!]?.name,
    }));

  if (takeCandidates.length > 0) {
    const fuzzy = resolveObjectToken(itemPhrase, takeCandidates);
    if (fuzzy.confidence === "high" && fuzzy.matchId) {
      const matchedAction = availableActions.find(a => a.addsItem === fuzzy.matchId);
      if (matchedAction && matchedAction.addsItem) {
        return { type: "takeItem", itemId: matchedAction.addsItem, actionId: matchedAction.id };
      }
    }
    if (fuzzy.confidence === "near" && fuzzy.suggestion) {
      return { type: "message", text: `You don't see that here. Did you mean '${fuzzy.suggestion}'?` };
    }
  }

  return { type: "message", text: "You don't see that here." };
}
