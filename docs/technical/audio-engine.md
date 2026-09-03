# Technical — Audio Engine (planned)

> **Status: not implemented.** Task 003's "refrigerator hum" is referenced by the
> fiction and a PLAY button is rendered, but no audio currently exists. This
> document describes the intended architecture so the feature can be added
> without reverse engineering.

## Why there is no audio

The original scaffold never implemented audio. The furniture — a black
"player" box, a `▶ PLAY HUM (0:17)` button, and six classification buttons —
is present, but pressing PLAY does nothing. This is a documented **known
limitation**, not a bug: the fiction ("the hum adjusts to you") is deliberately
suggestive, and the piece works without it.

## Intended behaviour

- Pressing PLAY triggers a **~17-second** low-frequency hum.
- Volume is **not adjustable** (the instruction says "Do not adjust volume. The
  hum adjusts to you.").
- The hum should be **procedurally generated** — no audio asset file — so it
  can be parameterised by the worker's corruption depth and behave slightly
  differently each session.

## Proposed architecture (Web Audio API)

```
User clicks PLAY
   │
   ▼
AudioContext (created on gesture — required by autoplay policy)
   │
   ▼
[Oscillator ≈ 55–60 Hz]  ──┐
[Sub oscillator ≈ 110 Hz] ─┤──► [Gain] ──► [LowpassFilter] ──► [destination]
                           │
[LFO (0.5 Hz) → Gain.mod] ─┘   amplitude hum = low, intentional
                                        "compressor cycle" event at 0:09
```

Concrete plan:

1. Create an `AudioContext` lazily on the first PLAY click (autoplay policies
   require a user gesture).
2. Build a **50–60 Hz oscillator** plus a quieter **110 Hz sub**.
3. Route through a **lowpass filter** (~200 Hz) to remove harmonics and make it
   read as a room-tone hum rather than a tone.
4. Modulate the gain with a slow **LFO** so the hum "breathes."
5. Schedule a brief **compressor-cycle** transient at ~9 s (the instructions
   ask the worker to "focus on the compressor cycle at 0:09").
6. Fade out after ~17 s.
7. Optionally tie one parameter (e.g. filter cutoff or detune) to the global
   `depth` so the hum "adjusts to you."

## Where it would live

A new module, e.g. `src/lib/audio.ts`, exporting a
`playRefrigeratorHum({ depth, onEnd })` function. The App's task-003 panel would
call it on PLAY. `src/lib/audio.ts` should be **pure harness around the Web Audio
API** — no React — and would be individually unit-testable with a mocked
`AudioContext`.

## Alternatives considered

- **AudioWorklet** — the most flexible (a custom `AudioWorkletProcessor` for the
  hum), but heavier and harder to keep testable. Good for a future research
  direction.
- **Static audio file** — simplest, but adds an asset and loses the generative
  "adjusts to you" property. Lower priority.
- **Web Audio synthetic hum** (the recommended path) — no asset, no network,
  parameterisable, and fully consistent with the procedural ethos of the piece.

## Acceptance criteria

- PLAY starts a ~17-second hum without an asset file.
- No audio plays before a user gesture (autoplay-safe).
- Volume is not user-adjustable.
- The piece still loads instantly (no preloaded audio).
- The existing classification buttons work unchanged.
