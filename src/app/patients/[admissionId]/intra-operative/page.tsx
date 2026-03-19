'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { findAdmission } from '@/lib/sample-data'

export default function IntraOperativePage() {
  const params = useParams()
  const router = useRouter()
  const admissionId = params.admissionId as string
  const admission = findAdmission(admissionId)

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 dark:bg-slate-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">INTRA-OPERATIVE RECORD</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Procedure Start Time</label>
            <input type="time" defaultValue={admission?.procedureStartTime || ''} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Procedure End Time</label>
            <input type="time" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Anaesthesia Type</label>
            <select className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
              <option>General</option><option>Local</option><option>Local + Sedation</option><option>Regional</option><option>Topical</option><option>MAC</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Patient Position</label>
            <select className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
              <option>Supine</option><option>Prone</option><option>Lateral (Left)</option><option>Lateral (Right)</option><option>Lithotomy</option><option>Sitting</option><option>Trendelenburg</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Skin Prep</label>
            <select className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
              <option>Betadine</option><option>Chlorhexidine</option><option>Alcohol</option><option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Diathermy</label>
            <select className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
              <option>None</option><option>Monopolar</option><option>Bipolar</option><option>Both</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Tourniquet</label>
            <select className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
              <option>Not Used</option><option>Used - Left</option><option>Used - Right</option><option>Used - Bilateral</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Drain</label>
            <select className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
              <option>None</option><option>Redivac</option><option>Penrose</option><option>Blake</option><option>Jackson-Pratt</option><option>Other</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Intra-operative Notes</label>
          <textarea className="w-full px-4 py-3 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" rows={4} placeholder="Document intra-operative events, findings, complications..." />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specimens</label>
          <textarea className="w-full px-4 py-3 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" rows={2} placeholder="Specimens sent to pathology..." />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estimated Blood Loss (mL)</label>
          <input type="number" className="w-full max-w-xs px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" placeholder="mL" />
        </div>

        <div className="flex justify-end mt-8">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 font-medium flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Record
          </button>
        </div>
      </div>
    </div>
  )
}
