'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, FileText, Check, Clock, AlertTriangle, Upload, Plus } from 'lucide-react'

type ConsentRecord = {
  id: string
  type: string
  status: 'pending' | 'signed' | 'declined'
  signedBy: string
  signedDate: string | null
  witnessedBy: string
}

export default function ConsentPage() {
  const params = useParams()
  const router = useRouter()
  const [consents, setConsents] = useState<ConsentRecord[]>([
    { id: '1', type: 'Informed Consent for Procedure', status: 'signed', signedBy: 'Patient', signedDate: '2026-03-17', witnessedBy: 'KLE' },
    { id: '2', type: 'Informed Financial Consent', status: 'signed', signedBy: 'Patient', signedDate: '2026-03-17', witnessedBy: 'KLE' },
    { id: '3', type: 'Anaesthesia Consent', status: 'pending', signedBy: '', signedDate: null, witnessedBy: '' },
    { id: '4', type: 'Blood Product Consent', status: 'pending', signedBy: '', signedDate: null, witnessedBy: '' },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed': return <Check className="w-4 h-4 text-green-600" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />
      case 'declined': return <AlertTriangle className="w-4 h-4 text-red-600" />
      default: return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'signed': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      case 'declined': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      default: return ''
    }
  }

  const markAsSigned = (id: string) => {
    setConsents(prev => prev.map(c => c.id === id ? { ...c, status: 'signed' as const, signedDate: new Date().toISOString().split('T')[0], signedBy: 'Patient' } : c))
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 dark:bg-slate-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">CONSENT MANAGEMENT</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Consent Form
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-700 dark:bg-slate-600 text-white text-sm">
              <th className="px-4 py-3 text-left font-medium">CONSENT TYPE</th>
              <th className="px-4 py-3 text-left font-medium">STATUS</th>
              <th className="px-4 py-3 text-left font-medium">SIGNED BY</th>
              <th className="px-4 py-3 text-left font-medium">DATE</th>
              <th className="px-4 py-3 text-left font-medium">WITNESSED BY</th>
              <th className="px-4 py-3 text-right font-medium">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {consents.map(consent => (
              <tr key={consent.id} className="border-b border-gray-100 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700">
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  {consent.type}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(consent.status)}`}>
                    {getStatusIcon(consent.status)}
                    {consent.status.charAt(0).toUpperCase() + consent.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{consent.signedBy || '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{consent.signedDate || '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{consent.witnessedBy || '—'}</td>
                <td className="px-4 py-3 text-right">
                  {consent.status === 'pending' && (
                    <button onClick={() => markAsSigned(consent.id)} className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">
                      Mark Signed
                    </button>
                  )}
                  {consent.status === 'signed' && (
                    <button className="px-3 py-1 bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300 rounded text-xs">
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
