export interface Action {
  id: string;
  label: string;
  type: "command" | "event" | "move";
  command?: string;
  to?: string;
  requiresItem?: string;
  removesAction?: boolean;
  addsItem?: string;
  setsFlag?: string;
  lightCost?: number;
}

export interface Scene {
  id: string;
  title: string;
  description: string;
  actions: Action[];
  items?: string[];
}

export interface Item {
  id: string;
  name: string;
  description: string;
  usable: boolean;
  useEffect?: {
    lightBonus?: number;
    message: string;
    setsFlag?: string;
  };
}

export const ITEMS: Record<string, Item> = {
  lamp: {
    id: "lamp",
    name: "Oil Lamp",
    description: "A battered oil lamp. Its warm glow pushes back the darkness.",
    usable: false,
  },
  fuel: {
    id: "fuel",
    name: "Lamp Fuel",
    description: "A small canister of lamp oil. Could restore some light.",
    usable: true,
    useEffect: {
      lightBonus: 30,
      message: "You refill the lamp. The flame burns brighter.",
    },
  },
  chalk: {
    id: "chalk",
    name: "Chalk",
    description: "A stick of white chalk. Useful for marking paths.",
    usable: true,
    useEffect: {
      message: "You mark an arrow on the wall.",
      setsFlag: "markedPath",
    },
  },
  rope: {
    id: "rope",
    name: "Frayed Rope",
    description: "An old mining rope. Still seems sturdy enough.",
    usable: false,
  },
  pickaxe: {
    id: "pickaxe",
    name: "Rusty Pickaxe",
    description: "A miner's tool, long abandoned. The head is dull but heavy.",
    usable: false,
  },
};

export const SCENES: Record<string, Scene> = {
  chasm_base: {
    id: "chasm_base",
    title: "Base of the Chasm",
    description:
      "Cold air. Dust. You lie at the bottom of a vertical mining shaft, the distant sky a pale disc far above. Rough-hewn walls rise around you, disappearing into shadow. A faint draft whispers from a tunnel to the east.\n\nAn old oil lamp lies nearby, its glass clouded but intact.",
    actions: [
      { id: "look", label: "LOOK AROUND", type: "command", command: "look" },
      {
        id: "take_lamp",
        label: "TAKE LAMP",
        type: "event",
        addsItem: "lamp",
        setsFlag: "hasLamp",
        removesAction: true,
      },
      { id: "go_east", label: "GO EAST", type: "move", to: "east_tunnel" },
    ],
    items: ["lamp"],
  },
  east_tunnel: {
    id: "east_tunnel",
    title: "East Tunnel",
    description:
      "The passage narrows, forcing you to duck. Cold drafts push against your face, carrying the scent of mineral and damp. The walls are scratched with old tally marks—someone counted days here.\n\nThe tunnel continues east toward a faint glow. A side passage leads north into deeper darkness.",
    actions: [
      { id: "look", label: "LOOK", type: "command", command: "look" },
      { id: "go_west", label: "GO WEST", type: "move", to: "chasm_base" },
      { id: "go_east", label: "GO EAST", type: "move", to: "split_passage" },
      { id: "go_north", label: "GO NORTH", type: "move", to: "old_gear_room" },
    ],
  },
  old_gear_room: {
    id: "old_gear_room",
    title: "Old Gear Room",
    description:
      "A cramped alcove filled with rusted mining equipment. Broken carts, bent rails, and piles of debris clutter the space. The air is thick with dust.\n\nAmong the wreckage, you spot a small fuel canister and a coil of rope.",
    actions: [
      { id: "look", label: "LOOK", type: "command", command: "look" },
      {
        id: "take_fuel",
        label: "TAKE FUEL",
        type: "event",
        addsItem: "fuel",
        removesAction: true,
      },
      {
        id: "take_rope",
        label: "TAKE ROPE",
        type: "event",
        addsItem: "rope",
        removesAction: true,
      },
      { id: "go_south", label: "GO SOUTH", type: "move", to: "east_tunnel" },
    ],
    items: ["fuel", "rope"],
  },
  split_passage: {
    id: "split_passage",
    title: "Split Passage",
    description:
      "The tunnel opens into a junction. Three paths diverge:\n\n• North: A steep incline, rough-cut steps ascending into shadow.\n• South: The sound of running water echoes from below.\n• West: The way you came.\n\nScratched into the wall, barely visible: an arrow pointing north.",
    actions: [
      { id: "look", label: "LOOK", type: "command", command: "look" },
      { id: "go_west", label: "GO WEST", type: "move", to: "east_tunnel" },
      { id: "go_north", label: "GO NORTH", type: "move", to: "exit_slope" },
      {
        id: "go_south",
        label: "GO SOUTH",
        type: "move",
        to: "underground_stream",
      },
    ],
  },
  underground_stream: {
    id: "underground_stream",
    title: "Underground Stream",
    description:
      "Water rushes through a channel carved by centuries of flow. The stream is waist-deep and fast-moving, disappearing into a gap too small to follow.\n\nOn a ledge above the water, you notice a stick of chalk and a rusty pickaxe.",
    actions: [
      { id: "look", label: "LOOK", type: "command", command: "look" },
      {
        id: "take_chalk",
        label: "TAKE CHALK",
        type: "event",
        addsItem: "chalk",
        removesAction: true,
      },
      {
        id: "take_pickaxe",
        label: "TAKE PICKAXE",
        type: "event",
        addsItem: "pickaxe",
        removesAction: true,
      },
      { id: "go_north", label: "GO NORTH", type: "move", to: "split_passage" },
    ],
    items: ["chalk", "pickaxe"],
  },
  exit_slope: {
    id: "exit_slope",
    title: "Exit Slope",
    description:
      "The steps lead upward, each one bringing fresher air. The darkness fades. Ahead, a crack in the rock reveals daylight—real, golden daylight.\n\nYou squeeze through the gap and emerge onto a hillside. The sun blinds you. Wind carries the scent of grass and freedom.\n\nYou've escaped the chasm.",
    actions: [
      {
        id: "escape",
        label: "BREATHE FREE",
        type: "event",
        setsFlag: "escaped",
      },
    ],
  },
};

export const INTRO_MESSAGES = [
  {
    type: "narration" as const,
    text: "You fell.\n\nOne moment, solid ground. The next, darkness and the shriek of breaking timber.",
  },
  {
    type: "narration" as const,
    text: "You don't know how long you were unconscious. Hours? Days? Your head throbs. Your supplies are gone—scattered somewhere in the collapse above.",
  },
  {
    type: "narration" as const,
    text: "Only one thing is certain: you must find a way out.",
  },
];

export const HELP_TEXT = `COMMANDS:
You can use natural language! Try phrases like:

LOOKING AROUND:
• "look" or "look around" or "examine"

ITEMS:
• "pick up the lamp" or "take lamp" or "grab rope"
• "use fuel" or "light the lamp"
• "inventory" or "what do I have"

MOVEMENT:
• "go north" or "head east" or just "north"

GAME:
• "save" or "load" or "new game"
• "help" or "?"

Tap quick action buttons or type naturally!`;
