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

  const getAvailableActions = useCallback((): Action[] => {
    const scene = getCurrentScene();
    if (!scene) return [];

    const removedIds = gameState.removedActions[gameState.sceneId] || [];
    return scene.actions.filter((action) => {
      if (removedIds.includes(action.id)) return false;
      if (action.requiresItem && !gameState.inventory.includes(action.requiresItem))
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
    } else if (gameState.stats.light === 0) {
      addMessage(
        "warning",
        "Darkness closes in. Your lamp has gone out. You stumble blindly..."
      );
      hapticFeedback("error");
    }
  }, [gameState.stats.light, addMessage, hapticFeedback]);

  const handleMove = useCallback(
    (toSceneId: string) => {
      const newScene = SCENES[toSceneId];
      if (!newScene) {
        addMessage("system", "You can't go that way.");
        return;
      }

      setGameState((prev) => ({
        ...prev,
        sceneId: toSceneId,
      }));

      decreaseLight(1);
      addMessage("narration", newScene.description);
      hapticFeedback("light");

      if (toSceneId === "exit_slope") {
        setTimeout(() => {
          setGameOver("escaped");
          hapticFeedback("success");
        }, 2000);
      }
    },
    [addMessage, decreaseLight, hapticFeedback]
  );

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
            const scene = getCurrentScene();
            addMessage("narration", scene.description);
          }
          decreaseLight(1);
          break;

        case "move":
          if (action.to) {
            handleMove(action.to);
          }
          break;

        case "event":
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

  const parseCommand = useCallback(
    (input: string) => {
      const command = input.toLowerCase().trim();
      const words = command.split(/\s+/);
      const verb = words[0];
      const target = words.slice(1).join(" ");

      addMessage("action", `> ${input}`);

      switch (verb) {
        case "help":
          addMessage("system", HELP_TEXT);
          break;

        case "look":
          const scene = getCurrentScene();
          addMessage("narration", scene.description);
          decreaseLight(1);
          break;

        case "inventory":
        case "inv":
        case "i":
          if (gameState.inventory.length === 0) {
            addMessage("system", "Your pockets are empty.");
          } else {
            const items = gameState.inventory
              .map((id) => ITEMS[id]?.name || id)
              .join(", ");
            addMessage("system", `You are carrying: ${items}`);
          }
          break;

        case "take":
        case "get":
        case "grab":
          if (!target) {
            addMessage("system", "Take what?");
            break;
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
          break;

        case "use":
          if (!target) {
            addMessage("system", "Use what?");
            break;
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
          break;

        case "go":
        case "move":
        case "walk":
          const direction = target || "";
          handleDirection(direction);
          break;

        case "north":
        case "n":
          handleDirection("north");
          break;

        case "south":
        case "s":
          handleDirection("south");
          break;

        case "east":
        case "e":
          handleDirection("east");
          break;

        case "west":
        case "w":
          handleDirection("west");
          break;

        case "save":
          handleSave();
          break;

        case "load":
          handleLoad();
          break;

        case "new":
          handleNewGame();
          break;

        default:
          addMessage(
            "system",
            `Unknown command: "${verb}". Type "help" for a list of commands.`
          );
      }

      checkLightWarning();
    },
    [
      gameState,
      getCurrentScene,
      getAvailableActions,
      handleTakeItem,
      handleUseItem,
      addMessage,
      decreaseLight,
      checkLightWarning,
    ]
  );

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

  const handleSave = useCallback(async () => {
    const success = await saveGame(gameState, messages);
    if (success) {
      addMessage("system", "Game saved.");
      hapticFeedback("success");
    } else {
      addMessage("system", "Failed to save game.");
      hapticFeedback("error");
    }
  }, [gameState, messages, addMessage, hapticFeedback]);

  const handleLoad = useCallback(async () => {
    const saveData = await loadGame();
    if (saveData) {
      setGameState(saveData.gameState);
      setMessages(saveData.messages);
      addMessage("system", "Game loaded.");
      hapticFeedback("success");
    } else {
      addMessage("system", "No save found.");
      hapticFeedback("warning");
    }
  }, [addMessage, hapticFeedback]);

  const handleNewGame = useCallback(async () => {
    await deleteSave();
    setGameState(initialGameState);
    setMessages([]);
    setGameOver(null);

    const newMessages: Message[] = INTRO_MESSAGES.map((msg) => ({
      id: generateMessageId(),
      type: msg.type,
      text: msg.text,
      timestamp: Date.now(),
    }));

    const sceneMessage: Message = {
      id: generateMessageId(),
      type: "narration",
      text: SCENES.chasm_base.description,
      timestamp: Date.now(),
    };

    setMessages([...newMessages, sceneMessage]);
    hapticFeedback("medium");
  }, [hapticFeedback]);

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
          type: msg.type,
          text: msg.text,
          timestamp: Date.now(),
        }));

        const sceneMessage: Message = {
          id: generateMessageId(),
          type: "narration",
          text: SCENES.chasm_base.description,
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
    handleSave,
    handleLoad,
    handleNewGame,
  };
}
