// components/EmpresaFiAdvisor.tsx

import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  BarChart3,
  Beaker,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDollarSign,
  Compass,
  FlaskConical,
  Lightbulb,
  MapPinned,
  Rocket,
  ShieldAlert,
  Sparkles,
  Target,
} from "lucide-react";
import {
  type AdvisoryInput,
  type AdvisorVerdict,
  generateVentureAdvisory,
} from "@/lib/advisoryEngine";

type EmpresaFiAdvisorProps = AdvisoryInput;

/**
 * Returns the visual style for each executive verdict.
 */
function getVerdictStyle(
  verdict: AdvisorVerdict
) {
  switch (verdict) {
    case "Build Now":
      return {
        badge:
          "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
        glow:
          "from-emerald-500/15 via-cyan-500/5 to-transparent",
        icon: Rocket,
      };

    case "Validate First":
      return {
        badge:
          "border-amber-400/25 bg-amber-400/10 text-amber-200",
        glow:
          "from-amber-500/15 via-orange-500/5 to-transparent",
        icon: Beaker,
      };

    case "Pivot":
      return {
        badge:
          "border-fuchsia-400/25 bg-fuchsia-400/10 text-fuchsia-200",
        glow:
          "from-fuchsia-500/15 via-violet-500/5 to-transparent",
        icon: Compass,
      };

    default:
      return {
        badge:
          "border-red-400/25 bg-red-400/10 text-red-200",
        glow:
          "from-red-500/15 via-orange-500/5 to-transparent",
        icon: ShieldAlert,
      };
  }
}

/**
 * Displays one sequential strategy path.
 */
function StrategyPath({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: string[];
  icon: React.ComponentType<{
    className?: string;
  }>;
}) {
  return (
    <article className="rounded-3xl border border-white/8 bg-black/10 p-5 md:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-200">
          <Icon className="h-5 w-5" />
        </div>

        <p className="text-sm font-semibold">
          {title}
        </p>
      </div>

      <div className="mt-5 space-y-2">
        {items.map((item, index) => (
          <div
            key={`${title}-${item}-${index}`}
          >
            <div className="flex items-center gap-3 rounded-2xl border border-white/6 bg-white/[0.025] px-4 py-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-violet-400/15 bg-violet-400/10 text-xs font-semibold text-violet-200">
                {index + 1}
              </span>

              <p className="text-sm text-white/60">
                {item}
              </p>
            </div>

            {index < items.length - 1 && (
              <div className="flex h-6 items-center pl-6 text-white/20">
                <ArrowDown className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}

/**
 * EmpresaFiAdvisor displays the executive decision layer above
 * the complete business intelligence report.
 */
export function EmpresaFiAdvisor(
  props: EmpresaFiAdvisorProps
) {
  const advisory =
    generateVentureAdvisory(props);

  const verdictStyle = getVerdictStyle(
    advisory.verdict
  );

  const VerdictIcon = verdictStyle.icon;

  return (
    <section className="venture-panel relative overflow-hidden rounded-[2rem] p-6 text-white md:p-8">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${verdictStyle.glow}`}
      />

      <div className="relative">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-200">
              <Sparkles className="h-3.5 w-3.5" />
              EmpresaFi Executive Advisor
            </div>

            <h2 className="mt-5 text-2xl font-semibold tracking-tight md:text-4xl">
              Founder decision command center
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50 md:text-base">
              A decisive interpretation of the complete
              intelligence report, translated into action,
              evidence, and execution priorities.
            </p>
          </div>

          <div
            className={`inline-flex min-w-[15rem] items-center gap-4 self-start rounded-3xl border px-5 py-5 ${verdictStyle.badge}`}
          >
            <VerdictIcon className="h-7 w-7" />

            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] opacity-60">
                Executive verdict
              </p>

              <p className="mt-1 text-2xl font-semibold">
                {advisory.verdict}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
          <article className="rounded-3xl border border-white/8 bg-black/15 p-5 md:p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/35">
              Decision confidence
            </p>

            <div className="mt-4 flex items-end justify-between gap-4">
              <p className="text-5xl font-semibold">
                {advisory.confidence}%
              </p>

              <span className="text-xs text-white/35">
                Deterministic signal
              </span>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400"
                style={{
                  width: `${advisory.confidence}%`,
                }}
              />
            </div>

            <p className="mt-5 text-sm leading-7 text-white/55">
              {advisory.summary}
            </p>
          </article>

          <article className="rounded-3xl border border-white/8 bg-black/15 p-5 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Why EmpresaFi reached this decision
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {advisory.reasons.map(
                (reason, index) => {
                  const isPositive =
                    reason.type === "positive";

                  return (
                    <div
                      key={`${reason.label}-${index}`}
                      className={`rounded-2xl border p-4 ${
                        isPositive
                          ? "border-emerald-400/12 bg-emerald-400/[0.04]"
                          : "border-amber-400/12 bg-amber-400/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isPositive ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-300" />
                        )}

                        <p className="text-sm font-medium text-white/75">
                          {reason.label}
                        </p>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-white/45">
                        {reason.detail}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </article>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
          <article className="rounded-3xl border border-red-400/15 bg-red-400/[0.05] p-5 md:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 text-red-200">
              <ShieldAlert className="h-5 w-5" />
            </div>

            <p className="mt-5 text-xs uppercase tracking-[0.2em] text-white/35">
              Biggest blocker
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              {advisory.biggestBlocker.title}
            </h3>

            <p className="mt-4 text-sm leading-7 text-white/55">
              {advisory.biggestBlocker.description}
            </p>
          </article>

          <article className="rounded-3xl border border-cyan-400/15 bg-cyan-400/[0.05] p-5 md:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                  <FlaskConical className="h-5 w-5" />
                </div>

                <p className="mt-5 text-xs uppercase tracking-[0.2em] text-white/35">
                  Next experiment
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  {advisory.nextExperiment.title}
                </h3>
              </div>

              <span className="self-start rounded-full border border-white/8 bg-black/15 px-3 py-1.5 text-xs text-white/40">
                {advisory.nextExperiment.duration}
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-white/55">
              {advisory.nextExperiment.description}
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/30">
                  Actions
                </p>

                {advisory.nextExperiment.actions.map(
                  (action, index) => (
                    <div
                      key={`${action}-${index}`}
                      className="flex gap-3 rounded-2xl border border-white/6 bg-black/10 p-3"
                    >
                      <span className="text-xs font-semibold text-cyan-200">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <p className="text-sm leading-6 text-white/50">
                        {action}
                      </p>
                    </div>
                  )
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/30">
                  Success thresholds
                </p>

                {advisory.nextExperiment.successMetrics.map(
                  (metric, index) => (
                    <div
                      key={`${metric.label}-${index}`}
                      className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-3"
                    >
                      <p className="text-xs uppercase tracking-[0.14em] text-emerald-200/55">
                        {metric.label}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-white/55">
                        {metric.target}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </article>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-3">
          <article className="rounded-3xl border border-fuchsia-400/15 bg-fuchsia-400/[0.05] p-5 md:p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-200">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>

            <p className="mt-5 text-xs uppercase tracking-[0.2em] text-white/35">
              Investor perspective
            </p>

            <p className="mt-2 text-xl font-semibold">
              {advisory.investorOpinion}
            </p>

            <div className="mt-5 flex items-center justify-between text-xs text-white/40">
              <span>Investor confidence</span>
              <span>
                {advisory.investorConfidence}%
              </span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-400"
                style={{
                  width: `${advisory.investorConfidence}%`,
                }}
              />
            </div>
          </article>

          <StrategyPath
            title="Funding strategy"
            items={advisory.fundingStrategy}
            icon={CircleDollarSign}
          />

          <StrategyPath
            title="Launch strategy"
            items={advisory.launchStrategy}
            icon={MapPinned}
          />
        </div>

        <article className="mt-5 rounded-3xl border border-white/8 bg-black/10 p-5 md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-200">
              <Target className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Founder decision path
              </p>

              <p className="mt-1 text-sm text-white/45">
                What to do when the next evidence arrives.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-4">
            {advisory.decisionPath.map(
              (step, index) => {
                const stepClasses =
                  step.type === "success"
                    ? "border-emerald-400/15 bg-emerald-400/[0.05]"
                    : step.type === "pivot"
                      ? "border-amber-400/15 bg-amber-400/[0.05]"
                      : step.type === "decision"
                        ? "border-cyan-400/15 bg-cyan-400/[0.05]"
                        : "border-violet-400/15 bg-violet-400/[0.05]";

                return (
                  <div
                    key={`${step.label}-${index}`}
                    className="relative"
                  >
                    <div
                      className={`h-full rounded-2xl border p-4 ${stepClasses}`}
                    >
                      <p className="text-sm font-semibold text-white/75">
                        {step.label}
                      </p>

                      <p className="mt-3 text-sm leading-6 text-white/45">
                        {step.description}
                      </p>
                    </div>

                    {index <
                      advisory.decisionPath.length -
                        1 && (
                      <ArrowRight className="absolute -right-5 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-white/20 lg:block" />
                    )}
                  </div>
                );
              }
            )}
          </div>
        </article>

        <article className="mt-5 rounded-3xl border border-violet-400/15 bg-violet-400/[0.06] p-5 md:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-200">
              <Lightbulb className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                Founder guidance
              </p>

              <p className="mt-3 text-sm leading-7 text-white/60 md:text-base">
                {advisory.founderGuidance}
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}