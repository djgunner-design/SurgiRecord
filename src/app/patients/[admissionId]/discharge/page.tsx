'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, Check } from 'lucide-react'
import { useState, useCallback } from 'react'
import { findAdmission, findPatient, findUser } from '@/lib/sample-data'
import PdfExportButton from '@/components/pdf-export-button'
import TemplatePicker from '@/components/template-picker'
import { useLock } from '@/components/lock-provider'
import LockIndicator from '@/components/lock-indicator'

export default function DischargePage() {
  const params = useParams()
  const router = useRouter()
  const admissionId = params.admissionId as string
  const admission = findAdmission(admissionId)
  const patient = admission ? findPatient(admission.patientId) : null
  const surgeon = admission?.surgeonId ? findUser(admission.surgeonId) : null
  const anaesthetist = admission?.anaesthetistId ? findUser(admission.anaesthetistId) : null
  const { isEditable, lockHolder, requestLock, releaseLock, hasLock, lockStatus } = useLock('discharge')

  const [fields, setFields] = useState<Record<string, string>>({
    dischargeType: 'Routine Discharge',
    dischargeNotes: '',
    postOpInstructions: '',
    followUp: '',
    callNotes: '',
  })

  const handleApplyTemplate = useCallback((templateFields: Record<string, string>) => {
    setFields(prev => ({ ...prev, ...templateFields }))
  }, [])

  const getCurrentFields = useCallback(() => fields, [fields])

  const fieldLabels: Record<string, string> = {
    dischargeType: 'Discharge Type',
    dischargeNotes: 'Discharge Notes',
    postOpInstructions: 'Post-Op Instructions',
    followUp: 'Follow Up',
    callNotes: 'Call Notes',
  }

  const updateField = (key: string, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 dark:bg-slate-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">DISCHARGE</h2>
      </div>

      <LockIndicator section="discharge" />

      <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 ${!isEditable ? 'pointer-events-none opacity-60' : ''}`}>
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            <TemplatePicker
              category="discharge"
              onApply={handleApplyTemplate}
              getCurrentFields={getCurrentFields}
              fieldLabels={fieldLabels}
            />
            {patient && admission && (
              <PdfExportButton
                type="discharge-summary"
                patient={{ ...patient, dob: patient.dob }}
                admission={{
                  ...admission,
                  date: admission.date,
                  surgeonName: surgeon?.name ?? null,
                  anaesthetistName: anaesthetist?.name ?? null,
                }}
              />
            )}
          </div>
        </div>

        {/* Discharge Checklist */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Discharge Checklist</h3>
          <div className="space-y-3">
            <CheckItem label="Patient is alert and oriented" />
            <CheckItem label="Vital signs stable for at least 30 minutes" />
            <CheckItem label="No excessive bleeding or drainage" />
            <CheckItem label="Pain is controlled with oral medication" />
            <CheckItem label="Patient can tolerate oral fluids" />
            <CheckItem label="Patient can void (if applicable)" />
            <CheckItem label="Patient can ambulate (if applicable)" />
            <CheckItem label="Discharge instructions reviewed with patient" />
            <CheckItem label="Follow-up appointment confirmed" />
            <CheckItem label="Prescriptions provided" />
            <CheckItem label="Responsible adult present for escort" />
          </div>
        </div>

        {/* Discharge Summary */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Discharge Summary</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Discharge Time</label>
              <input type="time" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm max-w-xs" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Discharge Type</label>
              <select value={fields.dischargeType} onChange={e => updateField('dischargeType', e.target.value)} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm max-w-xs">
                <option>Routine Discharge</option>
                <option>Discharge Without Escort</option>
                <option>Transfer to Ward</option>
                <option>Transfer to Hospital</option>
                <option>Against Medical Advice</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Discharge Notes</label>
              <textarea value={fields.dischargeNotes} onChange={e => updateField('dischargeNotes', e.target.value)} className="w-full px-4 py-3 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" rows={4} placeholder="Additional discharge notes..." />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Post-Op Instructions Given</label>
              <textarea value={fields.postOpInstructions} onChange={e => updateField('postOpInstructions', e.target.value)} className="w-full px-4 py-3 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" rows={3} placeholder="Instructions provided to patient..." />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Follow Up</label>
              <textarea value={fields.followUp} onChange={e => updateField('followUp', e.target.value)} className="w-full px-4 py-3 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" rows={2} placeholder="Follow-up arrangements..." />
            </div>
          </div>
        </div>

        {/* Post-Op Call Details */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Post Op Call Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Call Date</label>
              <input type="date" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Call Time</label>
              <input type="time" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Call Notes</label>
              <textarea value={fields.callNotes} onChange={e => updateField('callNotes', e.target.value)} className="w-full px-4 py-3 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" rows={3} placeholder="Details of post-op phone call..." />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 font-medium flex items-center gap-2">
            <Save className="w-4 h-4" /> Complete Discharge
          </button>
        </div>
      </div>
    </div>
  )
}

function CheckItem({ label }: { label: string }) {
  const [checked, setChecked] = useState(false)
  return (
    <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer">
      <div
        onClick={() => setChecked(!checked)}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
          checked ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-slate-600'
        }`}
      >
        {checked && <Check className="w-3 h-3 text-white" />}
      </div>
      <span className={`text-sm ${checked ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>{label}</span>
    </label>
  )
}
