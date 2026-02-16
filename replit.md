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
- **Natural Language Processing (NLP):** A dedicated NLP layer (`commandParser.ts`, `actionResolver.ts`) handles user input, transforming raw strings into game actions, supporting complex phrases and typo tolerance (Damerau-Levenshtein distance).
- **Game Content Management:** All scenes, items, and game content are structured in `data/story.ts`, imported from a canonical adventure YAML file.
- **Persistent State:** Game progress is automatically saved locally using AsyncStorage after every state change.
- **Modular Component Design:** UI elements are broken down into reusable components (e.g., `ActionButton`, `MessageBubble`, `TorchIndicator`).
- **PWA Support:** Configured for Progressive Web App (PWA) capabilities, including manifest, icons, and Apple meta tags for "Add to Home Screen" on iOS.

**Feature Specifications:**
- **Core Gameplay Loop:** Players explore 180+ scenes, managing a turn-based lamp system (330 turns, extendable with batteries), collecting treasures, and interacting with the environment through commands.
- **Dynamic Environment:** Room descriptions update based on taken items, and the lamp indicator dynamically appears and explains the fuel system.
- **Canonical Game Mechanics:** Implements Open Adventure's full travel system, including verb tokens, conditional travel (`requiresFlag`), default travel (`go_default`), speak actions for blocked paths, magic words (xyzzy/plugh), and the grate puzzle.
- **Inventory System:** Supports picking up, dropping, and using items, with a carry limit and special item behaviors (e.g., vase fragility).
- **Death & Reincarnation:** Features a canonical obituary system with limited reincarnations before permanent game over.
- **Hint System:** Includes a canonical hint system with gating rules and score penalties for usage.
- **Score Tracking:** Calculates score based on treasure deposited, survival, and exploration, with a 10-tier rating system.
- **Command Set:** Supports a wide range of commands such as `look`, `inventory`, `take`, `use`, `go`, `go back`, `drop`, `score`, `brief`, `wait`, `attack`, `throw`, `feed`, `wave`.

## External Dependencies

- **React Native:** Frontend framework.
- **Expo:** Development platform and build tool for React Native.
- **Express.js:** Web application framework for the development backend.
- **AsyncStorage:** Local persistent storage for game saves on the client.
- **GitHub Pages:** Static site hosting for the client-side game, deployed via GitHub Actions.
- **Open Adventure (Colossal Cave Adventure) Content:** The game's narrative, scenes, and items are imported from the canonical `adventure.yaml` structure.