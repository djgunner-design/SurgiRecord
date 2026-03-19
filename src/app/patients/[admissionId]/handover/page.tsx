'use client'

import { useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Plus, Edit, Trash2, Save } from 'lucide-react'
import { findAdmission, findPatient, findUser, getHandoversForAdmission } from '@/lib/sample-data'
import TemplatePicker from '@/components/template-picker'
import { useLock } from '@/components/lock-provider'
import LockIndicator from '@/components/lock-indicator'

export default function HandoverPage() {
  const params = useParams()
  const admissionId = params.admissionId as string
  const admission = findAdmission(admissionId)
  const patient = admission ? findPatient(admission.patientId) : null
  const handovers = getHandoversForAdmission(admissionId)

  const [fields, setFields] = useState<Record<string, string>>({
    handoverNotes: '',
    concerns: '',
    postOpPlan: '',
  })

  const handleApplyTemplate = useCallback((templateFields: Record<string, string>) => {
    setFields(prev => ({ ...prev, ...templateFields }))
  }, [])

  const getCurrentFields = useCallback(() => fields, [fields])

  const fieldLabels: Record<string, string> = {
    handoverNotes: 'Handover Notes',
    concerns: 'Concerns',
    postOpPlan: 'Post-Op Plan',
  }

  const updateField = (key: string, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }))
  }

  const { isEditable, lockHolder, requestLock, releaseLock, hasLock, lockStatus } = useLock('handover')

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

      <LockIndicator section="handover" />

      <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 ${!isEditable ? 'pointer-events-none opacity-60' : ''}`}>
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
        <div className="mb-6">
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
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{toUser ? `${toUser.initials} (${toUser.name})` : '\u2014'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{h.time || '\u2014'}</td>
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

        {/* Handover Notes with Templates */}
        <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Handover Summary</h3>
            <TemplatePicker
              category="handover"
              onApply={handleApplyTemplate}
              getCurrentFields={getCurrentFields}
              fieldLabels={fieldLabels}
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Handover Notes</label>
              <textarea
                value={fields.handoverNotes}
                onChange={e => updateField('handoverNotes', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm"
                rows={3}
                placeholder="Summary of patient status, procedure performed, and key events..."
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Concerns / Alerts</label>
              <textarea
                value={fields.concerns}
                onChange={e => updateField('concerns', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm"
                rows={2}
                placeholder="Any specific concerns or alerts for the receiving nurse..."
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Post-Op Plan</label>
              <textarea
                value={fields.postOpPlan}
                onChange={e => updateField('postOpPlan', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm"
                rows={2}
                placeholder="Post-operative care plan and instructions..."
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 font-medium flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Handover
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
