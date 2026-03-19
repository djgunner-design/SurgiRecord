'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, ChevronDown, User } from 'lucide-react'
import { getRecentPatients, type RecentPatient } from '@/lib/store'

export default function RecentPatients() {
  const [open, setOpen] = useState(false)
  const [patients, setPatients] = useState<RecentPatient[]>([])
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPatients(getRecentPatients())
  }, [])

  // Refresh list when dropdown opens
  useEffect(() => {
    if (open) {
      setPatients(getRecentPatients())
    }
  }, [open])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }
  }, [open])

  // Close on escape
  useEffect(() => {
    function handleEscape() { setOpen(false) }
    window.addEventListener('keyboard-escape', handleEscape)
    return () => window.removeEventListener('keyboard-escape', handleEscape)
  }, [])

  if (patients.length === 0) return null

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
        title="Recent patients"
      >
        <Clock className="w-4 h-4" />
        <span className="hidden sm:inline">Recent</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-80 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/80">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent Patients</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {patients.map((p) => (
              <button
                key={p.admissionId}
                onClick={() => {
                  setOpen(false)
                  router.push(`/patients/${p.admissionId}`)
                }}
                className="w-full text-left px-4 py-3 hover:bg-cyan-50 dark:hover:bg-slate-700 transition-colors border-b border-gray-100 dark:border-slate-700/50 last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800 dark:text-white truncate">{p.patientName}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">MRN: {p.mrn}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{p.operation}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
