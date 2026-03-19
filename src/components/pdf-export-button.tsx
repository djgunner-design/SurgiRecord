'use client'

import { Printer } from 'lucide-react'
import { printOperationReport, printDischargeSummary, printConsentForm } from '@/lib/pdf-export'

type PatientInfo = {
  firstName: string
  lastName: string
  mrn: string
  dob: Date
  sex: string
  address?: string
  suburb?: string
  state?: string
  postcode?: string
  allergies?: string | null
}

type AdmissionInfo = {
  id: string
  date: Date
  operationNotes: string
  location: string
  surgeonName?: string | null
  anaesthetistName?: string | null
  procedureStartTime?: string | null
}

type PdfExportButtonProps = {
  type: 'operation-report' | 'discharge-summary' | 'consent-form'
  patient: PatientInfo
  admission: AdmissionInfo
}

export default function PdfExportButton({ type, patient, admission }: PdfExportButtonProps) {
  const handleExport = () => {
    switch (type) {
      case 'operation-report':
        printOperationReport(patient, admission)
        break
      case 'discharge-summary':
        printDischargeSummary(patient, admission)
        break
      case 'consent-form':
        printConsentForm(patient, admission)
        break
    }
  }

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 flex items-center gap-2 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
    >
      <Printer className="w-4 h-4" />
      Export PDF
    </button>
  )
}
