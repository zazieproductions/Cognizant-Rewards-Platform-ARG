# Documentation index

The documentation is organised by **reader intent**, following a strict
hierarchy so you can move from orientation → architecture → subsystem → code
without getting lost.

```
README.md            ← orientation (what it is, how to run, what it's like)
ARCHITECTURE.md      ← system-level explanation (lifecycle, modules, state,
                       rendering, data, event flow, build, perf, decisions)
docs/technical/*     ← subsystem detail (state, data flow, rendering, audio, perf)
docs/design/*        ← the artistic system (interface, visual language,
                       interaction model / concept)
docs/development/*   ← setup, debugging, deployment
docs/images/         ← real screenshots + social preview
```

## Why this split

- **`README.md`** answers "what am I looking at and how do I run it?" for the
  first-time visitor, the evaluator, the engineer, and the curator.
- **`ARCHITECTURE.md`** answers "how is the system put together?" at the
  system level.
- **`docs/technical/`** answers "how does the subsystem work?" with enough depth
  to extend it.
- **`docs/design/`** answers "why does it feel the way it does?" and
  "how do the technical systems produce the aesthetic?"
- **`docs/development/`** answers "how do I get set up, debug, and ship?"

## Files

| File | Audience |
|------|----------|
| `technical/state-model.md` | Engineer extending the state or task gating. |
| `technical/data-flow.md` | Engineer tracing a completion through the system. |
| `technical/rendering-system.md` | Engineer working on the visuals/animation. |
| `technical/audio-engine.md` | Engineer adding the planned audio. |
| `technical/performance.md` | Engineer reasoning about the bundle/runtime budget. |
| `design/interface-system.md` | Designer / developer working on the UI. |
| `design/visual-language.md` | Anyone matching the aesthetic. |
| `design/interaction-model.md` | Curator / collaborator / artist. |
| `development/setup.md` | New contributor. |
| `development/debugging.md` | Contributor hitting an error. |
| `development/deployment.md` | Maintainer shipping to GH Pages. |
| `development/repository-audit.md` | The pre-refactor audit and rationale. |
