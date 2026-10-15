import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Movement Report Manager - Kharagpur Vision Academy",
  description: "Manage, reorder, and export daily movement reports to A4 PDF.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 min-h-screen text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
