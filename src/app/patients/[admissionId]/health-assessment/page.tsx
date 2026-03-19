'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, X } from 'lucide-react'

type YesNoValue = 'yes' | 'no' | ''

interface AssessmentSection {
  title: string
  key: string
  questions: { key: string; label: string }[]
}

export default function HealthAssessmentPage() {
  const params = useParams()
  const router = useRouter()
  const admissionId = params.admissionId as string

  const sections: AssessmentSection[] = [
    {
      title: 'General Health',
      key: 'general',
      questions: [
        { key: 'overallHealthGood', label: 'Overall health rated as good or excellent' },
        { key: 'exerciseTolerance', label: 'Can tolerate moderate exercise (e.g. climbing stairs)' },
        { key: 'currentSmoker', label: 'Current smoker' },
        { key: 'alcoholUse', label: 'Regular alcohol use (>2 standard drinks/day)' },
      ],
    },
    {
      title: 'Cardiovascular',
      key: 'cardiovascular',
      questions: [
        { key: 'chestPain', label: 'Chest pain or angina' },
        { key: 'palpitations', label: 'Palpitations or irregular heartbeat' },
        { key: 'hypertension', label: 'Hypertension (high blood pressure)' },
        { key: 'dvtHistory', label: 'History of DVT or pulmonary embolism' },
      ],
    },
    {
      title: 'Respiratory',
      key: 'respiratory',
      questions: [
        { key: 'asthma', label: 'Asthma' },
        { key: 'copd', label: 'COPD or chronic bronchitis' },
        { key: 'sleepApnoea', label: 'Sleep apnoea (diagnosed or suspected)' },
        { key: 'recentURI', label: 'Recent upper respiratory infection (within 2 weeks)' },
      ],
    },
    {
      title: 'Neurological',
      key: 'neurological',
      questions: [
        { key: 'seizures', label: 'Seizures or epilepsy' },
        { key: 'tiaStroke', label: 'History of TIA or stroke' },
        { key: 'neuropathy', label: 'Peripheral neuropathy' },
      ],
    },
    {
      title: 'Musculoskeletal',
      key: 'musculoskeletal',
      questions: [
        { key: 'mobilityIssues', label: 'Mobility issues or requires walking aids' },
        { key: 'fallsHistory', label: 'History of falls (within last 12 months)' },
        { key: 'jointReplacements', label: 'Previous joint replacements' },
      ],
    },
    {
      title: 'Endocrine',
      key: 'endocrine',
      questions: [
        { key: 'diabetes', label: 'Diabetes (Type 1 or Type 2)' },
        { key: 'thyroidDisorders', label: 'Thyroid disorders' },
      ],
    },
    {
      title: 'Renal',
      key: 'renal',
      questions: [
        { key: 'kidneyDisease', label: 'Chronic kidney disease' },
        { key: 'dialysis', label: 'Currently on dialysis' },
      ],
    },
    {
      title: 'Hepatic',
      key: 'hepatic',
      questions: [
        { key: 'liverDisease', label: 'Liver disease (hepatitis, cirrhosis, fatty liver)' },
      ],
    },
    {
      title: 'Haematological',
      key: 'haematological',
      questions: [
        { key: 'bleedingDisorders', label: 'Bleeding disorders (haemophilia, von Willebrand)' },
        { key: 'anticoagulants', label: 'Currently taking anticoagulants or blood thinners' },
      ],
    },
  ]

  const [answers, setAnswers] = useState<Record<string, YesNoValue>>({})

  const setAnswer = (key: string, value: YesNoValue) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-700 dark:bg-slate-700 text-white px-6 py-3 rounded-t-xl">
        <h2 className="text-lg font-semibold">HEALTH ASSESSMENT</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        {/* Action buttons */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-2">
              <Save className="w-4 h-4" /> Save
            </button>
            <button onClick={() => router.back()} className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 flex items-center gap-2">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>

        {/* Assessment Sections */}
        <div className="space-y-6">
          {sections.map(section => (
            <div key={section.key} className="border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-100 dark:bg-slate-700">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{section.title}</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-slate-600">
                {section.questions.map(q => {
                  const val = answers[q.key] || ''
                  return (
                    <div key={q.key} className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 pr-4">{q.label}</span>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => setAnswer(q.key, val === 'yes' ? '' : 'yes')}
                          className={`px-3 py-1.5 rounded-l-lg text-xs font-medium border transition-colors ${
                            val === 'yes'
                              ? 'bg-red-500 text-white border-red-500'
                              : 'bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-600'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setAnswer(q.key, val === 'no' ? '' : 'no')}
                          className={`px-3 py-1.5 rounded-r-lg text-xs font-medium border transition-colors ${
                            val === 'no'
                              ? 'bg-green-500 text-white border-green-500'
                              : 'bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-600'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Summary</h3>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>Total questions: {sections.reduce((sum, s) => sum + s.questions.length, 0)}</span>
            <span className="text-green-600 dark:text-green-400">Answered: {Object.keys(answers).filter(k => answers[k]).length}</span>
            <span className="text-red-600 dark:text-red-400">Positive findings: {Object.keys(answers).filter(k => answers[k] === 'yes').length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
