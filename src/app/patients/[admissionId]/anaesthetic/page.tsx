'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, X, ChevronDown, ChevronRight, Plus, Trash2, Star } from 'lucide-react'
import { findAdmission, findPatient } from '@/lib/sample-data'

type IVFluidEntry = {
  id: string
  fluid: string
  volume: string
  route: string
  rate: string
  givenDateTime: string
  givenBy: string
}

export default function AnaestheticPage() {
  const params = useParams()
  const router = useRouter()
  const admissionId = params.admissionId as string
  const admission = findAdmission(admissionId)
  const patient = admission ? findPatient(admission.patientId) : null

  const [preAnaestheticOpen, setPreAnaestheticOpen] = useState(true)
  const [anaestheticRecordOpen, setAnaestheticRecordOpen] = useState(true)

  // Pre-Anaesthetic fields
  const [asaClass, setAsaClass] = useState('')
  const [mallampati, setMallampati] = useState('')
  const [fastingStatus, setFastingStatus] = useState('')
  const [medications, setMedications] = useState('')
  const [airwayAssessment, setAirwayAssessment] = useState('')

  // Anaesthetic Record fields
  const [anaestheticAdmin, setAnaestheticAdmin] = useState('')

  // IV Access Site 1
  const [ivAccess1, setIvAccess1] = useState('')
  const [laterality1, setLaterality1] = useState('')
  const [gauge1, setGauge1] = useState('')

  // IV Access Site 2
  const [ivAccess2, setIvAccess2] = useState('')
  const [laterality2, setLaterality2] = useState('')
  const [gauge2, setGauge2] = useState('')

  // IV Fluids
  const [selectedFluid, setSelectedFluid] = useState('')
  const [fluidEntries, setFluidEntries] = useState<IVFluidEntry[]>([])

  const addFluidEntry = () => {
    setFluidEntries(prev => [...prev, {
      id: 'fl_' + Date.now(),
      fluid: selectedFluid || '',
      volume: '',
      route: 'IV',
      rate: '',
      givenDateTime: new Date().toISOString().slice(0, 16),
      givenBy: '',
    }])
  }

  const removeFluidEntry = (id: string) => {
    setFluidEntries(prev => prev.filter(e => e.id !== id))
  }

  const updateFluidEntry = (id: string, field: keyof IVFluidEntry, value: string) => {
    setFluidEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  const ivAccessOptions = ['Peripheral IV', 'Central Line', 'PICC Line', 'Midline', 'IO Access', 'Arterial Line']
  const lateralityOptions = ['Left', 'Right']
  const gaugeOptions = ['14G', '16G', '18G', '20G', '22G', '24G']
  const fluidOptions = [
    'Normal Saline 0.9%',
    'Hartmanns Solution',
    'Plasmalyte',
    'Dextrose 5%',
    'Dextrose 10%',
    'Dextrose 4% / Saline 0.18%',
    'Gelofusine',
    'Albumin 4%',
    'Albumin 20%',
    'Packed Red Blood Cells',
    'Fresh Frozen Plasma',
    'Platelets',
    'Mannitol 20%',
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-700 dark:bg-slate-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">ANAESTHETIC RECORD</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        {/* Action buttons */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-2">
              <Save className="w-4 h-4" /> Save
            </button>
            <button onClick={() => router.back()} className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 flex items-center gap-2">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>

        {/* PRE-ANAESTHETIC Accordion */}
        <div className="mb-4 border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden">
          <button
            onClick={() => setPreAnaestheticOpen(!preAnaestheticOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-slate-700 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            <span>PRE-ANAESTHETIC</span>
            {preAnaestheticOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {preAnaestheticOpen && (
            <div className="p-4 space-y-6">
              {/* ASA Classification */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">ASA Classification</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: '1', label: 'ASA I', desc: 'Normal healthy patient' },
                    { value: '2', label: 'ASA II', desc: 'Mild systemic disease' },
                    { value: '3', label: 'ASA III', desc: 'Severe systemic disease' },
                    { value: '4', label: 'ASA IV', desc: 'Incapacitating disease' },
                    { value: '5', label: 'ASA V', desc: 'Moribund patient' },
                    { value: 'E', label: 'Emergency', desc: 'Emergency operation' },
                  ].map(asa => (
                    <label key={asa.value} className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      asaClass === asa.value
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 dark:border-cyan-400'
                        : 'border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}>
                      <input type="radio" name="asa" value={asa.value} checked={asaClass === asa.value} onChange={() => setAsaClass(asa.value)} className="mt-1" />
                      <div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{asa.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{asa.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Airway Assessment */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">Airway Assessment</label>
                <textarea
                  value={airwayAssessment}
                  onChange={(e) => setAirwayAssessment(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm dark:text-gray-200"
                  rows={2}
                  placeholder="Airway assessment notes..."
                />
              </div>

              {/* Mallampati Score */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">Mallampati Score</label>
                <select
                  value={mallampati}
                  onChange={(e) => setMallampati(e.target.value)}
                  className="w-full md:w-1/2 px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm dark:text-gray-200"
                >
                  <option value="">Select...</option>
                  <option value="I">Class I - Soft palate, fauces, uvula, pillars visible</option>
                  <option value="II">Class II - Soft palate, fauces, uvula visible</option>
                  <option value="III">Class III - Soft palate, base of uvula visible</option>
                  <option value="IV">Class IV - Hard palate only visible</option>
                </select>
              </div>

              {/* Fasting Status */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">Fasting Status</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Last Solid Food</label>
                    <input
                      type="datetime-local"
                      value={fastingStatus}
                      onChange={(e) => setFastingStatus(e.target.value)}
                      className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm dark:text-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Last Clear Fluid</label>
                    <input
                      type="datetime-local"
                      className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm dark:text-gray-200"
                    />
                  </div>
                </div>
              </div>

              {/* Current Medications */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">Current Medications</label>
                <textarea
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm dark:text-gray-200"
                  rows={3}
                  placeholder="List current medications..."
                  defaultValue={patient?.comorbidities ? 'Blood thinner medications noted' : ''}
                />
              </div>
            </div>
          )}
        </div>

        {/* ANAESTHETIC RECORD Accordion */}
        <div className="mb-4 border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden">
          <button
            onClick={() => setAnaestheticRecordOpen(!anaestheticRecordOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-slate-700 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            <span>ANAESTHETIC RECORD</span>
            {anaestheticRecordOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {anaestheticRecordOpen && (
            <div className="p-4 space-y-6">
              {/* Anaesthetic Administered */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">Anaesthetic Administered</label>
                <select
                  value={anaestheticAdmin}
                  onChange={(e) => setAnaestheticAdmin(e.target.value)}
                  className="w-full md:w-1/2 px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm dark:text-gray-200"
                >
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

              {/* IV Access Site 1 */}
              <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">IV Access Site 1</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">IV Access</label>
                    <select value={ivAccess1} onChange={(e) => setIvAccess1(e.target.value)} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm dark:text-gray-200">
                      <option value="">Select...</option>
                      {ivAccessOptions.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Laterality</label>
                    <select value={laterality1} onChange={(e) => setLaterality1(e.target.value)} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm dark:text-gray-200">
                      <option value="">Select...</option>
                      {lateralityOptions.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">IV Gauge</label>
                    <select value={gauge1} onChange={(e) => setGauge1(e.target.value)} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm dark:text-gray-200">
                      <option value="">Select...</option>
                      {gaugeOptions.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* IV Access Site 2 */}
              <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">IV Access Site 2</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">IV Access</label>
                    <select value={ivAccess2} onChange={(e) => setIvAccess2(e.target.value)} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm dark:text-gray-200">
                      <option value="">Select...</option>
                      {ivAccessOptions.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Laterality</label>
                    <select value={laterality2} onChange={(e) => setLaterality2(e.target.value)} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm dark:text-gray-200">
                      <option value="">Select...</option>
                      {lateralityOptions.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">IV Gauge</label>
                    <select value={gauge2} onChange={(e) => setGauge2(e.target.value)} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm dark:text-gray-200">
                      <option value="">Select...</option>
                      {gaugeOptions.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* IV Fluid Section */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">IV Fluids</h4>
                <div className="flex items-end gap-3 mb-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Select IV Fluid</label>
                    <select
                      value={selectedFluid}
                      onChange={(e) => setSelectedFluid(e.target.value)}
                      className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm dark:text-gray-200"
                    >
                      <option value="">Select fluid...</option>
                      {fluidOptions.map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <button className="px-3 py-2 bg-yellow-500 text-white rounded-lg text-xs hover:bg-yellow-600 flex items-center gap-1 whitespace-nowrap">
                    <Star className="w-3 h-3" /> Save my favorite
                  </button>
                </div>

                {/* Fluids Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
                        <th className="px-3 py-2 text-left text-xs font-medium">Fluid</th>
                        <th className="px-3 py-2 text-left text-xs font-medium">Volume (ml)</th>
                        <th className="px-3 py-2 text-left text-xs font-medium">Route</th>
                        <th className="px-3 py-2 text-left text-xs font-medium">Rate</th>
                        <th className="px-3 py-2 text-left text-xs font-medium">Given Date Time</th>
                        <th className="px-3 py-2 text-left text-xs font-medium">Given By</th>
                        <th className="px-3 py-2 text-left text-xs font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fluidEntries.map(entry => (
                        <tr key={entry.id} className="border-b border-gray-100 dark:border-slate-600">
                          <td className="px-3 py-2">
                            <select value={entry.fluid} onChange={(e) => updateFluidEntry(entry.id, 'fluid', e.target.value)} className="w-full px-2 py-1 border dark:border-slate-600 dark:bg-slate-700 rounded text-xs dark:text-gray-200">
                              <option value="">Select...</option>
                              {fluidOptions.map(f => <option key={f}>{f}</option>)}
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <input type="number" value={entry.volume} onChange={(e) => updateFluidEntry(entry.id, 'volume', e.target.value)} className="w-20 px-2 py-1 border dark:border-slate-600 dark:bg-slate-700 rounded text-xs dark:text-gray-200" />
                          </td>
                          <td className="px-3 py-2">
                            <select value={entry.route} onChange={(e) => updateFluidEntry(entry.id, 'route', e.target.value)} className="w-full px-2 py-1 border dark:border-slate-600 dark:bg-slate-700 rounded text-xs dark:text-gray-200">
                              <option>IV</option>
                              <option>Oral</option>
                              <option>SC</option>
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <input type="text" value={entry.rate} onChange={(e) => updateFluidEntry(entry.id, 'rate', e.target.value)} placeholder="e.g. 125ml/hr" className="w-24 px-2 py-1 border dark:border-slate-600 dark:bg-slate-700 rounded text-xs dark:text-gray-200" />
                          </td>
                          <td className="px-3 py-2">
                            <input type="datetime-local" value={entry.givenDateTime} onChange={(e) => updateFluidEntry(entry.id, 'givenDateTime', e.target.value)} className="px-2 py-1 border dark:border-slate-600 dark:bg-slate-700 rounded text-xs dark:text-gray-200" />
                          </td>
                          <td className="px-3 py-2">
                            <input type="text" value={entry.givenBy} onChange={(e) => updateFluidEntry(entry.id, 'givenBy', e.target.value)} placeholder="Name" className="w-24 px-2 py-1 border dark:border-slate-600 dark:bg-slate-700 rounded text-xs dark:text-gray-200" />
                          </td>
                          <td className="px-3 py-2">
                            <button onClick={() => removeFluidEntry(entry.id)} className="text-gray-400 hover:text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {fluidEntries.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-3 py-6 text-center text-gray-400 dark:text-gray-500 text-xs">No IV fluids recorded</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={addFluidEntry}
                  className="mt-3 px-4 py-2 bg-cyan-600 text-white rounded-lg text-xs hover:bg-cyan-700 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> New
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
