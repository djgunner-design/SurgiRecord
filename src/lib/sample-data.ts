export type AdmissionStatus =
  | 'PRE_ADMITTED'
  | 'BOOKED'
  | 'ARRIVED'
  | 'CHECKED_IN'
  | 'ANAESTHESIA_INDUCTION'
  | 'OPERATION_STARTED'
  | 'RECOVERY_1'
  | 'WARD'
  | 'RECOVERY_2'
  | 'DISCHARGED'
  | 'CANCELLED'

export const ALL_STATUSES: AdmissionStatus[] = [
  'PRE_ADMITTED',
  'BOOKED',
  'ARRIVED',
  'CHECKED_IN',
  'ANAESTHESIA_INDUCTION',
  'OPERATION_STARTED',
  'RECOVERY_1',
  'WARD',
  'RECOVERY_2',
  'DISCHARGED',
  'CANCELLED',
]

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'PRE_ADMITTED': return 'Pre Admitted'
    case 'BOOKED': return 'Booked'
    case 'ARRIVED': return 'Arrived'
    case 'CHECKED_IN': return 'Checked-In'
    case 'ANAESTHESIA_INDUCTION': return 'Anaesthesia Induction Started'
    case 'OPERATION_STARTED': return 'Operation Started'
    case 'RECOVERY_1': return 'Recovery Stage 1 Started'
    case 'WARD': return 'WARD'
    case 'RECOVERY_2': return 'Recovery Stage 2'
    case 'DISCHARGED': return 'Discharged'
    case 'CANCELLED': return 'Cancelled'
    default: return status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, ' ')
  }
}

export function getStatusRowColor(status: string): string {
  switch (status) {
    case 'PRE_ADMITTED': return 'bg-purple-50 border-l-4 border-l-purple-400 dark:bg-purple-950/30'
    case 'BOOKED': return 'bg-blue-50 border-l-4 border-l-blue-400 dark:bg-blue-950/30'
    case 'ARRIVED': return 'bg-yellow-50 border-l-4 border-l-yellow-400 dark:bg-yellow-950/30'
    case 'CHECKED_IN': return 'bg-orange-50 border-l-4 border-l-orange-400 dark:bg-orange-950/30'
    case 'ANAESTHESIA_INDUCTION': return 'bg-pink-50 border-l-4 border-l-pink-400 dark:bg-pink-950/30'
    case 'OPERATION_STARTED': return 'bg-red-50 border-l-4 border-l-red-500 dark:bg-red-950/30'
    case 'RECOVERY_1': return 'bg-green-50 border-l-4 border-l-green-400 dark:bg-green-950/30'
    case 'WARD': return 'bg-emerald-50 border-l-4 border-l-emerald-600 dark:bg-emerald-950/30'
    case 'RECOVERY_2': return 'bg-teal-50 border-l-4 border-l-teal-500 dark:bg-teal-950/30'
    case 'DISCHARGED': return 'bg-gray-50 border-l-4 border-l-gray-400 dark:bg-gray-800/30'
    case 'CANCELLED': return 'bg-gray-100 border-l-4 border-l-gray-600 dark:bg-gray-900/40'
    default: return 'bg-gray-50 border-l-4 border-l-gray-300 dark:bg-gray-800/30'
  }
}

export function getStatusBadgeColor(status: string): string {
  switch (status) {
    case 'PRE_ADMITTED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'BOOKED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'ARRIVED': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'CHECKED_IN': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'ANAESTHESIA_INDUCTION': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    case 'OPERATION_STARTED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'RECOVERY_1': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'WARD': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
    case 'RECOVERY_2': return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
    case 'DISCHARGED': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    case 'CANCELLED': return 'bg-gray-200 text-gray-600 line-through dark:bg-gray-700 dark:text-gray-400'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

export const sampleUsers = [
  { id: '1', name: 'David Gunn', initials: 'DG', pin: '3034', role: 'SURGEON' as const },
  { id: '2', name: 'Dr David Sharp', initials: 'DS', pin: '1234', role: 'SURGEON' as const },
  { id: '3', name: 'Anna-Louise Munro', initials: 'ALM', pin: '5678', role: 'SURGEON' as const },
  { id: '4', name: 'Kerry Lentini', initials: 'KLE', pin: '1111', role: 'NURSE' as const },
  { id: '5', name: 'Emma Layt', initials: 'ELT', pin: '2222', role: 'ANAESTHETIST' as const },
  { id: '6', name: 'Monica Roberts', initials: 'MOR', pin: '3333', role: 'NURSE' as const },
  { id: '7', name: 'Gary Cadwallender', initials: 'GCA', pin: '4444', role: 'NURSE' as const },
]

export const samplePatients = [
  {
    id: '1',
    mrn: '1001001',
    firstName: 'Rachel',
    lastName: 'HENDERSON',
    title: 'Ms',
    dob: new Date('1984-03-17'),
    sex: 'Female',
    weight: 58.4,
    height: 166,
    address: '14 Banksia Drive',
    suburb: 'TAMWORTH',
    state: 'NSW',
    postcode: '2340',
    atsiStatus: 'Neither Aboriginal nor Torres.',
    allergies: 'No Allergies (NIL)',
    comorbidities: null,
  },
  {
    id: '2',
    mrn: '1001002',
    firstName: 'James',
    lastName: 'MITCHELL',
    title: 'Mr',
    dob: new Date('1980-06-22'),
    sex: 'Male',
    weight: 85,
    height: 178,
    address: '7 Wattle Close',
    suburb: 'INVERELL',
    state: 'NSW',
    postcode: '2360',
    atsiStatus: 'Neither Aboriginal nor Torres.',
    allergies: null,
    comorbidities: null,
  },
  {
    id: '3',
    mrn: '1001003',
    firstName: 'Harold',
    lastName: 'PEARSON',
    title: 'Mr',
    dob: new Date('1954-09-12'),
    sex: 'Male',
    weight: 92,
    height: 175,
    address: '23 Kurrajong Street',
    suburb: 'GLEN INNES',
    state: 'NSW',
    postcode: '2370',
    atsiStatus: null,
    allergies: 'ASPIRIN, FISH OIL',
    comorbidities: 'Blood thinner',
  },
  {
    id: '4',
    mrn: '1001004',
    firstName: 'Margaret',
    lastName: 'ELLISON',
    title: 'Mrs',
    dob: new Date('1956-07-25'),
    sex: 'Female',
    weight: 70,
    height: 162,
    address: '91 Acacia Avenue',
    suburb: 'MOREE',
    state: 'NSW',
    postcode: '2400',
    atsiStatus: null,
    allergies: null,
    comorbidities: null,
  },
  {
    id: '5',
    mrn: '1001005',
    firstName: 'Patricia',
    lastName: 'FORSYTH',
    title: 'Mrs',
    dob: new Date('1970-01-30'),
    sex: 'Female',
    weight: 65,
    height: 170,
    address: '56 Grevillea Crescent',
    suburb: 'URALLA',
    state: 'NSW',
    postcode: '2358',
    atsiStatus: null,
    allergies: null,
    comorbidities: null,
  },
  {
    id: '6',
    mrn: '1001006',
    firstName: 'Robert James',
    lastName: 'THORNTON',
    title: 'Mr',
    dob: new Date('1969-04-15'),
    sex: 'Male',
    weight: 88,
    height: 180,
    address: '3 Bottlebrush Lane',
    suburb: 'WALCHA',
    state: 'NSW',
    postcode: '2354',
    atsiStatus: null,
    allergies: null,
    comorbidities: null,
  },
  {
    id: '7',
    mrn: '1001007',
    firstName: 'Arthur',
    lastName: 'WHITFIELD',
    title: 'Mr',
    dob: new Date('1946-05-08'),
    sex: 'Male',
    weight: 78,
    height: 172,
    address: '18 Ironbark Road',
    suburb: 'GUYRA',
    state: 'NSW',
    postcode: '2365',
    atsiStatus: null,
    allergies: 'ASPIRIN',
    comorbidities: 'Blood thinner',
  },
  {
    id: '8',
    mrn: '1001008',
    firstName: 'Sandra',
    lastName: 'PEMBERTON',
    title: 'Ms',
    dob: new Date('1957-02-19'),
    sex: 'Female',
    weight: 62,
    height: 160,
    address: '42 Eucalyptus Way',
    suburb: 'TENTERFIELD',
    state: 'NSW',
    postcode: '2372',
    atsiStatus: null,
    allergies: null,
    comorbidities: null,
  },
]

export const sampleAdmissions = [
  {
    id: '1',
    patientId: '1',
    date: new Date('2026-03-19'),
    time: '06:41',
    status: 'RECOVERY_1' as AdmissionStatus,
    operationNotes: 'ABDOMINOPLASTY AND MASTOPEXY WITH BILATERAL BREAST AUGMENTATION #COSMETIC',
    location: 'Theatre 1',
    surgeonId: '2',
    anaesthetistId: '5',
    procedureStartTime: '08:01',
    covidStatus: 'Not Asked Yet',
    lastFood: new Date('2026-03-18T19:30:00'),
    lastFluid: new Date('2026-03-18T21:00:00'),
  },
  {
    id: '2',
    patientId: '2',
    date: new Date('2026-03-19'),
    time: '07:00',
    status: 'DISCHARGED' as AdmissionStatus,
    operationNotes: 'RIGHT CATARACT Alcon PanOptix Pro Toric PXYAT2 +21.50/+1.00 x 144EQR',
    location: 'Theatre 2',
    surgeonId: '1',
    anaesthetistId: '5',
    procedureStartTime: '09:15',
    covidStatus: 'Not Asked Yet',
    lastFood: null,
    lastFluid: null,
  },
  {
    id: '3',
    patientId: '3',
    date: new Date('2026-03-19'),
    time: '07:15',
    status: 'DISCHARGED' as AdmissionStatus,
    operationNotes: 'RIGHT LOWER LID ECTROPIAN REPAIR BLOOD THINNER ASPIRIN/FISH OIL - HAS CEASED SURGERY CONNECT',
    location: 'Theatre 1',
    surgeonId: '3',
    anaesthetistId: null,
    procedureStartTime: '10:00',
    covidStatus: null,
    lastFood: null,
    lastFluid: null,
  },
  {
    id: '4',
    patientId: '4',
    date: new Date('2026-03-19'),
    time: '07:30',
    status: 'DISCHARGED' as AdmissionStatus,
    operationNotes: 'RIGHT CATARACT Alcon Clareon Toric CNA0T2 +22.00/+1.00 x 162',
    location: 'Theatre 2',
    surgeonId: '1',
    anaesthetistId: null,
    procedureStartTime: '10:30',
    covidStatus: null,
    lastFood: null,
    lastFluid: null,
  },
  {
    id: '5',
    patientId: '5',
    date: new Date('2026-03-19'),
    time: null,
    status: 'BOOKED' as AdmissionStatus,
    operationNotes: 'FOCUS - RIGHT CATARACT Alcon PanOptix Pro PXYAT0 +21.50',
    location: 'Theatre 2',
    surgeonId: '1',
    anaesthetistId: null,
    procedureStartTime: null,
    covidStatus: null,
    lastFood: null,
    lastFluid: null,
  },
  {
    id: '6',
    patientId: '6',
    date: new Date('2026-03-19'),
    time: '08:00',
    status: 'DISCHARGED' as AdmissionStatus,
    operationNotes: 'RIGHT CATARACT Alcon PanOptix Pro Toric PXYAT3 +20.50/+1.50 x 6EQR',
    location: 'Theatre 2',
    surgeonId: '1',
    anaesthetistId: null,
    procedureStartTime: '11:00',
    covidStatus: null,
    lastFood: null,
    lastFluid: null,
  },
  {
    id: '7',
    patientId: '7',
    date: new Date('2026-03-19'),
    time: '08:30',
    status: 'DISCHARGED' as AdmissionStatus,
    operationNotes: 'BILATERAL LOWER LID ECTRIOPIAN REPAIR AND LOWER BLEPHAROPLASTY BLOOD THINNER: ASPIRIN',
    location: 'Theatre 1',
    surgeonId: '3',
    anaesthetistId: null,
    procedureStartTime: '11:30',
    covidStatus: null,
    lastFood: null,
    lastFluid: null,
  },
  {
    id: '8',
    patientId: '8',
    date: new Date('2026-03-19'),
    time: '09:00',
    status: 'DISCHARGED' as AdmissionStatus,
    operationNotes: 'RIGHT CATARACT + HYDRUS J&J Puresee Toric +19.50 DET150 x 161EQR',
    location: 'Theatre 2',
    surgeonId: '1',
    anaesthetistId: null,
    procedureStartTime: '12:00',
    covidStatus: null,
    lastFood: null,
    lastFluid: null,
  },
]

export const sampleObservations = [
  { id: '1', admissionId: '1', time: new Date('2026-03-19T06:45:00'), rr: 14, spo2: 100, hr: 86, bpSystolic: 117, bpDiastolic: 64, temp: 36.6, userId: '4' },
  { id: '2', admissionId: '1', time: new Date('2026-03-19T07:00:00'), rr: 15, spo2: 99, hr: 84, bpSystolic: 120, bpDiastolic: 68, temp: 36.5, userId: '4' },
  { id: '3', admissionId: '1', time: new Date('2026-03-19T08:30:00'), rr: 13, spo2: 100, hr: 80, bpSystolic: 115, bpDiastolic: 62, temp: 36.4, userId: '6' },
  { id: '4', admissionId: '1', time: new Date('2026-03-19T09:30:00'), rr: 14, spo2: 99, hr: 78, bpSystolic: 118, bpDiastolic: 65, temp: 36.5, userId: '6' },
  { id: '5', admissionId: '1', time: new Date('2026-03-19T10:30:00'), rr: 14, spo2: 100, hr: 82, bpSystolic: 122, bpDiastolic: 70, temp: 36.6, userId: '7' },
  { id: '6', admissionId: '1', time: new Date('2026-03-19T11:00:00'), rr: 13, spo2: 98, hr: 100, bpSystolic: 105, bpDiastolic: 45, temp: 36.3, userId: '7' },
  { id: '7', admissionId: '1', time: new Date('2026-03-19T11:15:00'), rr: 14, spo2: 99, hr: 98, bpSystolic: 108, bpDiastolic: 48, temp: 36.4, userId: '7' },
  { id: '8', admissionId: '1', time: new Date('2026-03-19T11:30:00'), rr: 15, spo2: 99, hr: 95, bpSystolic: 110, bpDiastolic: 50, temp: 36.5, userId: '7' },
  { id: '9', admissionId: '1', time: new Date('2026-03-19T11:45:00'), rr: 14, spo2: 100, hr: 92, bpSystolic: 115, bpDiastolic: 55, temp: 36.5, userId: '7' },
  { id: '10', admissionId: '1', time: new Date('2026-03-19T12:00:00'), rr: 16, spo2: 100, hr: 88, bpSystolic: 120, bpDiastolic: 60, temp: 36.6, userId: '7' },
]

export const sampleNotes = [
  { id: '1', admissionId: '1', dateTime: new Date('2026-03-19T06:54:00'), content: 'TED stockings applied. Pre-op checklist completed. Consent form verified. Anaesthetic team notified. Patient nil by mouth confirmed.', userId: '4' },
  { id: '2', admissionId: '1', dateTime: new Date('2026-03-19T11:49:00'), content: 'Patient arrived in PACU at 1130, unresponsive with LMA insitu. Spontaneous resps, O2 6L/min. Obs as charted. Anaesthetist and Scrub nurse handover completed. Dressings checked, nil ooze. Drainage in situ.', userId: '7' },
]

export const sampleHandovers = [
  { id: '1', admissionId: '1', stage: 'ADMISSION' as const, fromUserId: '4', toUserId: null, time: null },
  { id: '2', admissionId: '1', stage: 'ANAESTHESIA' as const, fromUserId: '5', toUserId: null, time: '00:00' },
  { id: '3', admissionId: '1', stage: 'PROCEDURE' as const, fromUserId: '6', toUserId: '7', time: '11:45' },
  { id: '4', admissionId: '1', stage: 'RECOVERY_1' as const, fromUserId: '7', toUserId: null, time: null },
]

// Helper to find data
export function findUser(id: string) {
  return sampleUsers.find(u => u.id === id)
}

export function findPatient(id: string) {
  return samplePatients.find(p => p.id === id)
}

export function findAdmission(id: string) {
  return sampleAdmissions.find(a => a.id === id)
}

export function getAdmissionsByDate(dateStr: string) {
  return sampleAdmissions.filter(a => {
    const admDate = a.date.toISOString().split('T')[0]
    return admDate === dateStr
  })
}

export function getObservationsForAdmission(admissionId: string) {
  return sampleObservations.filter(o => o.admissionId === admissionId)
}

export function getNotesForAdmission(admissionId: string) {
  return sampleNotes.filter(n => n.admissionId === admissionId)
}

export function getHandoversForAdmission(admissionId: string) {
  return sampleHandovers.filter(h => h.admissionId === admissionId)
}
