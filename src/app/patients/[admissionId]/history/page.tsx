'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, FileText } from 'lucide-react'
import { findAdmission, findPatient, findUser, sampleAdmissions } from '@/lib/sample-data'

export default function AdmissionHistoryPage() {
  const params = useParams()
  const router = useRouter()
  const admissionId = params.admissionId as string
  const admission = findAdmission(admissionId)
  const patient = admission ? findPatient(admission.patientId) : null

  if (!admission || !patient) return <div>Not found</div>

  // Get all admissions for this patient (simulating history)
  const patientAdmissions = sampleAdmissions
    .filter(a => a.patientId === admission.patientId)
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  // Add some fake historical admissions
  const historicalAdmissions = [
    ...patientAdmissions,
    {
      id: 'hist_1',
      patientId: admission.patientId,
      date: new Date('2025-11-15'),
      time: '07:30',
      status: 'DISCHARGED' as const,
      operationNotes: 'LEFT CATARACT - Alcon PanOptix Pro PXYAT0 +22.00',
      location: 'Theatre 2',
      surgeonId: '1',
      anaesthetistId: null,
      procedureStartTime: '09:00',
      covidStatus: null,
      lastFood: null,
      lastFluid: null,
    },
    {
      id: 'hist_2',
      patientId: admission.patientId,
      date: new Date('2025-06-20'),
      time: '08:00',
      status: 'DISCHARGED' as const,
      operationNotes: 'Pre-operative assessment and consultation',
      location: 'Clinic',
      surgeonId: '1',
      anaesthetistId: null,
      procedureStartTime: null,
      covidStatus: null,
      lastFood: null,
      lastFluid: null,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 dark:bg-slate-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">ADMISSION HISTORY</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h3 className="text-sm text-gray-600 dark:text-gray-400">
            Patient: <span className="font-medium text-gray-800 dark:text-white">{patient.lastName} {patient.firstName} {patient.title}</span> (MRN: {patient.mrn})
          </h3>
        </div>

        <div className="space-y-4">
          {historicalAdmissions.map((adm, i) => {
            const surgeon = adm.surgeonId ? findUser(adm.surgeonId) : null
            const isCurrent = adm.id === admissionId
            return (
              <div
                key={adm.id}
                className={`border rounded-lg p-4 transition-colors ${
                  isCurrent
                    ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 dark:border-cyan-700'
                    : 'border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer'
                }`}
                onClick={() => !isCurrent && router.push(`/patients/${adm.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-slate-600 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800 dark:text-white">
                          {adm.date.toLocaleDateString('en-AU', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 bg-cyan-600 text-white rounded-full text-xs">Current</span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          adm.status === 'DISCHARGED' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        }`}>
                          {adm.status.charAt(0) + adm.status.slice(1).toLowerCase().replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{adm.operationNotes}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {surgeon && <span>Surgeon: {surgeon.name}</span>}
                        {adm.location && <span>Location: {adm.location}</span>}
                      </div>
                    </div>
                  </div>
                  <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
