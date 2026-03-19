'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { findAdmission, findPatient, getNotesForAdmission, getHandoversForAdmission, findUser } from '@/lib/sample-data'
import { getUserFavourites, getConsultationNote, saveConsultationNote } from '@/lib/store'
import { FileText, Clock, Star, MessageSquare, Mic, MicOff } from 'lucide-react'
import ReportViewer from '@/components/report-viewer'

export default function PatientOverviewPage() {
  const params = useParams()
  const admissionId = params.admissionId as string
  const admission = findAdmission(admissionId)
  const [userFavourites, setUserFavourites] = useState<Array<{ id: string; name: string; operationNotes: string; defaultLocation: string }>>([])
  const [consultationNote, setConsultationNote] = useState('')
  const [consultationSaved, setConsultationSaved] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [selectedReport, setSelectedReport] = useState<{ name: string; date: string } | null>(null)

  useEffect(() => {
    const uid = document.cookie.split('; ').find(c => c.startsWith('userId='))?.split('=')[1] || '1'
    setUserFavourites(getUserFavourites(uid))
    const existingNote = getConsultationNote(admissionId)
    if (existingNote) setConsultationNote(existingNote.content)
  }, [admissionId])

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

      {/* Patient Consultation Note */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-600">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-600" />
            Patient Consultation Note
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Saved note display */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Saved Note</label>
            <div className="min-h-[120px] p-4 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {consultationNote || <span className="text-gray-400 dark:text-gray-500 italic">No consultation note recorded yet.</span>}
            </div>
          </div>
          {/* Right: Input area */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Edit / Add Note</label>
            <textarea
              value={consultationNote}
              onChange={(e) => { setConsultationNote(e.target.value); setConsultationSaved(false) }}
              placeholder="Enter consultation notes here..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-700 dark:text-white resize-y"
            />
            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  if (!isRecording) {
                    setIsRecording(true)
                    // Simulate dictation - in production would use Web Speech API
                    setTimeout(() => {
                      setConsultationNote(prev => prev + (prev ? '\n' : '') + 'Patient presents well post-operatively. Wound sites healing as expected. No signs of infection or complications noted.')
                      setIsRecording(false)
                    }, 3000)
                  } else {
                    setIsRecording(false)
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isRecording
                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 animate-pulse'
                    : 'bg-gray-100 text-gray-700 dark:bg-slate-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-500'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                {isRecording ? 'Recording...' : 'Dictate'}
              </button>
              <button
                onClick={() => {
                  saveConsultationNote(admissionId, consultationNote)
                  setConsultationSaved(true)
                  setTimeout(() => setConsultationSaved(false), 2000)
                }}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Save Note
              </button>
              {consultationSaved && (
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">Saved!</span>
              )}
            </div>
          </div>
        </div>
      </div>

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
              <tr
                key={i}
                onClick={() => setSelectedReport(report)}
                className="border-b border-gray-50 dark:border-slate-700 hover:bg-cyan-50 dark:hover:bg-slate-600 cursor-pointer transition-colors"
              >
                <td className="px-6 py-3 text-sm text-cyan-700 dark:text-cyan-400 hover:underline flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  {report.name}
                </td>
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
      {/* Report Viewer Modal */}
      {selectedReport && (
        <ReportViewer
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          reportName={selectedReport.name}
          reportDate={selectedReport.date}
          patientName={`${patient.lastName} ${patient.firstName} ${patient.title || ''}`}
          admissionId={admissionId}
        />
      )}
    </div>
  )
}
