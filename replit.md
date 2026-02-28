# Canonical Cave Adventure

## Overview

Canonical is a mobile-first text adventure game that implements the classic Colossal Cave Adventure (Open Adventure). The project's vision is to deliver a faithful and engaging mobile adaptation of this seminal text adventure, allowing players to explore a vast cave network, manage resources like lamp light, and collect treasures. It aims to provide a rich, narrative-driven experience with natural language interaction, leveraging modern mobile technologies for broad accessibility.

## User Preferences

I want the agent to use a clear, concise communication style.
I prefer an iterative development approach, with frequent small updates.
Please ask for confirmation before making any significant architectural changes or adding new external dependencies.
Ensure that the core game logic and narrative content remain faithful to the original Colossal Cave Adventure.
Do not make changes to the `public/` folder unless explicitly instructed.
Do not make changes to the `tools/injectPwaMeta.js` file.

## System Architecture

**UI/UX Decisions:**
- **Mobile-First Design:** Optimized for small screens with a clean, chat-like narrative feed.
- **Adaptive Theming:** Supports automatic system dark/light mode, dynamically updating UI elements and `theme-color` meta tags.
  - Dark Mode: Cave aesthetic with #FF9500 accent, #0A0A0A background, #1A1612 surface.
  - Light Mode: Warm parchment with #D97E00 accent, #F5F0E8 background, #FFFFFF surface.
- **Interactive Elements:** Features quick action buttons, a slide-up command panel with Help/Restart, and a YouTube-chapters-style segmented progress bar for milestones.
- **Narrative Presentation:** Story unfolds through styled message bubbles, enhancing the immersive text adventure experience.

**Technical Implementations & Design Patterns:**
- **Frontend Framework:** React Native with Expo for cross-platform mobile and web deployment.
- **Backend (Development Only):** Express.js for serving the landing page and API during development. The final web deployment is static.
- **State Management:** Utilizes React hooks with a custom `useGame` hook to encapsulate core game logic and state.
- **Natural Language Processing (NLP):** A dedicated NLP layer (`commandParser.ts`, `actionResolver.ts`) handles user input, transforming raw strings into game actions, supporting complex phrases and typo tolerance (Damerau-Levenshtein distance). Includes `NARRATIVE_SYNONYMS` in `lexicon.ts` mapping ~50 natural language phrases (downstream, upstream, follow stream, etc.) to canonical action tokens (downs, upstr, bed, etc.).
- **Narrative Exit Audit:** `tools/auditNarrativeExits.ts` scans all 183 scenes for narrative cue phrases in descriptions, tests whether they resolve to available exits, and generates gap reports (`docs/narrative-exit-audit.json`, `docs/narrative-exit-audit.md`). Runs automatically after YAML imports via `importOpenAdventure.ts`.
- **Game Content Management:** All scenes, items, and game content are structured in `data/story.ts`, imported from a canonical adventure YAML file. The YAML importer (`tools/importOpenAdventure.ts`) preserves conditional travel rules (carry/not/with/pct conditions) as `conditionalRoutes` on scene actions, converting YAML state names to numeric values via `OBJECT_STATE_MAP`. This ensures conditional routing (e.g., pittop descent, fissure crossing) survives re-imports.
- **Data-Driven Architecture:** The game is designed to be fully data-driven from `adventure.yaml`. The importer generates three files:
  - `generatedStory.ts`: Scenes, items, hints, obituaries, turn thresholds, lamp messages, hint conditions, canonical objects/verbs.
  - `canonObjects.ts`: Object start locations, treasure config, NPC locations, scoring functions (calculateScore, getScoreClass), hint penalties — all derived from YAML.
  - `generatedConstants.ts`: Object state constants, dwarf config (start locs, count, pirate index), direction/noun synonyms from YAML motions/objects vocabulary, maze scene IDs from location conditions, score classes, story messages.
  Consuming files (`canonConstants.ts`, `dwarves.ts`, `lexicon.ts`, `progressMilestones.ts`) re-export from generated data, adding only non-YAML extras (e.g., extra direction synonyms, lamp timing constants). Swapping `adventure.yaml` for a different story file and re-running the importer should produce a working game without manual code changes.
- **Persistent State:** Game progress is automatically saved locally using AsyncStorage after every state change.
- **Modular Component Design:** UI elements are broken down into reusable components (e.g., `ActionButton`, `MessageBubble`, `TorchIndicator`).
- **PWA Support:** Configured for Progressive Web App (PWA) capabilities, including manifest, icons, and Apple meta tags for "Add to Home Screen" on iOS.

**Feature Specifications:**
- **Core Gameplay Loop:** Players explore 180+ scenes, managing a turn-based lamp system (330 turns, extendable with batteries), collecting treasures, and interacting with the environment through commands.
- **Dynamic Environment:** Room descriptions update based on taken items, and the lamp indicator dynamically appears and explains the fuel system.
- **Canonical Game Mechanics:** Implements Open Adventure's full travel system, including verb tokens, conditional travel (`requiresFlag`), default travel (`go_default`), speak actions for blocked paths, magic words (xyzzy/plugh/plover), and the grate puzzle.
- **NPC System:** Dwarf movement AI with knife throwing attacks, pirate treasure theft, bear/chain/food taming, ogre blocking (throw bear to defeat), troll bridge toll.
- **Object Puzzles:** Bird/cage/snake, bear/chain/food, dragon bare-hands kill, troll bridge, clam/oyster/pearl, plant/beanstalk growth, urn/gemstone/cavity/amber, door oiling.
- **Bottle/Liquid System:** Water/oil virtual objects, 3 bottle states (water/empty/oil), fill/pour/drink mechanics, location-based fluid availability (FLUID/OILY flags).
- **Magic Words:** xyzzy, plugh, plover (with special transport), fee/fie/foe/foo sequence (eggs teleport), sesame/abracadabra/shazam/hocus pocus (old worn-out words).
- **Forced Movement:** Foof intermediate scenes auto-chain to destination (e.g., foof3→y2).
- **Y2 Hollow Voice:** 25% chance of hearing "PLUGH" when entering Y2 (suppressed during closing).
- **Vending Machine:** Drop coins at deadend13 to dispense batteries.
- **Inventory System:** Supports picking up, dropping, and using items, with a carry limit and special item behaviors (e.g., vase fragility). Bottle shows state in inventory.
- **Death & Reincarnation:** Features a canonical obituary system with limited reincarnations before permanent game over.
- **Hint System:** Includes a canonical hint system with gating rules and score penalties for usage. Hint eligibility conditions are data-driven via `HINT_CONDITIONS` in `generatedStory.ts`, generated by the YAML importer keyed by hint name. Scene-level hint assignment (`scene.hints[]`) handles location checking; `HINT_CONDITIONS` handles game-state requirements only.
- **Score Tracking:** Canonical 430-point scoring: treasures (298), survival (30), exploration (25), cave closing (25), endgame victory (45), magazine bonus (1), not quitting (4), round-out (2). Deductions for hints and turn thresholds. 10-tier rating system.
- **Cave Closure:** Tally-based closure system triggered when all treasures are located (tally==0). Two-phase: clock1 (15-turn warning) then clock2 (15-turn panic). When clock1 hits 0: sepulchral voice, grate locked, bridge vanished, all dwarves killed, troll replaced. Exit blocked via ABOVE flag.
- **Endgame Repository:** When clock2 hits 0: player teleported to "ne" room, inventory destroyed, lamp goes dark. Repository has two rooms (ne/sw) with mirror spanning both. Objects placed: bottle/rod/lamp in ne, rod2/pillow in sw.
- **Endgame Puzzle (Blast):** `blast` command uses rod2 as "dynamite". Without rod2: "Blasting requires dynamite." With rod2 + mirror intact: defeat (25-30 pts). With rod2 + mirror broken (via `wave rod`): victory (45 pts).
- **Death During Closing:** Permanent — no resurrection offered. Immediate game over with score display.
- **Command Set:** Supports commands: `look`, `inventory`, `take`, `use`, `go`, `go back`, `drop`, `score`, `brief`, `wait`, `attack`, `throw`, `feed`, `wave`, `fill`, `pour`, `drink`, `read`, `open`, `unlock`, `close`, `lock`, `say`, `eat`, `rub`, `quit`, `blast`, `fee/fie/foe/foo`.
- **Canonical Naming:** Game state keys align with Open Adventure source: `clock1` (cave closure timer), `foobar` (fee-fie-foe-foo counter). Functions: `lcgRandom()` exported from dwarves.ts for deterministic RNG.
- **BACK Command:** Blocked in NOBACK-flagged locations via `isNoBack()` check from dwarves.ts.
- **Plover Transport (Special 2):** Drops emerald at current location if carried (prevents emerald smuggling via magic word). Other items unaffected.
- **Wave Rod:** Works at both eastbank and westbank fissure scenes (not just one side).

## Analytics Layer

A lightweight client-side analytics system (`client/analytics.ts`) tracks game usage and player behavior without any backend runtime requirement.

**Tracked Events:**
- `session_start`, `scene_entered`, `command_entered`, `command_failed`, `scene_repeat`, `game_completed`, `player_exit`, `frustration_detected`

**Integration Points (in `client/hooks/useGame.ts`):**
- `initAnalytics()` + `trackScene()` — called on game initialization
- `trackScene(sceneId)` — called on every scene change in `handleMove`
- `trackCommand(input, true/false)` — called after command resolution or on unrecognized input
- `trackGameComplete()` — called when the player escapes (sets `escaped` flag)

**Drop-off & Exit Tracking:**
- `beforeunload`, `visibilitychange`, and 5-minute inactivity timer automatically call `trackExit()`

**Frustration Detection (silent, analytics-only):**
- 3+ failed commands in one scene → `reason: "failed_commands"`
- 2+ repeated visits without progress → `reason: "looping_scene"`
- 5+ commands without scene change → `reason: "no_progress"`

**Advanced Insights (in-memory, sent on exit):**
- Total play duration, longest scene time, most failed command, command frequency map

**Configuration:**
- `EXPO_PUBLIC_ANALYTICS_ENDPOINT` env var (or fallback constant in `client/analytics.ts`) — set to your serverless worker URL
- GA4 placeholder `G-XXXXXXXXXX` in `web/index.html` — replace with real Measurement ID
- `window.debugAnalytics()` available in browser console for offline debugging

## External Dependencies

- **React Native:** Frontend framework.
- **Expo:** Development platform and build tool for React Native.
- **Express.js:** Web application framework for the development backend.
- **AsyncStorage:** Local persistent storage for game saves on the client.
- **GitHub Pages:** Static site hosting for the client-side game, deployed via GitHub Actions.
- **Open Adventure (Colossal Cave Adventure) Content:** The game's narrative, scenes, and items are imported from the canonical `adventure.yaml` structure.