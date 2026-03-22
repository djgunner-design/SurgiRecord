import {
  FileWarning,
  SearchX,
  ShieldAlert,
  DollarSign,
} from 'lucide-react';
import AnimatedSection from './animated-section';

const painPoints = [
  {
    icon: FileWarning,
    title: 'Paper everywhere',
    description:
      'Admission forms, anaesthetic records, checklists, count sheets — all printed, filled by hand, and filed away where nobody can find them.',
  },
  {
    icon: SearchX,
    title: 'Lost charts & missing data',
    description:
      'Charts go walkabout between theatre, recovery, and discharge. Handwriting is illegible. Data entry happens twice — or not at all.',
  },
  {
    icon: ShieldAlert,
    title: 'Compliance headaches',
    description:
      'NSQHS accreditation audits mean scrambling through filing cabinets. Proving you did the right thing shouldn\u2019t be this hard.',
  },
  {
    icon: DollarSign,
    title: 'Enterprise systems cost a fortune',
    description:
      'Hospital EMRs are built for 500-bed campuses with 18-month rollouts and six-figure contracts. Day surgery needs something purpose-built.',
  },
];

export default function Problems() {
  return (
    <section className="relative py-24 sm:py-32 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Day hospitals deserve better than{' '}
              <span className="text-slate-500 line-through decoration-cyan-500/50">paper and spreadsheets</span>
            </h2>
            <p className="text-slate-400 text-lg">
              If any of these sound familiar, you&apos;re not alone.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {painPoints.map((point, i) => (
            <AnimatedSection key={point.title} delay={i * 100}>
              <div className="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all hover:bg-slate-900/80">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                  <point.icon className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{point.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{point.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
