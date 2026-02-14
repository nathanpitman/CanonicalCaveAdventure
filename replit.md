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
│   ├── GameHeader.tsx        # Header with lamp indicator + minimap button
│   ├── GameOverModal.tsx     # Win/lose screen
│   ├── HelpModal.tsx         # Help/commands reference
│   ├── BatteryIndicator.tsx  # Circular lamp life gauge (canon turn-based)
│   ├── MessageBubble.tsx     # Narrative text bubbles
│   ├── Minimap.tsx           # Chronological journey display
│   ├── MinimapDropdown.tsx   # Slide-down minimap from top (portrait)
│   └── ...
├── data/
│   ├── story.ts              # All scenes, items, and game content
│   ├── gameState.ts          # Game state types and AsyncStorage
│   ├── canonConstants.ts     # INITIAL_LAMP_LIMIT, WARN_TIME, BATTERY_LIFE_BONUS
│   └── lexicon.ts            # Additive natural language synonym mappings
├── hooks/
│   └── useGame.ts            # Main game logic hook
├── screens/
│   ├── GameScreen.tsx        # Main game screen
│   └── InventoryModal.tsx    # Inventory view
├── navigation/
│   └── RootStackNavigator.tsx
└── constants/
    └── theme.ts              # Dark cave theme colors

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
- **Chronological minimap**: Shows your journey through visited scenes
  - Portrait mode: Slide-out drawer accessible via map icon
  - Landscape mode: Permanent sidebar on the left
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

- **Theme**: Dark cave aesthetic with amber lamp glow
- **Primary color**: #FF9500 (amber)
- **Background**: #0A0A0A (near black)
- **Surface**: #1A1612 (dark brown-black)

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

## Recent Changes

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
- Updated header to show scene title with minimap access
  - Map icon + scene title + chevron on left (clickable)
  - Clicking header slides down minimap from top
  - Lamp indicator only appears after picking up lamp
  - Lamp indicator has info popover explaining fuel system
- Action pills in command panel
  - Hidden in collapsed state, fade in when expanded
  - Press state shows reversed/inverted colors
  - Gradient fade on right edge when scrolling
- Moved action shortcuts into slide-up command panel
  - Actions now appear as pill buttons with icons below the input
  - Icons chosen based on action type (eye for look, arrows for move, etc.)
- Transformed command input into slide-up panel
  - Drag up to reveal Help and Restart Story options
  - Removed hamburger menu in favor of this integrated UI
- Added chronological minimap showing visited scenes
  - Portrait: slide-down dropdown from top
  - Landscape: permanent sidebar on left
- Added "go back" command to return to previous room
- Implemented autosave (replaces manual save/load)
- Added natural language command parsing
- Dynamic room descriptions that update when items are taken
- Initial MVP implementation with all 6 scenes
- Lamp fuel indicator with pulse animation when low
- Game over screen for escape success
