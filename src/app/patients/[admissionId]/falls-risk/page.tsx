'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'

const fallsRiskItems = [
  { question: 'History of falling (within 3 months)', scores: [{ label: 'No', value: 0 }, { label: 'Yes', value: 25 }] },
  { question: 'Secondary diagnosis', scores: [{ label: 'No', value: 0 }, { label: 'Yes', value: 15 }] },
  { question: 'Ambulatory aid (cane/walker/crutches/furniture)', scores: [{ label: 'None/Bedrest/Nurse assist', value: 0 }, { label: 'Crutches/Cane/Walker', value: 15 }, { label: 'Furniture', value: 30 }] },
  { question: 'IV/Heparin Lock', scores: [{ label: 'No', value: 0 }, { label: 'Yes', value: 20 }] },
  { question: 'Gait', scores: [{ label: 'Normal/Bedrest/Immobile', value: 0 }, { label: 'Weak', value: 10 }, { label: 'Impaired', value: 20 }] },
  { question: 'Mental status', scores: [{ label: 'Oriented to own ability', value: 0 }, { label: 'Overestimates/Forgets limitations', value: 15 }] },
]

export default function FallsRiskPage() {
  const params = useParams()
  const router = useRouter()
  const [scores, setScores] = useState<Record<number, number>>({})

  const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0)
  const riskLevel = totalScore >= 45 ? 'High Risk' : totalScore >= 25 ? 'Moderate Risk' : 'Low Risk'
  const riskColor = totalScore >= 45 ? 'text-red-600 bg-red-100 dark:bg-red-900/30' : totalScore >= 25 ? 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' : 'text-green-600 bg-green-100 dark:bg-green-900/30'

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 dark:bg-slate-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">FALLS RISK ASSESSMENT (Morse Fall Scale)</h2>
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

        <div className="space-y-6">
          {fallsRiskItems.map((item, idx) => (
            <div key={idx} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{item.question}</label>
              <div className="flex flex-wrap gap-3">
                {item.scores.map((opt) => (
                  <label key={opt.label} className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-colors ${
                    scores[idx] === opt.value ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30' : 'border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600'
                  }`}>
                    <input type="radio" name={`q_${idx}`} value={opt.value} checked={scores[idx] === opt.value} onChange={() => setScores(prev => ({ ...prev, [idx]: opt.value }))} className="text-cyan-600" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label} ({opt.value})</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-100 dark:bg-slate-700 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Risk Level Guide</h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-green-600">0-24: Low Risk</div>
            <div className="text-orange-600">25-44: Moderate Risk</div>
            <div className="text-red-600">45+: High Risk</div>
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
