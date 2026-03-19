'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, Check } from 'lucide-react'
import { useState } from 'react'

export default function DischargePage() {
  const params = useParams()
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">DISCHARGE</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* Discharge Checklist */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Discharge Checklist</h3>
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
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Discharge Summary</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Discharge Time</label>
              <input type="time" className="w-full px-3 py-2 border rounded-lg text-sm max-w-xs" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Discharge Type</label>
              <select className="w-full px-3 py-2 border rounded-lg text-sm max-w-xs">
                <option>Routine Discharge</option>
                <option>Discharge Without Escort</option>
                <option>Transfer to Ward</option>
                <option>Transfer to Hospital</option>
                <option>Against Medical Advice</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Discharge Notes</label>
              <textarea className="w-full px-4 py-3 border rounded-lg text-sm" rows={4} placeholder="Additional discharge notes..." />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Post-Op Instructions Given</label>
              <textarea className="w-full px-4 py-3 border rounded-lg text-sm" rows={3} placeholder="Instructions provided to patient..." />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Follow Up</label>
              <textarea className="w-full px-4 py-3 border rounded-lg text-sm" rows={2} placeholder="Follow-up arrangements..." />
            </div>
          </div>
        </div>

        {/* Post-Op Call Details */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Post Op Call Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Call Date</label>
              <input type="date" className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Call Time</label>
              <input type="time" className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Call Notes</label>
              <textarea className="w-full px-4 py-3 border rounded-lg text-sm" rows={3} placeholder="Details of post-op phone call..." />
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
    <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
      <div
        onClick={() => setChecked(!checked)}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
          checked ? 'bg-green-500 border-green-500' : 'border-gray-300'
        }`}
      >
        {checked && <Check className="w-3 h-3 text-white" />}
      </div>
      <span className={`text-sm ${checked ? 'text-gray-400' : 'text-gray-700'}`}>{label}</span>
    </label>
  )
}
