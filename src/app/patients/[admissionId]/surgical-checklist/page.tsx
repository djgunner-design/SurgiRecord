'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, Check } from 'lucide-react'

export default function SurgicalChecklistPage() {
  const params = useParams()
  const router = useRouter()
  const [activePhase, setActivePhase] = useState<'signin' | 'timeout' | 'signout'>('signin')

  const phases = [
    { key: 'signin' as const, label: 'Sign In', color: 'bg-blue-600' },
    { key: 'timeout' as const, label: 'Time Out', color: 'bg-yellow-600' },
    { key: 'signout' as const, label: 'Sign Out', color: 'bg-green-600' },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 dark:bg-slate-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">WHO SURGICAL SAFETY CHECKLIST</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* Phase Tabs */}
        <div className="flex gap-2 mb-6">
          {phases.map(phase => (
            <button
              key={phase.key}
              onClick={() => setActivePhase(phase.key)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                activePhase === phase.key
                  ? `${phase.color} text-white`
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {phase.label}
            </button>
          ))}
        </div>

        {/* Sign In Phase */}
        {activePhase === 'signin' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-700 border-b pb-2">Before induction of anaesthesia</h3>
            <ChecklistItem label="Has the patient confirmed their identity, site, procedure, and consent?" />
            <ChecklistItem label="Is the site marked?" />
            <ChecklistItem label="Is the anaesthesia machine and medication check complete?" />
            <ChecklistItem label="Is the pulse oximeter on the patient and functioning?" />
            <ChecklistItem label="Does the patient have a known allergy?" />
            <ChecklistItem label="Difficult airway or aspiration risk?" />
            <ChecklistItem label="Risk of >500ml blood loss (7ml/kg in children)?" />
          </div>
        )}

        {/* Time Out Phase */}
        {activePhase === 'timeout' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-700 border-b pb-2">Before skin incision</h3>
            <ChecklistItem label="Confirm all team members have introduced themselves by name and role" />
            <ChecklistItem label="Confirm the patient's name, procedure, and where the incision will be made" />
            <ChecklistItem label="Has antibiotic prophylaxis been given within the last 60 minutes?" />
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Anticipated Critical Events</h4>
              <ChecklistItem label="Surgeon: What are the critical or non-routine steps?" />
              <ChecklistItem label="Surgeon: How long will the case take?" />
              <ChecklistItem label="Surgeon: What is the anticipated blood loss?" />
              <ChecklistItem label="Anaesthetist: Are there any patient-specific concerns?" />
              <ChecklistItem label="Nursing: Has sterility been confirmed?" />
              <ChecklistItem label="Nursing: Are there equipment issues or any concerns?" />
            </div>
            <ChecklistItem label="Is essential imaging displayed?" />
          </div>
        )}

        {/* Sign Out Phase */}
        {activePhase === 'signout' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-700 border-b pb-2">Before patient leaves operating room</h3>
            <ChecklistItem label="Nurse verbally confirms the name of the procedure" />
            <ChecklistItem label="Completion of instrument, sponge and needle counts" />
            <ChecklistItem label="Specimen labelling (read specimen labels aloud)" />
            <ChecklistItem label="Whether there are any equipment problems to be addressed" />
            <ChecklistItem label="Surgeon, anaesthetist and nurse review key concerns for recovery and management of this patient" />
          </div>
        )}

        <div className="flex justify-end mt-8">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 font-medium flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Checklist
          </button>
        </div>
      </div>
    </div>
  )
}

function ChecklistItem({ label }: { label: string }) {
  const [checked, setChecked] = useState(false)
  return (
    <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
      <div
        onClick={() => setChecked(!checked)}
        className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
          checked ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-slate-600'
        }`}
      >
        {checked && <Check className="w-4 h-4 text-white" />}
      </div>
      <span className={`text-sm ${checked ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300'}`}>{label}</span>
    </label>
  )
}
