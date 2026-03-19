'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Timer, X, Play, Pause, RotateCcw, ChevronDown, ChevronUp, Clock } from 'lucide-react'

const TIMER_STORE_KEY = 'surgirecord_timers'

interface TimerState {
  name: string
  elapsed: number // milliseconds
  running: boolean
  startedAt: number | null // timestamp when last started
  thresholdMinutes: number
}

const PRESET_TIMERS: Array<{ name: string; thresholdMinutes: number }> = [
  { name: 'Recovery Stage 1', thresholdMinutes: 120 },
  { name: 'Tourniquet', thresholdMinutes: 60 },
  { name: 'Fasting Duration', thresholdMinutes: 360 },
  { name: 'Anaesthesia Duration', thresholdMinutes: 240 },
]

function loadTimers(): TimerState[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(TIMER_STORE_KEY)
  if (data) return JSON.parse(data)
  return PRESET_TIMERS.map(p => ({
    name: p.name,
    elapsed: 0,
    running: false,
    startedAt: null,
    thresholdMinutes: p.thresholdMinutes,
  }))
}

function saveTimers(timers: TimerState[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(TIMER_STORE_KEY, JSON.stringify(timers))
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export default function TimerWidget() {
  const [visible, setVisible] = useState(false)
  const [timers, setTimers] = useState<TimerState[]>([])
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimers(loadTimers())
  }, [])

  // Tick running timers
  useEffect(() => {
    if (!mounted) return
    intervalRef.current = setInterval(() => {
      setTimers(prev => {
        const now = Date.now()
        let changed = false
        const updated = prev.map(t => {
          if (t.running && t.startedAt) {
            changed = true
            return { ...t, elapsed: t.elapsed + (now - t.startedAt), startedAt: now }
          }
          return t
        })
        if (changed) saveTimers(updated)
        return changed ? updated : prev
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [mounted])

  const toggleTimer = useCallback((index: number) => {
    setTimers(prev => {
      const updated = [...prev]
      const t = { ...updated[index] }
      if (t.running) {
        // Stop
        if (t.startedAt) {
          t.elapsed += Date.now() - t.startedAt
        }
        t.running = false
        t.startedAt = null
      } else {
        // Start
        t.running = true
        t.startedAt = Date.now()
      }
      updated[index] = t
      saveTimers(updated)
      return updated
    })
  }, [])

  const resetTimer = useCallback((index: number) => {
    setTimers(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], elapsed: 0, running: false, startedAt: null }
      saveTimers(updated)
      return updated
    })
  }, [])

  const toggleExpand = useCallback((name: string) => {
    setExpanded(prev => ({ ...prev, [name]: !prev[name] }))
  }, [])

  const hasRunningTimers = timers.some(t => t.running)

  if (!mounted) return null

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setVisible(!visible)}
        className={`fixed bottom-4 left-4 z-[9998] w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
          hasRunningTimers
            ? 'bg-cyan-600 text-white animate-pulse'
            : 'bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600'
        } border border-gray-200 dark:border-slate-600`}
        title="Toggle timers"
      >
        <Clock className="w-5 h-5" />
      </button>

      {/* Timer panel */}
      {visible && (
        <div className="fixed bottom-20 left-4 z-[9998] w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-cyan-600 dark:bg-cyan-700 text-white">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              <span className="font-semibold text-sm">Surgical Timers</span>
            </div>
            <button onClick={() => setVisible(false)} className="hover:bg-cyan-500 dark:hover:bg-cyan-600 rounded p-1 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Timer list */}
          <div className="max-h-80 overflow-y-auto">
            {timers.map((timer, index) => {
              const currentElapsed = timer.running && timer.startedAt
                ? timer.elapsed + (Date.now() - timer.startedAt)
                : timer.elapsed
              const elapsedMinutes = currentElapsed / 60000
              const overThreshold = elapsedMinutes >= timer.thresholdMinutes
              const isExpanded = expanded[timer.name]

              return (
                <div key={timer.name} className="border-b border-gray-100 dark:border-slate-700 last:border-b-0">
                  <button
                    onClick={() => toggleExpand(timer.name)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-750 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${timer.running ? 'bg-green-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`} />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{timer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-sm font-bold ${
                        overThreshold
                          ? 'text-red-600 dark:text-red-400'
                          : timer.running
                            ? 'text-cyan-600 dark:text-cyan-400'
                            : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {formatTime(currentElapsed)}
                      </span>
                      {isExpanded ? <ChevronUp className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-3 flex items-center gap-2">
                      <button
                        onClick={() => toggleTimer(index)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          timer.running
                            ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/60'
                            : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60'
                        }`}
                      >
                        {timer.running ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        {timer.running ? 'Pause' : 'Start'}
                      </button>
                      <button
                        onClick={() => resetTimer(index)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset
                      </button>
                      {overThreshold && (
                        <span className="text-xs text-red-600 dark:text-red-400 font-medium ml-auto">
                          Over {timer.thresholdMinutes}min
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slideUp 0.2s ease-out;
        }
      `}</style>
    </>
  )
}
