import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavbarWrapper } from "@/components/layout/NavbarWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sanchaar — Agentic Content Supply Chain",
  description:
    "Autonomous media orchestrator for Bharat. Voice-driven content transcreation and multi-platform distribution powered by Amazon Bedrock.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#030712] text-zinc-100 min-h-screen`}
      >
        {/* Ambient background gradients */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-violet-950/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -right-1/3 w-full h-full bg-gradient-radial from-blue-950/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-1/4 w-1/2 h-1/2 bg-gradient-radial from-cyan-950/10 to-transparent rounded-full blur-3xl" />
        </div>
        <NavbarWrapper />
        {children}
      </body>
    </html>
  );
}
