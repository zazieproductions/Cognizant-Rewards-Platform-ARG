# Roadmap

This is a creative-technology work, so the roadmap is organised by **ambition
level** rather than a fixed release schedule. Nothing here is a commitment; it
is a set of directions that follow from the current architecture.

## Near-term

Realistic improvements based on the existing, working system.

- **Audio for the refrigerator hum.** Actually synthesize the 17-second hum with
  the Web Audio API (no asset), parameterised by `depth` so "the hum adjusts to
  you." See `docs/technical/audio-engine.md`.
- **Split `src/App.tsx`.** Extract the dozen bespoke task panels into
  `src/components/task-panels/*` and `React.memo` the task list rows. This keeps
  the pure domain modules intact and reduces re-render surface.
- **Reduced-motion support.** Respect `prefers-reduced-motion` to disable the
  glitch overlay and Framer Motion transitions.
- **Persistence (optional).** Save balances/depth/completed tasks to
  `localStorage` so a worker can "return to their shift" between sessions. Make
  it a hidden toggle so the default experience stays ephemeral.
- **Extract design tokens.** Move the recurring hex values into Tailwind
  `@theme`/CSS variables so the palette is a single source of truth.
- **A "how to play" reveal.** The piece resets on reload with no instructions.
  A small, diegetic intro line ("You are already employed. Begin.") would help
  first-time visitors without breaking the fiction.

## Experimental

More ambitious creative possibilities that extend the existing systems.

- **WebMIDI / MIDI input.** Let a performer drive task completion (or the
  corruption level) from a MIDI controller — turning the dashboard into a
  playable instrument.
- **OSC input.** Accept OSC messages from a patch environment (e.g. over WebSocket)
  so the piece can be performed live with external tools.
- **Spatial audio.** Ambisonic/panning on the hum and any future sounds to make
  the "refrigerator" feel like it is in the room.
- **Downloadable output.** Let a worker export their completed ledger ("audit
  log") as a file — a souvenir of their complicity.
- **Procedural task generation.** A generator that composes new tasks from the
  existing category/vocabulary templates, so each session with `depth >= N`
  begins to invent its own assignments.
- **Persistence of the corruption arc.** Save the "narrative" of a run (which
  tasks were completed, in what order) rather than just the metrics.

## Research

Unusual directions worth exploring without implying commitment.

- **Shader systems.** Move the scanlines/grid/glitch into a WebGL fragment
  shader for richer, per-pixel signal decay (CRT curvature, chromatic
  aberration, phosphor ghosting).
- **AudioWorklets.** A custom `AudioWorkletProcessor` for the hum — the most
  flexible way to generate a believable, unstable room-tone.
- **Generative sequencing.** A planned, evolving sequence of tasks that reacts to
  the worker's past choices (not just `depth`).
- **Offline rendering.** A "render a full shift" mode that runs the entire task
  queue to a downloadable artifact (e.g. a film or a PDF ledger).
- **User-preset sharing.** Allow a worker to distribute their completed
  "ledger" as a shareable state, making the complicity collective.
- **Sensors.** Use device orientation / geolocation / microphone (only with
  explicit opt-in) to let the *room* influence the tasks — e.g. the hum answers
  to your actual ambient noise.
- **Live-performance modes.** A "performer view" with a configurable corruption
  path for a projection or installation setting.
- **Patch / node systems.** Expose the state machine as a visual patch (nodes +
  wires) so the audience can rewire the institution's rules in real time.

## Notes on scope

The corpus is intentionally **over-scoped and over-budget**: there are 20
authored tasks but only 9 have bespoke panels, and 2 reference media that doesn't
exist. That tension is part of the piece — the institution *promises* more than
it delivers. When adding features, prefer adding **one precise thing** over
broadening the surface. The strongest proposals are ones that deepen the
fiction's logic (the reward/depth loop, the surveillance language) rather than
generalising it into a generic creative-coding toy.
