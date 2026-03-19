'use client'

import { useState, useRef, useCallback } from 'react'
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
  Menu,
  X,
  Camera,
  Star,
} from 'lucide-react'
import { getStepCompletion, setStepCompleted } from '@/lib/store'

interface SidebarProps {
  admissionId: string
  collapsed?: boolean
  onToggle?: () => void
}

interface NavSection {
  title: string
  icon: React.ReactNode
  items: { label: string; href: string; icon?: React.ReactNode }[]
}

function CompletionIndicator({ completed, onToggle }: { completed: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle() }}
      className="flex-shrink-0 w-5 h-5 flex items-center justify-center"
      title={completed ? 'Mark as incomplete' : 'Mark as complete'}
    >
      {completed ? (
        <span className="text-green-400 text-sm">&#x2705;</span>
      ) : (
        <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-400 dark:border-slate-500 inline-block" />
      )}
    </button>
  )
}

export default function PatientSidebar({ admissionId, collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const basePath = `/patients/${admissionId}`
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    admission: true,
    operation: true,
    recovery: true,
    ward: false,
    discharge: false,
    documents: false,
  })
  const [completionState, setCompletionState] = useState(() => getStepCompletion(admissionId))

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const scrollToSection = useCallback((key: string) => {
    // Expand section first
    setOpenSections(prev => ({ ...prev, [key]: true }))
    // Scroll to it after a tick
    setTimeout(() => {
      sectionRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }, [])

  const handleToggleCompletion = (step: string) => {
    const current = completionState[step] ?? false
    setStepCompleted(admissionId, step, !current)
    setCompletionState(prev => ({ ...prev, [step]: !current }))
  }

  const isCollapsed = collapsed ?? false

  const sections: (NavSection & { key: string })[] = [
    {
      key: 'admission',
      title: 'Admission',
      icon: <ClipboardList className="w-4 h-4" />,
      items: [
        { label: 'Nursing Admission', href: `${basePath}/admission` },
        { label: 'Pre-Anaesthetic', href: `${basePath}/pre-anaesthetic` },
        { label: 'Anaesthetic Record', href: `${basePath}/anaesthetic` },
        { label: 'Health Assessment', href: `${basePath}/health-assessment` },
        { label: 'Falls Risk', href: `${basePath}/falls-risk` },
        { label: 'Pressure Risk', href: `${basePath}/pressure-risk` },
        { label: 'Delirium Risk', href: `${basePath}/delirium-risk` },
        { label: 'VTE Risk', href: `${basePath}/vte-risk` },
      ],
    },
    {
      key: 'operation',
      title: 'Operation',
      icon: <Scissors className="w-4 h-4" />,
      items: [
        { label: 'Surgical Checklist', href: `${basePath}/surgical-checklist` },
        { label: 'Count Sheet', href: `${basePath}/count-sheet` },
        { label: 'Intra-Operative', href: `${basePath}/intra-operative` },
        { label: 'Prostheses/Implants', href: `${basePath}/implants` },
        { label: 'Operation Report', href: `${basePath}/operation-report` },
        { label: 'Favourites', href: `${basePath}/favourites` },
      ],
    },
    {
      key: 'recovery',
      title: 'Recovery',
      icon: <Heart className="w-4 h-4" />,
      items: [
        { label: 'Stage 1', href: `${basePath}/recovery` },
        { label: 'Stage 2', href: `${basePath}/recovery` },
        { label: 'Fluid Balance', href: `${basePath}/fluid-balance` },
      ],
    },
    {
      key: 'ward',
      title: 'Ward',
      icon: <Activity className="w-4 h-4" />,
      items: [
        { label: 'Fluid Balance', href: `${basePath}/fluid-balance` },
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
        { label: 'Post-Op Calls', href: `${basePath}/post-op-calls`, icon: <Phone className="w-3 h-3" /> },
        { label: 'Emergency Resuscitation', href: `${basePath}/discharge` },
      ],
    },
    {
      key: 'documents',
      title: 'Documents',
      icon: <Camera className="w-4 h-4" />,
      items: [
        { label: 'Consent Forms', href: `${basePath}/consent` },
        { label: 'Photos & Scans', href: `${basePath}/photos` },
        { label: 'Body Chart', href: `${basePath}/body-chart` },
      ],
    },
  ]

  // Quick nav icon definitions matching the 6 main sections
  const quickNavIcons = [
    { key: 'admission', icon: <ClipboardList className="w-4 h-4" />, title: 'Admission' },
    { key: 'operation', icon: <Scissors className="w-4 h-4" />, title: 'Operation' },
    { key: 'recovery', icon: <Heart className="w-4 h-4" />, title: 'Recovery' },
    { key: 'ward', icon: <Activity className="w-4 h-4" />, title: 'Ward' },
    { key: 'discharge', icon: <LogOutIcon className="w-4 h-4" />, title: 'Discharge' },
    { key: 'documents', icon: <Camera className="w-4 h-4" />, title: 'Documents' },
  ]

  // Calculate section completion
  const getSectionCompletion = (section: NavSection) => {
    const completable = section.items.filter(i => i.label !== 'Favourites' && i.label !== 'Post-Op Calls')
    if (completable.length === 0) return null
    const done = completable.filter(i => completionState[i.label]).length
    return { done, total: completable.length }
  }

  const sidebarContent = (
    <>
      {/* Quick Nav Icon Bar */}
      <div className="flex items-center justify-between gap-0.5 px-2 py-2 bg-gray-800 dark:bg-slate-900 border-b border-gray-600 dark:border-slate-700">
        {quickNavIcons.map((nav) => (
          <button
            key={nav.key}
            onClick={() => scrollToSection(nav.key)}
            className="p-2 rounded hover:bg-gray-600 dark:hover:bg-slate-700 transition-colors flex-1 flex items-center justify-center"
            title={nav.title}
          >
            {nav.icon}
          </button>
        ))}
      </div>

      {/* Sections */}
      <nav className="py-2">
        {sections.map((section) => {
          const sectionCompletion = getSectionCompletion(section)
          return (
            <div key={section.key} ref={(el) => { sectionRefs.current[section.key] = el }}>
              <button
                onClick={() => toggleSection(section.key)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium hover:bg-gray-600 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {section.icon}
                  {section.title}
                  {sectionCompletion && (
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 ml-1">
                      {sectionCompletion.done}/{sectionCompletion.total}
                    </span>
                  )}
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
                    const isCompletable = item.label !== 'Favourites' && item.label !== 'Post-Op Calls'
                    const isCompleted = completionState[item.label] ?? false

                    return (
                      <div
                        key={item.label}
                        className={`flex items-center gap-2 transition-colors ${
                          isActive
                            ? 'bg-cyan-600 text-white'
                            : 'text-gray-300 dark:text-slate-300 hover:bg-gray-600 dark:hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        {isCompletable && (
                          <div className="pl-3">
                            <CompletionIndicator
                              completed={isCompleted}
                              onToggle={() => handleToggleCompletion(item.label)}
                            />
                          </div>
                        )}
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`block flex-1 ${isCompletable ? 'pl-1' : 'pl-10'} pr-4 py-2 text-sm`}
                        >
                          {item.label}
                        </Link>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </>
  )

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={`fixed top-0 left-0 h-full z-50 w-64 bg-gray-700 dark:bg-slate-800 text-white transform transition-transform duration-300 md:hidden ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-3 bg-gray-800 dark:bg-slate-900">
          <span className="text-sm font-medium">Navigation</span>
          <button onClick={() => setMobileOpen(false)} className="p-1 hover:bg-gray-600 rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-48px)] scrollbar-thin">
          {sidebarContent}
        </div>
      </div>

      {/* Mobile menu button (floating) */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-4 left-4 z-30 md:hidden bg-cyan-600 text-white p-3 rounded-full shadow-lg hover:bg-cyan-700 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar */}
      <div className={`hidden md:block w-56 bg-gray-700 dark:bg-slate-800 text-white min-h-full overflow-y-auto scrollbar-thin flex-shrink-0 no-print ${
        isCollapsed ? 'md:hidden' : ''
      }`}>
        {sidebarContent}
      </div>
    </>
  )
}
