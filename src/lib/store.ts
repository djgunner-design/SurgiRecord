'use client'

// Simple localStorage-based store for demo/development
// Will be replaced with Prisma/PostgreSQL in production

import { findAdmission as findAdmissionFromSample } from '@/lib/sample-data'

export type PostOpCall = {
  id: string
  admissionId: string
  date: string
  time: string
  status: 'Scheduled' | 'Completed' | 'No Answer' | 'Cancelled'
  notes: string
  createdAt: string
  updatedAt: string
}

type StoreData = {
  observations: Array<{
    id: string
    admissionId: string
    time: string
    rr: number | null
    spo2: number | null
    hr: number | null
    bpSystolic: number | null
    bpDiastolic: number | null
    temp: number | null
    painScore: number | null
    respDistress: string
    comments: string
    userId: string
  }>
  notes: Array<{
    id: string
    admissionId: string
    dateTime: string
    content: string
    userId: string
  }>
  medications: Array<{
    id: string
    admissionId: string
    type: string
    medication: string
    route: string
    laterality: string
    dose: string
    datePrescribed: string
    prescriberId: string
  }>
  statusUpdates: Record<string, string>
  postOpCalls: PostOpCall[]
  auditLog: Array<{
    id: string
    timestamp: string
    userId: string
    action: string
    details: string
    admissionId?: string
  }>
}

const STORE_KEY = 'surgirecord_data'

function getStore(): StoreData {
  if (typeof window === 'undefined') return { observations: [], notes: [], medications: [], statusUpdates: {}, postOpCalls: [], auditLog: [] }
  const data = localStorage.getItem(STORE_KEY)
  if (data) {
    const parsed = JSON.parse(data)
    if (!parsed.postOpCalls) parsed.postOpCalls = []
    return parsed
  }
  return { observations: [], notes: [], medications: [], statusUpdates: {}, postOpCalls: [], auditLog: [] }
}

function saveStore(data: StoreData) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORE_KEY, JSON.stringify(data))
}

function generateId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// Observations
export function addObservation(obs: Omit<StoreData['observations'][0], 'id'>) {
  const store = getStore()
  const newObs = { ...obs, id: generateId() }
  store.observations.push(newObs)
  addAuditEntry({ userId: obs.userId, action: 'ADD_OBSERVATION', details: `Added observation for admission ${obs.admissionId}`, admissionId: obs.admissionId })
  saveStore(store)
  return newObs
}

export function getStoredObservations(admissionId: string) {
  return getStore().observations.filter(o => o.admissionId === admissionId)
}

// Notes
export function addNote(note: { admissionId: string; content: string; userId: string }) {
  const store = getStore()
  const newNote = { ...note, id: generateId(), dateTime: new Date().toISOString() }
  store.notes.push(newNote)
  addAuditEntry({ userId: note.userId, action: 'ADD_NOTE', details: `Added clinical note for admission ${note.admissionId}`, admissionId: note.admissionId })
  saveStore(store)
  return newNote
}

export function getStoredNotes(admissionId: string) {
  return getStore().notes.filter(n => n.admissionId === admissionId)
}

export function deleteNote(noteId: string, userId: string) {
  const store = getStore()
  store.notes = store.notes.filter(n => n.id !== noteId)
  addAuditEntry({ userId, action: 'DELETE_NOTE', details: `Deleted note ${noteId}` })
  saveStore(store)
}

// Medications
export function addMedication(med: Omit<StoreData['medications'][0], 'id'>) {
  const store = getStore()
  const newMed = { ...med, id: generateId() }
  store.medications.push(newMed)
  addAuditEntry({ userId: med.prescriberId, action: 'ADD_MEDICATION', details: `Ordered ${med.medication} for admission ${med.admissionId}`, admissionId: med.admissionId })
  saveStore(store)
  return newMed
}

export function getStoredMedications(admissionId: string) {
  return getStore().medications.filter(m => m.admissionId === admissionId)
}

// Status Updates
export function updateAdmissionStatus(admissionId: string, newStatus: string, userId: string) {
  const store = getStore()
  store.statusUpdates[admissionId] = newStatus
  addAuditEntry({ userId, action: 'STATUS_CHANGE', details: `Changed status to ${newStatus}`, admissionId })
  saveStore(store)
}

export function getAdmissionStatus(admissionId: string): string | null {
  return getStore().statusUpdates[admissionId] || null
}

// Post-Op Calls
export function addPostOpCall(admissionId: string, call: { date: string; time: string; notes: string }): PostOpCall {
  const store = getStore()
  const now = new Date().toISOString()
  const newCall: PostOpCall = {
    id: generateId(),
    admissionId,
    date: call.date,
    time: call.time,
    status: 'Scheduled',
    notes: call.notes,
    createdAt: now,
    updatedAt: now,
  }
  store.postOpCalls.push(newCall)
  addAuditEntry({ userId: 'system', action: 'ADD_POST_OP_CALL', details: `Scheduled post-op call for admission ${admissionId}`, admissionId })
  saveStore(store)
  return newCall
}

export function getPostOpCalls(admissionId: string): PostOpCall[] {
  return getStore().postOpCalls.filter(c => c.admissionId === admissionId)
}

export function updatePostOpCall(admissionId: string, callId: string, updates: Partial<Pick<PostOpCall, 'status' | 'notes'>>): PostOpCall | null {
  const store = getStore()
  const idx = store.postOpCalls.findIndex(c => c.id === callId && c.admissionId === admissionId)
  if (idx === -1) return null
  store.postOpCalls[idx] = { ...store.postOpCalls[idx], ...updates, updatedAt: new Date().toISOString() }
  addAuditEntry({ userId: 'system', action: 'UPDATE_POST_OP_CALL', details: `Updated post-op call ${callId} for admission ${admissionId}`, admissionId })
  saveStore(store)
  return store.postOpCalls[idx]
}

// Audit Log
function addAuditEntry(entry: { userId: string; action: string; details: string; admissionId?: string }) {
  const store = getStore()
  store.auditLog.push({
    id: generateId(),
    timestamp: new Date().toISOString(),
    ...entry,
  })
  saveStore(store)
}

export function getAuditLog(admissionId?: string) {
  const store = getStore()
  if (admissionId) return store.auditLog.filter(e => e.admissionId === admissionId)
  return store.auditLog
}

// Operation Favourites (per-user)
export function getUserFavourites(userId: string): Array<{ id: string; name: string; operationNotes: string; defaultLocation: string }> {
  if (typeof window === 'undefined') return []
  const key = `surgirecord_favourites_${userId}`
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

export function addUserFavourite(userId: string, favourite: { name: string; operationNotes: string; defaultLocation: string }) {
  const favourites = getUserFavourites(userId)
  favourites.push({ ...favourite, id: generateId() })
  localStorage.setItem(`surgirecord_favourites_${userId}`, JSON.stringify(favourites))
}

export function removeUserFavourite(userId: string, favouriteId: string) {
  const favourites = getUserFavourites(userId).filter(f => f.id !== favouriteId)
  localStorage.setItem(`surgirecord_favourites_${userId}`, JSON.stringify(favourites))
}

// Nurse Quick-Response Templates
export type NurseTemplateCategory = 'admission' | 'recovery' | 'discharge' | 'notes' | 'handover' | 'obs'

export type NurseTemplate = {
  id: string
  userId: string // creator's userId, or 'shared' for team templates
  category: NurseTemplateCategory
  name: string
  fields: Record<string, string>
  createdAt: string
}

const TEMPLATES_KEY = 'surgirecord_nurse_templates'

function getTemplateStore(): NurseTemplate[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(TEMPLATES_KEY)
  return data ? JSON.parse(data) : []
}

function saveTemplateStore(templates: NurseTemplate[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
}

export function getUserTemplates(userId: string, category: NurseTemplateCategory): NurseTemplate[] {
  return getTemplateStore().filter(
    t => t.category === category && (t.userId === userId || t.userId === 'shared')
  )
}

export function getSharedTemplates(category: NurseTemplateCategory): NurseTemplate[] {
  return getTemplateStore().filter(t => t.category === category && t.userId === 'shared')
}

export function addTemplate(template: Omit<NurseTemplate, 'id' | 'createdAt'>): NurseTemplate {
  const templates = getTemplateStore()
  const newTemplate: NurseTemplate = {
    ...template,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  templates.push(newTemplate)
  saveTemplateStore(templates)
  return newTemplate
}

export function deleteTemplate(templateId: string, userId: string): boolean {
  const templates = getTemplateStore()
  const template = templates.find(t => t.id === templateId)
  if (!template) return false
  // Can only delete own templates or shared templates you created
  if (template.userId !== userId && template.userId !== 'shared') return false
  saveTemplateStore(templates.filter(t => t.id !== templateId))
  return true
}

// Recent Patients
export type RecentPatient = {
  admissionId: string
  patientName: string
  mrn: string
  operation: string
  visitedAt: string
}

const RECENT_PATIENTS_KEY = 'surgirecord_recent_patients'

export function addRecentPatient(admissionId: string, patientName: string, mrn: string, operation: string) {
  if (typeof window === 'undefined') return
  const recent = getRecentPatients().filter(r => r.admissionId !== admissionId)
  recent.unshift({ admissionId, patientName, mrn, operation, visitedAt: new Date().toISOString() })
  const trimmed = recent.slice(0, 5)
  localStorage.setItem(RECENT_PATIENTS_KEY, JSON.stringify(trimmed))
}

export function getRecentPatients(): RecentPatient[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(RECENT_PATIENTS_KEY)
  return data ? JSON.parse(data) : []
}

// Undo Support
export interface UndoAction {
  id: string
  description: string
  timestamp: number
}

const UNDO_KEY = 'surgirecord_undo'
let undoCallbacks: Map<string, () => void> = new Map()
let undoListeners: Array<() => void> = []

export function subscribeUndo(listener: () => void) {
  undoListeners.push(listener)
  return () => {
    undoListeners = undoListeners.filter(l => l !== listener)
  }
}

function notifyUndoListeners() {
  undoListeners.forEach(l => l())
}

function getUndoMeta(): Array<{ id: string; description: string; timestamp: number }> {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(UNDO_KEY)
  return data ? JSON.parse(data) : []
}

function saveUndoMeta(meta: Array<{ id: string; description: string; timestamp: number }>) {
  if (typeof window === 'undefined') return
  localStorage.setItem(UNDO_KEY, JSON.stringify(meta))
}

export function pushUndoAction(action: { description: string; revert: () => void }) {
  const id = 'undo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6)
  const meta = getUndoMeta()
  meta.push({ id, description: action.description, timestamp: Date.now() })
  saveUndoMeta(meta)
  undoCallbacks.set(id, action.revert)
  notifyUndoListeners()
  return id
}

export function peekUndoAction(): { id: string; description: string; timestamp: number } | null {
  const meta = getUndoMeta()
  return meta.length > 0 ? meta[meta.length - 1] : null
}

export function popUndoAction(): boolean {
  const meta = getUndoMeta()
  if (meta.length === 0) return false
  const last = meta.pop()!
  saveUndoMeta(meta)
  const revert = undoCallbacks.get(last.id)
  if (revert) {
    revert()
    undoCallbacks.delete(last.id)
  }
  notifyUndoListeners()
  return true
}

export function clearUndoAction(id: string) {
  const meta = getUndoMeta().filter(m => m.id !== id)
  saveUndoMeta(meta)
  undoCallbacks.delete(id)
  notifyUndoListeners()
}

// Step Completion Tracking
const STEP_COMPLETION_KEY = 'surgirecord_step_completion'

export const ADMISSION_STEPS = [
  'Nursing Admission',
  'Pre-Anaesthetic',
  'Falls Risk',
  'Pressure Risk',
  'Delirium Risk',
  'VTE Risk',
  'Surgical Checklist',
  'Count Sheet',
  'Intra-Operative',
  'Prostheses/Implants',
  'Operation Report',
  'Stage 1',
  'Stage 2',
  'Fluid Balance',
  'Handover from Recovery',
  'Patient Transfer',
  'Discharge Checklist',
  'Discharge Summary',
  'Post Op Call Details',
  'Emergency Resuscitation',
  'Consent Forms',
  'Photos & Scans',
] as const

function getStepStore(): Record<string, Record<string, boolean>> {
  if (typeof window === 'undefined') return {}
  const data = localStorage.getItem(STEP_COMPLETION_KEY)
  return data ? JSON.parse(data) : {}
}

function saveStepStore(store: Record<string, Record<string, boolean>>) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STEP_COMPLETION_KEY, JSON.stringify(store))
}

export function getStepCompletion(admissionId: string): Record<string, boolean> {
  const store = getStepStore()
  if (store[admissionId]) return store[admissionId]

  // Generate default completion based on admission status from sample data
  const adm = findAdmissionFromSample(admissionId)
  if (!adm) return {}

  const effectiveStatus = getAdmissionStatus(admissionId) || adm.status
  const defaults: Record<string, boolean> = {}

  if (effectiveStatus === 'DISCHARGED') {
    // Discharged patients have most steps complete
    ADMISSION_STEPS.forEach(s => { defaults[s] = true })
    defaults['Emergency Resuscitation'] = false
  } else if (effectiveStatus === 'WARD') {
    const wardDone = [
      'Nursing Admission', 'Pre-Anaesthetic', 'Falls Risk', 'Pressure Risk',
      'Delirium Risk', 'VTE Risk', 'Surgical Checklist', 'Count Sheet',
      'Intra-Operative', 'Operation Report', 'Stage 1', 'Consent Forms',
      'Handover from Recovery', 'Patient Transfer',
    ]
    ADMISSION_STEPS.forEach(s => { defaults[s] = wardDone.includes(s) })
  } else if (effectiveStatus === 'RECOVERY_1' || effectiveStatus === 'RECOVERY_2') {
    const recoveryDone = [
      'Nursing Admission', 'Pre-Anaesthetic', 'Falls Risk', 'Pressure Risk',
      'Delirium Risk', 'VTE Risk', 'Surgical Checklist', 'Count Sheet',
      'Intra-Operative', 'Operation Report', 'Stage 1', 'Consent Forms',
    ]
    ADMISSION_STEPS.forEach(s => { defaults[s] = recoveryDone.includes(s) })
  } else if (effectiveStatus === 'OPERATION_STARTED') {
    const opDone = [
      'Nursing Admission', 'Pre-Anaesthetic', 'Falls Risk', 'Pressure Risk',
      'Delirium Risk', 'VTE Risk', 'Surgical Checklist', 'Consent Forms',
    ]
    ADMISSION_STEPS.forEach(s => { defaults[s] = opDone.includes(s) })
  } else if (effectiveStatus === 'ANAESTHESIA_INDUCTION') {
    const anaesthDone = [
      'Nursing Admission', 'Pre-Anaesthetic', 'Falls Risk', 'Pressure Risk',
      'Delirium Risk', 'VTE Risk', 'Surgical Checklist', 'Consent Forms',
    ]
    ADMISSION_STEPS.forEach(s => { defaults[s] = anaesthDone.includes(s) })
  } else if (effectiveStatus === 'CHECKED_IN') {
    const checkedInDone = [
      'Nursing Admission', 'Pre-Anaesthetic', 'Falls Risk', 'Pressure Risk',
      'Delirium Risk', 'VTE Risk',
    ]
    ADMISSION_STEPS.forEach(s => { defaults[s] = checkedInDone.includes(s) })
  } else if (effectiveStatus === 'ARRIVED') {
    const arrivedDone = [
      'Nursing Admission',
    ]
    ADMISSION_STEPS.forEach(s => { defaults[s] = arrivedDone.includes(s) })
  } else {
    // PRE_ADMITTED, BOOKED, CANCELLED - nothing completed
    ADMISSION_STEPS.forEach(s => { defaults[s] = false })
  }

  return defaults
}

export function setStepCompleted(admissionId: string, step: string, completed: boolean) {
  const store = getStepStore()
  if (!store[admissionId]) {
    store[admissionId] = getStepCompletion(admissionId)
  }
  store[admissionId][step] = completed
  saveStepStore(store)
}

export function getCompletionPercentage(admissionId: string): number {
  const completion = getStepCompletion(admissionId)
  const steps = Object.values(completion)
  if (steps.length === 0) return 0
  const done = steps.filter(Boolean).length
  return Math.round((done / steps.length) * 100)
}

// Patient Edits (demographics overrides stored in localStorage)
const PATIENT_EDITS_KEY = 'surgirecord_patient_edits'

export type PatientEdit = {
  firstName: string
  lastName: string
  title: string | null
  dob: string
  sex: string
  weight: number | null
  height: number | null
  address: string | null
  suburb: string | null
  state: string | null
  postcode: string | null
  phone: string | null
}

function getPatientEditsStore(): Record<string, PatientEdit> {
  if (typeof window === 'undefined') return {}
  const data = localStorage.getItem(PATIENT_EDITS_KEY)
  return data ? JSON.parse(data) : {}
}

export function getPatientEdits(patientId: string): PatientEdit | null {
  return getPatientEditsStore()[patientId] || null
}

export function savePatientEdits(patientId: string, edits: PatientEdit) {
  const store = getPatientEditsStore()
  store[patientId] = edits
  if (typeof window !== 'undefined') {
    localStorage.setItem(PATIENT_EDITS_KEY, JSON.stringify(store))
  }
}

// Consultation Notes
const CONSULTATION_NOTES_KEY = 'surgirecord_consultation_notes'

export type ConsultationNote = {
  id: string
  admissionId: string
  content: string
  updatedAt: string
}

function getConsultationNotesStore(): ConsultationNote[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(CONSULTATION_NOTES_KEY)
  return data ? JSON.parse(data) : []
}

export function getConsultationNote(admissionId: string): ConsultationNote | null {
  const notes = getConsultationNotesStore()
  return notes.find(n => n.admissionId === admissionId) || null
}

export function saveConsultationNote(admissionId: string, content: string): ConsultationNote {
  const notes = getConsultationNotesStore()
  const existing = notes.findIndex(n => n.admissionId === admissionId)
  const note: ConsultationNote = {
    id: existing >= 0 ? notes[existing].id : generateId(),
    admissionId,
    content,
    updatedAt: new Date().toISOString(),
  }
  if (existing >= 0) {
    notes[existing] = note
  } else {
    notes.push(note)
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(CONSULTATION_NOTES_KEY, JSON.stringify(notes))
  }
  return note
}

// Return to Theatre tracking
const RETURN_TO_THEATRE_KEY = 'surgirecord_return_to_theatre'

export function getReturnToTheatreCount(admissionId: string): number {
  if (typeof window === 'undefined') return 0
  const data = localStorage.getItem(RETURN_TO_THEATRE_KEY)
  const store: Record<string, number> = data ? JSON.parse(data) : {}
  return store[admissionId] || 0
}

export function incrementReturnToTheatre(admissionId: string): number {
  if (typeof window === 'undefined') return 0
  const data = localStorage.getItem(RETURN_TO_THEATRE_KEY)
  const store: Record<string, number> = data ? JSON.parse(data) : {}
  store[admissionId] = (store[admissionId] || 0) + 1
  localStorage.setItem(RETURN_TO_THEATRE_KEY, JSON.stringify(store))
  return store[admissionId]
}

// Falls Risk / Pressure Risk
const RISK_SCORES_KEY = 'surgirecord_risk_scores'

export type RiskScores = {
  fallsRisk: string
  fallsLevel: 'No Risk' | 'Low Risk' | 'Medium Risk' | 'High Risk'
  pressureRisk: string
  pressureLevel: 'No Risk' | 'Low Risk' | 'Medium Risk' | 'High Risk'
}

export function getRiskScores(admissionId: string): RiskScores {
  if (typeof window === 'undefined') return { fallsRisk: '2', fallsLevel: 'Low Risk', pressureRisk: '0', pressureLevel: 'No Risk' }
  const data = localStorage.getItem(RISK_SCORES_KEY)
  const store: Record<string, RiskScores> = data ? JSON.parse(data) : {}
  return store[admissionId] || { fallsRisk: '2', fallsLevel: 'Low Risk', pressureRisk: '0', pressureLevel: 'No Risk' }
}

export function saveRiskScores(admissionId: string, scores: RiskScores) {
  if (typeof window === 'undefined') return
  const data = localStorage.getItem(RISK_SCORES_KEY)
  const store: Record<string, RiskScores> = data ? JSON.parse(data) : {}
  store[admissionId] = scores
  localStorage.setItem(RISK_SCORES_KEY, JSON.stringify(store))
}
