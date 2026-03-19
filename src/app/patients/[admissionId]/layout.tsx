'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Home, Settings, ArrowLeft, Activity, Pill, FileText, Truck, CheckSquare, ClipboardList } from 'lucide-react'
import PatientBanner from '@/components/patient-banner'
import PatientSidebar from '@/components/patient-sidebar'
import { findAdmission, findPatient, findUser } from '@/lib/sample-data'

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const router = useRouter()
  const admissionId = params.admissionId as string
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const name = document.cookie.split('; ').find(c => c.startsWith('userName='))?.split('=')[1]
    if (name) setUserName(decodeURIComponent(name))
  }, [])

  const admission = findAdmission(admissionId)
  if (!admission) {
    return <div className="p-8 text-center text-gray-500">Admission not found</div>
  }

  const patient = findPatient(admission.patientId)
  if (!patient) {
    return <div className="p-8 text-center text-gray-500">Patient not found</div>
  }

  const surgeon = admission.surgeonId ? findUser(admission.surgeonId) : null

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/dashboard')} className="p-2 text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SR</span>
            </div>
            <span className="text-lg font-semibold text-gray-800">SurgiRecord</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => router.push(`/patients/${admissionId}/obs`)} className="px-3 py-1.5 text-xs font-medium bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">OBS</button>
            <button onClick={() => router.push(`/patients/${admissionId}/meds`)} className="px-3 py-1.5 text-xs font-medium bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">Meds</button>
            <button onClick={() => router.push(`/patients/${admissionId}/handover`)} className="px-3 py-1.5 text-xs font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">Handover</button>
            <button onClick={() => router.push(`/patients/${admissionId}/notes`)} className="px-3 py-1.5 text-xs font-medium bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">Notes</button>
            <button onClick={() => router.push(`/patients/${admissionId}/events`)} className="px-3 py-1.5 text-xs font-medium bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">Events</button>
            <button className="px-3 py-1.5 text-xs font-medium bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">Care Plan</button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{userName}</span>
          </div>
        </div>
      </header>

      {/* Patient Banner */}
      <PatientBanner
        admission={{
          ...admission,
          lastFood: admission.lastFood,
          lastFluid: admission.lastFluid,
        }}
        patient={{
          ...patient,
          dob: patient.dob,
        }}
        surgeonName={surgeon ? surgeon.name : null}
      />

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <PatientSidebar admissionId={admissionId} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
