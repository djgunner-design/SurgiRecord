'use client'

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'

type ToastType = 'success' | 'info' | 'warning' | 'error'

interface Toast {
  id: string
  message: string
  type: ToastType
  exiting: boolean
}

interface ToastContextValue {
  showToast: (message: string, type: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}

const typeStyles: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900/40',
    border: 'border-green-400 dark:border-green-500',
    icon: '✓',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/40',
    border: 'border-blue-400 dark:border-blue-500',
    icon: 'ℹ',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/40',
    border: 'border-yellow-400 dark:border-yellow-500',
    icon: '⚠',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/40',
    border: 'border-red-400 dark:border-red-500',
    icon: '✕',
  },
}

const typeTextColors: Record<ToastType, string> = {
  success: 'text-green-800 dark:text-green-200',
  info: 'text-blue-800 dark:text-blue-200',
  warning: 'text-yellow-800 dark:text-yellow-200',
  error: 'text-red-800 dark:text-red-200',
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t))
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 300)
  }, [])

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6)
    setToasts(prev => [...prev, { id, message, type, exiting: false }])
    const timer = setTimeout(() => {
      removeToast(id)
      timersRef.current.delete(id)
    }, 4000)
    timersRef.current.set(id, timer)
  }, [removeToast])

  useEffect(() => {
    return () => {
      timersRef.current.forEach(t => clearTimeout(t))
    }
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col-reverse gap-2 pointer-events-none">
        {toasts.map(toast => {
          const style = typeStyles[toast.type]
          const textColor = typeTextColors[toast.type]
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 shadow-lg min-w-[280px] max-w-[400px] transition-all duration-300 ${style.bg} ${style.border} ${
                toast.exiting
                  ? 'translate-x-[120%] opacity-0'
                  : 'translate-x-0 opacity-100 animate-slide-in-right'
              }`}
            >
              <span className={`text-lg font-bold ${textColor} flex-shrink-0`}>{style.icon}</span>
              <span className={`text-sm font-medium ${textColor} flex-1`}>{toast.message}</span>
              <button
                onClick={() => {
                  const timer = timersRef.current.get(toast.id)
                  if (timer) {
                    clearTimeout(timer)
                    timersRef.current.delete(toast.id)
                  }
                  removeToast(toast.id)
                }}
                className={`${textColor} hover:opacity-70 flex-shrink-0 text-lg leading-none`}
              >
                &times;
              </button>
            </div>
          )
        })}
      </div>
      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </ToastContext.Provider>
  )
}
