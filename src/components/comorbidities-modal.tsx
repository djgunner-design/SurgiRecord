'use client'

import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

interface ComorbiditiesModalProps {
  isOpen: boolean
  onClose: () => void
  patientName: string
  initialComorbidities: string | null
}

export default function ComorbiditiesModal({ isOpen, onClose, patientName, initialComorbidities }: ComorbiditiesModalProps) {
  const [items, setItems] = useState<string[]>(
    initialComorbidities ? initialComorbidities.split(',').map(s => s.trim()).filter(Boolean) : []
  )
  const [newItem, setNewItem] = useState('')

  if (!isOpen) return null

  const addItem = () => {
    if (newItem.trim()) {
      setItems(prev => [...prev, newItem.trim()])
      setNewItem('')
    }
  }

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const commonComorbidities = [
    'Hypertension', 'Type 2 Diabetes', 'Asthma', 'COPD', 'Coronary Artery Disease',
    'Atrial Fibrillation', 'Heart Failure', 'Chronic Kidney Disease', 'Obesity',
    'Hypothyroidism', 'Depression', 'Osteoarthritis', 'GORD', 'Sleep Apnoea',
    'DVT History', 'Stroke History', 'Blood Thinner', 'Pacemaker',
  ]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Comorbidities - {patientName}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          {/* Current Items */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Comorbidities</h3>
            {items.length === 0 ? (
              <p className="text-sm text-gray-400 italic">None recorded</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {items.map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-sm">
                    {item}
                    <button onClick={() => removeItem(i)} className="hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Add Custom */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
              placeholder="Add comorbidity..."
              className="flex-1 px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm"
            />
            <button onClick={addItem} className="px-3 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Add */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Add</h3>
            <div className="flex flex-wrap gap-2">
              {commonComorbidities.filter(c => !items.includes(c)).map(c => (
                <button
                  key={c}
                  onClick={() => setItems(prev => [...prev, c])}
                  className="px-2.5 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full text-xs hover:bg-cyan-100 dark:hover:bg-cyan-900 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
                >
                  + {c}
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
