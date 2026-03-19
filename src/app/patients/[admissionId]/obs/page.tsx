'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Settings } from 'lucide-react'
import { getObservationsForAdmission, findUser } from '@/lib/sample-data'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  Legend,
} from 'recharts'

export default function ObservationsPage() {
  const params = useParams()
  const router = useRouter()
  const admissionId = params.admissionId as string
  const observations = getObservationsForAdmission(admissionId)
  const [showForm, setShowForm] = useState(false)

  const chartData = observations.map(obs => ({
    time: new Date(obs.time).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
    rr: obs.rr,
    spo2: obs.spo2,
    hr: obs.hr,
    bpSystolic: obs.bpSystolic,
    bpDiastolic: obs.bpDiastolic,
    temp: obs.temp,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">OBSERVATIONS</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
              <Settings className="w-4 h-4" /> Define Normal OBS Range
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Respiratory Rate */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Respiratory Rate (breaths/min)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <ReferenceArea y1={25} y2={40} fill="#fecaca" fillOpacity={0.3} />
                  <ReferenceArea y1={20} y2={25} fill="#fed7aa" fillOpacity={0.3} />
                  <ReferenceArea y1={10} y2={20} fill="#bbf7d0" fillOpacity={0.3} />
                  <ReferenceArea y1={5} y2={10} fill="#fed7aa" fillOpacity={0.3} />
                  <ReferenceArea y1={0} y2={5} fill="#fecaca" fillOpacity={0.3} />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 40]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rr" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="RR" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Heart Rate */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Heart Rate (bpm)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <ReferenceArea y1={100} y2={140} fill="#fecaca" fillOpacity={0.3} />
                  <ReferenceArea y1={60} y2={100} fill="#bbf7d0" fillOpacity={0.3} />
                  <ReferenceArea y1={40} y2={60} fill="#fed7aa" fillOpacity={0.3} />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis domain={[40, 140]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="hr" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="HR" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Blood Pressure */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Blood Pressure (mmHg)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <ReferenceArea y1={180} y2={240} fill="#fecaca" fillOpacity={0.3} />
                  <ReferenceArea y1={140} y2={180} fill="#fed7aa" fillOpacity={0.3} />
                  <ReferenceArea y1={90} y2={140} fill="#bbf7d0" fillOpacity={0.3} />
                  <ReferenceArea y1={60} y2={90} fill="#bbf7d0" fillOpacity={0.3} />
                  <ReferenceArea y1={30} y2={60} fill="#fed7aa" fillOpacity={0.3} />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis domain={[30, 240]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="bpSystolic" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: '#22c55e' }} name="Systolic" />
                  <Line type="monotone" dataKey="bpDiastolic" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3, fill: '#8b5cf6' }} name="Diastolic" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* SpO2 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">SpO2 (%)</h3>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <ReferenceArea y1={95} y2={100} fill="#bbf7d0" fillOpacity={0.3} />
                  <ReferenceArea y1={90} y2={95} fill="#fed7aa" fillOpacity={0.3} />
                  <ReferenceArea y1={85} y2={90} fill="#fecaca" fillOpacity={0.3} />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis domain={[85, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="spo2" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} name="SpO2" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Temperature */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Temperature (°C)</h3>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <ReferenceArea y1={37.5} y2={39} fill="#fecaca" fillOpacity={0.3} />
                  <ReferenceArea y1={36} y2={37.5} fill="#bbf7d0" fillOpacity={0.3} />
                  <ReferenceArea y1={35} y2={36} fill="#fed7aa" fillOpacity={0.3} />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis domain={[35, 39]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Temp" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* New Observation Form */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">New Observation</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Date</label>
                <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Time</label>
                <input type="time" defaultValue={new Date().toTimeString().slice(0,5)} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">RR</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="breaths/min" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Resp Distress</label>
                <select className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="">Select...</option>
                  <option>None</option>
                  <option>Mild</option>
                  <option>Moderate</option>
                  <option>Severe</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">SpO2</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="%" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">O2 L/min</label>
                <input type="number" step="0.5" className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Heart Rate</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="bpm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">BP Systolic</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">BP Diastolic</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Temperature</label>
                <input type="number" step="0.1" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="°C" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Pain Score (0-10)</label>
                <input type="number" min="0" max="10" className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Comments</label>
                <textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={3} />
              </div>
              <button className="w-full py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 font-medium">
                Save Observation
              </button>
            </div>

            <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 pt-4">Wound Assessment</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Site</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Ooze</label>
                <select className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="">Select...</option>
                  <option>None</option>
                  <option>Minimal</option>
                  <option>Moderate</option>
                  <option>Heavy</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Color</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Observations Table */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Entered Observations</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-600">
                  <th className="px-3 py-2 text-left">Time</th>
                  <th className="px-3 py-2 text-center">RR</th>
                  <th className="px-3 py-2 text-center">SpO2</th>
                  <th className="px-3 py-2 text-center">HR</th>
                  <th className="px-3 py-2 text-center">BP</th>
                  <th className="px-3 py-2 text-center">Temp</th>
                  <th className="px-3 py-2 text-center">By</th>
                </tr>
              </thead>
              <tbody>
                {observations.map(obs => {
                  const user = findUser(obs.userId)
                  return (
                    <tr key={obs.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-700">{new Date(obs.time).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="px-3 py-2 text-center">{obs.rr}</td>
                      <td className="px-3 py-2 text-center">{obs.spo2}</td>
                      <td className="px-3 py-2 text-center">{obs.hr}</td>
                      <td className="px-3 py-2 text-center">{obs.bpSystolic}/{obs.bpDiastolic}</td>
                      <td className="px-3 py-2 text-center">{obs.temp}</td>
                      <td className="px-3 py-2 text-center text-gray-500">{user?.initials}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
