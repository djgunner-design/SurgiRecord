'use client';

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { clsx } from 'clsx';

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-slate-900/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a href="#top" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-shadow">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Surgi<span className="text-cyan-400">Record</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#why" className="text-sm text-slate-400 hover:text-white transition-colors">
              Why SurgiRecord
            </a>
            <a href="#compare" className="text-sm text-slate-400 hover:text-white transition-colors">
              Compare
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="hidden sm:inline-flex text-sm text-slate-300 hover:text-white transition-colors px-3 py-2"
            >
              Sign In
            </a>
            <a
              href="#early-access"
              className="text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg transition-colors shadow-lg shadow-cyan-600/25"
            >
              Request Access
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
