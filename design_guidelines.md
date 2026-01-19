# Ascent - Design Guidelines

## Brand Identity

**Purpose**: A survival text adventure where players explore a dark mining chasm, managing light and resources to escape. The game creates tension through atmospheric storytelling and strategic decision-making.

**Aesthetic Direction**: **Organic/natural meets brutally minimal** - A dark, underground world illuminated only by a fragile amber lamp. The interface should feel like peering into darkness with minimal UI chrome, letting the narrative and lamp glow dominate. Think: atmospheric, tense, immersive cave exploration.

**Memorable Element**: The ever-present amber lamp glow that serves as both visual anchor and gameplay mechanic - it pulses subtly, dims with low fuel, and provides the only warmth in an otherwise cold, dark interface.

---

## Navigation Architecture

**Root Navigation**: Stack-only (single-flow game experience)

**Core Screens**:
1. **Main Game** - Primary narrative feed with command input
2. **Inventory** - Player items and resources (modal)
3. **Map** - Explored areas visualization (modal)
4. **Settings** - Game options and profile (modal)
5. **Game Over** - Death/escape results (modal overlay)

**No Authentication** - Single-player experience with local save state.

---

## Screen-by-Screen Specifications

### Main Game Screen
**Purpose**: The core gameplay experience - reading narrative, making decisions, exploring the chasm.

**Layout**:
- **Header**: Transparent, no title. Left: menu icon (hamburger). Right: lamp fuel indicator (amber circular progress ring with percentage)
- **Main Content**: ScrollView (narrative feed)
  - Message bubbles: narrative text appears as dark cards with subtle amber left border
  - Quick action buttons appear below relevant narrative moments (3 max, horizontally scrollable if needed)
  - All messages stack vertically with timestamps
- **Bottom Input**: Fixed text input bar with amber glow when focused
  - Placeholder: "Enter command..."
  - Send icon: feather "send" in amber
- **Safe Area Insets**: 
  - Top: headerHeight + Spacing.xl
  - Bottom: Spacing.xl + insets.bottom + inputBarHeight

**Components**: 
- Narrative message cards (dark surface, amber accent)
- Quick action buttons (rounded, dark with amber border, compact)
- Text input with submit
- Lamp fuel indicator (circular progress, amber)

**Empty State**: N/A (game starts with intro narrative)

### Inventory Screen (Modal)
**Purpose**: View collected items and resources.

**Layout**:
- **Header**: Non-transparent dark surface. Title: "Inventory". Left: close icon (X). No right button.
- **Main Content**: ScrollView grid (2 columns)
  - Item cards: dark surface with item name, icon placeholder, quantity
  - Empty slots shown as dashed borders
- **Safe Area Insets**:
  - Top: Spacing.xl
  - Bottom: insets.bottom + Spacing.xl

**Empty State**: Illustration showing empty backpack with text "Your pack is empty"

### Map Screen (Modal)
**Purpose**: Visualize explored tunnel network.

**Layout**:
- **Header**: Non-transparent dark surface. Title: "Map". Left: close icon (X). No right button.
- **Main Content**: ScrollView (both directions)
  - Simple node-and-line visualization (current location highlighted in amber)
  - Location nodes: small circles, visited = dim amber, current = bright amber, unexplored = dark outline only
- **Safe Area Insets**: Same as Inventory

**Empty State**: "You haven't explored enough to map your surroundings"

### Settings Screen (Modal)
**Purpose**: Game options and player profile.

**Layout**:
- **Header**: Non-transparent dark surface. Title: "Settings". Left: close icon (X). No right button.
- **Main Content**: ScrollView with grouped sections
  - **Profile**: Avatar (preset generated), display name field
  - **Game Options**: Text speed slider, auto-save toggle, reset game (dangerous action, nested confirmation)
  - **About**: Version number, credits
- **Safe Area Insets**: Same as Inventory

### Game Over Screen (Modal Overlay)
**Purpose**: Show death message or escape success.

**Layout**:
- Semi-transparent dark overlay over main game
- Centered card with result (death reason or escape narrative)
- Two buttons: "Restart" (amber), "Main Menu" (outline)

---

## Color Palette

**Primary**: Amber lamp glow
- Primary: `#FF9500` (amber/warm orange)
- Primary Dark: `#CC7700`
- Primary Dim: `#664400` (low fuel state)

**Backgrounds**: Deep cave darkness
- Background: `#0A0A0A` (almost black with warm tint)
- Surface: `#1A1612` (dark brown-black, card backgrounds)
- Surface Elevated: `#2A2218` (slightly lighter, modals)

**Text**: Earthy, readable on dark
- Text Primary: `#E8DDD0` (warm off-white, easy on eyes)
- Text Secondary: `#A89580` (dimmer, timestamps/labels)
- Text Disabled: `#5A5248`

**Semantic**:
- Danger: `#D32F2F` (critical warnings, low fuel)
- Success: `#66BB6A` (escape, positive outcomes)

---

## Typography

**Font Choice**: System font stack (SF Pro for iOS, Roboto for Android) - optimal readability in low-light UI.

**Type Scale**:
- **Heading**: 28pt, Bold (Game Over titles)
- **Title**: 20pt, Semibold (Screen headers)
- **Body**: 16pt, Regular (Narrative text, most readable size)
- **Caption**: 14pt, Regular (Timestamps, labels)
- **Button**: 16pt, Semibold (Action buttons)

**Line Height**: 1.5x for body text (critical for readability in narrative feed)

---

## Visual Design

- **Icons**: Feather icons from @expo/vector-icons in amber or text-secondary colors
- **Touchable Feedback**: Amber overlay (10% opacity) on press for buttons, subtle scale (0.97) for cards
- **Shadows**: Minimal - only floating action buttons use subtle shadow (offset: width 0, height 2, opacity 0.10, radius 2)
- **Borders**: 1px amber borders for quick action buttons, dashed borders for empty inventory slots
- **Lamp Fuel Indicator**: Circular progress ring, 40px diameter, 3px stroke width, amber color that transitions to danger color below 20%

---

## Assets to Generate

**Required**:
1. **icon.png** - App icon: Amber lamp glowing in dark circular chasm, top-down view. *WHERE USED: Device home screen*
2. **splash-icon.png** - Splash icon: Simplified lamp silhouette in amber. *WHERE USED: App launch screen*
3. **empty-inventory.png** - Empty backpack illustration, simple line art in dim amber. *WHERE USED: Inventory screen when no items*
4. **lamp-avatar.png** - Preset user avatar: Stylized miner's lamp icon. *WHERE USED: Settings profile section*

**Recommended**:
5. **escape-success.png** - Light streaming from above, player silhouette climbing. *WHERE USED: Game Over screen (escape)*
6. **death-darkness.png** - Extinguished lamp, fading to black. *WHERE USED: Game Over screen (death)*

**Asset Style**: Simple, atmospheric line art with amber accent glow. Minimal detail, maximum mood. Avoid busy/complex illustrations - darkness and negative space are features, not bugs.