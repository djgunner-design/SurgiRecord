import {
  Building2,
  ShieldCheck,
  Tablet,
  Zap,
} from 'lucide-react';
import AnimatedSection from './animated-section';

const items = [
  {
    icon: Building2,
    title: 'Built for day surgery',
    description:
      'Not a hospital EMR crammed into a smaller box. Every screen, workflow, and default is designed for ambulatory surgical centres.',
  },
  {
    icon: ShieldCheck,
    title: 'Australian compliance',
    description:
      'Aligned with NSQHS Standards from the ground up. Surgical safety checklists, risk assessments, and clinical documentation that auditors actually want to see.',
  },
  {
    icon: Tablet,
    title: 'Tablet-first design',
    description:
      'Designed for nurses and anaesthetists on the floor — not desktop jockeys. Big touch targets, fast charting, works with gloves on.',
  },
  {
    icon: Zap,
    title: 'Fast charting',
    description:
      'Favourites, templates, smart defaults, and one-tap entries. Spend less time documenting and more time with patients.',
  },
];

export default function Differentiators() {
  return (
    <section id="why" className="relative py-24 sm:py-32 bg-slate-950 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(6,182,212,0.04),transparent)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-3">
              Why SurgiRecord
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Purpose-built beats retrofitted.{' '}
              <span className="text-slate-500">Every time.</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {items.map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 120} direction={i % 2 === 0 ? 'left' : 'right'}>
              <div className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/10 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1.5">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
