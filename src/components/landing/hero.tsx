'use client';

import { ArrowRight, Play } from 'lucide-react';
import AnimatedSection from './animated-section';

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(6,182,212,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_50%,rgba(6,182,212,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_20%_80%,rgba(30,64,175,0.1),transparent)]" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
        {/* Animated glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] animate-[pulse_10s_ease-in-out_infinite_2s]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16">
        <AnimatedSection delay={0} direction="none">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Now in early access
          </div>
        </AnimatedSection>

        <AnimatedSection delay={100}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            Paperless surgical{' '}
            <br className="hidden sm:block" />
            day hospitals.{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
              Finally.
            </span>
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Digital clinical records from admission to discharge — built for Australian day surgery.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={300}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#early-access"
              className="group inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              Request Early Access
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="#features"
              className="group inline-flex items-center gap-2 text-slate-300 hover:text-white font-medium px-7 py-3.5 rounded-xl border border-slate-700 hover:border-slate-500 transition-all hover:bg-white/5"
            >
              <Play className="w-4 h-4" />
              See How It Works
            </a>
          </div>
        </AnimatedSection>

        {/* Floating stats */}
        <AnimatedSection delay={500}>
          <div className="mt-16 sm:mt-20 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto">
            {[
              ['20+', 'Clinical forms'],
              ['100%', 'NSQHS aligned'],
              ['<5 min', 'Per patient chart'],
            ].map(([value, label]) => (
              <div key={label} className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">{value}</div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
    </section>
  );
}
