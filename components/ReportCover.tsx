// components/ReportCover.tsx

import {
  BrainCircuit,
  CalendarDays,
  Clock3,
  FileText,
  Fingerprint,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import {
  generateVentureAdvisory,
  type AdvisoryInput,
} from "@/lib/advisoryEngine";
import { buildReportMetadata } from "@/lib/reportMetadata";
import type { VentureInsights } from "@/lib/insightSchema";
import { ProvenanceBadge } from "./ProvenanceBadge";

type ReportCoverProps = AdvisoryInput & {
  reportId: string;
  ventureName: string;
  createdAt: string | Date;
  generationDurationMs?: number;
  generationMode?: "ai" | "fallback";
  reportVersion?: string;
  modelName?: string;
  scoringVersion?: string;
  insightMode?: VentureInsights["researchMode"];
  industry?: string;
  location?: string;
};

type MetadataItemProps = {
  label: string;
  value: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
};

/**
 * Displays one compact piece of report metadata.
 */
function MetadataItem({
  label,
  value,
  icon: Icon,
}: MetadataItemProps) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/10 text-violet-200">
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-medium text-white/70">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * ReportCover presents EmpresaFi's report as a professional
 * executive intelligence deliverable.
 */
export function ReportCover({
  reportId,
  ventureName,
  createdAt,
  generationDurationMs,
  generationMode,
  reportVersion,
  modelName,
  scoringVersion,
  insightMode,
  industry,
  location,
  ...advisoryInput
}: ReportCoverProps) {
  const advisory =
    generateVentureAdvisory(advisoryInput);

  const metadata = buildReportMetadata({
    createdAt,
    generationDurationMs,
    generationMode,
    reportVersion,
    modelName,
    scoringVersion,
    insightMode,
  });

  return (
    <section className="venture-panel relative overflow-hidden rounded-[2rem] p-6 text-white md:p-10">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-200">
                <Sparkles className="h-3.5 w-3.5" />
                EmpresaFi Venture Intelligence Report
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-white/40">
                <ShieldCheck className="h-3.5 w-3.5" />
                Confidential planning report
              </span>
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-white/30">
              Prepared for
            </p>

            <h1 className="venture-gradient-text mt-3 text-4xl font-bold tracking-tight md:text-6xl">
              {ventureName}
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/50 md:text-base">
              A structured venture assessment combining deterministic
              scoring, strategic AI reasoning, modeled projections,
              execution guidance, and investor intelligence.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {industry && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-black/10 px-4 py-2 text-sm text-white/50">
                  <Target className="h-4 w-4 text-violet-300" />
                  {industry}
                </span>
              )}

              {location && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-black/10 px-4 py-2 text-sm text-white/50">
                  <MapPinned className="h-4 w-4 text-cyan-300" />
                  {location}
                </span>
              )}
            </div>
          </div>

          <article className="min-w-full rounded-3xl border border-violet-400/20 bg-violet-400/[0.08] p-6 xl:min-w-[20rem]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
              Recommended decision
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {advisory.verdict}
            </p>

            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                  Confidence
                </p>

                <p className="mt-1 text-2xl font-semibold">
                  {advisory.confidence}%
                </p>
              </div>

              <ProvenanceBadge
                type="deterministic"
                showConfidence={false}
              />
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400"
                style={{
                  width: `${advisory.confidence}%`,
                }}
              />
            </div>

            <p className="mt-5 text-sm leading-6 text-white/50">
              {advisory.summary}
            </p>
          </article>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <MetadataItem
            label="Report ID"
            value={reportId}
            icon={Fingerprint}
          />

          <MetadataItem
            label="Generated"
            value={metadata.generatedDate}
            icon={CalendarDays}
          />

          <MetadataItem
            label="Generated at"
            value={metadata.generatedTime}
            icon={Clock3}
          />

          <MetadataItem
            label="Generation time"
            value={metadata.generationDuration}
            icon={Clock3}
          />

          <MetadataItem
            label="AI model"
            value={metadata.modelName}
            icon={BrainCircuit}
          />

          <MetadataItem
            label="Insight mode"
            value={metadata.insightLabel}
            icon={Sparkles}
          />

          <MetadataItem
            label="Scoring version"
            value={`v${metadata.scoringVersion}`}
            icon={Target}
          />

          <MetadataItem
            label="Report version"
            value={`v${metadata.reportVersion}`}
            icon={FileText}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <ProvenanceBadge
            type={
              generationMode === "fallback"
                ? "local_recovery"
                : "ai_generated"
            }
            showConfidence={false}
          />

          <ProvenanceBadge
            type="deterministic"
            showConfidence={false}
          />

          <ProvenanceBadge
            type={
              insightMode === "fallback"
                ? "local_recovery"
                : "ai_estimate"
            }
            showConfidence={false}
          />

          <ProvenanceBadge
            type="modeled"
            showConfidence={false}
          />
        </div>
      </div>
    </section>
  );
}