import { useState, useCallback, useRef, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import {
  GameState,
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
  Action,
} from "@/data/story";
import { normalizeCommand } from "@/data/lexicon";
import { WARN_TIME } from "@/data/canonConstants";

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gameOver, setGameOver] = useState<"escaped" | "died" | null>(null);
  const initialized = useRef(false);

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

  const getSceneDescription = useCallback(
    (sceneId: string) => {
      const scene = SCENES[sceneId];
      if (!scene) return "";

      // If the scene has no item descriptions, return the static description
      if (!scene.itemDescriptions || !scene.items) {
        return scene.description;
      }

      // Check which items are still in this scene (not yet taken)
      const takenItems = gameState.inventory;
      const remainingItems = scene.items.filter(
        (itemId) => !takenItems.includes(itemId)
      );

      // Always use descriptionWithoutItems as base when available
      const baseDesc = scene.descriptionWithoutItems || scene.description;

      // If all items have been taken, return just the base description
      if (remainingItems.length === 0) {
        return baseDesc;
      }

      // Build description with remaining item descriptions
      const itemDescs = remainingItems
        .map((itemId) => scene.itemDescriptions?.[itemId])
        .filter(Boolean);

      if (itemDescs.length > 0) {
        return baseDesc + "\n\n" + itemDescs.join("\n");
      }

      return baseDesc;
    },
    [gameState.inventory]
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
    const visibleText = (scene.description + " " + itemDescs).toLowerCase();

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

  const checkLampWarning = useCallback(() => {
    const { lamp } = gameState;
    if (!lamp.lit) return;
    
    if (lamp.limit <= WARN_TIME && lamp.limit > 0 && !lamp.warned) {
      addMessage("warning", "Your lamp is getting dim. I would suggest you replace the batteries.");
      hapticFeedback("warning");
      setGameState((prev) => ({
        ...prev,
        lamp: { ...prev.lamp, warned: true },
      }));
    } else if (lamp.limit <= 0 && !gameOver) {
      addMessage(
        "warning",
        "Your lamp has run out of power."
      );
      setTimeout(() => {
        addMessage(
          "narration",
          "The brass lantern flickers and dies. In the absolute darkness of the deep earth, you are lost forever."
        );
        setGameOver("died");
      }, 1500);
      hapticFeedback("error");
    }
  }, [gameState.lamp, addMessage, hapticFeedback, gameOver]);

  const handleMove = useCallback(
    (toSceneId: string) => {
      const newScene = SCENES[toSceneId];
      if (!newScene) {
        addMessage("system", "You can't go that way.");
        return;
      }

      setGameState((prev) => ({
        ...prev,
        previousSceneId: prev.sceneId,
        sceneId: toSceneId,
        visitHistory: [...(prev.visitHistory || [prev.sceneId]), toSceneId],
      }));

      decreaseLampLife();
      addMessage("narration", getSceneDescription(toSceneId));
      hapticFeedback("light");
    },
    [addMessage, decreaseLampLife, hapticFeedback, getSceneDescription]
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
  }, [gameState.previousSceneId, addMessage, decreaseLampLife, getSceneDescription, hapticFeedback, checkLampWarning]);

  const handleTakeItem = useCallback(
    (itemId: string, actionId: string) => {
      const item = ITEMS[itemId];
      if (!item) return;

      setGameState((prev) => {
        const newState = {
          ...prev,
          inventory: [...prev.inventory, itemId],
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
    [addMessage, decreaseLampLife, hapticFeedback]
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

        if (item.useEffect.lampBonus) {
          setGameState((prev) => ({
            ...prev,
            lamp: {
              ...prev.lamp,
              limit: prev.lamp.limit + item.useEffect!.lampBonus!,
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
      text: startScene?.description || "You are in a mysterious place.",
      timestamp: Date.now(),
    };

    setMessages([...newMessages, sceneMessage]);
    hapticFeedback("medium");
  }, [hapticFeedback]);

  const parseCommand = useCallback(
    (input: string) => {
      const rawInput = input.trim();
      const command = rawInput.toLowerCase();
      
      const stripArticles = (text: string) => 
        text.replace(/\b(the|a|an|some|my|that|this)\b/gi, "").replace(/\s+/g, " ").trim();
      
      const cleanCommand = stripArticles(command);
      const words = cleanCommand.split(/\s+/);

      addMessage("action", `> ${rawInput}`);

      // === LEXICON NORMALIZATION (additive layer) ===
      // Try normalizing command first, but preserve canon commands
      const availableActions = getAvailableActions();
      const normalized = normalizeCommand(rawInput, availableActions);
      
      // If lexicon resolved to a specific action, execute it
      if (normalized.intent === "move" && normalized.resolvedActionId) {
        const action = availableActions.find(a => a.id === normalized.resolvedActionId);
        if (action && action.to) {
          handleMove(action.to);
          checkLampWarning();
          return;
        }
      }
      
      if (normalized.intent === "back") {
        handleGoBack();
        return;
      }
      
      // For take/use/look/inventory intents with targets, let existing patterns handle them
      // (they have more sophisticated matching)

      // Natural language patterns for LOOK
      if (
        command === "look" ||
        command === "look around" ||
        command === "examine" ||
        command === "examine room" ||
        command === "examine surroundings" ||
        command === "inspect" ||
        command === "observe" ||
        command === "check surroundings" ||
        command === "where am i" ||
        command === "what do i see" ||
        command === "describe"
      ) {
        addMessage("narration", getSceneDescription(gameState.sceneId));
        decreaseLampLife();
        checkLampWarning();
        return;
      }

      // Natural language patterns for HELP
      if (
        command === "help" ||
        command === "?" ||
        command === "commands" ||
        command === "what can i do" ||
        command === "how to play" ||
        command === "instructions"
      ) {
        addMessage("system", HELP_TEXT);
        return;
      }

      // Natural language patterns for INVENTORY
      if (
        command === "inventory" ||
        command === "inv" ||
        command === "i" ||
        command === "items" ||
        command === "check inventory" ||
        command === "show inventory" ||
        command === "what do i have" ||
        command === "what am i carrying" ||
        command === "my items" ||
        command === "bag" ||
        command === "backpack" ||
        command === "pockets"
      ) {
        if (gameState.inventory.length === 0) {
          addMessage("system", "Your pockets are empty.");
        } else {
          const items = gameState.inventory
            .map((id) => ITEMS[id]?.name || id)
            .join(", ");
          addMessage("system", `You are carrying: ${items}`);
        }
        return;
      }

      // Natural language patterns for NEW GAME
      if (command === "new" || command === "new game" || command === "restart" || command === "start over") {
        handleNewGame();
        return;
      }

      // Natural language patterns for TAKE/PICK UP/GRAB
      const takePatterns = [
        /^(take|get|grab|pick up|collect|pick|acquire|snag|retrieve)\s+(.+)$/i,
      ];
      for (const pattern of takePatterns) {
        const match = cleanCommand.match(pattern);
        if (match) {
          const target = stripArticles(match[2]);
          if (!target) {
            addMessage("system", "Take what?");
            checkLampWarning();
            return;
          }
          const availableActions = getAvailableActions();
          const takeAction = availableActions.find(
            (a) =>
              a.addsItem &&
              (a.addsItem.toLowerCase().includes(target) ||
                ITEMS[a.addsItem]?.name.toLowerCase().includes(target))
          );
          if (takeAction && takeAction.addsItem) {
            handleTakeItem(takeAction.addsItem, takeAction.id);
          } else {
            addMessage("system", "You don't see that here.");
          }
          checkLampWarning();
          return;
        }
      }

      // Natural language patterns for USE
      const usePatterns = [
        /^(use|activate|apply|consume|drink|eat|light|burn)\s+(.+)$/i,
      ];
      for (const pattern of usePatterns) {
        const match = cleanCommand.match(pattern);
        if (match) {
          const target = stripArticles(match[2]);
          if (!target) {
            addMessage("system", "Use what?");
            checkLampWarning();
            return;
          }
          const itemToUse = gameState.inventory.find(
            (id) =>
              id.toLowerCase().includes(target) ||
              ITEMS[id]?.name.toLowerCase().includes(target)
          );
          if (itemToUse) {
            handleUseItem(itemToUse);
          } else {
            addMessage("system", "You don't have that.");
          }
          checkLampWarning();
          return;
        }
      }

      // Natural language patterns for GO BACK
      if (
        command === "go back" ||
        command === "back" ||
        command === "return" ||
        command === "retreat" ||
        command === "go back the way i came" ||
        command === "turn back" ||
        command === "retrace" ||
        command === "retrace my steps"
      ) {
        handleGoBack();
        return;
      }

      // Natural language patterns for MOVEMENT
      const movePatterns = [
        /^(go|move|walk|head|travel|proceed|run|crawl|climb)\s+(to\s+)?(the\s+)?(north|south|east|west|up|down|in|out|ne|nw|se|sw|northeast|northwest|southeast|southwest|n|s|e|w|u|d)$/i,
        /^(go|move|walk|head|travel|proceed|run|crawl|climb)\s+(north|south|east|west|up|down|n|s|e|w|u|d)(ward|wards)?$/i,
        /^(enter|exit)\s+(.+)$/i,
      ];
      for (const pattern of movePatterns) {
        const match = command.match(pattern);
        if (match) {
          const dirWord = match[match.length - 1].replace(/ward(s)?$/i, "");
          handleDirection(dirWord);
          checkLampWarning();
          return;
        }
      }

      // Direct direction commands
      const directDirections: Record<string, string> = {
        north: "north",
        south: "south",
        east: "east",
        west: "west",
        n: "north",
        s: "south",
        e: "east",
        w: "west",
        up: "up",
        down: "down",
        u: "up",
        d: "down",
        in: "in",
        out: "out",
        ne: "ne",
        nw: "nw",
        se: "se",
        sw: "sw",
        northeast: "ne",
        northwest: "nw",
        southeast: "se",
        southwest: "sw",
      };
      if (directDirections[words[0]]) {
        handleDirection(directDirections[words[0]]);
        checkLampWarning();
        return;
      }

      // Fallback: try to match any item name for implicit take
      const implicitTake = availableActions.find(
        (a) =>
          a.addsItem &&
          (cleanCommand.includes(a.addsItem.toLowerCase()) ||
            ITEMS[a.addsItem]?.name.toLowerCase().split(" ").some(word => cleanCommand.includes(word)))
      );
      if (implicitTake && implicitTake.addsItem) {
        if (command.includes("pick") || command.includes("grab") || command.includes("take") || command.includes("get")) {
          handleTakeItem(implicitTake.addsItem, implicitTake.id);
          checkLampWarning();
          return;
        }
      }

      // Magic word patterns: "say xyzzy", "cast xyzzy", "speak plugh", etc.
      const magicWordPatterns = [
        /^(?:say|speak|cast|chant|utter|invoke)\s+(.+)$/i,
      ];
      for (const pattern of magicWordPatterns) {
        const magicMatch = cleanCommand.match(pattern);
        if (magicMatch) {
          const magicWord = magicMatch[1].toLowerCase().trim();
          const actions = getAvailableActions();
          const magicAction = actions.find(
            (a) => a.type === "move" && (
              a.id === `go_${magicWord}` ||
              a.label.toLowerCase() === magicWord
            )
          );
          if (magicAction && magicAction.to) {
            handleMove(magicAction.to);
            checkLampWarning();
            return;
          }
        }
      }

      // Single-token travel verb support (xyzzy, plugh, enter, depression, etc.)
      if (words.length === 1) {
        const token = words[0].toLowerCase();
        const actions = getAvailableActions();
        
        const moveAction = actions.find(
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
        
        const eventAction = actions.find(
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

      // Default travel fallback - check for go_default action
      const defaultMove = availableActions.find(
        (a) => a.type === "move" && a.id === "go_default"
      );
      if (defaultMove && defaultMove.to) {
        handleMove(defaultMove.to);
        checkLampWarning();
        return;
      }

      // Unknown command
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
      handleUseItem,
      handleAction,
      handleMove,
      addMessage,
      decreaseLampLife,
      checkLampWarning,
      handleNewGame,
      handleDirection,
      handleGoBack,
    ]
  );

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initGame = async () => {
      const saveData = await loadGame();
      if (saveData) {
        setGameState(saveData.gameState);
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
          text: startScene?.description || "You are in a mysterious place.",
          timestamp: Date.now(),
        };

        setMessages([...newMessages, sceneMessage]);
      }
      setIsLoading(false);
    };

    initGame();
  }, [addMessage]);

  return {
    gameState,
    messages,
    isLoading,
    gameOver,
    getCurrentScene,
    getAvailableActions,
    getShortcutActions,
    handleAction,
    parseCommand,
    handleNewGame,
  };
}
