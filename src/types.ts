/**
 * Shared domain types for the Cognizant Rewards Platform.
 *
 * These describe the "Mnemonic Solutions" institutional fiction — the
 * compensation currencies, the emotional-labor task corpus, and the
 * system log. They are deliberately strict so the data layer
 * (`src/data/tasks.ts`) and the presentation layer (`src/App.tsx`) share a
 * single vocabulary.
 */

/** The fictional compensation currencies issued by Mnemonic Solutions. */
export type Currency = 'LUNR' | 'VANT' | 'MIRE' | 'SCRIP' | 'WITNESS' | 'ECHO'

/**
 * The bureaucratic department a task belongs to. Every category is spoken in
 * the institution's own deadpan register, so the union is deliberately verbose.
 */
export type TaskCategory =
  | 'memory authentication'
  | 'grief calibration'
  | 'emotional labor indexing'
  | 'synthetic empathy testing'
  | 'weather classification'
  | 'dream cataloguing'
  | 'impossible captcha'
  | 'bureaucratic ritual'
  | 'existential profiling'
  | 'linguistic anomaly'
  | 'surveillance refinement'
  | 'temporal verification'
  | 'reality audit'
  | 'dead employee onboarding'
  | 'psychological QA'
  | 'subconscious extraction'
  | 'recursion testing'
  | 'HR compliance'
  | 'productivity training'

/**
 * Lifecycle state of a task in the assignment queue. `locked` gates a task
 * behind the accumulated corruption/depth; `flagged` marks a task the worker
 * can no longer clear.
 */
export type TaskStatus = 'available' | 'completed' | 'locked' | 'flagged'

/** A single assignment in the queue. */
export interface Task {
  id: string
  category: TaskCategory
  title: string
  instructions: string
  reward: { amount: number; currency: Currency }
  /**
   * The task's *base* status as authored (before the corruption/depth gate is
   * applied). Tasks 001/002 are authored `completed`; 018 is authored `flagged`;
   * the rest are `available`. Effective status is resolved at render time via
   * `resolveTaskStatus` in `src/lib/tasks.ts`.
   */
  status: TaskStatus
  /**
   * The accumulated corruption depth required for this task to become
   * actionable. Below this depth the task renders as locked.
   */
  minDepth: number
  /** Written by the system, returned when the task panel is expanded. */
  systemNote?: string
  /** A live-system warning shown under the task body. */
  warning?: string
  /** A red "impossible instruction" line, rendered as an inset quote. */
  contradiction?: string
  /** A completion requirement caption. */
  completionReq?: string
  /** IDs of tasks that the system cross-checks against this one. */
  references?: string[]
  /** 0–7. Drives both the corruption bar and the global `depth` gate. */
  corruptionLevel: number
}

/**
 * One entry in the streaming System Feed. `time` is an authored wall-clock
 * string (e.g. "04:17"); the feed is written by the institution, not the user.
 */
export interface LogEntry {
  time: string
  text: string
  type: 'info' | 'warning' | 'system' | 'observation'
}
