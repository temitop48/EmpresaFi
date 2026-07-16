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
 * Monospace font used for technical UI and code snippets.
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Global metadata shared across the entire application.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://empresa-fi.vercel.app"),

  title: {
    default: "EmpresaFi | The AI Venture Intelligence Platform",
    template: "%s | EmpresaFi",
  },

  description:
    "Transform startup ideas into investor-ready ventures using AI-powered venture intelligence, market research, SWOT analysis, Business Model Canvas, financial projections, investor readiness, and strategic founder guidance.",

  applicationName: "EmpresaFi",

  generator: "Next.js",

  category: "Business",

  creator: "EmpresaFi",

  publisher: "EmpresaFi",

  authors: [
    {
      name: "EmpresaFi",
    },
  ],

  keywords: [
    "EmpresaFi",
    "AI Venture Intelligence",
    "Startup AI",
    "Business Validation",
    "Founder",
    "Entrepreneur",
    "Business Model Canvas",
    "Market Analysis",
    "Financial Projection",
    "Investor Readiness",
    "SWOT Analysis",
    "Business Planning",
    "Artificial Intelligence",
    "AI Startup",
    "OKX AI",
    "Venture Intelligence",
  ],

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "/branding/empresafi-logo.png",
    shortcut: "/branding/empresafi-logo.png",
    apple: "/branding/empresafi-logo.png",
  },

  openGraph: {
    title: "EmpresaFi | The AI Venture Intelligence Platform",

    description:
      "Turn startup ideas into investor-ready ventures using AI-powered market intelligence, financial forecasting, strategic analysis, and founder guidance.",

    url: "https://empresa-fi.vercel.app",

    siteName: "EmpresaFi",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/empresafi-logo.png",
        width: 1200,
        height: 1200,
        alt: "EmpresaFi Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "EmpresaFi | The AI Venture Intelligence Platform",

    description:
      "AI-powered venture intelligence helping founders transform ideas into investor-ready businesses.",

    images: ["/branding/empresafi-logo.png"],

    creator: "@EmpresaFi",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  themeColor: "#050816",
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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth`}
    >
      <body className="min-h-screen bg-[#050816] font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}