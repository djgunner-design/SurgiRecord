'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, Plus, Trash2, Check, X } from 'lucide-react'

type CountItem = {
  id: string
  category: string
  item: string
  countBefore: number | null
  countDuring: number | null
  countAfter: number | null
  correct: boolean | null
}

export default function CountSheetPage() {
  const params = useParams()
  const router = useRouter()
  const [items, setItems] = useState<CountItem[]>([
    { id: '1', category: 'Swabs', item: 'Raytec (Small)', countBefore: 10, countDuring: null, countAfter: null, correct: null },
    { id: '2', category: 'Swabs', item: 'Lap Sponge (Large)', countBefore: 5, countDuring: null, countAfter: null, correct: null },
    { id: '3', category: 'Swabs', item: 'Patties', countBefore: 0, countDuring: null, countAfter: null, correct: null },
    { id: '4', category: 'Sharps', item: 'Blades', countBefore: 2, countDuring: null, countAfter: null, correct: null },
    { id: '5', category: 'Sharps', item: 'Suture Needles', countBefore: 4, countDuring: null, countAfter: null, correct: null },
    { id: '6', category: 'Sharps', item: 'Hypodermic Needles', countBefore: 3, countDuring: null, countAfter: null, correct: null },
    { id: '7', category: 'Instruments', item: 'Clamps/Forceps', countBefore: 12, countDuring: null, countAfter: null, correct: null },
    { id: '8', category: 'Instruments', item: 'Scissors', countBefore: 3, countDuring: null, countAfter: null, correct: null },
    { id: '9', category: 'Instruments', item: 'Retractors', countBefore: 4, countDuring: null, countAfter: null, correct: null },
    { id: '10', category: 'Instruments', item: 'Diathermy Tip', countBefore: 1, countDuring: null, countAfter: null, correct: null },
  ])

  const categories = [...new Set(items.map(i => i.category))]

  const updateCount = (id: string, field: 'countDuring' | 'countAfter', value: number | null) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item
      const updated = { ...item, [field]: value }
      if (field === 'countAfter' && updated.countBefore !== null && value !== null) {
        updated.correct = updated.countBefore === value
      }
      return updated
    }))
  }

  const addItem = (category: string) => {
    const newItem: CountItem = {
      id: 'new_' + Date.now(),
      category,
      item: '',
      countBefore: 0,
      countDuring: null,
      countAfter: null,
      correct: null,
    }
    setItems(prev => [...prev, newItem])
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const allCorrect = items.every(i => i.correct === true || i.countBefore === 0)

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 dark:bg-slate-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">COUNT SHEET</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {allCorrect && items.some(i => i.countAfter !== null) && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium">
              <Check className="w-4 h-4" /> All counts verified correct
            </div>
          )}
        </div>

        {categories.map(category => (
          <div key={category} className="mb-8">
            <div className="bg-gray-600 dark:bg-slate-600 text-white px-4 py-2 rounded-t-lg flex items-center justify-between">
              <h3 className="text-sm font-medium">{category}</h3>
              <button onClick={() => addItem(category)} className="text-xs flex items-center gap-1 hover:text-cyan-300">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="border border-gray-200 dark:border-slate-600 rounded-b-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                    <th className="px-4 py-2 text-left">Item</th>
                    <th className="px-4 py-2 text-center">Initial Count</th>
                    <th className="px-4 py-2 text-center">During Count</th>
                    <th className="px-4 py-2 text-center">Final Count</th>
                    <th className="px-4 py-2 text-center">Status</th>
                    <th className="px-4 py-2 text-center w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.filter(i => i.category === category).map(item => (
                    <tr key={item.id} className={`border-b border-gray-100 dark:border-slate-600 ${
                      item.correct === false ? 'bg-red-50 dark:bg-red-900/30' : item.correct === true ? 'bg-green-50 dark:bg-green-900/30' : ''
                    }`}>
                      <td className="px-4 py-2">
                        {item.id.startsWith('new_') ? (
                          <input type="text" placeholder="Item name..." className="w-full px-2 py-1 border dark:border-slate-600 dark:bg-slate-700 rounded text-sm"
                            onChange={(e) => setItems(prev => prev.map(i => i.id === item.id ? {...i, item: e.target.value} : i))} />
                        ) : (
                          <span className="text-gray-700 dark:text-gray-300">{item.item}</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <input type="number" min="0" value={item.countBefore ?? ''} onChange={(e) => setItems(prev => prev.map(i => i.id === item.id ? {...i, countBefore: e.target.value ? parseInt(e.target.value) : null} : i))}
                          className="w-16 px-2 py-1 border dark:border-slate-600 dark:bg-slate-700 rounded text-sm text-center" />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <input type="number" min="0" value={item.countDuring ?? ''} onChange={(e) => updateCount(item.id, 'countDuring', e.target.value ? parseInt(e.target.value) : null)}
                          className="w-16 px-2 py-1 border dark:border-slate-600 dark:bg-slate-700 rounded text-sm text-center" />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <input type="number" min="0" value={item.countAfter ?? ''} onChange={(e) => updateCount(item.id, 'countAfter', e.target.value ? parseInt(e.target.value) : null)}
                          className="w-16 px-2 py-1 border dark:border-slate-600 dark:bg-slate-700 rounded text-sm text-center" />
                      </td>
                      <td className="px-4 py-2 text-center">
                        {item.correct === true && <Check className="w-5 h-5 text-green-600 mx-auto" />}
                        {item.correct === false && <X className="w-5 h-5 text-red-600 mx-auto" />}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Signatures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Scrub Nurse</label>
            <select className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
              <option value="">Select...</option>
              <option>KLE - Kerry Lentini</option>
              <option>MOR - Monica Roberts</option>
              <option>GCA - Gary Cadwallender</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Scout Nurse</label>
            <select className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
              <option value="">Select...</option>
              <option>KLE - Kerry Lentini</option>
              <option>MOR - Monica Roberts</option>
              <option>GCA - Gary Cadwallender</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 font-medium flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Count Sheet
          </button>
        </div>
      </div>
    </div>
  )
}
