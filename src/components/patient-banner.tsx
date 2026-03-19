'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Printer, FileText, AlertTriangle, Heart, Shield, Pill } from 'lucide-react'

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
  }
  surgeonName: string | null
}

function getStatusBadge(status: string) {
  const colors: Record<string, string> = {
    DISCHARGED: 'bg-green-500',
    BOOKED: 'bg-blue-500',
    CANCELLED: 'bg-red-500',
    IN_THEATRE: 'bg-yellow-500',
    RECOVERY_1: 'bg-emerald-500',
    RECOVERY_2: 'bg-teal-500',
    ADMITTED: 'bg-sky-500',
  }
  const labels: Record<string, string> = {
    RECOVERY_1: 'Recovery Stage 1',
    RECOVERY_2: 'Recovery Stage 2',
    IN_THEATRE: 'In Theatre',
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

export default function PatientBanner({ admission, patient, surgeonName }: PatientBannerProps) {
  const router = useRouter()
  const bmi = calculateBMI(patient.weight, patient.height)
  const age = calculateAge(new Date(patient.dob))
  const status = getStatusBadge(admission.status)

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="grid grid-cols-12 gap-6">
          {/* Left: Patient Info */}
          <div className="col-span-4">
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0 ${
                patient.sex === 'Female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {patient.sex === 'Female' ? '♀' : '♂'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">MRN: {patient.mrn}</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  {patient.lastName} {patient.firstName} {patient.title}
                </h2>
                <div className="text-sm text-gray-600 mt-1">
                  <span>DOB: {new Date(patient.dob).toLocaleDateString('en-AU')} ({age})</span>
                  <span className="ml-3">Sex: <strong>{patient.sex}</strong></span>
                </div>
                <div className="text-sm text-gray-600 mt-1 flex gap-4">
                  {patient.weight && <span>Weight: {patient.weight}kg</span>}
                  {patient.height && <span>Height: {patient.height}cm</span>}
                  {bmi && <span className="text-cyan-600 font-medium">BMI: {bmi}</span>}
                </div>
                {patient.atsiStatus && (
                  <div className="text-xs text-gray-500 mt-1">A&TSI: {patient.atsiStatus}</div>
                )}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white mt-2 ${status.color}`}>
                  {status.label}
                </div>
                {patient.address && (
                  <div className="text-xs text-gray-400 mt-1">
                    {patient.address}, {patient.suburb}, {patient.state} {patient.postcode}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Middle: Operation Info */}
          <div className="col-span-4">
            <div className="space-y-2">
              {admission.covidStatus && (
                <div className="text-xs text-gray-500">Covid status: {admission.covidStatus}</div>
              )}
              {surgeonName && (
                <div className="text-sm font-medium text-cyan-700">Surgeon: {surgeonName}</div>
              )}
              <div>
                <div className="text-xs text-gray-500">Operation/notes:</div>
                <div className="text-sm font-medium text-gray-800 mt-0.5">{admission.operationNotes}</div>
              </div>
              <div className="flex gap-6 text-xs text-gray-500">
                {admission.lastFood && (
                  <span>Last food: {new Date(admission.lastFood).toLocaleString('en-AU', { dateStyle: 'short', timeStyle: 'short' })}</span>
                )}
                {admission.lastFluid && (
                  <span>Last fluid: {new Date(admission.lastFluid).toLocaleString('en-AU', { dateStyle: 'short', timeStyle: 'short' })}</span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Alerts & Quick Info */}
          <div className="col-span-4">
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm">
                <button className="text-cyan-600 hover:text-cyan-800 font-medium flex items-center gap-1">
                  <Heart className="w-4 h-4" /> Comorbidities
                </button>
                <button className="text-cyan-600 hover:text-cyan-800 font-medium flex items-center gap-1">
                  <Shield className="w-4 h-4" /> Risk Factors
                </button>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Alerts:</span>
              </div>
              <div className="text-sm flex items-center gap-2">
                <Pill className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Allergies:</span>
                <span className={patient.allergies?.includes('NIL') || !patient.allergies ? 'text-green-600' : 'text-red-600 font-medium'}>
                  {patient.allergies || 'No Allergies (NIL)'}
                </span>
              </div>
              {admission.procedureStartTime && (
                <div className="text-sm text-gray-600">
                  Procedure start time: <strong>{admission.procedureStartTime}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
