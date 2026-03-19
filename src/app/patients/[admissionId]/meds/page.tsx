'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Plus } from 'lucide-react'

export default function MedicationsPage() {
  const params = useParams()
  const router = useRouter()
  const admissionId = params.admissionId as string

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">MEDICATIONS</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* IV Fluid Orders */}
        <div className="mb-8">
          <div className="bg-gray-600 text-white px-4 py-2 rounded-t-lg">
            <h3 className="text-sm font-medium">IV Fluid Order</h3>
          </div>
          <div className="border border-gray-200 rounded-b-lg p-4">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4" /> Order Fluid
            </button>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-600">
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Indication</th>
                  <th className="px-3 py-2 text-left">Fluid Type</th>
                  <th className="px-3 py-2 text-left">Volume (mL)</th>
                  <th className="px-3 py-2 text-left">Additive</th>
                  <th className="px-3 py-2 text-left">Rate (mL/hr)</th>
                  <th className="px-3 py-2 text-left">Route</th>
                  <th className="px-3 py-2 text-left">Prescriber</th>
                  <th className="px-3 py-2 text-left">Started</th>
                  <th className="px-3 py-2 text-left">Finished</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={10} className="px-3 py-6 text-center text-gray-400">No IV fluid orders</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Once Only / Pre-medication */}
        <div className="mb-8">
          <div className="bg-gray-600 text-white px-4 py-2 rounded-t-lg">
            <h3 className="text-sm font-medium">Once Only, pre medication and nurse initiated medication</h3>
          </div>
          <div className="border border-gray-200 rounded-b-lg p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Saved protocol</label>
                <select className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="">Select a protocol...</option>
                  <option>Cataract Protocol</option>
                  <option>General Anaesthetic Protocol</option>
                  <option>Local Anaesthetic Protocol</option>
                </select>
              </div>
              <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 mt-5">
                Add new protocol
              </button>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4" /> Order Medication
            </button>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-600">
                  <th className="px-3 py-2 text-left">Date Prescribed</th>
                  <th className="px-3 py-2 text-left">Medication</th>
                  <th className="px-3 py-2 text-left">Route</th>
                  <th className="px-3 py-2 text-left">Laterality</th>
                  <th className="px-3 py-2 text-left">Dose</th>
                  <th className="px-3 py-2 text-left">Date/Time of Dose</th>
                  <th className="px-3 py-2 text-left">Prescriber</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-gray-400">No medications ordered</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
