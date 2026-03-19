'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, Check } from 'lucide-react'

const deliriumFactors = [
  'Age ≥ 65 years',
  'Cognitive impairment / dementia',
  'Current hip fracture',
  'Severe illness (ICU admission)',
  'Previous delirium episode',
  'Visual impairment',
  'Hearing impairment',
  'Dehydration / malnutrition',
  'Polypharmacy (≥ 5 medications)',
  'Alcohol misuse',
  'Sleep deprivation',
  'Immobility / limited mobility',
  'Urinary catheter',
  'Pain',
  'Infection',
]

export default function DeliriumRiskPage() {
  const params = useParams()
  const router = useRouter()
  const [checked, setChecked] = useState<Record<number, boolean>>({})

  const score = Object.values(checked).filter(Boolean).length
  const riskLevel = score >= 5 ? 'High Risk' : score >= 2 ? 'Moderate Risk' : 'Low Risk'
  const riskColor = score >= 5 ? 'text-red-600 bg-red-100 dark:bg-red-900/30' : score >= 2 ? 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' : 'text-green-600 bg-green-100 dark:bg-green-900/30'

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 dark:bg-slate-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">DELIRIUM RISK ASSESSMENT</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className={`px-4 py-2 rounded-lg text-sm font-bold ${riskColor}`}>
            Risk Factors: {score} — {riskLevel}
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Check all risk factors that apply to this patient:</p>

        <div className="space-y-2">
          {deliriumFactors.map((factor, idx) => (
            <label key={idx} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
              checked[idx] ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800' : 'hover:bg-gray-50 dark:hover:bg-slate-700 border border-transparent'
            }`}>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                checked[idx] ? 'bg-orange-500 border-orange-500' : 'border-gray-300 dark:border-slate-500'
              }`} onClick={() => setChecked(prev => ({ ...prev, [idx]: !prev[idx] }))}>
                {checked[idx] && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className={`text-sm ${checked[idx] ? 'text-orange-700 dark:text-orange-300 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>{factor}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 font-medium flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Assessment
          </button>
        </div>
      </div>
    </div>
  )
}
