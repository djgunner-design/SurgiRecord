'use client'

import { ToastProvider } from '@/components/toast-provider'
import { UndoBar } from '@/components/undo-bar'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <UndoBar />
    </ToastProvider>
  )
}
