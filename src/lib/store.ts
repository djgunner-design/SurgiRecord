'use client'

// Simple localStorage-based store for demo/development
// Will be replaced with Prisma/PostgreSQL in production

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
  if (typeof window === 'undefined') return { observations: [], notes: [], medications: [], statusUpdates: {}, auditLog: [] }
  const data = localStorage.getItem(STORE_KEY)
  if (data) return JSON.parse(data)
  return { observations: [], notes: [], medications: [], statusUpdates: {}, auditLog: [] }
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
