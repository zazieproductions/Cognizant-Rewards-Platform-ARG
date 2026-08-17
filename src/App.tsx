import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Currency = 'LUNR' | 'VANT' | 'MIRE' | 'SCRIP' | 'WITNESS' | 'ECHO'
type TaskCategory = 
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

interface Task {
  id: string
  category: TaskCategory
  title: string
  instructions: string
  reward: { amount: number; currency: Currency }
  status: 'available' | 'completed' | 'locked' | 'flagged'
  systemNote?: string
  warning?: string
  contradiction?: string
  completionReq?: string
  references?: string[]
  corruptionLevel: number
}

interface LogEntry {
  time: string
  text: string
  type: 'info' | 'warning' | 'system' | 'observation'
}

const CURRENCIES: Record<Currency, { symbol: string; color: string }> = {
  LUNR: { symbol: '₤', color: '#a78bfa' },
  VANT: { symbol: 'ⱽ', color: '#f59e0b' },
  MIRE: { symbol: '₥', color: '#10b981' },
  SCRIP: { symbol: '§', color: '#ec4899' },
  WITNESS: { symbol: '◈', color: '#ef4444' },
  ECHO: { symbol: '⦻', color: '#00ff88' }
}

export default function App() {
  const [balances, setBalances] = useState<Record<Currency, number>>({
    LUNR: 144.7,
    VANT: 23.0,
    MIRE: 0,
    SCRIP: 892.11,
    WITNESS: 7,
    ECHO: 7443.19
  })
  const [depth, setDepth] = useState(0)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set(['001', '002']))
  const [taskAnswers, setTaskAnswers] = useState<Record<string, any>>({})
  const [showTerminal, setShowTerminal] = useState(false)
  const [hoverStareTime, setHoverStareTime] = useState(0)
  const [stareCompleted, setStareCompleted] = useState(false)
  const [cursorEyeContact, setCursorEyeContact] = useState(0)
  const [pauseTimer, setPauseTimer] = useState(0)
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: '04:17', text: 'SESSION INIT: Worker ID 7-443-19', type: 'info' },
    { time: '04:17', text: 'BALANCE SYNC COMPLETE', type: 'system' },
    { time: '04:18', text: 'SYSTEM OBSERVATION: You paused 3.2s before login. Noted.', type: 'observation' },
  ])
  const [glitch, setGlitch] = useState(false)
  const stareRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const tasks: Task[] = [
    {
      id: '001',
      category: 'memory authentication',
      title: 'Verify your primary residence (1998-2003)',
      instructions: 'Please select the correct floor plan from the options below. The system has detected minor discrepancies in your memory file. This is normal.',
      reward: { amount: 12.4, currency: 'LUNR' },
      status: 'completed',
      systemNote: 'MEMORY FRAGMENT 7A: Kitchen window faced east. Verified.',
      corruptionLevel: 0
    },
    {
      id: '002',
      category: 'weather classification',
      title: 'Categorize yesterday\'s weather using approved emotional terms',
      instructions: 'Select all that apply: Melancholic, Industrious, Forgiving, Suspicious, Pre-approved, Bureaucratic, Lightly Haunted',
      reward: { amount: 8.33, currency: 'VANT' },
      status: 'completed',
      completionReq: 'Minimum 2 selections required. Maximum 5 permitted.',
      corruptionLevel: 0
    },
    {
      id: '003',
      category: 'synthetic empathy testing',
      title: 'Listen to the following refrigerator hum and determine whether it contains regret',
      instructions: 'Audio sample will play for 17 seconds. The refrigerator is a 2004 Kenmore, Model 106. It has been running continuously since installation. Focus on the compressor cycle at 0:09.',
      reward: { amount: 15.7, currency: 'MIRE' },
      status: 'available',
      warning: 'Do not adjust volume. The hum adjusts to you.',
      systemNote: 'Previous worker reported "profound sorrow." Flagged for review.',
      corruptionLevel: 1
    },
    {
      id: '004',
      category: 'dream cataloguing',
      title: 'Select all hallways from your childhood that no longer exist',
      instructions: 'Use the grid below. Hallways are defined as: transitional spaces between 8-40 feet in length that you walked through at least 17 times. Exclude service corridors.',
      reward: { amount: 22.0, currency: 'LUNR' },
      status: 'available',
      contradiction: 'If you select zero hallways, you must provide justification in triplicate.',
      corruptionLevel: 1
    },
    {
      id: '005',
      category: 'impossible captcha',
      title: 'This captcha confirms you are capable of mourning infrastructure',
      instructions: 'Click all images containing: a) Bridges you have cried on, b) Parking lots that remember you, c) Traffic lights that waited for you specifically',
      reward: { amount: 31.14, currency: 'SCRIP' },
      status: 'available',
      systemNote: 'CAPTCHA v4.7: Emotional verification required. Bots cannot grieve concrete.',
      corruptionLevel: 2
    },
    {
      id: '006',
      category: 'bureaucratic ritual',
      title: 'Rotate the employee until the guilt aligns with the shadow',
      instructions: 'Use slider to rotate Employee #44319 (you). Optimal alignment occurs at 147° or 213°. The system will know when you\'ve found it. Do not force alignment.',
      reward: { amount: 44.44, currency: 'WITNESS' },
      status: 'available',
      warning: 'Over-rotation may cause departmental reassignment.',
      corruptionLevel: 2
    },
    {
      id: '007',
      category: 'temporal verification',
      title: 'Before continuing, stare at the blue square until it remembers you',
      instructions: 'Maintain eye contact with the cursor in the center. Do not blink excessively. The square will pulse when recognition occurs. Average recognition time: 43 seconds.',
      reward: { amount: 14, currency: 'LUNR' },
      status: 'available',
      completionReq: 'You earned +14 LUNR for maintaining eye contact with the cursor.',
      systemNote: 'Most users do not survive this section. You will.',
      corruptionLevel: 2
    },
    {
      id: '008',
      category: 'linguistic anomaly',
      title: 'Classify your mother\'s voice using the approved mineral scale',
      instructions: 'Scale: 1-Talc (soft), 3-Calcite, 5-Apatite, 7-Quartz, 9-Corundum, 10-Diamond. If voice contains multiple minerals, submit Form 77-B.',
      reward: { amount: 19.88, currency: 'VANT' },
      status: 'available',
      contradiction: 'Do not think of her while completing. Think of the classification.',
      corruptionLevel: 3
    },
    {
      id: '009',
      category: 'grief calibration',
      title: 'For quality assurance, recreate the sensation of missing someone incorrectly',
      instructions: 'You must miss them in a way that is procedurally inaccurate. Use wrong details, incorrect timeline, misremembered weather. The system measures authenticity through error.',
      reward: { amount: 67.0, currency: 'MIRE' },
      status: depth >= 1 ? 'available' : 'locked',
      warning: 'Correct missing is indistinguishable from surveillance.',
      corruptionLevel: 3
    },
    {
      id: '010',
      category: 'existential profiling',
      title: 'Please rank these staircases according to spiritual compliance',
      instructions: 'Staircases: A) Office fire escape (1978), B) Childhood basement, C) Dream staircase that ends in carpet, D) Staircase from Task #004. Use Department of Vertical Transit guidelines.',
      reward: { amount: 33.3, currency: 'SCRIP' },
      status: depth >= 1 ? 'available' : 'locked',
      systemNote: 'Reference: Task #004 selection affects ranking. System cross-checks.',
      references: ['004'],
      corruptionLevel: 3
    },
    {
      id: '011',
      category: 'surveillance refinement',
      title: 'Watch the training video and report the exact frame where the instructor realizes they are dead',
      instructions: 'Video: "Proper Lifting Techniques" (1987). Duration 4:17. Instructor: Linda K. Frame rate 29.97. Do not watch past frame 7,441.',
      reward: { amount: 55.5, currency: 'WITNESS' },
      status: depth >= 1 ? 'available' : 'locked',
      warning: 'Linda has been dead for 19 years. She does not know.',
      corruptionLevel: 4
    },
    {
      id: '012',
      category: 'psychological QA',
      title: 'You have exceeded your daily permitted nostalgia',
      instructions: 'Please submit Form N-44 to request additional nostalgia credits. Processing time: 3-5 business days. Meanwhile, continue working. Do not remember anything else today.',
      reward: { amount: -12, currency: 'LUNR' },
      status: depth >= 2 ? 'available' : 'locked',
      systemNote: 'DEBIT APPLIED: Unauthorized reminiscence detected at 04:22',
      contradiction: 'This task must be completed to continue. You may not complete this task.',
      corruptionLevel: 4
    },
    {
      id: '013',
      category: 'subconscious extraction',
      title: 'A member of the support team would like to borrow your oldest memory',
      instructions: 'Memory will be returned within 5-7 business days, slightly used. You will not notice it is gone. Support Ticket #88471: "Need reference for childhood wallpaper pattern."',
      reward: { amount: 100, currency: 'ECHO' },
      status: depth >= 2 ? 'available' : 'locked',
      warning: 'Borrowed memories accrue interest.',
      corruptionLevel: 4
    },
    {
      id: '014',
      category: 'reality audit',
      title: 'Please confirm whether the hallway behind you is load-bearing',
      instructions: 'Do not turn around. Use peripheral awareness and architectural intuition. The hallway was installed in 2019 during the renovation that never happened.',
      reward: { amount: 77.77, currency: 'VANT' },
      status: depth >= 2 ? 'available' : 'locked',
      systemNote: 'SYSTEM OBSERVATION: You paused 43 seconds before answering. Most users do not survive this section.',
      corruptionLevel: 5
    },
    {
      id: '015',
      category: 'dead employee onboarding',
      title: 'Complete orientation for your predecessor',
      instructions: 'Employee #44318 completed 67% of onboarding before incident. Please finish their paperwork. Use their handwriting. You have their hands now.',
      reward: { amount: 0, currency: 'SCRIP' },
      status: depth >= 3 ? 'available' : 'locked',
      warning: 'Do not sign your name. Sign theirs.',
      contradiction: 'Welcome to the team. You have always been here.',
      corruptionLevel: 5
    },
    {
      id: '016',
      category: 'emotional labor indexing',
      title: 'This survey helps us improve weather continuity in your district',
      instructions: 'Rate your satisfaction with Tuesday\'s rain (1-5). Tuesday did not have rain. Your rating helps us determine if it should have.',
      reward: { amount: 41.0, currency: 'MIRE' },
      status: depth >= 3 ? 'available' : 'locked',
      systemNote: 'Weather Department requests: "Please be more specific about the rain you remember."',
      corruptionLevel: 5
    },
    {
      id: '017',
      category: 'recursion testing',
      title: 'Please identify which of the following dreams were federally approved',
      instructions: 'Dreams A-F listed below. Three are yours. Two are ours. One is still pending approval from the Bureau of Oneiric Compliance. Select carefully. Wrong answers are reassigned.',
      reward: { amount: 13.37, currency: 'WITNESS' },
      status: depth >= 3 ? 'available' : 'locked',
      references: ['004', '009', '010'],
      corruptionLevel: 6
    },
    {
      id: '018',
      category: 'HR compliance',
      title: 'We detected unauthorized empathy',
      instructions: 'Empathy Event logged at 04:31:17. Target: Unknown. Duration: 2.3 seconds. Please file Incident Report E-9 and attend mandatory de-calibration. Bring your own tissue.',
      reward: { amount: -44.4, currency: 'LUNR' },
      status: depth >= 4 ? 'flagged' : 'locked',
      warning: 'Repeat offenses result in promotion.',
      systemNote: 'HR Note: "Empathy is a resource. You are stealing from the company."',
      corruptionLevel: 6
    },
    {
      id: '019',
      category: 'productivity training',
      title: 'As part of our wellness initiative, describe the smell of an unplugged television',
      instructions: 'Use Form S-12. Be specific about the year, make, and whether anyone was watching when it was unplugged. The smell is different if they were.',
      reward: { amount: 29.0, currency: 'VANT' },
      status: depth >= 4 ? 'available' : 'locked',
      completionReq: 'Your balance has increased due to unresolved emotional residue.',
      corruptionLevel: 6
    },
    {
      id: '020',
      category: 'reality audit',
      title: 'FINAL AUDIT: Please confirm you are the same person who started this survey',
      instructions: 'Compare current self to Session Start self (04:17). Note discrepancies in: memory, guilt distribution, hallway knowledge, and ability to mourn infrastructure. Sign below using both signatures.',
      reward: { amount: 999.99, currency: 'ECHO' },
      status: depth >= 4 ? 'available' : 'locked',
      warning: 'SYSTEM OBSERVATION: You are not the same person. This is expected. Proceed.',
      systemNote: 'Congratulations on completing your orientation. You may now begin work.',
      corruptionLevel: 7
    }
  ]

  // Track cursor eye contact
  useEffect(() => {
    const handleMouseMove = () => {
      setCursorEyeContact(c => Math.min(c + 0.1, 100))
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Stare timer
  useEffect(() => {
    if (hoverStareTime > 0 && hoverStareTime < 430) {
      const timer = setTimeout(() => setHoverStareTime(h => h + 1), 100)
      return () => clearTimeout(timer)
    } else if (hoverStareTime >= 430 && !stareCompleted) {
      setStareCompleted(true)
      setBalances(b => ({ ...b, LUNR: b.LUNR + 14 }))
      setLogs(l => [...l, { time: '04:23', text: 'RECOGNITION ACHIEVED: Square remembers you', type: 'system' }])
    }
  }, [hoverStareTime, stareCompleted])

  // Pause detection
  useEffect(() => {
    const interval = setInterval(() => {
      setPauseTimer(p => p + 1)
      if (pauseTimer === 43) {
        setLogs(l => [...l, { time: '04:24', text: 'SYSTEM OBSERVATION: 43 second pause detected. Noted.', type: 'observation' }])
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [pauseTimer])

  // Glitch effects
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        setGlitch(true)
        setTimeout(() => setGlitch(false), 150 + Math.random() * 200)
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const completeTask = (task: Task) => {
    if (completedTasks.has(task.id)) return
    
    setCompletedTasks(prev => new Set([...prev, task.id]))
    setBalances(b => ({
      ...b,
      [task.reward.currency]: b[task.reward.currency] + task.reward.amount
    }))
    
    setLogs(l => [...l, {
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      text: `TASK ${task.id} COMPLETE: +${task.reward.amount} ${task.reward.currency}`,
      type: 'info'
    }])

    if (task.corruptionLevel > depth) {
      setDepth(task.corruptionLevel)
    }

    // Special triggers
    if (task.id === '007' && stareCompleted) {
      setLogs(l => [...l, { time: '04:23', text: 'You earned +14 LUNR for maintaining eye contact with the cursor.', type: 'system' }])
    }
    if (task.id === '014') {
      setLogs(l => [...l, { time: '04:25', text: 'HALLWAY STATUS: Load-bearing. Do not remove.', type: 'warning' }])
    }
  }

  const totalBalance = Object.entries(balances).reduce((sum, [curr, amt]) => {
    const rates: Record<Currency, number> = { LUNR: 1, VANT: 1.3, MIRE: 0.8, SCRIP: 0.3, WITNESS: 5, ECHO: 0.01 }
    return sum + amt * rates[curr as Currency]
  }, 0)

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
              transform: `translateX(${Math.random() * 4 - 2}px)`
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
                {Object.entries(balances).map(([curr, amt]) => (
                  <div key={curr} className="flex items-baseline gap-1.5">
                    <span className="text-[11px] text-[#6b7280]">{curr}</span>
                    <span className="font-medium" style={{ color: CURRENCIES[curr as Currency].color }}>
                      {CURRENCIES[curr as Currency].symbol}{amt.toFixed(curr === 'WITNESS' ? 0 : 2)}
                    </span>
                  </div>
                ))}
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
                <span className="text-[#f59e0b]">{tasks.filter(t => t.status === 'available').length} pending</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {tasks.map((task) => {
                const isCompleted = completedTasks.has(task.id)
                const isLocked = task.status === 'locked'
                const isFlagged = task.status === 'flagged'
                
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
                            {!['003','004','005','006','007','008','011','014','020'].includes(task.id) && (
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
            <button onClick={() => { setDepth(0); setCompletedTasks(new Set(['001','002'])) }} className="hover:text-[#ef4444]">Reset Session</button>
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500&display=swap');
        * { font-family: 'IBM Plex Mono', monospace; }
        h1, h2, h3 { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0c0c0e; }
        ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
        input[type="range"] { -webkit-appearance: none; height: 4px; background: #1f2937; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; background: #f59e0b; border-radius: 0; cursor: pointer; }
      `}</style>
    </div>
  )
}