'use client'

import { useParams } from 'next/navigation'
import { findAdmission, findPatient, getNotesForAdmission, getHandoversForAdmission, findUser } from '@/lib/sample-data'
import { FileText, Clock } from 'lucide-react'

export default function PatientOverviewPage() {
  const params = useParams()
  const admissionId = params.admissionId as string
  const admission = findAdmission(admissionId)
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
      {/* Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Reports of Patient: {patient.lastName} {patient.firstName} {patient.title}</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700 text-white text-sm">
              <th className="px-6 py-3 text-left font-medium">REPORT</th>
              <th className="px-6 py-3 text-left font-medium">DATE</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors">
                <td className="px-6 py-3 text-sm text-gray-700">{report.name}</td>
                <td className="px-6 py-3 text-sm text-gray-500">{report.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Notes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-600" />
            Recent Notes
          </h3>
        </div>
        <div className="p-6 space-y-4">
          {notes.length === 0 ? (
            <p className="text-gray-500 text-sm">No notes yet</p>
          ) : (
            notes.map(note => {
              const user = findUser(note.userId)
              return (
                <div key={note.id} className="border-l-4 border-cyan-500 pl-4 py-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <Clock className="w-3 h-3" />
                    {new Date(note.dateTime).toLocaleString('en-AU')}
                    <span className="font-medium text-gray-700">— {user?.initials}</span>
                  </div>
                  <p className="text-sm text-gray-700">{note.content}</p>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Handover Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Handover Summary</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700 text-white text-sm">
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
                <tr key={h.id} className="border-b border-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-700 capitalize">{h.stage.toLowerCase().replace('_', ' ')}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{fromUser?.initials} ({fromUser?.name})</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{toUser ? `${toUser.initials} (${toUser.name})` : '—'}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{h.time || '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
