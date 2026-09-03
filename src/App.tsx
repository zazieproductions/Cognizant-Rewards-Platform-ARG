import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import type { Currency, LogEntry, Task } from './types'
import { TASKS } from './data/tasks'
import { CURRENCIES, computeTotalValuation, formatBalance } from './lib/currency'
import { countAvailableTasks, hasCustomPanel, resolveTaskStatus } from './lib/tasks'

/**
 * Task 007 "temporal verification": the number of 100ms ticks of cursor contact
 * required for the blue square to recognise the worker (~43 seconds). Kept as a
 * named constant rather than a bare `430` so the relationship is legible.
 */
const STARE_TARGET_MS = 430

/**
 * Ad-hoc answers collected by the bespoke task panels. Most panels only need a
 * few fields, so the shape is deliberately loose; the known numeric fields are
 * typed so arithmetic on them stays safe, while the hallway-grid keys
 * (`hall-0`…`hall-23`) and the mineral hardness (`mineral`) fall through to the
 * index signature.
 */
interface TaskAnswers {
  rotation?: number
  mineral?: number
  [key: string]: number | boolean | undefined
}

export default function App() {
  // The worker's compensation portfolio. WITNESS is a count (whole number);
  // every other currency carries two decimals.
  const [balances, setBalances] = useState<Record<Currency, number>>({
    LUNR: 144.7,
    VANT: 23.0,
    MIRE: 0,
    SCRIP: 892.11,
    WITNESS: 7,
    ECHO: 7443.19,
  })

  /** Accumulated corruption depth. Drives task unlocking (see `minDepth`). */
  const [depth, setDepth] = useState(0)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set(['001', '002']))
  /** Ad-hoc answers held by the bespoke task panels (hallway grid, rotation…). */
  const [taskAnswers, setTaskAnswers] = useState<TaskAnswers>({})
  const [showTerminal, setShowTerminal] = useState(false)

  // Task 007 "temporal verification": hover the square to accumulate eye contact.
  const [hoverStareTime, setHoverStareTime] = useState(0)
  const [stareCompleted, setStareCompleted] = useState(false)
  const [cursorEyeContact, setCursorEyeContact] = useState(0)
  const [pauseTimer, setPauseTimer] = useState(0)
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: '04:17', text: 'SESSION INIT: Worker ID 7-443-19', type: 'info' },
    { time: '04:17', text: 'BALANCE SYNC COMPLETE', type: 'system' },
    { time: '04:18', text: 'SYSTEM OBSERVATION: You paused 3.2s before login. Noted.', type: 'observation' },
  ])

  // A brief red scanline glitch. The horizontal offset is captured in state so
  // it is stable across re-renders (render must stay pure — see eslint no-purity).
  const [glitch, setGlitch] = useState(false)
  const [glitchOffset, setGlitchOffset] = useState(0)

  const stareRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  // Task 007's reward is applied exactly once, when eye contact reaches target.
  const stareRewardApplied = useRef(false)

  const tasks = TASKS

  // Track cursor eye contact
  useEffect(() => {
    const handleMouseMove = () => {
      setCursorEyeContact(c => Math.min(c + 0.1, 100))
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Stare timer (task 007 "temporal verification").
  // The 100ms tick that accumulates `hoverStareTime` runs in this effect. The
  // completion side-effects (recognition log, +14 LUNR) are emitted from inside
  // the timer callback — not synchronously in the effect body — which keeps the
  // effect pure and satisfies `react-hooks/set-state-in-effect`. A ref guards
  // against the reward being applied twice if React invokes the updater twice.
  useEffect(() => {
    if (hoverStareTime <= 0 || hoverStareTime >= STARE_TARGET_MS) return

    const timer = setTimeout(() => {
      setHoverStareTime((h) => {
        const next = h + 1
        if (next >= STARE_TARGET_MS && !stareRewardApplied.current) {
          stareRewardApplied.current = true
          // Defer the state writes out of the reducer so the updater stays pure.
          queueMicrotask(() => {
            setStareCompleted(true)
            setBalances((b) => ({ ...b, LUNR: b.LUNR + 14 }))
            setLogs((l) => [
              ...l,
              { time: '04:23', text: 'RECOGNITION ACHIEVED: Square remembers you', type: 'system' },
            ])
          })
        }
        return next
      })
    }, 100)

    return () => clearTimeout(timer)
  }, [hoverStareTime])

  // Pause detection — the system logs one observation when the worker idles 43s.
  useEffect(() => {
    const interval = setInterval(() => {
      setPauseTimer((p) => p + 1)
      if (pauseTimer === 43) {
        setLogs((l) => [
          ...l,
          { time: '04:24', text: 'SYSTEM OBSERVATION: 43 second pause detected. Noted.', type: 'observation' },
        ])
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [pauseTimer])

  // Glitch effects — a brief red scanline flash. The horizontal jitter is
  // captured in state (`glitchOffset`) so it stays stable across re-renders,
  // keeping the render function pure.
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        setGlitchOffset(Math.random() * 4 - 2)
        setGlitch(true)
        setTimeout(() => setGlitch(false), 150 + Math.random() * 200)
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  /**
   * Submit a task: mark it complete, credit its reward (which may be negative),
   * log the submission, and advance the corruption `depth` if this task's
   * corruption level is the highest seen so far.
   */
  const completeTask = (task: Task) => {
    if (completedTasks.has(task.id)) return

    setCompletedTasks((prev) => new Set([...prev, task.id]))
    setBalances((b) => ({
      ...b,
      [task.reward.currency]: b[task.reward.currency] + task.reward.amount,
    }))

    setLogs((l) => [
      ...l,
      {
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        text: `TASK ${task.id} COMPLETE: +${task.reward.amount} ${task.reward.currency}`,
        type: 'info',
      },
    ])

    if (task.corruptionLevel > depth) {
      setDepth(task.corruptionLevel)
    }

    // Special triggers
    if (task.id === '007' && stareCompleted) {
      setLogs((l) => [
        ...l,
        { time: '04:23', text: 'You earned +14 LUNR for maintaining eye contact with the cursor.', type: 'system' },
      ])
    }
    if (task.id === '014') {
      setLogs((l) => [
        ...l,
        { time: '04:25', text: 'HALLWAY STATUS: Load-bearing. Do not remove.', type: 'warning' },
      ])
    }
  }

  /** Return the worker to the start of the shift (balances included). */
  const handleReset = () => {
    setBalances({ LUNR: 144.7, VANT: 23.0, MIRE: 0, SCRIP: 892.11, WITNESS: 7, ECHO: 7443.19 })
    setDepth(0)
    setCompletedTasks(new Set(['001', '002']))
    setTaskAnswers({})
    setSelectedTask(null)
    setShowTerminal(false)
    setHoverStareTime(0)
    setStareCompleted(false)
    setCursorEyeContact(0)
    setPauseTimer(0)
    stareRewardApplied.current = false
    setLogs([
      { time: '04:17', text: 'SESSION INIT: Worker ID 7-443-19', type: 'info' },
      { time: '04:17', text: 'BALANCE SYNC COMPLETE', type: 'system' },
      { time: '04:18', text: 'SYSTEM OBSERVATION: You paused 3.2s before login. Noted.', type: 'observation' },
    ])
  }

  const totalBalance = computeTotalValuation(balances)

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0c0c0e] text-[#d1d5db] font-mono overflow-x-hidden relative">
      {/* Corporate grid background */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(#6b7280 1px, transparent 1px), linear-gradient(90deg, #6b7280 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Glitch overlay */}
      <AnimatePresence>
        {glitch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] pointer-events-none mix-blend-screen"
            style={{
              background: `repeating-linear-gradient(0deg, transparent, transparent 2px, #ef4444 2px, #ef4444 3px)`,
              transform: `translateX(${glitchOffset}px)`
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-[1400px] mx-auto p-3 md:p-6">
        {/* Header - corporate but wrong */}
        <header className="mb-6 border border-[#1f2937] bg-[#111113]/90 backdrop-blur">
          <div className="border-b border-[#1f2937] px-4 py-2.5 flex items-center justify-between bg-[#0a0a0b]/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-[#374151] flex items-center justify-center bg-[#18181b]">
                <div className="w-4 h-4 border border-[#6b7280] relative">
                  <div className="absolute inset-1 bg-[#6b7280]/30" />
                </div>
              </div>
              <div>
                <h1 className="text-[15px] font-medium tracking-wide text-[#e5e7eb]">Cognizant Rewards Platform</h1>
                <p className="text-[10px] text-[#6b7280] -mt-0.5">A Division of Mnemonic Solutions • Est. 1987</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <div className="hidden md:flex items-center gap-3 text-[#6b7280]">
                <span>WORKER ID: 7-443-19</span>
                <span className="w-px h-3 bg-[#374151]" />
                <span>SHIFT: 04:00-12:00</span>
                <span className="w-px h-3 bg-[#374151]" />
                <span className="text-[#f59e0b]">TIER {Math.floor(depth / 2) + 1}</span>
              </div>
              <button 
                onClick={() => setShowTerminal(!showTerminal)}
                className="px-2.5 py-1 border border-[#374151] hover:border-[#4b5563] text-[#9ca3af] hover:text-[#d1d5db] transition-colors"
              >
                HELP
              </button>
            </div>
          </div>
          
          <div className="px-4 py-3 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-1.5">Compensation Portfolio</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {Object.entries(balances).map(([curr, amount]) => {
                  const currency = curr as Currency
                  return (
                    <div key={curr} className="flex items-baseline gap-1.5">
                      <span className="text-[11px] text-[#6b7280]">{curr}</span>
                      <span className="font-medium" style={{ color: CURRENCIES[currency].color }}>
                        {CURRENCIES[currency].symbol}{formatBalance(amount, currency)}
                      </span>
                    </div>
                  )
                })}
              </div>
              <p className="text-[10px] text-[#4b5563] mt-1.5">Total valuation: {totalBalance.toFixed(2)} standard units • Withdrawal threshold: 10,000</p>
            </div>
            
            <div className="text-right">
              <p className="text-[11px] text-[#6b7280] uppercase tracking-wider mb-1">Performance Metrics</p>
              <div className="flex gap-4 text-[12px]">
                <div>
                  <span className="text-[#6b7280]">Completed:</span>{' '}
                  <span className="text-[#e5e7eb]">{completedTasks.size}/20</span>
                </div>
                <div>
                  <span className="text-[#6b7280]">Accuracy:</span>{' '}
                  <span className="text-[#f59e0b]">{87 - depth * 2}%</span>
                </div>
                <div>
                  <span className="text-[#6b7280]">Compliance:</span>{' '}
                  <span className={depth > 3 ? "text-[#ef4444]" : "text-[#10b981]"}>{depth > 3 ? 'FLAGGED' : 'NOMINAL'}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* Main task area */}
          <main className="xl:col-span-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[13px] uppercase tracking-widest text-[#9ca3af]">Active Assignments</h2>
              <div className="flex items-center gap-3 text-[11px] text-[#6b7280]">
                <span>Sorted by: Priority</span>
                <span>•</span>
                <span className="text-[#f59e0b]">{countAvailableTasks(tasks, depth, completedTasks)} pending</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {tasks.map((task) => {
                const status = resolveTaskStatus(task, depth, completedTasks)
                const isCompleted = status === 'completed'
                const isLocked = status === 'locked'
                const isFlagged = status === 'flagged'

                return (
                  <motion.div
                    key={task.id}
                    layout
                    className={`group relative border bg-[#111113]/70 backdrop-blur-sm transition-all ${
                      isLocked ? 'border-[#1f2937] opacity-40' :
                      isFlagged ? 'border-[#ef4444]/50 bg-[#1a0f0f]/70' :
                      isCompleted ? 'border-[#374151] opacity-60' :
                      'border-[#374151] hover:border-[#4b5563] hover:bg-[#141416]/80'
                    }`}
                  >
                    {/* Corruption indicator */}
                    {task.corruptionLevel > 0 && (
                      <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{
                        background: `linear-gradient(to bottom, transparent, ${task.corruptionLevel > 3 ? '#ef4444' : '#f59e0b'} ${task.corruptionLevel * 15}%, transparent)`,
                        opacity: 0.6
                      }} />
                    )}

                    <button
                      onClick={() => !isLocked && setSelectedTask(selectedTask?.id === task.id ? null : task)}
                      disabled={isLocked}
                      className="w-full text-left p-3.5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className={`w-5 h-5 border flex items-center justify-center text-[10px] font-medium ${
                            isCompleted ? 'border-[#10b981]/50 bg-[#10b981]/10 text-[#10b981]' :
                            isFlagged ? 'border-[#ef4444]/50 bg-[#ef4444]/10 text-[#ef4444] animate-pulse' :
                            isLocked ? 'border-[#374151] text-[#4b5563]' :
                            'border-[#4b5563] text-[#9ca3af] group-hover:border-[#6b7280]'
                          }`}>
                            {isCompleted ? '✓' : isFlagged ? '!' : task.id}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 border border-[#374151] text-[#6b7280]">
                                  {task.category}
                                </span>
                                {task.references && (
                                  <span className="text-[10px] text-[#f59e0b]">↳ refs: {task.references.join(', ')}</span>
                                )}
                              </div>
                              <h3 className={`text-[14px] leading-snug mt-1.5 ${
                                isLocked ? 'text-[#4b5563]' : 
                                isCompleted ? 'text-[#9ca3af]' : 
                                'text-[#e5e7eb] group-hover:text-white'
                              }`}>
                                {task.title}
                              </h3>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <div className="text-[13px] font-medium" style={{ color: CURRENCIES[task.reward.currency].color }}>
                                {task.reward.amount > 0 ? '+' : ''}{task.reward.amount} {CURRENCIES[task.reward.currency].symbol}
                              </div>
                              <div className="text-[10px] text-[#6b7280]">{task.reward.currency}</div>
                            </div>
                          </div>
                          
                          <p className={`text-[12px] leading-relaxed ${isLocked ? 'text-[#4b5563]' : 'text-[#9ca3af]'}`}>
                            {task.instructions}
                          </p>

                          {task.warning && !isLocked && (
                            <div className="mt-2 flex items-start gap-1.5">
                              <span className="text-[#f59e0b] text-[11px] mt-0.5">⚠</span>
                              <p className="text-[11px] text-[#f59e0b]/80 leading-snug">{task.warning}</p>
                            </div>
                          )}

                          {task.contradiction && !isLocked && (
                            <div className="mt-1.5 pl-3 border-l-2 border-[#ef4444]/30">
                              <p className="text-[11px] text-[#ef4444]/70 italic leading-snug">{task.contradiction}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Expanded task */}
                    <AnimatePresence>
                      {selectedTask?.id === task.id && !isLocked && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-[#1f2937] bg-[#0a0a0b]/80"
                        >
                          <div className="p-4 space-y-3.5">
                            {task.systemNote && (
                              <div className="bg-[#18181b] border border-[#27272a] px-3 py-2">
                                <p className="text-[10px] uppercase tracking-wider text-[#6b7280] mb-1">System Note</p>
                                <p className="text-[11px] text-[#9ca3af] leading-relaxed font-mono">{task.systemNote}</p>
                              </div>
                            )}

                            {/* Task-specific interfaces */}
                            {task.id === '003' && (
                              <div className="space-y-3">
                                <div className="h-[60px] bg-black border border-[#27272a] flex items-center justify-center relative overflow-hidden">
                                  <div className="absolute inset-0 opacity-20" style={{
                                    backgroundImage: `repeating-linear-gradient(90deg, #10b981 0px, transparent 1px, transparent 4px)`
                                  }} />
                                  <button className="relative z-10 px-4 py-1.5 bg-[#10b981]/20 border border-[#10b981]/50 text-[#10b981] text-[12px] hover:bg-[#10b981]/30">
                                    ▶ PLAY HUM (0:17)
                                  </button>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  {['Contains regret', 'Contains acceptance', 'Contains neither', 'Contains both', 'Cannot determine', 'Refuses to answer'].map(opt => (
                                    <button key={opt} onClick={() => completeTask(task)} className="px-2.5 py-2 border border-[#374151] text-[11px] text-[#9ca3af] hover:border-[#4b5563] hover:bg-[#18181b] text-left">
                                      {opt}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {task.id === '004' && (
                              <div className="space-y-3">
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                                  {Array.from({ length: 24 }, (_, i) => (
                                    <button key={i} onClick={() => setTaskAnswers(a => ({ ...a, [`hall-${i}`]: !a[`hall-${i}`] }))} className={`aspect-[3/4] border text-[9px] flex flex-col items-center justify-center p-1 transition-all ${taskAnswers[`hall-${i}`] ? 'border-[#a78bfa] bg-[#a78bfa]/10 text-[#a78bfa]' : 'border-[#27272a] bg-[#0f0f10] text-[#4b5563] hover:border-[#374151]'}`}>
                                      <div className="w-6 h-8 border border-current opacity-40 mb-1" />
                                      H{i+1}
                                    </button>
                                  ))}
                                </div>
                                <button onClick={() => completeTask(task)} className="w-full py-2 bg-[#a78bfa]/10 border border-[#a78bfa]/30 text-[#a78bfa] text-[12px] hover:bg-[#a78bfa]/20">
                                  Submit hallway selection ({Object.values(taskAnswers).filter(Boolean).length} selected)
                                </button>
                              </div>
                            )}

                            {task.id === '005' && (
                              <div className="space-y-3">
                                <p className="text-[11px] text-[#6b7280]">Select all images containing infrastructure capable of being mourned:</p>
                                <div className="grid grid-cols-3 gap-2">
                                  {['Overpass at dusk', 'Abandoned mall', 'Your childhood home', 'Highway interchange', 'Parking garage L3', 'Bridge (unknown)', 'Office lobby', 'Train platform', 'Sidewalk crack'].map((img, i) => (
                                    <button key={i} onClick={() => completeTask(task)} className="aspect-video bg-[#0f0f10] border border-[#27272a] hover:border-[#a78bfa]/50 p-2 text-[10px] text-[#6b7280] hover:text-[#9ca3af] text-left leading-tight">
                                      <div className="w-full h-8 bg-[#1a1a1f] mb-1.5 border border-[#27272a]" />
                                      {img}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {task.id === '006' && (
                              <div className="space-y-3">
                                <div className="bg-black border border-[#27272a] p-4 flex flex-col items-center">
                                  <div className="relative w-24 h-32">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-12 h-20 border-2 border-[#4b5563] relative" style={{ transform: `rotate(${taskAnswers.rotation || 0}deg)` }}>
                                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-[#4b5563] bg-[#0a0a0b]" />
                                        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-1 h-8 bg-[#ef4444]/60" style={{ transform: `rotate(${- (taskAnswers.rotation || 0)}deg)` }} />
                                      </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-px bg-[#27272a]" />
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-12 bg-[#ef4444]/30" style={{ transform: `rotate(${(taskAnswers.rotation || 0) * 0.5}deg)`, transformOrigin: 'bottom' }} />
                                  </div>
                                  <input type="range" min="0" max="360" value={taskAnswers.rotation || 0} onChange={e => setTaskAnswers(a => ({ ...a, rotation: Number(e.target.value) }))} className="w-full mt-4 accent-[#f59e0b]" />
                                  <p className="text-[11px] text-[#6b7280] mt-2">Rotation: {taskAnswers.rotation || 0}° • Guilt alignment: {Math.abs((taskAnswers.rotation || 0) - 147) < 10 || Math.abs((taskAnswers.rotation || 0) - 213) < 10 ? 'OPTIMAL' : 'SEARCHING'}</p>
                                </div>
                                <button onClick={() => completeTask(task)} disabled={Math.abs((taskAnswers.rotation || 0) - 147) > 10 && Math.abs((taskAnswers.rotation || 0) - 213) > 10} className="w-full py-2 border text-[12px] disabled:opacity-40 disabled:cursor-not-allowed border-[#f59e0b]/50 text-[#f59e0b] hover:bg-[#f59e0b]/10">
                                  Confirm alignment
                                </button>
                              </div>
                            )}

                            {task.id === '007' && (
                              <div className="space-y-3">
                                <div className="flex flex-col items-center">
                                  <div ref={stareRef} onMouseEnter={() => !stareCompleted && setHoverStareTime(1)} onMouseLeave={() => setHoverStareTime(0)} className="relative w-32 h-32 cursor-crosshair">
                                    <div className="absolute inset-0 bg-[#1e3a8a] border-2 border-[#3b82f6]" style={{ boxShadow: stareCompleted ? '0 0 30px #3b82f6' : 'none' }} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                    </div>
                                    {hoverStareTime > 0 && !stareCompleted && (
                                      <div className="absolute -bottom-6 left-0 right-0">
                                        <div className="h-0.5 bg-[#1f2937] overflow-hidden">
                                          <div className="h-full bg-[#3b82f6] transition-all" style={{ width: `${(hoverStareTime / 430) * 100}%` }} />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-[#6b7280] mt-6 text-center max-w-[280px]">
                                    {stareCompleted ? 'Recognition confirmed. The square remembers you from orientation.' : hoverStareTime > 0 ? `Maintaining contact... ${Math.floor(hoverStareTime / 10)}.${hoverStareTime % 10}s` : 'Hover to begin recognition protocol'}
                                  </p>
                                </div>
                                {stareCompleted && (
                                  <button onClick={() => completeTask(task)} className="w-full py-2 bg-[#3b82f6]/20 border border-[#3b82f6]/50 text-[#3b82f6] text-[12px]">
                                    Submit recognition
                                  </button>
                                )}
                              </div>
                            )}

                            {task.id === '008' && (
                              <div className="space-y-3">
                                <div className="grid grid-cols-5 gap-1.5">
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => {
                                    const minerals = ['Talc', '', 'Calcite', '', 'Apatite', '', 'Quartz', '', 'Corundum', 'Diamond']
                                    return (
                                      <button key={n} onClick={() => { setTaskAnswers(a => ({ ...a, mineral: n })); completeTask(task) }} className={`p-2.5 border text-center transition-all ${taskAnswers.mineral === n ? 'border-[#f59e0b] bg-[#f59e0b]/10' : 'border-[#27272a] hover:border-[#374151] bg-[#0f0f10]'}`}>
                                        <div className="text-[16px] font-medium text-[#e5e7eb]">{n}</div>
                                        <div className="text-[9px] text-[#6b7280] mt-0.5 h-3">{minerals[n-1]}</div>
                                      </button>
                                    )
                                  })}
                                </div>
                                <p className="text-[10px] text-[#ef4444]/70 italic">Do not think of her while completing. Think of the classification.</p>
                              </div>
                            )}

                            {task.id === '011' && (
                              <div className="space-y-3">
                                <div className="bg-black border border-[#27272a] aspect-video flex items-center justify-center relative">
                                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
                                  <div className="text-center z-10">
                                    <p className="text-[11px] text-[#6b7280] mb-2">PROPER LIFTING TECHNIQUES (1987)</p>
                                    <p className="text-[24px] font-mono text-[#e5e7eb]">04:17</p>
                                    <p className="text-[10px] text-[#4b5563] mt-1">Frame 7,441 / 7,541</p>
                                  </div>
                                </div>
                                <input type="number" placeholder="Enter frame number (7441)" className="w-full px-3 py-2 bg-[#0a0a0b] border border-[#27272a] text-[13px] text-[#e5e7eb] focus:border-[#ef4444]/50 focus:outline-none" onChange={e => e.target.value === '7441' && completeTask(task)} />
                                <p className="text-[10px] text-[#6b7280]">Linda has been dead for 19 years. She does not know.</p>
                              </div>
                            )}

                            {task.id === '014' && (
                              <div className="space-y-3">
                                <div className="bg-[#0f0f10] border border-[#27272a] p-3">
                                  <p className="text-[12px] text-[#e5e7eb] mb-2">Use peripheral awareness. Do not turn around.</p>
                                  <div className="flex gap-2">
                                    <button onClick={() => completeTask(task)} className="flex-1 py-2 border border-[#10b981]/50 text-[#10b981] text-[12px] hover:bg-[#10b981]/10">Load-bearing: YES</button>
                                    <button onClick={() => completeTask(task)} className="flex-1 py-2 border border-[#ef4444]/50 text-[#ef4444] text-[12px] hover:bg-[#ef4444]/10">Load-bearing: NO</button>
                                  </div>
                                </div>
                                <p className="text-[10px] text-[#f59e0b]">SYSTEM OBSERVATION: You paused 43 seconds before answering. Most users do not survive this section.</p>
                              </div>
                            )}

                            {task.id === '020' && (
                              <div className="space-y-3">
                                <div className="bg-[#1a0f0f] border border-[#ef4444]/30 p-3">
                                  <p className="text-[11px] text-[#ef4444] uppercase tracking-wider mb-2">Final Audit</p>
                                  <div className="space-y-2 text-[12px]">
                                    <div className="flex justify-between"><span className="text-[#6b7280]">Memory integrity:</span><span className="text-[#f59e0b]">67% match</span></div>
                                    <div className="flex justify-between"><span className="text-[#6b7280]">Guilt distribution:</span><span className="text-[#ef4444]">REDISTRIBUTED</span></div>
                                    <div className="flex justify-between"><span className="text-[#6b7280]">Hallway knowledge:</span><span className="text-[#10b981]">ACQUIRED</span></div>
                                    <div className="flex justify-between"><span className="text-[#6b7280]">Infrastructure mourning:</span><span className="text-[#a78bfa]">CERTIFIED</span></div>
                                  </div>
                                </div>
                                <button onClick={() => completeTask(task)} className="w-full py-2.5 bg-[#ef4444]/20 border border-[#ef4444] text-[#ef4444] text-[13px] font-medium hover:bg-[#ef4444]/30">
                                  CONFIRM IDENTITY DRIFT • SUBMIT BOTH SIGNATURES
                                </button>
                                <p className="text-[10px] text-[#6b7280] text-center">SYSTEM OBSERVATION: You are not the same person. This is expected. Proceed.</p>
                              </div>
                            )}

                            {/* Generic completion */}
                            {!hasCustomPanel(task) && (
                              <button onClick={() => completeTask(task)} className="w-full py-2.5 bg-[#1f2937] border border-[#374151] text-[13px] text-[#e5e7eb] hover:bg-[#27272a] hover:border-[#4b5563] transition-colors">
                                Submit response • Earn {task.reward.amount} {CURRENCIES[task.reward.currency].symbol}
                              </button>
                            )}

                            {task.completionReq && (
                              <p className="text-[10px] text-[#6b7280] italic text-center">{task.completionReq}</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="xl:col-span-4 space-y-3">
            {/* System feed */}
            <div className="border border-[#1f2937] bg-[#111113]/70 backdrop-blur">
              <div className="border-b border-[#1f2937] px-3 py-2 flex items-center justify-between">
                <h3 className="text-[11px] uppercase tracking-widest text-[#6b7280]">System Feed</h3>
                <span className="text-[10px] text-[#10b981] flex items-center gap-1"><span className="w-1 h-1 bg-[#10b981] rounded-full animate-pulse" />LIVE</span>
              </div>
              <div className="p-3 h-[200px] overflow-y-auto space-y-1.5 font-mono text-[11px]">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-2.5">
                    <span className="text-[#4b5563] shrink-0">[{log.time}]</span>
                    <span className={`leading-snug ${
                      log.type === 'warning' ? 'text-[#f59e0b]' :
                      log.type === 'system' ? 'text-[#a78bfa]' :
                      log.type === 'observation' ? 'text-[#ef4444]' :
                      'text-[#9ca3af]'
                    }`}>
                      {log.text}
                    </span>
                  </div>
                ))}
                <div className="flex gap-2.5">
                  <span className="text-[#4b5563]">[--:--]</span>
                  <span className="text-[#10b981] animate-pulse">▌</span>
                </div>
              </div>
            </div>

            {/* Department notices */}
            <div className="border border-[#1f2937] bg-[#0f0f10]/70 p-3">
              <h3 className="text-[11px] uppercase tracking-widest text-[#6b7280] mb-2.5">Departmental Memos</h3>
              <div className="space-y-2.5 text-[11px] leading-relaxed">
                <div className="pb-2.5 border-b border-[#1f2937]/50">
                  <p className="text-[#f59e0b] mb-1">From: Bureau of Oneiric Compliance</p>
                  <p className="text-[#9ca3af]">Dream submissions for Q3 are due. Please ensure all nightmares are properly formatted.</p>
                </div>
                <div className="pb-2.5 border-b border-[#1f2937]/50">
                  <p className="text-[#a78bfa] mb-1">From: Weather Continuity Dept</p>
                  <p className="text-[#9ca3af]">Tuesday's rain has been approved retroactively. Update your records.</p>
                </div>
                <div>
                  <p className="text-[#ef4444] mb-1">From: HR (Deceased Employees)</p>
                  <p className="text-[#9ca3af]">Your predecessor's desk has been cleared. You may sit there now.</p>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="border border-[#1f2937] bg-[#0f0f10]/70 p-3">
              <h3 className="text-[11px] uppercase tracking-widest text-[#6b7280] mb-2.5">Emotional Labor Index</h3>
              <div className="space-y-2">
                {[
                  { label: 'Nostalgia Credits', value: 23, max: 100, color: '#a78bfa' },
                  { label: 'Empathy Reserves', value: depth > 3 ? 12 : 67, max: 100, color: '#ef4444' },
                  { label: 'Grief Calibration', value: 89, max: 100, color: '#f59e0b' },
                  { label: 'Cursor Eye Contact', value: Math.floor(cursorEyeContact), max: 100, color: '#10b981' },
                ].map(metric => (
                  <div key={metric.label}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-[#6b7280]">{metric.label}</span>
                      <span style={{ color: metric.color }}>{metric.value}%</span>
                    </div>
                    <div className="h-1 bg-[#1f2937] overflow-hidden">
                      <div className="h-full transition-all duration-500" style={{ width: `${metric.value}%`, background: metric.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[#4b5563] mt-2.5">You paused for {pauseTimer} seconds total. Average: 47s</p>
            </div>

            {/* Warning */}
            {depth >= 2 && (
              <div className="border border-[#f59e0b]/30 bg-[#1a140f]/70 p-3">
                <p className="text-[11px] text-[#f59e0b] uppercase tracking-wider mb-1.5">Compliance Notice</p>
                <p className="text-[11px] text-[#d1d5db] leading-relaxed">You have exceeded your daily permitted nostalgia. Additional credits available via Form N-44 (3-5 business days).</p>
              </div>
            )}
          </aside>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t border-[#1f2937] flex flex-wrap items-center justify-between gap-3 text-[10px] text-[#4b5563]">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>© 1987-2024 Mnemonic Solutions LLC</span>
            <span>•</span>
            <button className="hover:text-[#6b7280]">Employee Handbook v4.7</button>
            <span>•</span>
            <button className="hover:text-[#6b7280]">Grief Calibration Manual</button>
            <span>•</span>
            <button
              onClick={handleReset}
              className="hover:text-[#ef4444]"
            >
              Reset Session
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span>DEPTH: {depth}</span>
            <span>•</span>
            <span className="text-[#374151]">VGhlcmUgaXMgbm8gZXNjYXBl</span>
          </div>
        </footer>
      </div>

      {/* Terminal */}
      <AnimatePresence>
        {showTerminal && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-4 right-4 w-[360px] z-50 border border-[#374151] bg-[#0a0a0b]/95 backdrop-blur-xl shadow-2xl">
            <div className="border-b border-[#1f2937] px-3 py-2 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-[#9ca3af]">Support Terminal</span>
              <button onClick={() => setShowTerminal(false)} className="text-[#6b7280] hover:text-[#9ca3af]">✕</button>
            </div>
            <div className="p-3 space-y-2 text-[11px] leading-relaxed max-h-[300px] overflow-y-auto">
              <p className="text-[#9ca3af]">Welcome to Mnemonic Solutions support.</p>
              <p className="text-[#6b7280]">Your emotional labor is valued. Your memories are catalogued. Your grief is calibrated.</p>
              <div className="pt-2 border-t border-[#1f2937] space-y-1.5">
                <p className="text-[#f59e0b]">Frequently accessed:</p>
                <button className="block text-left text-[#9ca3af] hover:text-[#e5e7eb]">• How to mourn infrastructure correctly</button>
                <button className="block text-left text-[#9ca3af] hover:text-[#e5e7eb]">• Requesting additional nostalgia credits</button>
                <button className="block text-left text-[#9ca3af] hover:text-[#e5e7eb]">• What to do if the hallway remembers you</button>
                <button className="block text-left text-[#9ca3af] hover:text-[#e5e7eb]">• Understanding your WITNESS balance</button>
              </div>
              <p className="pt-2 border-t border-[#1f2937] text-[#4b5563] italic">A support team member is currently borrowing your oldest memory. Expected return: 5-7 days.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}