'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import {
  Lock,
  LockEvent,
  acquireLock,
  releaseLock,
  refreshLock,
  getLocks,
  getSectionLock,
  isLockedByOther,
  releaseAllUserLocks,
  onLockEvent,
  getLockVersion,
  cleanStaleLocks,
  requestAccess,
  broadcastLockEvent,
} from '@/lib/locks'

// ---- Types ----

export type LockStatus = 'unlocked' | 'locked-by-me' | 'locked-by-other'

export interface UseLockResult {
  isEditable: boolean
  lockHolder: string | null
  requestLock: () => void
  releaseLock: () => void
  hasLock: boolean
  lockStatus: LockStatus
}

interface LockContextValue {
  admissionId: string
  userId: string
  userName: string
  locks: Lock[]
  refreshAllLocks: () => void
  accessRequests: AccessRequest[]
  dismissAccessRequest: (id: string) => void
}

export interface AccessRequest {
  id: string
  admissionId: string
  section: string
  requesterName: string
  timestamp: number
}

// ---- Context ----

const LockContext = createContext<LockContextValue | null>(null)

// ---- Provider ----

interface LockProviderProps {
  admissionId: string
  children: React.ReactNode
}

export function LockProvider({ admissionId, children }: LockProviderProps) {
  const [userId, setUserId] = useState('')
  const [userName, setUserName] = useState('')
  const [locks, setLocks] = useState<Lock[]>([])
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([])
  const lastVersionRef = useRef<number>(0)
  const heldLocksRef = useRef<Map<string, string>>(new Map()) // section -> lockId

  // Read user info from cookies
  useEffect(() => {
    const uid = document.cookie.split('; ').find(c => c.startsWith('userId='))?.split('=')[1] || '1'
    const uname = document.cookie.split('; ').find(c => c.startsWith('userName='))?.split('=')[1]
    setUserId(uid)
    setUserName(uname ? decodeURIComponent(uname) : 'Unknown User')
  }, [])

  // Refresh locks from localStorage
  const refreshAllLocks = useCallback(() => {
    cleanStaleLocks()
    const currentLocks = getLocks(admissionId)
    setLocks(currentLocks)
  }, [admissionId])

  // Poll localStorage every 3 seconds for cross-device sync
  useEffect(() => {
    if (!userId) return

    refreshAllLocks()

    const pollInterval = setInterval(() => {
      const currentVersion = getLockVersion()
      if (currentVersion !== lastVersionRef.current) {
        lastVersionRef.current = currentVersion
        refreshAllLocks()
      }
    }, 3000)

    return () => clearInterval(pollInterval)
  }, [userId, refreshAllLocks])

  // Heartbeat: keep our locks alive every 15 seconds
  useEffect(() => {
    if (!userId) return

    const heartbeatInterval = setInterval(() => {
      heldLocksRef.current.forEach((lockId) => {
        refreshLock(lockId, userId)
      })
    }, 15000)

    return () => clearInterval(heartbeatInterval)
  }, [userId])

  // BroadcastChannel listener for instant cross-tab updates
  useEffect(() => {
    if (!userId) return

    const unsubscribe = onLockEvent((event: LockEvent) => {
      if (
        event.type === 'lock_acquired' ||
        event.type === 'lock_released' ||
        event.type === 'locks_changed'
      ) {
        refreshAllLocks()
      }

      if (event.type === 'access_requested') {
        // Only show if we hold a lock on this section
        const sectionLock = getSectionLock(event.admissionId, event.section)
        if (sectionLock && sectionLock.userId === userId) {
          const req: AccessRequest = {
            id: 'ar_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
            admissionId: event.admissionId,
            section: event.section,
            requesterName: event.requesterName,
            timestamp: Date.now(),
          }
          setAccessRequests(prev => [...prev, req])

          // Auto-dismiss after 15 seconds
          setTimeout(() => {
            setAccessRequests(prev => prev.filter(r => r.id !== req.id))
          }, 15000)
        }
      }
    })

    return unsubscribe
  }, [userId, admissionId, refreshAllLocks])

  // On page unload, release all locks held by this user
  useEffect(() => {
    if (!userId) return

    const handleUnload = () => {
      releaseAllUserLocks(userId)
    }

    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [userId])

  const dismissAccessRequest = useCallback((id: string) => {
    setAccessRequests(prev => prev.filter(r => r.id !== id))
  }, [])

  // Register/unregister held locks for heartbeat tracking
  const registerHeldLock = useCallback((section: string, lockId: string) => {
    heldLocksRef.current.set(section, lockId)
  }, [])

  const unregisterHeldLock = useCallback((section: string) => {
    heldLocksRef.current.delete(section)
  }, [])

  return (
    <LockContext.Provider
      value={{
        admissionId,
        userId,
        userName,
        locks,
        refreshAllLocks,
        accessRequests,
        dismissAccessRequest,
      }}
    >
      <HeldLocksContext.Provider value={{ registerHeldLock, unregisterHeldLock }}>
        {children}
      </HeldLocksContext.Provider>
    </LockContext.Provider>
  )
}

// Internal context for held lock registration
const HeldLocksContext = createContext<{
  registerHeldLock: (section: string, lockId: string) => void
  unregisterHeldLock: (section: string) => void
}>({ registerHeldLock: () => {}, unregisterHeldLock: () => {} })

// ---- useLock Hook ----

export function useLock(section: string): UseLockResult {
  const ctx = useContext(LockContext)
  const heldCtx = useContext(HeldLocksContext)

  if (!ctx) {
    // No LockProvider found - return safe defaults (everything editable)
    return {
      isEditable: true,
      lockHolder: null,
      requestLock: () => {},
      releaseLock: () => {},
      hasLock: false,
      lockStatus: 'unlocked',
    }
  }

  const { admissionId, userId, userName, locks, refreshAllLocks } = ctx
  const { registerHeldLock, unregisterHeldLock } = heldCtx
  const lockRef = useRef<Lock | null>(null)

  // Derive lock status from current locks list
  const sectionLock = locks.find(l => l.section === section) || null

  let lockStatus: LockStatus = 'unlocked'
  let lockHolder: string | null = null
  let hasLock = false

  if (sectionLock) {
    if (sectionLock.userId === userId) {
      lockStatus = 'locked-by-me'
      hasLock = true
      lockHolder = null
    } else {
      lockStatus = 'locked-by-other'
      lockHolder = sectionLock.userName
    }
  }

  const isEditable = lockStatus !== 'locked-by-other'

  // Keep lockRef synced
  useEffect(() => {
    if (hasLock && sectionLock) {
      lockRef.current = sectionLock
      registerHeldLock(section, sectionLock.id)
    }
    return () => {
      // Don't unregister here - only on explicit release or unmount
    }
  }, [hasLock, sectionLock, section, registerHeldLock])

  // Auto-release on unmount
  useEffect(() => {
    return () => {
      if (lockRef.current && userId) {
        releaseLock(lockRef.current.id, userId)
        unregisterHeldLock(section)
        lockRef.current = null
        // Broadcast so other tabs update
        broadcastLockEvent({ type: 'locks_changed' })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, section])

  const doRequestLock = useCallback(() => {
    if (!userId || !userName) return

    const result = acquireLock(admissionId, section, userId, userName)
    if (result) {
      lockRef.current = result
      registerHeldLock(section, result.id)
      refreshAllLocks()
    } else {
      // Lock held by someone else - send access request
      requestAccess(admissionId, section, userName)
    }
  }, [admissionId, section, userId, userName, refreshAllLocks, registerHeldLock])

  const doReleaseLock = useCallback(() => {
    if (lockRef.current && userId) {
      releaseLock(lockRef.current.id, userId)
      unregisterHeldLock(section)
      lockRef.current = null
      refreshAllLocks()
    }
  }, [userId, section, refreshAllLocks, unregisterHeldLock])

  return {
    isEditable,
    lockHolder,
    requestLock: doRequestLock,
    releaseLock: doReleaseLock,
    hasLock,
    lockStatus,
  }
}

// ---- useLockContext (for banner, etc.) ----

export function useLockContext() {
  const ctx = useContext(LockContext)
  if (!ctx) {
    return {
      admissionId: '',
      userId: '',
      userName: '',
      locks: [] as Lock[],
      refreshAllLocks: () => {},
      accessRequests: [] as AccessRequest[],
      dismissAccessRequest: (_id: string) => {},
    }
  }
  return ctx
}
