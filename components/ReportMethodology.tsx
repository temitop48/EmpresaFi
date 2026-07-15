// components/ReportMethodology.tsx

import {
  BrainCircuit,
  Calculator,
  LineChart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type ReportMethodologyProps = {
  generationMode?: "ai" | "fallback";
  insightMode?: "live_search" | "ai_estimate" | "fallback";
};

/**
 * Explains how EmpresaFi produced the report.
 */
export function ReportMethodology({
  generationMode = "ai",
  insightMode = "ai_estimate",
}: ReportMethodologyProps) {
  const methods = [
    {
      title: "Founder Input",
      description:
        "Business information and assumptions supplied by the founder.",
      icon: Sparkles,
    },
    {
      title: "Deterministic Scoring",
      description:
        "Stable venture, market, investor, risk, and revenue classifications.",
      icon: Calculator,
    },
    {
      title: "Strategic Insight Engine",
      description:
        insightMode === "live_search"
          ? "AI intelligence supported by current external research."
          : insightMode === "fallback"
            ? "Local strategic intelligence derived from the submitted context."
            : "AI strategic reasoning derived from the submitted venture context.",
      icon: BrainCircuit,
    },
    {
      title: "Financial Modeling",
      description:
        "Consistent revenue and market-planning estimates generated from shared calculation models.",
      icon: LineChart,
    },
    {
      title: "Report Narrative",
      description:
        generationMode === "fallback"
          ? "Dependable local recovery content was used where AI generation was unavailable."
          : "Gemini generated the structured business narrative around EmpresaFi's stable intelligence.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="venture-panel rounded-[2rem] p-6 text-white md:p-8">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300/70">
          Trust and methodology
        </p>

        <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-4xl">
          How EmpresaFi built this report
        </h2>

        <p className="mt-3 text-sm leading-7 text-white/50 md:text-base">
          EmpresaFi separates founder-provided assumptions, stable
          calculations, AI reasoning, and modeled projections so each
          output can be interpreted correctly.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {methods.map((method, index) => {
          const Icon = method.icon;

          return (
            <article
              key={method.title}
              className="rounded-3xl border border-white/8 bg-black/10 p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-200">
                  <Icon className="h-5 w-5" />
                </div>

                <span className="text-xs text-white/25">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-5 text-sm font-semibold">
                {method.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/45">
                {method.description}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-amber-400/15 bg-amber-400/[0.05] px-4 py-3 text-xs leading-5 text-amber-100/60">
        EmpresaFi provides business-planning intelligence. Its outputs
        are not guarantees of commercial success, investor funding, or
        verified future financial performance.
      </div>
    </section>
  );
}