'use client'

import { useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, Plus } from 'lucide-react'
import TemplatePicker from '@/components/template-picker'
import { useLock } from '@/components/lock-provider'
import LockIndicator from '@/components/lock-indicator'

export default function RecoveryPage() {
  const params = useParams()
  const router = useRouter()
  const { isEditable, lockHolder, requestLock, releaseLock, hasLock, lockStatus } = useLock('recovery')
  const [activeStage, setActiveStage] = useState(1)

  const [fields, setFields] = useState<Record<string, string>>({
    nurse: '',
    airway: 'Patent',
    breathing: 'Spontaneous',
    o2Delivery: 'Room Air',
    activity: 'Moves all extremities (2)',
    respiration: 'Breathes deeply, coughs (2)',
    circulation: 'BP ±20% pre-op (2)',
    consciousness: 'Fully awake (2)',
    o2Saturation: 'SpO2 >92% on room air (2)',
    nauseaVomiting: 'None (2)',
  })

  const handleApplyTemplate = useCallback((templateFields: Record<string, string>) => {
    setFields(prev => ({ ...prev, ...templateFields }))
  }, [])

  const getCurrentFields = useCallback(() => fields, [fields])

  const fieldLabels: Record<string, string> = {
    nurse: 'Nurse',
    airway: 'Airway',
    breathing: 'Breathing',
    o2Delivery: 'O2 Delivery',
    activity: 'Activity',
    respiration: 'Respiration',
    circulation: 'Circulation',
    consciousness: 'Consciousness',
    o2Saturation: 'O2 Saturation',
    nauseaVomiting: 'Nausea/Vomiting',
  }

  const updateField = (key: string, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 dark:bg-slate-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">RECOVERY</h2>
      </div>

      <LockIndicator section="recovery" />

      <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 ${!isEditable ? 'pointer-events-none opacity-60' : ''}`}>
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            <TemplatePicker
              category="recovery"
              onApply={handleApplyTemplate}
              getCurrentFields={getCurrentFields}
              fieldLabels={fieldLabels}
            />
            <button
              onClick={() => setActiveStage(1)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeStage === 1 ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'}`}
            >
              Stage 1
            </button>
            <button
              onClick={() => setActiveStage(2)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeStage === 2 ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'}`}
            >
              Stage 2
            </button>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Recovery Stage {activeStage}</h3>

        {/* Recovery Assessment */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Arrival Time</label>
            <input type="time" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Nurse</label>
            <select value={fields.nurse} onChange={e => updateField('nurse', e.target.value)} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
              <option value="">Select nurse...</option>
              <option>KLE - Kerry Lentini</option>
              <option>MOR - Monica Roberts</option>
              <option>GCA - Gary Cadwallender</option>
            </select>
          </div>
        </div>

        {/* Airway Assessment */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Airway Assessment</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Airway</label>
              <select value={fields.airway} onChange={e => updateField('airway', e.target.value)} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
                <option>Patent</option>
                <option>LMA in situ</option>
                <option>ETT in situ</option>
                <option>Obstructed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Breathing</label>
              <select value={fields.breathing} onChange={e => updateField('breathing', e.target.value)} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
                <option>Spontaneous</option>
                <option>Assisted</option>
                <option>Mechanical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">O2 Delivery</label>
              <select value={fields.o2Delivery} onChange={e => updateField('o2Delivery', e.target.value)} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
                <option>Room Air</option>
                <option>Nasal Prongs</option>
                <option>Hudson Mask</option>
                <option>Non-rebreather</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recovery Observations */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recovery Observations</h4>
            <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add Obs
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400">
                <th className="px-3 py-2 text-left">Time</th>
                <th className="px-3 py-2 text-center">RR</th>
                <th className="px-3 py-2 text-center">SpO2</th>
                <th className="px-3 py-2 text-center">HR</th>
                <th className="px-3 py-2 text-center">BP</th>
                <th className="px-3 py-2 text-center">Temp</th>
                <th className="px-3 py-2 text-center">Pain</th>
                <th className="px-3 py-2 text-center">Nausea</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-gray-400 dark:text-gray-500">No recovery observations yet</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Discharge Criteria */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Discharge Criteria (Aldrete Score)</h4>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'activity', label: 'Activity', options: ['Moves all extremities (2)', 'Moves 2 extremities (1)', 'Unable to move (0)'] },
              { key: 'respiration', label: 'Respiration', options: ['Breathes deeply, coughs (2)', 'Dyspnea, shallow breathing (1)', 'Apnea (0)'] },
              { key: 'circulation', label: 'Circulation', options: ['BP ±20% pre-op (2)', 'BP ±20-50% pre-op (1)', 'BP ±50% pre-op (0)'] },
              { key: 'consciousness', label: 'Consciousness', options: ['Fully awake (2)', 'Arousable on calling (1)', 'Not responsive (0)'] },
              { key: 'o2Saturation', label: 'O2 Saturation', options: ['SpO2 >92% on room air (2)', 'Needs O2 to maintain >90% (1)', 'SpO2 <90% with O2 (0)'] },
              { key: 'nauseaVomiting', label: 'Nausea/Vomiting', options: ['None (2)', 'Mild (1)', 'Severe (0)'] },
            ].map(item => (
              <div key={item.key} className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{item.label}</label>
                <select value={fields[item.key]} onChange={e => updateField(item.key, e.target.value)} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
                  {item.options.map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 font-medium flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Recovery
          </button>
        </div>
      </div>
    </div>
  )
}
