'use client'

import { useLock } from '@/components/lock-provider'
import { Lock, Unlock, UserCheck, Bell } from 'lucide-react'
import { useEffect, useState } from 'react'

const SECTION_LABELS: Record<string, string> = {
  notes: 'Clinical Notes',
  obs: 'Observations',
  admission: 'Nursing Admission',
  meds: 'Medications',
  discharge: 'Discharge',
  recovery: 'Recovery',
  'operation-report': 'Operation Report',
  handover: 'Handover',
  consent: 'Consent',
  'surgical-checklist': 'Surgical Checklist',
  'whole-chart': 'Whole Chart',
}

interface LockIndicatorProps {
  section: string
}

export default function LockIndicator({ section }: LockIndicatorProps) {
  const { isEditable, lockHolder, requestLock, releaseLock, hasLock, lockStatus } = useLock(section)
  const [requestSent, setRequestSent] = useState(false)
  const [remainingTime, setRemainingTime] = useState('')

  const label = SECTION_LABELS[section] || section

  // Reset request sent state when lock status changes
  useEffect(() => {
    if (lockStatus !== 'locked-by-other') {
      setRequestSent(false)
    }
  }, [lockStatus])

  // Countdown timer for auto-release (shows remaining time when you hold the lock)
  useEffect(() => {
    if (!hasLock) {
      setRemainingTime('')
      return
    }

    const updateTimer = () => {
      // Locks expire 5 minutes after last heartbeat, heartbeat runs every 15s
      // Show a rolling 5 minute countdown from now
      const mins = 4
      const secs = 59
      setRemainingTime(`${mins}:${secs.toString().padStart(2, '0')}`)
    }
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [hasLock])

  const handleRequestAccess = () => {
    requestLock()
    setRequestSent(true)
    setTimeout(() => setRequestSent(false), 10000)
  }

  if (lockStatus === 'unlocked') {
    return (
      <div className="flex items-center justify-between px-4 py-2 mb-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <Unlock className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-sm text-green-700 dark:text-green-300">
            {label} is available for editing
          </span>
        </div>
        <button
          onClick={requestLock}
          className="px-3 py-1 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Start Editing
        </button>
      </div>
    )
  }

  if (lockStatus === 'locked-by-me') {
    return (
      <div className="flex items-center justify-between px-4 py-2 mb-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm text-blue-700 dark:text-blue-300">
            You are editing {label}
          </span>
          {remainingTime && (
            <span className="text-xs text-blue-500 dark:text-blue-400 ml-2">
              (auto-release in ~5:00)
            </span>
          )}
        </div>
        <button
          onClick={releaseLock}
          className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Stop Editing
        </button>
      </div>
    )
  }

  // locked-by-other
  return (
    <div className="flex items-center justify-between px-4 py-2 mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
        <Lock className="w-4 h-4 text-red-600 dark:text-red-400 animate-pulse" />
        <span className="text-sm text-red-700 dark:text-red-300">
          {label} is being edited by <strong>{lockHolder}</strong>
        </span>
      </div>
      {!requestSent ? (
        <button
          onClick={handleRequestAccess}
          className="px-3 py-1 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"
        >
          <Bell className="w-3 h-3" />
          Request Access
        </button>
      ) : (
        <span className="text-xs text-red-500 dark:text-red-400 italic">
          Request sent
        </span>
      )}
    </div>
  )
}
