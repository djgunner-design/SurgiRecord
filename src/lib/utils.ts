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
    case 'PRE_ADMITTED': return 'bg-purple-100 border-purple-300'
    case 'BOOKED': return 'bg-blue-100 border-blue-300'
    case 'ARRIVED': return 'bg-yellow-100 border-yellow-300'
    case 'CHECKED_IN': return 'bg-orange-100 border-orange-300'
    case 'ANAESTHESIA_INDUCTION': return 'bg-pink-100 border-pink-300'
    case 'OPERATION_STARTED': return 'bg-red-100 border-red-300'
    case 'RECOVERY_1': return 'bg-green-100 border-green-300'
    case 'WARD': return 'bg-emerald-100 border-emerald-300'
    case 'RECOVERY_2': return 'bg-teal-100 border-teal-300'
    case 'DISCHARGED': return 'bg-gray-100 border-gray-300'
    case 'CANCELLED': return 'bg-gray-200 border-gray-400'
    default: return 'bg-gray-50 border-gray-200'
  }
}

export { getStatusLabel } from '@/lib/sample-data'
