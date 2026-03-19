'use client'

// Simple localStorage-based store for demo/development
// Will be replaced with Prisma/PostgreSQL in production

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
