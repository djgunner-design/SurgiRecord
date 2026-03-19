'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'

type FluidEntry = { id: string; time: string; type: 'input' | 'output'; description: string; amount: number }

export default function FluidBalancePage() {
  const params = useParams()
  const router = useRouter()
  const [entries, setEntries] = useState<FluidEntry[]>([])

  const addEntry = (type: 'input' | 'output') => {
    setEntries(prev => [...prev, { id: 'f_' + Date.now(), time: new Date().toTimeString().slice(0, 5), type, description: '', amount: 0 }])
  }

  const totalInput = entries.filter(e => e.type === 'input').reduce((sum, e) => sum + e.amount, 0)
  const totalOutput = entries.filter(e => e.type === 'output').reduce((sum, e) => sum + e.amount, 0)
  const balance = totalInput - totalOutput

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 dark:bg-slate-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">FLUID BALANCE CHART</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex gap-4 text-sm">
            <span className="text-green-600 font-medium">Input: {totalInput}mL</span>
            <span className="text-red-600 font-medium">Output: {totalOutput}mL</span>
            <span className={`font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>Balance: {balance >= 0 ? '+' : ''}{balance}mL</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-green-700 dark:text-green-400">Fluid Input</h3>
              <button onClick={() => addEntry('input')} className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"><th className="px-3 py-2 text-left">Time</th><th className="px-3 py-2 text-left">Type</th><th className="px-3 py-2 text-right">mL</th><th className="w-8"></th></tr></thead>
              <tbody>
                {entries.filter(e => e.type === 'input').map(entry => (
                  <tr key={entry.id} className="border-b border-gray-100 dark:border-slate-600">
                    <td className="px-3 py-2"><input type="time" value={entry.time} onChange={(e) => setEntries(prev => prev.map(en => en.id === entry.id ? {...en, time: e.target.value} : en))} className="w-24 px-2 py-1 border dark:border-slate-600 dark:bg-slate-700 rounded text-xs" /></td>
                    <td className="px-3 py-2"><select value={entry.description} onChange={(e) => setEntries(prev => prev.map(en => en.id === entry.id ? {...en, description: e.target.value} : en))} className="w-full px-2 py-1 border dark:border-slate-600 dark:bg-slate-700 rounded text-xs"><option value="">Select...</option><option>IV Fluid</option><option>Oral Fluid</option><option>Blood Product</option><option>Irrigation</option></select></td>
                    <td className="px-3 py-2"><input type="number" value={entry.amount || ''} onChange={(e) => setEntries(prev => prev.map(en => en.id === entry.id ? {...en, amount: parseInt(e.target.value) || 0} : en))} className="w-20 px-2 py-1 border dark:border-slate-600 dark:bg-slate-700 rounded text-xs text-right" /></td>
                    <td><button onClick={() => setEntries(prev => prev.filter(en => en.id !== entry.id))} className="text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button></td>
                  </tr>
                ))}
                {entries.filter(e => e.type === 'input').length === 0 && <tr><td colSpan={4} className="px-3 py-4 text-center text-gray-400 text-xs">No input recorded</td></tr>}
              </tbody>
            </table>
          </div>

          {/* Output */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">Fluid Output</h3>
              <button onClick={() => addEntry('output')} className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"><th className="px-3 py-2 text-left">Time</th><th className="px-3 py-2 text-left">Type</th><th className="px-3 py-2 text-right">mL</th><th className="w-8"></th></tr></thead>
              <tbody>
                {entries.filter(e => e.type === 'output').map(entry => (
                  <tr key={entry.id} className="border-b border-gray-100 dark:border-slate-600">
                    <td className="px-3 py-2"><input type="time" value={entry.time} onChange={(e) => setEntries(prev => prev.map(en => en.id === entry.id ? {...en, time: e.target.value} : en))} className="w-24 px-2 py-1 border dark:border-slate-600 dark:bg-slate-700 rounded text-xs" /></td>
                    <td className="px-3 py-2"><select value={entry.description} onChange={(e) => setEntries(prev => prev.map(en => en.id === entry.id ? {...en, description: e.target.value} : en))} className="w-full px-2 py-1 border dark:border-slate-600 dark:bg-slate-700 rounded text-xs"><option value="">Select...</option><option>Urine</option><option>Blood Loss</option><option>Drain</option><option>Vomit</option><option>NGT</option></select></td>
                    <td className="px-3 py-2"><input type="number" value={entry.amount || ''} onChange={(e) => setEntries(prev => prev.map(en => en.id === entry.id ? {...en, amount: parseInt(e.target.value) || 0} : en))} className="w-20 px-2 py-1 border dark:border-slate-600 dark:bg-slate-700 rounded text-xs text-right" /></td>
                    <td><button onClick={() => setEntries(prev => prev.filter(en => en.id !== entry.id))} className="text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button></td>
                  </tr>
                ))}
                {entries.filter(e => e.type === 'output').length === 0 && <tr><td colSpan={4} className="px-3 py-4 text-center text-gray-400 text-xs">No output recorded</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 font-medium flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Fluid Balance
          </button>
        </div>
      </div>
    </div>
  )
}
