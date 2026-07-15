// app/analyze/page.tsx

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
        <nav className="mb-8 flex items-center justify-between gap-4">
          <AppLogo />

          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/45 backdrop-blur md:inline-flex">
            <Sparkles className="h-3.5 w-3.5 text-violet-300" />
            EmpresaFi AI Workspace
          </div>
        </nav>

        <section className="mb-8 rounded-[2rem] border border-white/8 bg-white/[0.025] px-5 py-6 backdrop-blur md:px-8 md:py-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300/70">
              AI Venture Intelligence
            </p>

            <h1 className="venture-gradient-text mt-3 text-3xl font-bold tracking-tight md:text-5xl">
              Analyze your next business idea.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50 md:text-base">
              EmpresaFi combines market, financial, risk, growth, and investor
              intelligence to transform a raw idea into an investor-ready
              business report.
            </p>
          </div>
        </section>

        <VentureForm />
      </div>
    </main>
  );
}