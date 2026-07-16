// app/analyze/page.tsx

import Image from "next/image";
import { AppLogo } from "@/components/AppLogo";
import { PageBackground } from "@/components/PageBackground";
import { VentureForm } from "@/components/VentureForm";
import { Sparkles } from "lucide-react";

/**
 * AnalyzePage hosts EmpresaFi's complete venture intelligence workflow.
 *
 * The page provides the branded workspace where founders submit a business
 * idea, watch the specialist analysis process, and receive a structured
 * intelligence report.
 */
export default function AnalyzePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 py-5 md:px-6 md:py-8">
      <PageBackground />

      <div className="mx-auto max-w-[1500px]">
        {/* Navigation */}
        <nav className="mb-8 flex items-center justify-between gap-4">
          <AppLogo />

          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/45 backdrop-blur md:inline-flex">
            <Sparkles className="h-3.5 w-3.5 text-violet-300" />
            EmpresaFi AI Workspace
          </div>
        </nav>

        {/* Hero Section */}
        <section className="mb-8 rounded-[2rem] border border-white/8 bg-white/[0.025] px-5 py-8 backdrop-blur md:px-8 md:py-10">
          <div className="max-w-3xl">
            {/* Brand */}
            <div className="mb-6 flex items-center gap-4">
              <Image
                src="/empresafi-logo.png"
                alt="EmpresaFi Logo"
                width={64}
                height={64}
                priority
                className="rounded-2xl shadow-xl"
              />

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  EmpresaFi
                </h2>

                <p className="text-sm font-medium tracking-wide text-violet-300">
                  AI Venture Intelligence Platform
                </p>
              </div>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300/70">
              AI Venture Intelligence
            </p>

            <h1 className="venture-gradient-text mt-3 text-3xl font-bold tracking-tight md:text-5xl">
              Analyze your next business idea.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55 md:text-base">
              EmpresaFi transforms startup ideas into investor-ready venture
              intelligence by combining AI reasoning with structured business
              analysis. Generate venture scores, market opportunity insights,
              SWOT analysis, Business Model Canvas, financial projections,
              investor readiness assessments, and actionable strategic
              recommendations in one professional report.
            </p>
          </div>
        </section>

        <VentureForm />
      </div>
    </main>
  );
}