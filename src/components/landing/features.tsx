import {
  ClipboardList,
  ShieldCheck,
  Stethoscope,
  AlertTriangle,
  HeartPulse,
  PhoneCall,
} from 'lucide-react';
import AnimatedSection from './animated-section';

const features = [
  {
    icon: ClipboardList,
    title: 'Full Patient Journey',
    description: 'Seamless digital records from admission through to discharge. Every form, every note, one chart.',
    color: 'cyan',
  },
  {
    icon: ShieldCheck,
    title: 'Surgical Safety Checklist',
    description: 'WHO-aligned Sign In, Time Out, and Sign Out — with real-time team confirmation and timestamps.',
    color: 'emerald',
  },
  {
    icon: Stethoscope,
    title: 'Anaesthetic & Intra-op Records',
    description: 'Structured anaesthetic charting with drug favourites, vital signs, and intra-operative event logging.',
    color: 'violet',
  },
  {
    icon: AlertTriangle,
    title: 'Risk Assessments',
    description: 'Falls, pressure injury, VTE, and delirium screening — validated tools built into the workflow.',
    color: 'amber',
  },
  {
    icon: HeartPulse,
    title: 'Recovery & Discharge',
    description: 'Aldrete scoring, pain assessments, discharge criteria checklists, and patient take-home instructions.',
    color: 'rose',
  },
  {
    icon: PhoneCall,
    title: 'Post-Op Follow-up',
    description: 'Structured post-operative phone call templates with outcome tracking and escalation pathways.',
    color: 'blue',
  },
];

const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
  cyan:    { bg: 'bg-cyan-500/10',    icon: 'text-cyan-400',    border: 'group-hover:border-cyan-500/30' },
  emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', border: 'group-hover:border-emerald-500/30' },
  violet:  { bg: 'bg-violet-500/10',  icon: 'text-violet-400',  border: 'group-hover:border-violet-500/30' },
  amber:   { bg: 'bg-amber-500/10',   icon: 'text-amber-400',   border: 'group-hover:border-amber-500/30' },
  rose:    { bg: 'bg-rose-500/10',    icon: 'text-rose-400',    border: 'group-hover:border-rose-500/30' },
  blue:    { bg: 'bg-blue-500/10',    icon: 'text-blue-400',    border: 'group-hover:border-blue-500/30' },
};

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32 bg-slate-950">
      {/* Subtle accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-3">
              Built for the OR
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Everything your day hospital needs. Nothing it doesn&apos;t.
            </h2>
            <p className="text-slate-400 text-lg">
              Purpose-built clinical modules that mirror how your team actually works.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const colors = colorMap[feature.color];
            return (
              <AnimatedSection key={feature.title} delay={i * 80}>
                <div
                  className={`group relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:bg-slate-900/80 transition-all h-full ${colors.border}`}
                >
                  <div className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
