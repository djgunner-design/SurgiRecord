'use client'

import { useLockContext, AccessRequest } from '@/components/lock-provider'
import { Lock } from '@/lib/locks'
import { X } from 'lucide-react'

const SECTION_LABELS: Record<string, string> = {
  notes: 'Notes',
  obs: 'Observations',
  admission: 'Admission',
  meds: 'Medications',
  discharge: 'Discharge',
  recovery: 'Recovery',
  'operation-report': 'Op Report',
  handover: 'Handover',
  consent: 'Consent',
  'surgical-checklist': 'Checklist',
  'whole-chart': 'Whole Chart',
}

export default function LockBanner() {
  const { locks, userId, accessRequests, dismissAccessRequest } = useLockContext()

  // Filter out our own locks to show what others are editing
  const otherLocks = locks.filter(l => l.userId !== userId)

  if (otherLocks.length === 0 && accessRequests.length === 0) return null

  return (
    <div className="no-print">
      {/* Active locks by others */}
      {otherLocks.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 sm:px-6 py-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
              Active editors:
            </span>
            {otherLocks.map((lock: Lock) => (
              <div
                key={lock.id}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 dark:bg-amber-900/40 rounded-full"
              >
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs text-amber-800 dark:text-amber-200">
                  <strong>{SECTION_LABELS[lock.section] || lock.section}</strong>
                  {' '}
                  <span className="text-amber-600 dark:text-amber-400">by {lock.userName}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Access requests (shown to the lock holder) */}
      {accessRequests.map((req: AccessRequest) => (
        <div
          key={req.id}
          className="bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800 px-4 sm:px-6 py-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-700 dark:text-purple-300">
              <strong>{req.requesterName}</strong> is requesting access to{' '}
              <strong>{SECTION_LABELS[req.section] || req.section}</strong>
            </span>
            <button
              onClick={() => dismissAccessRequest(req.id)}
              className="p-1 text-purple-400 hover:text-purple-600 dark:hover:text-purple-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
