'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { findAdmission } from '@/lib/sample-data'

export default function NursingAdmissionPage() {
  const params = useParams()
  const router = useRouter()
  const admissionId = params.admissionId as string
  const admission = findAdmission(admissionId)

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 dark:bg-slate-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">NURSING ADMISSION</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Finalised</span>
            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600">Amend</button>
          </div>
        </div>

        {/* Admission Details */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Admission date</label>
            <input type="date" defaultValue={admission?.date.toISOString().split('T')[0]} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Admission time</label>
            <input type="time" defaultValue={admission?.time || ''} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" />
          </div>
        </div>

        {/* Admission OBS */}
        <div className="mb-8">
          <div className="bg-green-600 text-white px-4 py-2 rounded-t-lg">
            <h3 className="text-sm font-medium">ADMISSION OBS</h3>
          </div>
          <div className="border border-gray-200 dark:border-slate-700 rounded-b-lg p-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Obs time</label>
                <input type="time" defaultValue="06:45" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Temp</label>
                <input type="number" step="0.1" defaultValue="36.6" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">BP Systolic</label>
                <input type="number" defaultValue="117" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">BP Diastolic</label>
                <input type="number" defaultValue="64" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">HR</label>
                <input type="number" defaultValue="86" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">RR</label>
                <input type="number" defaultValue="14" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">SpO2</label>
                <input type="number" defaultValue="100" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Pain Score</label>
                <input type="number" min="0" max="10" defaultValue="0" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Checklist Questions */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Admission Checklist</h3>

          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">How can we support your care goals during your admission?<span className="text-red-500">*</span></label>
            <textarea className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" rows={2} defaultValue="Good care" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Has the consent form been completed?<span className="text-red-500">*</span></label>
              <select defaultValue="Yes" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
                <option>Yes</option>
                <option>No</option>
                <option>N/A</option>
              </select>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Does the patient&apos;s stated procedure match the consent form?</label>
              <select defaultValue="Yes" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
                <option>Yes</option>
                <option>No</option>
                <option>N/A</option>
              </select>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Does this patient have an advanced health directive?</label>
              <select defaultValue="No" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
                <option>Yes</option>
                <option>No</option>
                <option>N/A</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Has the patient had pre-op photos taken?</label>
              <select defaultValue="N/A" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
                <option>Yes</option>
                <option>No</option>
                <option>N/A</option>
              </select>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Allergies and adverse reactions?<span className="text-red-500">*</span></label>
              <select defaultValue="No" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Relevant co-morbidities, alerts or post surgery concerns discussed with the team?</label>
              <select defaultValue="No" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
                <option>Yes</option>
                <option>No</option>
                <option>N/A</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 font-medium flex items-center gap-2">
            <Save className="w-4 h-4" /> Save & Finalise
          </button>
        </div>
      </div>
    </div>
  )
}
