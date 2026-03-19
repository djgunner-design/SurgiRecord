'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { findAdmission } from '@/lib/sample-data'

export default function OperationReportPage() {
  const params = useParams()
  const router = useRouter()
  const admissionId = params.admissionId as string
  const admission = findAdmission(admissionId)

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">OPERATION REPORT</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Procedure Performed</label>
            <textarea
              defaultValue={admission?.operationNotes || ''}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Findings</label>
            <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm" rows={4} placeholder="Describe operative findings..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Complications</label>
            <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm" rows={3} placeholder="Any complications encountered..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prostheses / Implants</label>
            <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm" rows={3} placeholder="Details of any implants used..." />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Blood Loss (mL)</label>
              <input type="number" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm" placeholder="mL" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
              <input type="number" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm" placeholder="minutes" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Post-operative Instructions</label>
            <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm" rows={4} placeholder="Post-op care instructions..." />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 font-medium flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Report
          </button>
        </div>
      </div>
    </div>
  )
}
