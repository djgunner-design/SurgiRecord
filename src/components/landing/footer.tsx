import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white">
                Surgi<span className="text-cyan-400">Record</span>
              </span>
              <span className="text-slate-600 text-sm ml-2">by Luma Medical</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span>surgirecord.com.au</span>
            <span className="hidden sm:inline text-slate-700">&middot;</span>
            <span>&copy; 2026 Luma Medical</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
