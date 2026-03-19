'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Phone, X, Save } from 'lucide-react'
import { addPostOpCall, getPostOpCalls, updatePostOpCall, type PostOpCall } from '@/lib/store'

export default function PostOpCallsPage() {
  const params = useParams()
  const router = useRouter()
  const admissionId = params.admissionId as string

  const [calls, setCalls] = useState<PostOpCall[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingCall, setEditingCall] = useState<PostOpCall | null>(null)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [editStatus, setEditStatus] = useState<PostOpCall['status']>('Scheduled')
  const [editNotes, setEditNotes] = useState('')

  const loadCalls = useCallback(() => {
    setCalls(getPostOpCalls(admissionId))
  }, [admissionId])

  useEffect(() => {
    loadCalls()
  }, [loadCalls])

  const handleScheduleCall = () => {
    if (!newDate || !newTime) return
    addPostOpCall(admissionId, { date: newDate, time: newTime, notes: newNotes })
    setNewDate('')
    setNewTime('')
    setNewNotes('')
    setShowForm(false)
    loadCalls()
  }

  const handleUpdateCall = () => {
    if (!editingCall) return
    updatePostOpCall(admissionId, editingCall.id, { status: editStatus, notes: editNotes })
    setEditingCall(null)
    loadCalls()
  }

  const openEdit = (call: PostOpCall) => {
    setEditingCall(call)
    setEditStatus(call.status)
    setEditNotes(call.notes)
  }

  const getStatusBadge = (status: PostOpCall['status']) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'Completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'No Answer':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      case 'Cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 dark:bg-slate-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">POST-OP CALLS</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Schedule Call
          </button>
        </div>

        {/* Inline form for scheduling a new call */}
        {showForm && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Schedule New Call</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-500 dark:bg-slate-600 dark:text-white rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Time</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-500 dark:bg-slate-600 dark:text-white rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Notes (optional)</label>
              <textarea
                value={newNotes}
                onChange={e => setNewNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-500 dark:bg-slate-600 dark:text-white rounded-lg text-sm"
                placeholder="Any notes for this call..."
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-slate-500 flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Cancel
              </button>
              <button
                onClick={handleScheduleCall}
                disabled={!newDate || !newTime}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <Save className="w-3 h-3" /> Save
              </button>
            </div>
          </div>
        )}

        {/* Calls table */}
        {calls.length === 0 ? (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">
            <Phone className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No post-op calls scheduled yet.</p>
            <p className="text-xs mt-1">Click &quot;Schedule Call&quot; to add one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700 dark:bg-slate-600 text-white text-sm">
                  <th className="px-4 py-3 text-left font-medium">DATE</th>
                  <th className="px-4 py-3 text-left font-medium">TIME</th>
                  <th className="px-4 py-3 text-left font-medium">STATUS</th>
                  <th className="px-4 py-3 text-left font-medium">NOTES</th>
                  <th className="px-4 py-3 text-right font-medium">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {calls.map(call => (
                  <tr
                    key={call.id}
                    className="border-b border-gray-100 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer"
                    onClick={() => openEdit(call)}
                  >
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{call.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{call.time}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(call.status)}`}>
                        {call.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {call.notes || '---'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          openEdit(call)
                        }}
                        className="px-3 py-1 bg-cyan-600 text-white rounded text-xs hover:bg-cyan-700"
                      >
                        Record Outcome
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit/Record outcome modal */}
        {editingCall && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditingCall(null)}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Record Call Outcome</h3>
                <button onClick={() => setEditingCall(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded">
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Scheduled: {editingCall.date} at {editingCall.time}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value as PostOpCall['status'])}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-500 dark:bg-slate-700 dark:text-white rounded-lg text-sm"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="No Answer">No Answer</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Notes</label>
                <textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-500 dark:bg-slate-700 dark:text-white rounded-lg text-sm"
                  placeholder="Record call details, patient feedback, concerns..."
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setEditingCall(null)}
                  className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-slate-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCall}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-1"
                >
                  <Save className="w-3 h-3" /> Save Outcome
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
