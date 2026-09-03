# Design — Interface System

The interface is a **damaged institutional terminal**. It reads like
productivity software that has been running since 1987 and has stopped
distinguishing between an employee, a memory, and a form. This document
describes the component system and its conventions. See
[`visual-language.md`](visual-language.md) for the tokens and
[`interaction-model.md`](interaction-model.md) for the conceptual meaning.

## Layout anatomy

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER                                                          │
│   identity row: mark · title · "A Division of Mnemonic          │
│                 Solutions · Est. 1987"      WORKER ID 7-443-19   │
│                                              SHIFT · TIER · HELP │
│   portfolio row: Compensation Portfolio     Performance Metrics  │
│                  (six currency balances)                        │
├───────────────────────────────┬─────────────────────────────────┤
│  MAIN (col-span 8)            │  SIDEBAR (col-span 4)            │
│   "Active Assignments"        │   System Feed (live log)         │
│   task cards (1..20)          │   Departmental Memos             │
│    · collapsed = title row    │   Emotional Labor Index (bars)   │
│    · expanded = detail panel  │   Compliance Notice (depth>=2)   │
├───────────────────────────────┴─────────────────────────────────┤
│  FOOTER                                                          │
│   © 1987-2024 Mnemonic Solutions LLC · Handbook · Manual ·       │
│   Reset Session            DEPTH · base64 string                 │
└─────────────────────────────────────────────────────────────────┘
```

## Component inventory

| Component | Role |
|-----------|------|
| `Header` | Identity, worker id, tier, portfolio, metrics. |
| `TaskCard` | Collapsed assignment row. Status dictates border/opacity/badge. |
| `TaskPanel` | Expanded detail: system note + bespoke interaction + submit. |
| `SystemFeed` | Type-colored scrolling log with blinking cursor. |
| `DepartmentalMemos` | Three static memos from fictional bureaus. |
| `EmotionalLaborIndex` | Four metric bars + pause observation. |
| `SupportTerminal` | Floating HELP panel (AnimatePresence). |
| `Footer` | Legal fiction, reset, depth, base64 string. |

## Visual conventions

### Panels

- Every panel is a **bordered box**: `border` `#1f2937` (inner) or `#374151`
  (stronger), on a translucent `#111113/70` or `#0f0f10/70` background.
- `backdrop-blur` gives the translucent panels a frosted feel against the grid.
- Panels are densely stacked with small gaps (`space-y-3`), minimal padding, and
  no rounded corners — institutional, not friendly.

### State treatment for tasks

| Status | Border | Background | Opacity | Badge |
|--------|--------|-----------|---------|-------|
| locked | `#1f2937` | default | 0.4 | task id, muted |
| flagged | `#ef4444/50` | `#1a0f0f/70` | 1 | `!` pulsing |
| completed | `#374151` | default | 0.6 | `✓` green |
| available | `#374151` | `#111113/70` (hover `#141416/80`) | 1 | task id |

### State colors

The six currency colors double as the interface's state palette:

| Color | Hex | Used for |
|-------|-----|----------|
| Violet | `#a78bfa` | LUNR, system log, "MEMORY FRAGMENT" notes |
| Amber | `#f59e0b` | VANT, warnings, tier, accuracy, slider thumb |
| Emerald | `#10b981` | MIRE, "LIVE", completed, nominal compliance |
| Pink | `#ec4899` | SCRIP |
| Red | `#ef4444` | WITNESS, observations, flagged, identity-drift |
| Green | `#00ff88` | ECHO, the mark's cursor core |

## Type conventions

- **Labels** are uppercase + wide tracking (`uppercase tracking-widest`) at
  10–11 px.
- **Body** is `IBM Plex Mono` at 11–13 px.
- **Headings** use `Inter` at 13–15 px.
- Tiny caption text (`text-[10px] text-[#4b5563]`) supplies the deadpan
  "system observation" asides.

## Control conventions

- **Buttons** are flat rectangles, `py-2` / `py-2.5`, with a 1-px border. Hover
  shifts the border/bg one step lighter. No rounded corners, no shadows.
- **The stare square** uses a `crosshair` cursor; the glitch overlay is
  `pointer-events: none`.
- **Range sliders** are styled with a thin track (`4px`, `#1f2937`) and an
  **amber square thumb**, matching the instrument aesthetic.

## Responsive behaviour

- Below `xl`, the 8/4 grid collapses to a single column (tasks then sidebar).
- The desktop header's worker-id/tier block is hidden below `md`.
- The Support Terminal is a fixed bottom-right overlay at `w-[360px]`.

## Hostility as a feature

The interface is deliberately **not** ergonomic:

- Small, dense type; low-contrast muted labels; many panels.
- Pervasive surveillance language in the chrome ("You paused 3.2s before login.
  Noted.").
- A compliance metric that can drop into the red and a "Withdrawal threshold"
  that is never reached.
- A glitch that intermittently tears across the screen.

This is the point. The design system's job is to make a *hostile* thing feel
*inevitable* and *institutional*, not broken.
