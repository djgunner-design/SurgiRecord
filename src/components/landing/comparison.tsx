import { Check, X, Minus } from 'lucide-react';
import AnimatedSection from './animated-section';

type CellValue = 'yes' | 'no' | 'partial';

interface Row {
  feature: string;
  surgirecord: CellValue;
  billing: CellValue;
  enterprise: CellValue;
}

const rows: Row[] = [
  { feature: 'Surgical safety checklist',   surgirecord: 'yes',     billing: 'no',      enterprise: 'yes' },
  { feature: 'Anaesthetic record',          surgirecord: 'yes',     billing: 'no',      enterprise: 'yes' },
  { feature: 'Count sheets',                surgirecord: 'yes',     billing: 'no',      enterprise: 'partial' },
  { feature: 'Risk assessments',            surgirecord: 'yes',     billing: 'no',      enterprise: 'partial' },
  { feature: 'Tablet-first UI',             surgirecord: 'yes',     billing: 'no',      enterprise: 'no' },
  { feature: 'Affordable for day surgery',  surgirecord: 'yes',     billing: 'yes',     enterprise: 'no' },
  { feature: 'Day-surgery specific',        surgirecord: 'yes',     billing: 'partial', enterprise: 'no' },
];

function CellIcon({ value }: { value: CellValue }) {
  if (value === 'yes') {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/15">
        <Check className="w-3.5 h-3.5 text-cyan-400" />
      </span>
    );
  }
  if (value === 'partial') {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/15">
        <Minus className="w-3.5 h-3.5 text-amber-400" />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-800">
      <X className="w-3.5 h-3.5 text-slate-600" />
    </span>
  );
}

export default function Comparison() {
  return (
    <section id="compare" className="relative py-24 sm:py-32 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-3">
              Compare
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              The right tool for the job
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={100}>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full min-w-[540px]">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-sm font-medium text-slate-500 py-4 pr-4 w-[40%]">
                    Capability
                  </th>
                  <th className="text-center text-sm font-bold text-cyan-400 py-4 px-3">
                    SurgiRecord
                  </th>
                  <th className="text-center text-sm font-medium text-slate-500 py-4 px-3">
                    Billing-Only Tools
                  </th>
                  <th className="text-center text-sm font-medium text-slate-500 py-4 px-3">
                    Enterprise EMR
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.feature} className="border-b border-slate-800/50">
                    <td className="text-sm text-slate-300 py-3.5 pr-4">{row.feature}</td>
                    <td className="text-center py-3.5 px-3">
                      <CellIcon value={row.surgirecord} />
                    </td>
                    <td className="text-center py-3.5 px-3">
                      <CellIcon value={row.billing} />
                    </td>
                    <td className="text-center py-3.5 px-3">
                      <CellIcon value={row.enterprise} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
