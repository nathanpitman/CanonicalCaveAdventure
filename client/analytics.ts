import { Platform, AppState } from "react-native";
import type { AppStateStatus } from "react-native";

const APP_VERSION = "20260305";

const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000;
const FRUSTRATION_FAIL_THRESHOLD = 3;
const FRUSTRATION_LOOP_THRESHOLD = 2;
const FRUSTRATION_NO_PROGRESS_THRESHOLD = 5;

interface SceneDropOff {
  enters: number;
  failures: number;
  exits: number;
}

interface AnalyticsState {
  sessionId: string;
  currentScene: string;
  moveCount: number;
  failedCommandCount: number;
  totalFailedCommands: number;
  commandsSinceSceneChange: number;
  sceneFailStreaks: Record<string, number>;
  sceneVisitCounts: Record<string, number>;
  recentScenes: string[];
  sceneDropOff: Record<string, SceneDropOff>;
  commandFrequency: Record<string, number>;
  mostFailedCommand: { command: string; count: number };
  failedCommandCounts: Record<string, number>;
  startTime: number;
  sceneEntryTime: number;
  longestSceneTime: { scene: string; duration: number };
  initialized: boolean;
}

let state: AnalyticsState = {
  sessionId: "",
  currentScene: "",
  moveCount: 0,
  failedCommandCount: 0,
  totalFailedCommands: 0,
  commandsSinceSceneChange: 0,
  sceneFailStreaks: {},
  sceneVisitCounts: {},
  recentScenes: [],
  sceneDropOff: {},
  commandFrequency: {},
  mostFailedCommand: { command: "", count: 0 },
  failedCommandCounts: {},
  startTime: Date.now(),
  sceneEntryTime: Date.now(),
  longestSceneTime: { scene: "", duration: 0 },
  initialized: false,
};

let inactivityTimer: ReturnType<typeof setTimeout> | null = null;

function generateSessionId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 16; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return `s_${Date.now().toString(36)}_${id}`;
}

function getOrCreateSessionId(): string {
  if (Platform.OS === "web") {
    try {
      const stored = localStorage.getItem("analytics_session_id");
      if (stored) return stored;
      const id = generateSessionId();
      localStorage.setItem("analytics_session_id", id);
      return id;
    } catch {
      return generateSessionId();
    }
  }
  return generateSessionId();
}

function trackGA(eventName: string, params?: Record<string, unknown>): void {
  if (Platform.OS !== "web") return;
  try {
    const w = globalThis as unknown as Record<string, unknown>;
    if (typeof w.gtag === "function") {
      (w.gtag as Function)("event", eventName, params ?? {});
    }
  } catch {
  }
}

function resetInactivityTimer(): void {
  if (inactivityTimer) clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    trackExit("inactivity");
  }, INACTIVITY_TIMEOUT_MS);
}

function updateSceneTime(): void {
  const now = Date.now();
  const duration = now - state.sceneEntryTime;
  if (duration > state.longestSceneTime.duration) {
    state.longestSceneTime = { scene: state.currentScene, duration };
  }
}

function detectLoopingScenes(sceneId: string): boolean {
  const windowSize = 10;
  const recent = state.recentScenes.slice(-windowSize);
  let visitCount = 0;
  for (const s of recent) {
    if (s === sceneId) visitCount++;
  }
  return visitCount >= FRUSTRATION_LOOP_THRESHOLD;
}

function checkFrustration(): void {
  const sceneId = state.currentScene;

  if ((state.sceneFailStreaks[sceneId] || 0) >= FRUSTRATION_FAIL_THRESHOLD) {
    trackGA("frustration_detected", { reason: "failed_commands", scene: sceneId });
    state.sceneFailStreaks[sceneId] = 0;
  }

  if (detectLoopingScenes(sceneId)) {
    trackGA("frustration_detected", { reason: "looping_scene", scene: sceneId });
  }

  if (state.commandsSinceSceneChange >= FRUSTRATION_NO_PROGRESS_THRESHOLD) {
    trackGA("frustration_detected", { reason: "no_progress", scene: sceneId });
    state.commandsSinceSceneChange = 0;
  }
}

function buildSummary(): Record<string, unknown> {
  updateSceneTime();
  return {
    totalPlayDuration: Date.now() - state.startTime,
    totalMoves: state.moveCount,
    totalFailedCommands: state.totalFailedCommands,
    longestSceneTime: state.longestSceneTime,
    mostFailedCommand: state.mostFailedCommand,
    topCommands: Object.entries(state.commandFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10),
    sceneDropOff: state.sceneDropOff,
  };
}

function setupWebListeners(): void {
  if (Platform.OS !== "web" || typeof window === "undefined") return;

  window.addEventListener("beforeunload", () => {
    trackExit("page_close");
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      trackExit("tab_hidden");
    }
  });

  (window as unknown as Record<string, unknown>).debugAnalytics = () => {
    const summary = buildSummary();
    console.log("=== Analytics Debug Report ===");
    console.log("Session ID:", state.sessionId);
    console.log("Current Scene:", state.currentScene);
    console.log("Total Moves:", state.moveCount);
    console.log("Total Failed Commands:", state.totalFailedCommands);
    console.log("Play Duration (ms):", summary.totalPlayDuration);
    console.log("Longest Scene Time:", state.longestSceneTime);
    console.log("Most Failed Command:", state.mostFailedCommand);
    console.log("Scene Drop-Off Map:", JSON.parse(JSON.stringify(state.sceneDropOff)));
    console.log("Top Commands:", summary.topCommands);
    console.log("==============================");
    return summary;
  };
}

function setupNativeListeners(): void {
  if (Platform.OS === "web") return;

  const handleAppStateChange = (nextState: AppStateStatus) => {
    if (nextState === "background" || nextState === "inactive") {
      trackExit("app_background");
    }
  };

  const subscription = AppState.addEventListener("change", handleAppStateChange);
  if (subscription && typeof subscription.remove === "function") {
  }
}

export function initAnalytics(): void {
  if (state.initialized) return;
  state.sessionId = getOrCreateSessionId();
  state.startTime = Date.now();
  state.initialized = true;

  if (Platform.OS === "web") {
    try {
      const w = globalThis as unknown as Record<string, unknown>;
      if (typeof w.gtag === "function") {
        (w.gtag as Function)("set", "user_properties", { app_version: APP_VERSION });
      }
    } catch {}
  }

  trackGA("session_start", { app_version: APP_VERSION });

  setupWebListeners();
  setupNativeListeners();
  resetInactivityTimer();
}

export function trackScene(sceneId: string, sceneTitle?: string): void {
  if (!state.initialized) return;

  updateSceneTime();

  const previousScene = state.currentScene;
  state.currentScene = sceneId;
  state.sceneEntryTime = Date.now();
  state.commandsSinceSceneChange = 0;
  state.sceneFailStreaks[sceneId] = 0;
  state.moveCount++;

  state.recentScenes.push(sceneId);
  if (state.recentScenes.length > 20) {
    state.recentScenes = state.recentScenes.slice(-20);
  }

  state.sceneVisitCounts[sceneId] = (state.sceneVisitCounts[sceneId] || 0) + 1;

  if (!state.sceneDropOff[sceneId]) {
    state.sceneDropOff[sceneId] = { enters: 0, failures: 0, exits: 0 };
  }
  state.sceneDropOff[sceneId].enters++;

  const pageTitle = sceneTitle ? `Canonical / ${sceneTitle}` : "Canonical";
  if (Platform.OS === "web" && typeof document !== "undefined") {
    document.title = pageTitle;
  }

  const isRepeat = state.sceneVisitCounts[sceneId] > 1;
  const eventType = isRepeat ? "scene_repeat" : "scene_entered";
  trackGA(eventType, { scene: sceneId, previousScene, page_title: pageTitle });

  checkFrustration();
  resetInactivityTimer();
}

export function trackCommand(input: string, success: boolean): void {
  if (!state.initialized) return;

  const normalized = input.trim().toLowerCase();
  state.commandFrequency[normalized] = (state.commandFrequency[normalized] || 0) + 1;
  state.commandsSinceSceneChange++;

  if (success) {
    trackGA("command_entered", { command: normalized });
  } else {
    state.totalFailedCommands++;
    state.failedCommandCount++;
    state.sceneFailStreaks[state.currentScene] =
      (state.sceneFailStreaks[state.currentScene] || 0) + 1;

    state.failedCommandCounts[normalized] =
      (state.failedCommandCounts[normalized] || 0) + 1;
    if (state.failedCommandCounts[normalized] > state.mostFailedCommand.count) {
      state.mostFailedCommand = {
        command: normalized,
        count: state.failedCommandCounts[normalized],
      };
    }

    if (state.sceneDropOff[state.currentScene]) {
      state.sceneDropOff[state.currentScene].failures++;
    }

    trackGA("command_failed", { command: normalized });

    checkFrustration();
  }

  resetInactivityTimer();
}

export function trackGameComplete(): void {
  if (!state.initialized) return;

  updateSceneTime();
  trackGA("game_completed", { totalMoves: state.moveCount });
}

export function trackHelpOpened(): void {
  if (!state.initialized) return;
  trackGA("help_opened", { scene: state.currentScene });
}

export function trackRestartGame(): void {
  if (!state.initialized) return;
  trackGA("game_restarted", { scene: state.currentScene, totalMoves: state.moveCount });
}

export function trackExit(reason = "unknown"): void {
  if (!state.initialized) return;

  updateSceneTime();

  if (state.sceneDropOff[state.currentScene]) {
    state.sceneDropOff[state.currentScene].exits++;
  }

  trackGA("player_exit", { reason, scene: state.currentScene });
}

export { trackGA };
