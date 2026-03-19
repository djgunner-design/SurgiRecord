'use client'

import { useParams } from 'next/navigation'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { findAdmission, findPatient, findUser, getHandoversForAdmission } from '@/lib/sample-data'

export default function HandoverPage() {
  const params = useParams()
  const admissionId = params.admissionId as string
  const admission = findAdmission(admissionId)
  const patient = admission ? findPatient(admission.patientId) : null
  const handovers = getHandoversForAdmission(admissionId)

  if (!admission || !patient) return <div>Not found</div>

  const surgeon = admission.surgeonId ? findUser(admission.surgeonId) : null

  function calculateBMI(w: number | null, h: number | null) {
    if (!w || !h) return null
    return (w / ((h/100) * (h/100))).toFixed(2)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 dark:bg-slate-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">HANDOVER</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        {/* Patient Summary */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Patient Summary</h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500 dark:text-gray-400">MRN:</span> <span className="font-medium">{patient.mrn}</span></div>
              <div><span className="text-gray-500 dark:text-gray-400">Name:</span> <span className="font-medium">{patient.lastName} {patient.firstName} {patient.title}</span></div>
              <div><span className="text-gray-500 dark:text-gray-400">DOB:</span> {new Date(patient.dob).toLocaleDateString('en-AU')}</div>
              <div><span className="text-gray-500 dark:text-gray-400">Sex:</span> {patient.sex}</div>
              <div><span className="text-gray-500 dark:text-gray-400">BMI:</span> {calculateBMI(patient.weight, patient.height)}</div>
              <div><span className="text-gray-500 dark:text-gray-400">Operation:</span> {admission.operationNotes}</div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Clinical Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400">Allergies:</span>
                <span className={patient.allergies?.includes('NIL') || !patient.allergies ? 'text-green-600' : 'text-red-600 font-medium'}>
                  {patient.allergies || 'No Allergies (NIL)'}
                </span>
              </div>
              {patient.comorbidities && (
                <div><span className="text-gray-500 dark:text-gray-400">Comorbidities:</span> <span className="text-orange-600">{patient.comorbidities}</span></div>
              )}
            </div>
          </div>
        </div>

        {/* Handover List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Handover List</h3>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> New
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700 dark:bg-slate-700 text-white text-sm">
                <th className="px-4 py-3 text-left font-medium">HANDOVER</th>
                <th className="px-4 py-3 text-left font-medium">FROM</th>
                <th className="px-4 py-3 text-left font-medium">TO</th>
                <th className="px-4 py-3 text-left font-medium">TIME</th>
                <th className="px-4 py-3 text-right font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {handovers.map(h => {
                const fromUser = findUser(h.fromUserId)
                const toUser = h.toUserId ? findUser(h.toUserId) : null
                return (
                  <tr key={h.id} className="border-b border-gray-100 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 capitalize">{h.stage.toLowerCase().replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{fromUser?.initials} ({fromUser?.name})</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{toUser ? `${toUser.initials} (${toUser.name})` : '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{h.time || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-cyan-600 rounded"><Edit className="w-4 h-4" /></button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
