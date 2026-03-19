'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { findAdmission, findPatient } from '@/lib/sample-data'

export default function PreAnaestheticPage() {
  const params = useParams()
  const router = useRouter()
  const admissionId = params.admissionId as string
  const admission = findAdmission(admissionId)
  const patient = admission ? findPatient(admission.patientId) : null

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 dark:bg-slate-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">PRE-ANAESTHETIC ASSESSMENT</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* ASA Classification */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">ASA Physical Status Classification</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: '1', label: 'ASA I', desc: 'Normal healthy patient' },
              { value: '2', label: 'ASA II', desc: 'Patient with mild systemic disease' },
              { value: '3', label: 'ASA III', desc: 'Patient with severe systemic disease' },
              { value: '4', label: 'ASA IV', desc: 'Patient with incapacitating disease - constant threat to life' },
              { value: '5', label: 'ASA V', desc: 'Moribund patient - not expected to survive 24hrs' },
              { value: 'E', label: 'Emergency', desc: 'Emergency operation of any variety' },
            ].map(asa => (
              <label key={asa.value} className="flex items-start gap-3 p-3 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer">
                <input type="radio" name="asa" value={asa.value} className="mt-1" />
                <div>
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{asa.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{asa.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Airway Assessment */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Airway Assessment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Mallampati Score</label>
              <select className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
                <option value="">Select...</option>
                <option>Class I - Soft palate, fauces, uvula, pillars visible</option>
                <option>Class II - Soft palate, fauces, uvula visible</option>
                <option>Class III - Soft palate, base of uvula visible</option>
                <option>Class IV - Hard palate only visible</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Thyromental Distance</label>
              <select className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
                <option value="">Select...</option>
                <option>{'>'} 6.5cm (Normal)</option>
                <option>6-6.5cm (Moderate)</option>
                <option>{'<'} 6cm (Short - difficult intubation)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Mouth Opening</label>
              <select className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
                <option value="">Select...</option>
                <option>{'>'} 3 finger breadths (Normal)</option>
                <option>2-3 finger breadths (Reduced)</option>
                <option>{'<'} 2 finger breadths (Limited)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Neck Movement</label>
              <select className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
                <option value="">Select...</option>
                <option>Full range</option>
                <option>Limited extension</option>
                <option>Fixed flexion</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Dentition</label>
              <select className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
                <option value="">Select...</option>
                <option>Normal</option>
                <option>Dentures - upper</option>
                <option>Dentures - lower</option>
                <option>Dentures - both</option>
                <option>Missing teeth</option>
                <option>Loose teeth</option>
                <option>Caps/crowns</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Previous Difficult Airway</label>
              <select className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
                <option>No</option>
                <option>Yes</option>
                <option>Unknown</option>
              </select>
            </div>
          </div>
        </div>

        {/* Fasting Status */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Fasting Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Last Solid Food</label>
              <input type="datetime-local" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Last Clear Fluid</label>
              <input type="datetime-local" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" />
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Medical History / Systems Review</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Cardiovascular', 'Respiratory', 'Neurological', 'Renal', 'Hepatic', 'Endocrine', 'Musculoskeletal', 'Haematological'].map(system => (
              <div key={system} className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">{system}</label>
                <textarea className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-800 rounded-lg text-sm" rows={2} placeholder={`${system} history...`} />
              </div>
            ))}
          </div>
        </div>

        {/* Current Medications */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Current Medications</h3>
          <textarea className="w-full px-4 py-3 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" rows={3} placeholder="List current medications..." defaultValue={patient?.comorbidities ? `Blood thinner medications noted` : ''} />
        </div>

        {/* Anaesthetic Plan */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Anaesthetic Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Type of Anaesthesia</label>
              <select className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
                <option value="">Select...</option>
                <option>General Anaesthesia</option>
                <option>Regional - Spinal</option>
                <option>Regional - Epidural</option>
                <option>Regional - Nerve Block</option>
                <option>Local Anaesthesia</option>
                <option>Local + Sedation</option>
                <option>Topical</option>
                <option>MAC (Monitored Anaesthesia Care)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Airway Plan</label>
              <select className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
                <option value="">Select...</option>
                <option>LMA</option>
                <option>ETT</option>
                <option>Face Mask</option>
                <option>Nasal Prongs</option>
                <option>N/A (Local/Regional)</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Special Considerations / Notes</label>
            <textarea className="w-full px-4 py-3 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" rows={3} placeholder="Special considerations for anaesthesia..." />
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 font-medium flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Assessment
          </button>
        </div>
      </div>
    </div>
  )
}
