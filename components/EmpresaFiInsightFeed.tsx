// components/EmpresaFiInsightFeed.tsx

import {
  Activity,
  Building2,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import type { VentureInsights } from "@/lib/insightSchema";
import { InsightModeBadge } from "./InsightModeBadge";
import { ProvenanceBadge } from "./ProvenanceBadge";

type EmpresaFiInsightFeedProps = {
  insights?: VentureInsights;
};

/**
 * Returns the broader provenance label for the insight package.
 *
 * The internal research mode is translated into a user-facing source
 * classification so founders can understand how the intelligence
 * was produced.
 */
function getInsightProvenance(
  mode: VentureInsights["researchMode"]
) {
  if (mode === "fallback") {
    return "local_recovery" as const;
  }

  if (mode === "live_search") {
    return "ai_generated" as const;
  }

  return "ai_estimate" as const;
}

/**
 * Displays EmpresaFi's competitive landscape, market signals,
 * and industry intelligence in one executive section.
 *
 * The component clearly separates strategic AI reasoning from
 * independently verified live market research.
 */
export function EmpresaFiInsightFeed({
  insights,
}: EmpresaFiInsightFeedProps) {
  if (!insights) {
    return null;
  }

  const provenance =
    getInsightProvenance(insights.researchMode);

  return (
    <section className="venture-panel rounded-[2rem] p-6 text-white md:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-200">
            <Sparkles className="h-3.5 w-3.5" />
            EmpresaFi Insight Engine
          </div>

          <h2 className="mt-5 text-2xl font-semibold tracking-tight md:text-4xl">
            Strategic market intelligence
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50 md:text-base">
            Competitive, market, and industry signals tailored to the
            submitted venture context.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <InsightModeBadge
            mode={insights.researchMode}
          />

          <ProvenanceBadge
            type={provenance}
            showConfidence={false}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-3">
        <article className="rounded-3xl border border-violet-400/15 bg-violet-400/[0.05] p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-200">
              <Building2 className="h-5 w-5" />
            </div>

            <span className="rounded-full border border-white/8 bg-black/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white/30">
              {insights.competitors.length} identified
            </span>
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
            Competitive landscape
          </p>

          <p className="mt-2 text-sm leading-6 text-white/40">
            Likely competitors, indirect alternatives, and existing
            approaches that may affect adoption.
          </p>

          <div className="mt-5 space-y-3">
            {insights.competitors.map(
              (competitor, index) => (
                <div
                  key={`${competitor.name}-${index}`}
                  className="rounded-2xl border border-white/6 bg-black/10 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-violet-400/15 bg-violet-400/10 text-[11px] font-semibold text-violet-200">
                      {index + 1}
                    </span>

                    <div className="min-w-0">
                      <p className="font-medium text-white/85">
                        {competitor.name}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-white/50">
                        {competitor.description}
                      </p>

                      <div className="mt-4 space-y-2">
                        <p className="text-xs leading-5 text-violet-200/55">
                          Strategic relevance:{" "}
                          {competitor.relevance}
                        </p>

                        <p className="text-xs leading-5 text-white/35">
                          Competitive strength:{" "}
                          {competitor.strength}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </article>

        <article className="rounded-3xl border border-cyan-400/15 bg-cyan-400/[0.05] p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
              <Activity className="h-5 w-5" />
            </div>

            <span className="rounded-full border border-white/8 bg-black/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white/30">
              {insights.marketSignals.length} signals
            </span>
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
            Market signals
          </p>

          <p className="mt-2 text-sm leading-6 text-white/40">
            Commercial, behavioral, and operational signals that may
            influence venture demand.
          </p>

          <div className="mt-5 space-y-3">
            {insights.marketSignals.map(
              (signal, index) => (
                <div
                  key={`${signal.title}-${index}`}
                  className="rounded-2xl border border-white/6 bg-black/10 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cyan-400/15 bg-cyan-400/10 text-[11px] font-semibold text-cyan-200">
                      {index + 1}
                    </span>

                    <div className="min-w-0">
                      <p className="font-medium text-white/85">
                        {signal.title}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-white/50">
                        {signal.summary}
                      </p>

                      <p className="mt-4 text-xs leading-5 text-cyan-200/55">
                        Why it matters:{" "}
                        {signal.significance}
                      </p>

                      {signal.publishedAt && (
                        <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-white/25">
                          Reference date:{" "}
                          {signal.publishedAt}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </article>

        <article className="rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.05] p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-200">
              <Lightbulb className="h-5 w-5" />
            </div>

            <span className="rounded-full border border-white/8 bg-black/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white/30">
              {insights.industryFacts.length} observations
            </span>
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
            Industry intelligence
          </p>

          <p className="mt-2 text-sm leading-6 text-white/40">
            Strategic industry observations that shape positioning,
            execution, and customer validation.
          </p>

          <div className="mt-5 space-y-3">
            {insights.industryFacts.map(
              (fact, index) => (
                <div
                  key={`${fact.fact}-${index}`}
                  className="rounded-2xl border border-white/6 bg-black/10 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-emerald-400/15 bg-emerald-400/10 text-[11px] font-semibold text-emerald-200">
                      {index + 1}
                    </span>

                    <div className="min-w-0">
                      <p className="text-sm leading-6 text-white/60">
                        {fact.fact}
                      </p>

                      <p className="mt-4 text-xs leading-5 text-emerald-200/55">
                        Venture relevance:{" "}
                        {fact.relevance}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </article>
      </div>

      <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/30">
          Insight summary
        </p>

        <p className="mt-3 text-sm leading-7 text-white/50">
          {insights.researchSummary}
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-amber-400/15 bg-amber-400/[0.05] px-4 py-4 md:flex-row md:items-center md:justify-between">
        <p className="max-w-3xl text-xs leading-5 text-amber-100/60">
          {insights.researchMode === "live_search"
            ? "This insight package includes current external research. Important findings should still be independently reviewed before major business decisions."
            : insights.researchMode === "fallback"
              ? "EmpresaFi used its local strategic-intelligence recovery model because AI insight generation was unavailable."
              : "Strategic intelligence is generated from the submitted venture context and AI reasoning. It is not presented as independently verified live market research."}
        </p>

        <span className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-amber-100/35">
          Generated{" "}
          {new Date(
            insights.researchedAt
          ).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </section>
  );
}