// components/ScoreExplanationPanel.tsx

import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import {
  ConfidenceInput,
  explainInvestorScore,
  explainMarketScore,
  explainVentureScore,
  ScoreExplanation,
} from "@/lib/confidenceEngine";
import { ConfidenceIndicator } from "./ConfidenceIndicator";

type ScoreExplanationPanelProps = ConfidenceInput;

type ExplanationCardProps = {
  title: string;
  explanation: ScoreExplanation;
};

/**
 * Displays the reasons supporting one score.
 */
function ExplanationCard({
  title,
  explanation,
}: ExplanationCardProps) {
  return (
    <article className="rounded-3xl border border-white/8 bg-black/10 p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/35">
            {title}
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {explanation.score}/100
          </p>
        </div>

        <ConfidenceIndicator
          value={explanation.confidence}
          compact
        />
      </div>

      {explanation.positiveFactors.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-200">
            <CheckCircle2 className="h-4 w-4" />
            Positive factors
          </div>

          <ul className="mt-3 space-y-2">
            {explanation.positiveFactors.map(
              (factor, index) => (
                <li
                  key={`${factor}-${index}`}
                  className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-3 text-sm leading-6 text-white/55"
                >
                  {factor}
                </li>
              )
            )}
          </ul>
        </div>
      )}

      {explanation.concerns.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center gap-2 text-sm font-medium text-amber-200">
            <AlertTriangle className="h-4 w-4" />
            Key concerns
          </div>

          <ul className="mt-3 space-y-2">
            {explanation.concerns.map((concern, index) => (
              <li
                key={`${concern}-${index}`}
                className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.04] p-3 text-sm leading-6 text-white/55"
              >
                {concern}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

/**
 * Explains the three headline scores and shows how much confidence
 * EmpresaFi places in each assessment.
 */
export function ScoreExplanationPanel(
  props: ScoreExplanationPanelProps
) {
  const ventureExplanation = explainVentureScore(props);
  const marketExplanation = explainMarketScore(props);
  const investorExplanation = explainInvestorScore(props);

  return (
    <section className="venture-panel rounded-[2rem] p-6 text-white md:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-200">
            <Sparkles className="h-3.5 w-3.5" />
            Explainable Intelligence
          </div>

          <h2 className="mt-5 text-2xl font-semibold tracking-tight md:text-4xl">
            Why these scores?
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50 md:text-base">
            EmpresaFi shows the main factors supporting each score and
            highlights where uncertainty remains.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-white/8 bg-black/15 px-4 py-3 text-xs uppercase tracking-[0.18em] text-white/35">
          <Lightbulb className="h-4 w-4 text-violet-300" />
          Transparent scoring
        </div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        <ExplanationCard
          title="Venture Health Score"
          explanation={ventureExplanation}
        />

        <ExplanationCard
          title="Market Opportunity"
          explanation={marketExplanation}
        />

        <ExplanationCard
          title="Investor Readiness"
          explanation={investorExplanation}
        />
      </div>
    </section>
  );
}