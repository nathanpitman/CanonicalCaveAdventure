# Narrative Exit Audit Report

Generated: 2026-02-21T16:18:59.628Z

Total gaps found: **221**

## Gaps

### Hill In Road (`hill`)

**Available exits:**
- `go_building` (GO TO BUILDING) -> `start`
- `go_east` (GO EAST) -> `start`
- `go_west` (GO WEST) -> `roadend`
- `go_north` (GO NORTH) -> `forest20`
- `go_south` (GO SOUTH) -> `forest13`
- `go_forest` (FOREST) -> `forest13`

**Cue phrase:** "road"

| Implied Input | Resolves? |
|---|---|
| `road` | **NO** |
| `go road` | **NO** |
| `follow road` | **NO** |
| `path` | **NO** |
| `trail` | **NO** |
| `follow path` | **NO** |

---

### Building (`building`)

**Available exits:**
- `go_out` (GO OUT) -> `start`
- `go_west` (GO WEST) -> `start`
- `go_xyzzy` (XYZZY) -> `foof1`
- `go_plugh` (PLUGH) -> `foof3`
- `go_downs` (Downs) -> `sewer`
- `go_stream` (STREAM) -> `sewer`

**Cue phrase:** "building"

| Implied Input | Resolves? |
|---|---|
| `building` | **NO** |
| `go building` | **NO** |
| `enter building` | **NO** |
| `house` | **NO** |
| `wellhouse` | **NO** |

---

### Valley (`valley`)

**Available exits:**
- `go_upstr` (Upstr) -> `start`
- `go_building` (GO TO BUILDING) -> `start`
- `go_north` (GO NORTH) -> `start`
- `go_east` (GO EAST) -> `forest6`
- `go_forest` (FOREST) -> `forest6`
- `go_west` (GO WEST) -> `forest12`
- `go_downs` (Downs) -> `slit`
- `go_south` (GO SOUTH) -> `slit`
- `go_down` (GO DOWN) -> `slit`
- `go_depression` (DEPRESSION) -> `grate`

**Cue phrase:** "stream"

| Implied Input | Resolves? |
|---|---|
| `stream` | **NO** |
| `go stream` | **NO** |
| `follow stream` | YES |

---

### Cliff (`cliff`)

**Available exits:**
- `go_south` (GO SOUTH) -> `forest17`
- `go_forest` (FOREST) -> `forest17`
- `go_east` (GO EAST) -> `forest19`
- `go_jump` (JUMP) -> `nomake`

**Cue phrase:** "chasm"

| Implied Input | Resolves? |
|---|---|
| `pit` | **NO** |
| `go pit` | **NO** |
| `enter pit` | **NO** |
| `chasm` | **NO** |
| `abyss` | **NO** |

**Cue phrase:** "across"

| Implied Input | Resolves? |
|---|---|
| `across` | **NO** |
| `go across` | **NO** |

---

### Slit In Streambed (`slit`)

**Available exits:**
- `go_building` (GO TO BUILDING) -> `start`
- `go_upstr` (Upstr) -> `valley`
- `go_north` (GO NORTH) -> `valley`
- `go_east` (GO EAST) -> `forest6`
- `go_forest` (FOREST) -> `forest6`
- `go_west` (GO WEST) -> `forest10`
- `go_downs` (Downs) -> `grate`
- `go_bed` (Bed) -> `grate`
- `go_south` (GO SOUTH) -> `grate`
- `go_depression` (DEPRESSION) -> `grate`

**Cue phrase:** "the stream"

| Implied Input | Resolves? |
|---|---|
| `follow the stream` | YES |
| `follow stream` | YES |
| `go stream` | **NO** |

**Cue phrase:** "stream"

| Implied Input | Resolves? |
|---|---|
| `stream` | **NO** |
| `go stream` | **NO** |
| `follow stream` | YES |

---

### Grate (`grate`)

**Available exits:**
- `go_east` (GO EAST) -> `forest7`
- `go_forest` (FOREST) -> `forest7`
- `go_south` (GO SOUTH) -> `forest10`
- `go_west` (GO WEST) -> `forest9`
- `go_building` (GO TO BUILDING) -> `start`
- `go_upstr` (Upstr) -> `slit`
- `go_gully` (GULLY) -> `slit`
- `go_north` (GO NORTH) -> `slit`
- `go_in` (GO IN) -> `belowgrate`
- `go_down` (GO DOWN) -> `belowgrate`

**Cue phrase:** "streambed"

| Implied Input | Resolves? |
|---|---|
| `streambed` | **NO** |
| `go streambed` | **NO** |
| `follow streambed` | **NO** |

**Cue phrase:** "depression"

| Implied Input | Resolves? |
|---|---|
| `depression` | **NO** |
| `go depression` | **NO** |
| `enter depression` | YES |

**Cue phrase:** "outside"

| Implied Input | Resolves? |
|---|---|
| `surface` | **NO** |
| `go surface` | **NO** |
| `go outside` | **NO** |
| `go up` | YES |
| `above` | **NO** |
| `topside` | **NO** |

---

### Below The Grate (`belowgrate`)

**Available exits:**
- `go_up` (GO UP) -> `grate`
- `go_crawl` (CRAWL) -> `cobble`
- `go_cobbles` (COBBLES) -> `cobble`
- `go_in` (GO IN) -> `cobble`
- `go_west` (GO WEST) -> `cobble`
- `go_pit` (PIT) -> `pittop`
- `go_debris` (DEBRIS) -> `debris`

**Cue phrase:** "surface"

| Implied Input | Resolves? |
|---|---|
| `surface` | **NO** |
| `go surface` | **NO** |
| `go outside` | **NO** |
| `go up` | YES |
| `above` | **NO** |
| `topside` | **NO** |

**Cue phrase:** "over"

| Implied Input | Resolves? |
|---|---|
| `over` | **NO** |
| `go over` | **NO** |
| `climb over` | **NO** |

**Cue phrase:** "chamber"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | YES |
| `chamber` | **NO** |

---

### Cobble Crawl (`cobble`)

**Available exits:**
- `go_out` (GO OUT) -> `belowgrate`
- `go_surface` (SURFACE) -> `belowgrate`
- `go_east` (GO EAST) -> `belowgrate`
- `go_in` (GO IN) -> `debris`
- `go_dark` (DARK) -> `debris`
- `go_west` (GO WEST) -> `debris`
- `go_debris` (DEBRIS) -> `debris`
- `go_pit` (PIT) -> `pittop`

**Cue phrase:** "passage"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | YES |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

**Cue phrase:** "crawl"

| Implied Input | Resolves? |
|---|---|
| `crawl` | **NO** |
| `go crawl` | **NO** |
| `crawlway` | **NO** |
| `crawlspace` | **NO** |

**Cue phrase:** "cobbles"

| Implied Input | Resolves? |
|---|---|
| `cobbles` | **NO** |
| `go cobbles` | **NO** |
| `cobblestones` | **NO** |

**Cue phrase:** "over"

| Implied Input | Resolves? |
|---|---|
| `over` | **NO** |
| `go over` | **NO** |
| `climb over` | **NO** |

---

### Debris Room (`debris`)

**Available exits:**
- `go_depression` (DEPRESSION) -> `grate`
- `go_entra` (Entra) -> `belowgrate`
- `go_crawl` (CRAWL) -> `cobble`
- `go_cobbles` (COBBLES) -> `cobble`
- `go_passage` (PASSAGE) -> `cobble`
- `go_low` (LOW) -> `cobble`
- `go_east` (GO EAST) -> `cobble`
- `go_canyon` (CANYON) -> `awkward`
- `go_in` (GO IN) -> `awkward`
- `go_up` (GO UP) -> `awkward`
- `go_west` (GO WEST) -> `awkward`
- `go_xyzzy` (XYZZY) -> `foof2`
- `go_pit` (PIT) -> `pittop`

**Cue phrase:** "surface"

| Implied Input | Resolves? |
|---|---|
| `surface` | **NO** |
| `go surface` | **NO** |
| `go outside` | **NO** |
| `go up` | YES |
| `above` | **NO** |
| `topside` | **NO** |

**Cue phrase:** "debris"

| Implied Input | Resolves? |
|---|---|
| `debris` | **NO** |
| `go debris` | **NO** |
| `enter debris` | YES |

**Cue phrase:** "room"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | YES |
| `chamber` | **NO** |

---

### Awkward (`awkward`)

**Available exits:**
- `go_depression` (DEPRESSION) -> `grate`
- `go_entra` (Entra) -> `belowgrate`
- `go_down` (GO DOWN) -> `debris`
- `go_east` (GO EAST) -> `debris`
- `go_debris` (DEBRIS) -> `debris`
- `go_in` (GO IN) -> `birdchamber`
- `go_up` (GO UP) -> `birdchamber`
- `go_west` (GO WEST) -> `birdchamber`
- `go_pit` (PIT) -> `pittop`

**Cue phrase:** "canyon"

| Implied Input | Resolves? |
|---|---|
| `canyon` | **NO** |
| `go canyon` | **NO** |
| `enter canyon` | YES |
| `gorge` | **NO** |

---

### Bird Chamber (`birdchamber`)

**Available exits:**
- `go_depression` (DEPRESSION) -> `grate`
- `go_entra` (Entra) -> `belowgrate`
- `go_debris` (DEBRIS) -> `debris`
- `go_canyon` (CANYON) -> `awkward`
- `go_east` (GO EAST) -> `awkward`
- `go_passage` (PASSAGE) -> `pittop`
- `go_pit` (PIT) -> `pittop`
- `go_west` (GO WEST) -> `pittop`

**Cue phrase:** "chamber"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### Top Of Small Pit (`pittop`)

**Available exits:**
- `go_depression` (DEPRESSION) -> `grate`
- `go_entra` (Entra) -> `belowgrate`
- `go_debris` (DEBRIS) -> `debris`
- `go_passage` (PASSAGE) -> `birdchamber`
- `go_east` (GO EAST) -> `birdchamber`
- `go_down` (GO DOWN) -> `misthall`
- `go_crack` (CRACK) -> `crack`
- `go_west` (GO WEST) -> `crack`

**Cue phrase:** "pit"

| Implied Input | Resolves? |
|---|---|
| `pit` | **NO** |
| `go pit` | **NO** |
| `enter pit` | **NO** |
| `chasm` | **NO** |
| `abyss` | **NO** |

---

### Hall Of Mists (`misthall`)

**Available exits:**
- `go_left` (LEFT) -> `nugget`
- `go_south` (GO SOUTH) -> `nugget`
- `go_forward` (FORWARD) -> `eastbank`
- `go_hall` (HALL) -> `eastbank`
- `go_west` (GO WEST) -> `eastbank`
- `go_stairs` (STAIRS) -> `kinghall`
- `go_down` (GO DOWN) -> `kinghall`
- `go_north` (GO NORTH) -> `kinghall`
- `go_up` (GO UP) -> `pittop`
- `go_y2` (Y2) -> `jumble`

**Cue phrase:** "passage"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

**Cue phrase:** "staircase"

| Implied Input | Resolves? |
|---|---|
| `stairs` | YES |
| `go stairs` | YES |
| `stairway` | YES |
| `staircase` | YES |
| `climb stairs` | YES |
| `go steps` | **NO** |

---

### Crack (`crack`)

**Available exits:**
- `go_default` (CONTINUE) -> `pittop`

**Cue phrase:** "crack"

| Implied Input | Resolves? |
|---|---|
| `crack` | **NO** |
| `go crack` | **NO** |
| `enter crack` | **NO** |
| `crevice` | **NO** |
| `fissure` | **NO** |

---

### East Bank Of Fissure (`eastbank`)

**Available exits:**
- `go_hall` (HALL) -> `misthall`
- `go_east` (GO EAST) -> `misthall`
- `go_over` (Over) -> `westbank`

**Cue phrase:** "fissure"

| Implied Input | Resolves? |
|---|---|
| `crack` | **NO** |
| `go crack` | **NO** |
| `enter crack` | **NO** |
| `crevice` | **NO** |
| `fissure` | **NO** |

**Cue phrase:** "across"

| Implied Input | Resolves? |
|---|---|
| `across` | **NO** |
| `go across` | **NO** |

---

### Nugget-of-gold Room (`nugget`)

**Available exits:**
- `go_hall` (HALL) -> `misthall`
- `go_out` (GO OUT) -> `misthall`
- `go_north` (GO NORTH) -> `misthall`

**Cue phrase:** "steps"

| Implied Input | Resolves? |
|---|---|
| `stairs` | **NO** |
| `go stairs` | **NO** |
| `stairway` | **NO** |
| `staircase` | **NO** |
| `climb stairs` | **NO** |
| `go steps` | **NO** |

**Cue phrase:** "wall"

| Implied Input | Resolves? |
|---|---|
| `wall` | YES |
| `go wall` | YES |
| `climb wall` | YES |
| `over wall` | **NO** |

**Cue phrase:** "room"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### Hall Of Mt King (`kinghall`)

**Available exits:**
- `go_stairs` (STAIRS) -> `misthall`
- `go_up` (GO UP) -> `misthall`
- `go_east` (GO EAST) -> `misthall`
- `go_north` (GO NORTH) -> `snakeblock`
- `go_secre` (Secre) -> `secret3`

**Cue phrase:** "Hall"

| Implied Input | Resolves? |
|---|---|
| `hall` | **NO** |
| `go hall` | **NO** |
| `enter hall` | **NO** |

---

### Neckbroke (`neckbroke`)

**Available exits:**
- `go_default` (CONTINUE) -> `nowhere`

**Cue phrase:** "pit"

| Implied Input | Resolves? |
|---|---|
| `pit` | **NO** |
| `go pit` | **NO** |
| `enter pit` | **NO** |
| `chasm` | **NO** |
| `abyss` | **NO** |

**Cue phrase:** "broken"

| Implied Input | Resolves? |
|---|---|
| `broken` | **NO** |
| `go broken` | **NO** |

---

### Dome (`dome`)

**Available exits:**
- `go_default` (CONTINUE) -> `misthall`

**Cue phrase:** "dome"

| Implied Input | Resolves? |
|---|---|
| `dome` | **NO** |
| `go dome` | **NO** |
| `enter dome` | **NO** |
| `climb dome` | **NO** |

---

### West End Of Twopit Room (`westend`)

**Available exits:**
- `go_east` (GO EAST) -> `eastend`
- `go_acros` (Acros) -> `eastend`
- `go_west` (GO WEST) -> `slab`
- `go_slab` (SLAB) -> `slab`
- `go_down` (GO DOWN) -> `westpit`
- `go_pit` (PIT) -> `westpit`

**Cue phrase:** "hole"

| Implied Input | Resolves? |
|---|---|
| `hole` | **NO** |
| `go hole` | **NO** |
| `enter hole` | **NO** |
| `opening` | **NO** |

**Cue phrase:** "wall"

| Implied Input | Resolves? |
|---|---|
| `wall` | **NO** |
| `go wall` | **NO** |
| `climb wall` | **NO** |
| `over wall` | **NO** |

**Cue phrase:** "Room"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### East Pit (`eastpit`)

**Available exits:**
- `go_up` (GO UP) -> `eastend`
- `go_out` (GO OUT) -> `eastend`

**Cue phrase:** "pit"

| Implied Input | Resolves? |
|---|---|
| `pit` | YES |
| `go pit` | YES |
| `enter pit` | YES |
| `chasm` | **NO** |
| `abyss` | **NO** |

**Cue phrase:** "Room"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### West Pit (`westpit`)

**Available exits:**
- `go_up` (GO UP) -> `westend`
- `go_out` (GO OUT) -> `westend`
- `go_climb` (CLIMB) -> `climbstalk`

**Cue phrase:** "pit"

| Implied Input | Resolves? |
|---|---|
| `pit` | YES |
| `go pit` | YES |
| `enter pit` | YES |
| `chasm` | **NO** |
| `abyss` | **NO** |

**Cue phrase:** "hole"

| Implied Input | Resolves? |
|---|---|
| `hole` | **NO** |
| `go hole` | **NO** |
| `enter hole` | **NO** |
| `opening` | **NO** |

**Cue phrase:** "wall"

| Implied Input | Resolves? |
|---|---|
| `wall` | **NO** |
| `go wall` | **NO** |
| `climb wall` | YES |
| `over wall` | **NO** |

**Cue phrase:** "Room"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### Climbstalk (`climbstalk`)

**Available exits:**
- `go_default` (CONTINUE) -> `narrow`

**Cue phrase:** "hole"

| Implied Input | Resolves? |
|---|---|
| `hole` | **NO** |
| `go hole` | **NO** |
| `enter hole` | **NO** |
| `opening` | **NO** |

---

### West Bank Of Fissure (`westbank`)

**Available exits:**
- `go_over` (Over) -> `eastbank`
- `go_north` (GO NORTH) -> `parallel1`
- `go_west` (GO WEST) -> `mistwest`

**Cue phrase:** "fissure"

| Implied Input | Resolves? |
|---|---|
| `crack` | **NO** |
| `go crack` | **NO** |
| `enter crack` | **NO** |
| `crevice` | **NO** |
| `fissure` | **NO** |

**Cue phrase:** "Hall"

| Implied Input | Resolves? |
|---|---|
| `hall` | **NO** |
| `go hall` | **NO** |
| `enter hall` | **NO** |

---

### N/s Passage Above E/w Passage (`floorhole`)

**Available exits:**
- `go_hall` (HALL) -> `kinghall`
- `go_out` (GO OUT) -> `kinghall`
- `go_south` (GO SOUTH) -> `kinghall`
- `go_north` (GO NORTH) -> `y2`
- `go_y2` (Y2) -> `y2`
- `go_down` (GO DOWN) -> `broken`
- `go_hole` (HOLE) -> `broken`

**Cue phrase:** "passage"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

---

### Southside (`southside`)

**Available exits:**
- `go_hall` (HALL) -> `kinghall`
- `go_out` (GO OUT) -> `kinghall`
- `go_north` (GO NORTH) -> `kinghall`

**Cue phrase:** "chamber"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### The West Side Chamber (`westside`)

**Available exits:**
- `go_hall` (HALL) -> `kinghall`
- `go_out` (GO OUT) -> `kinghall`
- `go_east` (GO EAST) -> `kinghall`
- `go_west` (GO WEST) -> `crossover`
- `go_up` (GO UP) -> `crossover`

**Cue phrase:** "passage continues west"

| Implied Input | Resolves? |
|---|---|
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passage` | **NO** |
| `go tunnel` | **NO** |
| `enter tunnel` | **NO** |
| `go west` | YES |
| `west` | YES |

**Cue phrase:** "passage"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

**Cue phrase:** "chamber"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### "y2" (`y2`)

**Available exits:**
- `go_plugh` (PLUGH) -> `foof4`
- `go_south` (GO SOUTH) -> `floorhole`
- `go_east` (GO EAST) -> `jumble`
- `go_wall` (WALL) -> `jumble`
- `go_broke` (Broke) -> `jumble`
- `go_west` (GO WEST) -> `window1`
- `go_plover` (PLOVER) -> `foof5`

**Cue phrase:** "passage"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

**Cue phrase:** "wall"

| Implied Input | Resolves? |
|---|---|
| `wall` | YES |
| `go wall` | YES |
| `climb wall` | YES |
| `over wall` | **NO** |

**Suggested mapping:** "over wall" -> go_wall (WALL) -> jumble

**Cue phrase:** "room"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### Window On Pit (`window1`)

**Available exits:**
- `go_east` (GO EAST) -> `y2`
- `go_y2` (Y2) -> `y2`
- `go_jump` (JUMP) -> `neckbroke`

**Cue phrase:** "pit"

| Implied Input | Resolves? |
|---|---|
| `pit` | **NO** |
| `go pit` | **NO** |
| `enter pit` | **NO** |
| `chasm` | **NO** |
| `abyss` | **NO** |

**Cue phrase:** "across"

| Implied Input | Resolves? |
|---|---|
| `across` | **NO** |
| `go across` | **NO** |

**Cue phrase:** "right"

| Implied Input | Resolves? |
|---|---|
| `right` | **NO** |
| `go right` | **NO** |

**Cue phrase:** "over"

| Implied Input | Resolves? |
|---|---|
| `over` | **NO** |
| `go over` | **NO** |
| `climb over` | **NO** |

**Cue phrase:** "room"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### Dirty Passage (`broken`)

**Available exits:**
- `go_east` (GO EAST) -> `smallpitbrink`
- `go_crawl` (CRAWL) -> `smallpitbrink`
- `go_up` (GO UP) -> `floorhole`
- `go_hole` (HOLE) -> `floorhole`
- `go_west` (GO WEST) -> `dusty`
- `go_bedquilt` (BEDQUILT) -> `bedquilt`

**Cue phrase:** "passage"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

**Cue phrase:** "broken"

| Implied Input | Resolves? |
|---|---|
| `broken` | **NO** |
| `go broken` | **NO** |

---

### Bottom Of Pit With Stream (`smallpit`)

**Available exits:**
- `go_climb` (CLIMB) -> `smallpitbrink`
- `go_up` (GO UP) -> `smallpitbrink`
- `go_out` (GO OUT) -> `smallpitbrink`

**Cue phrase:** "pit"

| Implied Input | Resolves? |
|---|---|
| `pit` | YES |
| `go pit` | YES |
| `enter pit` | YES |
| `chasm` | **NO** |
| `abyss` | **NO** |

**Cue phrase:** "stream"

| Implied Input | Resolves? |
|---|---|
| `stream` | **NO** |
| `go stream` | **NO** |
| `follow stream` | **NO** |

---

### Dusty Rock Room (`dusty`)

**Available exits:**
- `go_east` (GO EAST) -> `broken`
- `go_passage` (PASSAGE) -> `broken`
- `go_down` (GO DOWN) -> `complex`
- `go_hole` (HOLE) -> `complex`
- `go_floor` (FLOOR) -> `complex`
- `go_bedquilt` (BEDQUILT) -> `bedquilt`

**Cue phrase:** "room"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### Parallel1 (`parallel1`)

**Available exits:**
- `go_default` (CONTINUE) -> `mistwest`

**Cue phrase:** "passage"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

**Cue phrase:** "Hall"

| Implied Input | Resolves? |
|---|---|
| `hall` | **NO** |
| `go hall` | **NO** |
| `enter hall` | **NO** |

---

### West End Of Hall Of Mists (`mistwest`)

**Available exits:**
- `go_south` (GO SOUTH) -> `alike1`
- `go_up` (GO UP) -> `alike1`
- `go_passage` (PASSAGE) -> `alike1`
- `go_climb` (CLIMB) -> `alike1`
- `go_east` (GO EAST) -> `westbank`
- `go_north` (GO NORTH) -> `parallel2`
- `go_west` (GO WEST) -> `longeast`
- `go_crawl` (CRAWL) -> `longeast`

**Cue phrase:** "Hall"

| Implied Input | Resolves? |
|---|---|
| `hall` | **NO** |
| `go hall` | **NO** |
| `enter hall` | **NO** |

---

### Brink Of Pit (`pitbrink`)

**Available exits:**
- `go_down` (GO DOWN) -> `birdchamber`
- `go_climb` (CLIMB) -> `birdchamber`
- `go_west` (GO WEST) -> `alike10`
- `go_south` (GO SOUTH) -> `mazeend6`
- `go_north` (GO NORTH) -> `alike12`
- `go_east` (GO EAST) -> `alike13`

**Cue phrase:** "pit"

| Implied Input | Resolves? |
|---|---|
| `pit` | **NO** |
| `go pit` | **NO** |
| `enter pit` | **NO** |
| `chasm` | **NO** |
| `abyss` | **NO** |

**Cue phrase:** "climb"

| Implied Input | Resolves? |
|---|---|
| `climb` | YES |
| `go up` | **NO** |
| `ascend` | **NO** |
| `climb up` | YES |

**Cue phrase:** "wall"

| Implied Input | Resolves? |
|---|---|
| `wall` | **NO** |
| `go wall` | **NO** |
| `climb wall` | YES |
| `over wall` | **NO** |

---

### Parallel2 (`parallel2`)

**Available exits:**
- `go_default` (CONTINUE) -> `westbank`

**Cue phrase:** "passage"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

**Cue phrase:** "Hall"

| Implied Input | Resolves? |
|---|---|
| `hall` | **NO** |
| `go hall` | **NO** |
| `enter hall` | **NO** |

---

### West End Of Long Hall (`longwest`)

**Available exits:**
- `go_east` (GO EAST) -> `longeast`
- `go_north` (GO NORTH) -> `crossover`

**Cue phrase:** "passage"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

**Cue phrase:** "hall"

| Implied Input | Resolves? |
|---|---|
| `hall` | **NO** |
| `go hall` | **NO** |
| `enter hall` | **NO** |

---

### Crossover (`crossover`)

**Available exits:**
- `go_west` (GO WEST) -> `longeast`
- `go_north` (GO NORTH) -> `deadend7`
- `go_east` (GO EAST) -> `westside`
- `go_south` (GO SOUTH) -> `longwest`

**Cue phrase:** "passage"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

---

### Complex Junction (`complex`)

**Available exits:**
- `go_up` (GO UP) -> `dusty`
- `go_climb` (CLIMB) -> `dusty`
- `go_room` (ROOM) -> `dusty`
- `go_west` (GO WEST) -> `bedquilt`
- `go_bedquilt` (BEDQUILT) -> `bedquilt`
- `go_north` (GO NORTH) -> `shellroom`
- `go_shell` (SHELL) -> `shellroom`
- `go_east` (GO EAST) -> `anteroom`

**Cue phrase:** "passage"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

**Cue phrase:** "crawl"

| Implied Input | Resolves? |
|---|---|
| `crawl` | **NO** |
| `go crawl` | **NO** |
| `crawlway` | **NO** |
| `crawlspace` | **NO** |

**Cue phrase:** "junction"

| Implied Input | Resolves? |
|---|---|
| `fork` | **NO** |
| `go fork` | **NO** |
| `junction` | **NO** |
| `intersection` | **NO** |

---

### Bedquilt (`bedquilt`)

**Available exits:**
- `go_east` (GO EAST) -> `complex`
- `go_west` (GO WEST) -> `swisscheese`
- `go_slab` (SLAB) -> `slab`
- `go_up` (GO UP) -> `dusty`
- `go_north` (GO NORTH) -> `threejunction`
- `go_down` (GO DOWN) -> `anteroom`

**Cue phrase:** "passage"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

---

### Swiss Cheese Room (`swisscheese`)

**Available exits:**
- `go_ne` (GO NORTHEAST) -> `bedquilt`
- `go_west` (GO WEST) -> `eastend`
- `go_canyon` (CANYON) -> `tall`
- `go_east` (GO EAST) -> `softroom`
- `go_oriental` (ORIENTAL) -> `oriental`

**Cue phrase:** "room"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### East End Of Twopit Room (`eastend`)

**Available exits:**
- `go_east` (GO EAST) -> `swisscheese`
- `go_west` (GO WEST) -> `westend`
- `go_acros` (Acros) -> `westend`
- `go_down` (GO DOWN) -> `eastpit`
- `go_pit` (PIT) -> `eastpit`

**Cue phrase:** "path"

| Implied Input | Resolves? |
|---|---|
| `road` | **NO** |
| `go road` | **NO** |
| `follow road` | **NO** |
| `path` | YES |
| `trail` | **NO** |
| `follow path` | YES |

**Cue phrase:** "over"

| Implied Input | Resolves? |
|---|---|
| `over` | **NO** |
| `go over` | **NO** |
| `climb over` | **NO** |

**Cue phrase:** "wall"

| Implied Input | Resolves? |
|---|---|
| `wall` | **NO** |
| `go wall` | **NO** |
| `climb wall` | **NO** |
| `over wall` | **NO** |

**Cue phrase:** "Room"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### Slab Room (`slab`)

**Available exits:**
- `go_south` (GO SOUTH) -> `westend`
- `go_up` (GO UP) -> `secret1`
- `go_climb` (CLIMB) -> `secret1`
- `go_north` (GO NORTH) -> `bedquilt`

**Cue phrase:** "slab"

| Implied Input | Resolves? |
|---|---|
| `slab` | **NO** |
| `go slab` | **NO** |
| `climb slab` | YES |

**Cue phrase:** "chamber"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### Secret1 (`secret1`)

**Available exits:**
- `go_down` (GO DOWN) -> `slab`
- `go_slab` (SLAB) -> `slab`
- `go_south` (GO SOUTH) -> `secret4`
- `go_north` (GO NORTH) -> `mirrorcanyon`
- `go_reservoir` (RESERVOIR) -> `reservoir`

**Cue phrase:** "canyon"

| Implied Input | Resolves? |
|---|---|
| `canyon` | **NO** |
| `go canyon` | **NO** |
| `enter canyon` | **NO** |
| `gorge` | **NO** |

**Cue phrase:** "room"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

**Cue phrase:** "secret"

| Implied Input | Resolves? |
|---|---|
| `secret` | **NO** |
| `go secret` | **NO** |
| `secret passage` | **NO** |

---

### Secret2 (`secret2`)

**Available exits:**
- `go_north` (GO NORTH) -> `threejunction`
- `go_down` (GO DOWN) -> `bedquilt`
- `go_passage` (PASSAGE) -> `bedquilt`
- `go_south` (GO SOUTH) -> `topstalactite`

**Cue phrase:** "canyon"

| Implied Input | Resolves? |
|---|---|
| `canyon` | **NO** |
| `go canyon` | **NO** |
| `enter canyon` | **NO** |
| `gorge` | **NO** |

**Cue phrase:** "secret"

| Implied Input | Resolves? |
|---|---|
| `secret` | **NO** |
| `go secret` | **NO** |
| `secret passage` | **NO** |

---

### Junction Of Three Secret Canyons (`threejunction`)

**Available exits:**
- `go_se` (GO SOUTHEAST) -> `bedquilt`
- `go_south` (GO SOUTH) -> `secret2`
- `go_north` (GO NORTH) -> `window2`

**Cue phrase:** "canyon"

| Implied Input | Resolves? |
|---|---|
| `canyon` | **NO** |
| `go canyon` | **NO** |
| `enter canyon` | **NO** |
| `gorge` | **NO** |

**Cue phrase:** "junction"

| Implied Input | Resolves? |
|---|---|
| `fork` | **NO** |
| `go fork` | **NO** |
| `junction` | **NO** |
| `intersection` | **NO** |

---

### Large Low Room (`lowroom`)

**Available exits:**
- `go_bedquilt` (BEDQUILT) -> `bedquilt`
- `go_sw` (GO SOUTHWEST) -> `winding`
- `go_north` (GO NORTH) -> `deadcrawl`
- `go_se` (GO SOUTHEAST) -> `oriental`
- `go_oriental` (ORIENTAL) -> `oriental`

**Cue phrase:** "room"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### Secret E/w Canyon Above Tight Canyon (`secret3`)

**Available exits:**
- `go_east` (GO EAST) -> `kinghall`
- `go_west` (GO WEST) -> `secret6`
- `go_down` (GO DOWN) -> `wideplace`

**Cue phrase:** "canyon"

| Implied Input | Resolves? |
|---|---|
| `canyon` | **NO** |
| `go canyon` | **NO** |
| `enter canyon` | **NO** |
| `gorge` | **NO** |

**Cue phrase:** "over"

| Implied Input | Resolves? |
|---|---|
| `over` | **NO** |
| `go over` | **NO** |
| `climb over` | **NO** |

**Cue phrase:** "secret"

| Implied Input | Resolves? |
|---|---|
| `secret` | **NO** |
| `go secret` | **NO** |
| `secret passage` | **NO** |

---

### Wideplace (`wideplace`)

**Available exits:**
- `go_south` (GO SOUTH) -> `tightplace`
- `go_north` (GO NORTH) -> `tall`

**Cue phrase:** "canyon"

| Implied Input | Resolves? |
|---|---|
| `canyon` | **NO** |
| `go canyon` | **NO** |
| `enter canyon` | **NO** |
| `gorge` | **NO** |

---

### Tightplace (`tightplace`)

**Available exits:**
- `go_north` (GO NORTH) -> `wideplace`

**Cue phrase:** "canyon"

| Implied Input | Resolves? |
|---|---|
| `canyon` | **NO** |
| `go canyon` | **NO** |
| `enter canyon` | **NO** |
| `gorge` | **NO** |

---

### Tall (`tall`)

**Available exits:**
- `go_east` (GO EAST) -> `wideplace`
- `go_west` (GO WEST) -> `boulders1`
- `go_north` (GO NORTH) -> `swisscheese`
- `go_crawl` (CRAWL) -> `swisscheese`

**Cue phrase:** "canyon"

| Implied Input | Resolves? |
|---|---|
| `canyon` | **NO** |
| `go canyon` | **NO** |
| `enter canyon` | **NO** |
| `gorge` | **NO** |

---

### Boulders1 (`boulders1`)

**Available exits:**
- `go_south` (GO SOUTH) -> `tall`

**Cue phrase:** "canyon"

| Implied Input | Resolves? |
|---|---|
| `canyon` | **NO** |
| `go canyon` | **NO** |
| `enter canyon` | **NO** |
| `gorge` | **NO** |

---

### Sewer (`sewer`)

**Available exits:**
- `go_default` (CONTINUE) -> `building`

**Cue phrase:** "The stream"

| Implied Input | Resolves? |
|---|---|
| `follow the stream` | **NO** |
| `follow stream` | **NO** |
| `go stream` | **NO** |

**Cue phrase:** "stream"

| Implied Input | Resolves? |
|---|---|
| `stream` | **NO** |
| `go stream` | **NO** |
| `follow stream` | **NO** |

---

### Narrow Corridor (`narrow`)

**Available exits:**
- `go_down` (GO DOWN) -> `westpit`
- `go_climb` (CLIMB) -> `westpit`
- `go_east` (GO EAST) -> `westpit`
- `go_jump` (JUMP) -> `neckbroke`
- `go_west` (GO WEST) -> `giantroom`
- `go_giant` (GIANT) -> `giantroom`

**Cue phrase:** "corridor"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

**Cue phrase:** "hole"

| Implied Input | Resolves? |
|---|---|
| `hole` | **NO** |
| `go hole` | **NO** |
| `enter hole` | **NO** |
| `opening` | **NO** |

---

### Noclimb (`noclimb`)

**Available exits:**
- `go_default` (CONTINUE) -> `westpit`

**Cue phrase:** "pit"

| Implied Input | Resolves? |
|---|---|
| `pit` | **NO** |
| `go pit` | **NO** |
| `enter pit` | **NO** |
| `chasm` | **NO** |
| `abyss` | **NO** |

**Cue phrase:** "climb"

| Implied Input | Resolves? |
|---|---|
| `climb` | **NO** |
| `go up` | **NO** |
| `ascend` | **NO** |
| `climb up` | **NO** |

---

### Planttop (`planttop`)

**Available exits:**
- `go_default` (CONTINUE) -> `westend`

**Cue phrase:** "pit"

| Implied Input | Resolves? |
|---|---|
| `pit` | **NO** |
| `go pit` | **NO** |
| `enter pit` | **NO** |
| `chasm` | **NO** |
| `abyss` | **NO** |

---

### Steep Incline Above Large Room (`incline`)

**Available exits:**
- `go_north` (GO NORTH) -> `waterfall`
- `go_cavern` (CAVERN) -> `waterfall`
- `go_passage` (PASSAGE) -> `waterfall`
- `go_down` (GO DOWN) -> `lowroom`
- `go_climb` (CLIMB) -> `lowroom`

**Cue phrase:** "climb"

| Implied Input | Resolves? |
|---|---|
| `climb` | YES |
| `go up` | **NO** |
| `ascend` | **NO** |
| `climb up` | YES |

**Cue phrase:** "room"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### Giant Room (`giantroom`)

**Available exits:**
- `go_south` (GO SOUTH) -> `narrow`
- `go_east` (GO EAST) -> `cavein`
- `go_north` (GO NORTH) -> `immense`

**Cue phrase:** "wall"

| Implied Input | Resolves? |
|---|---|
| `wall` | **NO** |
| `go wall` | **NO** |
| `climb wall` | **NO** |
| `over wall` | **NO** |

**Cue phrase:** "Room"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### Cavein (`cavein`)

**Available exits:**
- `go_south` (GO SOUTH) -> `giantroom`
- `go_giant` (GIANT) -> `giantroom`
- `go_out` (GO OUT) -> `giantroom`

**Cue phrase:** "passage"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

---

### Cavern With Waterfall (`waterfall`)

**Available exits:**
- `go_south` (GO SOUTH) -> `immense`
- `go_out` (GO OUT) -> `immense`
- `go_giant` (GIANT) -> `giantroom`
- `go_west` (GO WEST) -> `incline`

**Cue phrase:** "hole"

| Implied Input | Resolves? |
|---|---|
| `hole` | **NO** |
| `go hole` | **NO** |
| `enter hole` | **NO** |
| `opening` | **NO** |

**Cue phrase:** "over"

| Implied Input | Resolves? |
|---|---|
| `over` | **NO** |
| `go over` | **NO** |
| `climb over` | **NO** |

**Cue phrase:** "stream"

| Implied Input | Resolves? |
|---|---|
| `stream` | **NO** |
| `go stream` | **NO** |
| `follow stream` | **NO** |

---

### Soft Room (`softroom`)

**Available exits:**
- `go_west` (GO WEST) -> `swisscheese`
- `go_out` (GO OUT) -> `swisscheese`

**Cue phrase:** "Room"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### Oriental Room (`oriental`)

**Available exits:**
- `go_se` (GO SOUTHEAST) -> `swisscheese`
- `go_west` (GO WEST) -> `lowroom`
- `go_crawl` (CRAWL) -> `lowroom`
- `go_up` (GO UP) -> `misty`
- `go_north` (GO NORTH) -> `misty`
- `go_cavern` (CAVERN) -> `misty`

**Cue phrase:** "passage leads up"

| Implied Input | Resolves? |
|---|---|
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passage` | **NO** |
| `go tunnel` | **NO** |
| `enter tunnel` | **NO** |
| `go up` | YES |
| `up` | YES |

**Cue phrase:** "passage"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

**Cue phrase:** "Room"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### Misty Cavern (`misty`)

**Available exits:**
- `go_south` (GO SOUTH) -> `oriental`
- `go_oriental` (ORIENTAL) -> `oriental`
- `go_west` (GO WEST) -> `alcove`

**Cue phrase:** "fissure"

| Implied Input | Resolves? |
|---|---|
| `crack` | **NO** |
| `go crack` | **NO** |
| `enter crack` | **NO** |
| `crevice` | **NO** |
| `fissure` | **NO** |

**Cue phrase:** "path"

| Implied Input | Resolves? |
|---|---|
| `road` | **NO** |
| `go road` | **NO** |
| `follow road` | **NO** |
| `path` | **NO** |
| `trail` | **NO** |
| `follow path` | **NO** |

---

### Alcove (`alcove`)

**Available exits:**
- `go_nw` (GO NORTHWEST) -> `misty`
- `go_cavern` (CAVERN) -> `misty`
- `go_east` (GO EAST) -> `plover`

**Cue phrase:** "tunnel leads east"

| Implied Input | Resolves? |
|---|---|
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passage` | **NO** |
| `go tunnel` | **NO** |
| `enter tunnel` | **NO** |
| `go east` | YES |
| `east` | YES |

**Cue phrase:** "tunnel"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

**Cue phrase:** "path"

| Implied Input | Resolves? |
|---|---|
| `road` | **NO** |
| `go road` | **NO** |
| `follow road` | **NO** |
| `path` | **NO** |
| `trail` | **NO** |
| `follow path` | **NO** |

---

### Plover Room (`plover`)

**Available exits:**
- `go_west` (GO WEST) -> `alcove`
- `go_plover` (PLOVER) -> `foof6`
- `go_ne` (GO NORTHEAST) -> `darkroom`
- `go_dark` (DARK) -> `darkroom`

**Cue phrase:** "corridor leads "

| Implied Input | Resolves? |
|---|---|
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passage` | **NO** |
| `go tunnel` | **NO** |
| `enter tunnel` | **NO** |

**Cue phrase:** "tunnel"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

**Cue phrase:** "chamber"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### Dark-room (`darkroom`)

**Available exits:**
- `go_south` (GO SOUTH) -> `plover`
- `go_plover` (PLOVER) -> `plover`
- `go_out` (GO OUT) -> `plover`

**Cue phrase:** "corridor lead"

| Implied Input | Resolves? |
|---|---|
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passage` | **NO** |
| `go tunnel` | **NO** |
| `enter tunnel` | **NO** |

**Cue phrase:** "corridor"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

**Cue phrase:** "room"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### Arched Hall (`arched`)

**Available exits:**
- `go_down` (GO DOWN) -> `shellroom`
- `go_shell` (SHELL) -> `shellroom`
- `go_out` (GO OUT) -> `shellroom`

**Cue phrase:** "passage"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

**Cue phrase:** "debris"

| Implied Input | Resolves? |
|---|---|
| `debris` | **NO** |
| `go debris` | **NO** |
| `enter debris` | **NO** |

**Cue phrase:** "hall"

| Implied Input | Resolves? |
|---|---|
| `hall` | **NO** |
| `go hall` | **NO** |
| `enter hall` | **NO** |

---

### Shell Room (`shellroom`)

**Available exits:**
- `go_up` (GO UP) -> `arched`
- `go_hall` (HALL) -> `arched`
- `go_down` (GO DOWN) -> `sloping1`
- `go_south` (GO SOUTH) -> `complex`

**Cue phrase:** "passage"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

**Cue phrase:** "room"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### Sloping1 (`sloping1`)

**Available exits:**
- `go_up` (GO UP) -> `shellroom`
- `go_shell` (SHELL) -> `shellroom`
- `go_down` (GO DOWN) -> `culdesac`

**Cue phrase:** "corridor"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

---

### Culdesac (`culdesac`)

**Available exits:**
- `go_up` (GO UP) -> `sloping1`
- `go_out` (GO OUT) -> `sloping1`
- `go_shell` (SHELL) -> `shellroom`

**Cue phrase:** "across"

| Implied Input | Resolves? |
|---|---|
| `across` | **NO** |
| `go across` | **NO** |

---

### Anteroom (`anteroom`)

**Available exits:**
- `go_up` (GO UP) -> `complex`
- `go_west` (GO WEST) -> `bedquilt`
- `go_east` (GO EAST) -> `wittsend`

**Cue phrase:** "passage"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

---

### Mirror Canyon (`mirrorcanyon`)

**Available exits:**
- `go_south` (GO SOUTH) -> `secret1`
- `go_north` (GO NORTH) -> `reservoir`
- `go_reservoir` (RESERVOIR) -> `reservoir`

**Cue phrase:** "canyon"

| Implied Input | Resolves? |
|---|---|
| `canyon` | **NO** |
| `go canyon` | **NO** |
| `enter canyon` | **NO** |
| `gorge` | **NO** |

**Cue phrase:** "across"

| Implied Input | Resolves? |
|---|---|
| `across` | **NO** |
| `go across` | **NO** |

**Cue phrase:** "over"

| Implied Input | Resolves? |
|---|---|
| `over` | **NO** |
| `go over` | **NO** |
| `climb over` | **NO** |

**Cue phrase:** "wall"

| Implied Input | Resolves? |
|---|---|
| `wall` | **NO** |
| `go wall` | **NO** |
| `climb wall` | **NO** |
| `over wall` | **NO** |

---

### Window On Pit (`window2`)

**Available exits:**
- `go_west` (GO WEST) -> `threejunction`
- `go_jump` (JUMP) -> `neckbroke`

**Cue phrase:** "pit"

| Implied Input | Resolves? |
|---|---|
| `pit` | **NO** |
| `go pit` | **NO** |
| `enter pit` | **NO** |
| `chasm` | **NO** |
| `abyss` | **NO** |

**Cue phrase:** "across"

| Implied Input | Resolves? |
|---|---|
| `across` | **NO** |
| `go across` | **NO** |

**Cue phrase:** "over"

| Implied Input | Resolves? |
|---|---|
| `over` | **NO** |
| `go over` | **NO** |
| `climb over` | **NO** |

**Cue phrase:** "room"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### Top Of Stalactite (`topstalactite`)

**Available exits:**
- `go_north` (GO NORTH) -> `secret2`
- `go_down` (GO DOWN) -> `alike4`

**Cue phrase:** "climb"

| Implied Input | Resolves? |
|---|---|
| `climb` | **NO** |
| `go up` | **NO** |
| `ascend` | **NO** |
| `climb up` | **NO** |

---

### Reservoir (`reservoir`)

**Available exits:**
- `go_south` (GO SOUTH) -> `mirrorcanyon`
- `go_out` (GO OUT) -> `mirrorcanyon`
- `go_north` (GO NORTH) -> `resbottom`

**Cue phrase:** "passage"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

**Cue phrase:** "hole"

| Implied Input | Resolves? |
|---|---|
| `hole` | **NO** |
| `go hole` | **NO** |
| `enter hole` | **NO** |
| `opening` | **NO** |

**Cue phrase:** "wall"

| Implied Input | Resolves? |
|---|---|
| `wall` | **NO** |
| `go wall` | **NO** |
| `climb wall` | **NO** |
| `over wall` | **NO** |

**Cue phrase:** "stream"

| Implied Input | Resolves? |
|---|---|
| `stream` | **NO** |
| `go stream` | **NO** |
| `follow stream` | **NO** |

**Cue phrase:** "room"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

**Cue phrase:** "reservoir"

| Implied Input | Resolves? |
|---|---|
| `reservoir` | **NO** |
| `go reservoir` | **NO** |
| `enter reservoir` | **NO** |

---

### Ne End (`ne`)

**Available exits:**
- `go_sw` (GO SOUTHWEST) -> `sw`

**Cue phrase:** "wall"

| Implied Input | Resolves? |
|---|---|
| `wall` | **NO** |
| `go wall` | **NO** |
| `climb wall` | **NO** |
| `over wall` | **NO** |

**Cue phrase:** "room"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### Sw End (`sw`)

**Available exits:**
- `go_ne` (GO NORTHEAST) -> `ne`

**Cue phrase:** "pit"

| Implied Input | Resolves? |
|---|---|
| `pit` | **NO** |
| `go pit` | **NO** |
| `enter pit` | **NO** |
| `chasm` | **NO** |
| `abyss` | **NO** |

---

### Sw Side Of Chasm (`swchasm`)

**Available exits:**
- `go_sw` (GO SOUTHWEST) -> `winding`
- `go_jump` (JUMP) -> `__blocked__`

**Cue phrase:** "corridor"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

**Cue phrase:** "chasm"

| Implied Input | Resolves? |
|---|---|
| `pit` | **NO** |
| `go pit` | **NO** |
| `enter pit` | **NO** |
| `chasm` | **NO** |
| `abyss` | **NO** |

**Cue phrase:** "path"

| Implied Input | Resolves? |
|---|---|
| `road` | **NO** |
| `go road` | **NO** |
| `follow road` | **NO** |
| `path` | **NO** |
| `trail` | **NO** |
| `follow path` | **NO** |

---

### Sloping Corridor (`winding`)

**Available exits:**
- `go_down` (GO DOWN) -> `lowroom`
- `go_up` (GO UP) -> `swchasm`

**Cue phrase:** "corridor"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

---

### Secret4 (`secret4`)

**Available exits:**
- `go_north` (GO NORTH) -> `secret1`
- `go_out` (GO OUT) -> `secret1`

**Cue phrase:** "canyon"

| Implied Input | Resolves? |
|---|---|
| `canyon` | **NO** |
| `go canyon` | **NO** |
| `enter canyon` | **NO** |
| `gorge` | **NO** |

**Cue phrase:** "secret"

| Implied Input | Resolves? |
|---|---|
| `secret` | **NO** |
| `go secret` | **NO** |
| `secret passage` | **NO** |

---

### Secret5 (`secret5`)

**Available exits:**
- `go_north` (GO NORTH) -> `secret1`
- `go_east` (GO EAST) -> `secret3`

**Cue phrase:** "canyon"

| Implied Input | Resolves? |
|---|---|
| `canyon` | **NO** |
| `go canyon` | **NO** |
| `enter canyon` | **NO** |
| `gorge` | **NO** |

**Cue phrase:** "secret"

| Implied Input | Resolves? |
|---|---|
| `secret` | **NO** |
| `go secret` | **NO** |
| `secret passage` | **NO** |

---

### Secret6 (`secret6`)

**Available exits:**
- `go_east` (GO EAST) -> `secret3`
- `go_out` (GO OUT) -> `secret3`

**Cue phrase:** "canyon"

| Implied Input | Resolves? |
|---|---|
| `canyon` | **NO** |
| `go canyon` | **NO** |
| `enter canyon` | **NO** |
| `gorge` | **NO** |

**Cue phrase:** "secret"

| Implied Input | Resolves? |
|---|---|
| `secret` | **NO** |
| `go secret` | **NO** |
| `secret passage` | **NO** |

---

### Ne Side Of Chasm (`nechasm`)

**Available exits:**
- `go_ne` (GO NORTHEAST) -> `corridor`
- `go_fork` (FORK) -> `fork`
- `go_view` (VIEW) -> `breathtaking`
- `go_barre` (Barre) -> `barrenfront`

**Cue phrase:** "chasm"

| Implied Input | Resolves? |
|---|---|
| `pit` | **NO** |
| `go pit` | **NO** |
| `enter pit` | **NO** |
| `chasm` | **NO** |
| `abyss` | **NO** |

**Cue phrase:** "path"

| Implied Input | Resolves? |
|---|---|
| `road` | **NO** |
| `go road` | **NO** |
| `follow road` | **NO** |
| `path` | **NO** |
| `trail` | **NO** |
| `follow path` | **NO** |

---

### Corridor (`corridor`)

**Available exits:**
- `go_west` (GO WEST) -> `nechasm`
- `go_east` (GO EAST) -> `fork`
- `go_fork` (FORK) -> `fork`
- `go_view` (VIEW) -> `breathtaking`
- `go_barre` (Barre) -> `barrenfront`

**Cue phrase:** "corridor"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

---

### Fork In Path (`fork`)

**Available exits:**
- `go_west` (GO WEST) -> `corridor`
- `go_ne` (GO NORTHEAST) -> `warmwalls`
- `go_left` (LEFT) -> `warmwalls`
- `go_se` (GO SOUTHEAST) -> `limestone`
- `go_right` (RIGHT) -> `limestone`
- `go_down` (GO DOWN) -> `limestone`
- `go_view` (VIEW) -> `breathtaking`
- `go_barre` (Barre) -> `barrenfront`

**Cue phrase:** "corridor"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

**Cue phrase:** "fork"

| Implied Input | Resolves? |
|---|---|
| `fork` | **NO** |
| `go fork` | **NO** |
| `junction` | **NO** |
| `intersection` | **NO** |

**Cue phrase:** "path"

| Implied Input | Resolves? |
|---|---|
| `road` | **NO** |
| `go road` | **NO** |
| `follow road` | **NO** |
| `path` | **NO** |
| `trail` | **NO** |
| `follow path` | **NO** |

---

### Junction With Warm Walls (`warmwalls`)

**Available exits:**
- `go_south` (GO SOUTH) -> `fork`
- `go_fork` (FORK) -> `fork`
- `go_north` (GO NORTH) -> `breathtaking`
- `go_view` (VIEW) -> `breathtaking`
- `go_east` (GO EAST) -> `boulders2`
- `go_crawl` (CRAWL) -> `boulders2`

**Cue phrase:** "passage leads south"

| Implied Input | Resolves? |
|---|---|
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passage` | **NO** |
| `go tunnel` | **NO** |
| `enter tunnel` | **NO** |
| `go south` | YES |
| `south` | YES |

**Cue phrase:** "passage"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

---

### Breath-taking View (`breathtaking`)

**Available exits:**
- `go_south` (GO SOUTH) -> `warmwalls`
- `go_passage` (PASSAGE) -> `warmwalls`
- `go_out` (GO OUT) -> `warmwalls`
- `go_fork` (FORK) -> `fork`
- `go_jump` (JUMP) -> `gruesome`

**Cue phrase:** "pit"

| Implied Input | Resolves? |
|---|---|
| `pit` | YES |
| `go pit` | YES |
| `enter pit` | YES |
| `chasm` | **NO** |
| `abyss` | **NO** |

**Cue phrase:** "gorge"

| Implied Input | Resolves? |
|---|---|
| `canyon` | **NO** |
| `go canyon` | **NO** |
| `enter canyon` | **NO** |
| `gorge` | **NO** |

**Cue phrase:** "left"

| Implied Input | Resolves? |
|---|---|
| `left` | **NO** |
| `go left` | **NO** |

**Cue phrase:** "right"

| Implied Input | Resolves? |
|---|---|
| `right` | **NO** |
| `go right` | **NO** |

**Cue phrase:** "wall"

| Implied Input | Resolves? |
|---|---|
| `wall` | **NO** |
| `go wall` | **NO** |
| `climb wall` | **NO** |
| `over wall` | **NO** |

**Cue phrase:** "barren"

| Implied Input | Resolves? |
|---|---|
| `barren` | **NO** |
| `go barren` | **NO** |

---

### Chamber Of Boulders (`boulders2`)

**Available exits:**
- `go_west` (GO WEST) -> `warmwalls`
- `go_out` (GO OUT) -> `warmwalls`
- `go_crawl` (CRAWL) -> `warmwalls`
- `go_fork` (FORK) -> `fork`
- `go_view` (VIEW) -> `breathtaking`

**Cue phrase:** "chamber"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### Limestone Passage (`limestone`)

**Available exits:**
- `go_north` (GO NORTH) -> `fork`
- `go_up` (GO UP) -> `fork`
- `go_fork` (FORK) -> `fork`
- `go_south` (GO SOUTH) -> `barrenfront`
- `go_down` (GO DOWN) -> `barrenfront`
- `go_barre` (Barre) -> `barrenfront`
- `go_view` (VIEW) -> `breathtaking`

**Cue phrase:** "passage"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

---

### Front Of Barren Room (`barrenfront`)

**Available exits:**
- `go_west` (GO WEST) -> `limestone`
- `go_up` (GO UP) -> `limestone`
- `go_fork` (FORK) -> `fork`
- `go_east` (GO EAST) -> `barrenroom`
- `go_in` (GO IN) -> `barrenroom`
- `go_barre` (Barre) -> `barrenroom`
- `go_enter` (ENTER) -> `barrenroom`
- `go_view` (VIEW) -> `breathtaking`

**Cue phrase:** "entrance"

| Implied Input | Resolves? |
|---|---|
| `entrance` | **NO** |
| `go entrance` | **NO** |
| `enter entrance` | YES |
| `entryway` | **NO** |

**Cue phrase:** "room"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | YES |
| `chamber` | **NO** |

---

### Barren Room (`barrenroom`)

**Available exits:**
- `go_west` (GO WEST) -> `barrenfront`
- `go_out` (GO OUT) -> `barrenfront`
- `go_fork` (FORK) -> `fork`
- `go_view` (VIEW) -> `breathtaking`

**Cue phrase:** "room"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

**Cue phrase:** "barren"

| Implied Input | Resolves? |
|---|---|
| `barren` | **NO** |
| `go barren` | **NO** |

---

### Roughhewn (`roughhewn`)

**Available exits:**
- `go_north` (GO NORTH) -> `deadend13`
- `go_south` (GO SOUTH) -> `large`

**Cue phrase:** "corridor"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

---

### Large (`large`)

**Available exits:**
- `go_west` (GO WEST) -> `roughhewn`
- `go_north` (GO NORTH) -> `storeroom`

**Cue phrase:** "chamber"

| Implied Input | Resolves? |
|---|---|
| `room` | **NO** |
| `go room` | **NO** |
| `enter room` | **NO** |
| `chamber` | **NO** |

---

### Forest1 (`forest1`)

**Available exits:**
- `go_east` (GO EAST) -> `start`
- `go_west` (GO WEST) -> `forest13`
- `go_north` (GO NORTH) -> `forest2`
- `go_south` (GO SOUTH) -> `forest3`

**Cue phrase:** "forest"

| Implied Input | Resolves? |
|---|---|
| `forest` | **NO** |
| `go forest` | **NO** |
| `enter forest` | **NO** |
| `woods` | **NO** |

---

### Forest2 (`forest2`)

**Available exits:**
- `go_east` (GO EAST) -> `forest1`
- `go_west` (GO WEST) -> `forest19`
- `go_north` (GO NORTH) -> `forest3`
- `go_south` (GO SOUTH) -> `forest18`

**Cue phrase:** "forest"

| Implied Input | Resolves? |
|---|---|
| `forest` | **NO** |
| `go forest` | **NO** |
| `enter forest` | **NO** |
| `woods` | **NO** |

---

### Forest3 (`forest3`)

**Available exits:**
- `go_east` (GO EAST) -> `forest4`
- `go_west` (GO WEST) -> `forest4`
- `go_north` (GO NORTH) -> `forest2`
- `go_south` (GO SOUTH) -> `forest1`

**Cue phrase:** "forest"

| Implied Input | Resolves? |
|---|---|
| `forest` | **NO** |
| `go forest` | **NO** |
| `enter forest` | **NO** |
| `woods` | **NO** |

---

### Forest4 (`forest4`)

**Available exits:**
- `go_east` (GO EAST) -> `forest3`
- `go_north` (GO NORTH) -> `forest3`
- `go_west` (GO WEST) -> `forest5`
- `go_south` (GO SOUTH) -> `forest5`

**Cue phrase:** "forest"

| Implied Input | Resolves? |
|---|---|
| `forest` | **NO** |
| `go forest` | **NO** |
| `enter forest` | **NO** |
| `woods` | **NO** |

---

### Forest5 (`forest5`)

**Available exits:**
- `go_east` (GO EAST) -> `forest4`
- `go_north` (GO NORTH) -> `forest4`
- `go_west` (GO WEST) -> `forest7`
- `go_south` (GO SOUTH) -> `forest6`

**Cue phrase:** "forest"

| Implied Input | Resolves? |
|---|---|
| `forest` | **NO** |
| `go forest` | **NO** |
| `enter forest` | **NO** |
| `woods` | **NO** |

---

### Forest6 (`forest6`)

**Available exits:**
- `go_east` (GO EAST) -> `forest5`
- `go_west` (GO WEST) -> `forest7`
- `go_north` (GO NORTH) -> `valley`
- `go_south` (GO SOUTH) -> `slit`

**Cue phrase:** "forest"

| Implied Input | Resolves? |
|---|---|
| `forest` | **NO** |
| `go forest` | **NO** |
| `enter forest` | **NO** |
| `woods` | **NO** |

---

### Forest7 (`forest7`)

**Available exits:**
- `go_east` (GO EAST) -> `forest5`
- `go_west` (GO WEST) -> `forest6`
- `go_north` (GO NORTH) -> `grate`
- `go_south` (GO SOUTH) -> `forest8`

**Cue phrase:** "forest"

| Implied Input | Resolves? |
|---|---|
| `forest` | **NO** |
| `go forest` | **NO** |
| `enter forest` | **NO** |
| `woods` | **NO** |

---

### Forest8 (`forest8`)

**Available exits:**
- `go_east` (GO EAST) -> `forest9`
- `go_west` (GO WEST) -> `forest11`
- `go_north` (GO NORTH) -> `forest22`
- `go_south` (GO SOUTH) -> `forest7`

**Cue phrase:** "forest"

| Implied Input | Resolves? |
|---|---|
| `forest` | **NO** |
| `go forest` | **NO** |
| `enter forest` | **NO** |
| `woods` | **NO** |

---

### Forest9 (`forest9`)

**Available exits:**
- `go_east` (GO EAST) -> `forest11`
- `go_west` (GO WEST) -> `forest8`
- `go_north` (GO NORTH) -> `forest10`
- `go_south` (GO SOUTH) -> `grate`

**Cue phrase:** "forest"

| Implied Input | Resolves? |
|---|---|
| `forest` | **NO** |
| `go forest` | **NO** |
| `enter forest` | **NO** |
| `woods` | **NO** |

---

### Forest10 (`forest10`)

**Available exits:**
- `go_east` (GO EAST) -> `slit`
- `go_west` (GO WEST) -> `forest11`
- `go_north` (GO NORTH) -> `forest9`
- `go_south` (GO SOUTH) -> `grate`

**Cue phrase:** "forest"

| Implied Input | Resolves? |
|---|---|
| `forest` | **NO** |
| `go forest` | **NO** |
| `enter forest` | **NO** |
| `woods` | **NO** |

---

### Forest11 (`forest11`)

**Available exits:**
- `go_east` (GO EAST) -> `forest10`
- `go_west` (GO WEST) -> `forest8`
- `go_north` (GO NORTH) -> `forest22`
- `go_south` (GO SOUTH) -> `forest9`

**Cue phrase:** "forest"

| Implied Input | Resolves? |
|---|---|
| `forest` | **NO** |
| `go forest` | **NO** |
| `enter forest` | **NO** |
| `woods` | **NO** |

---

### Forest12 (`forest12`)

**Available exits:**
- `go_east` (GO EAST) -> `forest13`
- `go_west` (GO WEST) -> `forest14`
- `go_north` (GO NORTH) -> `forest22`
- `go_south` (GO SOUTH) -> `valley`

**Cue phrase:** "forest"

| Implied Input | Resolves? |
|---|---|
| `forest` | **NO** |
| `go forest` | **NO** |
| `enter forest` | **NO** |
| `woods` | **NO** |

---

### Forest13 (`forest13`)

**Available exits:**
- `go_east` (GO EAST) -> `forest1`
- `go_west` (GO WEST) -> `forest12`
- `go_north` (GO NORTH) -> `forest20`
- `go_south` (GO SOUTH) -> `hill`

**Cue phrase:** "forest"

| Implied Input | Resolves? |
|---|---|
| `forest` | **NO** |
| `go forest` | **NO** |
| `enter forest` | **NO** |
| `woods` | **NO** |

---

### Forest14 (`forest14`)

**Available exits:**
- `go_east` (GO EAST) -> `roadend`
- `go_west` (GO WEST) -> `forest16`
- `go_north` (GO NORTH) -> `forest15`
- `go_south` (GO SOUTH) -> `forest12`

**Cue phrase:** "forest"

| Implied Input | Resolves? |
|---|---|
| `forest` | **NO** |
| `go forest` | **NO** |
| `enter forest` | **NO** |
| `woods` | **NO** |

---

### Forest15 (`forest15`)

**Available exits:**
- `go_east` (GO EAST) -> `forest16`
- `go_west` (GO WEST) -> `forest22`
- `go_north` (GO NORTH) -> `roadend`
- `go_south` (GO SOUTH) -> `forest14`

**Cue phrase:** "forest"

| Implied Input | Resolves? |
|---|---|
| `forest` | **NO** |
| `go forest` | **NO** |
| `enter forest` | **NO** |
| `woods` | **NO** |

---

### Forest16 (`forest16`)

**Available exits:**
- `go_east` (GO EAST) -> `forest17`
- `go_north` (GO NORTH) -> `forest17`
- `go_west` (GO WEST) -> `forest14`
- `go_south` (GO SOUTH) -> `forest15`

**Cue phrase:** "forest"

| Implied Input | Resolves? |
|---|---|
| `forest` | **NO** |
| `go forest` | **NO** |
| `enter forest` | **NO** |
| `woods` | **NO** |

---

### Forest17 (`forest17`)

**Available exits:**
- `go_east` (GO EAST) -> `forest18`
- `go_west` (GO WEST) -> `forest16`
- `go_south` (GO SOUTH) -> `forest16`
- `go_north` (GO NORTH) -> `cliff`

**Cue phrase:** "forest"

| Implied Input | Resolves? |
|---|---|
| `forest` | **NO** |
| `go forest` | **NO** |
| `enter forest` | **NO** |
| `woods` | **NO** |

---

### Forest18 (`forest18`)

**Available exits:**
- `go_east` (GO EAST) -> `forest19`
- `go_west` (GO WEST) -> `forest17`
- `go_north` (GO NORTH) -> `forest2`
- `go_south` (GO SOUTH) -> `forest21`

**Cue phrase:** "forest"

| Implied Input | Resolves? |
|---|---|
| `forest` | **NO** |
| `go forest` | **NO** |
| `enter forest` | **NO** |
| `woods` | **NO** |

---

### Forest19 (`forest19`)

**Available exits:**
- `go_east` (GO EAST) -> `forest2`
- `go_west` (GO WEST) -> `forest18`
- `go_north` (GO NORTH) -> `cliff`
- `go_south` (GO SOUTH) -> `forest20`

**Cue phrase:** "forest"

| Implied Input | Resolves? |
|---|---|
| `forest` | **NO** |
| `go forest` | **NO** |
| `enter forest` | **NO** |
| `woods` | **NO** |

---

### Forest20 (`forest20`)

**Available exits:**
- `go_east` (GO EAST) -> `hill`
- `go_west` (GO WEST) -> `forest21`
- `go_north` (GO NORTH) -> `forest19`
- `go_south` (GO SOUTH) -> `forest13`

**Cue phrase:** "forest"

| Implied Input | Resolves? |
|---|---|
| `forest` | **NO** |
| `go forest` | **NO** |
| `enter forest` | **NO** |
| `woods` | **NO** |

---

### Forest21 (`forest21`)

**Available exits:**
- `go_east` (GO EAST) -> `forest20`
- `go_west` (GO WEST) -> `roadend`
- `go_north` (GO NORTH) -> `forest18`
- `go_south` (GO SOUTH) -> `forest21`

**Cue phrase:** "forest"

| Implied Input | Resolves? |
|---|---|
| `forest` | **NO** |
| `go forest` | **NO** |
| `enter forest` | **NO** |
| `woods` | **NO** |

---

### Forest22 (`forest22`)

**Available exits:**
- `go_east` (GO EAST) -> `forest8`
- `go_west` (GO WEST) -> `forest11`
- `go_north` (GO NORTH) -> `forest15`
- `go_south` (GO SOUTH) -> `forest12`

**Cue phrase:** "forest"

| Implied Input | Resolves? |
|---|---|
| `forest` | **NO** |
| `go forest` | **NO** |
| `enter forest` | **NO** |
| `woods` | **NO** |

---

### Ledge (`ledge`)

**Available exits:**
- `go_jump` (JUMP) -> `nomake`

**Cue phrase:** "chasm"

| Implied Input | Resolves? |
|---|---|
| `pit` | **NO** |
| `go pit` | **NO** |
| `enter pit` | **NO** |
| `chasm` | **NO** |
| `abyss` | **NO** |

**Cue phrase:** "forest"

| Implied Input | Resolves? |
|---|---|
| `forest` | **NO** |
| `go forest` | **NO** |
| `enter forest` | **NO** |
| `woods` | **NO** |

**Cue phrase:** "Across"

| Implied Input | Resolves? |
|---|---|
| `across` | **NO** |
| `go across` | **NO** |

---

### Bottom Of Reservoir (`resbottom`)

**Available exits:**
- `go_north` (GO NORTH) -> `resnorth`
- `go_south` (GO SOUTH) -> `reservoir`

**Cue phrase:** "across"

| Implied Input | Resolves? |
|---|---|
| `across` | **NO** |
| `go across` | **NO** |

**Cue phrase:** "reservoir"

| Implied Input | Resolves? |
|---|---|
| `reservoir` | **NO** |
| `go reservoir` | **NO** |
| `enter reservoir` | **NO** |

---

### North Of Reservoir (`resnorth`)

**Available exits:**
- `go_south` (GO SOUTH) -> `resbottom`
- `go_nw` (GO NORTHWEST) -> `treacherous`
- `go_up` (GO UP) -> `treacherous`
- `go_out` (GO OUT) -> `treacherous`

**Cue phrase:** "passage leads "

| Implied Input | Resolves? |
|---|---|
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passage` | **NO** |
| `go tunnel` | **NO** |
| `enter tunnel` | **NO** |

**Cue phrase:** "passage"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

**Cue phrase:** "reservoir"

| Implied Input | Resolves? |
|---|---|
| `reservoir` | **NO** |
| `go reservoir` | **NO** |
| `enter reservoir` | **NO** |

---

### Treacherous (`treacherous`)

**Available exits:**
- `go_up` (GO UP) -> `steep`
- `go_nw` (GO NORTHWEST) -> `steep`
- `go_down` (GO DOWN) -> `resnorth`
- `go_se` (GO SOUTHEAST) -> `resnorth`

**Cue phrase:** "passage"

| Implied Input | Resolves? |
|---|---|
| `passage` | **NO** |
| `go passage` | **NO** |
| `enter passage` | **NO** |
| `passageway` | **NO** |
| `tunnel` | **NO** |
| `corridor` | **NO** |

---
