'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Home, Settings, RefreshCw, Search, LogOut, Moon, Sun, Globe, Printer, ChevronDown, Columns3, CheckSquare, FileText, BarChart3 } from 'lucide-react'
import { sampleAdmissions, sampleUsers, findUser, findPatient } from '@/lib/sample-data'
import { getAdmissionStatus, updateAdmissionStatus } from '@/lib/store'

function getStatusColor(status: string): string {
  switch (status) {
    case 'DISCHARGED': return 'bg-green-50 border-l-4 border-l-green-500 dark:bg-green-950/30'
    case 'BOOKED': return 'bg-blue-50 border-l-4 border-l-blue-500 dark:bg-blue-950/30'
    case 'CANCELLED': return 'bg-red-50 border-l-4 border-l-red-500 dark:bg-red-950/30'
    case 'IN_THEATRE': return 'bg-yellow-50 border-l-4 border-l-yellow-500 dark:bg-yellow-950/30'
    case 'RECOVERY_1': return 'bg-emerald-50 border-l-4 border-l-emerald-400 dark:bg-emerald-950/30'
    case 'RECOVERY_2': return 'bg-teal-50 border-l-4 border-l-teal-500 dark:bg-teal-950/30'
    case 'ADMITTED': return 'bg-sky-50 border-l-4 border-l-sky-500 dark:bg-sky-950/30'
    default: return 'bg-gray-50 border-l-4 border-l-gray-300 dark:bg-gray-800/30'
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'RECOVERY_1': return 'Recovery Stage 1'
    case 'RECOVERY_2': return 'Recovery Stage 2'
    case 'IN_THEATRE': return 'In Theatre'
    default: return status.charAt(0) + status.slice(1).toLowerCase()
  }
}

function getStatusBadgeColor(status: string): string {
  switch (status) {
    case 'DISCHARGED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'BOOKED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'IN_THEATRE': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'RECOVERY_1': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
    case 'RECOVERY_2': return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
    case 'ADMITTED': return 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Any')
  const [locationFilter, setLocationFilter] = useState('Any')
  const [userName, setUserName] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [globalSearch, setGlobalSearch] = useState(false)
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const name = document.cookie.split('; ').find(c => c.startsWith('userName='))?.split('=')[1]
    if (name) setUserName(decodeURIComponent(name))
    else router.push('/')

    // Initialize dark mode state from DOM
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

  const getEffectiveStatusFn = (admission: typeof sampleAdmissions[0]) => {
    return getAdmissionStatus(admission.id) || admission.status
  }

  const admissions = sampleAdmissions.filter(a => {
    const admDate = a.date.toISOString().split('T')[0]
    if (!globalSearch && admDate !== date) return false
    const effectiveStatus = getEffectiveStatusFn(a)
    if (statusFilter !== 'Any' && effectiveStatus !== statusFilter) return false
    if (locationFilter !== 'Any' && a.location !== locationFilter) return false

    if (searchTerm) {
      const patient = findPatient(a.patientId)
      if (!patient) return false
      const searchLower = searchTerm.toLowerCase()
      return (
        patient.mrn.includes(searchTerm) ||
        patient.firstName.toLowerCase().includes(searchLower) ||
        patient.lastName.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const locations = [...new Set(sampleAdmissions.map(a => a.location).filter(Boolean))]
  const statuses = ['Any', 'BOOKED', 'ADMITTED', 'IN_THEATRE', 'RECOVERY_1', 'RECOVERY_2', 'DISCHARGED', 'CANCELLED']

  const handleLogout = () => {
    document.cookie = 'userId=; path=/; max-age=0'
    document.cookie = 'userName=; path=/; max-age=0'
    document.cookie = 'userInitials=; path=/; max-age=0'
    router.push('/')
  }

  const getUserId = () => {
    return document.cookie.split('; ').find(c => c.startsWith('userId='))?.split('=')[1] || '1'
  }

  const handleStatusChange = (admissionId: string, newStatus: string) => {
    const userId = getUserId()
    updateAdmissionStatus(admissionId, newStatus, userId)
    setEditingStatusId(null)
    setRefreshKey(k => k + 1)
  }

  // Batch selection handlers
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === admissions.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(admissions.map(a => a.id)))
    }
  }

  const handleBatchDischarge = () => {
    const userId = getUserId()
    selectedIds.forEach(id => {
      updateAdmissionStatus(id, 'DISCHARGED', userId)
    })
    setSelectedIds(new Set())
    setRefreshKey(k => k + 1)
  }

  const handleBatchPrint = () => {
    const patientNames = Array.from(selectedIds).map(id => {
      const adm = sampleAdmissions.find(a => a.id === id)
      if (!adm) return ''
      const pat = findPatient(adm.patientId)
      return pat ? `${pat.lastName} ${pat.firstName}` : ''
    }).filter(Boolean)
    alert(`Printing discharge summaries for:\n${patientNames.join('\n')}`)
  }

  const handleBatchReport = () => {
    const patientNames = Array.from(selectedIds).map(id => {
      const adm = sampleAdmissions.find(a => a.id === id)
      if (!adm) return ''
      const pat = findPatient(adm.patientId)
      return pat ? `${pat.lastName} ${pat.firstName}` : ''
    }).filter(Boolean)
    alert(`Generating report for:\n${patientNames.join('\n')}`)
  }

  const allSelected = admissions.length > 0 && selectedIds.size === admissions.length

  return (
    <div className="min-h-screen bg-[#f0f4f8] dark:bg-slate-900">
      {/* Top Navigation */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 no-print">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SR</span>
            </div>
            <span className="text-lg font-semibold text-gray-800 dark:text-white hidden sm:inline">SurgiRecord</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <Home className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push('/day-summary')}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Day Summary"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button onClick={toggleDarkMode} className="p-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Toggle dark mode">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => window.print()} className="p-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Print">
              <Printer className="w-5 h-5" />
            </button>
            <button onClick={() => router.push('/flow-board')} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Flow Board">
              <Columns3 className="w-4 h-4" />
              <span className="hidden sm:inline">Flow Board</span>
            </button>
            <button onClick={() => window.location.reload()} className="p-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">{userName}</span>
            <button onClick={handleLogout} className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 sm:p-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          {/* Filters */}
          <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {globalSearch
                  ? 'Patient List - All Dates'
                  : `Patient List for ${new Date(date + 'T00:00:00').toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' })}`}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push('/day-summary')}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  Day Summary
                </button>
                <button
                  onClick={() => setGlobalSearch(!globalSearch)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    globalSearch
                      ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  Global Search
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Admission Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={globalSearch}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-700 dark:text-white disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Patient Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or MRN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Location</label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-700 dark:text-white"
                >
                  <option>Any</option>
                  {locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Anaesthetist</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-700 dark:text-white">
                  <option>Any</option>
                  {sampleUsers.filter(u => u.role === 'ANAESTHETIST').map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-700 dark:text-white"
                >
                  {statuses.map(s => <option key={s} value={s}>{s === 'Any' ? 'Any Status' : getStatusLabel(s)}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Patient List Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700 text-white text-sm">
                  <th className="px-4 py-3 text-left font-medium w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                      title="Select all"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium w-12"></th>
                  <th className="px-4 py-3 text-left font-medium">PATIENT</th>
                  <th className="px-4 py-3 text-left font-medium">STATUS</th>
                  <th className="px-4 py-3 text-left font-medium hidden md:table-cell">OPERATION NOTES</th>
                  <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">LOCATION</th>
                  <th className="px-4 py-3 text-right font-medium">DOCTOR</th>
                </tr>
              </thead>
              <tbody>
                {admissions.map((admission) => {
                  const patient = findPatient(admission.patientId)
                  const surgeon = admission.surgeonId ? findUser(admission.surgeonId) : null
                  if (!patient) return null
                  const effectiveStatus = getEffectiveStatusFn(admission)
                  const isSelected = selectedIds.has(admission.id)

                  return (
                    <tr
                      key={admission.id}
                      className={`cursor-pointer hover:brightness-95 dark:hover:brightness-125 transition-all border-b border-gray-100 dark:border-slate-700 ${getStatusColor(effectiveStatus)} ${isSelected ? 'ring-2 ring-inset ring-cyan-500' : ''}`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(admission.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 rounded border-gray-300 dark:border-slate-500 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-4" onClick={() => router.push(`/patients/${admission.id}`)}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          patient.sex === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {patient.sex === 'Female' ? '\u2640' : '\u2642'}
                        </div>
                      </td>
                      <td className="px-4 py-4" onClick={() => router.push(`/patients/${admission.id}`)}>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {patient.mrn} - {patient.lastName} {patient.firstName} {patient.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                          <span className={patient.sex === 'Female' ? 'text-pink-500' : 'text-blue-500'}>
                            {patient.sex === 'Female' ? '\u2640' : '\u2642'}
                          </span>
                          {patient.dob.toISOString().split('T')[0]}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {editingStatusId === admission.id ? (
                          <select
                            autoFocus
                            defaultValue={effectiveStatus}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleStatusChange(admission.id, e.target.value)}
                            onBlur={() => setEditingStatusId(null)}
                            className="px-2 py-1 border border-gray-300 dark:border-slate-600 rounded-lg text-xs focus:ring-2 focus:ring-cyan-500 dark:bg-slate-700 dark:text-white"
                          >
                            {statuses.filter(s => s !== 'Any').map(s => (
                              <option key={s} value={s}>{getStatusLabel(s)}</option>
                            ))}
                          </select>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingStatusId(admission.id) }}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(effectiveStatus)} hover:opacity-80 transition-opacity`}
                          >
                            {getStatusLabel(effectiveStatus)}
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell" onClick={() => router.push(`/patients/${admission.id}`)}>
                        <div className="text-sm text-gray-700 dark:text-gray-300 max-w-md truncate">
                          {admission.operationNotes}
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell" onClick={() => router.push(`/patients/${admission.id}`)}>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{admission.location}</span>
                      </td>
                      <td className="px-4 py-4 text-right" onClick={() => router.push(`/patients/${admission.id}`)}>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{surgeon?.initials}</span>
                      </td>
                    </tr>
                  )
                })}
                {admissions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                      No patients found {globalSearch ? '' : 'for this date'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Floating Batch Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 no-print">
          <div className="bg-gray-900 dark:bg-slate-700 text-white rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-4 border border-gray-700 dark:border-slate-500">
            <span className="text-sm font-medium text-gray-300 dark:text-gray-200 whitespace-nowrap">
              {selectedIds.size} patient{selectedIds.size !== 1 ? 's' : ''} selected
            </span>
            <div className="w-px h-6 bg-gray-600 dark:bg-slate-500" />
            <button
              onClick={handleBatchDischarge}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              <CheckSquare className="w-4 h-4" />
              Mark as Discharged
            </button>
            <button
              onClick={handleBatchPrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              Print Discharge Summaries
            </button>
            <button
              onClick={handleBatchReport}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              <FileText className="w-4 h-4" />
              Generate Report
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="ml-2 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 dark:hover:bg-slate-600 transition-colors"
              title="Clear selection"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
