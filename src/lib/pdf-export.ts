'use client'

// PDF Export using browser's built-in window.print() with print-specific CSS
// Creates a hidden div with formatted HTML, triggers print, then removes the div

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

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatDob(date: Date): string {
  return date.toLocaleDateString('en-AU', { day: '2-digit', month: 'long', year: 'numeric' })
}

function calculateAge(dob: Date): number {
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return age
}

function createPrintStyles(): string {
  return `
    @media print {
      body > *:not(#print-container) { display: none !important; }
      #print-container { display: block !important; }
    }
    #print-container {
      display: none;
      font-family: 'Segoe UI', Arial, sans-serif;
      color: #1a1a1a;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    #print-container h1 {
      font-size: 22px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 4px;
      color: #111;
    }
    #print-container .print-subtitle {
      text-align: center;
      font-size: 12px;
      color: #666;
      margin-bottom: 24px;
    }
    #print-container .print-header {
      border-bottom: 2px solid #0891b2;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    #print-container .print-section {
      margin-bottom: 20px;
    }
    #print-container .print-section-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      color: #0891b2;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 6px;
      margin-bottom: 12px;
    }
    #print-container .print-field {
      display: flex;
      margin-bottom: 8px;
      font-size: 13px;
    }
    #print-container .print-label {
      font-weight: 600;
      min-width: 180px;
      color: #374151;
    }
    #print-container .print-value {
      color: #1a1a1a;
      flex: 1;
    }
    #print-container .print-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 24px;
    }
    #print-container table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    #print-container th {
      background: #f3f4f6;
      text-align: left;
      padding: 8px 12px;
      font-weight: 600;
      border: 1px solid #d1d5db;
    }
    #print-container td {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
    }
    #print-container .print-signature {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
    }
    #print-container .print-sig-line {
      width: 200px;
      border-top: 1px solid #000;
      padding-top: 6px;
      font-size: 12px;
      color: #374151;
    }
    #print-container .print-footer {
      margin-top: 40px;
      text-align: center;
      font-size: 10px;
      color: #9ca3af;
      border-top: 1px solid #e5e7eb;
      padding-top: 12px;
    }
    #print-container .print-alert {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 13px;
      margin-bottom: 16px;
    }
  `
}

function patientHeaderHtml(patient: PatientInfo): string {
  return `
    <div class="print-section">
      <div class="print-section-title">Patient Details</div>
      <div class="print-grid">
        <div class="print-field">
          <span class="print-label">Name:</span>
          <span class="print-value">${patient.lastName}, ${patient.firstName}</span>
        </div>
        <div class="print-field">
          <span class="print-label">MRN:</span>
          <span class="print-value">${patient.mrn}</span>
        </div>
        <div class="print-field">
          <span class="print-label">Date of Birth:</span>
          <span class="print-value">${formatDob(patient.dob)} (Age ${calculateAge(patient.dob)})</span>
        </div>
        <div class="print-field">
          <span class="print-label">Sex:</span>
          <span class="print-value">${patient.sex}</span>
        </div>
        ${patient.address ? `
        <div class="print-field">
          <span class="print-label">Address:</span>
          <span class="print-value">${patient.address}, ${patient.suburb} ${patient.state} ${patient.postcode}</span>
        </div>` : ''}
      </div>
      ${patient.allergies ? `<div class="print-alert"><strong>Allergies:</strong> ${patient.allergies}</div>` : ''}
    </div>
  `
}

function triggerPrint(html: string) {
  // Remove any existing print container
  const existing = document.getElementById('print-container')
  if (existing) existing.remove()
  const existingStyle = document.getElementById('print-styles')
  if (existingStyle) existingStyle.remove()

  // Add print styles
  const styleEl = document.createElement('style')
  styleEl.id = 'print-styles'
  styleEl.textContent = createPrintStyles()
  document.head.appendChild(styleEl)

  // Create print container
  const container = document.createElement('div')
  container.id = 'print-container'
  container.innerHTML = html
  document.body.appendChild(container)

  // Trigger print
  setTimeout(() => {
    window.print()
    // Cleanup after print dialog closes
    setTimeout(() => {
      container.remove()
      styleEl.remove()
    }, 1000)
  }, 100)
}

export function printOperationReport(patient: PatientInfo, admission: AdmissionInfo) {
  const html = `
    <div class="print-header">
      <h1>OPERATION REPORT</h1>
      <div class="print-subtitle">SurgiRecord Theatre Management System</div>
    </div>

    ${patientHeaderHtml(patient)}

    <div class="print-section">
      <div class="print-section-title">Operation Details</div>
      <div class="print-field">
        <span class="print-label">Date of Procedure:</span>
        <span class="print-value">${formatDate(admission.date)}</span>
      </div>
      <div class="print-field">
        <span class="print-label">Procedure Start Time:</span>
        <span class="print-value">${admission.procedureStartTime || 'N/A'}</span>
      </div>
      <div class="print-field">
        <span class="print-label">Location:</span>
        <span class="print-value">${admission.location}</span>
      </div>
      <div class="print-field">
        <span class="print-label">Surgeon:</span>
        <span class="print-value">${admission.surgeonName || 'N/A'}</span>
      </div>
      <div class="print-field">
        <span class="print-label">Anaesthetist:</span>
        <span class="print-value">${admission.anaesthetistName || 'N/A'}</span>
      </div>
    </div>

    <div class="print-section">
      <div class="print-section-title">Procedure Performed</div>
      <p style="font-size: 13px; line-height: 1.6;">${admission.operationNotes}</p>
    </div>

    <div class="print-section">
      <div class="print-section-title">Findings</div>
      <p style="font-size: 13px; line-height: 1.6; min-height: 60px; border-bottom: 1px dotted #d1d5db;"></p>
    </div>

    <div class="print-section">
      <div class="print-section-title">Complications</div>
      <p style="font-size: 13px; line-height: 1.6; min-height: 40px; border-bottom: 1px dotted #d1d5db;"></p>
    </div>

    <div class="print-section">
      <div class="print-section-title">Post-Operative Instructions</div>
      <p style="font-size: 13px; line-height: 1.6; min-height: 60px; border-bottom: 1px dotted #d1d5db;"></p>
    </div>

    <div class="print-signature">
      <div class="print-sig-line">Surgeon Signature</div>
      <div class="print-sig-line">Date</div>
    </div>

    <div class="print-footer">
      Generated by SurgiRecord &mdash; ${new Date().toLocaleString('en-AU')}
    </div>
  `
  triggerPrint(html)
}

export function printDischargeSummary(patient: PatientInfo, admission: AdmissionInfo) {
  const html = `
    <div class="print-header">
      <h1>DISCHARGE SUMMARY</h1>
      <div class="print-subtitle">SurgiRecord Theatre Management System</div>
    </div>

    ${patientHeaderHtml(patient)}

    <div class="print-section">
      <div class="print-section-title">Admission Details</div>
      <div class="print-grid">
        <div class="print-field">
          <span class="print-label">Admission Date:</span>
          <span class="print-value">${formatDate(admission.date)}</span>
        </div>
        <div class="print-field">
          <span class="print-label">Location:</span>
          <span class="print-value">${admission.location}</span>
        </div>
        <div class="print-field">
          <span class="print-label">Surgeon:</span>
          <span class="print-value">${admission.surgeonName || 'N/A'}</span>
        </div>
        <div class="print-field">
          <span class="print-label">Anaesthetist:</span>
          <span class="print-value">${admission.anaesthetistName || 'N/A'}</span>
        </div>
      </div>
    </div>

    <div class="print-section">
      <div class="print-section-title">Procedure Performed</div>
      <p style="font-size: 13px; line-height: 1.6;">${admission.operationNotes}</p>
    </div>

    <div class="print-section">
      <div class="print-section-title">Discharge Details</div>
      <div class="print-field">
        <span class="print-label">Discharge Date:</span>
        <span class="print-value">${formatDate(new Date())}</span>
      </div>
      <div class="print-field">
        <span class="print-label">Discharge Type:</span>
        <span class="print-value" style="min-width: 200px; border-bottom: 1px dotted #d1d5db;">&nbsp;</span>
      </div>
    </div>

    <div class="print-section">
      <div class="print-section-title">Post-Operative Instructions</div>
      <p style="font-size: 13px; line-height: 1.6; min-height: 80px; border-bottom: 1px dotted #d1d5db;"></p>
    </div>

    <div class="print-section">
      <div class="print-section-title">Medications on Discharge</div>
      <p style="font-size: 13px; line-height: 1.6; min-height: 60px; border-bottom: 1px dotted #d1d5db;"></p>
    </div>

    <div class="print-section">
      <div class="print-section-title">Follow-Up Arrangements</div>
      <p style="font-size: 13px; line-height: 1.6; min-height: 40px; border-bottom: 1px dotted #d1d5db;"></p>
    </div>

    <div class="print-signature">
      <div class="print-sig-line">Discharging Nurse</div>
      <div class="print-sig-line">Patient / Escort Signature</div>
      <div class="print-sig-line">Date / Time</div>
    </div>

    <div class="print-footer">
      Generated by SurgiRecord &mdash; ${new Date().toLocaleString('en-AU')}
    </div>
  `
  triggerPrint(html)
}

export function printConsentForm(patient: PatientInfo, admission: AdmissionInfo) {
  const html = `
    <div class="print-header">
      <h1>INFORMED CONSENT FOR PROCEDURE</h1>
      <div class="print-subtitle">SurgiRecord Theatre Management System</div>
    </div>

    ${patientHeaderHtml(patient)}

    <div class="print-section">
      <div class="print-section-title">Procedure Information</div>
      <div class="print-field">
        <span class="print-label">Proposed Procedure:</span>
        <span class="print-value">${admission.operationNotes}</span>
      </div>
      <div class="print-field">
        <span class="print-label">Surgeon:</span>
        <span class="print-value">${admission.surgeonName || 'N/A'}</span>
      </div>
      <div class="print-field">
        <span class="print-label">Anaesthetist:</span>
        <span class="print-value">${admission.anaesthetistName || 'N/A'}</span>
      </div>
      <div class="print-field">
        <span class="print-label">Scheduled Date:</span>
        <span class="print-value">${formatDate(admission.date)}</span>
      </div>
    </div>

    <div class="print-section">
      <div class="print-section-title">Patient Declaration</div>
      <div style="font-size: 13px; line-height: 1.8;">
        <p>I, the undersigned, confirm that:</p>
        <ul style="margin: 8px 0; padding-left: 24px;">
          <li>The nature and purpose of the proposed procedure has been explained to me.</li>
          <li>The risks, benefits, and alternative treatments have been discussed with me.</li>
          <li>I have had the opportunity to ask questions and have received satisfactory answers.</li>
          <li>I understand that the procedure may need to be modified or extended during the course of the operation.</li>
          <li>I consent to the administration of anaesthesia as deemed necessary.</li>
          <li>I have disclosed all relevant medical history and medications.</li>
        </ul>
      </div>
    </div>

    ${patient.allergies ? `<div class="print-alert"><strong>Known Allergies:</strong> ${patient.allergies}</div>` : ''}

    <div class="print-signature" style="margin-top: 30px;">
      <div class="print-sig-line">Patient Signature</div>
      <div class="print-sig-line">Date</div>
    </div>
    <div class="print-signature" style="margin-top: 30px;">
      <div class="print-sig-line">Surgeon Signature</div>
      <div class="print-sig-line">Date</div>
    </div>
    <div class="print-signature" style="margin-top: 30px;">
      <div class="print-sig-line">Witness Signature</div>
      <div class="print-sig-line">Date</div>
    </div>

    <div class="print-footer">
      Generated by SurgiRecord &mdash; ${new Date().toLocaleString('en-AU')}
    </div>
  `
  triggerPrint(html)
}
