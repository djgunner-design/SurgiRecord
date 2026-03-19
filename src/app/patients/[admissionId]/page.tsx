'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { findAdmission, findPatient, getNotesForAdmission, getHandoversForAdmission, findUser } from '@/lib/sample-data'
import { getUserFavourites } from '@/lib/store'
import { FileText, Clock, Star } from 'lucide-react'

export default function PatientOverviewPage() {
  const params = useParams()
  const admissionId = params.admissionId as string
  const admission = findAdmission(admissionId)
  const [userFavourites, setUserFavourites] = useState<Array<{ id: string; name: string; operationNotes: string; defaultLocation: string }>>([])

  useEffect(() => {
    const uid = document.cookie.split('; ').find(c => c.startsWith('userId='))?.split('=')[1] || '1'
    setUserFavourites(getUserFavourites(uid))
  }, [])

  if (!admission) return <div>Not found</div>

  const patient = findPatient(admission.patientId)
  if (!patient) return <div>Not found</div>

  const notes = getNotesForAdmission(admissionId)
  const handovers = getHandoversForAdmission(admissionId)

  const reports = [
    { name: 'Nursing Admission', date: admission.date.toISOString().split('T')[0] },
    { name: 'Surgical Checklist', date: admission.date.toISOString().split('T')[0] },
    { name: 'Countsheet', date: admission.date.toISOString().split('T')[0] },
    { name: 'Intraoperative Record', date: admission.date.toISOString().split('T')[0] },
    { name: 'Operation Report', date: admission.date.toISOString().split('T')[0] },
  ]

  return (
    <div className="space-y-6">
      {/* Quick Operations */}
      {userFavourites.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-600 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Quick Operations
            </h3>
            <Link href={`/patients/${admissionId}/favourites`} className="text-xs text-cyan-600 hover:text-cyan-700">Manage Favourites</Link>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {userFavourites.slice(0, 6).map(fav => (
              <div key={fav.id} className="p-3 border border-gray-200 dark:border-slate-600 rounded-lg hover:border-yellow-400 dark:hover:border-yellow-600 cursor-pointer transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{fav.name}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-400 truncate">{fav.operationNotes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reports */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-600">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Reports of Patient: {patient.lastName} {patient.firstName} {patient.title}</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700 dark:bg-slate-700 text-white text-sm">
              <th className="px-6 py-3 text-left font-medium">REPORT</th>
              <th className="px-6 py-3 text-left font-medium">DATE</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, i) => (
              <tr key={i} className="border-b border-gray-50 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">{report.name}</td>
                <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-400">{report.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Notes */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-600">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-600" />
            Recent Notes
          </h3>
        </div>
        <div className="p-6 space-y-4">
          {notes.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No notes yet</p>
          ) : (
            notes.map(note => {
              const user = findUser(note.userId)
              return (
                <div key={note.id} className="border-l-4 border-cyan-500 pl-4 py-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <Clock className="w-3 h-3" />
                    {new Date(note.dateTime).toLocaleString('en-AU')}
                    <span className="font-medium text-gray-700 dark:text-gray-300">— {user?.initials}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{note.content}</p>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Handover Summary */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-600">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Handover Summary</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700 dark:bg-slate-700 text-white text-sm">
              <th className="px-6 py-3 text-left font-medium">HANDOVER</th>
              <th className="px-6 py-3 text-left font-medium">FROM</th>
              <th className="px-6 py-3 text-left font-medium">TO</th>
              <th className="px-6 py-3 text-left font-medium">TIME</th>
            </tr>
          </thead>
          <tbody>
            {handovers.map(h => {
              const fromUser = findUser(h.fromUserId)
              const toUser = h.toUserId ? findUser(h.toUserId) : null
              return (
                <tr key={h.id} className="border-b border-gray-50 dark:border-slate-700">
                  <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300 capitalize">{h.stage.toLowerCase().replace('_', ' ')}</td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{fromUser?.initials} ({fromUser?.name})</td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{toUser ? `${toUser.initials} (${toUser.name})` : '—'}</td>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{h.time || '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
