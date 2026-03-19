'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Undo2 } from 'lucide-react'
import { peekUndoAction, popUndoAction, clearUndoAction, subscribeUndo } from '@/lib/store'

const UNDO_TIMEOUT = 10000 // 10 seconds

export function UndoBar() {
  const [action, setAction] = useState<{ id: string; description: string; timestamp: number } | null>(null)
  const [remaining, setRemaining] = useState(UNDO_TIMEOUT)
  const [exiting, setExiting] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)

  const dismiss = useCallback(() => {
    if (!action) return
    setExiting(true)
    setTimeout(() => {
      clearUndoAction(action.id)
      setAction(null)
      setExiting(false)
    }, 300)
  }, [action])

  const handleUndo = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
    popUndoAction()
    setExiting(true)
    setTimeout(() => {
      setAction(null)
      setExiting(false)
    }, 300)
  }, [])

  useEffect(() => {
    const refresh = () => {
      const latest = peekUndoAction()
      if (latest && (!action || latest.id !== action.id)) {
        setAction(latest)
        setRemaining(UNDO_TIMEOUT)
        setExiting(false)
      } else if (!latest) {
        setAction(null)
      }
    }

    refresh()
    const unsub = subscribeUndo(refresh)
    return unsub
  }, [action])

  // Auto-dismiss timer
  useEffect(() => {
    if (!action) return

    if (timerRef.current) clearTimeout(timerRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)

    const startTime = Date.now()
    setRemaining(UNDO_TIMEOUT)

    countdownRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const left = Math.max(0, UNDO_TIMEOUT - elapsed)
      setRemaining(left)
      if (left <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current)
      }
    }, 100)

    timerRef.current = setTimeout(() => {
      dismiss()
    }, UNDO_TIMEOUT)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [action, dismiss])

  if (!action) return null

  const progress = remaining / UNDO_TIMEOUT

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[9998] transition-all duration-300 ${
        exiting ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="bg-gray-900 dark:bg-slate-700 text-white rounded-xl shadow-2xl px-5 py-3 flex items-center gap-4 min-w-[320px] max-w-[500px]">
        <div className="flex-1">
          <p className="text-sm font-medium">{action.description}</p>
          <p className="text-xs text-gray-400 dark:text-gray-300 mt-0.5">
            Undo in {Math.ceil(remaining / 1000)}s
          </p>
        </div>
        <button
          onClick={handleUndo}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Undo2 className="w-3.5 h-3.5" />
          Undo
        </button>
        <button
          onClick={dismiss}
          className="text-gray-400 hover:text-white transition-colors text-lg leading-none"
        >
          &times;
        </button>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl overflow-hidden">
          <div
            className="h-full bg-cyan-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
