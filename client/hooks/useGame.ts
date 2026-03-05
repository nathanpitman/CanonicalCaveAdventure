import { useState, useCallback, useRef, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import {
  GameState,
  PendingPrompt,
  Message,
  initialGameState,
  saveGame,
  loadGame,
  deleteSave,
  generateMessageId,
} from "@/data/gameState";
import {
  SCENES,
  ITEMS,
  INTRO_MESSAGES,
  HELP_TEXT,
  HINTS,
  HINT_CONDITIONS,
  OBITUARIES,
  TURN_THRESHOLDS,
  LAMP_MESSAGES,
  Action,
} from "@/data/story";
import { parseInput } from "@/nlp/commandParser";
import { resolve } from "@/nlp/actionResolver";
import {
  WARN_TIME,
  BATTERY_LIFE_BONUS,
  BOTTLE_WATER,
  BOTTLE_EMPTY,
  BOTTLE_OIL,
  URN_EMPTY,
  URN_DARK,
  URN_LIT,
  CAVITY_FULL,
  CAVITY_EMPTY,
  CLOCK1_START,
  CLOCK2_START,
} from "@/data/canonConstants";
import {
  PROGRESS_MILESTONES,
  MILESTONE_SCENE_TRIGGERS,
  MILESTONE_ITEM_TRIGGERS,
  MILESTONE_FLAG_TRIGGERS,
  MAZE_SCENE_IDS,
  MilestoneId,
} from "@/data/progressMilestones";
import {
  INVLIMIT,
  TREASURE_IDS,
  TREASURE_DEPOSIT_LOCATION,
  IMMOVABLE_OBJECTS,
  URN_LOCATION,
  DRAGON_LOCATIONS,
  calculateScore,
  getScoreClass,
} from "@/data/canonObjects";
import {
  processDwarfTurn,
  lcgRandom,
  isDeepCave,
  isNoBack,
  CHEST_HIDE_LOC,
  MESSAGE_HIDE_LOC,
} from "@/data/dwarves";
import {
  initAnalytics,
  trackScene,
  trackCommand,
  trackGameComplete,
  trackHelpOpened,
} from "@/analytics";

const EXIT_LABEL_MAP: Record<string, string> = {
  "GO NORTH": "north", "GO SOUTH": "south", "GO EAST": "east", "GO WEST": "west",
  "GO NE": "northeast", "GO NW": "northwest", "GO SE": "southeast", "GO SW": "southwest",
  "GO UP": "up", "GO DOWN": "down", "GO IN": "inside", "GO OUT": "outside",
  "GO UPSTREAM": "upstream", "GO DOWNSTREAM": "downstream",
  "GO LEFT": "left", "GO RIGHT": "right",
  "GO ACROSS": "across", "GO OVER": "over",
};

const SECRET_ACTION_IDS = new Set([
  "go_xyzzy", "go_plugh", "go_plover", "go_y2",
]);

const SECRET_LABELS = new Set([
  "xyzzy", "plugh", "plover", "y2",
  "fee", "fie", "foe", "foo", "fum",
]);

const ABBREV_EXPAND: Record<string, string> = {
  "downs": "downstream", "upstr": "upstream", "forwa": "forward",
  "entra": "entrance", "barre": "barren room", "secre": "secret passage",
  "cobbl": "cobble crawl", "debri": "debris room", "depre": "depression",
  "caver": "cavern", "canyo": "canyon", "fores": "forest",
  "passa": "passage", "orien": "oriental room", "reser": "reservoir",
  "bedqu": "bedquilt", "surfa": "surface", "outdo": "outdoors",
  "inwar": "inward", "upwar": "upward", "strea": "stream",
  "shell": "shell room", "plove": "plover room",
};

const COMPASS_IDS = new Set([
  "go_north", "go_south", "go_east", "go_west",
  "go_ne", "go_nw", "go_se", "go_sw",
  "go_up", "go_down", "go_in", "go_out",
  "go_left", "go_right",
]);

const GENERIC_MOVE_IDS = new Set([
  "go_enter", "go_in", "go_out", "go_climb", "go_crawl",
  "go_cross", "go_jump", "go_view", "go_over",
]);

function resolveExitLabel(action: Action): string {
  const label = action.label.toUpperCase();
  let friendly = EXIT_LABEL_MAP[label] ||
    action.label.replace(/^GO\s+TO\s+/i, "").replace(/^GO\s+/i, "").toLowerCase();
  const abbrevKey = friendly.trim();
  if (ABBREV_EXPAND[abbrevKey]) {
    friendly = ABBREV_EXPAND[abbrevKey];
  }
  return friendly;
}

function formatExitHint(actions: Action[]): string | null {
  const moveActions = actions.filter(
    (a) => a.type === "move" &&
      a.id !== "go_default" && a.id !== "look" &&
      !SECRET_ACTION_IDS.has(a.id) &&
      !SECRET_LABELS.has(a.label.toLowerCase())
  );
  if (moveActions.length === 0) return null;

  const byDest = new Map<string, Action[]>();
  for (const action of moveActions) {
    const dest = action.to || action.id;
    const group = byDest.get(dest) || [];
    group.push(action);
    byDest.set(dest, group);
  }

  const deduped: Action[] = [];
  for (const [, group] of byDest) {
    if (group.length === 1) {
      deduped.push(group[0]);
    } else {
      const specific = group.find((a) => !COMPASS_IDS.has(a.id) && !GENERIC_MOVE_IDS.has(a.id));
      if (specific) {
        deduped.push(specific);
      } else {
        const compass = group.find((a) => COMPASS_IDS.has(a.id));
        deduped.push(compass || group[0]);
      }
    }
  }

  const seen = new Set<string>();
  const directions: string[] = [];
  for (const action of deduped) {
    const friendly = resolveExitLabel(action);
    if (!seen.has(friendly)) {
      seen.add(friendly);
      directions.push(friendly);
    }
  }

  if (directions.length === 0) return null;

  if (directions.length === 1) {
    return `Paths: ${directions[0]}.`;
  }
  if (directions.length === 2) {
    return `Paths: ${directions[0]} and ${directions[1]}.`;
  }
  const last = directions.pop()!;
  return `Paths: ${directions.join(", ")}, and ${last}.`;
}

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gameOver, setGameOver] = useState<"escaped" | "died" | null>(null);
  const initialized = useRef(false);

  const awardMilestone = useCallback((id: MilestoneId) => {
    setGameState((prev) => {
      if (prev.milestonesCompleted.includes(id)) return prev;
      if (__DEV__) console.log(`[Milestone] Awarded: ${id}`);
      return {
        ...prev,
        milestonesCompleted: [...prev.milestonesCompleted, id],
      };
    });
  }, []);

  const milestonesCompletedCount = PROGRESS_MILESTONES.filter((m) =>
    gameState.milestonesCompleted.includes(m)
  ).length;

  useEffect(() => {
    if (isLoading) return;

    const sceneId = gameState.sceneId;
    const sceneMilestone = MILESTONE_SCENE_TRIGGERS[sceneId];
    if (sceneMilestone) awardMilestone(sceneMilestone);

    for (const itemId of gameState.inventory) {
      const itemMilestone = MILESTONE_ITEM_TRIGGERS[itemId];
      if (itemMilestone) awardMilestone(itemMilestone);
    }

    for (const [flagName, flagValue] of Object.entries(gameState.flags)) {
      if (flagValue) {
        const flagMilestone = MILESTONE_FLAG_TRIGGERS[flagName];
        if (flagMilestone) awardMilestone(flagMilestone);
      }
    }

    if (MAZE_SCENE_IDS.includes(sceneId)) {
      const visitedMazeScenes = gameState.visitHistory.filter((s) =>
        MAZE_SCENE_IDS.includes(s)
      );
      const uniqueMaze = new Set(visitedMazeScenes);
      if (uniqueMaze.size >= 5) awardMilestone("maze_mastery");
    }

    if (gameState.visitHistory.includes("snakeblock")) {
      const snakeIdx = gameState.visitHistory.indexOf("snakeblock");
      const afterSnake = gameState.visitHistory.slice(snakeIdx + 1);
      if (afterSnake.some((s) => s === "kinghall" || s === "misthall")) {
        awardMilestone("snake_removed");
      }
    }

    if (
      gameState.visitHistory.includes("eastfissure") ||
      gameState.visitHistory.includes("westfissure")
    ) {
      const visited = new Set(gameState.visitHistory);
      if (visited.has("eastfissure") && visited.has("westfissure")) {
        awardMilestone("crystal_bridge_formed");
      }
    }

    const treasureItems = ["nugget", "coins", "eggs", "trident", "emerald", "pyramid", "ruby", "sapph"];
    const treasureCount = treasureItems.filter((t) => gameState.inventory.includes(t)).length;
    if (treasureCount >= 3) awardMilestone("treasury_resolved");
    if (treasureCount >= 5) awardMilestone("pirate_event");

    if (gameState.visitHistory.includes("oriental") || gameState.visitHistory.includes("plover")) {
      awardMilestone("dragon_event");
    }

    if (gameOver === "escaped") {
      awardMilestone("ascent_triggered");
      awardMilestone("game_complete");
    }
  }, [gameState.sceneId, gameState.inventory, gameState.flags, gameState.visitHistory, gameOver, isLoading, awardMilestone]);

  const hapticFeedback = useCallback(
    (type: "light" | "medium" | "success" | "warning" | "error") => {
      if (Platform.OS === "web") return;
      switch (type) {
        case "light":
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case "medium":
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case "success":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case "warning":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case "error":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
    },
    []
  );

  const addMessage = useCallback(
    (type: Message["type"], text: string): Message => {
      const message: Message = {
        id: generateMessageId(),
        type,
        text,
        timestamp: Date.now(),
        sceneId: gameState.sceneId,
      };
      setMessages((prev) => [...prev, message]);
      return message;
    },
    [gameState.sceneId]
  );

  const getCurrentScene = useCallback(() => {
    return SCENES[gameState.sceneId];
  }, [gameState.sceneId]);

  const isLocationDark = useCallback((sceneId: string): boolean => {
    const scene = SCENES[sceneId];
    if (!scene) return false;
    if (scene.conditions?.LIT) return false;
    if (scene.conditions?.DEEP) return true;
    return false;
  }, []);

  const isCurrentlyDark = useCallback((): boolean => {
    return isLocationDark(gameState.sceneId) && !gameState.lamp.lit;
  }, [gameState.sceneId, gameState.lamp.lit, isLocationDark]);

  const getObjectsAtLocation = useCallback((sceneId: string): string[] => {
    const result: string[] = [];
    for (const [objId, loc] of Object.entries(gameState.objectLocations)) {
      if (loc === sceneId && !gameState.inventory.includes(objId)) {
        result.push(objId);
      }
    }
    return result;
  }, [gameState.objectLocations, gameState.inventory]);

  const getBottleState = useCallback((): number => {
    return gameState.objectStates["bottle"] ?? BOTTLE_WATER;
  }, [gameState.objectStates]);

  const getLiquidAtLocation = useCallback((sceneId: string): "water" | "oil" | null => {
    const scene = SCENES[sceneId];
    if (!scene?.conditions?.FLUID) return null;
    return scene.conditions.OILY ? "oil" : "water";
  }, []);

  const getBottleLiquid = useCallback((): "water" | "oil" | null => {
    const state = getBottleState();
    if (state === BOTTLE_WATER) return "water";
    if (state === BOTTLE_OIL) return "oil";
    return null;
  }, [getBottleState]);

  const hasBottle = useCallback((): boolean => {
    return gameState.inventory.includes("bottle");
  }, [gameState.inventory]);

  const getSceneDescription = useCallback(
    (sceneId: string, forceLong?: boolean) => {
      const scene = SCENES[sceneId];
      if (!scene) return "";

      if (isLocationDark(sceneId) && !gameState.lamp.lit) {
        return LAMP_MESSAGES.PITCH_DARK;
      }

      const visitCount = gameState.visitCounts[sceneId] || 0;
      const useLong = forceLong || visitCount <= 1 || !gameState.briefMode;
      const baseDesc = (useLong || !scene.description.short)
        ? scene.description.long
        : scene.description.short;

      const objectsHere = getObjectsAtLocation(sceneId);
      const itemDescs: string[] = [];
      for (const objId of objectsHere) {
        const desc = scene.itemDescriptions?.[objId];
        if (desc) {
          itemDescs.push(desc);
        } else {
          const item = ITEMS[objId];
          if (item) {
            itemDescs.push(item.description);
          }
        }
      }

      if (sceneId === "kinghall" && !gameState.flags.snakeChased) {
        itemDescs.push("A huge green fierce snake bars the way!");
      }
      if (DRAGON_LOCATIONS.includes(sceneId) && !gameState.flags.dragonDead) {
        itemDescs.push("A huge green fierce dragon bars the way!");
        itemDescs.push("The dragon is sprawled out on a Persian rug!!");
      }
      if (DRAGON_LOCATIONS.includes(sceneId) && gameState.flags.dragonDead) {
        itemDescs.push("The body of a huge green dead dragon is lying off to one side.");
        itemDescs.push("There is blood on the ground here.");
      }
      if ((sceneId === "swchasm" || sceneId === "nechasm") && !gameState.flags.trollGone) {
        if (!gameState.flags.trollPaid) {
          itemDescs.push("A burly troll stands by the bridge and insists you throw him a treasure before you may cross.");
        }
      }
      if (sceneId === "barrenroom") {
        if (!gameState.flags.bearTame) {
          itemDescs.push("There is a ferocious cave bear eying you from the far end of the room!");
          itemDescs.push("The bear is locked to the wall with a golden chain!");
        } else if (!gameState.flags.chainUnlocked) {
          itemDescs.push("There is a gentle cave bear sitting placidly in one corner.");
          itemDescs.push("The bear is still locked to the wall with a golden chain.");
        }
      }
      if (sceneId === "westpit") {
        const plantState = gameState.objectStates["plant"] || 0;
        if (plantState === 0) {
          itemDescs.push("There is a tiny little plant in the pit, murmuring \"Water, water, ...\"");
        } else if (plantState === 1) {
          itemDescs.push("There is a 12-foot-tall beanstalk stretching up out of the pit, bellowing \"Water!! Water!!\"");
        } else if (plantState === 2) {
          itemDescs.push("There is a gigantic beanstalk stretching all the way up to the hole.");
        }
      }
      if (sceneId === URN_LOCATION) {
        const urnState = gameState.objectStates["urn"] ?? URN_EMPTY;
        if (urnState === URN_EMPTY) {
          itemDescs.push("There is a large stone-carved urn here, empty.");
        } else if (urnState === URN_DARK) {
          itemDescs.push("There is a large stone-carved urn here, full of oil.");
        } else if (urnState === URN_LIT) {
          itemDescs.push("There is a large stone-carved urn here, lit with a brilliant flame.");
        }
        const cavityState = gameState.objectStates["cavity"] ?? CAVITY_FULL;
        if (cavityState === CAVITY_FULL && gameState.objectLocations["amber"] === sceneId) {
          itemDescs.push("There is an amber gemstone resting in a small cavity in the wall!");
        } else if (cavityState === CAVITY_EMPTY) {
          itemDescs.push("There is an empty cavity in the wall.");
        }
      }

      if (itemDescs.length > 0) {
        return baseDesc + "\n\n" + itemDescs.join("\n");
      }

      return baseDesc;
    },
    [gameState.inventory, gameState.lamp.lit, gameState.visitCounts, gameState.briefMode, gameState.objectLocations, gameState.flags, gameState.objectStates, isLocationDark, getObjectsAtLocation]
  );

  const getAvailableActions = useCallback((): Action[] => {
    const scene = getCurrentScene();
    if (!scene) return [];

    const removedIds = gameState.removedActions[gameState.sceneId] || [];
    return scene.actions.filter((action) => {
      if (removedIds.includes(action.id)) return false;
      if (action.requiresItem && !gameState.inventory.includes(action.requiresItem))
        return false;
      if ((action as any).requiresFlag && !gameState.flags[(action as any).requiresFlag])
        return false;
      return true;
    });
  }, [gameState, getCurrentScene]);

  const getShortcutActions = useCallback((): Action[] => {
    const scene = getCurrentScene();
    if (!scene) return [];

    const availableActions = scene.actions.filter((action) => {
      const removedIds = gameState.removedActions[gameState.sceneId] || [];
      if (removedIds.includes(action.id)) return false;
      if (action.requiresItem && !gameState.inventory.includes(action.requiresItem))
        return false;
      if ((action as any).requiresFlag && !gameState.flags[(action as any).requiresFlag])
        return false;
      return true;
    });

    const compassActionIds = new Set([
      "go_north", "go_south", "go_east", "go_west",
      "go_ne", "go_nw", "go_se", "go_sw",
      "go_up", "go_down", "go_in", "go_out",
      "go_n", "go_s", "go_e", "go_w",
    ]);

    const takenItems = gameState.inventory;
    const remainingItems = (scene.items || []).filter(
      (itemId) => !takenItems.includes(itemId)
    );
    const itemDescs = remainingItems
      .map((itemId) => scene.itemDescriptions?.[itemId] || "")
      .join(" ");
    const visibleText = (scene.description.long + " " + itemDescs).toLowerCase();

    return availableActions.filter((action) => {
      const actionAny = action as any;
      
      // Hide speak/message-only actions (uiHint: "hidden" or has message but no addsItem)
      if (actionAny.uiHint === "hidden") return false;
      if (actionAny.message && !action.addsItem && !action.setsFlag) return false;
      
      // TAKE pills: only show if item is present in scene AND not yet taken
      if (action.type === "event" && action.addsItem) {
        const itemId = action.addsItem;
        const isInScene = (scene.items || []).includes(itemId);
        const isAlreadyTaken = takenItems.includes(itemId);
        if (!isInScene || isAlreadyTaken) return false;
      }
      
      // Move actions: filter based on visibility rules
      if (action.type === "move") {
        if (compassActionIds.has(action.id)) return true;
        const verb = action.id.replace(/^go_/, "");
        return visibleText.includes(verb.toLowerCase());
      }
      
      return true;
    });
  }, [gameState, getCurrentScene]);

  const addExitHint = useCallback(
    (sceneId: string) => {
      if (isLocationDark(sceneId) && !gameState.lamp.lit) return;
      const scene = SCENES[sceneId];
      if (!scene) return;
      const removedIds = gameState.removedActions[sceneId] || [];
      const availableActions = scene.actions.filter((action) => {
        if (removedIds.includes(action.id)) return false;
        if (action.requiresItem && !gameState.inventory.includes(action.requiresItem))
          return false;
        if ((action as any).requiresFlag && !gameState.flags[(action as any).requiresFlag])
          return false;
        return true;
      });
      const hint = formatExitHint(availableActions);
      if (hint) {
        const message: Message = {
          id: generateMessageId(),
          type: "nav-hint",
          text: hint,
          timestamp: Date.now(),
          sceneId: gameState.sceneId,
        };
        setMessages((prev) => [...prev.filter((m) => m.type !== "nav-hint"), message]);
      }
    },
    [isLocationDark, gameState.lamp.lit, gameState.removedActions, gameState.inventory, gameState.flags, gameState.sceneId]
  );

  const decreaseLampLife = useCallback(() => {
    setGameState((prev) => {
      if (!prev.lamp.lit || prev.lamp.limit < 0) {
        return {
          ...prev,
          stats: {
            ...prev.stats,
            turns: prev.stats.turns + 1,
          },
        };
      }
      const newLimit = prev.lamp.limit - 1;
      return {
        ...prev,
        stats: {
          ...prev.stats,
          turns: prev.stats.turns + 1,
        },
        lamp: {
          ...prev.lamp,
          limit: newLimit < 0 ? -1 : newLimit,
        },
      };
    });
  }, []);

  const isHintEligible = useCallback((hintNumber: number): boolean => {
    const cond = HINT_CONDITIONS[hintNumber];
    if (!cond) return true;
    const gs = gameState;
    switch (cond.type) {
      case "flag_false":
        return !gs.flags[cond.flag as string];
      case "flag_true":
        return !!gs.flags[cond.flag as string];
      case "not_carrying":
        if (!gs.inventory.includes(cond.item as string)) {
          const itemLoc = gs.objectLocations[cond.item as string];
          return itemLoc === gs.sceneId;
        }
        return false;
      case "carrying":
        return gs.inventory.includes(cond.item as string);
      case "treasure_count": {
        const count = (cond.items || []).filter(t => gs.inventory.includes(t)).length;
        return count >= (cond.threshold || 0);
      }
      case "always":
      default:
        return true;
    }
  }, [gameState]);

  const getEffectiveHints = useCallback((scene: typeof SCENES[string]): number[] => {
    if (scene.hints && scene.hints.length > 0) return scene.hints;
    const moveActions = scene.actions.filter(a => a.type === "move" && a.id !== "look");
    if (moveActions.length === 1 && moveActions[0].to) {
      const parentScene = SCENES[moveActions[0].to];
      if (parentScene && parentScene.hints && parentScene.hints.length > 0) {
        return parentScene.hints;
      }
    }
    return [];
  }, []);

  const checkHints = useCallback(() => {
    const scene = SCENES[gameState.sceneId];
    if (!scene) return;
    const effectiveHints = getEffectiveHints(scene);
    if (effectiveHints.length === 0) return;

    for (const hintNum of effectiveHints) {
      if (gameState.hintState.hintsGiven.includes(hintNum)) continue;
      if (!isHintEligible(hintNum)) continue;

      const hint = HINTS.find(h => h.number === hintNum);
      if (!hint) continue;

      const currentTurns = gameState.hintState.turnsInLocation[hintNum] || 0;
      const newTurns = currentTurns + 1;

      setGameState(prev => ({
        ...prev,
        hintState: {
          ...prev.hintState,
          turnsInLocation: {
            ...prev.hintState.turnsInLocation,
            [hintNum]: newTurns,
          },
        },
      }));

      if (newTurns >= hint.turns) {
        addMessage("system", hint.question);
        setGameState(prev => ({
          ...prev,
          pendingPrompt: {
            type: "hint_question",
            text: hint.question,
            hintNumber: hintNum,
          },
        }));
        return;
      }
    }
  }, [gameState, isHintEligible, getEffectiveHints]);

  const triggerDeath = useCallback((deathMessage?: string) => {
    if (deathMessage) {
      addMessage("narration", deathMessage);
    }

    if (gameState.flags.closingReached || gameState.flags.closed) {
      addMessage("narration", "It looks as though you're dead. Well, seeing as how it's so close to closing time anyway, let's just call it a day.");
      const { score, maxScore } = calculateScore(gameState);
      addMessage("system", `You scored ${score} out of a possible ${maxScore}, using ${gameState.stats.turns} turns.`);
      addMessage("system", getScoreClass(score));
      setGameOver("died");
      hapticFeedback("error");
      return;
    }

    const { numdie, maxDeaths } = gameState.deathState;
    if (numdie >= maxDeaths) {
      addMessage("narration", "You have used all your chances. This time you really are dead.");
      setGameOver("died");
      hapticFeedback("error");
      return;
    }

    const obituaryIndex = Math.min(numdie, OBITUARIES.length - 1);
    const obituary = OBITUARIES[obituaryIndex];

    addMessage("narration", obituary.query);

    setGameState(prev => ({
      ...prev,
      pendingPrompt: {
        type: "obituary",
        text: obituary.query,
        obituaryIndex,
      },
    }));
    hapticFeedback("error");
  }, [gameState.deathState, gameState.flags, gameState.stats, addMessage, hapticFeedback]);

  const handlePromptResponse = useCallback((accepted: boolean) => {
    const prompt = gameState.pendingPrompt;
    if (!prompt) return;

    if (prompt.type === "hint_question") {
      if (accepted && prompt.hintNumber !== undefined) {
        const hint = HINTS.find(h => h.number === prompt.hintNumber);
        if (hint) {
          setGameState(prev => ({
            ...prev,
            pendingPrompt: {
              type: "hint_answer",
              text: hint.hint,
              hintNumber: hint.number,
            },
          }));
          return;
        }
      }
      setGameState(prev => ({
        ...prev,
        pendingPrompt: null,
        hintState: {
          ...prev.hintState,
          turnsInLocation: {
            ...prev.hintState.turnsInLocation,
            [prompt.hintNumber!]: 0,
          },
        },
      }));
    } else if (prompt.type === "hint_answer") {
      const hint = HINTS.find(h => h.number === prompt.hintNumber);
      addMessage("system", prompt.text);
      setGameState(prev => ({
        ...prev,
        pendingPrompt: null,
        stats: {
          ...prev.stats,
          score: prev.stats.score - (hint?.penalty || 0),
        },
        hintState: {
          ...prev.hintState,
          hintsGiven: [...prev.hintState.hintsGiven, prompt.hintNumber!],
          turnsInLocation: {
            ...prev.hintState.turnsInLocation,
            [prompt.hintNumber!]: 0,
          },
        },
      }));
    } else if (prompt.type === "obituary") {
      if (accepted) {
        const obituary = OBITUARIES[prompt.obituaryIndex || 0];
        addMessage("narration", obituary.yesResponse);

        setGameState(prev => {
          const newObjLocs = { ...prev.objectLocations };
          const newObjStates = { ...prev.objectStates };
          for (const itemId of prev.inventory) {
            newObjLocs[itemId] = prev.sceneId;
            if (itemId === "bird") {
              newObjStates.bird = 0;
            }
          }
          return {
            ...prev,
            pendingPrompt: null,
            sceneId: "building",
            previousSceneId: null,
            inventory: [],
            objectLocations: newObjLocs,
            objectStates: newObjStates,
            lamp: {
              ...prev.lamp,
              lit: false,
            },
            deathState: {
              ...prev.deathState,
              numdie: prev.deathState.numdie + 1,
            },
          };
        });

        setTimeout(() => {
          addMessage("narration", getSceneDescription("building"));
          addExitHint("building");
        }, 500);
      } else {
        setGameState(prev => ({
          ...prev,
          pendingPrompt: null,
        }));
        setGameOver("died");
      }
    }
  }, [gameState.pendingPrompt, addMessage, addExitHint, getSceneDescription]);

  const checkTurnThresholds = useCallback(() => {
    for (const threshold of TURN_THRESHOLDS) {
      if (
        gameState.stats.turns >= threshold.threshold &&
        !gameState.thresholdsTriggered.includes(threshold.threshold)
      ) {
        addMessage("warning", threshold.message);
        setGameState(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            score: prev.stats.score - threshold.pointLoss,
          },
          thresholdsTriggered: [...prev.thresholdsTriggered, threshold.threshold],
        }));
      }
    }
  }, [gameState.stats.turns, gameState.thresholdsTriggered, addMessage]);

  const checkCaveClosure = useCallback(() => {
    if (gameOver) return;
    if (gameState.flags.closed) return;

    if (gameState.flags.closingReached) {
      const clock2Val = gameState.objectStates["clock2"];
      if (clock2Val === undefined) {
        setGameState((prev) => ({
          ...prev,
          objectStates: { ...prev.objectStates, clock2: CLOCK2_START },
        }));
        return;
      }

      const newClock2 = clock2Val - 1;

      if (newClock2 <= 0) {
        addMessage(
          "narration",
          "The sepulchral voice intones, \"The cave is now closed.\" As the echoes fade, you hear a blinding blast of light, and find yourself transported to..."
        );

        setGameState((prev) => ({
          ...prev,
          sceneId: "ne",
          previousSceneId: null,
          inventory: [],
          flags: {
            ...prev.flags,
            closed: true,
            endgameMirrorBroken: false,
          },
          objectStates: { ...prev.objectStates, clock2: -1 },
          objectLocations: {
            ...prev.objectLocations,
            bottle: "ne",
            rod: "ne",
            lamp: "ne",
            rod2: "sw",
            pillow: "sw",
          },
          lamp: { ...prev.lamp, lit: false },
        }));

        setTimeout(() => {
          addMessage("narration", SCENES["ne"]?.description.long || "You are at the northeast end of an immense room.");
        }, 500);
        hapticFeedback("warning");
        return;
      }

      setGameState((prev) => ({
        ...prev,
        objectStates: { ...prev.objectStates, clock2: newClock2 },
      }));
      return;
    }

    let tally = 0;
    for (const tid of TREASURE_IDS) {
      const loc = gameState.objectLocations[tid];
      const inInventory = gameState.inventory.includes(tid);
      if (!loc && !inInventory) {
        tally++;
      }
    }

    const clock1Val = gameState.objectStates["clock1"];

    if (tally > 0) return;

    if (clock1Val === undefined) {
      setGameState((prev) => ({
        ...prev,
        objectStates: { ...prev.objectStates, clock1: CLOCK1_START },
      }));
      return;
    }

    if (!isDeepCave(gameState.sceneId) || gameState.sceneId === "y2") return;

    const newClock1 = clock1Val - 1;

    if (newClock1 <= 0) {
      addMessage(
        "narration",
        "A sepulchral voice reverberating through the cave says, \"Cave closing soon. All adventurers exit immediately through main office.\""
      );
      setGameState((prev) => {
        const newDwarves = prev.dwarfState.dwarves.map((d) => ({
          ...d,
          alive: false,
          loc: "_nowhere",
        }));
        return {
          ...prev,
          flags: {
            ...prev.flags,
            closingReached: true,
            grateOpen: false,
            crystalBridge: false,
            trollGone: true,
          },
          objectStates: { ...prev.objectStates, clock1: -1 },
          dwarfState: {
            ...prev.dwarfState,
            dwarves: newDwarves,
            knfloc: null,
          },
        };
      });
      hapticFeedback("warning");
    } else {
      setGameState((prev) => ({
        ...prev,
        objectStates: { ...prev.objectStates, clock1: newClock1 },
      }));
    }
  }, [gameState.flags.closingReached, gameState.flags.closed, gameState.objectStates, gameState.objectLocations, gameState.inventory, gameState.sceneId, gameOver, addMessage, hapticFeedback]);

  const checkLampWarning = useCallback(() => {
    const { lamp, batteryState } = gameState;
    if (!lamp.lit) return;
    
    if (lamp.limit <= 0 && !gameOver) {
      addMessage("warning", LAMP_MESSAGES.LAMP_OUT);
      setGameState((prev) => ({
        ...prev,
        lamp: { ...prev.lamp, lit: false, warned: true },
      }));
      if (isCurrentlyDark()) {
        addMessage("narration", LAMP_MESSAGES.PITCH_DARK);
      }
      hapticFeedback("error");
      return;
    }

    if (lamp.limit <= WARN_TIME && !lamp.warned) {
      let warningMsg = LAMP_MESSAGES.LAMP_DIM;

      if (batteryState === "used" || batteryState === "dead") {
        warningMsg = LAMP_MESSAGES.MISSING_BATTERIES;
      } else if (gameState.inventory.includes("battery")) {
        warningMsg = LAMP_MESSAGES.REPLACE_BATTERIES;
        setGameState((prev) => ({
          ...prev,
          lamp: {
            ...prev.lamp,
            limit: prev.lamp.limit + BATTERY_LIFE_BONUS,
            warned: false,
          },
          batteryState: "used",
          inventory: prev.inventory.filter(id => id !== "battery"),
        }));
        addMessage("system", warningMsg);
        hapticFeedback("success");
        return;
      } else if (batteryState === "available") {
        warningMsg = LAMP_MESSAGES.GET_BATTERIES;
      }

      addMessage("warning", warningMsg);
      hapticFeedback("warning");
      setGameState((prev) => ({
        ...prev,
        lamp: { ...prev.lamp, warned: true },
      }));
    }
  }, [gameState.lamp, gameState.batteryState, gameState.inventory, addMessage, hapticFeedback, gameOver, isCurrentlyDark]);

  const processDwarves = useCallback(() => {
    if (gameOver) return;
    if (gameState.flags.closingReached || gameState.flags.closed) return;

    const result = processDwarfTurn(
      gameState.dwarfState,
      gameState.sceneId,
      gameState.inventory,
      gameState.objectLocations,
      gameState.lamp.lit,
      0,
      gameState.rngSeed,
    );

    setGameState((prev) => {
      const newObjectLocations = { ...prev.objectLocations };
      const newInventory = [...prev.inventory];

      if (result.state.chestPlaced && !prev.dwarfState.chestPlaced) {
        newObjectLocations["chest"] = CHEST_HIDE_LOC;
        newObjectLocations["messag"] = MESSAGE_HIDE_LOC;
      }

      const stolenItems: string[] = [];
      for (const msg of result.messages) {
        if (msg.includes("I'll just take all this booty")) {
          for (const tid of TREASURE_IDS) {
            const idx = newInventory.indexOf(tid);
            if (idx !== -1) {
              if (tid === "pyramid" && (prev.sceneId === "plover" || prev.sceneId === "darkroom")) {
                continue;
              }
              stolenItems.push(tid);
              newInventory.splice(idx, 1);
              newObjectLocations[tid] = CHEST_HIDE_LOC;
            }
          }
        }
      }

      return {
        ...prev,
        dwarfState: result.state,
        rngSeed: result.seed,
        inventory: stolenItems.length > 0 ? newInventory : prev.inventory,
        objectLocations: newObjectLocations,
      };
    });

    for (const msg of result.messages) {
      if (msg.includes("dwarf") || msg.includes("pirate") || msg.includes("rustle") || msg.includes("rustling") || msg.includes("booty") || msg.includes("Shiver")) {
        addMessage("narration", msg);
      } else {
        addMessage("warning", msg);
      }
    }

    if (result.playerDied) {
      triggerDeath();
    }
  }, [gameState.dwarfState, gameState.sceneId, gameState.inventory, gameState.objectLocations, gameState.lamp.lit, gameState.rngSeed, gameState.flags, gameOver, addMessage, triggerDeath]);

  const handleMove = useCallback(
    (toSceneId: string) => {
      const deathSceneIds = ["neckbroke", "nomake"];
      if (deathSceneIds.includes(gameState.sceneId)) {
        return;
      }

      const newScene = SCENES[toSceneId];
      if (!newScene) {
        addMessage("system", "You can't go that way.");
        return;
      }

      if (gameState.flags.closed && toSceneId !== "ne" && toSceneId !== "sw") {
        addMessage("system", "There is no way to go that direction.");
        return;
      }

      if (gameState.flags.closingReached && !gameState.flags.closed && newScene.conditions?.ABOVE) {
        addMessage("narration", "The cave is now closed.");
        decreaseLampLife();
        return;
      }

      if (toSceneId === "nechasm" && gameState.sceneId === "swchasm" && !gameState.flags.trollPaid && !gameState.flags.trollGone) {
        addMessage("narration", "The troll refuses to let you cross.");
        decreaseLampLife();
        return;
      }
      if (toSceneId === "swchasm" && gameState.sceneId === "nechasm" && !gameState.flags.trollPaid && !gameState.flags.trollGone) {
        addMessage("narration", "The troll refuses to let you cross.");
        decreaseLampLife();
        return;
      }

      const isPloverAlcovePassage = (gameState.sceneId === "plover" && toSceneId === "alcove") || (gameState.sceneId === "alcove" && toSceneId === "plover");
      if (isPloverAlcovePassage) {
        const nonEmeraldItems = gameState.inventory.filter((id) => id !== "emerald");
        if (nonEmeraldItems.length > 0) {
          addMessage("narration", "Something you're carrying won't fit through the tunnel with you. You'd best take inventory and drop something.");
          decreaseLampLife();
          return;
        }
      }

      if (isCurrentlyDark() && !gameOver) {
        const pitChance = Math.random();
        if (pitChance < 0.35) {
          decreaseLampLife();
          triggerDeath("You fell into a pit and broke every bone in your body!");
          hapticFeedback("error");
          return;
        }
      }

      const targetScene = SCENES[toSceneId];
      const defaultAction = targetScene?.actions?.find(
        (a: any) => a.type === "move" && a.id === "go_default"
      );
      const nonLookMoveActions = targetScene?.actions?.filter(
        (a: any) => a.type === "move" && a.id !== "look"
      ) || [];
      const isBounceScene = defaultAction?.to && nonLookMoveActions.length === 1 && nonLookMoveActions[0].id === "go_default";
      const isForcedScene = (toSceneId.startsWith("foof") || isBounceScene) && defaultAction?.to;

      setGameState((prev) => {
        const newVisitCount = (prev.visitCounts[toSceneId] || 0) + 1;
        return {
          ...prev,
          previousSceneId: prev.sceneId,
          sceneId: toSceneId,
          visitHistory: [...(prev.visitHistory || [prev.sceneId]), toSceneId],
          visitCounts: {
            ...prev.visitCounts,
            [toSceneId]: newVisitCount,
          },
        };
      });

      trackScene(toSceneId, SCENES[toSceneId]?.title);

      if (isForcedScene && defaultAction?.to) {
        addMessage("narration", getSceneDescription(toSceneId));
        setTimeout(() => {
          handleMove(defaultAction.to!);
        }, 100);
        return;
      }

      decreaseLampLife();
      addMessage("narration", getSceneDescription(toSceneId));
      addExitHint(toSceneId);

      if (deathSceneIds.includes(toSceneId)) {
        triggerDeath();
        return;
      }

      const y2Rng = lcgRandom(gameState.rngSeed);
      setGameState((prev) => ({ ...prev, rngSeed: y2Rng.nextSeed }));
      if (toSceneId === "y2" && (y2Rng.value % 4) === 0 && !gameState.flags.closingReached) {
        addMessage("narration", "A hollow voice says 'PLUGH'.");
      }

      hapticFeedback("light");
      processDwarves();
      checkCaveClosure();
    },
    [addMessage, addExitHint, decreaseLampLife, hapticFeedback, getSceneDescription, isCurrentlyDark, gameOver, triggerDeath, processDwarves, checkCaveClosure, gameState.sceneId, gameState.flags, gameState.inventory]
  );

  const handleGoBack = useCallback(() => {
    const deathSceneIds = ["neckbroke", "nomake"];
    if (deathSceneIds.includes(gameState.sceneId)) {
      addMessage("system", "You're dead. You can't go anywhere.");
      return;
    }

    if (!gameState.previousSceneId) {
      addMessage("system", "You can't go back any further.");
      return;
    }

    if (isNoBack(gameState.sceneId)) {
      addMessage("system", "Sorry, but I no longer seem to remember how you got here.");
      return;
    }

    const previousScene = SCENES[gameState.previousSceneId];
    if (!previousScene) {
      addMessage("system", "You can't go back that way.");
      return;
    }

    addMessage("action", "Go back");
    
    if (isCurrentlyDark() && !gameOver) {
      const pitChance = Math.random();
      if (pitChance < 0.35) {
        decreaseLampLife();
        triggerDeath("You fell into a pit and broke every bone in your body!");
        hapticFeedback("error");
        return;
      }
    }

    const targetSceneId = gameState.previousSceneId;
    
    setGameState((prev) => ({
      ...prev,
      previousSceneId: prev.sceneId,
      sceneId: targetSceneId!,
      visitHistory: [...(prev.visitHistory || [prev.sceneId]), targetSceneId!],
    }));

    decreaseLampLife();
    addMessage("narration", getSceneDescription(targetSceneId));
    addExitHint(targetSceneId);
    hapticFeedback("light");
    checkLampWarning();
    processDwarves();
    checkCaveClosure();
  }, [gameState.previousSceneId, gameState.sceneId, addMessage, decreaseLampLife, getSceneDescription, addExitHint, hapticFeedback, checkLampWarning, isCurrentlyDark, gameOver, triggerDeath, processDwarves, checkCaveClosure]);

  const handleTakeItem = useCallback(
    (itemId: string, actionId: string) => {
      const item = ITEMS[itemId];
      if (!item) return;

      if (gameState.inventory.length >= INVLIMIT) {
        addMessage("system", "You're carrying too many things already.");
        return;
      }

      if (IMMOVABLE_OBJECTS.has(itemId)) {
        addMessage("system", "You can't take that.");
        return;
      }

      setGameState((prev) => {
        const newObjectLocations = { ...prev.objectLocations };
        delete newObjectLocations[itemId];

        const newState: GameState = {
          ...prev,
          inventory: [...prev.inventory, itemId],
          objectLocations: newObjectLocations,
          removedActions: {
            ...prev.removedActions,
            [prev.sceneId]: [...(prev.removedActions[prev.sceneId] || []), actionId],
          },
        };
        
        if (itemId === "lamp") {
          newState.lamp = {
            ...prev.lamp,
            lit: true,
          };
        }
        
        return newState;
      });

      decreaseLampLife();
      if (itemId === "lamp") {
        addMessage("system", `You pick up the ${item.name}. It glows brightly.`);
      } else {
        addMessage("system", `You pick up the ${item.name}.`);
      }
      hapticFeedback("medium");
    },
    [gameState.inventory.length, addMessage, decreaseLampLife, hapticFeedback]
  );

  const handleDropItem = useCallback(
    (itemId: string) => {
      const item = ITEMS[itemId];
      if (!item) {
        addMessage("system", "You aren't carrying it!");
        return;
      }

      if (!gameState.inventory.includes(itemId)) {
        addMessage("system", "You aren't carrying it!");
        return;
      }

      const currentScene = gameState.sceneId;
      const isTreasure = TREASURE_IDS.includes(itemId);
      const atBuilding = currentScene === TREASURE_DEPOSIT_LOCATION;

      if (itemId === "vase" && currentScene !== "softroom") {
        const hasPillow = gameState.objectLocations["pillow"] === currentScene || gameState.inventory.includes("pillow");
        if (!hasPillow) {
          addMessage("narration", "The ming vase drops with a delicate crash.");
          setGameState((prev) => ({
            ...prev,
            inventory: prev.inventory.filter((id) => id !== itemId),
            objectStates: { ...prev.objectStates, vase: 1 },
          }));
          decreaseLampLife();
          hapticFeedback("error");
          return;
        }
      }

      setGameState((prev) => ({
        ...prev,
        inventory: prev.inventory.filter((id) => id !== itemId),
        objectLocations: {
          ...prev.objectLocations,
          [itemId]: currentScene,
        },
      }));

      if (isTreasure && atBuilding) {
        addMessage("system", `You drop the ${item.name} in the building. It is now safely stored.`);
        hapticFeedback("success");
      } else {
        addMessage("system", `You drop the ${item.name}.`);
        hapticFeedback("light");
      }

      decreaseLampLife();
    },
    [gameState.inventory, gameState.sceneId, gameState.objectLocations, addMessage, decreaseLampLife, hapticFeedback]
  );

  const handleUseItem = useCallback(
    (itemId: string) => {
      const item = ITEMS[itemId];
      if (!item) {
        addMessage("system", "You don't have that item.");
        return;
      }

      if (!gameState.inventory.includes(itemId)) {
        addMessage("system", "You don't have that item.");
        return;
      }

      if (!item.usable) {
        addMessage("system", `You can't use the ${item.name} right now.`);
        return;
      }

      if (item.useEffect) {
        if (item.useEffect.setsFlag && gameState.flags[item.useEffect.setsFlag]) {
          addMessage("system", "That doesn't seem to work here.");
          decreaseLampLife();
          return;
        }

        addMessage("system", item.useEffect.message);

        if (item.useEffect.lightBonus) {
          setGameState((prev) => ({
            ...prev,
            lamp: {
              ...prev.lamp,
              limit: prev.lamp.limit + item.useEffect!.lightBonus!,
              warned: false,
            },
            inventory: prev.inventory.filter((id) => id !== itemId),
          }));
          hapticFeedback("success");
        }

        if (item.useEffect.setsFlag) {
          setGameState((prev) => ({
            ...prev,
            flags: {
              ...prev.flags,
              [item.useEffect!.setsFlag!]: true,
            },
          }));
        }
      }

      decreaseLampLife();
    },
    [gameState.inventory, gameState.flags, addMessage, decreaseLampLife, hapticFeedback]
  );

  const resolveActionDestination = useCallback(
    (action: Action): { type: "goto"; to: string } | { type: "speak"; message: string } | null => {
      if (!action.conditionalRoutes || action.conditionalRoutes.length === 0) {
        return action.to ? { type: "goto", to: action.to } : null;
      }

      for (const route of action.conditionalRoutes) {
        const cond = route.condition;
        let matches = false;

        switch (cond.type) {
          case "carry":
            matches = cond.item ? gameState.inventory.includes(cond.item) : false;
            break;
          case "not":
            if (cond.object && cond.state !== undefined) {
              const currentState = gameState.objectStates[cond.object] ?? 0;
              const targetState = Number(cond.state);
              matches = currentState !== targetState;
            }
            break;
          case "with": {
            if (cond.object) {
              const objLoc = gameState.objectLocations[cond.object];
              const isAtLocation = objLoc === gameState.sceneId;
              const isCarried = gameState.inventory.includes(cond.object);
              matches = isAtLocation || isCarried;
            }
            break;
          }
          case "pct":
            matches = cond.percent ? Math.random() * 100 < cond.percent : false;
            break;
        }

        if (matches) {
          if (route.to) {
            return { type: "goto", to: route.to };
          } else if (route.message) {
            return { type: "speak", message: route.message };
          }
        }
      }

      return action.to ? { type: "goto", to: action.to } : null;
    },
    [gameState.inventory, gameState.objectStates, gameState.objectLocations, gameState.sceneId]
  );

  const handleAction = useCallback(
    (action: Action) => {
      switch (action.type) {
        case "command":
          if (action.command === "look") {
            addMessage("narration", getSceneDescription(gameState.sceneId));
            addExitHint(gameState.sceneId);
          }
          decreaseLampLife();
          break;

        case "move": {
          const resolved = resolveActionDestination(action);
          if (resolved) {
            if (resolved.type === "goto") {
              handleMove(resolved.to);
            } else {
              addMessage("narration", resolved.message);
              decreaseLampLife();
            }
          }
          break;
        }

        case "event":
          const actionAny = action as any;
          if (actionAny.message && !action.addsItem && !action.setsFlag && !action.removesAction) {
            addMessage("system", actionAny.message);
            decreaseLampLife();
            checkLampWarning();
            return;
          }
          if (action.addsItem) {
            handleTakeItem(action.addsItem, action.id);
          }
          if (action.setsFlag) {
            setGameState((prev) => ({
              ...prev,
              flags: {
                ...prev.flags,
                [action.setsFlag!]: true,
              },
            }));

            if (action.setsFlag === "escaped") {
              trackGameComplete();
              setGameOver("escaped");
              hapticFeedback("success");
            }
          }
          if (action.removesAction && !action.addsItem) {
            setGameState((prev) => ({
              ...prev,
              removedActions: {
                ...prev.removedActions,
                [prev.sceneId]: [
                  ...(prev.removedActions[prev.sceneId] || []),
                  action.id,
                ],
              },
            }));
            decreaseLampLife();
          }
          break;
      }
    },
    [getCurrentScene, handleMove, handleTakeItem, addMessage, decreaseLampLife, hapticFeedback, resolveActionDestination]
  );

  // Move these BEFORE parseCommand to avoid hoisting issues
  const handleDirection = useCallback(
    (direction: string) => {
      const dirMap: Record<string, string> = {
        north: "go_north",
        south: "go_south",
        east: "go_east",
        west: "go_west",
        n: "go_north",
        s: "go_south",
        e: "go_east",
        w: "go_west",
        up: "go_up",
        down: "go_down",
        u: "go_up",
        d: "go_down",
        in: "go_in",
        out: "go_out",
        ne: "go_ne",
        nw: "go_nw",
        se: "go_se",
        sw: "go_sw",
        northeast: "go_ne",
        northwest: "go_nw",
        southeast: "go_se",
        southwest: "go_sw",
      };

      const actionId = dirMap[direction.toLowerCase()];
      const actions = getAvailableActions();
      const moveAction = actions.find((a) => a.id === actionId && a.type === "move");

      if (moveAction) {
        const resolved = resolveActionDestination(moveAction);
        if (resolved) {
          if (resolved.type === "goto") {
            handleMove(resolved.to);
          } else {
            addMessage("narration", resolved.message);
            decreaseLampLife();
          }
        } else {
          addMessage("system", "You can't go that way.");
        }
      } else {
        addMessage("system", "You can't go that way.");
      }
    },
    [getAvailableActions, handleMove, addMessage, resolveActionDestination, decreaseLampLife]
  );

  // Autosave effect - saves whenever game state or messages change
  useEffect(() => {
    // Don't save during initial load or if game hasn't started
    if (isLoading || messages.length === 0) return;
    
    const autosave = async () => {
      await saveGame(gameState, messages);
    };
    
    autosave();
  }, [gameState, messages, isLoading]);

  const handleNewGame = useCallback(async () => {
    await deleteSave();
    setGameState(initialGameState);
    setMessages([]);
    setGameOver(null);

    const newMessages: Message[] = INTRO_MESSAGES.map((msg) => ({
      id: generateMessageId(),
      type: "narration" as const,
      text: msg,
      timestamp: Date.now(),
    }));

    const startScene = SCENES[initialGameState.sceneId];
    const sceneMessage: Message = {
      id: generateMessageId(),
      type: "narration",
      text: startScene?.description.long || "You are in a mysterious place.",
      timestamp: Date.now(),
    };

    const startMessages: Message[] = [...newMessages, sceneMessage];
    if (startScene && !isLocationDark(initialGameState.sceneId)) {
      const hint = formatExitHint(startScene.actions);
      if (hint) {
        startMessages.push({
          id: generateMessageId(),
          type: "nav-hint",
          text: hint,
          timestamp: Date.now(),
        });
      }
    }
    setMessages(startMessages);
    hapticFeedback("medium");
  }, [hapticFeedback, isLocationDark]);

  const parseCommand = useCallback(
    (input: string) => {
      const rawInput = input.trim();

      setMessages((prev) =>
        prev.filter((m) => m.text !== "Continuing your journey...")
      );

      if (gameState.pendingPrompt) {
        return;
      }

      if (__DEV__) {
        const testMatch = rawInput.match(/^test\s+(\S+)$/i);
        if (testMatch) {
          const targetSceneId = testMatch[1].toLowerCase();
          if (SCENES[targetSceneId]) {
            addMessage("action", rawInput);
            addMessage("system", `[DEV] Teleporting to: ${targetSceneId}`);
            setGameState((prev) => ({
              ...prev,
              sceneId: targetSceneId,
              previousSceneId: prev.sceneId,
              visitCounts: {
                ...prev.visitCounts,
                [targetSceneId]: (prev.visitCounts[targetSceneId] || 0) + 1,
              },
            }));
            addMessage("narration", getSceneDescription(targetSceneId, true));
            addExitHint(targetSceneId);
            return;
          } else {
            addMessage("action", rawInput);
            addMessage("system", `[DEV] Unknown scene ID: ${targetSceneId}`);
            return;
          }
        }
      }

      const sentenceCased = rawInput.charAt(0).toUpperCase() + rawInput.slice(1).toLowerCase();
      addMessage("action", sentenceCased);

      const availableActions = getAvailableActions();
      const parsed = parseInput(rawInput);
      const resolution = resolve(parsed, {
        availableActions,
        inventory: gameState.inventory,
        items: ITEMS,
        scenes: SCENES,
        objectLocations: gameState.objectLocations,
        currentScene: gameState.sceneId,
      });

      if (__DEV__) {
        console.log("[NLP]", parsed.intent, parsed, "->", resolution.type);
      }

      const commandSucceeded = resolution.type !== "fallback";
      if (commandSucceeded) {
        trackCommand(rawInput, true);
      }

      switch (resolution.type) {
        case "look":
          addMessage("narration", getSceneDescription(gameState.sceneId));
          addExitHint(gameState.sceneId);
          decreaseLampLife();
          checkLampWarning();
          return;

        case "inventory":
          if (gameState.inventory.length === 0) {
            addMessage("system", "Your pockets are empty.");
          } else {
            const items = gameState.inventory
              .map((id) => {
                if (id === "bottle") {
                  const bState = gameState.objectStates["bottle"] ?? BOTTLE_WATER;
                  if (bState === BOTTLE_WATER) return "Small bottle (water)";
                  if (bState === BOTTLE_OIL) return "Small bottle (oil)";
                  return "Small bottle (empty)";
                }
                return ITEMS[id]?.name || id;
              })
              .join(", ");
            addMessage("system", `You are carrying: ${items}`);
          }
          return;

        case "directions": {
          if (isCurrentlyDark()) {
            addMessage("system", "It is pitch dark. You can't see any exits.");
            return;
          }
          const dirActions = getAvailableActions().filter(
            (a) => a.type === "move" && a.id !== "go_default" && a.id !== "look"
          );
          if (dirActions.length === 0) {
            addMessage("system", "There are no obvious exits.");
          } else {
            const labelMap: Record<string, string> = {
              "GO NORTH": "North", "GO SOUTH": "South", "GO EAST": "East", "GO WEST": "West",
              "GO NE": "Northeast", "GO NW": "Northwest", "GO SE": "Southeast", "GO SW": "Southwest",
              "GO UP": "Up", "GO DOWN": "Down", "GO IN": "Inside", "GO OUT": "Outside",
              "GO UPSTREAM": "Upstream", "GO DOWNSTREAM": "Downstream",
              "GO LEFT": "Left", "GO RIGHT": "Right",
              "GO ACROSS": "Across", "GO OVER": "Over",
            };
            const seen = new Set<string>();
            const directions: string[] = [];
            for (const action of dirActions) {
              const label = action.label.toUpperCase();
              const friendly = labelMap[label] || action.label.replace(/^GO\s+/i, "").replace(/\b\w/g, (c) => c.toUpperCase());
              if (!seen.has(friendly)) {
                seen.add(friendly);
                directions.push(friendly);
              }
            }
            addMessage("system", `From here you can go: ${directions.join(", ")}.`);
          }
          return;
        }

        case "help":
          trackHelpOpened();
          addMessage("system", HELP_TEXT);
          return;

        case "back":
          handleGoBack();
          return;

        case "new":
          handleNewGame();
          return;

        case "lamp_on":
          if (!gameState.inventory.includes("lamp")) {
            addMessage("system", "You don't have the lamp.");
          } else if (gameState.lamp.lit) {
            addMessage("system", "Your lamp is already on.");
          } else if (gameState.lamp.limit <= 0) {
            addMessage("system", LAMP_MESSAGES.LAMP_OUT);
          } else {
            setGameState((prev) => ({
              ...prev,
              lamp: { ...prev.lamp, lit: true },
            }));
            addMessage("system", LAMP_MESSAGES.LAMP_ON);
            hapticFeedback("medium");
          }
          decreaseLampLife();
          checkLampWarning();
          return;

        case "lamp_off":
          if (!gameState.inventory.includes("lamp")) {
            addMessage("system", "You don't have the lamp.");
          } else if (!gameState.lamp.lit) {
            addMessage("system", "Your lamp is already off.");
          } else {
            setGameState((prev) => ({
              ...prev,
              lamp: { ...prev.lamp, lit: false },
            }));
            addMessage("system", LAMP_MESSAGES.LAMP_OFF);
            if (isLocationDark(gameState.sceneId)) {
              addMessage("narration", LAMP_MESSAGES.PITCH_DARK);
            }
            hapticFeedback("medium");
          }
          decreaseLampLife();
          return;

        case "direction":
          if (resolution.correction) addMessage("system", resolution.correction);
          handleDirection(resolution.direction);
          checkLampWarning();
          return;

        case "action":
          if (resolution.correction) addMessage("system", resolution.correction);
          handleAction(resolution.action);
          checkLampWarning();
          return;

        case "useItem": {
          if (resolution.correction) addMessage("system", resolution.correction);
          const useId = resolution.itemId;
          if (useId === "urn" && gameState.sceneId === URN_LOCATION) {
            const urnState = gameState.objectStates["urn"] ?? URN_EMPTY;
            if (urnState === URN_EMPTY) {
              addMessage("system", "The urn is empty. There is nothing to light.");
            } else if (urnState === URN_DARK) {
              setGameState((prev) => ({
                ...prev,
                objectStates: { ...prev.objectStates, urn: URN_LIT },
                objectLocations: { ...prev.objectLocations, amber: URN_LOCATION },
              }));
              addMessage("narration", "The oil in the urn catches fire and burns with a bright flame! In the wall above the urn, a small cavity is revealed, containing an amber gemstone!");
              hapticFeedback("success");
            } else {
              addMessage("system", "The urn is already lit.");
            }
            decreaseLampLife();
            return;
          }
          handleUseItem(useId);
          checkLampWarning();
          return;
        }

        case "takeItem": {
          if (resolution.correction) addMessage("system", resolution.correction);
          const takeId = resolution.itemId;
          if (takeId === "water" || takeId === "oil") {
            if (!hasBottle()) {
              addMessage("system", "You have nothing in which to carry it.");
              decreaseLampLife();
              return;
            }
            if (getBottleState() !== BOTTLE_EMPTY) {
              addMessage("system", "Your bottle is already full.");
              decreaseLampLife();
              return;
            }
            const liquidHere = getLiquidAtLocation(gameState.sceneId);
            if (takeId === "water" && liquidHere === "water") {
              setGameState((prev) => ({
                ...prev,
                objectStates: { ...prev.objectStates, bottle: BOTTLE_WATER },
              }));
              addMessage("system", "Your bottle is now full of water.");
            } else if (takeId === "oil" && liquidHere === "oil") {
              setGameState((prev) => ({
                ...prev,
                objectStates: { ...prev.objectStates, bottle: BOTTLE_OIL },
              }));
              addMessage("system", "Your bottle is now full of oil.");
            } else {
              addMessage("system", `There is no ${takeId} here.`);
            }
            decreaseLampLife();
            return;
          }
          if (takeId === "amber") {
            if (gameState.sceneId === URN_LOCATION) {
              const cavityState = gameState.objectStates["cavity"] ?? CAVITY_FULL;
              if (cavityState === CAVITY_FULL && gameState.objectLocations["amber"] === URN_LOCATION) {
                if (gameState.inventory.length >= INVLIMIT) {
                  addMessage("system", "You can't carry anything more. You'll have to drop something first.");
                  decreaseLampLife();
                  return;
                }
                setGameState((prev) => {
                  const newObjLocs = { ...prev.objectLocations };
                  delete newObjLocs["amber"];
                  return {
                    ...prev,
                    inventory: [...prev.inventory, "amber"],
                    objectLocations: newObjLocs,
                    objectStates: { ...prev.objectStates, cavity: CAVITY_EMPTY },
                  };
                });
                addMessage("system", "You take the amber gemstone from the cavity.");
                hapticFeedback("medium");
                decreaseLampLife();
                return;
              }
            }
          }
          if (takeId === "bird") {
            if (gameState.objectLocations["bird"] !== gameState.sceneId) {
              addMessage("system", "You don't see that here.");
              decreaseLampLife();
              return;
            }
            if (gameState.inventory.includes("rod")) {
              addMessage("narration", "The bird was unafraid when you entered, but as you approach it becomes disturbed and you cannot catch it.");
              decreaseLampLife();
              return;
            }
            if (!gameState.inventory.includes("cage")) {
              addMessage("narration", "You can catch the bird, but you cannot carry it.");
              decreaseLampLife();
              return;
            }
            setGameState((prev) => {
              const newObjLocs = { ...prev.objectLocations };
              delete newObjLocs["bird"];
              return {
                ...prev,
                inventory: [...prev.inventory, "bird"],
                objectLocations: newObjLocs,
                objectStates: { ...prev.objectStates, bird: 1 },
              };
            });
            addMessage("system", "You catch the bird and put it in the cage.");
            hapticFeedback("medium");
            decreaseLampLife();
            return;
          }
          if (takeId === "chain") {
            if (gameState.objectLocations["chain"] !== gameState.sceneId) {
              addMessage("system", "You don't see that here.");
              decreaseLampLife();
              return;
            }
            addMessage("system", "The chain is locked to the wall. You'll need to unlock it first.");
            decreaseLampLife();
            return;
          }
          handleTakeItem(takeId, resolution.actionId);
          checkLampWarning();
          return;
        }

        case "dropItem": {
          if (resolution.correction) addMessage("system", resolution.correction);
          const dropId = resolution.itemId;
          if (dropId === "bird" && gameState.sceneId === "kinghall" && !gameState.flags.snakeChased) {
            setGameState((prev) => ({
              ...prev,
              inventory: prev.inventory.filter((id) => id !== "bird"),
              objectLocations: { ...prev.objectLocations, bird: prev.sceneId, snake: "limbo" },
              objectStates: { ...prev.objectStates, bird: 0, snake: 1 },
              flags: { ...prev.flags, snakeChased: true },
            }));
            addMessage("narration", "The little bird attacks the green snake, and in an astounding flurry drives the snake away.");
            hapticFeedback("success");
            decreaseLampLife();
            return;
          }
          if (dropId === "bird") {
            setGameState((prev) => ({
              ...prev,
              inventory: prev.inventory.filter((id) => id !== "bird"),
              objectLocations: { ...prev.objectLocations, bird: prev.sceneId },
              objectStates: { ...prev.objectStates, bird: 0 },
            }));
            addMessage("system", "The little bird flies free.");
            decreaseLampLife();
            return;
          }
          if (dropId === "coins" && gameState.sceneId === "deadend13") {
            setGameState((prev) => ({
              ...prev,
              inventory: prev.inventory.filter((id) => id !== "coins"),
              objectLocations: { ...prev.objectLocations, battery: "deadend13" },
              batteryState: "available",
            }));
            addMessage("narration", "There are fresh batteries here.");
            hapticFeedback("success");
            decreaseLampLife();
            return;
          }
          handleDropItem(dropId);
          checkLampWarning();
          return;
        }

        case "score": {
          const result = calculateScore(gameState);
          const cls = getScoreClass(result.score);
          addMessage("system", `You have scored ${result.score} out of a possible ${result.maxScore}, in ${gameState.stats.turns} turns.\n${cls}`);
          return;
        }

        case "brief":
          setGameState((prev) => ({
            ...prev,
            briefMode: !prev.briefMode,
          }));
          addMessage("system", gameState.briefMode
            ? "Descriptions will now be long."
            : "Descriptions will now be brief.");
          return;

        case "wait":
          addMessage("narration", "Time passes...");
          decreaseLampLife();
          checkLampWarning();
          return;

        case "attack": {
          const atkTarget = resolution.targetPhrase?.toLowerCase() || "";
          const isAtDragon = DRAGON_LOCATIONS.includes(gameState.sceneId) && !gameState.flags.dragonDead;
          if (isAtDragon && (atkTarget === "" || atkTarget === "dragon" || atkTarget.includes("dragon"))) {
            setGameState((prev) => ({
              ...prev,
              pendingPrompt: { type: "hint_question", text: "With what? Your bare hands?" },
              flags: { ...prev.flags, _dragonPrompt: true },
            }));
            addMessage("narration", "With what? Your bare hands?");
            return;
          }
          const dwarvesHere = gameState.dwarfState.dwarves.filter(
            (d) => d.alive && d.loc === gameState.sceneId
          );
          if (dwarvesHere.length > 0) {
            addMessage("narration", "With what? Your bare hands?");
          } else if (gameState.sceneId === "barrenroom" && !gameState.flags.bearTame) {
            addMessage("narration", "With what? Your bare hands? Against HIS bear hands?");
          } else if (atkTarget === "snake" || atkTarget.includes("snake")) {
            addMessage("narration", "Attacking the snake both doesn't work and is very dangerous.");
          } else {
            addMessage("system", "There is nothing here to attack.");
          }
          decreaseLampLife();
          return;
        }

        case "throw": {
          if (resolution.correction) addMessage("system", resolution.correction);
          const throwTarget = resolution.targetPhrase?.toLowerCase() || "";
          const throwDwarvesHere = gameState.dwarfState.dwarves.filter(
            (d) => d.alive && d.loc === gameState.sceneId
          );
          if (resolution.itemId === "axe" && gameState.sceneId === "barrenroom" && !gameState.flags.bearTame) {
            setGameState((prev) => ({
              ...prev,
              objectLocations: { ...prev.objectLocations, axe: prev.sceneId },
              inventory: prev.inventory.filter((id) => id !== "axe"),
            }));
            addMessage("narration", "The axe misses and lands near the bear where you can't easily get to it.");
            decreaseLampLife();
            return;
          }
          if (resolution.itemId === "axe" && throwDwarvesHere.length > 0) {
            const r = Math.random();
            if (r < 0.33) {
              const targetIdx = gameState.dwarfState.dwarves.findIndex(
                (d) => d.alive && d.loc === gameState.sceneId
              );
              if (targetIdx >= 0) {
                setGameState((prev) => {
                  const newDwarves = prev.dwarfState.dwarves.map((d, i) =>
                    i === targetIdx ? { ...d, alive: false } : d
                  );
                  return {
                    ...prev,
                    dwarfState: { ...prev.dwarfState, dwarves: newDwarves },
                    objectLocations: { ...prev.objectLocations, axe: prev.sceneId },
                    inventory: prev.inventory.filter((id) => id !== "axe"),
                  };
                });
                addMessage("narration", "You killed a little dwarf! The body vanishes in a cloud of greasy black smoke.");
              }
            } else {
              setGameState((prev) => ({
                ...prev,
                objectLocations: { ...prev.objectLocations, axe: prev.sceneId },
                inventory: prev.inventory.filter((id) => id !== "axe"),
              }));
              addMessage("narration", "You throw the axe at the dwarf, but it misses and falls to the ground.");
            }
            decreaseLampLife();
            return;
          }
          const atTroll = (gameState.sceneId === "swchasm" || gameState.sceneId === "nechasm") && !gameState.flags.trollGone;
          if (atTroll && resolution.itemId && TREASURE_IDS.includes(resolution.itemId) && (throwTarget === "" || throwTarget === "troll" || throwTarget.includes("troll"))) {
            setGameState((prev) => ({
              ...prev,
              inventory: prev.inventory.filter((id) => id !== resolution.itemId),
              flags: { ...prev.flags, trollPaid: true },
              objectLocations: { ...prev.objectLocations, troll: "limbo" },
            }));
            addMessage("narration", "The troll catches your treasure and scurries away out of sight.");
            hapticFeedback("medium");
            decreaseLampLife();
            return;
          }
          if (resolution.itemId === "bear" && gameState.inventory.includes("bear") && (throwTarget === "troll" || throwTarget.includes("troll"))) {
            setGameState((prev) => ({
              ...prev,
              inventory: prev.inventory.filter((id) => id !== "bear"),
              flags: { ...prev.flags, trollGone: true },
              objectLocations: { ...prev.objectLocations, troll: "limbo", bear: "limbo" },
            }));
            addMessage("narration", "The bear lumbers toward the troll, who lets out a startled shriek and scurries away. The bear soon wanders off through the chasm.");
            hapticFeedback("success");
            decreaseLampLife();
            return;
          }
          if (resolution.itemId === "bear" && gameState.inventory.includes("bear") && (throwTarget === "ogre" || throwTarget.includes("ogre") || gameState.sceneId === "large") && !gameState.flags.ogreGone) {
            setGameState((prev) => ({
              ...prev,
              inventory: prev.inventory.filter((id) => id !== "bear"),
              objectLocations: { ...prev.objectLocations, bear: prev.sceneId, jade: prev.sceneId, ogre: "limbo" },
              flags: { ...prev.flags, ogreGone: true },
            }));
            addMessage("narration", "The bear lunges at the ogre, who flees in terror. A jade necklace falls from the ogre's neck as it disappears into the shadows.");
            hapticFeedback("success");
            decreaseLampLife();
            return;
          }
          if (resolution.itemId) {
            handleDropItem(resolution.itemId);
          } else {
            addMessage("system", "Throw what?");
          }
          checkLampWarning();
          return;
        }

        case "feed": {
          const feedItem = resolution.itemPhrase?.toLowerCase() || "";
          const feedTarget = resolution.targetPhrase?.toLowerCase() || "";
          if (gameState.sceneId === "barrenroom" && !gameState.flags.bearTame) {
            if (gameState.inventory.includes("food") && (feedItem === "food" || feedItem === "" || feedTarget === "bear" || feedTarget.includes("bear") || feedItem === "bear")) {
              setGameState((prev) => ({
                ...prev,
                inventory: prev.inventory.filter((id) => id !== "food"),
                flags: { ...prev.flags, bearTame: true },
                objectStates: { ...prev.objectStates, bear: 1 },
              }));
              addMessage("narration", "The bear eagerly wolfs down your food, after which he seems to calm down considerably and even becomes rather friendly.");
              hapticFeedback("success");
              decreaseLampLife();
              return;
            }
            addMessage("system", "You don't have anything the bear wants to eat.");
            decreaseLampLife();
            return;
          }
          if (feedItem === "bird" || feedTarget === "bird" || feedItem.includes("bird")) {
            addMessage("narration", "It's not hungry (it's merely pstrength and singing).");
            decreaseLampLife();
            return;
          }
          if (feedTarget === "snake" || feedTarget.includes("snake") || feedItem === "snake") {
            addMessage("narration", "The snake has now devoured your bird.");
            if (gameState.inventory.includes("bird")) {
              setGameState((prev) => ({
                ...prev,
                inventory: prev.inventory.filter((id) => id !== "bird"),
              }));
            }
            decreaseLampLife();
            return;
          }
          if (feedTarget === "dragon" || feedTarget.includes("dragon")) {
            addMessage("narration", "There's nothing here it wants to eat (except perhaps you).");
            decreaseLampLife();
            return;
          }
          if (feedTarget === "troll" || feedTarget.includes("troll")) {
            addMessage("narration", "Gluttony is not one of the troll's vices. Avarice, however, is.");
            decreaseLampLife();
            return;
          }
          addMessage("system", "There is nothing here that wants to be fed.");
          decreaseLampLife();
          return;
        }

        case "wave":
          if (resolution.correction) addMessage("system", resolution.correction);
          if (resolution.itemId === "rod" && (gameState.sceneId === "westbank" || gameState.sceneId === "eastbank")) {
            if (gameState.flags.closingReached) {
              addMessage("narration", "The cave is closing. The bridge is gone for good.");
              decreaseLampLife();
              return;
            }
            if (!gameState.flags.crystalBridge) {
              addMessage("narration", "A crystal bridge now spans the fissure.");
              setGameState((prev) => ({
                ...prev,
                flags: { ...prev.flags, crystalBridge: true },
                objectStates: { ...prev.objectStates, fissure: 1 },
              }));
            } else {
              addMessage("narration", "The crystal bridge has vanished!");
              setGameState((prev) => ({
                ...prev,
                flags: { ...prev.flags, crystalBridge: false },
                objectStates: { ...prev.objectStates, fissure: 0 },
              }));
            }
          } else if (resolution.itemId === "rod" && gameState.flags.closed && (gameState.sceneId === "ne" || gameState.sceneId === "sw")) {
            if (!gameState.flags.endgameMirrorBroken) {
              addMessage("narration", "You strike the mirror a resounding blow, whereupon it shatters into a myriad tiny fragments.");
              setGameState((prev) => ({
                ...prev,
                flags: { ...prev.flags, endgameMirrorBroken: true },
              }));
              hapticFeedback("warning");
            } else {
              addMessage("system", "Haven't you already done enough damage?");
            }
          } else {
            addMessage("system", "Nothing happens.");
          }
          decreaseLampLife();
          return;

        case "blast": {
          if (!gameState.flags.closed) {
            addMessage("system", "Blasting requires dynamite.");
            decreaseLampLife();
            return;
          }
          if (!gameState.inventory.includes("rod2") && gameState.objectLocations["rod2"] !== gameState.sceneId) {
            addMessage("system", "Blasting requires dynamite.");
            decreaseLampLife();
            return;
          }
          if (gameState.flags.endgameMirrorBroken) {
            addMessage("narration", "There is a loud explosion, and a twenty-foot hole appears in the far wall, burying the snakes in the rubble. A river of molten lava pours in through the hole, destroying everything in its path, including you!");
            addMessage("narration", "");
            addMessage("narration", "It appears that the last combatant has perished.");
            const { score, maxScore } = calculateScore({
              ...gameState,
              flags: { ...gameState.flags, endgameVictory: true },
            });
            addMessage("system", `You scored ${score} out of a possible ${maxScore}, using ${gameState.stats.turns} turns.`);
            addMessage("system", getScoreClass(score));
            setGameState((prev) => ({
              ...prev,
              flags: { ...prev.flags, endgameVictory: true },
            }));
            setGameOver("escaped");
            hapticFeedback("success");
          } else {
            addMessage("narration", "There is a loud explosion, and a twenty-foot hole appears in the far wall, burying the dwarves in the rubble. You march through the hole and find yourself in the main office, where a cheering band of friendly elves carry the conquering adventurer off into the sunset.");
            const bonusPoints = gameState.sceneId === "ne" ? 25 : 30;
            const { score, maxScore } = calculateScore({
              ...gameState,
              flags: {
                ...gameState.flags,
                endgameVictory: false,
                endgameDefeat: true,
              },
              stats: {
                ...gameState.stats,
                endgameBonus: bonusPoints,
              },
            });
            const finalScore = score + bonusPoints;
            addMessage("system", `You scored ${finalScore} out of a possible ${maxScore}, using ${gameState.stats.turns} turns.`);
            addMessage("system", getScoreClass(finalScore));
            setGameOver("escaped");
            hapticFeedback("warning");
          }
          return;
        }

        case "open": {
          const openTarget = resolution.targetPhrase?.toLowerCase() || "";
          if ((openTarget === "clam" || openTarget.includes("clam") || openTarget === "") && 
              (gameState.objectLocations["clam"] === gameState.sceneId || gameState.inventory.includes("clam")) &&
              !gameState.flags.clamOpened) {
            if (!gameState.inventory.includes("trident") && gameState.objectLocations["trident"] !== gameState.sceneId) {
              addMessage("narration", "You don't have anything strong enough to open the clam.");
              decreaseLampLife();
              return;
            }
            setGameState((prev) => {
              const newObjLocs = { ...prev.objectLocations };
              delete newObjLocs["clam"];
              newObjLocs["oyster"] = prev.sceneId;
              newObjLocs["pearl"] = "cul_de_sac";
              return {
                ...prev,
                inventory: prev.inventory.filter((id) => id !== "clam"),
                objectLocations: newObjLocs,
                flags: { ...prev.flags, clamOpened: true },
              };
            });
            addMessage("narration", "A glistening pearl falls out of the clam and rolls away. Interesting. It probably is beyond the Plover Room, in the Cul-de-Sac.");
            hapticFeedback("success");
            decreaseLampLife();
            return;
          }
          if ((openTarget === "oyster" || openTarget.includes("oyster")) &&
              (gameState.objectLocations["oyster"] === gameState.sceneId || gameState.inventory.includes("oyster"))) {
            addMessage("narration", "The oyster creaks open, revealing nothing inside. It snaps shut again.");
            decreaseLampLife();
            return;
          }
          if (openTarget === "grate" || openTarget.includes("grate")) {
            if (gameState.flags.closingReached || gameState.flags.closed) {
              addMessage("narration", "The cave is now closed. The grate is locked for good.");
              decreaseLampLife();
              return;
            }
            if (gameState.inventory.includes("keys")) {
              setGameState((prev) => ({
                ...prev,
                flags: { ...prev.flags, grateOpen: true },
              }));
              addMessage("narration", "The grate is now unlocked and open.");
              hapticFeedback("medium");
            } else {
              addMessage("narration", "You don't have a key that fits.");
            }
            decreaseLampLife();
            return;
          }
          if (openTarget === "cage" || openTarget.includes("cage")) {
            if (gameState.inventory.includes("bird")) {
              setGameState((prev) => ({
                ...prev,
                inventory: prev.inventory.filter((id) => id !== "bird"),
                objectLocations: { ...prev.objectLocations, bird: prev.sceneId },
                objectStates: { ...prev.objectStates, bird: 0 },
              }));
              addMessage("system", "The little bird flies free.");
            } else {
              addMessage("system", "The cage is empty.");
            }
            decreaseLampLife();
            return;
          }
          addMessage("system", "I don't know how to open that.");
          decreaseLampLife();
          return;
        }

        case "unlock": {
          const unlockTarget = resolution.targetPhrase?.toLowerCase() || "";
          if ((unlockTarget === "chain" || unlockTarget.includes("chain") || unlockTarget === "") && gameState.sceneId === "barrenroom") {
            if (!gameState.inventory.includes("keys")) {
              addMessage("system", "You don't have the key.");
              decreaseLampLife();
              return;
            }
            if (!gameState.flags.bearTame) {
              addMessage("narration", "There is no way to get past the bear to unlock the chain, which is probably just as well.");
              decreaseLampLife();
              return;
            }
            setGameState((prev) => ({
              ...prev,
              inventory: [...prev.inventory, "chain", "bear"],
              flags: { ...prev.flags, chainUnlocked: true },
              objectStates: { ...prev.objectStates, bear: 2 },
            }));
            addMessage("narration", "You unlock the chain and set the tame bear free. The bear is now following you around.");
            hapticFeedback("success");
            decreaseLampLife();
            return;
          }
          if (unlockTarget === "grate" || unlockTarget.includes("grate")) {
            if (gameState.flags.closingReached || gameState.flags.closed) {
              addMessage("narration", "The cave is now closed. The grate is locked for good.");
              decreaseLampLife();
              return;
            }
            if (gameState.inventory.includes("keys")) {
              setGameState((prev) => ({
                ...prev,
                flags: { ...prev.flags, grateOpen: true },
              }));
              addMessage("narration", "The grate is now unlocked and open.");
              hapticFeedback("medium");
            } else {
              addMessage("narration", "You don't have a key that fits.");
            }
            decreaseLampLife();
            return;
          }
          addMessage("system", "I don't know how to unlock that.");
          decreaseLampLife();
          return;
        }

        case "drink": {
          const drinkTarget = resolution.targetPhrase?.toLowerCase() || "";
          if (drinkTarget === "blood" || drinkTarget.includes("blood") || drinkTarget.includes("dragon")) {
            if (gameState.flags.dragonDead && DRAGON_LOCATIONS.includes(gameState.sceneId)) {
              setGameState((prev) => ({
                ...prev,
                flags: { ...prev.flags, blooded: true },
              }));
              addMessage("narration", "The blood tastes terrible, but you force it down. You feel a strange tingling sensation.");
              hapticFeedback("medium");
              decreaseLampLife();
              return;
            }
            addMessage("system", "There is no blood here to drink.");
            decreaseLampLife();
            return;
          }
          if (drinkTarget === "oil" || drinkTarget.includes("oil")) {
            addMessage("system", "The oil tastes vile. You spit it out.");
            decreaseLampLife();
            return;
          }
          if (drinkTarget === "water" || drinkTarget === "" || drinkTarget.includes("water")) {
            if (hasBottle() && getBottleLiquid() === "water") {
              setGameState((prev) => ({
                ...prev,
                objectStates: { ...prev.objectStates, bottle: BOTTLE_EMPTY },
              }));
              addMessage("system", "You drink the water. The bottle is now empty.");
              decreaseLampLife();
              return;
            }
            const liquidHere = getLiquidAtLocation(gameState.sceneId);
            if (liquidHere === "water") {
              addMessage("system", "You have taken a drink from the stream. The water is cool and refreshing.");
              decreaseLampLife();
              return;
            }
            addMessage("system", "You don't have any water.");
            decreaseLampLife();
            return;
          }
          addMessage("system", "There is nothing here to drink.");
          decreaseLampLife();
          return;
        }

        case "read": {
          const readTarget = resolution.targetPhrase?.toLowerCase() || "";
          if (readTarget === "oyster" || readTarget.includes("oyster")) {
            if (gameState.inventory.includes("oyster") || gameState.objectLocations["oyster"] === gameState.sceneId) {
              addMessage("narration", "Hmmm, this seems to be a clue: \"There is something strange about this place, such that one of the words I've always known now has a new meaning.\"");
              decreaseLampLife();
              return;
            }
          }
          if (readTarget === "magazine" || readTarget.includes("magazine")) {
            addMessage("narration", "I'm afraid the magazine is written in Dwarvish.");
            decreaseLampLife();
            return;
          }
          addMessage("system", "There is nothing here to read.");
          decreaseLampLife();
          return;
        }

        case "say": {
          const phrase = resolution.phrase?.toLowerCase() || "";

          if (phrase === "plover") {
            if (gameState.sceneId === "y2" || gameState.sceneId === "plover") {
              const destination = gameState.sceneId === "y2" ? "plover" : "y2";
              if (gameState.inventory.includes("emerald")) {
                setGameState((prev) => ({
                  ...prev,
                  inventory: prev.inventory.filter((id) => id !== "emerald"),
                  objectLocations: { ...prev.objectLocations, emerald: prev.sceneId },
                }));
                addMessage("narration", "The emerald tumbles to the ground as you are transported.");
              }
              handleMove(destination);
            } else {
              addMessage("narration", "Nothing happens.");
            }
            decreaseLampLife();
            return;
          }

          if (phrase === "xyzzy" || phrase === "plugh") {
            const magicAction = availableActions.find(
              (a) => a.type === "move" && a.id === `go_${phrase}`
            );
            if (magicAction) {
              const resolved = resolveActionDestination(magicAction);
              if (resolved && resolved.type === "goto") {
                handleMove(resolved.to);
              } else if (resolved && resolved.type === "speak") {
                addMessage("narration", resolved.message);
              } else {
                addMessage("narration", "Nothing happens.");
              }
            } else {
              addMessage("narration", "Nothing happens.");
            }
            decreaseLampLife();
            return;
          }

          const foobarSequence = ["fee", "fie", "foe", "foo"];
          if (foobarSequence.includes(phrase) || phrase === "fum") {
            const currentStep = gameState.objectStates["foobar"] || 0;
            if (phrase === "fum") {
              setGameState((prev) => ({
                ...prev,
                objectStates: { ...prev.objectStates, foobar: 0 },
              }));
              addMessage("narration", "I don't know how to do that.");
              decreaseLampLife();
              return;
            }
            const expectedWord = foobarSequence[currentStep];
            if (phrase === expectedWord) {
              if (currentStep < 3) {
                setGameState((prev) => ({
                  ...prev,
                  objectStates: { ...prev.objectStates, foobar: currentStep + 1 },
                }));
                addMessage("narration", "OK.");
                decreaseLampLife();
                return;
              } else {
                const eggsLoc = gameState.objectLocations["eggs"];
                const eggsInInventory = gameState.inventory.includes("eggs");
                if (eggsLoc === "giantroom" && !eggsInInventory) {
                  setGameState((prev) => ({
                    ...prev,
                    objectStates: { ...prev.objectStates, foobar: 0 },
                  }));
                  addMessage("narration", "Nothing happens.");
                  decreaseLampLife();
                  return;
                }
                setGameState((prev) => {
                  const newInventory = prev.inventory.filter((id) => id !== "eggs");
                  return {
                    ...prev,
                    inventory: newInventory,
                    objectLocations: { ...prev.objectLocations, eggs: "giantroom" },
                    objectStates: { ...prev.objectStates, foobar: 0 },
                  };
                });
                if (gameState.sceneId === "giantroom") {
                  addMessage("narration", "Done! The golden eggs appear at your feet.");
                } else {
                  addMessage("narration", "Done! Somewhere nearby, you hear the rumble of something appearing.");
                }
                decreaseLampLife();
                return;
              }
            } else {
              setGameState((prev) => ({
                ...prev,
                objectStates: { ...prev.objectStates, foobar: 0 },
              }));
              addMessage("narration", "I don't know how to do that.");
              decreaseLampLife();
              return;
            }
          }

          const oldMagicWords = ["sesame", "abracadabra", "shazam", "opencesame", "opensesame", "hocuspocus"];
          if (oldMagicWords.includes(phrase)) {
            addMessage("narration", "Good try, but that is an old worn-out magic word.");
            decreaseLampLife();
            return;
          }

          addMessage("narration", `Okay, "${phrase}".`);
          decreaseLampLife();
          return;
        }

        case "yes": {
          if (gameState.flags._dragonPrompt && gameState.pendingPrompt) {
            setGameState((prev) => ({
              ...prev,
              flags: { ...prev.flags, dragonDead: true, _dragonPrompt: false },
              objectStates: { ...prev.objectStates, dragon: 1 },
              pendingPrompt: null,
            }));
            addMessage("narration", "Congratulations! You have just vanquished a dragon with your bare hands! (Strstrength, strstrength.)");
            addMessage("narration", "The dragon's blood pools on the ground. The rug is now free to take.");
            hapticFeedback("success");
            decreaseLampLife();
            return;
          }
          if (gameState.pendingPrompt) {
            addMessage("system", "OK.");
            setGameState((prev) => ({ ...prev, pendingPrompt: null }));
            return;
          }
          addMessage("system", "OK.");
          return;
        }

        case "fill": {
          const fillTarget = resolution.targetPhrase?.toLowerCase() || "";
          if (fillTarget === "urn" || fillTarget.includes("urn")) {
            if (gameState.sceneId !== URN_LOCATION) {
              addMessage("system", "There is no urn here.");
              decreaseLampLife();
              return;
            }
            addMessage("system", "You can't fill the urn by hand. Try pouring something into it.");
            decreaseLampLife();
            return;
          }
          if (fillTarget === "bottle" || fillTarget.includes("bottle") || fillTarget === "") {
            if (!hasBottle()) {
              addMessage("system", "You don't have the bottle.");
              decreaseLampLife();
              return;
            }
            if (getBottleState() !== BOTTLE_EMPTY) {
              addMessage("system", "Your bottle is already full.");
              decreaseLampLife();
              return;
            }
            const liquidHere = getLiquidAtLocation(gameState.sceneId);
            if (!liquidHere) {
              addMessage("system", "There is nothing here with which to fill the bottle.");
              decreaseLampLife();
              return;
            }
            if (liquidHere === "oil") {
              setGameState((prev) => ({
                ...prev,
                objectStates: { ...prev.objectStates, bottle: BOTTLE_OIL },
              }));
              addMessage("system", "Your bottle is now full of oil.");
            } else {
              setGameState((prev) => ({
                ...prev,
                objectStates: { ...prev.objectStates, bottle: BOTTLE_WATER },
              }));
              addMessage("system", "Your bottle is now full of water.");
            }
            decreaseLampLife();
            return;
          }
          addMessage("system", "You can't fill that.");
          decreaseLampLife();
          return;
        }

        case "pour": {
          const pourTarget = resolution.targetPhrase?.toLowerCase() || "";
          if (!hasBottle()) {
            addMessage("system", "You don't have anything to pour.");
            decreaseLampLife();
            return;
          }
          const bottleLiquid = getBottleLiquid();
          if (!bottleLiquid) {
            addMessage("system", "Your bottle is empty.");
            decreaseLampLife();
            return;
          }

          if (pourTarget.includes("urn") || (gameState.sceneId === URN_LOCATION && pourTarget === "")) {
            if (gameState.sceneId !== URN_LOCATION) {
              addMessage("system", "There is no urn here.");
              decreaseLampLife();
              return;
            }
            const urnState = gameState.objectStates["urn"] ?? URN_EMPTY;
            if (urnState !== URN_EMPTY) {
              addMessage("system", "The urn is already full.");
              setGameState((prev) => ({
                ...prev,
                objectStates: { ...prev.objectStates, bottle: BOTTLE_EMPTY },
              }));
              decreaseLampLife();
              return;
            }
            if (bottleLiquid === "water") {
              addMessage("narration", "You pour water into the urn. The water evaporates instantly.");
              setGameState((prev) => ({
                ...prev,
                objectStates: { ...prev.objectStates, bottle: BOTTLE_EMPTY },
              }));
            } else {
              addMessage("narration", "You pour oil into the urn.");
              setGameState((prev) => ({
                ...prev,
                objectStates: { ...prev.objectStates, bottle: BOTTLE_EMPTY, urn: URN_DARK },
              }));
            }
            decreaseLampLife();
            return;
          }

          if (gameState.sceneId === "westpit" && (pourTarget === "" || pourTarget === "water" || pourTarget === "plant" || pourTarget.includes("plant") || pourTarget.includes("water"))) {
            if (bottleLiquid === "oil") {
              addMessage("system", "The plant indifferently shakes the oil off its leaves and asks, \"Water?\"");
              setGameState((prev) => ({
                ...prev,
                objectStates: { ...prev.objectStates, bottle: BOTTLE_EMPTY },
              }));
              decreaseLampLife();
              return;
            }
            const currentPlantState = gameState.objectStates["plant"] || 0;
            if (currentPlantState === 0) {
              setGameState((prev) => ({
                ...prev,
                objectStates: { ...prev.objectStates, plant: 1, bottle: BOTTLE_EMPTY },
              }));
              addMessage("narration", "The plant spurts into furious growth for a few seconds.\n\nThere is a 12-foot-tall beanstalk stretching up out of the pit, bellowing \"Water!! Water!!\"");
              hapticFeedback("success");
            } else if (currentPlantState === 1) {
              setGameState((prev) => ({
                ...prev,
                objectStates: { ...prev.objectStates, plant: 2, bottle: BOTTLE_EMPTY },
              }));
              addMessage("narration", "The plant grows explosively, almost filling the bottom of the pit.\n\nThere is a gigantic beanstalk stretching all the way up to the hole.");
              hapticFeedback("success");
            } else {
              setGameState((prev) => ({
                ...prev,
                objectStates: { ...prev.objectStates, plant: 0, bottle: BOTTLE_EMPTY },
              }));
              addMessage("narration", "The plant shrivels up and disappears.\n\nThe tiny plant is gone. The pit is empty.");
              hapticFeedback("medium");
            }
            decreaseLampLife();
            return;
          }

          if (pourTarget.includes("door") && gameState.sceneId === "immense") {
            if (bottleLiquid === "oil") {
              addMessage("narration", "The oil has freed up the hinges so that the door will now move, although it requires some effort.");
              setGameState((prev) => ({
                ...prev,
                objectStates: { ...prev.objectStates, bottle: BOTTLE_EMPTY, door: 1 },
                flags: { ...prev.flags, doorOiled: true },
              }));
            } else {
              addMessage("narration", "The hinges are quite thoroughly rusted now and won't budge.");
              setGameState((prev) => ({
                ...prev,
                objectStates: { ...prev.objectStates, bottle: BOTTLE_EMPTY },
              }));
            }
            decreaseLampLife();
            return;
          }

          addMessage("system", `You pour out the ${bottleLiquid}.`);
          setGameState((prev) => ({
            ...prev,
            objectStates: { ...prev.objectStates, bottle: BOTTLE_EMPTY },
          }));
          decreaseLampLife();
          return;
        }

        case "eat": {
          const eatTarget = resolution.targetPhrase?.toLowerCase() || "";
          if (eatTarget === "food" || eatTarget === "" || eatTarget.includes("food")) {
            if (gameState.inventory.includes("food")) {
              addMessage("narration", "Thank you, it was delicious!");
              setGameState((prev) => ({
                ...prev,
                inventory: prev.inventory.filter((id) => id !== "food"),
              }));
            } else {
              addMessage("system", "You have nothing to eat.");
            }
          } else if (eatTarget === "bird" || eatTarget.includes("bird")) {
            addMessage("narration", "I think I just lost my appetite.");
          } else if (eatTarget === "snake" || eatTarget.includes("snake")) {
            addMessage("narration", "I think I just lost my appetite.");
          } else {
            addMessage("system", "That's not something you can eat.");
          }
          decreaseLampLife();
          return;
        }

        case "rub": {
          const rubTarget = resolution.targetPhrase?.toLowerCase() || "";
          if (rubTarget === "lamp" || rubTarget === "lantern" || rubTarget === "" || rubTarget.includes("lamp")) {
            addMessage("narration", "Rubbing the electric lamp is not particularly rewarding. Anyway, nothing exciting happens.");
          } else {
            addMessage("system", "Peculiar. Nothing unexpected happens.");
          }
          decreaseLampLife();
          return;
        }

        case "close": {
          const closeTarget = resolution.targetPhrase?.toLowerCase() || "";
          if (closeTarget === "grate" || closeTarget.includes("grate") || closeTarget === "") {
            if (gameState.sceneId === "belowgrate" || gameState.sceneId === "outsidegrate" || gameState.sceneId === "insidegrate") {
              if (gameState.inventory.includes("keys")) {
                if (gameState.flags.grateOpen) {
                  addMessage("narration", "The grate is now locked.");
                  setGameState((prev) => ({
                    ...prev,
                    flags: { ...prev.flags, grateOpen: false },
                  }));
                } else {
                  addMessage("system", "It is already locked.");
                }
              } else {
                addMessage("system", "You have no keys!");
              }
            } else {
              addMessage("system", "I don't see a grate here.");
            }
          } else {
            addMessage("system", "I don't know how to close that.");
          }
          decreaseLampLife();
          return;
        }

        case "quit": {
          const { score, maxScore } = calculateScore(gameState);
          const finalScore = score - 4;
          addMessage("system", `You scored ${finalScore} out of a possible ${maxScore}, using ${gameState.stats.turns} turns.`);
          addMessage("system", getScoreClass(finalScore));
          setGameOver("died");
          hapticFeedback("warning");
          return;
        }

        case "move":
          if (resolution.correction) addMessage("system", resolution.correction);
          handleMove(resolution.toSceneId);
          checkLampWarning();
          return;

        case "message":
          addMessage("system", resolution.text);
          checkLampWarning();
          return;

        case "fallback":
          break;
      }

      // === FALLBACK: old single-token and default travel logic ===
      const command = rawInput.toLowerCase().replace(/[.,!?;:'"]/g, "").trim();
      const words = command.split(/\s+/).filter(Boolean);

      if (words.length === 1) {
        const token = words[0];
        const moveAction = availableActions.find(
          (a) => a.type === "move" && (
            a.id === `go_${token}` ||
            a.label.toLowerCase() === token ||
            a.label.toLowerCase() === `go ${token}`
          )
        );
        if (moveAction) {
          const resolved = resolveActionDestination(moveAction);
          if (resolved) {
            if (resolved.type === "goto") {
              handleMove(resolved.to);
            } else {
              addMessage("narration", resolved.message);
              decreaseLampLife();
            }
            trackCommand(rawInput, true);
            checkLampWarning();
            return;
          }
        }

        const eventAction = availableActions.find(
          (a) => a.type === "event" && (a as any).message && (
            a.label.toLowerCase() === token ||
            a.id.includes(token)
          )
        );
        if (eventAction) {
          trackCommand(rawInput, true);
          handleAction(eventAction);
          return;
        }
      }

      const defaultMove = availableActions.find(
        (a) => a.type === "move" && a.id === "go_default"
      );
      if (defaultMove) {
        const resolved = resolveActionDestination(defaultMove);
        if (resolved) {
          if (resolved.type === "goto") {
            handleMove(resolved.to);
          } else {
            addMessage("narration", resolved.message);
            decreaseLampLife();
          }
          trackCommand(rawInput, true);
          checkLampWarning();
          return;
        }
      }

      trackCommand(rawInput, false);
      addMessage(
        "system",
        `I don't understand "${rawInput}". Try commands like "look", "take lamp", "go east", "go back", or type "help".`
      );
      checkLampWarning();
    },
    [
      gameState,
      getCurrentScene,
      getAvailableActions,
      handleTakeItem,
      handleDropItem,
      handleUseItem,
      handleAction,
      handleMove,
      addMessage,
      decreaseLampLife,
      checkLampWarning,
      handleNewGame,
      handleDirection,
      handleGoBack,
      isLocationDark,
      hapticFeedback,
      getSceneDescription,
      addExitHint,
      resolveActionDestination,
    ]
  );

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initGame = async () => {
      const saveData = await loadGame();
      if (saveData) {
        const migratedState: GameState = {
          ...initialGameState,
          ...saveData.gameState,
          stats: {
            ...initialGameState.stats,
            ...saveData.gameState.stats,
          },
          lamp: saveData.gameState.lamp || {
            ...initialGameState.lamp,
            lit: saveData.gameState.inventory?.includes("lamp") || false,
          },
          batteryState: saveData.gameState.batteryState || initialGameState.batteryState,
          milestonesCompleted: saveData.gameState.milestonesCompleted || [],
          hintState: saveData.gameState.hintState || initialGameState.hintState,
          deathState: saveData.gameState.deathState || initialGameState.deathState,
          thresholdsTriggered: saveData.gameState.thresholdsTriggered || [],
          pendingPrompt: saveData.gameState.pendingPrompt || null,
          objectLocations: saveData.gameState.objectLocations || initialGameState.objectLocations,
          objectStates: saveData.gameState.objectStates || {},
          visitCounts: saveData.gameState.visitCounts || { [saveData.gameState.sceneId]: 1 },
          briefMode: saveData.gameState.briefMode ?? false,
          dwarfState: saveData.gameState.dwarfState || initialGameState.dwarfState,
          rngSeed: saveData.gameState.rngSeed ?? initialGameState.rngSeed,
        };
        setGameState(migratedState);
        const filteredMessages = saveData.messages.filter(
          (m: Message) => m.text !== "Continuing your journey..."
        );
        setMessages(filteredMessages);
        addMessage("system", "Continuing your journey...");
      } else {
        const newMessages: Message[] = INTRO_MESSAGES.map((msg) => ({
          id: generateMessageId(),
          type: "narration" as const,
          text: msg,
          timestamp: Date.now(),
        }));

        const startScene = SCENES[initialGameState.sceneId];
        const sceneMessage: Message = {
          id: generateMessageId(),
          type: "narration",
          text: startScene?.description.long || "You are in a mysterious place.",
          timestamp: Date.now(),
        };

        const initMessages: Message[] = [...newMessages, sceneMessage];
        if (startScene && !isLocationDark(initialGameState.sceneId)) {
          const hint = formatExitHint(startScene.actions);
          if (hint) {
            initMessages.push({
              id: generateMessageId(),
              type: "nav-hint",
              text: hint,
              timestamp: Date.now(),
            });
          }
        }
        setMessages(initMessages);
      }
      initAnalytics();
      const initSceneId = saveData ? saveData.gameState.sceneId : initialGameState.sceneId;
      trackScene(initSceneId, SCENES[initSceneId]?.title);
      setIsLoading(false);
    };

    initGame();
  }, [addMessage]);

  useEffect(() => {
    if (isLoading || gameOver) return;
    checkTurnThresholds();
    checkHints();
  }, [gameState.stats.turns]);

  return {
    gameState,
    messages,
    isLoading,
    gameOver,
    milestonesCompletedCount,
    isCurrentlyDark,
    getCurrentScene,
    getAvailableActions,
    getShortcutActions,
    handleAction,
    parseCommand,
    handleNewGame,
    handlePromptResponse,
  };
}
