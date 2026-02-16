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
  OBITUARIES,
  TURN_THRESHOLDS,
  LAMP_MESSAGES,
  Action,
} from "@/data/story";
import { parseInput } from "@/nlp/commandParser";
import { resolve } from "@/nlp/actionResolver";
import { WARN_TIME, BATTERY_LIFE_BONUS } from "@/data/canonConstants";
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
  calculateScore,
  getScoreClass,
} from "@/data/canonObjects";

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
      };
      setMessages((prev) => [...prev, message]);
      return message;
    },
    []
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

      if (itemDescs.length > 0) {
        return baseDesc + "\n\n" + itemDescs.join("\n");
      }

      return baseDesc;
    },
    [gameState.inventory, gameState.lamp.lit, gameState.visitCounts, gameState.briefMode, gameState.objectLocations, isLocationDark, getObjectsAtLocation]
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
    const gs = gameState;
    switch (hintNumber) {
      case 1: return !gs.flags.grateOpen;
      case 2: return gs.sceneId === "birdchamber" && gs.inventory.includes("rod") && !gs.inventory.includes("bird");
      case 3: return gs.sceneId === "snakeblock" && !gs.inventory.includes("bird");
      case 4: {
        const mazeScenes = ["maze1", "maze2", "maze3", "maze4", "maze5", "maze6", "maze7",
          "maze8", "maze9", "maze10", "maze11", "maze12", "maze13", "maze14"];
        return mazeScenes.includes(gs.sceneId) && !gs.inventory.includes("coins");
      }
      case 5: return gs.sceneId === "westside" && !gs.flags.crystalBridge;
      case 6: return gs.sceneId === "deadend13";
      case 7: return true;
      case 8: return !gs.inventory.includes("emerald");
      case 9: return gs.sceneId === "alcove" && gs.inventory.includes("emerald");
      case 10: {
        const treasureItems = ["nugget", "coins", "eggs", "trident", "emerald", "pyramid",
          "ruby", "sapph", "pearl", "chest", "rug", "spices", "chain"];
        const treasureCount = treasureItems.filter(t => gs.inventory.includes(t)).length;
        return treasureCount >= 12;
      }
      default: return true;
    }
  }, [gameState]);

  const checkHints = useCallback(() => {
    const scene = SCENES[gameState.sceneId];
    if (!scene || !scene.hints || scene.hints.length === 0) return;

    for (const hintNum of scene.hints) {
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
  }, [gameState, isHintEligible]);

  const triggerDeath = useCallback((deathMessage?: string) => {
    if (deathMessage) {
      addMessage("narration", deathMessage);
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

    setGameState(prev => ({
      ...prev,
      pendingPrompt: {
        type: "obituary",
        text: obituary.query,
        obituaryIndex,
      },
    }));
    hapticFeedback("error");
  }, [gameState.deathState, addMessage, hapticFeedback]);

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

        setGameState(prev => ({
          ...prev,
          pendingPrompt: null,
          sceneId: "building",
          previousSceneId: null,
          inventory: [],
          lamp: {
            ...prev.lamp,
            lit: false,
          },
          deathState: {
            ...prev.deathState,
            numdie: prev.deathState.numdie + 1,
          },
        }));

        setTimeout(() => {
          addMessage("narration", getSceneDescription("building"));
        }, 500);
      } else {
        addMessage("narration", "Very well. Game over.");
        setGameState(prev => ({
          ...prev,
          pendingPrompt: null,
        }));
        setGameOver("died");
      }
    }
  }, [gameState.pendingPrompt, addMessage, getSceneDescription]);

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

  const handleMove = useCallback(
    (toSceneId: string) => {
      const newScene = SCENES[toSceneId];
      if (!newScene) {
        addMessage("system", "You can't go that way.");
        return;
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

      decreaseLampLife();
      addMessage("narration", getSceneDescription(toSceneId));
      hapticFeedback("light");
    },
    [addMessage, decreaseLampLife, hapticFeedback, getSceneDescription, isCurrentlyDark, gameOver, triggerDeath]
  );

  const handleGoBack = useCallback(() => {
    if (!gameState.previousSceneId) {
      addMessage("system", "You can't go back any further.");
      return;
    }

    const previousScene = SCENES[gameState.previousSceneId];
    if (!previousScene) {
      addMessage("system", "You can't go back that way.");
      return;
    }

    addMessage("action", "> GO BACK");
    
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
    hapticFeedback("light");
    checkLampWarning();
  }, [gameState.previousSceneId, addMessage, decreaseLampLife, getSceneDescription, hapticFeedback, checkLampWarning, isCurrentlyDark, gameOver, triggerDeath]);

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
    [gameState.inventory, addMessage, decreaseLampLife, hapticFeedback]
  );

  const handleAction = useCallback(
    (action: Action) => {
      addMessage("action", `> ${action.label}`);

      switch (action.type) {
        case "command":
          if (action.command === "look") {
            addMessage("narration", getSceneDescription(gameState.sceneId));
          }
          decreaseLampLife();
          break;

        case "move":
          if (action.to) {
            handleMove(action.to);
          }
          break;

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
    [getCurrentScene, handleMove, handleTakeItem, addMessage, decreaseLampLife, hapticFeedback]
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

      if (moveAction && moveAction.to) {
        handleMove(moveAction.to);
      } else {
        addMessage("system", "You can't go that way.");
      }
    },
    [getAvailableActions, handleMove, addMessage]
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

    setMessages([...newMessages, sceneMessage]);
    hapticFeedback("medium");
  }, [hapticFeedback]);

  const parseCommand = useCallback(
    (input: string) => {
      const rawInput = input.trim();

      addMessage("action", `> ${rawInput}`);

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

      switch (resolution.type) {
        case "look":
          addMessage("narration", getSceneDescription(gameState.sceneId));
          decreaseLampLife();
          checkLampWarning();
          return;

        case "inventory":
          if (gameState.inventory.length === 0) {
            addMessage("system", "Your pockets are empty.");
          } else {
            const items = gameState.inventory
              .map((id) => ITEMS[id]?.name || id)
              .join(", ");
            addMessage("system", `You are carrying: ${items}`);
          }
          return;

        case "help":
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

        case "useItem":
          if (resolution.correction) addMessage("system", resolution.correction);
          handleUseItem(resolution.itemId);
          checkLampWarning();
          return;

        case "takeItem":
          if (resolution.correction) addMessage("system", resolution.correction);
          handleTakeItem(resolution.itemId, resolution.actionId);
          checkLampWarning();
          return;

        case "dropItem":
          if (resolution.correction) addMessage("system", resolution.correction);
          handleDropItem(resolution.itemId);
          checkLampWarning();
          return;

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

        case "attack":
          addMessage("system", "There is nothing here to attack.");
          decreaseLampLife();
          return;

        case "throw":
          if (resolution.correction) addMessage("system", resolution.correction);
          handleDropItem(resolution.itemId);
          checkLampWarning();
          return;

        case "feed":
          addMessage("system", "There is nothing here that wants to be fed.");
          decreaseLampLife();
          return;

        case "wave":
          if (resolution.correction) addMessage("system", resolution.correction);
          if (resolution.itemId === "rod" && gameState.sceneId === "fissure_w") {
            if (!gameState.flags.crystalBridge) {
              addMessage("narration", "A crystal bridge now spans the fissure.");
              setGameState((prev) => ({
                ...prev,
                flags: { ...prev.flags, crystalBridge: true },
              }));
            } else {
              addMessage("narration", "The crystal bridge has vanished!");
              setGameState((prev) => ({
                ...prev,
                flags: { ...prev.flags, crystalBridge: false },
              }));
            }
          } else {
            addMessage("system", "Nothing happens.");
          }
          decreaseLampLife();
          return;

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
        if (moveAction && moveAction.to) {
          handleMove(moveAction.to);
          checkLampWarning();
          return;
        }

        const eventAction = availableActions.find(
          (a) => a.type === "event" && (a as any).message && (
            a.label.toLowerCase() === token ||
            a.id.includes(token)
          )
        );
        if (eventAction) {
          handleAction(eventAction);
          return;
        }
      }

      const defaultMove = availableActions.find(
        (a) => a.type === "move" && a.id === "go_default"
      );
      if (defaultMove && defaultMove.to) {
        handleMove(defaultMove.to);
        checkLampWarning();
        return;
      }

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
        };
        setGameState(migratedState);
        setMessages(saveData.messages);
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

        setMessages([...newMessages, sceneMessage]);
      }
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
