import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SurgiRecord - Theatre Management",
  description: "Surgical theatre management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f0f4f8]">
        {children}
      </body>
    </html>
  );
}
