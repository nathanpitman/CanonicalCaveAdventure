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

      // If all items have been taken, use the base description without items
      if (remainingItems.length === 0) {
        return scene.descriptionWithoutItems || scene.description;
      }

      // If some items remain, build description with remaining item descriptions
      if (remainingItems.length < scene.items.length) {
        // Some items taken - build custom description
        const baseDesc = scene.descriptionWithoutItems || scene.description.split("\n\n")[0];
        const itemDescs = remainingItems
          .map((itemId) => scene.itemDescriptions?.[itemId])
          .filter(Boolean);
        
        if (itemDescs.length > 0) {
          return baseDesc + "\n\n" + itemDescs.join(" ");
        }
        return baseDesc;
      }

      // All items still present - return full original description
      return scene.description;
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

  const decreaseLight = useCallback((amount: number = 1) => {
    setGameState((prev) => {
      const newLight = Math.max(0, prev.stats.light - amount);
      return {
        ...prev,
        stats: {
          ...prev.stats,
          light: newLight,
          turns: prev.stats.turns + 1,
        },
      };
    });
  }, []);

  const checkLightWarning = useCallback(() => {
    if (gameState.stats.light <= 20 && gameState.stats.light > 0) {
      addMessage("warning", "Your lamp flickers weakly. The oil is running low...");
      hapticFeedback("warning");
    } else if (gameState.stats.light === 0 && !gameOver) {
      addMessage(
        "warning",
        "Darkness closes in. Your lamp has gone out. You stumble blindly..."
      );
      setTimeout(() => {
        addMessage(
          "narration",
          "The lamp sputters and dies. In the absolute darkness of the deep earth, you are lost forever."
        );
        setGameOver("died");
      }, 1500);
      hapticFeedback("error");
    }
  }, [gameState.stats.light, addMessage, hapticFeedback, gameOver]);

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

      decreaseLight(1);
      addMessage("narration", getSceneDescription(toSceneId));
      hapticFeedback("light");
    },
    [addMessage, decreaseLight, hapticFeedback, getSceneDescription]
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

    decreaseLight(1);
    addMessage("narration", getSceneDescription(targetSceneId));
    hapticFeedback("light");
    checkLightWarning();
  }, [gameState.previousSceneId, addMessage, decreaseLight, getSceneDescription, hapticFeedback, checkLightWarning]);

  const handleTakeItem = useCallback(
    (itemId: string, actionId: string) => {
      const item = ITEMS[itemId];
      if (!item) return;

      setGameState((prev) => ({
        ...prev,
        inventory: [...prev.inventory, itemId],
        removedActions: {
          ...prev.removedActions,
          [prev.sceneId]: [...(prev.removedActions[prev.sceneId] || []), actionId],
        },
      }));

      decreaseLight(1);
      addMessage("system", `You pick up the ${item.name}.`);
      hapticFeedback("medium");
    },
    [addMessage, decreaseLight, hapticFeedback]
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
            stats: {
              ...prev.stats,
              light: Math.min(100, prev.stats.light + item.useEffect!.lightBonus!),
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

      decreaseLight(1);
    },
    [gameState.inventory, addMessage, decreaseLight, hapticFeedback]
  );

  const handleAction = useCallback(
    (action: Action) => {
      addMessage("action", `> ${action.label}`);

      switch (action.type) {
        case "command":
          if (action.command === "look") {
            addMessage("narration", getSceneDescription(gameState.sceneId));
          }
          decreaseLight(1);
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
            decreaseLight(1);
            checkLightWarning();
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
            decreaseLight(1);
          }
          break;
      }
    },
    [getCurrentScene, handleMove, handleTakeItem, addMessage, decreaseLight, hapticFeedback]
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
        enter: "go_in",
        exit: "go_out",
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
        decreaseLight(1);
        checkLightWarning();
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
            checkLightWarning();
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
          checkLightWarning();
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
            checkLightWarning();
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
          checkLightWarning();
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
        /^(enter|exit)\s*(.*)$/i,
      ];
      for (const pattern of movePatterns) {
        const match = command.match(pattern);
        if (match) {
          const dirWord = match[match.length - 1].replace(/ward(s)?$/i, "");
          handleDirection(dirWord);
          checkLightWarning();
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
        enter: "in",
        exit: "out",
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
        checkLightWarning();
        return;
      }

      // Fallback: try to match any item name for implicit take
      const availableActions = getAvailableActions();
      const implicitTake = availableActions.find(
        (a) =>
          a.addsItem &&
          (cleanCommand.includes(a.addsItem.toLowerCase()) ||
            ITEMS[a.addsItem]?.name.toLowerCase().split(" ").some(word => cleanCommand.includes(word)))
      );
      if (implicitTake && implicitTake.addsItem) {
        if (command.includes("pick") || command.includes("grab") || command.includes("take") || command.includes("get")) {
          handleTakeItem(implicitTake.addsItem, implicitTake.id);
          checkLightWarning();
          return;
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
          checkLightWarning();
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
        checkLightWarning();
        return;
      }

      // Unknown command
      addMessage(
        "system",
        `I don't understand "${rawInput}". Try commands like "look", "take lamp", "go east", "go back", or type "help".`
      );
      checkLightWarning();
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
      decreaseLight,
      checkLightWarning,
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
    handleAction,
    parseCommand,
    handleNewGame,
  };
}
