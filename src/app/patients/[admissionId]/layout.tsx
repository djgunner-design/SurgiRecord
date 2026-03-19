'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Home, Settings, ArrowLeft, Activity, Pill, FileText, Truck, CheckSquare, ClipboardList, Moon, Sun, Menu, Search, ChevronDown, Plus, Minus } from 'lucide-react'
import PatientBanner from '@/components/patient-banner'
import PatientSidebar from '@/components/patient-sidebar'
import TimerWidget from '@/components/timer-widget'
import RecentPatients from '@/components/recent-patients'
import { LockProvider } from '@/components/lock-provider'
import LockBanner from '@/components/lock-banner'
import { findAdmission, findPatient, findUser, sampleAdmissions, sampleUsers, ALL_STATUSES, getStatusLabel, getStatusBadgeColor, getStatusRowColor } from '@/lib/sample-data'
import { addRecentPatient, getAdmissionStatus, getCompletionPercentage } from '@/lib/store'
import { releaseAllUserLocks } from '@/lib/locks'

function ProgressRing({ percentage, size = 36 }: { percentage: number; size?: number }) {
  const strokeWidth = 3
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-slate-600"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-cyan-500 dark:text-cyan-400"
        />
      </svg>
      <span className="absolute text-[9px] font-bold text-gray-700 dark:text-gray-300">{percentage}%</span>
    </div>
  )
}

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const router = useRouter()
  const admissionId = params.admissionId as string
  const [userName, setUserName] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [patientListExpanded, setPatientListExpanded] = useState(false)

  // Inline patient list filters
  const [listDate, setListDate] = useState(new Date().toISOString().split('T')[0])
  const [listSearch, setListSearch] = useState('')
  const [listLocation, setListLocation] = useState('Any')
  const [listStatus, setListStatus] = useState('Any')

  useEffect(() => {
    const name = document.cookie.split('; ').find(c => c.startsWith('userName='))?.split('=')[1]
    if (name) setUserName(decodeURIComponent(name))

    setDarkMode(document.documentElement.classList.contains('dark'))

    // Release all locks on page unload
    const handleUnload = () => {
      const uid = document.cookie.split('; ').find(c => c.startsWith('userId='))?.split('=')[1] || '1'
      releaseAllUserLocks(uid)
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [])

  // Record recent patient visit
  useEffect(() => {
    const adm = findAdmission(admissionId)
    if (!adm) return
    const pat = findPatient(adm.patientId)
    if (!pat) return
    addRecentPatient(
      admissionId,
      `${pat.firstName} ${pat.lastName}`,
      pat.mrn,
      adm.operationNotes.substring(0, 60)
    )
  }, [admissionId])

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

  // Inline patient list data
  const locations = [...new Set(sampleAdmissions.map(a => a.location).filter(Boolean))]
  const statuses = ['Any', ...ALL_STATUSES]

  const filteredAdmissions = sampleAdmissions.filter(a => {
    const admDate = a.date.toISOString().split('T')[0]
    if (admDate !== listDate) return false
    const effectiveStatus = getAdmissionStatus(a.id) || a.status
    if (listStatus !== 'Any' && effectiveStatus !== listStatus) return false
    if (listLocation !== 'Any' && a.location !== listLocation) return false
    if (listSearch) {
      const pat = findPatient(a.patientId)
      if (!pat) return false
      const s = listSearch.toLowerCase()
      return pat.mrn.includes(listSearch) || pat.firstName.toLowerCase().includes(s) || pat.lastName.toLowerCase().includes(s)
    }
    return true
  })

  const formattedDate = new Date(listDate + 'T00:00:00').toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' })

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
            <RecentPatients />
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
          id: patient.id,
          dob: patient.dob,
        }}
        surgeonName={surgeon ? surgeon.name : null}
      />

      {/* Collapsible Patient List Bar */}
      <div className="no-print flex-shrink-0">
        <button
          onClick={() => setPatientListExpanded(!patientListExpanded)}
          className="w-full flex items-center justify-between px-4 sm:px-6 py-2.5 bg-gray-700 dark:bg-slate-700 text-white hover:bg-gray-600 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
        >
          <span>Patient List for {formattedDate}. Click here to {patientListExpanded ? 'Collapse' : 'Expand'}</span>
          <span className="flex items-center justify-center w-6 h-6 rounded bg-gray-600 dark:bg-slate-500 text-white">
            {patientListExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </span>
        </button>

        {/* Expanded Patient List */}
        {patientListExpanded && (
          <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
            {/* Filters */}
            <div className="p-3 sm:p-4 border-b border-gray-100 dark:border-slate-700">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={listDate}
                    onChange={(e) => setListDate(e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 dark:border-slate-600 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Search</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Name or MRN..."
                      value={listSearch}
                      onChange={(e) => setListSearch(e.target.value)}
                      className="w-full pl-7 pr-2 py-1.5 border border-gray-300 dark:border-slate-600 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Location</label>
                  <select
                    value={listLocation}
                    onChange={(e) => setListLocation(e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 dark:border-slate-600 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-700 dark:text-white"
                  >
                    <option>Any</option>
                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Anaesthetist</label>
                  <select className="w-full px-2 py-1.5 border border-gray-300 dark:border-slate-600 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-700 dark:text-white">
                    <option>Any</option>
                    {sampleUsers.filter(u => u.role === 'ANAESTHETIST').map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
                  <select
                    value={listStatus}
                    onChange={(e) => setListStatus(e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 dark:border-slate-600 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-700 dark:text-white"
                  >
                    {statuses.map(s => <option key={s} value={s}>{s === 'Any' ? 'Any Status' : getStatusLabel(s)}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Inline Patient Table */}
            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0">
                  <tr className="bg-gray-700 dark:bg-slate-700 text-white text-xs">
                    <th className="px-3 py-2 text-left font-medium">PATIENT</th>
                    <th className="px-3 py-2 text-left font-medium">STATUS</th>
                    <th className="px-3 py-2 text-left font-medium hidden md:table-cell">OPERATION NOTES</th>
                    <th className="px-3 py-2 text-left font-medium hidden sm:table-cell">LOCATION</th>
                    <th className="px-3 py-2 text-right font-medium hidden sm:table-cell">DOCTOR</th>
                    <th className="px-3 py-2 text-center font-medium">ADM STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmissions.map((adm) => {
                    const pat = findPatient(adm.patientId)
                    const doc = adm.surgeonId ? findUser(adm.surgeonId) : null
                    if (!pat) return null
                    const effectiveStatus = getAdmissionStatus(adm.id) || adm.status
                    const isCurrentPatient = adm.id === admissionId
                    const pct = getCompletionPercentage(adm.id)

                    return (
                      <tr
                        key={adm.id}
                        onClick={() => router.push(`/patients/${adm.id}`)}
                        className={`cursor-pointer text-sm border-b border-gray-100 dark:border-slate-700 transition-all hover:brightness-95 dark:hover:brightness-125 ${getStatusRowColor(effectiveStatus)} ${
                          isCurrentPatient ? 'ring-2 ring-inset ring-cyan-500' : ''
                        }`}
                      >
                        <td className="px-3 py-2">
                          <div className="font-semibold text-gray-900 dark:text-white text-xs">
                            {pat.mrn} - {pat.lastName} {pat.firstName}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusBadgeColor(effectiveStatus)}`}>
                            {getStatusLabel(effectiveStatus)}
                          </span>
                        </td>
                        <td className="px-3 py-2 hidden md:table-cell">
                          <div className="text-xs text-gray-700 dark:text-gray-300 max-w-xs truncate">{adm.operationNotes}</div>
                        </td>
                        <td className="px-3 py-2 hidden sm:table-cell">
                          <span className="text-xs text-gray-600 dark:text-gray-400">{adm.location}</span>
                        </td>
                        <td className="px-3 py-2 text-right hidden sm:table-cell">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{doc?.initials}</span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <div className="flex justify-center">
                            <ProgressRing percentage={pct} size={32} />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {filteredAdmissions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-3 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                        No patients found for this date
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Lock Banner */}
      <LockProvider admissionId={admissionId}>
        <LockBanner />

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
      </LockProvider>
      <TimerWidget />
    </div>
  )
}
