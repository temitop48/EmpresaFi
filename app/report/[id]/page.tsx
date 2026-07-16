// app/report/[id]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import type { RoadmapItem } from "@/lib/reportSchema";
import type { VentureInsights } from "@/lib/insightSchema";
import {
  generateSectionConfidence,
  type ConfidenceInput,
} from "@/lib/confidenceEngine";

import { AppLogo } from "@/components/AppLogo";
import { PageBackground } from "@/components/PageBackground";
import { DownloadReportPdfButton } from "@/components/DownloadReportPdfButton";
import { EmpresaFiAdvisor } from "@/components/EmpresaFiAdvisor";
import { EmpresaFiInsightFeed } from "@/components/EmpresaFiInsightFeed";
import { VentureScoreCard } from "@/components/VentureScoreCard";
import { ScoreExplanationPanel } from "@/components/ScoreExplanationPanel";
import { ReportSection } from "@/components/ReportSection";
import { ProvenanceBadge } from "@/components/ProvenanceBadge";
import { SwotAnalysis } from "@/components/SwotAnalysis";
import { BusinessModelCanvas } from "@/components/BusinessModelCanvas";
import { RevenueProjectionChart } from "@/components/RevenueProjectionChart";
import { MarketSizingVisualization } from "@/components/MarketSizingVisualization";
import { RoadmapTimeline } from "@/components/RoadmapTimeline";
import { InvestorReadinessRadar } from "@/components/InvestorReadinessRadar";
import { ReportMethodology } from "@/components/ReportMethodology";
import { InvestorBrief } from "@/components/InvestorBrief";
import { ReportCover } from "@/components/ReportCover";
import Image from "next/image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ReportPageProps = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * ReportPage displays a saved and shareable EmpresaFi
 * venture-intelligence report.
 *
 * The page combines:
 * - Deterministic venture scoring
 * - AI-generated business analysis
 * - Strategic Insight Engine output
 * - Explainable confidence indicators
 * - Modeled revenue projections
 * - TAM, SAM, and SOM planning estimates
 * - Interactive execution planning
 * - Investor intelligence
 * - Browser-native PDF export
 */
export default async function ReportPage({
  params,
}: ReportPageProps) {
  const { id } = await params;

  /**
   * Retrieve the saved report from PostgreSQL.
   */
  const report = await prisma.ventureReport.findUnique({
    where: {
      id,
    },
  });

  if (!report) {
    notFound();
  }

  /**
   * Prisma stores roadmap, risks, and insights as JSON.
   *
   * Convert those fields into the types expected by the report
   * components before rendering them.
   */
  const roadmap = report.roadmap as RoadmapItem[];
  const keyRisks = report.keyRisks as string[];

  const insights = report.insights
    ? (report.insights as VentureInsights)
    : undefined;

  /**
   * The current Prisma model does not persist generationMode.
   *
   * Shareable reports are therefore presented as AI-generated.
   * The Insight Engine retains its own provenance through researchMode.
   *
   * The wider union type is retained because child components support
   * both AI and fallback modes.
   */
  const generationMode: "ai" | "fallback" = "ai";

  /**
   * Because generationMode is not persisted, narrative sections on the
   * saved report use AI-generated provenance.
   *
   * This explicit value avoids an impossible literal comparison during
   * TypeScript production builds.
   */
  const narrativeProvenance = "ai_generated" as const;

  /**
   * Use one shared input object for all confidence calculations.
   *
   * This ensures the score-explanation panel and individual report
   * sections derive confidence from the same source information.
   */
  const confidenceInput: ConfidenceInput = {
    ventureScore: report.ventureScore,
    marketOpportunityScore:
      report.marketOpportunityScore,
    investorReadinessScore:
      report.investorReadinessScore,
    riskLevel: report.riskLevel,
    revenuePotential: report.revenuePotential,
    startupCostEstimate:
      report.startupCostEstimate,
    keyRisks,
  };

  const sectionConfidence =
    generateSectionConfidence(confidenceInput);

  return (
  <main
    id="empresafi-report"
    className="relative min-h-screen overflow-x-hidden px-4 py-5 text-white md:px-6 md:py-8"
  >
    <PageBackground />

    <div className="mx-auto max-w-[1400px]">
      {/* Navigation is hidden when the report is printed as a PDF. */}
      <nav className="report-screen-only mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Go to the EmpresaFi homepage"
          className="group inline-flex items-center gap-3"
        >
          <Image
            src="/empresafi-logo.png"
            alt="EmpresaFi logo"
            width={46}
            height={46}
            priority
            className="h-11 w-11 rounded-xl object-cover shadow-[0_0_24px_rgba(139,92,246,0.16)] transition duration-300 group-hover:scale-[1.03]"
          />

          <div>
            <p className="text-lg font-semibold tracking-tight text-white">
              EmpresaFi
            </p>

            <p className="text-xs text-white/40">
              AI Venture Intelligence
            </p>
          </div>
        </Link>

        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/65 backdrop-blur transition hover:border-white/15 hover:bg-white/[0.08] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Analyze New Business
        </Link>
      </nav>

      {/* Report actions are excluded from the printable PDF. */}
      <div className="report-screen-only mb-6 flex flex-wrap items-center justify-end gap-3">
        <DownloadReportPdfButton
          ventureName={report.ventureName}
        />
      </div>

      <div className="space-y-6">
        {/* =====================================================
            PROFESSIONAL REPORT COVER
           ===================================================== */}

        <ReportCover
          reportId={report.id}
          ventureName={report.ventureName}
          createdAt={report.createdAt}
          generationMode={generationMode}
          reportVersion="1.0"
          modelName="Gemini 3.1 Flash Lite"
          scoringVersion="1.0"
          insightMode={insights?.researchMode}
          industry={report.industry}
          location={report.location}
          ventureScore={report.ventureScore}
          marketOpportunityScore={
            report.marketOpportunityScore
          }
          investorReadinessScore={
            report.investorReadinessScore
          }
          riskLevel={report.riskLevel}
          goal={report.goal}
          targetCustomers={report.targetCustomers}
          ventureType={report.ventureType}
        />

        {/* =====================================================
            EXECUTIVE DECISION LAYER
           ===================================================== */}

        <EmpresaFiAdvisor
          ventureScore={report.ventureScore}
          marketOpportunityScore={
            report.marketOpportunityScore
          }
          investorReadinessScore={
            report.investorReadinessScore
          }
          riskLevel={report.riskLevel}
          goal={report.goal}
          targetCustomers={report.targetCustomers}
          industry={report.industry}
          location={report.location}
          ventureType={report.ventureType}
        />

        {/* =====================================================
            STRATEGIC INSIGHT ENGINE
           ===================================================== */}

        <EmpresaFiInsightFeed insights={insights} />

        {/* =====================================================
            CORE DETERMINISTIC INDICATORS
           ===================================================== */}

        <section>
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300/65">
                Venture intelligence dashboard
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Core business indicators
              </h2>
            </div>

            <ProvenanceBadge
              type="deterministic"
              showConfidence={false}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <VentureScoreCard
              label="Venture Health Score"
              value={`${report.ventureScore}/100`}
              helper="Overall business strength"
            />

            <VentureScoreCard
              label="Market Opportunity"
              value={`${report.marketOpportunityScore}/100`}
              helper="Demand, accessibility, and timing"
            />

            <VentureScoreCard
              label="Investor Readiness"
              value={`${report.investorReadinessScore}/100`}
              helper="Funding and scalability preparedness"
            />

            <VentureScoreCard
              label="Risk Level"
              value={report.riskLevel}
              helper="Execution and market exposure"
            />

            <VentureScoreCard
              label="Revenue Potential"
              value={report.revenuePotential}
              helper="Estimated commercial upside"
            />

            <VentureScoreCard
              label="Startup Cost"
              value={report.startupCostEstimate}
              helper="AI-estimated launch-capital range"
            />
          </div>
        </section>

        <ScoreExplanationPanel {...confidenceInput} />

        {/* =====================================================
            AI-GENERATED STRATEGIC REPORT
           ===================================================== */}

        <section>
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300/65">
                Business intelligence report
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Strategic analysis
              </h2>
            </div>

            <ProvenanceBadge
              type={narrativeProvenance}
              showConfidence={false}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <ReportSection
              title="Executive Intelligence"
              text={report.executiveSummary}
              confidence={
                sectionConfidence.executiveSummary
              }
              provenance={narrativeProvenance}
            />

            <ReportSection
              title="Market Intelligence"
              text={report.marketAnalysis}
              confidence={
                sectionConfidence.marketAnalysis
              }
              provenance={narrativeProvenance}
            />

            <ReportSection
              title="Competitor Intelligence"
              text={report.competitorAnalysis}
              confidence={
                sectionConfidence.competitorAnalysis
              }
              provenance={narrativeProvenance}
            />

            <ReportSection
              title="Business Model"
              text={report.businessModel}
              confidence={
                sectionConfidence.businessModel
              }
              provenance={narrativeProvenance}
            />

            <ReportSection
              title="Pricing Strategy"
              text={report.pricingStrategy}
              confidence={
                sectionConfidence.pricingStrategy
              }
              provenance={narrativeProvenance}
            />

            <ReportSection
              title="Financial Projection"
              text={report.financialProjection}
              confidence={
                sectionConfidence.financialProjection
              }
              provenance={narrativeProvenance}
            />
          </div>
        </section>

        {/* =====================================================
            RISK AND GROWTH INTELLIGENCE
           ===================================================== */}

        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-[2rem] border border-red-400/15 bg-red-400/[0.06] p-6 backdrop-blur md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300/65">
                  Risk intelligence
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Key Risks
                </h2>
              </div>

              <ProvenanceBadge
                type={narrativeProvenance}
                showConfidence={false}
              />
            </div>

            <ul className="mt-6 space-y-3">
              {keyRisks.map((risk, index) => (
                <li
                  key={`${risk}-${index}`}
                  className="flex gap-3 rounded-2xl border border-white/8 bg-black/15 p-4 text-sm leading-6 text-white/60"
                >
                  <span className="shrink-0 font-semibold text-red-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </section>

          <ReportSection
            title="Growth Blueprint"
            text={report.growthStrategy}
            confidence={
              sectionConfidence.growthStrategy
            }
            provenance={narrativeProvenance}
          />
        </div>

        {/* =====================================================
            DERIVED STRATEGIC MODELS
           ===================================================== */}

        <SwotAnalysis
          ventureScore={report.ventureScore}
          marketOpportunityScore={
            report.marketOpportunityScore
          }
          investorReadinessScore={
            report.investorReadinessScore
          }
          riskLevel={report.riskLevel}
          revenuePotential={report.revenuePotential}
          startupCostEstimate={
            report.startupCostEstimate
          }
          businessModel={report.businessModel}
          competitorAnalysis={
            report.competitorAnalysis
          }
          growthStrategy={report.growthStrategy}
          keyRisks={keyRisks}
        />

        <BusinessModelCanvas
          businessIdea={report.businessIdea}
          location={report.location}
          industry={report.industry}
          targetCustomers={report.targetCustomers}
          startupCostEstimate={
            report.startupCostEstimate
          }
          businessModel={report.businessModel}
          pricingStrategy={report.pricingStrategy}
          growthStrategy={report.growthStrategy}
          competitorAnalysis={
            report.competitorAnalysis
          }
          financialProjection={
            report.financialProjection
          }
        />

        <RevenueProjectionChart
          ventureScore={report.ventureScore}
          marketOpportunityScore={
            report.marketOpportunityScore
          }
          investorReadinessScore={
            report.investorReadinessScore
          }
          revenuePotential={report.revenuePotential}
          startupCostEstimate={
            report.startupCostEstimate
          }
          financialProjection={
            report.financialProjection
          }
        />

        <MarketSizingVisualization
          marketOpportunityScore={
            report.marketOpportunityScore
          }
          ventureScore={report.ventureScore}
          investorReadinessScore={
            report.investorReadinessScore
          }
          startupCostEstimate={
            report.startupCostEstimate
          }
          financialProjection={
            report.financialProjection
          }
          location={report.location}
          industry={report.industry}
          targetCustomers={report.targetCustomers}
        />

        {/* =====================================================
            EXECUTION AND INVESTOR INTELLIGENCE
           ===================================================== */}

        <RoadmapTimeline
          roadmap={roadmap}
          generationMode={generationMode}
        />

        <InvestorReadinessRadar
          ventureScore={report.ventureScore}
          marketOpportunityScore={
            report.marketOpportunityScore
          }
          investorReadinessScore={
            report.investorReadinessScore
          }
          riskLevel={report.riskLevel}
          revenuePotential={report.revenuePotential}
          businessModel={report.businessModel}
          pricingStrategy={report.pricingStrategy}
          financialProjection={
            report.financialProjection
          }
          keyRisks={keyRisks}
        />

        {/* =====================================================
            TRUST, METHODOLOGY, AND INVESTOR MEMO
           ===================================================== */}

        <ReportMethodology
          generationMode={generationMode}
          insightMode={insights?.researchMode}
        />

        <InvestorBrief brief={report.investorBrief} />

        {/* =====================================================
            ADVISORY NOTICE
           ===================================================== */}

        <section className="rounded-2xl border border-white/8 bg-white/[0.025] px-5 py-4 text-xs leading-6 text-white/40">
          <strong className="font-medium text-white/60">
            EmpresaFi advisory notice:
          </strong>{" "}
          This report combines founder-provided assumptions,
          deterministic scoring, AI-generated strategic intelligence,
          modeled projections, and planning estimates. It is intended
          for business planning and does not constitute financial,
          investment, legal, tax, or other professional advice.
        </section>

        <footer className="border-t border-white/8 py-8">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <Image
              src="/branding/empresafi-logo.png"
              alt="EmpresaFi logo"
              width={52}
              height={52}
              className="h-13 w-13 rounded-xl object-cover opacity-90"
            />

            <div>
              <p className="text-sm font-medium text-white/50">
                Generated by EmpresaFi AI Venture Intelligence Platform
              </p>

              <p className="mt-2 text-xs leading-5 text-white/25">
                Report version 1.0 · Strategic estimates should be
                validated with live market, financial, legal, and
                customer data before major decisions.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </main>
);
}