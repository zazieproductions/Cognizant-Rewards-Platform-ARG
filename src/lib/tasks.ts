import type { Task, TaskStatus } from '../types'

/**
 * Resolve a task's *effective* status for rendering.
 *
 * The authored `Task.status` is the base state; the real displayed state also
 * depends on (a) whether the worker has already submitted an answer — tracked in
 * the `completedTasks` set — and (b) whether the worker has accumulated enough
 * corruption `depth` to unlock the task. Keeping this as a pure function means
 * the gate reacts to live `depth` without rebuilding the whole task corpus.
 */
export function resolveTaskStatus(
  task: Task,
  depth: number,
  completedTasks: ReadonlySet<string>,
): TaskStatus {
  // A task the worker already answered stays completed forever.
  if (completedTasks.has(task.id)) return 'completed'
  // Below the required depth the task is locked, regardless of base status.
  if (depth >= task.minDepth) return task.status
  return 'locked'
}

/** Number of tasks that are currently actionable (available, not locked/completed). */
export function countAvailableTasks(
  tasks: readonly Task[],
  depth: number,
  completedTasks: ReadonlySet<string>,
): number {
  return tasks.filter((t) => resolveTaskStatus(t, depth, completedTasks) === 'available').length
}

/**
 * The task-specific detail panels are hand-written for a fixed set of tasks.
 * Everything else falls through to a generic submit button. Centralised so both
 * the renderer and tests agree on which tasks are bespoke.
 */
export const CUSTOM_PANEL_TASK_IDS: ReadonlySet<string> = new Set([
  '003',
  '004',
  '005',
  '006',
  '007',
  '008',
  '011',
  '014',
  '020',
])

/** Whether a task has a bespoke interactive detail panel. */
export function hasCustomPanel(task: Task): boolean {
  return CUSTOM_PANEL_TASK_IDS.has(task.id)
}
