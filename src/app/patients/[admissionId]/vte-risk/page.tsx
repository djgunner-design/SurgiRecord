'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, Check } from 'lucide-react'

const vteFactors = [
  { factor: 'Active cancer or cancer treatment', points: 2 },
  { factor: 'Age > 60 years', points: 1 },
  { factor: 'Dehydration', points: 1 },
  { factor: 'Known thrombophilia', points: 2 },
  { factor: 'Obesity (BMI > 30)', points: 1 },
  { factor: 'Personal history of VTE', points: 2 },
  { factor: 'First-degree relative with VTE', points: 1 },
  { factor: 'Use of HRT / oral contraceptives', points: 1 },
  { factor: 'Varicose veins with phlebitis', points: 1 },
  { factor: 'Pregnancy or < 6 weeks post-partum', points: 1 },
  { factor: 'Immobility (bedrest > 3 days)', points: 2 },
  { factor: 'Hip or knee replacement', points: 2 },
  { factor: 'Hip fracture', points: 2 },
  { factor: 'Total anaesthetic + surgical time > 90 minutes', points: 1 },
  { factor: 'Surgery involving pelvis or lower limb with anaesthetic > 60 min', points: 2 },
  { factor: 'Acute surgical admission with inflammatory condition', points: 1 },
  { factor: 'Critical care admission', points: 2 },
  { factor: 'Surgery with significant reduction in mobility', points: 1 },
]

export default function VTERiskPage() {
  const params = useParams()
  const router = useRouter()
  const [checked, setChecked] = useState<Record<number, boolean>>({})

  const totalScore = vteFactors.reduce((sum, f, idx) => sum + (checked[idx] ? f.points : 0), 0)
  const riskLevel = totalScore >= 4 ? 'High Risk' : totalScore >= 2 ? 'Moderate Risk' : 'Low Risk'
  const riskColor = totalScore >= 4 ? 'text-red-600 bg-red-100 dark:bg-red-900/30' : totalScore >= 2 ? 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' : 'text-green-600 bg-green-100 dark:bg-green-900/30'

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 dark:bg-slate-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">VTE RISK ASSESSMENT</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className={`px-4 py-2 rounded-lg text-sm font-bold ${riskColor}`}>
            Score: {totalScore} — {riskLevel}
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Check all VTE risk factors that apply:</p>

        <div className="space-y-2">
          {vteFactors.map((item, idx) => (
            <label key={idx} className={`flex items-center justify-between gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
              checked[idx] ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800' : 'hover:bg-gray-50 dark:hover:bg-slate-700 border border-transparent'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  checked[idx] ? 'bg-orange-500 border-orange-500' : 'border-gray-300 dark:border-slate-500'
                }`} onClick={() => setChecked(prev => ({ ...prev, [idx]: !prev[idx] }))}>
                  {checked[idx] && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm ${checked[idx] ? 'text-orange-700 dark:text-orange-300 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>{item.factor}</span>
              </div>
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500 flex-shrink-0">+{item.points}</span>
            </label>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-100 dark:bg-slate-700 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prophylaxis Recommendations</h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <div><span className="text-green-600 font-medium">Low Risk (0-1):</span> Early mobilisation</div>
            <div><span className="text-orange-600 font-medium">Moderate Risk (2-3):</span> Consider mechanical prophylaxis (TED stockings, IPC)</div>
            <div><span className="text-red-600 font-medium">High Risk (4+):</span> Mechanical + pharmacological prophylaxis (LMWH/UFH)</div>
          </div>
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
