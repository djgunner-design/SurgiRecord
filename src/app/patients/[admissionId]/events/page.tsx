'use client'

import { useParams } from 'next/navigation'
import { Plus, Clock } from 'lucide-react'

export default function EventsPage() {
  const params = useParams()
  const admissionId = params.admissionId as string

  const events = [
    { id: '1', type: 'Status Change', description: 'Status changed to ADMITTED', dateTime: '2026-03-19 06:41', user: 'KLE' },
    { id: '2', type: 'Handover', description: 'Admission handover completed', dateTime: '2026-03-19 06:45', user: 'KLE' },
    { id: '3', type: 'Status Change', description: 'Status changed to IN_THEATRE', dateTime: '2026-03-19 08:01', user: 'MOR' },
    { id: '4', type: 'Procedure', description: 'Procedure started', dateTime: '2026-03-19 08:01', user: 'DS' },
    { id: '5', type: 'Handover', description: 'Procedure handover completed', dateTime: '2026-03-19 11:45', user: 'MOR' },
    { id: '6', type: 'Status Change', description: 'Status changed to RECOVERY_1', dateTime: '2026-03-19 11:30', user: 'GCA' },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 dark:bg-slate-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">EVENTS</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Event Timeline</h3>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Event
          </button>
        </div>

        <div className="space-y-4">
          {events.map((event, i) => (
            <div key={event.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-cyan-600" />
                </div>
                {i < events.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 dark:bg-slate-600 mt-1" />}
              </div>
              <div className="pb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{event.type}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{event.dateTime}</span>
                  <span className="text-xs font-medium text-cyan-600">{event.user}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
