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

### Location Sounds

| Feature | Status | Notes |
|---------|--------|-------|
| `sound` property | ✅ Full | All 11 sound labels mapped to text descriptions in `SOUND_MESSAGES`; LISTEN command displays the ambient sound for the current location, falls back to "All is silent." for scenes without a sound |
| `loud` property | ⚠️ Data only | Imported and stored on scenes (`loud: true` on `breathtaking` and `resbottom`) but not yet consumed by the LISTEN handler — see Outstanding Gaps below |

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

## Special Actions

All canonical `special` travel actions have been implemented:

| Location | Feature | Status | Notes |
|----------|---------|--------|-------|
| LOC_Y2 | Hollow voice | ✅ Full | Probability-based "A hollow voice says 'PLUGH'" via LCG (25% chance on entry) |
| LOC_ALCOVE | Tight passage | ✅ Full | Blocks passage if carrying items other than the emerald |
| LOC_PLOVER | Plover transport | ✅ Full | SAY PLOVER teleports between y2 and plover; emerald drops on transport |
| LOC_SWCHASM | Troll bridge | ✅ Full | Troll blocks crossing; pay with treasure or throw bear to remove |

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
- **Unmodeled special actions**: 0

## Implemented Canon Features

The following major systems have been fully implemented:

| Feature | Status | Notes |
|---------|--------|-------|
| Special actions (Y2, Alcove, Plover, SW Chasm) | ✅ Full | See Special Actions table above |
| Dwarf/pirate encounters | ✅ Full | Dwarf movement AI, knife throwing with progressive accuracy, axe combat, pirate treasure theft to maze chest |
| Lamp timer and refill | ✅ Full | 330-turn limit, multi-stage warnings, battery replacement (+2500 turns), oil bottle/urn/door mechanics |
| Treasure scoring | ✅ Full | `calculateScore` with deposit bonuses, exploration/survival/completion/endgame points, hint and turn penalties, scoring classes |
| Wave rod / crystal bridge | ✅ Full | Toggles bridge at fissure; endgame mirror shatter; rod/bird interaction |
| Dragon encounter | ✅ Full | "With what? Your bare hands?" prompt; confirmation kills dragon, reveals rug |
| Cave closing / endgame | ✅ Full | clock1/clock2 timers, property reset, transport to NE/SW repository, blast command with victory/defeat outcomes |
| Bear and chain | ✅ Full | Feed bear to tame, unlock chain with keys, throw bear at troll |
| Plant watering | ✅ Full | Three-stage growth cycle (tiny → 12-foot beanstalk → gigantic → shriveled) |
| Vending machine | ✅ Full | Drop coins at deadend13 to receive fresh batteries |
| Troll bridge | ✅ Full | Pay with treasure or throw bear; feeding troll returns avarice quip |
| Clam and oyster | ✅ Full | Open clam with trident to reveal pearl; clam transforms to oyster |
| Bird and snake | ✅ Full | Drop bird in kinghall to chase snake away; rod prevents bird capture |
| Location sounds / LISTEN | ⚠️ Partial | LISTEN command displays ambient sound text from `SOUND_MESSAGES`; `loud` property not yet consumed (see Outstanding Gaps) |

## Outstanding Gaps

### `loud` property on location sounds
In the original Open Adventure, locations with `loud: true` suppress object-specific sounds. For example, the bird's singing would be drowned out at the volcano view or reservoir bottom because the location's roar is overwhelming. Currently:
- The `loud` boolean is imported from the YAML and stored on the `Scene` interface in `generatedStory.ts`
- Two scenes have `loud: true`: `breathtaking` (Breath-taking View, volcano) and `resbottom` (Bottom Of Reservoir)
- The LISTEN handler in `useGame.ts` does not check `loud` — it always displays only the location sound regardless
- To reach full parity, the handler should suppress any object-based sound descriptions (e.g., bird singing) when `scene.loud` is true, and allow them to be heard alongside the location sound when `loud` is false or absent
