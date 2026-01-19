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
│   ├── CommandInput.tsx      # Text command input
│   ├── GameHeader.tsx        # Header with lamp indicator
│   ├── GameMenu.tsx          # Slide-out menu
│   ├── GameOverModal.tsx     # Win/lose screen
│   ├── HelpModal.tsx         # Help/commands reference
│   ├── LampIndicator.tsx     # Circular fuel gauge
│   ├── MessageBubble.tsx     # Narrative text bubbles
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
- **Text command input**: Type commands like "look", "take lamp", "go east"
- **Lamp fuel system**: Light decreases each turn; find fuel to survive
- **Save/Load**: Progress saved to device storage
- **6 explorable scenes**: From chasm base to exit slope

## Commands

- `look` - Examine surroundings
- `inventory` / `inv` - Check items
- `take <item>` - Pick up an item
- `use <item>` - Use an item
- `go <direction>` - Move (north/south/east/west)
- `save` / `load` / `new` - Game management
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

- Initial MVP implementation with all 6 scenes
- Lamp fuel indicator with pulse animation when low
- Save/Load functionality with AsyncStorage
- Game over screen for escape success
