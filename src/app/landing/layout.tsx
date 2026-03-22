import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SurgiRecord — Paperless Surgical Day Hospitals',
  description:
    'Digital clinical records from admission to discharge. Built for Australian day surgery centres. WHO-aligned checklists, anaesthetic records, risk assessments, and more.',
  openGraph: {
    title: 'SurgiRecord — Paperless Surgical Day Hospitals',
    description:
      'Digital clinical records from admission to discharge. Built for Australian day surgery.',
    siteName: 'SurgiRecord',
    type: 'website',
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased overflow-x-hidden">
      {children}
    </div>
  );
}
