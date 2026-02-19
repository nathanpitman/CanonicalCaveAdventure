import * as fs from "fs";
import * as path from "path";

interface Action {
  id: string;
  label: string;
  type: "command" | "event" | "move";
  to?: string;
  message?: string;
}

interface SceneDescription {
  long: string;
  short: string;
}

interface Scene {
  id: string;
  title: string;
  description: SceneDescription;
  actions: Action[];
}

const NARRATIVE_CUE_PATTERNS: { pattern: RegExp; candidates: (match: RegExpMatchArray) => string[] }[] = [
  {
    pattern: /\bdownstream\b/i,
    candidates: () => ["downstream", "go downstream", "follow stream downstream", "follow the stream"],
  },
  {
    pattern: /\bupstream\b/i,
    candidates: () => ["upstream", "go upstream", "follow stream upstream"],
  },
  {
    pattern: /\bstreambed\b/i,
    candidates: () => ["streambed", "go streambed", "follow streambed"],
  },
  {
    pattern: /\bthe (?:stream|creek|brook|river)\b/i,
    candidates: () => ["follow the stream", "follow stream", "go stream"],
  },
  {
    pattern: /\bleads?\s+(north|south|east|west|up|down)\b/i,
    candidates: (m) => [`go ${m[1]}`, m[1]],
  },
  {
    pattern: /\b(?:passage|tunnel|corridor)\s+(?:leads?|continues?|goes?)\s*(north|south|east|west|up|down)?/i,
    candidates: (m) => {
      const dir = m[1];
      const base = ["go passage", "enter passage", "passage", "go tunnel", "enter tunnel"];
      if (dir) base.push(`go ${dir}`, dir);
      return base;
    },
  },
  {
    pattern: /\b(?:passage|passageway|tunnel|corridor)\b/i,
    candidates: () => ["passage", "go passage", "enter passage", "passageway", "tunnel", "corridor"],
  },
  {
    pattern: /\bcrawl(?:way|space)?\b/i,
    candidates: () => ["crawl", "go crawl", "crawlway", "crawlspace"],
  },
  {
    pattern: /\bstairs?\b|\bstairway\b|\bstaircase\b|\bsteps?\b/i,
    candidates: () => ["stairs", "go stairs", "stairway", "staircase", "climb stairs", "go steps"],
  },
  {
    pattern: /\b(?:pit|chasm|abyss)\b/i,
    candidates: () => ["pit", "go pit", "enter pit", "chasm", "abyss"],
  },
  {
    pattern: /\b(?:canyon|gorge)\b/i,
    candidates: () => ["canyon", "go canyon", "enter canyon", "gorge"],
  },
  {
    pattern: /\b(?:crack|crevice|fissure)\b/i,
    candidates: () => ["crack", "go crack", "enter crack", "crevice", "fissure"],
  },
  {
    pattern: /\b(?:hole|opening)\b/i,
    candidates: () => ["hole", "go hole", "enter hole", "opening"],
  },
  {
    pattern: /\b(?:dome)\b/i,
    candidates: () => ["dome", "go dome", "enter dome", "climb dome"],
  },
  {
    pattern: /\b(?:slab)\b/i,
    candidates: () => ["slab", "go slab", "climb slab"],
  },
  {
    pattern: /\b(?:depression)\b/i,
    candidates: () => ["depression", "go depression", "enter depression"],
  },
  {
    pattern: /\b(?:gully|ravine)\b/i,
    candidates: () => ["gully", "go gully", "enter gully", "ravine"],
  },
  {
    pattern: /\b(?:fork|junction|intersection)\b/i,
    candidates: () => ["fork", "go fork", "junction", "intersection"],
  },
  {
    pattern: /\b(?:building|house|wellhouse|well house)\b/i,
    candidates: () => ["building", "go building", "enter building", "house", "wellhouse"],
  },
  {
    pattern: /\b(?:forest|woods|trees)\b/i,
    candidates: () => ["forest", "go forest", "enter forest", "woods"],
  },
  {
    pattern: /\b(?:road|path|trail)\b/i,
    candidates: () => ["road", "go road", "follow road", "path", "trail", "follow path"],
  },
  {
    pattern: /\b(?:surface|outside|aboveground)\b/i,
    candidates: () => ["surface", "go surface", "go outside", "go up", "above", "topside"],
  },
  {
    pattern: /\b(?:entrance|entryway)\b/i,
    candidates: () => ["entrance", "go entrance", "enter entrance", "entryway"],
  },
  {
    pattern: /\binto\s+(\w+)/i,
    candidates: (m) => [`enter ${m[1]}`, `go into ${m[1]}`, `go ${m[1]}`],
  },
  {
    pattern: /\bacross\b/i,
    candidates: () => ["across", "go across"],
  },
  {
    pattern: /\bforward\b|\bahead\b|\bstraight\b/i,
    candidates: () => ["forward", "go forward", "ahead", "straight ahead", "continue"],
  },
  {
    pattern: /\bleft\b/i,
    candidates: () => ["left", "go left"],
  },
  {
    pattern: /\bright\b/i,
    candidates: () => ["right", "go right"],
  },
  {
    pattern: /\b(?:climb|ascend)\b/i,
    candidates: () => ["climb", "go up", "ascend", "climb up"],
  },
  {
    pattern: /\b(?:descend)\b/i,
    candidates: () => ["descend", "go down", "climb down"],
  },
  {
    pattern: /\b(?:cobble|cobbles|cobblestone)\b/i,
    candidates: () => ["cobbles", "go cobbles", "cobblestones"],
  },
  {
    pattern: /\b(?:debris|rubble)\b/i,
    candidates: () => ["debris", "go debris", "enter debris"],
  },
  {
    pattern: /\bover\b/i,
    candidates: () => ["over", "go over", "climb over"],
  },
  {
    pattern: /\b(?:wall)\b/i,
    candidates: () => ["wall", "go wall", "climb wall", "over wall"],
  },
  {
    pattern: /\b(?:stream)\b/i,
    candidates: () => ["stream", "go stream", "follow stream"],
  },
  {
    pattern: /\b(?:room|chamber)\b/i,
    candidates: () => ["room", "go room", "enter room", "chamber"],
  },
  {
    pattern: /\b(?:hall)\b/i,
    candidates: () => ["hall", "go hall", "enter hall"],
  },
  {
    pattern: /\b(?:secret)\b/i,
    candidates: () => ["secret", "go secret", "secret passage"],
  },
  {
    pattern: /\b(?:reservoir)\b/i,
    candidates: () => ["reservoir", "go reservoir", "enter reservoir"],
  },
  {
    pattern: /\b(?:broken|broke)\b/i,
    candidates: () => ["broken", "go broken"],
  },
  {
    pattern: /\b(?:barren)\b/i,
    candidates: () => ["barren", "go barren"],
  },
];

const DIRECTION_SYNONYMS: Record<string, string> = {
  "north": "north", "n": "north", "northward": "north", "northwards": "north",
  "south": "south", "s": "south", "southward": "south", "southwards": "south",
  "east": "east", "e": "east", "eastward": "east", "eastwards": "east",
  "west": "west", "w": "west", "westward": "west", "westwards": "west",
  "up": "up", "u": "up", "upward": "up", "upwards": "up", "ascend": "up", "climb up": "up",
  "down": "down", "d": "down", "downward": "down", "downwards": "down", "descend": "down", "climb down": "down",
  "northeast": "ne", "ne": "ne",
  "northwest": "nw", "nw": "nw",
  "southeast": "se", "se": "se",
  "southwest": "sw", "sw": "sw",
  "in": "in", "inside": "in", "inward": "in", "inwards": "in",
  "out": "out", "outside": "out", "outward": "out", "outwards": "out", "exit": "out", "leave": "out",
  "enter": "enter",
};

const NARRATIVE_SYNONYMS: Record<string, string> = {
  "downstream": "downs",
  "down stream": "downs",
  "down the stream": "downs",
  "follow stream downstream": "downs",
  "follow the stream": "downs",
  "follow stream": "downs",
  "upstream": "upstr",
  "up stream": "upstr",
  "up the stream": "upstr",
  "follow stream upstream": "upstr",
  "streambed": "bed",
  "stream bed": "bed",
  "riverbed": "bed",
  "entrance": "entra",
  "entryway": "entra",
  "barren": "barre",
  "barren room": "barre",
  "broken": "broke",
  "secret": "secre",
  "secret passage": "secre",
  "secret room": "secre",
  "across": "acros",
  "across the chasm": "acros",
  "forward": "forward",
  "ahead": "forward",
  "straight": "forward",
  "straight ahead": "forward",
  "onward": "forward",
  "continue": "forward",
  "crawlway": "crawl",
  "crawlspace": "crawl",
  "crawl space": "crawl",
  "stairway": "stairs",
  "staircase": "stairs",
  "stairwell": "stairs",
  "cobblestones": "cobbles",
  "cobblestone": "cobbles",
  "passageway": "passage",
  "corridor": "passage",
  "tunnel": "passage",
  "crevice": "crack",
  "fissure": "crack",
  "opening": "hole",
  "gorge": "canyon",
  "ravine": "gully",
  "chasm": "pit",
  "abyss": "pit",
  "junction": "fork",
  "intersection": "fork",
  "branching": "fork",
  "woods": "forest",
  "trees": "forest",
  "path": "road",
  "trail": "road",
  "above": "surface",
  "topside": "surface",
  "aboveground": "surface",
  "chamber": "room",
  "over the wall": "over",
  "over wall": "over",
};

interface GapEntry {
  sceneId: string;
  sceneTitle: string;
  cuePhrase: string;
  impliedInputs: string[];
  availableExits: { id: string; label: string; to?: string }[];
  unresolvedInputs: string[];
  suggestedMapping: string | null;
}

function extractMoveActions(scene: Scene): Action[] {
  return scene.actions.filter(a => a.type === "move");
}

const NOUN_SYNONYMS: Record<string, string[]> = {
  "building": ["build", "building", "house", "wellhouse", "well house"],
  "house": ["build", "building", "house"],
  "well house": ["build", "building"],
  "wellhouse": ["build", "building"],
  "grate": ["grate", "enter", "in"],
  "depression": ["depre", "depression"],
  "stream": ["strea", "stream", "streambed"],
  "streambed": ["strea", "stream"],
  "valley": ["valle", "valley"],
  "forest": ["fores", "forest"],
  "road": ["road"],
  "hill": ["hill"],
  "slit": ["slit"],
  "pit": ["pit"],
  "passage": ["passa", "passage"],
  "canyon": ["canyo", "canyon"],
  "tunnel": ["tunne", "tunnel"],
  "cobbles": ["cobbl", "cobbles"],
  "debris": ["debri", "debris"],
  "stairs": ["stair", "stairs"],
  "hall": ["hall"],
  "room": ["room"],
  "cave": ["caver", "cavern", "cave"],
  "cavern": ["caver", "cavern"],
  "surface": ["surfa", "surface"],
  "oriental": ["orien", "oriental"],
  "shell": ["shell"],
  "reservoir": ["reser", "reservoir"],
  "bedquilt": ["bedqu", "bedquilt"],
  "y2": ["y2"],
};

function isCloseEnough(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.startsWith(b) || b.startsWith(a)) return true;
  const lenDiff = Math.abs(a.length - b.length);
  if (lenDiff > 2) return false;
  let dist = 0;
  const maxLen = Math.max(a.length, b.length);
  for (let i = 0; i < maxLen; i++) {
    if (a[i] !== b[i]) dist++;
    if (dist > 2) return false;
  }
  return dist <= 2;
}

function canResolveInput(input: string, scene: Scene): boolean {
  const cleaned = input.trim().toLowerCase().replace(/[.,!?;:'"]/g, "").replace(/\s+/g, " ").trim();
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  const moveActions = extractMoveActions(scene);
  const actionTokens = moveActions.map(a => a.id.replace(/^go_/, "").toLowerCase());
  const actionLabels = moveActions.map(a => a.label.toLowerCase());

  const canMatchToken = (phrase: string): boolean => {
    if (actionTokens.includes(phrase)) return true;

    if (DIRECTION_SYNONYMS[phrase]) {
      if (actionTokens.includes(DIRECTION_SYNONYMS[phrase])) return true;
    }

    if (NARRATIVE_SYNONYMS[phrase]) {
      if (actionTokens.includes(NARRATIVE_SYNONYMS[phrase])) return true;
    }

    const nounSyns = NOUN_SYNONYMS[phrase];
    if (nounSyns) {
      for (const syn of nounSyns) {
        if (actionTokens.includes(syn)) return true;
      }
    }

    for (const [nounKey, nounValues] of Object.entries(NOUN_SYNONYMS)) {
      if (nounValues.includes(phrase) && actionTokens.includes(nounKey)) return true;
    }

    for (const token of actionTokens) {
      if (isCloseEnough(phrase, token)) return true;
    }

    return false;
  };

  if (canMatchToken(cleaned)) return true;

  for (const label of actionLabels) {
    if (label === cleaned || label === `go ${cleaned}` || label === `go to ${cleaned}`) return true;
  }

  const goPattern = /^(go|move|walk|head|travel|proceed|run|crawl|climb|follow)\s+(.+)$/;
  const goMatch = cleaned.match(goPattern);
  if (goMatch) {
    const rest = goMatch[2].replace(/\b(the|a|an|my|that|this|some)\b/g, "").replace(/\s+/g, " ").trim();
    if (canMatchToken(rest)) return true;
    for (const word of rest.split(/\s+/)) {
      if (canMatchToken(word)) return true;
    }
  }

  const enterPattern = /^(enter|go\s+in|go\s+into|go\s+inside)\s+(.+)$/;
  const enterMatch = cleaned.match(enterPattern);
  if (enterMatch) {
    const noun = enterMatch[2].replace(/\b(the|a|an|my|that|this|some)\b/g, "").trim();
    if (canMatchToken(noun)) return true;
    if (actionTokens.includes("enter") || actionTokens.includes("in")) return true;
  }

  if (tokens.length === 1) {
    if (canMatchToken(tokens[0])) return true;
  }

  return false;
}

function suggestMapping(input: string, scene: Scene): string | null {
  const moveActions = extractMoveActions(scene);
  const actionTokens = moveActions.map(a => ({
    token: a.id.replace(/^go_/, "").toLowerCase(),
    label: a.label,
    to: a.to,
  }));

  const cleaned = input.trim().toLowerCase();

  for (const at of actionTokens) {
    if (cleaned.includes(at.token) || at.token.includes(cleaned.replace(/^go\s+/, ""))) {
      return `"${cleaned}" -> go_${at.token} (${at.label}) -> ${at.to}`;
    }
  }

  return null;
}

function runAudit(scenesData: Record<string, Scene>): GapEntry[] {
  const gaps: GapEntry[] = [];

  for (const [sceneId, scene] of Object.entries(scenesData)) {
    const description = `${scene.description.long} ${scene.description.short}`;
    const moveActions = extractMoveActions(scene);

    if (moveActions.length === 0) continue;

    const availableExits = moveActions.map(a => ({
      id: a.id,
      label: a.label,
      to: a.to,
    }));

    for (const cueEntry of NARRATIVE_CUE_PATTERNS) {
      const match = description.match(cueEntry.pattern);
      if (!match) continue;

      const candidateInputs = cueEntry.candidates(match);
      const unresolvedInputs = candidateInputs.filter(input => !canResolveInput(input, scene));

      if (unresolvedInputs.length > 0) {
        const suggestion = suggestMapping(unresolvedInputs[0], scene);
        gaps.push({
          sceneId,
          sceneTitle: scene.title,
          cuePhrase: match[0],
          impliedInputs: candidateInputs,
          availableExits,
          unresolvedInputs,
          suggestedMapping: suggestion,
        });
      }
    }
  }

  return gaps;
}

function generateMarkdownReport(gaps: GapEntry[]): string {
  const lines: string[] = [];
  lines.push("# Narrative Exit Audit Report");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");
  lines.push(`Total gaps found: **${gaps.length}**`);
  lines.push("");

  if (gaps.length === 0) {
    lines.push("No narrative exit gaps detected. All cue phrases in scene descriptions resolve to available exits.");
    return lines.join("\n");
  }

  lines.push("## Gaps");
  lines.push("");

  const byScene = new Map<string, GapEntry[]>();
  for (const gap of gaps) {
    const key = gap.sceneId;
    if (!byScene.has(key)) byScene.set(key, []);
    byScene.get(key)!.push(gap);
  }

  for (const [sceneId, sceneGaps] of byScene) {
    const title = sceneGaps[0].sceneTitle;
    lines.push(`### ${title} (\`${sceneId}\`)`);
    lines.push("");
    lines.push("**Available exits:**");
    const exits = sceneGaps[0].availableExits;
    for (const exit of exits) {
      lines.push(`- \`${exit.id}\` (${exit.label}) -> \`${exit.to || "N/A"}\``);
    }
    lines.push("");

    for (const gap of sceneGaps) {
      lines.push(`**Cue phrase:** "${gap.cuePhrase}"`);
      lines.push("");
      lines.push("| Implied Input | Resolves? |");
      lines.push("|---|---|");
      for (const input of gap.impliedInputs) {
        const resolved = !gap.unresolvedInputs.includes(input);
        lines.push(`| \`${input}\` | ${resolved ? "YES" : "**NO**"} |`);
      }
      lines.push("");
      if (gap.suggestedMapping) {
        lines.push(`**Suggested mapping:** ${gap.suggestedMapping}`);
        lines.push("");
      }
    }
    lines.push("---");
    lines.push("");
  }

  return lines.join("\n");
}

function main() {
  const storyPath = path.resolve(__dirname, "../client/data/generatedStory.ts");
  const content = fs.readFileSync(storyPath, "utf-8");

  const scenesMatch = content.match(/export const SCENES:\s*Record<string,\s*Scene>\s*=\s*(\{[\s\S]*\});?\s*$/m);
  if (!scenesMatch) {
    console.error("Could not extract SCENES from generatedStory.ts");
    process.exit(1);
  }

  let scenesJson = scenesMatch[1];
  if (scenesJson.endsWith(";")) {
    scenesJson = scenesJson.slice(0, -1);
  }

  let scenes: Record<string, Scene>;
  try {
    scenes = JSON.parse(scenesJson);
  } catch (e) {
    console.error("Failed to parse SCENES JSON:", e);
    process.exit(1);
  }

  console.log(`Loaded ${Object.keys(scenes).length} scenes`);
  console.log("Running narrative exit audit...\n");

  const gaps = runAudit(scenes);

  const jsonReport = JSON.stringify(gaps, null, 2);
  const jsonPath = path.resolve(__dirname, "../docs/narrative-exit-audit.json");
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.writeFileSync(jsonPath, jsonReport, "utf-8");
  console.log(`JSON report written to: ${jsonPath}`);

  const markdownReport = generateMarkdownReport(gaps);
  const mdPath = path.resolve(__dirname, "../docs/narrative-exit-audit.md");
  fs.writeFileSync(mdPath, markdownReport, "utf-8");
  console.log(`Markdown report written to: ${mdPath}`);

  console.log(`\nTotal gaps found: ${gaps.length}`);

  if (gaps.length > 0) {
    console.log("\nTop gaps:");
    for (const gap of gaps.slice(0, 20)) {
      console.log(`  [${gap.sceneId}] "${gap.cuePhrase}" -> unresolved: ${gap.unresolvedInputs.join(", ")}`);
    }
  }
}

main();
