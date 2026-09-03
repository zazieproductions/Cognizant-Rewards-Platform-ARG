# Examples

This folder holds runnable examples, extensions, and small explorations that
use the pieces of Cognizant Rewards Platform (the task corpus, the currency
system, or the state model) outside the main app.

It's currently **empty by design** — the main artifact is the single-page app
itself. If you build something on top of the pure domain modules
(`src/lib/*`), drop a self-contained example here so it stays isolated from the
bundle. Keep examples small and dependency-light; prefer the existing primitives
(Web Audio, CSS, `framer-motion`) over new packages.

Idea for a first example: **`humsynth.mjs`** — a standalone Web Audio hum
synthesizer demonstrating the proposed
[`audio-engine`](../docs/technical/audio-engine.md) approach, runnable with
`node examples/humsynth.mjs` (needs a browser/AudioContext host).
