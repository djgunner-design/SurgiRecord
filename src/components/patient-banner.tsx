'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Printer, FileText, AlertTriangle, Heart, Shield, Pill, Pencil, X, Bug, ClipboardCheck, ClipboardList, RotateCcw } from 'lucide-react'
import ComorbiditiesModal from './comorbidities-modal'
import RiskFactorsModal from './risk-factors-modal'
import CarePlanModal from './care-plan-modal'
import { getRiskScores, getReturnToTheatreCount, incrementReturnToTheatre, getPatientEdits, savePatientEdits, getAdmissionStatus } from '@/lib/store'
import type { PatientEdit } from '@/lib/store'

interface PatientBannerProps {
  admission: {
    id: string
    status: string
    operationNotes: string | null
    procedureStartTime: string | null
    covidStatus: string | null
    lastFood: Date | null
    lastFluid: Date | null
    surgeonId: string | null
    time: string | null
  }
  patient: {
    id?: string
    mrn: string
    firstName: string
    lastName: string
    title: string | null
    dob: Date
    sex: string
    weight: number | null
    height: number | null
    address: string | null
    suburb: string | null
    state: string | null
    postcode: string | null
    atsiStatus: string | null
    allergies: string | null
    comorbidities: string | null
    phone?: string | null
  }
  surgeonName: string | null
}

function getStatusBadge(status: string) {
  const colors: Record<string, string> = {
    PRE_ADMITTED: 'bg-purple-500',
    BOOKED: 'bg-blue-500',
    ARRIVED: 'bg-yellow-500',
    CHECKED_IN: 'bg-orange-500',
    ANAESTHESIA_INDUCTION: 'bg-pink-500',
    OPERATION_STARTED: 'bg-red-500',
    RECOVERY_1: 'bg-green-500',
    WARD: 'bg-emerald-600',
    RECOVERY_2: 'bg-teal-500',
    DISCHARGED: 'bg-gray-500',
    CANCELLED: 'bg-gray-700',
  }
  const labels: Record<string, string> = {
    PRE_ADMITTED: 'Pre Admitted',
    BOOKED: 'Booked',
    ARRIVED: 'Arrived',
    CHECKED_IN: 'Checked-In',
    ANAESTHESIA_INDUCTION: 'Anaesthesia Induction Started',
    OPERATION_STARTED: 'Operation Started',
    RECOVERY_1: 'Recovery Stage 1 Started',
    WARD: 'WARD',
    RECOVERY_2: 'Recovery Stage 2',
    DISCHARGED: 'Discharged',
    CANCELLED: 'Cancelled',
  }
  return {
    color: colors[status] || 'bg-gray-500',
    label: labels[status] || status.charAt(0) + status.slice(1).toLowerCase(),
  }
}

function calculateBMI(weight: number | null, height: number | null): string | null {
  if (!weight || !height) return null
  const heightM = height / 100
  return (weight / (heightM * heightM)).toFixed(2)
}

function calculateAge(dob: Date): string {
  const now = new Date()
  let years = now.getFullYear() - dob.getFullYear()
  let months = now.getMonth() - dob.getMonth()
  if (months < 0) {
    years--
    months += 12
  }
  return `${years} years ${months} months`
}

function getRiskColor(level: string): string {
  switch (level) {
    case 'No Risk': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-300 dark:border-green-700'
    case 'Low Risk': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-300 dark:border-green-700'
    case 'Medium Risk': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700'
    case 'High Risk': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-300 dark:border-red-700'
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700'
  }
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

// Patient Edit Modal
function PatientEditModal({ isOpen, onClose, patient, onSave }: {
  isOpen: boolean
  onClose: () => void
  patient: PatientBannerProps['patient']
  onSave: (edits: PatientEdit) => void
}) {
  const [form, setForm] = useState<PatientEdit>({
    firstName: patient.firstName,
    lastName: patient.lastName,
    title: patient.title,
    dob: new Date(patient.dob).toISOString().split('T')[0],
    sex: patient.sex,
    weight: patient.weight,
    height: patient.height,
    address: patient.address,
    suburb: patient.suburb,
    state: patient.state,
    postcode: patient.postcode,
    phone: patient.phone || null,
  })

  if (!isOpen) return null

  const handleSave = () => {
    onSave(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Edit Patient Demographics</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">First Name</label>
              <input type="text" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })}
                className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Last Name</label>
              <input type="text" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })}
                className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Title</label>
              <select value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value || null })}
                className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm">
                <option value="">None</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">DOB</label>
              <input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })}
                className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Sex</label>
              <select value={form.sex} onChange={e => setForm({ ...form, sex: e.target.value })}
                className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Weight (kg)</label>
              <input type="number" step="0.1" value={form.weight || ''} onChange={e => setForm({ ...form, weight: e.target.value ? parseFloat(e.target.value) : null })}
                className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Height (cm)</label>
              <input type="number" value={form.height || ''} onChange={e => setForm({ ...form, height: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Address</label>
            <input type="text" value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value || null })}
              className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Suburb</label>
              <input type="text" value={form.suburb || ''} onChange={e => setForm({ ...form, suburb: e.target.value || null })}
                className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">State</label>
              <input type="text" value={form.state || ''} onChange={e => setForm({ ...form, state: e.target.value || null })}
                className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Postcode</label>
              <input type="text" value={form.postcode || ''} onChange={e => setForm({ ...form, postcode: e.target.value || null })}
                className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Phone</label>
            <input type="tel" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value || null })}
              className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm" />
          </div>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 dark:border-slate-700">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-sm">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Save Changes</button>
        </div>
      </div>
    </div>
  )
}

export default function PatientBanner({ admission, patient, surgeonName }: PatientBannerProps) {
  const router = useRouter()
  const [showComorbidities, setShowComorbidities] = useState(false)
  const [showRiskFactors, setShowRiskFactors] = useState(false)
  const [showCarePlan, setShowCarePlan] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showReturnConfirm, setShowReturnConfirm] = useState(false)
  const [patientOverrides, setPatientOverrides] = useState<PatientEdit | null>(null)
  const [riskScores, setRiskScores] = useState({ fallsRisk: '2', fallsLevel: 'Low Risk' as const, pressureRisk: '0', pressureLevel: 'No Risk' as const })
  const [returnCount, setReturnCount] = useState(0)

  // Load overrides and risk data on mount
  useEffect(() => {
    if (patient.id) {
      const edits = getPatientEdits(patient.id)
      if (edits) setPatientOverrides(edits)
    }
    const scores = getRiskScores(admission.id)
    setRiskScores(scores)
    setReturnCount(getReturnToTheatreCount(admission.id))
  }, [patient.id, admission.id])

  // Merge patient data with overrides
  const effectivePatient = patientOverrides ? {
    ...patient,
    firstName: patientOverrides.firstName,
    lastName: patientOverrides.lastName,
    title: patientOverrides.title,
    dob: new Date(patientOverrides.dob),
    sex: patientOverrides.sex,
    weight: patientOverrides.weight,
    height: patientOverrides.height,
    address: patientOverrides.address,
    suburb: patientOverrides.suburb,
    state: patientOverrides.state,
    postcode: patientOverrides.postcode,
    phone: patientOverrides.phone,
  } : patient

  const bmi = calculateBMI(effectivePatient.weight, effectivePatient.height)
  const age = calculateAge(new Date(effectivePatient.dob))
  const effectiveStatus = getAdmissionStatus(admission.id) || admission.status
  const status = getStatusBadge(effectiveStatus)
  const patientFullName = `${effectivePatient.lastName} ${effectivePatient.firstName} ${effectivePatient.title || ''}`.trim()

  const isInRecoveryOrLater = ['RECOVERY_1', 'RECOVERY_2', 'DISCHARGED'].includes(effectiveStatus)

  // Consent documents (mock data)
  const consents = [
    { id: '1', label: `Informed Financial Consent ${new Date(admission.id === '1' ? '2026-03-17' : '2026-03-18').toISOString().split('T')[0]}` },
    { id: '2', label: `Surgical Consent ${new Date(admission.id === '1' ? '2026-03-17' : '2026-03-18').toISOString().split('T')[0]}` },
    { id: '3', label: `Anaesthetic Consent ${new Date(admission.id === '1' ? '2026-03-18' : '2026-03-18').toISOString().split('T')[0]}` },
  ]

  const handleConsentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      router.push(`/patients/${admission.id}/consent`)
    }
  }

  const handleReturnToTheatre = () => {
    setShowReturnConfirm(true)
  }

  const confirmReturnToTheatre = () => {
    const newCount = incrementReturnToTheatre(admission.id)
    setReturnCount(newCount)
    setShowReturnConfirm(false)
  }

  const handleSavePatient = (edits: PatientEdit) => {
    if (patient.id) {
      savePatientEdits(patient.id, edits)
      setPatientOverrides(edits)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm">
      <div className="px-4 sm:px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left: Patient Info */}
          <div className="lg:col-span-4">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold flex-shrink-0 ${
                effectivePatient.sex === 'Female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {effectivePatient.sex === 'Female' ? '\u2640' : '\u2642'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">MRN: {effectivePatient.mrn}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                    {effectivePatient.lastName} {effectivePatient.firstName} {effectivePatient.title}
                  </h2>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="p-1 text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors flex-shrink-0"
                    title="Edit patient demographics"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  <span>DOB: {new Date(effectivePatient.dob).toLocaleDateString('en-AU')} ({age})</span>
                  <span className="ml-3">Sex: <strong>{effectivePatient.sex}</strong></span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 flex flex-wrap gap-2 sm:gap-4">
                  {effectivePatient.weight && <span>Weight: {effectivePatient.weight}kg</span>}
                  {effectivePatient.height && <span>Height: {effectivePatient.height}cm</span>}
                  {bmi && <span className="text-cyan-600 dark:text-cyan-400 font-medium">BMI: {bmi}</span>}
                </div>

                {/* A&TSI Status */}
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  A&TSI: {effectivePatient.atsiStatus || 'Not recorded'}
                </div>

                {/* Falls Risk / Pressure Risk Badges */}
                <div className="flex flex-wrap gap-2 mt-1.5">
                  <button
                    onClick={() => router.push(`/patients/${admission.id}/falls-risk`)}
                    className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${getRiskColor(riskScores.fallsLevel)} hover:opacity-80 transition-opacity cursor-pointer`}
                  >
                    Falls Risk = {riskScores.fallsLevel}
                  </button>
                  <button
                    onClick={() => router.push(`/patients/${admission.id}/pressure-risk`)}
                    className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${getRiskColor(riskScores.pressureLevel)} hover:opacity-80 transition-opacity cursor-pointer`}
                  >
                    Pressure Risk = {riskScores.pressureLevel}
                  </button>
                </div>

                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white mt-2 ${status.color}`}>
                  {status.label}
                </div>

                {/* Address */}
                {effectivePatient.address && (
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {effectivePatient.address}, {effectivePatient.suburb}, {effectivePatient.state} {effectivePatient.postcode}
                  </div>
                )}

                {/* Consents Dropdown */}
                <div className="mt-1.5">
                  <select
                    onChange={handleConsentChange}
                    defaultValue=""
                    className="text-xs px-2 py-1 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded cursor-pointer hover:border-cyan-400 dark:hover:border-cyan-500 transition-colors w-full max-w-xs"
                  >
                    <option value="" disabled>Consents ({consents.length})</option>
                    {consents.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Operation Info */}
          <div className="lg:col-span-4">
            <div className="space-y-2">
              {/* Covid Status */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <Bug className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                <span>Covid status: <span className={
                  admission.covidStatus === 'Negative' ? 'text-green-600 dark:text-green-400 font-medium' :
                  admission.covidStatus === 'Positive' ? 'text-red-600 dark:text-red-400 font-medium' :
                  'text-gray-600 dark:text-gray-300'
                }>{admission.covidStatus || 'Not Asked Yet'}</span></span>
              </div>

              {surgeonName && (
                <div className="text-sm font-medium text-cyan-700 dark:text-cyan-400">Surgeon: {surgeonName}</div>
              )}
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Operation/notes:</div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-0.5">{admission.operationNotes}</div>
              </div>

              {/* Last Food / Last Fluid */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>Last food: {admission.lastFood
                  ? new Date(admission.lastFood).toLocaleString('en-AU', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
                  : 'Not recorded'}</span>
                <span>Last fluid: {admission.lastFluid
                  ? new Date(admission.lastFluid).toLocaleString('en-AU', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
                  : 'Not recorded'}</span>
              </div>
            </div>
          </div>

          {/* Right: Alerts & Quick Info */}
          <div className="lg:col-span-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm flex-wrap">
                <button onClick={() => setShowComorbidities(true)} className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 font-medium flex items-center gap-1">
                  <Heart className="w-4 h-4" /> Comorbidities
                </button>
                <button onClick={() => setShowRiskFactors(true)} className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 font-medium flex items-center gap-1">
                  <Shield className="w-4 h-4" /> Risk Factors
                </button>
                <button
                  onClick={() => router.push(`/patients/${admission.id}/health-assessment`)}
                  className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 font-medium flex items-center gap-1"
                >
                  <ClipboardCheck className="w-4 h-4" /> Health Assessment
                </button>
                <button
                  onClick={() => setShowCarePlan(true)}
                  className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 font-medium flex items-center gap-1"
                >
                  <ClipboardList className="w-4 h-4" /> Care Plan
                </button>
                <button
                  onClick={() => window.print()}
                  className="text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium flex items-center gap-1 no-print"
                  title="Print"
                >
                  <Printer className="w-4 h-4" /> Print
                </button>
              </div>
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">Alerts:</span>
              </div>
              <div className="text-sm flex items-center gap-2">
                <Pill className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Allergies:</span>
                <span className={effectivePatient.allergies?.includes('NIL') || !effectivePatient.allergies ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400 font-medium'}>
                  {effectivePatient.allergies || 'No Allergies (NIL)'}
                </span>
              </div>
              {admission.procedureStartTime && (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Procedure start time: <strong>{admission.procedureStartTime}</strong>
                </div>
              )}

              {/* Return to Theatre Button */}
              {isInRecoveryOrLater && (
                <button
                  onClick={handleReturnToTheatre}
                  className="mt-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Return to Theatre
                  {returnCount > 0 && <span className="bg-red-800 px-1.5 py-0.5 rounded text-[10px]">x{returnCount}</span>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Return to Theatre Confirmation Dialog */}
      {showReturnConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Return to Theatre
              </h2>
              <button onClick={() => setShowReturnConfirm(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded">
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                This is your {ordinal(returnCount + 1)} time Return to Theatre. Are you sure you want to proceed further?
              </p>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 dark:border-slate-700">
              <button onClick={() => setShowReturnConfirm(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-sm">Cancel</button>
              <button onClick={confirmReturnToTheatre} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Yes, Proceed</button>
            </div>
          </div>
        </div>
      )}

      <ComorbiditiesModal
        isOpen={showComorbidities}
        onClose={() => setShowComorbidities(false)}
        patientName={patientFullName}
        initialComorbidities={effectivePatient.comorbidities}
      />
      <RiskFactorsModal
        isOpen={showRiskFactors}
        onClose={() => setShowRiskFactors(false)}
        patientName={patientFullName}
        allergies={effectivePatient.allergies}
      />
      <PatientEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        patient={effectivePatient}
        onSave={handleSavePatient}
      />
      <CarePlanModal
        isOpen={showCarePlan}
        onClose={() => setShowCarePlan(false)}
        patient={effectivePatient}
      />
    </div>
  )
}
