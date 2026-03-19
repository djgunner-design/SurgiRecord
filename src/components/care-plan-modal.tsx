'use client'

import { useState } from 'react'
import { X, Plus, Printer, Check, Trash2 } from 'lucide-react'

interface CarePlanModalProps {
  isOpen: boolean
  onClose: () => void
  patient: {
    mrn: string
    firstName: string
    lastName: string
    title: string | null
    dob: Date
    sex: string
    weight: number | null
    height: number | null
    allergies: string | null
  }
}

type CarePlanItem = {
  id: string
  title: string
  category: string
  description: string
  frequency: string
  done: boolean
}

type SystemSection = {
  key: string
  label: string
  expanded: boolean
  content: string
}

function calculateAge(dob: Date): string {
  const now = new Date()
  let years = now.getFullYear() - dob.getFullYear()
  const months = now.getMonth() - dob.getMonth()
  if (months < 0) years--
  return `${years}y`
}

function calculateBMI(weight: number | null, height: number | null): string | null {
  if (!weight || !height) return null
  const heightM = height / 100
  return (weight / (heightM * heightM)).toFixed(1)
}

export default function CarePlanModal({ isOpen, patient, onClose }: CarePlanModalProps) {
  const [systems, setSystems] = useState<SystemSection[]>([
    { key: 'cardiovascular', label: 'Cardiovascular', expanded: false, content: '' },
    { key: 'respiratory', label: 'Respiratory', expanded: false, content: '' },
    { key: 'cns', label: 'CNS/PNS', expanded: false, content: '' },
    { key: 'endocrine', label: 'Endocrine', expanded: false, content: '' },
    { key: 'git', label: 'GIT', expanded: false, content: '' },
  ])

  const [carePlanItems, setCarePlanItems] = useState<CarePlanItem[]>([])
  const [showNewForm, setShowNewForm] = useState(false)
  const [newItem, setNewItem] = useState({ title: '', category: '', description: '', frequency: '' })

  // Risk scores (mock)
  const [fallsRisk] = useState(2)
  const [pressureRisk] = useState(1)

  if (!isOpen) return null

  const age = calculateAge(new Date(patient.dob))
  const bmi = calculateBMI(patient.weight, patient.height)

  const toggleSystem = (key: string) => {
    setSystems(prev => prev.map(s => s.key === key ? { ...s, expanded: !s.expanded } : s))
  }

  const updateSystemContent = (key: string, content: string) => {
    setSystems(prev => prev.map(s => s.key === key ? { ...s, content } : s))
  }

  const addCarePlanItem = () => {
    if (!newItem.title) return
    setCarePlanItems(prev => [...prev, {
      id: 'cp_' + Date.now(),
      ...newItem,
      done: false,
    }])
    setNewItem({ title: '', category: '', description: '', frequency: '' })
    setShowNewForm(false)
  }

  const toggleDone = (id: string) => {
    setCarePlanItems(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item))
  }

  const markAllDone = () => {
    setCarePlanItems(prev => prev.map(item => ({ ...item, done: true })))
  }

  const removeItem = (id: string) => {
    setCarePlanItems(prev => prev.filter(item => item.id !== id))
  }

  const getRiskBadge = (score: number) => {
    if (score <= 1) return { label: 'Low', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' }
    if (score <= 3) return { label: 'Medium', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' }
    return { label: 'High', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' }
  }

  const fallsBadge = getRiskBadge(fallsRisk)
  const pressureBadge = getRiskBadge(pressureRisk)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gray-700 dark:bg-slate-700 text-white rounded-t-xl">
          <div>
            <h2 className="text-lg font-semibold">Comprehensive Care Plan</h2>
            <div className="text-xs text-gray-300 mt-1 flex flex-wrap gap-3">
              <span>MRN: {patient.mrn}</span>
              <span>{patient.lastName} {patient.firstName} {patient.title || ''}</span>
              <span>DOB: {new Date(patient.dob).toLocaleDateString('en-AU')}</span>
              <span>Age: {age}</span>
              <span>Sex: {patient.sex}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-600 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left Column: Patient Clinical Systems Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Patient Clinical Systems Details</h3>
              <div className="space-y-2">
                {systems.map(system => (
                  <div key={system.key} className="border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSystem(system.key)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-slate-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                    >
                      <span className="font-medium">{system.label}</span>
                      <span className="text-xs text-gray-400">{system.expanded ? '-' : '+'}</span>
                    </button>
                    {system.expanded && (
                      <div className="p-3">
                        <textarea
                          value={system.content}
                          onChange={(e) => updateSystemContent(system.key, e.target.value)}
                          className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm dark:text-gray-200"
                          rows={3}
                          placeholder={`Enter ${system.label} details...`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* BMI */}
              <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">BMI</h4>
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                  {bmi || 'N/A'}
                </div>
                {patient.weight && patient.height && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {patient.weight}kg / {patient.height}cm
                  </div>
                )}
              </div>

              {/* Allergies */}
              <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Allergies</h4>
                <div className={`text-sm font-medium ${
                  patient.allergies && !patient.allergies.includes('NIL')
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {patient.allergies || 'No Allergies (NIL)'}
                </div>
              </div>

              {/* Risk Calculators */}
              <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Risk Calculators</h4>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Falls Risk:</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${fallsBadge.color}`}>
                      {fallsBadge.label} ({fallsRisk})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Pressure Risk:</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${pressureBadge.color}`}>
                      {pressureBadge.label} ({pressureRisk})
                    </span>
                  </div>
                </div>
              </div>

              {/* Medications */}
              <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Medications</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No medications recorded</p>
              </div>
            </div>
          </div>

          {/* Comprehensive Care Plan Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Comprehensive Care Plan</h3>
              <div className="flex gap-2">
                <button onClick={markAllDone} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Mark all as Done
                </button>
                <button
                  onClick={() => setShowNewForm(!showNewForm)}
                  className="px-3 py-1.5 bg-cyan-600 text-white rounded-lg text-xs hover:bg-cyan-700 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> New
                </button>
              </div>
            </div>

            {/* New Item Form */}
            {showNewForm && (
              <div className="mb-4 p-4 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-700 rounded-lg">
                <h4 className="text-xs font-semibold text-cyan-700 dark:text-cyan-300 mb-3">Create a New Care Plan</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Care Plan Title</label>
                    <input type="text" value={newItem.title} onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm dark:text-gray-200" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Category</label>
                    <select value={newItem.category} onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm dark:text-gray-200">
                      <option value="">Select...</option>
                      <option>Pre-operative</option>
                      <option>Intra-operative</option>
                      <option>Post-operative</option>
                      <option>Nursing</option>
                      <option>Pain Management</option>
                      <option>Wound Care</option>
                      <option>Mobility</option>
                      <option>Nutrition</option>
                      <option>Discharge Planning</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Item Description</label>
                    <input type="text" value={newItem.description} onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm dark:text-gray-200" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Frequency</label>
                    <select value={newItem.frequency} onChange={(e) => setNewItem(prev => ({ ...prev, frequency: e.target.value }))} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm dark:text-gray-200">
                      <option value="">Select...</option>
                      <option>Once</option>
                      <option>Hourly</option>
                      <option>2 Hourly</option>
                      <option>4 Hourly</option>
                      <option>6 Hourly</option>
                      <option>8 Hourly</option>
                      <option>12 Hourly</option>
                      <option>Daily</option>
                      <option>As Required (PRN)</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowNewForm(false)} className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-xs">Cancel</button>
                  <button onClick={addCarePlanItem} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700">Add Item</button>
                </div>
              </div>
            )}

            {/* Care Plan Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
                    <th className="px-3 py-2 text-left text-xs font-medium w-8"></th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Care Plan Title</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Category</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Item Description</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Frequency</th>
                    <th className="px-3 py-2 text-center text-xs font-medium">Done</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {carePlanItems.map(item => (
                    <tr key={item.id} className={`border-b border-gray-100 dark:border-slate-600 ${item.done ? 'opacity-60' : ''}`}>
                      <td className="px-3 py-2"></td>
                      <td className="px-3 py-2 text-gray-800 dark:text-gray-200 font-medium">{item.title}</td>
                      <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{item.category}</td>
                      <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{item.description}</td>
                      <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{item.frequency}</td>
                      <td className="px-3 py-2 text-center">
                        <input type="checkbox" checked={item.done} onChange={() => toggleDone(item.id)} className="rounded" />
                      </td>
                      <td className="px-3 py-2">
                        <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {carePlanItems.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-3 py-6 text-center text-gray-400 dark:text-gray-500 text-xs">No care plan items. Click "+ New" to add items.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 dark:border-slate-700">
          <button onClick={() => window.print()} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-sm flex items-center gap-2">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
