import AsyncStorage from "@react-native-async-storage/async-storage";
import { START_SCENE_ID } from "./story";
import { INITIAL_LAMP_LIMIT } from "./canonConstants";
import { buildInitialObjectLocations } from "./canonObjects";
import { DwarfSystemState, buildInitialDwarfState } from "./dwarves";

export interface Message {
  id: string;
  type: "narration" | "system" | "action" | "warning" | "nav-hint";
  text: string;
  timestamp: number;
  sceneId?: string;
}

export interface PendingPrompt {
  type: "hint_question" | "hint_answer" | "obituary";
  text: string;
  hintNumber?: number;
  obituaryIndex?: number;
}

export interface GameState {
  sceneId: string;
  previousSceneId: string | null;
  visitHistory: string[];
  inventory: string[];
  objectLocations: Record<string, string>;
  objectStates: Record<string, number>;
  flags: Record<string, boolean>;
  stats: {
    turns: number;
    score: number;
    endgameBonus?: number;
  };
  lamp: {
    lit: boolean;
    limit: number;
    warned: boolean;
  };
  batteryState: "fresh" | "available" | "carried" | "used" | "dead" | "absent";
  removedActions: Record<string, string[]>;
  milestonesCompleted: string[];
  hintState: {
    turnsInLocation: Record<number, number>;
    hintsGiven: number[];
  };
  deathState: {
    numdie: number;
    maxDeaths: number;
  };
  thresholdsTriggered: number[];
  pendingPrompt: PendingPrompt | null;
  visitCounts: Record<string, number>;
  briefMode: boolean;
  dwarfState: DwarfSystemState;
  rngSeed: number;
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
  objectLocations: buildInitialObjectLocations(),
  objectStates: {},
  flags: {
    grateOpen: false,
  },
  stats: {
    turns: 0,
    score: 0,
  },
  lamp: {
    lit: false,
    limit: INITIAL_LAMP_LIMIT,
    warned: false,
  },
  batteryState: "fresh",
  removedActions: {},
  milestonesCompleted: [],
  hintState: {
    turnsInLocation: {},
    hintsGiven: [],
  },
  deathState: {
    numdie: 0,
    maxDeaths: 3,
  },
  thresholdsTriggered: [],
  pendingPrompt: null,
  visitCounts: { [START_SCENE_ID]: 1 },
  briefMode: false,
  dwarfState: buildInitialDwarfState(),
  rngSeed: Math.floor(Math.random() * 1048576),
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
