'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Moon, Sun, Printer, BarChart3, Users, Clock, AlertTriangle, XCircle } from 'lucide-react'
import { sampleAdmissions, sampleUsers, findUser, findPatient, getStatusLabel } from '@/lib/sample-data'
import { getAdmissionStatus } from '@/lib/store'

function getStatusDotColor(status: string): string {
  switch (status) {
    case 'PRE_ADMITTED': return 'bg-purple-500'
    case 'BOOKED': return 'bg-blue-500'
    case 'ARRIVED': return 'bg-yellow-500'
    case 'CHECKED_IN': return 'bg-orange-500'
    case 'ANAESTHESIA_INDUCTION': return 'bg-pink-500'
    case 'OPERATION_STARTED': return 'bg-red-500'
    case 'RECOVERY_1': return 'bg-green-500'
    case 'WARD': return 'bg-emerald-600'
    case 'RECOVERY_2': return 'bg-teal-500'
    case 'DISCHARGED': return 'bg-gray-500'
    case 'CANCELLED': return 'bg-gray-700'
    default: return 'bg-gray-400'
  }
}

export default function DaySummaryPage() {
  const router = useRouter()
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const name = document.cookie.split('; ').find(c => c.startsWith('userName='))?.split('=')[1]
    if (!name) router.push('/')
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

  const dayAdmissions = useMemo(() => {
    return sampleAdmissions.filter(a => {
      const admDate = a.date.toISOString().split('T')[0]
      return admDate === date
    }).map(a => ({
      ...a,
      effectiveStatus: getAdmissionStatus(a.id) || a.status,
    }))
  }, [date])

  // Cases by status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    dayAdmissions.forEach(a => {
      counts[a.effectiveStatus] = (counts[a.effectiveStatus] || 0) + 1
    })
    return counts
  }, [dayAdmissions])

  // Cases by surgeon
  const surgeonCounts = useMemo(() => {
    const counts: Record<string, { name: string; count: number }> = {}
    dayAdmissions.forEach(a => {
      if (a.surgeonId) {
        const surgeon = findUser(a.surgeonId)
        if (surgeon) {
          if (!counts[a.surgeonId]) counts[a.surgeonId] = { name: surgeon.name, count: 0 }
          counts[a.surgeonId].count++
        }
      }
    })
    return Object.values(counts).sort((a, b) => b.count - a.count)
  }, [dayAdmissions])

  // Cases by anaesthetist
  const anaesthetistCounts = useMemo(() => {
    const counts: Record<string, { name: string; count: number }> = {}
    dayAdmissions.forEach(a => {
      if (a.anaesthetistId) {
        const anaesthetist = findUser(a.anaesthetistId)
        if (anaesthetist) {
          if (!counts[a.anaesthetistId]) counts[a.anaesthetistId] = { name: anaesthetist.name, count: 0 }
          counts[a.anaesthetistId].count++
        }
      }
    })
    return Object.values(counts).sort((a, b) => b.count - a.count)
  }, [dayAdmissions])

  // Average turnaround time (simulated based on procedure start times)
  const avgTurnaround = useMemo(() => {
    const withTimes = dayAdmissions.filter(a => a.procedureStartTime && a.time)
    if (withTimes.length < 2) return null
    const sortedByLocation: Record<string, string[]> = {}
    withTimes.forEach(a => {
      if (!sortedByLocation[a.location]) sortedByLocation[a.location] = []
      sortedByLocation[a.location].push(a.procedureStartTime!)
    })
    let totalMinutes = 0
    let gapCount = 0
    Object.values(sortedByLocation).forEach(times => {
      const sorted = times.sort()
      for (let i = 1; i < sorted.length; i++) {
        const [h1, m1] = sorted[i - 1].split(':').map(Number)
        const [h2, m2] = sorted[i].split(':').map(Number)
        const diff = (h2 * 60 + m2) - (h1 * 60 + m1)
        if (diff > 0) {
          totalMinutes += diff
          gapCount++
        }
      }
    })
    return gapCount > 0 ? Math.round(totalMinutes / gapCount) : null
  }, [dayAdmissions])

  // Complications count (simulated: cases with comorbidities or allergies)
  const complicationsCount = useMemo(() => {
    return dayAdmissions.filter(a => {
      const patient = findPatient(a.patientId)
      return patient && patient.comorbidities
    }).length
  }, [dayAdmissions])

  // Cancellation reasons
  const cancelledCases = useMemo(() => {
    return dayAdmissions.filter(a => a.effectiveStatus === 'CANCELLED').map(a => {
      const patient = findPatient(a.patientId)
      return {
        patient: patient ? `${patient.lastName} ${patient.firstName}` : 'Unknown',
        reason: 'Patient request', // simulated reason
      }
    })
  }, [dayAdmissions])

  // Cases per hour for bar chart
  const casesPerHour = useMemo(() => {
    const hours: Record<number, number> = {}
    // Initialize hours from 6am to 6pm
    for (let h = 6; h <= 18; h++) hours[h] = 0
    dayAdmissions.forEach(a => {
      if (a.procedureStartTime) {
        const hour = parseInt(a.procedureStartTime.split(':')[0])
        hours[hour] = (hours[hour] || 0) + 1
      }
    })
    return hours
  }, [dayAdmissions])

  const maxCasesInHour = Math.max(...Object.values(casesPerHour), 1)
  const totalCases = dayAdmissions.length
  const completedCases = statusCounts['DISCHARGED'] || 0
  const inProgressCases = (statusCounts['ARRIVED'] || 0) + (statusCounts['CHECKED_IN'] || 0) + (statusCounts['ANAESTHESIA_INDUCTION'] || 0) + (statusCounts['OPERATION_STARTED'] || 0) + (statusCounts['RECOVERY_1'] || 0) + (statusCounts['WARD'] || 0) + (statusCounts['RECOVERY_2'] || 0)
  const cancelledCount = statusCounts['CANCELLED'] || 0

  return (
    <div className="min-h-screen bg-[#f0f4f8] dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 no-print">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SR</span>
            </div>
            <span className="text-lg font-semibold text-gray-800 dark:text-white">End-of-Day Summary</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={toggleDarkMode} className="p-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Toggle dark mode">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => window.print()} className="p-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Print">
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Date Selector */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Report Date:</label>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-700 dark:text-white"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(date + 'T00:00:00').toLocaleDateString('en-AU', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
          </span>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Cases</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalCases}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</span>
            </div>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{completedCases}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Turnaround</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {avgTurnaround ? `${avgTurnaround}m` : 'N/A'}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Complications</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{complicationsCount}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Cases by Status */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-4">Cases by Status</h3>
            {Object.keys(statusCounts).length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No cases for this date</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(statusCounts).sort((a, b) => b[1] - a[1]).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusDotColor(status)}`} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{getStatusLabel(status)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getStatusDotColor(status)}`}
                          style={{ width: `${totalCases > 0 ? (count / totalCases) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white w-6 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cases per Hour Bar Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-4">Cases per Hour</h3>
            <div className="flex items-end gap-1 h-40">
              {Object.entries(casesPerHour).map(([hour, count]) => (
                <div key={hour} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{count > 0 ? count : ''}</span>
                  <div
                    className={`w-full rounded-t transition-all ${count > 0 ? 'bg-cyan-500 dark:bg-cyan-400' : 'bg-gray-100 dark:bg-slate-700'}`}
                    style={{ height: `${count > 0 ? (count / maxCasesInHour) * 100 : 4}%`, minHeight: count > 0 ? '8px' : '2px' }}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-500">{`${hour}`.padStart(2, '0')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Cases by Surgeon */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-4">Cases by Surgeon</h3>
            {surgeonCounts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No cases for this date</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-600">
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 pb-2">Surgeon</th>
                    <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 pb-2">Cases</th>
                  </tr>
                </thead>
                <tbody>
                  {surgeonCounts.map(s => (
                    <tr key={s.name} className="border-b border-gray-100 dark:border-slate-700 last:border-0">
                      <td className="py-2.5 text-sm text-gray-700 dark:text-gray-300">{s.name}</td>
                      <td className="py-2.5 text-sm font-semibold text-gray-900 dark:text-white text-right">{s.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Cases by Anaesthetist */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-4">Cases by Anaesthetist</h3>
            {anaesthetistCounts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No anaesthetist-assigned cases for this date</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-600">
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 pb-2">Anaesthetist</th>
                    <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 pb-2">Cases</th>
                  </tr>
                </thead>
                <tbody>
                  {anaesthetistCounts.map(a => (
                    <tr key={a.name} className="border-b border-gray-100 dark:border-slate-700 last:border-0">
                      <td className="py-2.5 text-sm text-gray-700 dark:text-gray-300">{a.name}</td>
                      <td className="py-2.5 text-sm font-semibold text-gray-900 dark:text-white text-right">{a.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Cancellations */}
        {cancelledCases.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5 text-red-500" />
              <h3 className="text-base font-semibold text-gray-800 dark:text-white">Cancellations ({cancelledCases.length})</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-600">
                  <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 pb-2">Patient</th>
                  <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 pb-2">Reason</th>
                </tr>
              </thead>
              <tbody>
                {cancelledCases.map((c, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-slate-700 last:border-0">
                    <td className="py-2.5 text-sm text-gray-700 dark:text-gray-300">{c.patient}</td>
                    <td className="py-2.5 text-sm text-gray-500 dark:text-gray-400">{c.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Quick Stats Footer */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-4">Day at a Glance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Total Cases</span>
              <p className="font-semibold text-gray-900 dark:text-white">{totalCases}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Completed</span>
              <p className="font-semibold text-green-600 dark:text-green-400">{completedCases}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">In Progress</span>
              <p className="font-semibold text-yellow-600 dark:text-yellow-400">{inProgressCases}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Cancelled</span>
              <p className="font-semibold text-red-600 dark:text-red-400">{cancelledCount}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
