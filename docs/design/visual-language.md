# Design — Visual Language

The visual language of Cognizant Rewards Platform is **cybernetic-institutional**
and **recovered/degraded**. It is not a glossy product; it is a terminal that
has been running since 1987 and is slowly going wrong. This document explains
the tokens, the palette, and the mood.

## The core idea

> **A dashboard that is alive, watching, and not on your side.**

The aesthetic mixes three registers that normally don't overlap:

1. **Institutional machinery** — forms, hairlines, registration marks, "Est.
   1987," a worker ID.
2. **Terminal / cybernetic** — monospace, log feeds, blinking cursor, currency
   glyphs, base64 strings.
3. **Signal decay** — glitches, scanlines, low-opacity grids, corrupted
   non-ASCII symbols.

## Palette

The base ground is a **near-black** `#0c0c0e`. The whole piece stays in a narrow
luminance band — dark grays and muted slate — punctuated by a handful of
saturated accents drawn from the six currencies.

### Neutrals

| Token | Hex | Use |
|-------|-----|-----|
| `ground` | `#0c0c0e` | Page background |
| `panel` | `#111113` / `#0f0f10` | Panel fills (translucent) |
| `panel-strong` | `#18181b` | System-note fill |
| `hairline` | `#1f2937` | Panel borders, separators |
| `hairline-strong` | `#374151` | Stronger borders, hover |
| `muted` | `#6b7280` | Labels, captions, timestamps |
| `body` | `#9ca3af` | Instructions, memo text |
| `text` | `#e5e7eb` | Titles, headings |
| `text-dim` | `#4b5563` | Locked/disabled text, de-emphasis |

### Accents (the six currencies)

| Currency | Color | Hex | Character |
|----------|-------|-----|-----------|
| LUNR | violet | `#a78bfa` | ₤ |
| VANT | amber | `#f59e0b` | ⱽ |
| MIRE | emerald | `#10b981` | ₥ |
| SCRIP | pink | `#ec4899` | § |
| WITNESS | red | `#ef4444` | ◈ |
| ECHO | green | `#00ff88` | ⦻ |

Palette usage rule: **neutral by default, accent only for meaning.** The accent
colors are largely reserved for currency values, warnings, and the handful of
status colors. This keeps the saturation meaningful.

## Typography

- **Body: `IBM Plex Mono`** — a monospace that reads like a typewriter/fax
  hybrid. The `*` selector applies it globally, so even labels and captions are
  monospace unless styled as headings.
- **Headings: `Inter`** — a grotesque sans, used for `h1/h2/h3` only. The
  contrast between a sans title block and monospace body gives the header that
  "corporate report stamped on a printout" feel.
- **Weights:** 400/500 only. No heavy weights, no italics except the
  authoritative "contradiction" lines.

## Shape & space

- **No rounded corners.** Every panel, button, and badge is a rectangle.
  Roundness would imply friendliness; this piece wants to feel filed.
- **Hairline borders everywhere.** The interface is built from boxes within
  boxes (a registration-mark motif).
- **Tight spacing.** Small type, small gaps, dense panels. The layout should
  feel like a form that is *almost* too small to read.
- **1-px texture.** The corporate grid (32×32), the scanlines on the audio/video
  placeholders, and the glitch overlay all use 1-px repeating gradients.

## Motifs

### The registration mark (logo)

The mark in the header is a small square-within-a-square:
`w-8 h-8 border` outer, `w-4 h-4 border` inner, with a translucent inner fill
and a green cursor core in the favicon. It reads as both a corporate seal and a
targeting reticle.

### The corruption bar

Every task with `corruptionLevel > 0` has a vertical gradient bar on its left
edge. Amber for level ≤3, red above, height proportional to `level * 15%`. This
is the only "data visualization" in the piece, and it quietly encodes the
corruption ranking in a way most users won't consciously parse.

### The glitch

An intermittent full-screen flash of red horizontal scanlines with a small
horizontal jitter. It is rare (~15% of 3-second ticks) and brief (150–350 ms),
so it reads as *interference*, not as a broken render. Its jitter is stored in
state so the render stays deterministic.

### The base64 string

In the footer: `VGhlcmUgaXMgbm8gZXNjYXBl` — base64 for **"There is no escape."**
It is muted (`#374151`) so it sits in the corner like a watermark. This is the
single best example of the piece's method: an encrypted message that rewards a
curious user with more dread.

## Mood vs. reference

- Avoid generic **SaaS** branding (rounded pastel buttons, gradients,
  illustrations).
- Avoid sterile **enterprise** docs (nothing diagram-like, no "we" language).
- The mood is closer to **CRT recovery**, **institutional horror**, and
  **surveillance bureaucracy** than to "dark mode developer portfolio."
