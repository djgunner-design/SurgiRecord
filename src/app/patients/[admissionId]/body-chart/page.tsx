'use client'

import { useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, X, Trash2 } from 'lucide-react'

type Marker = {
  id: string
  x: number
  y: number
  label: string
  view: 'front' | 'back'
}

export default function BodyChartPage() {
  const params = useParams()
  const router = useRouter()
  const admissionId = params.admissionId as string

  const [chartType, setChartType] = useState('General')
  const [markers, setMarkers] = useState<Marker[]>([])
  const [editingMarker, setEditingMarker] = useState<string | null>(null)
  const [tempLabel, setTempLabel] = useState('')
  const frontSvgRef = useRef<SVGSVGElement>(null)
  const backSvgRef = useRef<SVGSVGElement>(null)

  const chartTypeColors: Record<string, string> = {
    'General': '#06b6d4',
    'Surgical Site': '#ef4444',
    'Wound Assessment': '#f59e0b',
    'Pressure Area': '#8b5cf6',
  }

  const markerColor = chartTypeColors[chartType] || '#06b6d4'

  const handleSvgClick = useCallback((e: React.MouseEvent<SVGSVGElement>, view: 'front' | 'back') => {
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 200
    const y = ((e.clientY - rect.top) / rect.height) * 400

    const id = 'mk_' + Date.now()
    setMarkers(prev => [...prev, { id, x, y, label: '', view }])
    setEditingMarker(id)
    setTempLabel('')
  }, [])

  const saveMarkerLabel = () => {
    if (editingMarker) {
      setMarkers(prev => prev.map(m => m.id === editingMarker ? { ...m, label: tempLabel } : m))
      setEditingMarker(null)
      setTempLabel('')
    }
  }

  const deleteMarker = (id: string) => {
    setMarkers(prev => prev.filter(m => m.id !== id))
    if (editingMarker === id) setEditingMarker(null)
  }

  const bodyOutlineFront = `
    M 100,30
    C 85,30 80,35 80,45 C 80,55 85,60 100,60 C 115,60 120,55 120,45 C 120,35 115,30 100,30 Z
    M 90,60 L 85,65 L 60,110 L 55,120 L 60,122 L 75,85 L 85,75
    M 110,60 L 115,65 L 140,110 L 145,120 L 140,122 L 125,85 L 115,75
    M 85,65 L 80,70 L 78,150 L 75,200 L 80,200 L 85,160 L 90,150
    M 115,65 L 120,70 L 122,150 L 125,200 L 120,200 L 115,160 L 110,150
    M 85,65 C 85,70 85,75 85,80 L 85,140 L 90,150 L 100,155 L 110,150 L 115,140 L 115,80 C 115,75 115,70 115,65
    M 88,200 L 86,250 L 84,290 L 82,330 L 78,350 L 76,360 L 80,365 L 90,355 L 92,340 L 93,330
    M 112,200 L 114,250 L 116,290 L 118,330 L 122,350 L 124,360 L 120,365 L 110,355 L 108,340 L 107,330
  `

  const bodyOutlineBack = `
    M 100,30
    C 85,30 80,35 80,45 C 80,55 85,60 100,60 C 115,60 120,55 120,45 C 120,35 115,30 100,30 Z
    M 90,60 L 85,65 L 60,110 L 55,120 L 60,122 L 75,85 L 85,75
    M 110,60 L 115,65 L 140,110 L 145,120 L 140,122 L 125,85 L 115,75
    M 85,65 L 80,70 L 78,150 L 75,200 L 80,200 L 85,160 L 90,150
    M 115,65 L 120,70 L 122,150 L 125,200 L 120,200 L 115,160 L 110,150
    M 85,65 C 85,70 85,75 85,80 L 85,140 L 90,150 L 100,155 L 110,150 L 115,140 L 115,80 C 115,75 115,70 115,65
    M 88,200 L 86,250 L 84,290 L 82,330 L 78,350 L 76,360 L 80,365 L 90,355 L 92,340 L 93,330
    M 112,200 L 114,250 L 116,290 L 118,330 L 122,350 L 124,360 L 120,365 L 110,355 L 108,340 L 107,330
  `

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-700 dark:bg-slate-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">BODY CHART</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        {/* Action buttons */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-2">
              <Save className="w-4 h-4" /> Save
            </button>
            <button onClick={() => router.back()} className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 flex items-center gap-2">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>

        {/* Chart Type Selector */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">Chart Type</label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm dark:text-gray-200"
          >
            <option>General</option>
            <option>Surgical Site</option>
            <option>Wound Assessment</option>
            <option>Pressure Area</option>
          </select>
        </div>

        {/* Body Diagrams */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Front View */}
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Front View</h3>
            <div className="inline-block border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700/50 p-2">
              <svg
                ref={frontSvgRef}
                viewBox="0 0 200 400"
                className="w-48 h-96 cursor-crosshair"
                onClick={(e) => handleSvgClick(e, 'front')}
              >
                <path
                  d={bodyOutlineFront}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-gray-400 dark:text-gray-300"
                />
                {/* Midline */}
                <line x1="100" y1="60" x2="100" y2="200" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" className="text-gray-300 dark:text-gray-500" />
                {/* Front markers */}
                {markers.filter(m => m.view === 'front').map(m => (
                  <g key={m.id}>
                    <circle cx={m.x} cy={m.y} r="5" fill={markerColor} opacity="0.8" stroke="white" strokeWidth="1" />
                    {m.label && (
                      <text x={m.x + 8} y={m.y + 4} fontSize="8" fill={markerColor} fontWeight="bold">{m.label}</text>
                    )}
                  </g>
                ))}
              </svg>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Click to place a marker</p>
          </div>

          {/* Back View */}
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Back View</h3>
            <div className="inline-block border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700/50 p-2">
              <svg
                ref={backSvgRef}
                viewBox="0 0 200 400"
                className="w-48 h-96 cursor-crosshair"
                onClick={(e) => handleSvgClick(e, 'back')}
              >
                <path
                  d={bodyOutlineBack}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-gray-400 dark:text-gray-300"
                />
                {/* Spine line */}
                <line x1="100" y1="60" x2="100" y2="200" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" className="text-gray-300 dark:text-gray-500" />
                {/* Back markers */}
                {markers.filter(m => m.view === 'back').map(m => (
                  <g key={m.id}>
                    <circle cx={m.x} cy={m.y} r="5" fill={markerColor} opacity="0.8" stroke="white" strokeWidth="1" />
                    {m.label && (
                      <text x={m.x + 8} y={m.y + 4} fontSize="8" fill={markerColor} fontWeight="bold">{m.label}</text>
                    )}
                  </g>
                ))}
              </svg>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Click to place a marker</p>
          </div>
        </div>

        {/* Label Input Popup */}
        {editingMarker && (
          <div className="mb-6 p-4 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-700 rounded-lg">
            <label className="block text-xs font-medium text-cyan-700 dark:text-cyan-300 mb-2">Label for new marker:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tempLabel}
                onChange={(e) => setTempLabel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveMarkerLabel()}
                placeholder="Enter marker label..."
                className="flex-1 px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm dark:text-gray-200"
                autoFocus
              />
              <button onClick={saveMarkerLabel} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700">
                Save
              </button>
              <button onClick={() => { deleteMarker(editingMarker); setEditingMarker(null) }} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">
                Remove
              </button>
            </div>
          </div>
        )}

        {/* Markers List */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Placed Markers ({markers.length})</h3>
          {markers.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">No markers placed. Click on the body diagram to add markers.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
                    <th className="px-3 py-2 text-left text-xs font-medium">#</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">View</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Label</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Position</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {markers.map((m, i) => (
                    <tr key={m.id} className="border-b border-gray-100 dark:border-slate-600">
                      <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{i + 1}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          m.view === 'front'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        }`}>
                          {m.view === 'front' ? 'Front' : 'Back'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-800 dark:text-gray-200">{m.label || <span className="text-gray-400 italic">No label</span>}</td>
                      <td className="px-3 py-2 text-gray-500 dark:text-gray-400 text-xs">x:{Math.round(m.x)}, y:{Math.round(m.y)}</td>
                      <td className="px-3 py-2">
                        <button onClick={() => deleteMarker(m.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
