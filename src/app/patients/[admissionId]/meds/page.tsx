'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

interface Medication {
  medication: string
  route: string
  laterality: string
  dose: string
  datePrescribed: string
}

const protocols: Record<string, Medication[]> = {
  'Cataract Protocol': [
    { medication: 'Chloramphenicol Eye Drops', route: 'Topical', laterality: 'Both eyes', dose: '1 drop', datePrescribed: new Date().toLocaleDateString('en-AU') },
    { medication: 'Phenylephrine 2.5%', route: 'Topical', laterality: 'Affected eye', dose: '1 drop', datePrescribed: new Date().toLocaleDateString('en-AU') },
    { medication: 'Tropicamide 1%', route: 'Topical', laterality: 'Affected eye', dose: '1 drop', datePrescribed: new Date().toLocaleDateString('en-AU') },
    { medication: 'Proxymetacaine 0.5%', route: 'Topical', laterality: 'Affected eye', dose: '1 drop', datePrescribed: new Date().toLocaleDateString('en-AU') },
  ],
  'General Anaesthetic Protocol': [
    { medication: 'Paracetamol 1g', route: 'Oral', laterality: 'N/A', dose: '1g', datePrescribed: new Date().toLocaleDateString('en-AU') },
    { medication: 'Ondansetron 4mg', route: 'IV', laterality: 'N/A', dose: '4mg', datePrescribed: new Date().toLocaleDateString('en-AU') },
  ],
}

export default function MedicationsPage() {
  const params = useParams()
  const router = useRouter()
  const admissionId = params.admissionId as string
  const [medications, setMedications] = useState<Medication[]>([])
  const [selectedProtocol, setSelectedProtocol] = useState('')

  const handleProtocolChange = (value: string) => {
    setSelectedProtocol(value)
    if (value && protocols[value]) {
      setMedications(prev => [...prev, ...protocols[value]])
    }
  }

  const removeMedication = (index: number) => {
    setMedications(prev => prev.filter((_, i) => i !== index))
  }

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
                <select
                  value={selectedProtocol}
                  onChange={(e) => handleProtocolChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
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
                  <th className="px-3 py-2 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {medications.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-3 py-6 text-center text-gray-400">No medications ordered</td>
                  </tr>
                ) : (
                  medications.map((med, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-700">{med.datePrescribed}</td>
                      <td className="px-3 py-2 text-gray-700 font-medium">{med.medication}</td>
                      <td className="px-3 py-2 text-gray-700">{med.route}</td>
                      <td className="px-3 py-2 text-gray-700">{med.laterality}</td>
                      <td className="px-3 py-2 text-gray-700">{med.dose}</td>
                      <td className="px-3 py-2 text-gray-400">-</td>
                      <td className="px-3 py-2 text-gray-400">-</td>
                      <td className="px-3 py-2">
                        <button onClick={() => removeMedication(i)} className="text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
