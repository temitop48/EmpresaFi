"use client";

// components/AnalysisPipeline.tsx

import {
  Check,
  LoaderCircle,
  Sparkles,
} from "lucide-react";
import type {
  AnalysisPipelineStep,
  AnalysisStepStatus,
} from "@/lib/analysisPipeline";

type AnalysisPipelineProps = {
  steps: AnalysisPipelineStep[];
  isRunning: boolean;
};

type StatusIconProps = {
  status: AnalysisStepStatus;
};

/**
 * Renders the icon associated with one pipeline status.
 */
function StatusIcon({ status }: StatusIconProps) {
  if (status === "complete") {
    return <Check className="h-4 w-4" />;
  }

  if (status === "analyzing") {
    return (
      <LoaderCircle className="h-4 w-4 animate-spin" />
    );
  }

  return (
    <span className="h-2 w-2 rounded-full bg-current opacity-50" />
  );
}

/**
 * Converts the number of completed steps into a percentage.
 *
 * The currently analyzing step receives partial progress so the
 * interface does not appear frozen during longer requests.
 */
function calculateProgress(
  steps: AnalysisPipelineStep[]
): number {
  if (steps.length === 0) {
    return 0;
  }

  const completedSteps = steps.filter(
    (step) => step.status === "complete"
  ).length;

  const hasActiveStep = steps.some(
    (step) => step.status === "analyzing"
  );

  const rawProgress =
    ((completedSteps + (hasActiveStep ? 0.45 : 0)) /
      steps.length) *
    100;

  return Math.min(100, Math.round(rawProgress));
}

/**
 * Displays EmpresaFi's active analysis workflow.
 */
export function AnalysisPipeline({
  steps,
  isRunning,
}: AnalysisPipelineProps) {
  const progress = calculateProgress(steps);

  const activeStep = steps.find(
    (step) => step.status === "analyzing"
  );

  return (
    <section
      aria-live="polite"
      className="venture-panel relative overflow-hidden rounded-[2rem] p-6 text-white md:p-8"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-200">
              <Sparkles className="h-3.5 w-3.5" />
              EmpresaFi Intelligence Pipeline
            </div>

            <h2 className="mt-5 text-2xl font-semibold tracking-tight md:text-4xl">
              Building your venture intelligence report
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50 md:text-base">
              EmpresaFi is combining stable scoring, strategic
              reasoning, financial modeling, and investor intelligence
              into one structured report.
            </p>
          </div>

          <div className="min-w-[8.5rem] rounded-2xl border border-white/8 bg-black/15 px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
              Progress
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {progress}%
            </p>
          </div>
        </div>

        <div className="mt-7">
          <div className="flex items-center justify-between gap-4 text-xs text-white/40">
            <span>
              {activeStep?.title ??
                (progress === 100
                  ? "Report ready"
                  : "Preparing analysis")}
            </span>

            <span>
              {
                steps.filter(
                  (step) => step.status === "complete"
                ).length
              }
              /{steps.length} complete
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400 transition-[width] duration-700 ease-out"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-7 grid gap-3 lg:grid-cols-2">
          {steps.map((step, index) => {
            const StepIcon = step.icon;

            const isComplete =
              step.status === "complete";

            const isAnalyzing =
              step.status === "analyzing";

            return (
              <article
                key={step.id}
                className={`relative rounded-2xl border p-4 transition-all duration-500 ${
                  isComplete
                    ? "border-emerald-400/15 bg-emerald-400/[0.05]"
                    : isAnalyzing
                      ? "border-violet-400/25 bg-violet-400/[0.08] shadow-[0_0_30px_rgba(139,92,246,0.08)]"
                      : "border-white/6 bg-white/[0.02]"
                }`}
              >
                {isAnalyzing && (
                  <div className="pointer-events-none absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-transparent via-violet-400/[0.04] to-transparent" />
                )}

                <div className="relative flex items-start gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300 ${
                      isComplete
                        ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                        : isAnalyzing
                          ? "border-violet-400/30 bg-violet-400/15 text-violet-100"
                          : "border-white/8 bg-black/10 text-white/30"
                    }`}
                  >
                    <StepIcon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
                          Stage {String(index + 1).padStart(2, "0")}
                        </p>

                        <h3
                          className={`mt-1 text-sm font-semibold ${
                            isComplete || isAnalyzing
                              ? "text-white/85"
                              : "text-white/45"
                          }`}
                        >
                          {step.title}
                        </h3>
                      </div>

                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                          isComplete
                            ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                            : isAnalyzing
                              ? "border-violet-400/25 bg-violet-400/10 text-violet-200"
                              : "border-white/8 bg-white/[0.02] text-white/25"
                        }`}
                      >
                        <StatusIcon
                          status={step.status}
                        />
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-white/40">
                      {step.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-5 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.035] px-4 py-3 text-xs leading-5 text-cyan-100/55">
          {isRunning
            ? "Keep this page open while EmpresaFi completes the analysis."
            : "The intelligence workflow has completed successfully."}
        </div>
      </div>
    </section>
  );
}