'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Home, Settings, ArrowLeft, Activity, Pill, FileText, Truck, CheckSquare, ClipboardList, Moon, Sun, Menu } from 'lucide-react'
import PatientBanner from '@/components/patient-banner'
import PatientSidebar from '@/components/patient-sidebar'
import { findAdmission, findPatient, findUser } from '@/lib/sample-data'

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const router = useRouter()
  const admissionId = params.admissionId as string
  const [userName, setUserName] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const name = document.cookie.split('; ').find(c => c.startsWith('userName='))?.split('=')[1]
    if (name) setUserName(decodeURIComponent(name))

    setDarkMode(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const admission = findAdmission(admissionId)
  if (!admission) {
    return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Admission not found</div>
  }

  const patient = findPatient(admission.patientId)
  if (!patient) {
    return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Patient not found</div>
  }

  const surgeon = admission.surgeonId ? findUser(admission.surgeonId) : null

  return (
    <div className="min-h-screen bg-[#f0f4f8] dark:bg-slate-900 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 flex-shrink-0 no-print">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => router.push('/dashboard')} className="p-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 rounded-lg transition-colors hidden md:flex"
              title="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SR</span>
            </div>
            <span className="text-lg font-semibold text-gray-800 dark:text-white hidden sm:inline">SurgiRecord</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
            <button onClick={() => router.push(`/patients/${admissionId}/obs`)} className="px-2 sm:px-3 py-1.5 text-xs font-medium bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors whitespace-nowrap">OBS</button>
            <button onClick={() => router.push(`/patients/${admissionId}/meds`)} className="px-2 sm:px-3 py-1.5 text-xs font-medium bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors whitespace-nowrap">Meds</button>
            <button onClick={() => router.push(`/patients/${admissionId}/handover`)} className="px-2 sm:px-3 py-1.5 text-xs font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap">Handover</button>
            <button onClick={() => router.push(`/patients/${admissionId}/notes`)} className="px-2 sm:px-3 py-1.5 text-xs font-medium bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors whitespace-nowrap hidden sm:inline-flex">Notes</button>
            <button onClick={() => router.push(`/patients/${admissionId}/events`)} className="px-2 sm:px-3 py-1.5 text-xs font-medium bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors whitespace-nowrap hidden sm:inline-flex">Events</button>
            <button className="px-2 sm:px-3 py-1.5 text-xs font-medium bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors whitespace-nowrap hidden md:inline-flex">Care Plan</button>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={toggleDarkMode} className="p-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Toggle dark mode">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">{userName}</span>
          </div>
        </div>
      </header>

      {/* Patient Banner */}
      <PatientBanner
        admission={{
          ...admission,
          lastFood: admission.lastFood,
          lastFluid: admission.lastFluid,
        }}
        patient={{
          ...patient,
          dob: patient.dob,
        }}
        surgeonName={surgeon ? surgeon.name : null}
      />

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <PatientSidebar
          admissionId={admissionId}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 dark:bg-slate-900">
          {children}
        </main>
      </div>
    </div>
  )
}
