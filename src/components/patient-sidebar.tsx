'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Stethoscope,
  AlertTriangle,
  Activity,
  Scissors,
  FileText,
  Heart,
  Pill,
  LogOut as LogOutIcon,
  Truck,
  Phone,
  CheckSquare,
  BarChart3,
} from 'lucide-react'

interface SidebarProps {
  admissionId: string
}

interface NavSection {
  title: string
  icon: React.ReactNode
  items: { label: string; href: string; icon?: React.ReactNode }[]
}

export default function PatientSidebar({ admissionId }: SidebarProps) {
  const pathname = usePathname()
  const basePath = `/patients/${admissionId}`
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    admission: true,
    operation: true,
    recovery: true,
    ward: false,
    discharge: false,
  })

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const sections: (NavSection & { key: string })[] = [
    {
      key: 'admission',
      title: 'Admission',
      icon: <ClipboardList className="w-4 h-4" />,
      items: [
        { label: 'Nursing Admission', href: `${basePath}/admission` },
        { label: 'Pre-Anaesthetic', href: `${basePath}/pre-anaesthetic` },
        { label: 'Falls Risk', href: `${basePath}/falls-risk` },
        { label: 'Pressure Risk', href: `${basePath}/pressure-risk` },
        { label: 'Delirium Risk', href: `${basePath}/falls-risk` },
        { label: 'VTE Risk', href: `${basePath}/falls-risk` },
      ],
    },
    {
      key: 'operation',
      title: 'Operation',
      icon: <Scissors className="w-4 h-4" />,
      items: [
        { label: 'Surgical Checklist', href: `${basePath}/surgical-checklist` },
        { label: 'Count Sheet', href: `${basePath}/surgical-checklist` },
        { label: 'Intra-Operative', href: `${basePath}/surgical-checklist` },
        { label: 'Prostheses/Implants', href: `${basePath}/surgical-checklist` },
        { label: 'Operation Report', href: `${basePath}/operation-report` },
      ],
    },
    {
      key: 'recovery',
      title: 'Recovery',
      icon: <Heart className="w-4 h-4" />,
      items: [
        { label: 'Stage 1', href: `${basePath}/recovery` },
        { label: 'Stage 2', href: `${basePath}/recovery` },
        { label: 'Fluid Balance', href: `${basePath}/recovery` },
      ],
    },
    {
      key: 'ward',
      title: 'Ward',
      icon: <Activity className="w-4 h-4" />,
      items: [
        { label: 'Fluid Balance', href: `${basePath}/recovery` },
        { label: 'Handover from Recovery', href: `${basePath}/handover` },
      ],
    },
    {
      key: 'discharge',
      title: 'Discharge',
      icon: <LogOutIcon className="w-4 h-4" />,
      items: [
        { label: 'Patient Transfer', href: `${basePath}/discharge` },
        { label: 'Discharge Checklist', href: `${basePath}/discharge` },
        { label: 'Discharge Summary', href: `${basePath}/discharge` },
        { label: 'Post Op Call Details', href: `${basePath}/discharge` },
        { label: 'Emergency Resuscitation', href: `${basePath}/discharge` },
      ],
    },
  ]

  return (
    <div className="w-56 bg-gray-700 text-white min-h-full overflow-y-auto scrollbar-thin flex-shrink-0">
      {/* Quick Nav Icons */}
      <div className="flex gap-1 p-2 bg-gray-800">
        <Link href={`${basePath}`} className="p-2 rounded hover:bg-gray-600 transition-colors" title="Overview">
          <BarChart3 className="w-4 h-4" />
        </Link>
        <Link href={`${basePath}/obs`} className="p-2 rounded hover:bg-gray-600 transition-colors" title="Observations">
          <Activity className="w-4 h-4" />
        </Link>
        <Link href={`${basePath}/meds`} className="p-2 rounded hover:bg-gray-600 transition-colors" title="Medications">
          <Pill className="w-4 h-4" />
        </Link>
        <Link href={`${basePath}/notes`} className="p-2 rounded hover:bg-gray-600 transition-colors" title="Notes">
          <FileText className="w-4 h-4" />
        </Link>
        <Link href={`${basePath}/handover`} className="p-2 rounded hover:bg-gray-600 transition-colors" title="Handover">
          <Truck className="w-4 h-4" />
        </Link>
        <Link href={`${basePath}/events`} className="p-2 rounded hover:bg-gray-600 transition-colors" title="Events">
          <CheckSquare className="w-4 h-4" />
        </Link>
      </div>

      {/* Sections */}
      <nav className="py-2">
        {sections.map((section) => (
          <div key={section.key}>
            <button
              onClick={() => toggleSection(section.key)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center gap-2">
                {section.icon}
                {section.title}
              </div>
              {openSections[section.key] ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {openSections[section.key] && (
              <div className="pb-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`block pl-10 pr-4 py-2 text-sm transition-colors ${
                        isActive
                          ? 'bg-cyan-600 text-white'
                          : 'text-gray-300 hover:bg-gray-600 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}
