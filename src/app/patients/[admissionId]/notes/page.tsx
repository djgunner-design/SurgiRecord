'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Plus, Edit, Trash2, Clock } from 'lucide-react'
import { getNotesForAdmission, findUser } from '@/lib/sample-data'

export default function NotesPage() {
  const params = useParams()
  const admissionId = params.admissionId as string
  const notes = getNotesForAdmission(admissionId)
  const [newNote, setNewNote] = useState('')

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">CLINICAL NOTES</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Notes List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Notes List</h3>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> New
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700 text-white text-sm">
                <th className="px-4 py-3 text-left font-medium">DATE/TIME</th>
                <th className="px-4 py-3 text-left font-medium">NOTES</th>
                <th className="px-4 py-3 text-left font-medium">USER</th>
                <th className="px-4 py-3 text-right font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {notes.map(note => {
                const user = findUser(note.userId)
                return (
                  <tr key={note.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(note.dateTime).toLocaleString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{note.content}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-medium">{user?.initials}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-cyan-600 rounded transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {notes.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">No notes recorded</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* New Note Form */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Add Note</h3>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            rows={4}
            placeholder="Enter clinical note..."
          />
          <div className="flex justify-end mt-3">
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 font-medium">
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
