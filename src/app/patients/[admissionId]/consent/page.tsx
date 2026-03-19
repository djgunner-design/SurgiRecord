'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, FileText, Check, Clock, AlertTriangle, Plus, Trash2, Eye, X, Upload } from 'lucide-react'
import { findAdmission, findPatient, findUser } from '@/lib/sample-data'
import { addDocument, getDocuments, updateDocument, deleteDocument, type StoredDocument } from '@/lib/store'
import PdfExportButton from '@/components/pdf-export-button'

const CONSENT_TYPES = [
  'Informed Consent for Procedure',
  'Informed Financial Consent',
  'Anaesthesia Consent',
  'Blood Product Consent',
]

const SEEDED_KEY = 'surgirecord_consent_seeded'

export default function ConsentPage() {
  const params = useParams()
  const router = useRouter()
  const admissionId = params.admissionId as string
  const admission = findAdmission(admissionId)
  const patient = admission ? findPatient(admission.patientId) : null
  const surgeon = admission?.surgeonId ? findUser(admission.surgeonId) : null
  const anaesthetist = admission?.anaesthetistId ? findUser(admission.anaesthetistId) : null

  const [documents, setDocuments] = useState<StoredDocument[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [showViewModal, setShowViewModal] = useState<StoredDocument | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  // Add form state
  const [formTitle, setFormTitle] = useState('')
  const [formType, setFormType] = useState('Informed Consent')
  const [formFile, setFormFile] = useState<{ dataUrl: string; fileName: string; fileSize: number } | null>(null)

  const refreshDocuments = useCallback(() => {
    setDocuments(getDocuments(admissionId))
  }, [admissionId])

  useEffect(() => {
    // Seed default consent documents on first load for this admission
    const seededAdmissions: string[] = JSON.parse(localStorage.getItem(SEEDED_KEY) || '[]')
    if (!seededAdmissions.includes(admissionId)) {
      const existing = getDocuments(admissionId)
      if (existing.length === 0) {
        const now = new Date().toISOString()
        const defaults = [
          { title: 'Informed Consent for Procedure', type: 'consent', status: 'signed' as const, signedBy: 'Patient', signedAt: '2026-03-17T10:00:00.000Z', createdBy: 'KLE' },
          { title: 'Informed Financial Consent', type: 'consent', status: 'signed' as const, signedBy: 'Patient', signedAt: '2026-03-17T10:05:00.000Z', createdBy: 'KLE' },
          { title: 'Anaesthesia Consent', type: 'consent', status: 'pending' as const, createdBy: 'KLE' },
          { title: 'Blood Product Consent', type: 'consent', status: 'pending' as const, createdBy: 'KLE' },
        ]
        for (const d of defaults) {
          addDocument({
            admissionId,
            type: d.type,
            title: d.title,
            status: d.status,
            createdAt: now,
            updatedAt: now,
            createdBy: d.createdBy,
            signedBy: d.signedBy,
            signedAt: d.signedAt,
          })
        }
      }
      seededAdmissions.push(admissionId)
      localStorage.setItem(SEEDED_KEY, JSON.stringify(seededAdmissions))
    }
    refreshDocuments()
  }, [admissionId, refreshDocuments])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed': return <Check className="w-4 h-4 text-green-600" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />
      case 'declined': return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'draft': return <FileText className="w-4 h-4 text-gray-400" />
      default: return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'signed': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      case 'declined': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      case 'draft': return 'bg-gray-100 text-gray-700 dark:bg-slate-600 dark:text-gray-300'
      default: return ''
    }
  }

  const markAsSigned = (id: string) => {
    updateDocument(id, {
      status: 'signed',
      signedBy: 'Patient',
      signedAt: new Date().toISOString(),
    })
    refreshDocuments()
  }

  const handleDeleteDocument = (id: string) => {
    deleteDocument(id)
    setShowDeleteConfirm(null)
    refreshDocuments()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setFormFile({
        dataUrl: ev.target?.result as string,
        fileName: file.name,
        fileSize: file.size,
      })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleAddConsent = () => {
    if (!formTitle.trim()) return
    const now = new Date().toISOString()
    addDocument({
      admissionId,
      type: 'consent',
      title: formTitle.trim(),
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      createdBy: 'current-user',
      dataUrl: formFile?.dataUrl,
      fileName: formFile?.fileName,
      fileSize: formFile?.fileSize,
    })
    setFormTitle('')
    setFormType('Informed Consent')
    setFormFile(null)
    setShowAddForm(false)
    refreshDocuments()
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
          <div className="flex items-center gap-2">
            {patient && admission && (
              <PdfExportButton
                type="consent-form"
                patient={{ ...patient, dob: patient.dob }}
                admission={{
                  ...admission,
                  date: admission.date,
                  surgeonName: surgeon?.name ?? null,
                  anaesthetistName: anaesthetist?.name ?? null,
                }}
              />
            )}
            <button onClick={() => setShowAddForm(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Consent Form
            </button>
          </div>
        </div>

        {/* Add Consent Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddForm(false)}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Consent Form</h3>
                <button onClick={() => setShowAddForm(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded">
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Informed Consent for Procedure"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm"
                  >
                    {CONSENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload File (PDF or Image)</label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer">
                      <div className="px-4 py-3 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg text-center hover:border-cyan-500 dark:hover:border-cyan-400 transition-colors">
                        {formFile ? (
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">{formFile.fileName}</span>
                            <span className="text-gray-400 ml-2">({(formFile.fileSize / 1024).toFixed(1)} KB)</span>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 dark:text-gray-500 flex items-center justify-center gap-2">
                            <Upload className="w-4 h-4" /> Click to upload (optional)
                          </div>
                        )}
                      </div>
                      <input type="file" accept="image/*,.pdf" onChange={handleFileSelect} className="hidden" />
                    </label>
                    {formFile && (
                      <button onClick={() => setFormFile(null)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-slate-700">
                    Cancel
                  </button>
                  <button
                    onClick={handleAddConsent}
                    disabled={!formTitle.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Consent Form
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Document Modal */}
        {showViewModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowViewModal(null)}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{showViewModal.title}</h3>
                <button onClick={() => setShowViewModal(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded">
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              <div className="p-4">
                {showViewModal.dataUrl ? (
                  showViewModal.fileName?.endsWith('.pdf') || showViewModal.dataUrl.startsWith('data:application/pdf') ? (
                    <div className="text-center py-8">
                      <FileText className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 mb-4">PDF document uploaded</p>
                      <a href={showViewModal.dataUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700">
                        Open PDF in New Tab
                      </a>
                    </div>
                  ) : (
                    <img src={showViewModal.dataUrl} alt={showViewModal.title} className="max-w-full mx-auto rounded-lg" />
                  )
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No file attached to this consent form</p>
                    <div className="mt-4 text-sm text-gray-400 dark:text-gray-500 space-y-1">
                      <p>Status: <span className="font-medium capitalize">{showViewModal.status}</span></p>
                      {showViewModal.signedBy && <p>Signed by: {showViewModal.signedBy}</p>}
                      {showViewModal.signedAt && <p>Signed: {new Date(showViewModal.signedAt).toLocaleString('en-AU')}</p>}
                      <p>Created: {new Date(showViewModal.createdAt).toLocaleString('en-AU')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(null)}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Consent Form</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Are you sure you want to delete this consent form? This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-slate-700">
                  Cancel
                </button>
                <button onClick={() => handleDeleteDocument(showDeleteConfirm)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <table className="w-full">
          <thead>
            <tr className="bg-gray-700 dark:bg-slate-600 text-white text-sm">
              <th className="px-4 py-3 text-left font-medium">CONSENT TYPE</th>
              <th className="px-4 py-3 text-left font-medium">STATUS</th>
              <th className="px-4 py-3 text-left font-medium">SIGNED BY</th>
              <th className="px-4 py-3 text-left font-medium">DATE</th>
              <th className="px-4 py-3 text-left font-medium">CREATED BY</th>
              <th className="px-4 py-3 text-right font-medium">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc.id} className="border-b border-gray-100 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700">
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <span className="truncate">{doc.title}</span>
                  {doc.fileName && <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">({doc.fileName})</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(doc.status)}`}>
                    {getStatusIcon(doc.status)}
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{doc.signedBy || '\u2014'}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {doc.signedAt ? new Date(doc.signedAt).toLocaleDateString('en-AU') : '\u2014'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{doc.createdBy}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setShowViewModal(doc)} className="px-3 py-1 bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300 rounded text-xs hover:bg-gray-300 dark:hover:bg-slate-500 flex items-center gap-1">
                      <Eye className="w-3 h-3" /> View
                    </button>
                    {doc.status === 'pending' && (
                      <button onClick={() => markAsSigned(doc.id)} className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">
                        Mark Signed
                      </button>
                    )}
                    <button onClick={() => setShowDeleteConfirm(doc.id)} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-xs hover:bg-red-200 dark:hover:bg-red-900/50 flex items-center gap-1">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  No consent forms yet. Click &quot;Add Consent Form&quot; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
