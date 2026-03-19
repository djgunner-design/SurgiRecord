'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Camera, Upload, Trash2, ZoomIn, Image as ImageIcon, HardDrive } from 'lucide-react'
import { addPhoto, getPhotos, deletePhoto as deletePhotoFromStore, getStorageUsage, type StoredPhoto } from '@/lib/store'

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

function compressImage(dataUrl: string, maxWidth: number, quality: number): Promise<{ dataUrl: string; size: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      let { width, height } = img
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      const compressed = canvas.toDataURL('image/jpeg', quality)
      const size = Math.round((compressed.length * 3) / 4) // approximate byte size from base64
      resolve({ dataUrl: compressed, size })
    }
    img.src = dataUrl
  })
}

export default function PhotosPage() {
  const params = useParams()
  const router = useRouter()
  const admissionId = params.admissionId as string
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [photos, setPhotos] = useState<StoredPhoto[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<StoredPhoto | null>(null)
  const [category, setCategory] = useState('implant-scan')
  const [storageUsage, setStorageUsage] = useState({ photos: 0, documents: 0, totalMB: 0 })
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const refreshStorage = useCallback(() => {
    setStorageUsage(getStorageUsage())
  }, [])

  useEffect(() => {
    setPhotos(getPhotos(admissionId))
    refreshStorage()
  }, [admissionId, refreshStorage])

  const categoryMap: Record<string, string> = {
    'implant-scan': 'Implant Scan',
    'implant-sticker': 'Implant Sticker',
    'pre-op': 'Pre-Op Photo',
    'post-op': 'Post-Op Photo',
    'consent-form': 'Consent Form',
    'pathology': 'Pathology',
    'other': 'Other',
  }

  const categories = Object.entries(categoryMap)

  const processAndSavePhoto = async (file: File, label: string) => {
    setIsUploading(true)
    setError(null)
    try {
      const rawDataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(file)
      })

      let finalDataUrl = rawDataUrl
      let fileSize = file.size

      // Compress images (not PDFs)
      if (file.type.startsWith('image/')) {
        const compressed = await compressImage(rawDataUrl, 1200, 0.7)
        finalDataUrl = compressed.dataUrl
        fileSize = compressed.size
      }

      const newPhoto = addPhoto({
        admissionId,
        dataUrl: finalDataUrl,
        label,
        category,
        timestamp: new Date().toISOString(),
        uploadedBy: 'current-user',
        fileName: file.name,
        fileSize,
        mimeType: file.type,
      })
      setPhotos(getPhotos(admissionId))
      refreshStorage()
      return newPhoto
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save photo. Storage may be full.')
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    for (const file of Array.from(files)) {
      await processAndSavePhoto(file, file.name)
    }
    e.target.value = ''
  }

  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const file = files[0]
    const label = `${categoryMap[category] || category} - ${new Date().toLocaleTimeString()}`
    await processAndSavePhoto(file, label)
    e.target.value = ''
  }

  const handleDeletePhoto = (id: string) => {
    deletePhotoFromStore(id)
    setPhotos(getPhotos(admissionId))
    if (selectedPhoto?.id === id) setSelectedPhoto(null)
    refreshStorage()
  }

  const usagePercent = Math.min((storageUsage.totalMB / 5) * 100, 100)
  const usageColor = usagePercent > 80 ? 'bg-red-500' : usagePercent > 60 ? 'bg-yellow-500' : 'bg-green-500'

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
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <HardDrive className="w-3.5 h-3.5" />
            <div className="w-24 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
              <div className={`${usageColor} h-2 rounded-full transition-all`} style={{ width: `${usagePercent}%` }} />
            </div>
            <span>{storageUsage.totalMB.toFixed(2)} / 5 MB</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
            {error}
            <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
          </div>
        )}

        {/* Upload Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-gray-200 rounded-lg text-sm">
              {categories.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={() => cameraInputRef.current?.click()} disabled={isUploading} className="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 disabled:opacity-50 flex items-center justify-center gap-2">
              <Camera className="w-4 h-4" /> {isUploading ? 'Processing...' : 'Take Photo'}
            </button>
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleCameraCapture} className="hidden" />
          </div>
          <div className="flex items-end">
            <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" /> {isUploading ? 'Processing...' : 'Upload File'}
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
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Photos are saved locally and persist across sessions</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className="relative group border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden bg-white dark:bg-slate-750">
                <img src={photo.dataUrl} alt={photo.label} className="w-full h-40 object-cover cursor-pointer" onClick={() => setSelectedPhoto(photo)} />
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{photo.label}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">{categoryMap[photo.category] || photo.category}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">{new Date(photo.timestamp).toLocaleString('en-AU')}</div>
                  {photo.fileSize && (
                    <div className="text-xs text-gray-400 dark:text-gray-500">{formatFileSize(photo.fileSize)}</div>
                  )}
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setSelectedPhoto(photo)} className="p-1.5 bg-white dark:bg-slate-700 rounded-full shadow">
                    <ZoomIn className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                  </button>
                  <button onClick={() => handleDeletePhoto(photo.id)} className="p-1.5 bg-white dark:bg-slate-700 rounded-full shadow">
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
                <div className="text-xs text-gray-300">
                  {categoryMap[selectedPhoto.category] || selectedPhoto.category} - {new Date(selectedPhoto.timestamp).toLocaleString('en-AU')}
                  {selectedPhoto.fileSize && ` - ${formatFileSize(selectedPhoto.fileSize)}`}
                </div>
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
