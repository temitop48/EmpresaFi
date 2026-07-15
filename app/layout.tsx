// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/**
 * Primary sans-serif font used throughout EmpresaFi.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Monospace font used for code snippets and technical UI.
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Global metadata used for SEO, browser tabs,
 * and social sharing.
 */
export const metadata: Metadata = {
  title: {
    default: "EmpresaFi | AI Venture Intelligence Platform",
    template: "%s | EmpresaFi",
  },

  description:
    "Transform any business idea into an investor-ready venture using AI-powered market intelligence, financial analysis, risk assessment, and founder guidance.",

  applicationName: "EmpresaFi",

  keywords: [
    "EmpresaFi",
    "AI",
    "Artificial Intelligence",
    "Startup",
    "Founder",
    "Business Validation",
    "Business Intelligence",
    "Market Analysis",
    "Investor Readiness",
    "Financial Projection",
    "Venture Intelligence",
    "Business Planning",
    "AI Copilot",
    "OKX AI",
    "AI Venture Platform",
  ],

  authors: [
    {
      name: "EmpresaFi",
    },
  ],

  creator: "EmpresaFi",

  publisher: "EmpresaFi",

  metadataBase: new URL("https://empresafi.vercel.app"),

  openGraph: {
    title: "EmpresaFi | AI Venture Intelligence Platform",

    description:
      "Transform ideas into investor-ready ventures with AI-powered market intelligence, financial analysis, risk assessment, and strategic founder guidance.",

    type: "website",

    siteName: "EmpresaFi",
  },

  twitter: {
    card: "summary_large_image",

    title: "EmpresaFi | AI Venture Intelligence Platform",

    description:
      "AI-powered venture intelligence for founders, startups, freelancers, and small businesses.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Root layout shared across every page.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#050816] font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}