'use client';

import { useState, FormEvent } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import AnimatedSection from './animated-section';

export default function CtaSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // In production, this would POST to an API endpoint
    setSubmitted(true);
  };

  return (
    <section id="early-access" className="relative py-24 sm:py-32 bg-slate-950 overflow-hidden">
      {/* Gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(6,182,212,0.08),transparent)]" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Ready to go paperless?
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Join the early access list and be the first to bring SurgiRecord to your day hospital.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={100}>
          {submitted ? (
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-300 font-medium">
                Thanks! We&apos;ll be in touch soon.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@hospital.com.au"
                className="flex-1 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/30 whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
              >
                Request Access
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          )}

          <p className="text-xs text-slate-600 mt-4">
            No spam. No sales calls. Just an invite when we&apos;re ready for you.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
