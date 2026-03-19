import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateBMI(weight: number | null, height: number | null): string | null {
  if (!weight || !height) return null
  const heightM = height / 100
  return (weight / (heightM * heightM)).toFixed(2)
}

export function calculateAge(dob: Date): string {
  const now = new Date()
  const years = now.getFullYear() - dob.getFullYear()
  const months = now.getMonth() - dob.getMonth()
  if (months < 0) {
    return `${years - 1} years ${months + 12} months`
  }
  return `${years} years ${months} months`
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return `${d.toISOString().split('T')[0]} ${d.toTimeString().slice(0, 5)}`
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'DISCHARGED': return 'bg-green-100 border-green-300'
    case 'BOOKED': return 'bg-blue-100 border-blue-300'
    case 'CANCELLED': return 'bg-red-100 border-red-300'
    case 'IN_THEATRE': return 'bg-yellow-100 border-yellow-300'
    case 'RECOVERY_1': return 'bg-emerald-50 border-emerald-200'
    case 'RECOVERY_2': return 'bg-emerald-100 border-emerald-300'
    case 'ADMITTED': return 'bg-sky-50 border-sky-200'
    default: return 'bg-gray-50 border-gray-200'
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'RECOVERY_1': return 'Recovery Stage 1'
    case 'RECOVERY_2': return 'Recovery Stage 2'
    case 'IN_THEATRE': return 'In Theatre'
    default: return status.charAt(0) + status.slice(1).toLowerCase()
  }
}
