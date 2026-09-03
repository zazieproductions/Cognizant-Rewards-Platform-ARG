import { describe, it, expect } from 'vitest'
import { TASKS } from '../src/data/tasks'
import { resolveTaskStatus, countAvailableTasks, hasCustomPanel, CUSTOM_PANEL_TASK_IDS } from '../src/lib/tasks'

describe('task corpus', () => {
  it('contains 20 tasks with unique ids', () => {
    expect(TASKS).toHaveLength(20)
    const ids = TASKS.map((t) => t.id)
    expect(new Set(ids).size).toBe(20)
    expect(ids[0]).toBe('001')
    expect(ids[19]).toBe('020')
  })

  it('gates deeper tasks behind higher minDepth', () => {
    for (const t of TASKS) {
      expect(t.minDepth).toBeGreaterThanOrEqual(0)
      expect(t.corruptionLevel).toBeGreaterThanOrEqual(t.minDepth || 0)
    }
  })
})

describe('resolveTaskStatus', () => {
  const completed = new Set<string>(['001', '002'])

  it('reports authored-completed tasks as completed', () => {
    expect(resolveTaskStatus(TASKS[0], 0, completed)).toBe('completed')
  })

  it('locks a task below its minDepth', () => {
    // 009 is minDepth 1, baseStatus available.
    const nine = TASKS.find((t) => t.id === '009')!
    expect(resolveTaskStatus(nine, 0, completed)).toBe('locked')
    expect(resolveTaskStatus(nine, 1, completed)).toBe('available')
  })

  it('flags task 018 once the depth gate is reached', () => {
    const eighteen = TASKS.find((t) => t.id === '018')!
    expect(resolveTaskStatus(eighteen, 3, completed)).toBe('locked')
    expect(resolveTaskStatus(eighteen, 4, completed)).toBe('flagged')
  })

  it('keeps a submitted task completed regardless of depth', () => {
    const three = TASKS.find((t) => t.id === '003')!
    const done = new Set<string>(['003', '004', '005'])
    expect(resolveTaskStatus(three, 0, done)).toBe('completed')
  })
})

describe('countAvailableTasks', () => {
  it('counts only actionable tasks at the initial depth', () => {
    const completed = new Set<string>(['001', '002'])
    // 003–008 are the six minDepth-0 available tasks.
    expect(countAvailableTasks(TASKS, 0, completed)).toBe(6)
  })

  it('unlocks more tasks as depth increases', () => {
    const completed = new Set<string>(['001', '002'])
    expect(countAvailableTasks(TASKS, 4, completed)).toBeGreaterThan(countAvailableTasks(TASKS, 0, completed))
  })
})

describe('custom panels', () => {
  it('recognises every bespoke detail panel', () => {
    for (const id of ['003', '004', '005', '006', '007', '008', '011', '014', '020']) {
      expect(CUSTOM_PANEL_TASK_IDS.has(id)).toBe(true)
      expect(hasCustomPanel(TASKS.find((t) => t.id === id)!)).toBe(true)
    }
    expect(CUSTOM_PANEL_TASK_IDS.has('009')).toBe(false)
  })
})
