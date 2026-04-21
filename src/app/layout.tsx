import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { ContextualSidebar } from "@/components/layout/ContextualSidebar";
import { GlobalHeader } from "@/components/layout/GlobalHeader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Metz Data Lab",
  description: "Football analytics platform for FC Metz",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${dmSans.variable} h-full`}>
      <body className="h-full flex overflow-hidden">
        {/* Col 1 — Main sidebar 64px */}
        <MainSidebar />

        {/* Col 2 — Contextual sidebar 240px */}
        <ContextualSidebar />

        {/* Col 3 — Main zone */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <GlobalHeader />
          <main className="flex-1 overflow-hidden relative bg-n-950">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
