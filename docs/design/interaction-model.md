# Design — Interaction Model

This is the **conceptual** document: what interaction *means* in this piece, and
how the technical systems produce the aesthetic effects. It is written with the
precision of an engineer and the intelligence of an artist. It avoids
art-school vagueness.

## The premise

You are not playing a game. You are **working a shift**. The interface is a
rewards dashboard that pays you in currencies you cannot spend, monitors you in
metrics that mean nothing, and assigns you tasks that are impossible by design.
You are Worker 7-443-19, employed since 1987, by a division of Mnemonic
Solutions.

## What interaction means here

### 1. Completion is a trap, not a goal

In most software, a checkbox means "done, moving on." Here, **completing a task
can debit you.** Task 012 ("You have exceeded your daily permitted nostalgia")
*requires* completion but subtracts 12 LUNR. Task 018 ("We detected unauthorized
empathy") is *flagged* — it cannot be completed at all, yet it exists in your
queue forever, pulsing red. The system's reward loop is a treadmill: you are
always rewarded, but the reward is a ledger entry, not an outcome.

This inverts the learner's assumption that a progress bar measures progress.
Here the "progress" is the accumulation of corruption (`depth`), and the only
meaningful state change is `NOMINAL → FLAGGED` as you unlock tasks that are
*dangerous* to understand.

### 2. The system observes you

The chrome is full of surveillance-as-language:

- The seed log: *"You paused 3.2s before login. Noted."*
- The pause timer: at 43 seconds it logs *"43 second pause detected. Noted."*
- The Emotional Labor Index tracks "Cursor Eye Contact" as a percentage and
  measures your gaze at the stare-square.

The interaction model makes you **feel watched by a machine that is only
pretending to understand you.** The machine does not actually record anything —
there is no backend — but the *form* of the interface (live feed, metrics,
observations) creates the sensation. This is the conceptual core.

### 3. Agency is bounded and non-consensual

Some tasks let you *believe* you have agency:

- **004 hallways**: you select from a grid.
- **005 captcha**: you "click all images."
- **006 rotation**: you drag a slider to find the "optimal" angle.

But the choice is always constrained by the system's own rules, which are
arbitrary and unstated until you violate them (e.g. "If you select zero
hallways, you must provide justification in triplicate"). The tasks are **not
solvable** in any conventional sense — there is no right answer to "did the
refrigerator contain regret?" — so your agency is exercised within a machine
that will accept any answer and credit you anyway.

### 4. Tasks are authored, not generated

The corpus is fixed and hand-written. This is important: the strangeness is
**authored**, not emergent from a model. Every title, instruction, warning, and
contradiction is deliberate. The piece is closer to a **curated archive** than a
generative system. It is a satirical collection of the things a total
bureaucracy would ask of you if it could.

## How the technical systems produce aesthetic effects

### Procedural rules → deadpan surrealism

The `minDepth` gating is a mundane technical mechanism (a number compared to a
number). But applied to *this* content, it produces a genuine dramatic
structure: you start with six accessible tasks, and completing them *lowers you
into deeper corruption*. The "difficulty curve" of a game becomes the "descent
into obedience" of the fiction. The simplest possible state machine is doing
the work of a narrative arc.

### Randomness → intentional instability

The glitch overlay fires on a `Math.random() > 0.85` check every 3 seconds. It
is **not** a bug and **not** a rendering error — it is a *scheduled* breakdown.
The technical randomness is used to make the interface feel fragile, like a
signal that could fail at any moment. This is "computed instability": the
interference is generated, so it is reproducible and controllable, but it *feels*
accidental.

### Feedback loops → complicity

Every completion updates your balance, log, and depth simultaneously. The log
confirms it in the machine's voice ("TASK 004 COMPLETE: +22 LUNR"). This
feedback loop is what makes you a **participant**: you are not reading about a
surveillance state, you are *transacting* with it. The loop closes and you are
complicit.

### Temporality → scheduling of dread

- The gaze timer (task 007) runs on a **100 ms** tick. Waiting 43 seconds is a
  *duration*, not a state. The system forces you to spend real time staring at
  it, and it knows.
- The pause timer is real time; the system logs when you idle.
- The glitch appears on a real 3-second cadence.

The piece uses the **browser's own clock** as a dramatic instrument. The 43 s
figure recurs (stare target, pause observation, "paused 43 seconds before
answering") — it is a number the institution is obsessed with.

### Computational constraints used artistically

- **No backend.** The surveillance is *simulated*. This is the most important
  constraint: the piece makes you feel watched while provably recording nothing.
  The "hostility" is a browser illusion.
- **No audio.** The refrigerator hum is *described* but never played. The gap
  between what the machine promises (audio) and what it delivers (silence) is
  itself eerie.
- **No persistence.** You cannot log in, save, or continue. The shift resets on
  reload, like a memory that does not stick.

## User agency, summarised

| Element | Kind | What it gives the worker |
|---------|------|--------------------------|
| Task selection | Real choice | Which assignment to open. |
| Hallway grid / captcha | Bounded choice | Select a subset with no criteria you can satisfy. |
| Rotation slider | Continuous control | An adjustable input, but only "optimal" at 147°/213°. |
| Stare square | Duration-based | Real, measured attention; the machine watches you watch it. |
| Reset | Escape | A hard reset of the shift — the only true way out. |

## Conclusion

The piece is a **hostile instrument**. Its technical systems (a pure state
machine, authored data, scheduled randomness, real-time timers, a zero-network
illusion) are not invisible plumbing — they *are* the aesthetic. The art is in
the gap between the machine's confidence and the meaninglessness of what it
asks, and the craft is in making that gap feel like an institution rather than a
glitch.
