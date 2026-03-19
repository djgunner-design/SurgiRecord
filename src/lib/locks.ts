'use client'

// Lock Manager for SurgiRecord
// Uses localStorage as a shared lock registry + BroadcastChannel for instant cross-tab notification.
// Designed to be swappable to WebSocket/server-based locks later.

export interface Lock {
  id: string
  admissionId: string
  section: string
  userId: string
  userName: string
  acquiredAt: number
  expiresAt: number
  heartbeat: number
}

export interface LockCheckResult {
  locked: boolean
  holder?: string
}

const LOCKS_KEY = 'surgirecord_locks'
const LOCK_VERSION_KEY = 'surgirecord_locks_version'
const LOCK_EXPIRY_MS = 5 * 60 * 1000        // 5 minutes
const STALE_HEARTBEAT_MS = 30 * 1000         // 30 seconds - lock considered stale if no heartbeat

// Channel name for cross-tab communication
const CHANNEL_NAME = 'surgirecord_locks_channel'

// ---- BroadcastChannel helpers ----

export type LockEvent =
  | { type: 'lock_acquired'; lock: Lock }
  | { type: 'lock_released'; lockId: string; admissionId: string; section: string }
  | { type: 'lock_heartbeat'; lockId: string }
  | { type: 'access_requested'; admissionId: string; section: string; requesterName: string }
  | { type: 'locks_changed' }

let _channel: BroadcastChannel | null = null

function getChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined') return null
  if (typeof BroadcastChannel === 'undefined') return null
  if (!_channel) {
    try {
      _channel = new BroadcastChannel(CHANNEL_NAME)
    } catch {
      return null
    }
  }
  return _channel
}

export function broadcastLockEvent(event: LockEvent) {
  const ch = getChannel()
  if (ch) {
    try {
      ch.postMessage(event)
    } catch {
      // ignore closed channel errors
    }
  }
}

export function onLockEvent(handler: (event: LockEvent) => void): () => void {
  const ch = getChannel()
  if (!ch) return () => {}
  const listener = (e: MessageEvent) => {
    handler(e.data as LockEvent)
  }
  ch.addEventListener('message', listener)
  return () => ch.removeEventListener('message', listener)
}

// ---- localStorage lock registry ----

function now(): number {
  return Date.now()
}

function generateLockId(): string {
  return 'lock_' + now() + '_' + Math.random().toString(36).substr(2, 9)
}

function getLockRegistry(): Lock[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(LOCKS_KEY)
  return data ? JSON.parse(data) : []
}

function saveLockRegistry(locks: Lock[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(LOCKS_KEY, JSON.stringify(locks))
  // Bump version for optimistic concurrency detection
  const version = parseInt(localStorage.getItem(LOCK_VERSION_KEY) || '0', 10)
  localStorage.setItem(LOCK_VERSION_KEY, String(version + 1))
}

export function getLockVersion(): number {
  if (typeof window === 'undefined') return 0
  return parseInt(localStorage.getItem(LOCK_VERSION_KEY) || '0', 10)
}

// ---- Public API ----

/**
 * Remove locks where heartbeat is older than STALE_HEARTBEAT_MS
 */
export function cleanStaleLocks(): void {
  const locks = getLockRegistry()
  const cutoff = now() - STALE_HEARTBEAT_MS
  const active = locks.filter(l => l.heartbeat > cutoff && l.expiresAt > now())
  if (active.length !== locks.length) {
    saveLockRegistry(active)
    broadcastLockEvent({ type: 'locks_changed' })
  }
}

/**
 * Attempt to acquire a lock on a section for a patient.
 * Returns the Lock if acquired, null if someone else holds it.
 * Auto-expires stale locks before checking.
 */
export function acquireLock(
  admissionId: string,
  section: string,
  userId: string,
  userName: string
): Lock | null {
  cleanStaleLocks()

  const locks = getLockRegistry()

  // Check if already locked by someone else
  const existing = locks.find(
    l => l.admissionId === admissionId && l.section === section
  )

  if (existing) {
    if (existing.userId === userId) {
      // Already held by this user - refresh and return it
      existing.heartbeat = now()
      existing.expiresAt = now() + LOCK_EXPIRY_MS
      saveLockRegistry(locks)
      return existing
    }
    // Held by someone else
    return null
  }

  // Acquire new lock
  const lock: Lock = {
    id: generateLockId(),
    admissionId,
    section,
    userId,
    userName,
    acquiredAt: now(),
    expiresAt: now() + LOCK_EXPIRY_MS,
    heartbeat: now(),
  }

  locks.push(lock)
  saveLockRegistry(locks)
  broadcastLockEvent({ type: 'lock_acquired', lock })

  return lock
}

/**
 * Release a lock. Only the holder can release.
 */
export function releaseLock(lockId: string, userId: string): boolean {
  const locks = getLockRegistry()
  const idx = locks.findIndex(l => l.id === lockId && l.userId === userId)
  if (idx === -1) return false

  const removed = locks[idx]
  locks.splice(idx, 1)
  saveLockRegistry(locks)
  broadcastLockEvent({
    type: 'lock_released',
    lockId: removed.id,
    admissionId: removed.admissionId,
    section: removed.section,
  })
  return true
}

/**
 * Heartbeat - extend expiry, update heartbeat timestamp.
 */
export function refreshLock(lockId: string, userId: string): boolean {
  const locks = getLockRegistry()
  const lock = locks.find(l => l.id === lockId && l.userId === userId)
  if (!lock) return false

  lock.heartbeat = now()
  lock.expiresAt = now() + LOCK_EXPIRY_MS
  saveLockRegistry(locks)
  broadcastLockEvent({ type: 'lock_heartbeat', lockId })
  return true
}

/**
 * Get all active locks for a patient.
 */
export function getLocks(admissionId: string): Lock[] {
  cleanStaleLocks()
  return getLockRegistry().filter(l => l.admissionId === admissionId)
}

/**
 * Check if a specific section is locked.
 */
export function getSectionLock(admissionId: string, section: string): Lock | null {
  cleanStaleLocks()
  return getLockRegistry().find(
    l => l.admissionId === admissionId && l.section === section
  ) || null
}

/**
 * Quick check - is this section locked by someone other than userId?
 */
export function isLockedByOther(
  admissionId: string,
  section: string,
  userId: string
): LockCheckResult {
  cleanStaleLocks()
  const lock = getLockRegistry().find(
    l => l.admissionId === admissionId && l.section === section
  )
  if (!lock) return { locked: false }
  if (lock.userId === userId) return { locked: false }
  return { locked: true, holder: lock.userName }
}

/**
 * Release all locks held by a user (on logout/disconnect).
 */
export function releaseAllUserLocks(userId: string): void {
  const locks = getLockRegistry()
  const remaining = locks.filter(l => l.userId !== userId)
  if (remaining.length !== locks.length) {
    saveLockRegistry(remaining)
    broadcastLockEvent({ type: 'locks_changed' })
  }
}

/**
 * Request access to a locked section (sends a BroadcastChannel notification).
 */
export function requestAccess(admissionId: string, section: string, requesterName: string): void {
  broadcastLockEvent({
    type: 'access_requested',
    admissionId,
    section,
    requesterName,
  })
}
