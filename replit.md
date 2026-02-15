# Canonical Cave Adventure

## Overview

Canonical is a mobile-first text adventure game implementing Colossal Cave Adventure (Open Adventure). Players start at the brick building on the surface and explore the cave network, managing their lamp light and collecting treasures.

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Express.js (serves the landing page and API)
- **Storage**: AsyncStorage for local game saves
- **State Management**: React hooks with custom useGame hook

## Project Structure

```
client/
├── components/       # Reusable UI components
│   ├── ActionButton.tsx      # Quick action buttons
│   ├── CommandInput.tsx      # Slide-up command panel with Help/Restart
│   ├── GameHeader.tsx        # Header with progress bar + lamp indicator + location title
│   ├── ProgressChaptersBar.tsx # YouTube-chapters-style segmented progress bar
│   ├── GameOverModal.tsx     # Win/lose screen
│   ├── HelpModal.tsx         # Help/commands reference
│   ├── BatteryIndicator.tsx  # Circular lamp life gauge (canon turn-based)
│   ├── MessageBubble.tsx     # Narrative text bubbles
│   └── ...
├── data/
│   ├── story.ts              # All scenes, items, and game content
│   ├── gameState.ts          # Game state types and AsyncStorage
│   ├── canonConstants.ts     # INITIAL_LAMP_LIMIT, WARN_TIME, BATTERY_LIFE_BONUS
│   ├── progressMilestones.ts # 14 milestone definitions + trigger mappings
│   └── lexicon.ts            # Additive natural language synonym mappings
├── hooks/
│   └── useGame.ts            # Main game logic hook
├── screens/
│   ├── GameScreen.tsx        # Main game screen
│   └── InventoryModal.tsx    # Inventory view
├── navigation/
│   └── RootStackNavigator.tsx
└── constants/
    └── theme.ts              # Dark/light theme colors

server/
├── index.ts          # Express server
├── routes.ts         # API routes
└── storage.ts        # Storage utilities
```

## Game Features

- **Chat-like narrative feed**: Story unfolds through styled message bubbles
- **Quick action buttons**: Contextual actions for each scene
- **Natural language commands**: Type phrases like "pick up the lamp", "head east", "what do i have"
- **Canon lamp system**: Turn-based lamp life (330 turns); find batteries to extend
- **Autosave**: Game automatically saves after every state change
- **Dynamic descriptions**: Room descriptions update when items are taken
- **Go back command**: Return to previous room with "go back" or "back"
- **180+ explorable scenes**: Includes classic Colossal Cave Adventure content imported from Open Adventure

## Commands

- `look` - Examine surroundings
- `inventory` / `inv` / `what do i have` - Check items
- `take <item>` / `pick up <item>` / `grab <item>` - Pick up an item
- `use <item>` - Use an item
- `go <direction>` / `head <direction>` - Move (north/south/east/west/up/down/in/out/ne/nw/se/sw)
- `go back` / `back` / `return` - Return to previous room
- `help` - Show all commands

## Design

- **Theme**: Automatic system dark/light mode (follows OS prefers-color-scheme)
- **Dark mode**: Cave aesthetic — #FF9500 amber accent, #0A0A0A background, #1A1612 surface
- **Light mode**: Warm parchment — #D97E00 amber accent, #F5F0E8 background, #FFFFFF surface
- **Theme switching**: Live — updates immediately when OS theme changes
- **Safari integration**: theme-color meta tag updates dynamically per theme, color-scheme set on root

## Running the App

- Frontend runs on port 8081 (Expo dev server)
- Backend runs on port 5000 (Express, development only)
- Test in browser or scan QR code with Expo Go

## Static Web Deployment (GitHub Pages)

The game runs entirely client-side and can be hosted as a static site:
- Build: `npx expo export --platform web` (outputs to `dist/`)
- Base path: `/CanonicalCaveAdventure` (set in `experiments.baseUrl`)
- Deployed via GitHub Actions workflow (`.github/workflows/deploy.yml`)
- SPA fallback: 404.html copies index.html for client-side routing
- No server dependency at runtime — all game content is bundled in the client

## Canonical Travel Mechanics

The game implements Open Adventure's full travel system:

- **Verb tokens**: Single-word commands like "enter", "depression", "xyzzy" work as movement verbs
- **Conditional travel**: Actions with `requiresFlag` only appear when game flags are set (e.g., grateOpen)
- **Default travel**: Scenes with `go_default` auto-continue for unrecognized commands (e.g., foof1→debris)
- **Speak actions**: Message-only events for blocked paths (e.g., locked grate message)
- **Magic words**: xyzzy/plugh only work inside the building (canonical behavior)
- **Grate puzzle**: Use keys at grate to unlock, then "enter" to pass through

## UI Layer Separation

The game separates canon action availability from UI suggestions:

- **getAvailableActions()**: All canonical actions for typed commands
- **getShortcutActions()**: Filtered actions for UI pills only
  - Compass directions always shown
  - Magic words only shown if mentioned in scene text
  - TAKE pills only shown for items present and not taken
  - Speak/message actions hidden from pills (uiHint: "hidden")

## PWA / Home Screen Support

- Icons generated at 192x192, 512x512 (manifest), 180x180 (apple-touch-icon), 32x32 (favicon) in `public/`
- `public/manifest.json` defines PWA metadata with GitHub Pages base path
- `tools/injectPwaMeta.js` post-export script injects Apple meta tags into dist/index.html
- Deploy workflow runs inject script before SPA fallback copy
- All icon/manifest paths use `/CanonicalCaveAdventure/` base path for GitHub Pages

## Recent Changes

- Aligned YAML importer with canonical adventure.yaml structure
  - Scene descriptions now use structured format: { long, short, maptag? } matching YAML
  - Removed redundant descriptionWithoutItems field from types and output
  - Added sound, conditions fields to Scene type (preserved from YAML)
  - Added HintEntry type and HINTS export with all 10 canonical hints
  - Improved text normalisation: handles \r\n, multi-newline paragraphs, collapses spaces
  - All consumers (useGame.ts) updated to use description.long
  - generatedStory.ts regenerated with full schema alignment
- Added YouTube-chapters-style progress bar to header
  - 14-segment thin bar at top of title bar showing milestone progress
  - Milestones tracked monotonically in game state (never decrease)
  - Persisted via AsyncStorage alongside game saves
  - Pulse animation on newly completed segments
  - Milestones triggered by scene visits, item pickups, flag changes
  - ProgressChaptersBar component with accessibility support
  - progressMilestones.ts defines milestone IDs and trigger mappings
- Removed minimap feature entirely
  - Deleted Minimap, MinimapDropdown, MinimapDrawer components
  - Header is now a non-interactive location title indicator
  - No landscape sidebar or portrait dropdown
  - visitHistory still tracked in game state for potential future use
- Added automatic system dark/light mode
  - Follows OS prefers-color-scheme, updates live
  - Dynamic theme-color meta tag per theme
  - color-scheme set on document root for keyboard appearance
- Added PWA support for iOS Add to Home Screen
  - manifest.json with proper icons, start_url, standalone display
  - Apple-touch-icon and iOS web app meta tags
  - Post-export injection script for HTML head tags
  - Updated GitHub Actions workflow to run injection
- Upgraded command parser for forgiving natural language item interactions
  - Structured item/target/verb parsing in lexicon.ts (tryStructuredParse)
  - Supports "use X to Y Z", "Y Z with X", "use X on Z" patterns
  - Generalized routing in useGame.ts: inventory check -> useEffect -> action match
  - Works for ALL items generically, not hardcoded to specific items
- Added canon compatibility documentation (CANON_COMPATIBILITY.md)
- Enhanced natural language parser with magic word phrases
  - "say xyzzy", "cast plugh", "speak xyzzy" patterns supported
- Added uiHint field to Action schema for shortcut control
- Improved getShortcutActions filtering
  - Hides speak/message-only actions from pills
  - Filters TAKE pills for present items only
- Implemented canonical Open Adventure travel mechanics
  - Verb tokens for single-word movement commands
  - Conditional travel with requiresFlag filtering
  - Default travel for auto-continuation scenes
  - Speak actions for blocked paths
  - Magic words xyzzy/plugh inside building only
  - Grate puzzle with grateOpen flag
- Reverted to canonical Open Adventure start
  - Player starts at the brick building on the surface ("start" scene)
  - Removed custom ASCENT mode patches (chasm_base, rescue gate, etc.)
  - Win condition based on story actions with "escaped" flag only
  - Renamed from "Ascent" to "Descent" to "Canonical" across all UI
- Imported Open Adventure (Colossal Cave) content
  - 184 scenes and 28 items from adventure.yaml
  - Created import script at tools/importOpenAdventure.ts
  - Extended movement system for 12+ directions
- Header shows "Canonical / scene title" as non-interactive location indicator
  - Lamp indicator only appears after picking up lamp
  - Lamp indicator has info popover explaining fuel system
- Action pills in command panel
  - Hidden in collapsed state, fade in when expanded
  - Press state shows reversed/inverted colors
  - Gradient fade on right edge when scrolling
- Transformed command input into slide-up panel
  - Drag up to reveal Help and Restart Story options
- Added "go back" command to return to previous room
- Implemented autosave (replaces manual save/load)
- Added natural language command parsing
- Dynamic room descriptions that update when items are taken
- Initial MVP implementation with all 6 scenes
- Lamp fuel indicator with pulse animation when low
- Game over screen for escape success
