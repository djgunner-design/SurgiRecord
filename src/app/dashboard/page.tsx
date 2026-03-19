'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Home, Settings, RefreshCw, Search, Calendar, LogOut, Menu } from 'lucide-react'
import { sampleAdmissions, samplePatients, sampleUsers, findUser, findPatient } from '@/lib/sample-data'

function getStatusColor(status: string): string {
  switch (status) {
    case 'DISCHARGED': return 'bg-green-50 border-l-4 border-l-green-500'
    case 'BOOKED': return 'bg-blue-50 border-l-4 border-l-blue-500'
    case 'CANCELLED': return 'bg-red-50 border-l-4 border-l-red-500'
    case 'IN_THEATRE': return 'bg-yellow-50 border-l-4 border-l-yellow-500'
    case 'RECOVERY_1': return 'bg-emerald-50 border-l-4 border-l-emerald-400'
    case 'RECOVERY_2': return 'bg-teal-50 border-l-4 border-l-teal-500'
    case 'ADMITTED': return 'bg-sky-50 border-l-4 border-l-sky-500'
    default: return 'bg-gray-50 border-l-4 border-l-gray-300'
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
    case 'DISCHARGED': return 'bg-green-100 text-green-800'
    case 'BOOKED': return 'bg-blue-100 text-blue-800'
    case 'CANCELLED': return 'bg-red-100 text-red-800'
    case 'IN_THEATRE': return 'bg-yellow-100 text-yellow-800'
    case 'RECOVERY_1': return 'bg-emerald-100 text-emerald-800'
    case 'RECOVERY_2': return 'bg-teal-100 text-teal-800'
    case 'ADMITTED': return 'bg-sky-100 text-sky-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Any')
  const [locationFilter, setLocationFilter] = useState('Any')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const name = document.cookie.split('; ').find(c => c.startsWith('userName='))?.split('=')[1]
    if (name) setUserName(decodeURIComponent(name))
    else router.push('/')
  }, [router])

  const admissions = sampleAdmissions.filter(a => {
    const admDate = a.date.toISOString().split('T')[0]
    if (admDate !== date) return false
    if (statusFilter !== 'Any' && a.status !== statusFilter) return false
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

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SR</span>
            </div>
            <span className="text-lg font-semibold text-gray-800">SurgiRecord</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors">
              <Home className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button onClick={() => window.location.reload()} className="p-2 text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{userName}</span>
            <button onClick={handleLogout} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Filters */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Patient List for {new Date(date + 'T00:00:00').toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Admission Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Patient Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or MRN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option>Any</option>
                  {locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Anaesthetist</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
                  <option>Any</option>
                  {sampleUsers.filter(u => u.role === 'ANAESTHETIST').map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
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
                  <th className="px-4 py-3 text-left font-medium w-12"></th>
                  <th className="px-4 py-3 text-left font-medium">PATIENT</th>
                  <th className="px-4 py-3 text-left font-medium">STATUS</th>
                  <th className="px-4 py-3 text-left font-medium">OPERATION NOTES</th>
                  <th className="px-4 py-3 text-left font-medium">LOCATION</th>
                  <th className="px-4 py-3 text-right font-medium">DOCTOR</th>
                </tr>
              </thead>
              <tbody>
                {admissions.map((admission) => {
                  const patient = findPatient(admission.patientId)
                  const surgeon = admission.surgeonId ? findUser(admission.surgeonId) : null
                  if (!patient) return null

                  return (
                    <tr
                      key={admission.id}
                      onClick={() => router.push(`/patients/${admission.id}`)}
                      className={`cursor-pointer hover:brightness-95 transition-all border-b border-gray-100 ${getStatusColor(admission.status)}`}
                    >
                      <td className="px-4 py-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          patient.sex === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {patient.sex === 'Female' ? '♀' : '♂'}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-gray-900">
                          {patient.mrn} - {patient.lastName} {patient.firstName} {patient.title}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                          <span className={patient.sex === 'Female' ? 'text-pink-500' : 'text-blue-500'}>
                            {patient.sex === 'Female' ? '♀' : '♂'}
                          </span>
                          {patient.dob.toISOString().split('T')[0]}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(admission.status)}`}>
                          {getStatusLabel(admission.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-700 max-w-md truncate">
                          {admission.operationNotes}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">{admission.location}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-sm font-medium text-gray-700">{surgeon?.initials}</span>
                      </td>
                    </tr>
                  )
                })}
                {admissions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                      No patients found for this date
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
