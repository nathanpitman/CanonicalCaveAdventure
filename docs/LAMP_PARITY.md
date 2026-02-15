# Lamp Parity Checklist

## Reference Spec (from Open Adventure / adventure.yaml)

### Lamp Object
- **Synonyms**: lamp, lantern (YAML words: "lamp", "lante")
- **Initial location**: Building (LOC_BUILDING)
- **States**: LAMP_DARK (off), LAMP_BRIGHT (on)
- **State-change messages**: "Your lamp is now off." / "Your lamp is now on."

### Battery / Lamp Limit
- **Initial limit**: 330 turns (LAMP_LIMIT)
- **Warn time**: 30 turns remaining (WARNTIME)
- **Battery bonus**: 2500 turns (when fresh batteries are installed)
- Battery drains by 1 per turn-consuming action while lamp is ON
- Non-turn actions (help, inventory check, etc.) do NOT drain battery

### Darkness System
- Locations have conditions: `LIT` (always lit, 37 locations) or `DEEP` (dark without lamp, 144 locations)
- Locations without `LIT` and without `DEEP` are treated as lit (surface/outdoors)
- In a DEEP location without lamp ON: show PITCH_DARK message instead of room description
- PITCH_DARK: "It is now pitch dark. If you proceed you will likely fall into a pit."

### Movement in Darkness (Death Rule)
- If player is in a dark location (no lamp) and attempts to move, there is a 35% chance of falling into a pit and dying
- This uses the obituary/reincarnation system (up to 3 deaths)
- The darkness warning ("pitch dark... fall into a pit") serves as the warning

### Lamp Warning Messages (canonical, multi-stage)
1. **LAMP_DIM** (at WARNTIME=30 remaining, no batteries in inventory): "Your lamp is getting dim. You'd best start wrapping this up, unless you can find some fresh batteries. I seem to recall there's a vending machine in the maze. Bring some coins with you."
2. **GET_BATTERIES** (at WARNTIME=30 remaining, batteries exist but not in inventory): "Your lamp is getting dim. You'd best go back for those batteries."
3. **REPLACE_BATTERIES** (at WARNTIME=30 remaining, batteries in inventory): "Your lamp is getting dim. I'm taking the liberty of replacing the batteries." (auto-replaces)
4. **MISSING_BATTERIES** (at WARNTIME=30 remaining, batteries already used): "Your lamp is getting dim, and you're out of spare batteries. You'd best start wrapping this up."
5. **LAMP_OUT** (at 0 remaining): "Your lamp has run out of power." (lamp turns off automatically)

### Battery Replacement
- Fresh batteries appear at LOC_NOWHERE initially (spawned by vending machine interaction)
- Drop coins at vending machine (LOC_DEADEND13) → fresh batteries appear
- When lamp gets dim with batteries in inventory → auto-replacement occurs
- After replacement: old batteries become DEAD_BATTERIES, lamp gets +2500 turns
- Batteries can only be replaced once

### Lamp On/Off Commands
- "lamp on" / "light lamp" / "lantern on" → turns lamp on (if in inventory)
- "lamp off" / "extinguish lamp" / "lantern off" → turns lamp off
- Cannot turn on lamp if battery is dead (limit <= 0)

## Changes Made

### 1. Darkness System (NEW)
- Added `isLocationDark()` helper that checks scene conditions: DEEP locations are dark, LIT locations are always lit
- `getSceneDescription()` now returns PITCH_DARK message when location is dark and lamp is off
- Room descriptions suppressed in dark locations without active lamp

### 2. Lamp On/Off Toggle (NEW)
- Added command parsing for: "lamp on/off", "light lamp", "extinguish lamp", "torch on/off", "lantern on/off", "turn on/off lamp"
- Uses canonical messages: "Your lamp is now on." / "Your lamp is now off."
- Cannot turn on if batteries are dead
- Turning off in a dark location triggers PITCH_DARK warning

### 3. Movement-in-Darkness Death (NEW)
- When moving in a dark location (lamp off/dead), 35% chance of pit death
- Integrates with obituary/reincarnation system (triggerDeath)
- Death message: canonical pit death from adventure.yaml

### 4. Canonical Warning Messages (FIXED)
- Replaced generic "Your lamp is getting dim" with multi-stage canonical messages
- LAMP_DIM shown when no batteries known
- GET_BATTERIES shown when batteries exist but not carried
- REPLACE_BATTERIES shown when batteries in inventory (auto-replaces)
- MISSING_BATTERIES shown when batteries already used
- LAMP_OUT shown at depletion, lamp auto-turns off

### 5. Battery Replacement (NEW)
- batteryState tracks: "fresh" | "available" | "carried" | "used" | "dead"
- When lamp dims with batteries in inventory, auto-replacement occurs
- BATTERY_LIFE_BONUS (2500) added to lamp limit
- Old batteries become dead, cannot replace again

### 6. UI Lamp Indicator (UPDATED)
- BatteryIndicator shows ON/OFF state
- Lamp synonyms (torch, lantern) all mapped in parser

## How to Run Tests

Tests are validated via Playwright end-to-end testing:
```
# Run the app
npm run expo:dev

# Tests cover:
# 1. Battery drains only when lamp ON
# 2. Warnings fire at correct thresholds once
# 3. Dark room hides description when lamp OFF
# 4. Move in darkness after warning can cause death
# 5. Lamp depletion flips OFF and message appears
# 6. Lamp on/off commands work
```

## Known Gaps

1. **Vending machine interaction**: Drop-coins-for-batteries mechanic not fully implemented (requires DROP command and vending machine state tracking)
2. **Closing/endgame**: Lamp behaviour during cave closing not implemented (requires closing system)
3. **Dwarf interactions**: Lamp interactions with dwarf combat not implemented (requires dwarf system)
4. **Pirate interaction**: Pirate spotting by lamplight not implemented (requires pirate system)
