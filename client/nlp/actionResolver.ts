import { ParsedCommand } from "./commandParser";
import { Action, Item, Scene } from "@/data/generatedStory";
import { NOUN_SYNONYMS } from "@/data/lexicon";

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
      if (label.includes(phrase) || actionToken.includes(phrase)) {
        if (action.to) {
          return { type: "action", action };
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

    return { type: "message", text: "You can't go that way." };
  }

  return { type: "fallback" };
}

function resolveUse(parsed: ParsedCommand, ctx: ResolverContext): Resolution {
  const { availableActions, inventory, items } = ctx;
  const itemToken = parsed.itemToken;

  if (!itemToken) {
    return { type: "message", text: "Use what?" };
  }

  const inventoryItemId = inventory.find(id => {
    if (id.toLowerCase() === itemToken) return true;
    const item = items[id];
    if (item && item.name.toLowerCase().split(" ").some(w => w.toLowerCase() === itemToken)) return true;
    return false;
  });

  if (!inventoryItemId) {
    return { type: "message", text: "You don't have that." };
  }

  const item = items[inventoryItemId];

  if (item && item.usable && item.useEffect) {
    return { type: "useItem", itemId: inventoryItemId };
  }

  if (parsed.targetToken) {
    const matchingAction = availableActions.find(a => {
      if (a.requiresItem === inventoryItemId) return true;
      const idLower = a.id.toLowerCase();
      const labelLower = a.label.toLowerCase();
      return idLower.includes(parsed.targetToken!) || labelLower.includes(parsed.targetToken!);
    });
    if (matchingAction) {
      return { type: "action", action: matchingAction };
    }
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

  return { type: "message", text: "You don't see that here." };
}
