# Technical — Rendering System

Cognizant Rewards Platform is rendered with **React DOM + Tailwind CSS**. There
is no Canvas, WebGL, or SVG-based rendering. The "graphics" that give the piece
its identity are layered CSS and a few positioned elements.

## What actually gets painted

### 1. Corporate grid background

A fixed, full-viewport layer at `opacity: 0.02`:

```tsx
<div className="fixed inset-0 opacity-[0.02] pointer-events-none">
  <div className="absolute inset-0" style={{
    backgroundImage: `linear-gradient(#6b7280 1px, transparent 1px),
                      linear-gradient(90deg, #6b7280 1px, transparent 1px)`,
    backgroundSize: '32px 32px'
  }} />
</div>
```

Two 1-px `linear-gradient`s compose into a fine 32×32 grid — the "engineering
paper" texture that makes the whole thing feel like a form or a floor plan.

### 2. Task cards

Each task is a `motion.div` (from `framer-motion`) with `layout` enabled, so the
list animates when a card expands or the order changes. The card's border,
opacity, and background are driven by its `status`:

```
locked     → border #1f2937, opacity 40
flagged    → border #ef4444/50, bg #1a0f0f/70
completed  → border #374151, opacity 60
available  → border #374151, hover #4b5563, bg #141416/80
```

A thin 2-px **corruption indicator** runs down the left edge, colored amber for
`corruptionLevel <= 3` and red above, with a height proportional to the level.

### 3. Bespoke panels

Each expanded panel is conditionally rendered JSX keyed by task ID. The
"graphics" here are DOM + CSS:

- **004 hallway grid:** a 4×6 grid of `<button>`s, each a bordered box that
  fills violet when toggled.
- **006 rotation figure:** nested `div`s rotated by `transform: rotate(Ndeg)`.
  A staff-shaped rectangle, a head circle, and a red "guilt" line that rotates
  in the opposite direction.
- **007 gaze square:** a 32×32 box with `box-shadow` when recognized, a pulsing
  center dot, and a progress bar beneath.
- **003 hum player / 011 video:** a black box with a CSS scanline or
  `feTurbulence` noise overlay (an inline SVG `url()` data URI), and a centered
  timestamp.

### 4. Glitch overlay

An `AnimatePresence`-wrapped `motion.div` that flashes a full-screen red scanline
pattern:

```tsx
background: repeating-linear-gradient(0deg, transparent, transparent 2px,
                                      #ef4444 2px, #ef4444 3px),
transform: translateX(${glitchOffset}px)
```

It is `fixed`, `pointer-events: none`, `mix-blend-screen`, and `z-[100]`. The
horizontal jitter is read from state (`glitchOffset`) so the render stays pure.

## Animation system

`framer-motion` handles the three animated surfaces:

| Surface | Technique |
|---------|-----------|
| Task card expand/collapse | `AnimatePresence` + `motion.div` `height: 0 → auto` |
| Task list reorder | `motion.div` `layout` |
| Glitch flash | `motion.div` opacity keyframes |
| Support Terminal | `AnimatePresence` + `motion.div` `opacity/y` |

## The one imperative "media" element

Task 011's "training video" placeholder uses an **inline SVG data URI** for a
noise texture:

```
url("data:image/svg+xml,%3Csvg ... %3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E ...")
```

This renders a static grain behind the timestamp — a convincing "VHS" texture
with zero asset files and zero network requests.

## Layout

- Overall container: `max-w-[1400px] mx-auto p-3 md:p-6`.
- Main grid: `grid-cols-1 xl:grid-cols-12`, splitting `8` (tasks) / `4`
  (sidebar) on wide screens, stacking on smaller ones.
- Header is a bordered panel with a two-row layout (identity row + portfolio /
  metrics row).
- Sidebar holds the System Feed, Departmental Memos, and Emotional Labor Index,
  each a bordered panel.

## Fonts & type

- Body: `IBM Plex Mono` (loaded via Google Fonts `@import` in a `<style>` tag),
  with `* { font-family: 'IBM Plex Mono', monospace }`.
- Headings: `Inter` (`h1, h2, h3 { font-family: 'Inter', sans-serif }`).
- The `<style>` block also defines the custom scrollbars and the range-slider
  thumb (amber square).

Because fonts load over the network (and the screenshot script blocks external
requests), a system monospace fallback renders in the interim, so the UI is
never blank.

## Performance of the render

- Small DOM (≈20 cards + sidebar). No heavy tree.
- CSS transforms (`rotate`, `translateX`) are compositor-friendly.
- The glitch overlay is a full-screen repaint during its ~150–350 ms flash, but
  it is infrequent and layered above `pointer-events: none`.

## Design tokens in code

The recurring colors in the JSX are arbitrary Tailwind values (`#0c0c0e`,
`#111113`, `#1f2937`, `#374151`, `#6b7280`, `#9ca3af`, `#e5e7eb`) and the six
currency colors in `src/lib/currency.ts`. They are **not** currently extracted
into CSS variables — if the corpus grows, extracting them into Tailwind theme
tokens is the natural next step (see `ROADMAP.md`).
