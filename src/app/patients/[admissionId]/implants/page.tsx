'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, Plus, Trash2, Camera } from 'lucide-react'
import Link from 'next/link'

type Implant = {
  id: string
  type: string
  manufacturer: string
  model: string
  serialNumber: string
  lotNumber: string
  size: string
  location: string
}

export default function ImplantsPage() {
  const params = useParams()
  const router = useRouter()
  const admissionId = params.admissionId as string
  const [implants, setImplants] = useState<Implant[]>([])

  const addImplant = () => {
    setImplants(prev => [...prev, {
      id: 'imp_' + Date.now(),
      type: '',
      manufacturer: '',
      model: '',
      serialNumber: '',
      lotNumber: '',
      size: '',
      location: '',
    }])
  }

  const updateImplant = (id: string, field: keyof Implant, value: string) => {
    setImplants(prev => prev.map(imp => imp.id === id ? { ...imp, [field]: value } : imp))
  }

  const removeImplant = (id: string) => {
    setImplants(prev => prev.filter(imp => imp.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 dark:bg-slate-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">PROSTHESES / IMPLANTS</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex gap-2">
            <Link href={`/patients/${admissionId}/photos`} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
              <Camera className="w-4 h-4" /> Scan Sticker / Photo
            </Link>
            <button onClick={addImplant} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Implant
            </button>
          </div>
        </div>

        {implants.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-2">No implants/prostheses recorded</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Click &quot;Add Implant&quot; to record device details, or use &quot;Scan Sticker / Photo&quot; to capture the implant sticker</p>
          </div>
        ) : (
          <div className="space-y-6">
            {implants.map((implant, idx) => (
              <div key={implant.id} className="border border-gray-200 dark:border-slate-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Implant #{idx + 1}</h3>
                  <button onClick={() => removeImplant(implant.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Type</label>
                    <select value={implant.type} onChange={(e) => updateImplant(implant.id, 'type', e.target.value)} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
                      <option value="">Select...</option>
                      <option>Intraocular Lens (IOL)</option><option>Hip Prosthesis</option><option>Knee Prosthesis</option><option>Breast Implant</option><option>Mesh</option><option>Plate</option><option>Screw</option><option>Stent</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Manufacturer</label>
                    <input type="text" value={implant.manufacturer} onChange={(e) => updateImplant(implant.id, 'manufacturer', e.target.value)} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" placeholder="e.g., Alcon, J&J, Stryker" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Model</label>
                    <input type="text" value={implant.model} onChange={(e) => updateImplant(implant.id, 'model', e.target.value)} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" placeholder="Model name/number" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Size / Power</label>
                    <input type="text" value={implant.size} onChange={(e) => updateImplant(implant.id, 'size', e.target.value)} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" placeholder="e.g., +21.50D, 28mm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Serial Number</label>
                    <input type="text" value={implant.serialNumber} onChange={(e) => updateImplant(implant.id, 'serialNumber', e.target.value)} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Lot/Batch Number</label>
                    <input type="text" value={implant.lotNumber} onChange={(e) => updateImplant(implant.id, 'lotNumber', e.target.value)} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Anatomical Location</label>
                    <input type="text" value={implant.location} onChange={(e) => updateImplant(implant.id, 'location', e.target.value)} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" placeholder="e.g., Right eye, Left hip" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 font-medium flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Implant Records
          </button>
        </div>
      </div>
    </div>
  )
}
