# Ascent - A Text Adventure Game

## Overview

Ascent is a mobile-first text adventure game where the player has fallen into a vertical mining chasm and must explore tunnels, manage their lamp light, and find a way to escape.

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
│   ├── LampIndicator.tsx     # Circular fuel gauge
│   ├── MessageBubble.tsx     # Narrative text bubbles
│   ├── Minimap.tsx           # Chronological journey display
│   ├── MinimapDropdown.tsx   # Slide-down minimap from top (portrait)
│   └── ...
├── data/
│   ├── story.ts              # All scenes, items, and game content
│   └── gameState.ts          # Game state types and AsyncStorage
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
- **Lamp fuel system**: Light decreases each turn; find fuel to survive
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

- Frontend runs on port 8081 (Expo)
- Backend runs on port 5000 (Express)
- Test in browser or scan QR code with Expo Go

## Recent Changes

- Implemented ASCENT mode (escape-the-cave gameplay)
  - Player starts deep in the cave and must escape to the surface
  - chasm_base connects to "reachdead" (deepest room, 27 steps from surface)
  - Surface exit at "Front of Building" with rescue gate requiring key
  - Critical items placed along 28-room escape path
  - Auto-detection of deep start room via BFS distance calculation
  - Dependency viability pass ensures items appear before needed
- Imported Open Adventure (Colossal Cave) content
  - 184 scenes and 28 items from adventure.yaml
  - Created import script at tools/importOpenAdventure.ts
  - Original Ascent story backed up to client/data/backup/
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
