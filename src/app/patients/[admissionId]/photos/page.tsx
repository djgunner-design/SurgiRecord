'use client'

import { useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Camera, Upload, Trash2, ZoomIn, Image as ImageIcon, Plus } from 'lucide-react'

type PhotoRecord = {
  id: string
  dataUrl: string
  label: string
  category: string
  timestamp: string
}

export default function PhotosPage() {
  const params = useParams()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [photos, setPhotos] = useState<PhotoRecord[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoRecord | null>(null)
  const [category, setCategory] = useState('Implant Scan')

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const newPhoto: PhotoRecord = {
          id: 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          dataUrl: event.target?.result as string,
          label: file.name,
          category,
          timestamp: new Date().toISOString(),
        }
        setPhotos(prev => [...prev, newPhoto])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      const newPhoto: PhotoRecord = {
        id: 'photo_' + Date.now(),
        dataUrl: event.target?.result as string,
        label: `${category} - ${new Date().toLocaleTimeString()}`,
        category,
        timestamp: new Date().toISOString(),
      }
      setPhotos(prev => [...prev, newPhoto])
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const deletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id))
    if (selectedPhoto?.id === id) setSelectedPhoto(null)
  }

  const categories = ['Implant Scan', 'Implant Sticker', 'Pre-Op Photo', 'Post-Op Photo', 'Consent Form', 'Pathology', 'Other']

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 dark:bg-slate-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">PHOTOS & SCANS</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* Upload Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm">
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={() => cameraInputRef.current?.click()} className="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center justify-center gap-2">
              <Camera className="w-4 h-4" /> Take Photo
            </button>
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleCameraCapture} className="hidden" />
          </div>
          <div className="flex items-end">
            <button onClick={() => fileInputRef.current?.click()} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" /> Upload File
            </button>
            <input ref={fileInputRef} type="file" accept="image/*,.pdf" multiple onChange={handleFileUpload} className="hidden" />
          </div>
        </div>

        {/* Photo Grid */}
        {photos.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-12 text-center">
            <ImageIcon className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">No photos or scans captured yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Use the buttons above to take a photo or upload a file</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className="relative group border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden">
                <img src={photo.dataUrl} alt={photo.label} className="w-full h-40 object-cover cursor-pointer" onClick={() => setSelectedPhoto(photo)} />
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{photo.label}</div>
                  <div className="text-xs text-gray-400">{photo.category}</div>
                  <div className="text-xs text-gray-400">{new Date(photo.timestamp).toLocaleString('en-AU')}</div>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setSelectedPhoto(photo)} className="p-1.5 bg-white dark:bg-slate-700 rounded-full shadow">
                    <ZoomIn className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                  </button>
                  <button onClick={() => deletePhoto(photo.id)} className="p-1.5 bg-white dark:bg-slate-700 rounded-full shadow">
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
            <div className="max-w-4xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
              <img src={selectedPhoto.dataUrl} alt={selectedPhoto.label} className="max-w-full max-h-[85vh] object-contain rounded-lg" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 rounded-b-lg">
                <div className="text-sm font-medium">{selectedPhoto.label}</div>
                <div className="text-xs text-gray-300">{selectedPhoto.category} - {new Date(selectedPhoto.timestamp).toLocaleString('en-AU')}</div>
              </div>
              <button onClick={() => setSelectedPhoto(null)} className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70">
                <span className="text-xl">&times;</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
