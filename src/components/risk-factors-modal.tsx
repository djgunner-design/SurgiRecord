'use client'

import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

interface RiskFactorsModalProps {
  isOpen: boolean
  onClose: () => void
  patientName: string
  allergies: string | null
}

export default function RiskFactorsModal({ isOpen, onClose, patientName, allergies }: RiskFactorsModalProps) {
  const [riskItems, setRiskItems] = useState<Array<{ factor: string; level: string }>>([])
  const [newFactor, setNewFactor] = useState('')

  if (!isOpen) return null

  const addFactor = () => {
    if (newFactor.trim()) {
      setRiskItems(prev => [...prev, { factor: newFactor.trim(), level: 'Medium' }])
      setNewFactor('')
    }
  }

  const commonRisks = [
    'Falls Risk', 'Pressure Injury Risk', 'DVT/PE Risk', 'Delirium Risk',
    'Aspiration Risk', 'Difficult Airway', 'Latex Allergy', 'MRSA',
    'Needle Stick Risk', 'Isolation Required', 'Bariatric', 'Cognitive Impairment',
  ]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Risk Factors - {patientName}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          {/* Allergies */}
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <h3 className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Allergies</h3>
            <p className="text-sm text-red-600 dark:text-red-400">{allergies || 'No Allergies (NIL)'}</p>
          </div>

          {/* Risk Factors */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Identified Risk Factors</h3>
            {riskItems.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No risk factors identified</p>
            ) : (
              <div className="space-y-2">
                {riskItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{item.factor}</span>
                    <select
                      value={item.level}
                      onChange={(e) => setRiskItems(prev => prev.map((r, idx) => idx === i ? { ...r, level: e.target.value } : r))}
                      className="px-2 py-1 border dark:border-slate-600 dark:bg-slate-600 rounded text-xs"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                    <button onClick={() => setRiskItems(prev => prev.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Custom */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newFactor}
              onChange={(e) => setNewFactor(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addFactor()}
              placeholder="Add risk factor..."
              className="flex-1 px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm"
            />
            <button onClick={addFactor} className="px-3 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Add */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Add</h3>
            <div className="flex flex-wrap gap-2">
              {commonRisks.filter(r => !riskItems.find(ri => ri.factor === r)).map(r => (
                <button
                  key={r}
                  onClick={() => setRiskItems(prev => [...prev, { factor: r, level: 'Medium' }])}
                  className="px-2.5 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full text-xs hover:bg-orange-100 dark:hover:bg-orange-900 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
                >
                  + {r}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 dark:border-slate-700">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-sm">Cancel</button>
          <button onClick={onClose} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Save</button>
        </div>
      </div>
    </div>
  )
}
