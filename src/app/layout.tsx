import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ClientProviders } from "./client-providers";
import KeyboardShortcuts from "@/components/keyboard-shortcuts";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10b981",
};

export const metadata: Metadata = {
  title: "SurgiRecord - Theatre Management",
  description: "Surgical theatre management system",
  manifest: "/manifest.json",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark')
              }
            } catch(e) {}
          `
        }} />
      </head>
      <body className="min-h-screen bg-[#f0f4f8] dark:bg-slate-900 dark:text-slate-200">
        <ClientProviders>
          <KeyboardShortcuts />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
