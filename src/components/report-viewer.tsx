'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Printer } from 'lucide-react'

interface ReportViewerProps {
  isOpen: boolean
  onClose: () => void
  reportName: string
  reportDate: string
  patientName: string
  admissionId: string
}

function generateReportContent(reportName: string, patientName: string, reportDate: string, admissionId: string): string[][] {
  const header = `${reportName}\n\nPatient: ${patientName}\nDate: ${reportDate}\nAdmission ID: ${admissionId}\n`

  switch (reportName) {
    case 'Nursing Admission':
      return [
        [
          header,
          '--- NURSING ADMISSION ASSESSMENT ---',
          '',
          'Time of Admission: 06:41',
          'Mode of Arrival: Ambulatory',
          'Accompanied By: Partner',
          '',
          'Pre-Operative Assessment:',
          '  Fasting Status: Confirmed NBM from 19:30 previous evening',
          '  Identification Band: Applied and checked',
          '  Consent Form: Signed and verified',
          '  Allergy Band: Applied (NIL known allergies)',
          '  Site Marking: Confirmed by surgeon',
          '',
          'Vital Signs on Admission:',
          '  BP: 117/64 mmHg',
          '  HR: 86 bpm',
          '  Temp: 36.6 C',
          '  SpO2: 100% on RA',
          '  RR: 14 breaths/min',
          '',
          'Pre-Operative Checklist:',
          '  [x] Patient ID verified',
          '  [x] Consent verified',
          '  [x] Site marked',
          '  [x] Prosthesis/implants removed',
          '  [x] TED stockings applied',
        ].join('\n'),
        [
          header,
          '--- NURSING ADMISSION (continued) ---',
          '',
          'Medication Reconciliation:',
          '  Regular Medications: As per medication chart',
          '  Last dose taken: Previous evening',
          '',
          'Patient History:',
          '  Previous Surgeries: None reported',
          '  Known Medical Conditions: Nil significant',
          '  Mobility: Independent',
          '  Falls Risk Assessment: Low Risk (Score 2)',
          '  Pressure Injury Risk: No Risk (Score 0)',
          '',
          'Patient Education:',
          '  Post-operative instructions discussed',
          '  Expected recovery timeline explained',
          '  Pain management plan reviewed',
          '',
          'Nursing Notes:',
          '  Patient appears relaxed and well-prepared.',
          '  All pre-operative requirements completed.',
          '  Ready for theatre.',
          '',
          'Admitted By: KLE (Kerry Lentini)',
          'Signature: ________________________',
        ].join('\n'),
      ]

    case 'Surgical Checklist':
      return [
        [
          header,
          '--- SURGICAL SAFETY CHECKLIST ---',
          '',
          'SIGN IN (Before Induction)',
          '',
          '  Patient Identity Confirmed: YES',
          '  Procedure & Site Confirmed: YES',
          '  Consent Signed: YES',
          '  Site Marked: YES',
          '  Anaesthesia Machine Check: COMPLETE',
          '  Pulse Oximeter Attached: YES',
          '',
          '  Known Allergy: No known allergies',
          '  Difficult Airway / Aspiration Risk: NO',
          '  Risk of Blood Loss > 500ml: NO',
          '',
          'TIME OUT (Before Skin Incision)',
          '',
          '  All team members introduced: YES',
          '  Patient name, procedure confirmed: YES',
          '  Anticipated critical events reviewed:',
          '    Surgeon: Standard procedure, no anticipated issues',
          '    Anaesthetist: Standard GA, no concerns',
          '    Nursing: All equipment verified',
          '  Antibiotic prophylaxis given: YES (within 60 min)',
          '  Essential imaging displayed: N/A',
        ].join('\n'),
        [
          header,
          '--- SURGICAL SAFETY CHECKLIST (continued) ---',
          '',
          'SIGN OUT (Before Patient Leaves Theatre)',
          '',
          '  Procedure Recorded: YES',
          '  Instrument, Sponge, Needle Count: CORRECT',
          '  Specimen Labelling: Confirmed',
          '  Equipment Problems: NONE',
          '',
          '  Key Concerns for Recovery:',
          '    - Standard post-op observations',
          '    - Monitor drainage output',
          '    - Pain management as charted',
          '',
          'Checklist Completed By:',
          '  Surgeon: Dr David Sharp',
          '  Anaesthetist: Emma Layt',
          '  Scrub Nurse: Monica Roberts',
          '',
          'Time Completed: ____________',
          'Signature: ________________________',
        ].join('\n'),
      ]

    case 'Countsheet':
      return [
        [
          header,
          '--- INSTRUMENT & SPONGE COUNT SHEET ---',
          '',
          'Theatre: Theatre 1',
          'Procedure Start: 08:01',
          '',
          'INITIAL COUNT:',
          '  Sponges (Large):     10   [x] Verified',
          '  Sponges (Small):      5   [x] Verified',
          '  Swabs:               10   [x] Verified',
          '  Needles:              3   [x] Verified',
          '  Blades:               2   [x] Verified',
          '  Instruments:         42   [x] Verified',
          '',
          'ADDITIONAL ITEMS:',
          '  Nil additional items opened during procedure',
          '',
          'FINAL COUNT:',
          '  Sponges (Large):     10   [x] Correct',
          '  Sponges (Small):      5   [x] Correct',
          '  Swabs:               10   [x] Correct',
          '  Needles:              3   [x] Correct',
          '  Blades:               2   [x] Correct',
          '  Instruments:         42   [x] Correct',
          '',
          'COUNT STATUS: ALL CORRECT',
          '',
          'Counted By: MOR (Monica Roberts)',
          'Verified By: GCA (Gary Cadwallender)',
        ].join('\n'),
      ]

    case 'Intraoperative Record':
      return [
        [
          header,
          '--- INTRAOPERATIVE RECORD ---',
          '',
          'Surgeon: Dr David Sharp',
          'Anaesthetist: Emma Layt',
          'Scrub Nurse: Monica Roberts',
          'Scout Nurse: Gary Cadwallender',
          '',
          'Anaesthesia Type: General Anaesthesia',
          'Airway: LMA',
          '',
          'Procedure Timeline:',
          '  Patient In:       08:01',
          '  Anaesthesia Start: 08:05',
          '  Incision:         08:22',
          '  Procedure End:    11:15',
          '  Patient Out:      11:30',
          '',
          'Intraoperative Fluids:',
          '  Crystalloid (Hartmanns): 2000ml',
          '  Estimated Blood Loss: 150ml',
          '',
          'Specimens:',
          '  Nil specimens collected',
          '',
          'Implants/Prostheses:',
          '  Bilateral breast implants - details as per op notes',
        ].join('\n'),
        [
          header,
          '--- INTRAOPERATIVE RECORD (continued) ---',
          '',
          'Drain Output:',
          '  Left drain: Insitu',
          '  Right drain: Insitu',
          '',
          'Positioning: Supine',
          'Diathermy: Monopolar - pad site: left thigh',
          '  Skin condition pre: Intact',
          '  Skin condition post: Intact',
          '',
          'Tourniquet: Not used',
          '',
          'Intraoperative Notes:',
          '  Procedure uneventful.',
          '  Haemostasis achieved.',
          '  All counts correct.',
          '',
          'Post-Operative Orders:',
          '  - Regular observations',
          '  - Monitor drain output',
          '  - IV fluids as charted',
          '  - Analgesia as charted',
          '',
          'Completed By: MOR (Monica Roberts)',
          'Signature: ________________________',
        ].join('\n'),
      ]

    case 'Operation Report':
      return [
        [
          header,
          '--- OPERATION REPORT ---',
          '',
          'Surgeon: Dr David Sharp',
          'Assistant: Nil',
          'Anaesthetist: Emma Layt',
          '',
          'Pre-Operative Diagnosis:',
          '  Cosmetic - Abdominal laxity, breast ptosis',
          '',
          'Post-Operative Diagnosis:',
          '  Same as above',
          '',
          'Procedure Performed:',
          '  Abdominoplasty and Mastopexy with',
          '  Bilateral Breast Augmentation',
          '',
          'Anaesthesia: General',
          '',
          'Operative Findings:',
          '  Standard anatomy. No unexpected findings.',
          '',
          'Procedure Details:',
          '  Standard abdominoplasty performed with',
          '  umbilical transposition. Mastopexy with',
          '  augmentation using sub-muscular implants',
          '  bilaterally.',
          '',
          'Estimated Blood Loss: 150ml',
          'Complications: Nil',
        ].join('\n'),
        [
          header,
          '--- OPERATION REPORT (continued) ---',
          '',
          'Drains: x2 Blake drains',
          '  Left: Insitu, minimal output',
          '  Right: Insitu, minimal output',
          '',
          'Dressings:',
          '  Abdominal binder applied',
          '  Surgical bra applied',
          '  Waterproof dressings to all incision sites',
          '',
          'Post-Operative Instructions:',
          '  - Bed rest for 24 hours',
          '  - Drain management as per protocol',
          '  - Review in 1 week',
          '  - Compression garments for 6 weeks',
          '  - No heavy lifting for 6 weeks',
          '',
          'Follow Up: 1 week post-op in rooms',
          '',
          'Dictated By: Dr David Sharp',
          'Date: ' + new Date().toLocaleDateString('en-AU'),
          '',
          'Signature: ________________________',
        ].join('\n'),
      ]

    default:
      return [
        [
          header,
          `--- ${reportName.toUpperCase()} ---`,
          '',
          'Report content for this document type',
          'is not yet available in the system.',
          '',
          'Please contact administration for',
          'a copy of this report.',
        ].join('\n'),
      ]
  }
}

export default function ReportViewer({ isOpen, onClose, reportName, reportDate, patientName, admissionId }: ReportViewerProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [zoom, setZoom] = useState(100)

  if (!isOpen) return null

  const pages = generateReportContent(reportName, patientName, reportDate, admissionId)
  const totalPages = pages.length

  const handlePrev = () => setCurrentPage(p => Math.max(0, p - 1))
  const handleNext = () => setCurrentPage(p => Math.min(totalPages - 1, p + 1))
  const handleZoomIn = () => setZoom(z => Math.min(200, z + 25))
  const handleZoomOut = () => setZoom(z => Math.max(50, z - 25))

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white truncate">{reportName}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
              title="Print report"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors">
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-gray-100 dark:border-slate-700 flex-shrink-0 bg-gray-50 dark:bg-slate-750">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-gray-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-300 min-w-[100px] text-center">
              Page {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-gray-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-gray-300"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px] text-center">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-gray-300"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-100 dark:bg-slate-900">
          <div
            className="bg-white dark:bg-slate-800 mx-auto shadow-lg border border-gray-200 dark:border-slate-700 rounded"
            style={{
              width: `${Math.round(595 * (zoom / 100))}px`,
              minHeight: `${Math.round(842 * (zoom / 100))}px`,
              padding: `${Math.round(40 * (zoom / 100))}px`,
              transformOrigin: 'top center',
            }}
          >
            <pre
              className="whitespace-pre-wrap font-mono text-gray-800 dark:text-gray-200 leading-relaxed"
              style={{ fontSize: `${Math.round(11 * (zoom / 100))}px` }}
            >
              {pages[currentPage]}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
