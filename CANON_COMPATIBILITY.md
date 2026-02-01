# Canon Compatibility - Open Adventure YAML

This document describes the compatibility between this implementation and the canonical Open Adventure (Colossal Cave Adventure) YAML definition.

## Supported YAML Features

### Locations

- **Long descriptions** (`description.long`): Fully supported as scene descriptions
- **Short descriptions** (`description.short`): Used for scene titles
- **Travel rules** (`travel`): Fully parsed and converted to actions

### Travel Rules

| Feature | Status | Notes |
|---------|--------|-------|
| `goto` actions | ✅ Full | Converted to move actions |
| `speak` actions | ✅ Full | Converted to message events with `uiHint: "hidden"` |
| Empty verb lists (default travel) | ✅ Full | Becomes `go_default` action for unknown commands |
| Verb tokens | ✅ Full | All verb tokens create corresponding move actions |
| `GRATE_CLOSED` condition | ✅ Full | Converted to `requiresFlag: "grateOpen"` |

### Objects

| Feature | Status | Notes |
|---------|--------|-------|
| Object locations | ✅ Full | Items placed in canonical starting locations |
| Object descriptions | ✅ Full | Used for item descriptions in scenes |
| Inventory names | ✅ Full | Used for display names |
| Immovable objects | ✅ Full | Skipped (not added as takeable items) |

### Messages

| Feature | Status | Notes |
|---------|--------|-------|
| Arbitrary messages | ✅ Full | Resolved from YAML `arbitrary_messages` |
| Speak action messages | ✅ Full | Displayed when blocked paths are attempted |

## Partially Supported Features

### Special Actions

Some locations have `special` travel actions which represent complex game logic:

| Location | Feature | Status |
|----------|---------|--------|
| LOC_Y2 | Special action | ⚠️ Not modeled |
| LOC_ALCOVE | Special action | ⚠️ Not modeled |
| LOC_PLOVER | Special action | ⚠️ Not modeled |
| LOC_SWCHASM | Special action | ⚠️ Not modeled |

These special actions typically involve complex state checks or probability-based outcomes. The game remains playable without them, but some advanced puzzle mechanics may not work exactly as in the original.

### Broken Links

Some scenes reference locations that don't exist or are special cases:

- `neckbroke` → `nowhere` (death scene)
- `nomake` → `nowhere` (death scene)
- `footslip` → `nowhere` (death scene)
- `gruesome` → `nowhere` (death scene)
- `westpit` → `building1` (likely a YAML error)

These don't affect normal gameplay as they represent terminal states.

## UI Layer Separation

This implementation separates:

1. **Canon action availability** (engine layer - `getAvailableActions()`)
   - All canonical actions are available for typed commands
   - Flag-based filtering (requiresFlag)
   - Item-based filtering (requiresItem)

2. **UI shortcut suggestions** (UX layer - `getShortcutActions()`)
   - Compass directions always shown
   - Magic words only shown if mentioned in scene text
   - Speak/message actions hidden from pills
   - TAKE actions only shown for present, untaken items

### Shortcut Filtering Rules

**Movement pills:**
- Always show: `go_north/south/east/west/ne/nw/se/sw/up/down/in/out`
- Other move actions: Only if verb appears in visible scene text

**Take pills:**
- Only shown if item is in scene's `items` array AND not in inventory

**Hidden from pills:**
- Actions with `uiHint: "hidden"`
- Actions with `message` property (speak/blocking messages)

## Natural Language Parser

The parser supports:

| Pattern | Example | Behavior |
|---------|---------|----------|
| Single token | `xyzzy` | Executes go_xyzzy if available |
| Magic word phrases | `say xyzzy`, `cast plugh` | Extracts and executes magic word |
| Direction phrases | `go north`, `head east` | Standard navigation |
| Natural take | `pick up lamp`, `grab keys` | Take item if present |
| Use item | `use keys` | Triggers item effect |

## Key Canonical Behaviors

### Grate Puzzle
1. Player starts outside building at `start` scene
2. Keys are inside the building
3. Grate at `grate` scene blocks entry to cave
4. Using keys sets `grateOpen` flag
5. With flag set, `enter` moves to `belowgrate`

### Magic Words
- `xyzzy` only works inside building → transports to debris via foof1
- `plugh` only works inside building → transports to y2 via foof3
- Both words are NOT shown as pills in building (text doesn't mention them)
- In debris room (text contains "MAGIC WORD XYZZY"), xyzzy pill appears

### Default Travel
- `foof1` (xyzzy transition) → auto-continues to `debris`
- `foof3` (plugh transition) → auto-continues to `y2`
- Unknown commands in these rooms trigger the default travel

## Validation Results

- **Scene count**: 183
- **Item count**: 25
- **Start scene**: `start` (Front Of Building)
- **Broken links**: 5 (all death scenes → nowhere)
- **Unmodeled special actions**: 6

## Future Improvements

To achieve 100% canon compatibility:

1. Model `special` actions with their probability/state logic
2. Implement dwarf/pirate encounter mechanics
3. Add lamp timer with proper oil refill mechanics
4. Implement treasure scoring system
5. Add more complex object interactions (wave rod, etc.)
