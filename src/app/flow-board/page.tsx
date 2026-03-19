'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Home, RefreshCw, LogOut, Moon, Sun, ArrowLeft, Clock, User } from 'lucide-react'
import { sampleAdmissions, findPatient, findUser } from '@/lib/sample-data'
import { getAdmissionStatus, updateAdmissionStatus } from '@/lib/store'

const COLUMNS = [
  { status: 'BOOKED', label: 'Waiting', color: 'bg-blue-500', headerBg: 'bg-blue-500', darkHeaderBg: 'dark:bg-blue-700' },
  { status: 'ADMITTED', label: 'Admitted', color: 'bg-sky-500', headerBg: 'bg-sky-500', darkHeaderBg: 'dark:bg-sky-700' },
  { status: 'PRE_OP', label: 'Pre-Op', color: 'bg-indigo-500', headerBg: 'bg-indigo-500', darkHeaderBg: 'dark:bg-indigo-700' },
  { status: 'IN_THEATRE', label: 'In Theatre', color: 'bg-yellow-500', headerBg: 'bg-yellow-500', darkHeaderBg: 'dark:bg-yellow-700' },
  { status: 'RECOVERY_1', label: 'Recovery 1', color: 'bg-emerald-500', headerBg: 'bg-emerald-500', darkHeaderBg: 'dark:bg-emerald-700' },
  { status: 'RECOVERY_2', label: 'Recovery 2', color: 'bg-teal-500', headerBg: 'bg-teal-500', darkHeaderBg: 'dark:bg-teal-700' },
  { status: 'DISCHARGED', label: 'Discharged', color: 'bg-green-500', headerBg: 'bg-green-600', darkHeaderBg: 'dark:bg-green-700' },
] as const

function getCardBorderColor(status: string): string {
  switch (status) {
    case 'BOOKED': return 'border-l-blue-500'
    case 'ADMITTED': return 'border-l-sky-500'
    case 'PRE_OP': return 'border-l-indigo-500'
    case 'IN_THEATRE': return 'border-l-yellow-500'
    case 'RECOVERY_1': return 'border-l-emerald-500'
    case 'RECOVERY_2': return 'border-l-teal-500'
    case 'DISCHARGED': return 'border-l-green-500'
    default: return 'border-l-gray-400'
  }
}

export default function FlowBoardPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [draggedAdmissionId, setDraggedAdmissionId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  useEffect(() => {
    const name = document.cookie.split('; ').find(c => c.startsWith('userName='))?.split('=')[1]
    if (name) setUserName(decodeURIComponent(name))
    else router.push('/')

    setDarkMode(document.documentElement.classList.contains('dark'))
  }, [router])

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

  const getUserId = () => {
    return document.cookie.split('; ').find(c => c.startsWith('userId='))?.split('=')[1] || '1'
  }

  const handleLogout = () => {
    document.cookie = 'userId=; path=/; max-age=0'
    document.cookie = 'userName=; path=/; max-age=0'
    document.cookie = 'userInitials=; path=/; max-age=0'
    router.push('/')
  }

  const getEffectiveStatus = useCallback((admission: typeof sampleAdmissions[0]) => {
    return getAdmissionStatus(admission.id) || admission.status
  }, [refreshKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const getAdmissionsForColumn = (columnStatus: string) => {
    const today = new Date().toISOString().split('T')[0]
    return sampleAdmissions.filter(a => {
      const admDate = a.date.toISOString().split('T')[0]
      if (admDate !== today) return false
      return getEffectiveStatus(a) === columnStatus
    })
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, admissionId: string) => {
    setDraggedAdmissionId(admissionId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', admissionId)
    // Add a slight delay for the drag image
    const target = e.currentTarget as HTMLElement
    target.style.opacity = '0.5'
  }

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement
    target.style.opacity = '1'
    setDraggedAdmissionId(null)
    setDragOverColumn(null)
  }

  const handleDragOver = (e: React.DragEvent, columnStatus: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(columnStatus)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we're leaving the column entirely
    const relatedTarget = e.relatedTarget as HTMLElement
    const currentTarget = e.currentTarget as HTMLElement
    if (!currentTarget.contains(relatedTarget)) {
      setDragOverColumn(null)
    }
  }

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    const admissionId = e.dataTransfer.getData('text/plain')
    if (admissionId) {
      const userId = getUserId()
      updateAdmissionStatus(admissionId, newStatus, userId)
      setRefreshKey(k => k + 1)
    }
    setDraggedAdmissionId(null)
    setDragOverColumn(null)
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] dark:bg-slate-900 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SR</span>
            </div>
            <span className="text-lg font-semibold text-gray-800 dark:text-white hidden sm:inline">SurgiRecord</span>
            <span className="text-gray-300 dark:text-slate-600 hidden sm:inline">|</span>
            <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hidden sm:inline">Flow Board</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => { setRefreshKey(k => k + 1) }}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">{userName}</span>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Flow Board */}
      <main className="flex-1 p-4 sm:p-6 overflow-x-auto">
        <div className="flex gap-4 min-w-max h-full">
          {COLUMNS.map(column => {
            const columnAdmissions = getAdmissionsForColumn(column.status)
            const isOver = dragOverColumn === column.status

            return (
              <div
                key={column.status}
                className={`flex flex-col w-64 rounded-xl overflow-hidden border transition-all ${
                  isOver
                    ? 'border-cyan-400 dark:border-cyan-500 ring-2 ring-cyan-200 dark:ring-cyan-800'
                    : 'border-gray-200 dark:border-slate-700'
                } bg-gray-50 dark:bg-slate-800/50`}
                onDragOver={(e) => handleDragOver(e, column.status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.status)}
              >
                {/* Column Header */}
                <div className={`${column.headerBg} ${column.darkHeaderBg} px-4 py-3 flex items-center justify-between`}>
                  <h3 className="text-sm font-semibold text-white">{column.label}</h3>
                  <span className="bg-white/20 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {columnAdmissions.length}
                  </span>
                </div>

                {/* Column Body */}
                <div className={`flex-1 p-2 space-y-2 min-h-[200px] transition-colors ${
                  isOver ? 'bg-cyan-50/50 dark:bg-cyan-900/10' : ''
                }`}>
                  {columnAdmissions.length === 0 && (
                    <div className="flex items-center justify-center h-24 text-xs text-gray-400 dark:text-slate-500 italic">
                      No patients
                    </div>
                  )}
                  {columnAdmissions.map(admission => {
                    const patient = findPatient(admission.patientId)
                    const surgeon = admission.surgeonId ? findUser(admission.surgeonId) : null
                    if (!patient) return null

                    const isDragging = draggedAdmissionId === admission.id

                    return (
                      <div
                        key={admission.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, admission.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => router.push(`/patients/${admission.id}`)}
                        className={`bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-l-4 ${getCardBorderColor(column.status)} border-gray-200 dark:border-slate-600 p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
                          isDragging ? 'opacity-50' : ''
                        }`}
                      >
                        {/* Patient Name */}
                        <div className="flex items-start justify-between gap-1 mb-1.5">
                          <div className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">
                            {patient.lastName}, {patient.firstName}
                          </div>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                            patient.sex === 'Female'
                              ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                          }`}>
                            {patient.sex === 'Female' ? '\u2640' : '\u2642'}
                          </div>
                        </div>

                        {/* MRN */}
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          MRN: {patient.mrn}
                        </div>

                        {/* Operation */}
                        <div className="text-xs text-gray-700 dark:text-gray-300 mb-2 line-clamp-2 leading-relaxed">
                          {admission.operationNotes}
                        </div>

                        {/* Footer: Surgeon + Time */}
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-1.5 border-t border-gray-100 dark:border-slate-600">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{surgeon?.initials || '--'}</span>
                          </div>
                          {admission.time && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{admission.time}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
