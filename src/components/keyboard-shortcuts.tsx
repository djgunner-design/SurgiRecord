'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { X, Keyboard } from 'lucide-react'
import { sampleAdmissions } from '@/lib/sample-data'

export default function KeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false)
  const router = useRouter()
  const params = useParams()
  const admissionId = params?.admissionId as string | undefined

  const navigatePatient = useCallback((direction: 'prev' | 'next') => {
    if (!admissionId) return
    const admissions = sampleAdmissions
    const currentIndex = admissions.findIndex(a => a.id === admissionId)
    if (currentIndex === -1) return
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= admissions.length) return
    router.push(`/patients/${admissions[newIndex].id}`)
  }, [admissionId, router])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const modKey = e.metaKey || e.ctrlKey
      const target = e.target as HTMLElement
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable

      // Escape - close any modal
      if (e.key === 'Escape') {
        if (showHelp) {
          setShowHelp(false)
          e.preventDefault()
          return
        }
        // Dispatch custom event for other modals
        window.dispatchEvent(new CustomEvent('keyboard-escape'))
        return
      }

      // Ctrl/Cmd+S - Save current form
      if (modKey && e.key === 's') {
        e.preventDefault()
        // Find and click the nearest save/submit button
        const saveBtn = document.querySelector<HTMLButtonElement>(
          'button[type="submit"], button:has(.save-icon), button[data-save]'
        )
        if (saveBtn) saveBtn.click()
        return
      }

      // Ctrl/Cmd+/ - Show shortcuts help
      if (modKey && e.key === '/') {
        e.preventDefault()
        setShowHelp(prev => !prev)
        return
      }

      // Skip remaining shortcuts if in input
      if (isInput) return

      // Alt+D - Go to dashboard
      if (e.altKey && e.key === 'd') {
        e.preventDefault()
        router.push('/dashboard')
        return
      }

      // Alt+ArrowUp/ArrowDown - Navigate patients
      if (e.altKey && e.key === 'ArrowUp') {
        e.preventDefault()
        navigatePatient('prev')
        return
      }
      if (e.altKey && e.key === 'ArrowDown') {
        e.preventDefault()
        navigatePatient('next')
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showHelp, router, navigatePatient])

  if (!showHelp) return null

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const modLabel = isMac ? 'Cmd' : 'Ctrl'

  const shortcuts = [
    { keys: `${modLabel}+S`, description: 'Save current form' },
    { keys: `${modLabel}+/`, description: 'Toggle shortcuts help' },
    { keys: 'Alt+D', description: 'Go to dashboard' },
    { keys: 'Alt+Up', description: 'Previous patient' },
    { keys: 'Alt+Down', description: 'Next patient' },
    { keys: 'Escape', description: 'Close modal' },
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={() => setShowHelp(false)}>
      <div
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 w-full max-w-md mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={() => setShowHelp(false)}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-3">
            {shortcuts.map(s => (
              <div key={s.keys} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">{s.description}</span>
                <kbd className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm">
                  {s.keys}
                </kbd>
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 py-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 rounded-b-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-gray-200 dark:bg-slate-700 rounded">{modLabel}+/</kbd> to toggle this panel
          </p>
        </div>
      </div>
    </div>
  )
}
