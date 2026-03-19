'use client'

import { useState, useEffect, useCallback } from 'react'
import { Star, Trash2, ChevronDown, BookmarkPlus, X, Users, User } from 'lucide-react'
import { getUserTemplates, addTemplate, deleteTemplate, NurseTemplateCategory, NurseTemplate } from '@/lib/store'

type TemplatePickerProps = {
  category: NurseTemplateCategory
  onApply: (fields: Record<string, string>) => void
  getCurrentFields: () => Record<string, string>
  fieldLabels?: Record<string, string>
}

export default function TemplatePicker({ category, onApply, getCurrentFields, fieldLabels }: TemplatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSaveOpen, setIsSaveOpen] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [isShared, setIsShared] = useState(false)
  const [templates, setTemplates] = useState<NurseTemplate[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  const getUserId = useCallback(() => {
    if (typeof document === 'undefined') return '1'
    return document.cookie.split('; ').find(c => c.startsWith('userId='))?.split('=')[1] || '1'
  }, [])

  useEffect(() => {
    const userId = getUserId()
    setTemplates(getUserTemplates(userId, category))
  }, [category, getUserId, refreshKey])

  const personalTemplates = templates.filter(t => t.userId !== 'shared')
  const sharedTemplates = templates.filter(t => t.userId === 'shared')

  const handleApply = (template: NurseTemplate) => {
    onApply(template.fields)
    setIsOpen(false)
  }

  const handleDelete = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const userId = getUserId()
    deleteTemplate(templateId, userId)
    setRefreshKey(k => k + 1)
  }

  const handleSave = () => {
    if (!templateName.trim()) return
    const userId = getUserId()
    const fields = getCurrentFields()
    addTemplate({
      userId: isShared ? 'shared' : userId,
      category,
      name: templateName.trim(),
      fields,
    })
    setTemplateName('')
    setIsShared(false)
    setIsSaveOpen(false)
    setRefreshKey(k => k + 1)
  }

  const formatFieldValue = (key: string, value: string) => {
    const label = fieldLabels?.[key] || key
    return `${label}: ${value}`
  }

  return (
    <div className="relative inline-flex gap-2">
      {/* Apply Template Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); setIsSaveOpen(false) }}
        className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs hover:bg-indigo-700 flex items-center gap-1.5 transition-colors"
      >
        <BookmarkPlus className="w-3.5 h-3.5" />
        Templates
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Save Current as Template Button */}
      <button
        onClick={() => { setIsSaveOpen(!isSaveOpen); setIsOpen(false) }}
        className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs hover:bg-amber-700 flex items-center gap-1.5 transition-colors"
      >
        <Star className="w-3.5 h-3.5" />
        Save as Template
      </button>

      {/* Templates Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-600 z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quick-Response Templates</h4>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {templates.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-400 dark:text-gray-500">
              No templates yet. Save your current form values as a template to get started.
            </div>
          )}

          {/* Personal Templates */}
          {personalTemplates.length > 0 && (
            <div>
              <div className="px-3 py-2 bg-gray-50 dark:bg-slate-750 dark:bg-slate-900/50 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">My Templates</span>
              </div>
              {personalTemplates.map(t => (
                <div
                  key={t.id}
                  onClick={() => handleApply(t)}
                  className="px-3 py-2.5 hover:bg-indigo-50 dark:hover:bg-slate-700 cursor-pointer border-b border-gray-50 dark:border-slate-700/50 flex items-start justify-between group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{t.name}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                      {Object.entries(t.fields).slice(0, 3).map(([k, v]) => formatFieldValue(k, v)).join(' | ')}
                      {Object.keys(t.fields).length > 3 && ` +${Object.keys(t.fields).length - 3} more`}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(t.id, e)}
                    className="p-1 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Shared Templates */}
          {sharedTemplates.length > 0 && (
            <div>
              <div className="px-3 py-2 bg-amber-50 dark:bg-amber-900/20 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">Shared Templates</span>
                <Star className="w-3 h-3 text-amber-400 ml-auto" />
              </div>
              {sharedTemplates.map(t => (
                <div
                  key={t.id}
                  onClick={() => handleApply(t)}
                  className="px-3 py-2.5 hover:bg-amber-50 dark:hover:bg-slate-700 cursor-pointer border-b border-gray-50 dark:border-slate-700/50 flex items-start justify-between group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{t.name}</span>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate ml-4.5">
                      {Object.entries(t.fields).slice(0, 3).map(([k, v]) => formatFieldValue(k, v)).join(' | ')}
                      {Object.keys(t.fields).length > 3 && ` +${Object.keys(t.fields).length - 3} more`}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(t.id, e)}
                    className="p-1 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Save Template Modal */}
      {isSaveOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-600 z-50">
          <div className="p-3 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Save as Template</h4>
            <button onClick={() => setIsSaveOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Template Name</label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g. Standard Cataract Admission"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-gray-200"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isShared}
                onChange={(e) => setIsShared(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded border-gray-300 dark:border-slate-600 focus:ring-amber-500"
              />
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Share with team</span>
              </div>
            </label>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {isShared
                ? 'This template will be available to all staff members.'
                : 'This template will only be visible to you.'}
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setIsSaveOpen(false)}
                className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!templateName.trim()}
                className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
