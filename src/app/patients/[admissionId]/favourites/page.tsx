'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Star, Plus, Trash2, Edit, Save, Copy } from 'lucide-react'
import { getUserFavourites, addUserFavourite, removeUserFavourite } from '@/lib/store'
import { findAdmission } from '@/lib/sample-data'

export default function FavouritesPage() {
  const params = useParams()
  const router = useRouter()
  const admissionId = params.admissionId as string
  const admission = findAdmission(admissionId)
  const [userId, setUserId] = useState('')
  const [favourites, setFavourites] = useState<Array<{ id: string; name: string; operationNotes: string; defaultLocation: string }>>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [newLocation, setNewLocation] = useState('Theatre 1')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const uid = document.cookie.split('; ').find(c => c.startsWith('userId='))?.split('=')[1] || '1'
    setUserId(uid)
    setFavourites(getUserFavourites(uid))
  }, [refreshKey])

  const handleAdd = () => {
    if (!newName.trim() || !newNotes.trim()) return
    addUserFavourite(userId, { name: newName, operationNotes: newNotes, defaultLocation: newLocation })
    setNewName('')
    setNewNotes('')
    setNewLocation('Theatre 1')
    setShowAddForm(false)
    setRefreshKey(k => k + 1)
  }

  const handleDelete = (id: string) => {
    removeUserFavourite(userId, id)
    setRefreshKey(k => k + 1)
  }

  const handleSaveCurrentAsTemplate = () => {
    if (!admission) return
    setNewName(admission.operationNotes?.split(' ').slice(0, 3).join(' ') || 'New Template')
    setNewNotes(admission.operationNotes || '')
    setNewLocation(admission.location || 'Theatre 1')
    setShowAddForm(true)
  }

  // Some default templates for common operations
  const defaultTemplates = [
    { name: 'Right Cataract - PanOptix Pro', notes: 'RIGHT CATARACT Alcon PanOptix Pro PXYAT0', location: 'Theatre 2' },
    { name: 'Right Cataract - Clareon Toric', notes: 'RIGHT CATARACT Alcon Clareon Toric CNA0T2', location: 'Theatre 2' },
    { name: 'Left Cataract - PanOptix Pro', notes: 'LEFT CATARACT Alcon PanOptix Pro PXYAT0', location: 'Theatre 2' },
    { name: 'FOCUS - Right Cataract', notes: 'FOCUS - RIGHT CATARACT Alcon PanOptix Pro PXYAT0', location: 'Theatre 2' },
    { name: 'FOCUS - Left Cataract', notes: 'FOCUS - LEFT CATARACT Alcon PanOptix Pro PXYAT0', location: 'Theatre 2' },
    { name: 'Right Cataract + HYDRUS', notes: 'RIGHT CATARACT + HYDRUS J&J Puresee Toric DET150', location: 'Theatre 2' },
    { name: 'Upper Lid Blepharoplasty', notes: 'BILATERAL UPPER LID BLEPHAROPLASTY', location: 'Theatre 1' },
    { name: 'Lower Lid Ectropion Repair', notes: 'LOWER LID ECTROPIAN REPAIR', location: 'Theatre 1' },
    { name: 'Pterygium Excision', notes: 'PTERYGIUM EXCISION + AUTOCONJUNCTIVAL TRANSPLANT', location: 'Theatre 1' },
    { name: 'Abdominoplasty + Breast Aug', notes: 'ABDOMINOPLASTY AND MASTOPEXY WITH BILATERAL BREAST AUGMENTATION #COSMETIC', location: 'Theatre 1' },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 dark:bg-slate-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          OPERATION FAVOURITES
        </h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex gap-2">
            {admission && (
              <button onClick={handleSaveCurrentAsTemplate} className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 flex items-center gap-2">
                <Copy className="w-4 h-4" /> Save Current Op as Template
              </button>
            )}
            <button onClick={() => setShowAddForm(!showAddForm)} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Favourite
            </button>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="mb-6 p-4 border border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Add New Favourite</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Template Name</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g., Right Cataract - PanOptix" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Default Location</label>
                <select value={newLocation} onChange={(e) => setNewLocation(e.target.value)} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
                  <option>Theatre 1</option>
                  <option>Theatre 2</option>
                  <option>Theatre 3</option>
                  <option>Clinic</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Operation Notes Template</label>
              <textarea value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="Operation description..." className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm" rows={3} />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAddForm(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-sm">Cancel</button>
              <button onClick={handleAdd} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-2">
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        )}

        {/* User's Favourites */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Your Favourites</h3>
          {favourites.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic p-4 text-center border-2 border-dashed border-gray-200 dark:border-slate-600 rounded-lg">
              No favourites saved yet. Add one above or use a template below.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {favourites.map(fav => (
                <div key={fav.id} className="border border-gray-200 dark:border-slate-600 rounded-lg p-4 hover:border-yellow-400 dark:hover:border-yellow-600 transition-colors group">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{fav.name}</span>
                    </div>
                    <button onClick={() => handleDelete(fav.id)} className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{fav.operationNotes}</p>
                  <div className="text-xs text-gray-400 dark:text-gray-500">Location: {fav.defaultLocation}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Default Templates */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Common Templates</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Click to add to your favourites</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {defaultTemplates.map((tmpl, i) => (
              <button
                key={i}
                onClick={() => {
                  addUserFavourite(userId, { name: tmpl.name, operationNotes: tmpl.notes, defaultLocation: tmpl.location })
                  setRefreshKey(k => k + 1)
                }}
                className="text-left p-3 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:border-yellow-300 dark:hover:border-yellow-700 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Plus className="w-3 h-3 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tmpl.name}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 pl-5">{tmpl.notes}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
