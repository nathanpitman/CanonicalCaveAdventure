import AsyncStorage from "@react-native-async-storage/async-storage";
import { START_SCENE_ID } from "./story";
import { INITIAL_LAMP_LIMIT } from "./canonConstants";

export interface Message {
  id: string;
  type: "narration" | "system" | "action" | "warning";
  text: string;
  timestamp: number;
}

export interface GameState {
  sceneId: string;
  previousSceneId: string | null;
  visitHistory: string[];
  inventory: string[];
  flags: Record<string, boolean>;
  stats: {
    turns: number;
  };
  lamp: {
    lit: boolean;
    limit: number;
    warned: boolean;
  };
  batteryState: "fresh" | "used" | "dead" | "absent";
  removedActions: Record<string, string[]>;
  milestonesCompleted: string[];
}

export interface SaveData {
  gameState: GameState;
  messages: Message[];
  savedAt: number;
}

const STORAGE_KEY = "canonical_save_v1";

export const initialGameState: GameState = {
  sceneId: START_SCENE_ID,
  previousSceneId: null,
  visitHistory: [START_SCENE_ID],
  inventory: [],
  flags: {
    grateOpen: false,
  },
  stats: {
    turns: 0,
  },
  lamp: {
    lit: false,
    limit: INITIAL_LAMP_LIMIT,
    warned: false,
  },
  batteryState: "fresh",
  removedActions: {},
  milestonesCompleted: [],
};

export async function saveGame(
  gameState: GameState,
  messages: Message[]
): Promise<boolean> {
  try {
    const saveData: SaveData = {
      gameState,
      messages,
      savedAt: Date.now(),
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    return true;
  } catch (error) {
    console.error("Failed to save game:", error);
    return false;
  }
}

export async function loadGame(): Promise<SaveData | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as SaveData;
    }
    return null;
  } catch (error) {
    console.error("Failed to load game:", error);
    return null;
  }
}

export async function deleteSave(): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Failed to delete save:", error);
    return false;
  }
}

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
