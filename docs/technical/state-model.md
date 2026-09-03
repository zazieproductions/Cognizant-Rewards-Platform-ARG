# Technical — State Model

The state model of Cognizant Rewards Platform is intentionally small. There is
no store, no reducer, and no global subscription. Everything lives in one
component (`src/App.tsx`) as local `useState`, because the entire interface on
screen is driven by roughly a dozen values that all interact.

## State inventory

| State | Type | Initial | Writes |
|-------|------|---------|--------|
| `balances` | `Record<Currency, number>` | `{ LUNR: 144.7, VANT: 23.0, MIRE: 0, SCRIP: 892.11, WITNESS: 7, ECHO: 7443.19 }` | `completeTask`, `handleReset` |
| `depth` | `number` | `0` | `completeTask` (max), `handleReset` |
| `completedTasks` | `Set<string>` | `new Set(['001','002'])` | `completeTask`, `handleReset` |
| `selectedTask` | `Task \| null` | `null` | card click |
| `taskAnswers` | `TaskAnswers` | `{}` | bespoke panels |
| `showTerminal` | `boolean` | `false` | HELP button |
| `hoverStareTime` | `number` | `0` | gaze effect |
| `stareCompleted` | `boolean` | `false` | gaze effect |
| `cursorEyeContact` | `number` | `0` | `mousemove` |
| `pauseTimer` | `number` | `0` | pause interval |
| `logs` | `LogEntry[]` | 3 seed entries | `completeTask`, intervals, `handleReset` |
| `glitch` | `boolean` | `false` | glitch interval |
| `glitchOffset` | `number` | `0` | glitch interval |

## The task-status derivation

The most important derived value is a task's **effective status**. It is not
stored. It is computed on every render by
[`resolveTaskStatus`](../../src/lib/tasks.ts):

```ts
function resolveTaskStatus(task, depth, completedTasks): TaskStatus {
  if (completedTasks.has(task.id)) return 'completed'
  if (depth >= task.minDepth) return task.status
  return 'locked'
}
```

Why this matters:

- A task the worker already submitted stays **completed** forever.
- A task below the required `minDepth` renders **locked** regardless of its
  authored base status.
- Task 018 is authored `flagged`; it only shows as `flagged` (not locked) once
  `depth >= 4`.
- Tasks 001/002 are authored `completed` so they never re-appear as actionable.

This is a **pure function**, so it is unit-tested (see
[`tests/tasks.test.ts`](../../tests/tasks.test.ts)).

## The reward → depth → unlock loop

```ts
const completeTask = (task: Task) => {
  if (completedTasks.has(task.id)) return
  setCompletedTasks(prev => new Set([...prev, task.id]))
  setBalances(b => ({ ...b, [task.reward.currency]: b[task.reward.currency] + task.reward.amount }))
  setLogs(l => [...l, { ... }])
  if (task.corruptionLevel > depth) setDepth(task.corruptionLevel)
  // special triggers for task 007 / 014
}
```

Each completion:

1. Marks the task complete.
2. Credits (or debits) the reward. Rewards can be **negative** — task 012 debits
   12 LUNR, task 018 debits 44.4 LUNR — so "completing" a task can reduce the
   portfolio. This is an intentional part of the fiction: some tasks are
   required but cost you.
3. Appends a log entry.
4. Raises `depth` if this task's `corruptionLevel` is the new maximum. Depth
   never decreases through play (only via Reset).

## Why a ref for the gaze reward

The gaze timer (task 007) runs in a `setTimeout` inside a `useEffect`, and the
reward application is guarded by a **ref** (`stareRewardApplied`) rather than
state. Under React 19 StrictMode, effects and updaters can be invoked twice in
development. A ref persists across the double-invocation, so the +14 LUNR and
the recognition log can only fire once even if the tick callback runs twice.
The state writes are deferred out of the state updater with `queueMicrotask`
so the reducer stays pure (this satisfies `react-hooks/set-state-in-effect`).

## Reset

`handleReset` restores every state slice to the initial shift, including the
balances and the gaze state — fixing the original bug where reset left stale
balances and a completed stare panel.

## Concurrency / correctness notes

- React batches state updates, so `completeTask`'s multiple `set*` calls are
  applied together.
- There is no persistence; all of this resets on page reload.
- Because statuses are derived rather than stored, no "recompute on unlock" step
  is needed — raising `depth` immediately re-renders deeper tasks as available.
