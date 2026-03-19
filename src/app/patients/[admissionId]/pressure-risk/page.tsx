'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'

const bradenItems = [
  { category: 'Sensory Perception', options: [{ label: 'Completely Limited', value: 1 }, { label: 'Very Limited', value: 2 }, { label: 'Slightly Limited', value: 3 }, { label: 'No Impairment', value: 4 }] },
  { category: 'Moisture', options: [{ label: 'Constantly Moist', value: 1 }, { label: 'Very Moist', value: 2 }, { label: 'Occasionally Moist', value: 3 }, { label: 'Rarely Moist', value: 4 }] },
  { category: 'Activity', options: [{ label: 'Bedfast', value: 1 }, { label: 'Chairfast', value: 2 }, { label: 'Walks Occasionally', value: 3 }, { label: 'Walks Frequently', value: 4 }] },
  { category: 'Mobility', options: [{ label: 'Completely Immobile', value: 1 }, { label: 'Very Limited', value: 2 }, { label: 'Slightly Limited', value: 3 }, { label: 'No Limitations', value: 4 }] },
  { category: 'Nutrition', options: [{ label: 'Very Poor', value: 1 }, { label: 'Probably Inadequate', value: 2 }, { label: 'Adequate', value: 3 }, { label: 'Excellent', value: 4 }] },
  { category: 'Friction & Shear', options: [{ label: 'Problem', value: 1 }, { label: 'Potential Problem', value: 2 }, { label: 'No Apparent Problem', value: 3 }] },
]

export default function PressureRiskPage() {
  const params = useParams()
  const router = useRouter()
  const [scores, setScores] = useState<Record<number, number>>({})

  const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0)
  const riskLevel = totalScore <= 9 ? 'Very High Risk' : totalScore <= 12 ? 'High Risk' : totalScore <= 14 ? 'Moderate Risk' : totalScore <= 18 ? 'Mild Risk' : 'No Risk'
  const riskColor = totalScore <= 12 ? 'text-red-600 bg-red-100 dark:bg-red-900/30' : totalScore <= 14 ? 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' : 'text-green-600 bg-green-100 dark:bg-green-900/30'

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 dark:bg-slate-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">PRESSURE INJURY RISK ASSESSMENT (Braden Scale)</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className={`px-4 py-2 rounded-lg text-sm font-bold ${riskColor}`}>
            Score: {totalScore || '—'} — {Object.keys(scores).length === bradenItems.length ? riskLevel : 'Incomplete'}
          </div>
        </div>

        <div className="space-y-6">
          {bradenItems.map((item, idx) => (
            <div key={idx} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{item.category}</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {item.options.map((opt) => (
                  <label key={opt.label} className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors text-sm ${
                    scores[idx] === opt.value ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30' : 'border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600'
                  }`}>
                    <input type="radio" name={`braden_${idx}`} value={opt.value} checked={scores[idx] === opt.value} onChange={() => setScores(prev => ({ ...prev, [idx]: opt.value }))} className="text-cyan-600" />
                    <span className="text-gray-700 dark:text-gray-300">{opt.label} ({opt.value})</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-100 dark:bg-slate-700 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Braden Scale Guide (lower = higher risk)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="text-red-600">≤9: Very High Risk</div>
            <div className="text-red-500">10-12: High Risk</div>
            <div className="text-orange-600">13-14: Moderate Risk</div>
            <div className="text-green-600">15-18: Mild Risk / 19+: No Risk</div>
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
