// components/VentureForm.tsx

"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  LoaderCircle,
  Plus,
  Sparkles,
} from "lucide-react";

import {
  createAnalysisPipeline,
  type AnalysisPipelineStep,
} from "@/lib/analysisPipeline";
import {
  generateSectionConfidence,
  type ConfidenceInput,
} from "@/lib/confidenceEngine";
import type { VentureInput, VentureReport } from "@/lib/reportSchema";

import { AnalysisPipeline } from "./AnalysisPipeline";
import { BusinessModelCanvas } from "./BusinessModelCanvas";
import { EmpresaFiAdvisor } from "./EmpresaFiAdvisor";
import { EmpresaFiInsightFeed } from "./EmpresaFiInsightFeed";
import { InvestorBrief } from "./InvestorBrief";
import { InvestorReadinessRadar } from "./InvestorReadinessRadar";
import { MarketSizingVisualization } from "./MarketSizingVisualization";
import { ReportSection } from "./ReportSection";
import { RevenueProjectionChart } from "./RevenueProjectionChart";
import { RoadmapTimeline } from "./RoadmapTimeline";
import { ScoreExplanationPanel } from "./ScoreExplanationPanel";
import { StatusBadge } from "./StatusBadge";
import { SwotAnalysis } from "./SwotAnalysis";
import { VentureScoreCard } from "./VentureScoreCard";
import { ReportCover } from "./ReportCover";

/**
 * Describes the possible error structure returned by the EmpresaFi API.
 */
type ApiError = {
  code?: string;
  message?: string;
  fields?: Record<string, string[] | undefined>;
};

/**
 * Describes the response returned by the EmpresaFi analysis endpoint.
 */
type AnalyzeBusinessResponse = {
  success?: boolean;
  report?: VentureReport;
  error?: string | ApiError;
};

/**
 * Extracts a readable message from an EmpresaFi API error response.
 */
function getApiErrorMessage(error: AnalyzeBusinessResponse["error"]): string {
  if (!error) {
    return "EmpresaFi could not generate the business intelligence report.";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  const firstFieldError = error.fields
    ? Object.values(error.fields)
        .flatMap((messages) => messages ?? [])
        .find(Boolean)
    : undefined;

  if (firstFieldError) {
    return firstFieldError;
  }

  return "EmpresaFi could not generate the business intelligence report.";
}

/**
 * VentureForm manages the complete EmpresaFi workflow:
 *
 * 1. Collect founder input.
 * 2. Display the EmpresaFi Intelligence Pipeline.
 * 3. Call the EmpresaFi ASP endpoint.
 * 4. Display the AI Advisor and complete intelligence report.
 */
export function VentureForm() {
  const [form, setForm] = useState<VentureInput>({
    businessIdea: "",
    location: "",
    industry: "",
    targetCustomers: "",
    budget: "",
    goal: "validate",
    ventureType: "non_crypto",
  });

  /**
   * Stores the visual stages shown while EmpresaFi builds the report.
   */
  const [pipelineSteps, setPipelineSteps] = useState<AnalysisPipelineStep[]>(
    createAnalysisPipeline,
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [report, setReport] = useState<VentureReport | null>(null);

  const [error, setError] = useState("");

  const [hasCopiedReport, setHasCopiedReport] = useState(false);

  /**
   * Prevents accidental duplicate API requests.
   *
   * React state updates are asynchronous, so this ref blocks another
   * request immediately before the disabled button state is rendered.
   */
  const requestInProgressRef = useRef(false);

  /**
   * Keeps track of the pipeline animation timer so it can always
   * be stopped after success, failure, or a new analysis.
   */
  const pipelineIntervalRef = useRef<number | null>(null);

  /**
   * Updates one form field while preserving all other values.
   */
  function updateField<K extends keyof VentureInput>(
    field: K,
    value: VentureInput[K],
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  /**
   * Stops the current pipeline timer when one exists.
   */
  function clearPipelineInterval() {
    if (pipelineIntervalRef.current !== null) {
      window.clearInterval(pipelineIntervalRef.current);

      pipelineIntervalRef.current = null;
    }
  }

  /**
   * Advances the visual analysis pipeline while the real API request runs.
   *
   * The final stage remains active until the backend actually returns.
   * This prevents the interface from claiming the report is ready early.
   */
  function startPipelineAnimation() {
    clearPipelineInterval();

    const initialSteps = createAnalysisPipeline();

    setPipelineSteps(
      initialSteps.map((step, index) => ({
        ...step,
        status: index === 0 ? "analyzing" : "queued",
      })),
    );

    let activeIndex = 0;

    const finalStageIndex = initialSteps.length - 1;

    pipelineIntervalRef.current = window.setInterval(() => {
      /**
       * Stop automatic movement when the final stage is reached.
       * The final stage stays active until the API response arrives.
       */
      if (activeIndex >= finalStageIndex) {
        clearPipelineInterval();
        return;
      }

      activeIndex += 1;

      setPipelineSteps((currentSteps) =>
        currentSteps.map((step, index) => ({
          ...step,

          status:
            index < activeIndex
              ? "complete"
              : index === activeIndex
                ? "analyzing"
                : "queued",
        })),
      );
    }, 900);
  }

  /**
   * Marks every pipeline stage as complete after the report
   * has successfully returned from the backend.
   */
  function completePipelineAnimation() {
    clearPipelineInterval();

    setPipelineSteps((currentSteps) =>
      currentSteps.map((step) => ({
        ...step,
        status: "complete",
      })),
    );
  }

  /**
   * Returns the visual pipeline to its initial queued state.
   */
  function resetPipelineAnimation() {
    clearPipelineInterval();
    setPipelineSteps(createAnalysisPipeline());
  }

  /**
   * Sends the founder input to the EmpresaFi ASP endpoint.
   *
   * The intelligence pipeline advances while the real API request runs.
   * The report appears only after the backend responds successfully.
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (requestInProgressRef.current || isAnalyzing) {
      return;
    }

    requestInProgressRef.current = true;

    setError("");
    setReport(null);
    setHasCopiedReport(false);
    setIsAnalyzing(true);

    startPipelineAnimation();

    try {
      const response = await fetch("/api/analyze-business", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      });

      const data = (await response.json()) as AnalyzeBusinessResponse;

      if (!response.ok || !data.success || !data.report) {
        throw new Error(getApiErrorMessage(data.error));
      }

      completePipelineAnimation();

      /**
       * Briefly show the completed pipeline before revealing the report.
       * This delay is only visual and does not postpone the API request.
       */
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 450);
      });

      setReport(data.report);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (caughtError) {
      resetPipelineAnimation();

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while analyzing this business idea.",
      );
    } finally {
      clearPipelineInterval();

      requestInProgressRef.current = false;
      setIsAnalyzing(false);
    }
  }

  /**
   * Returns the founder to the intake workflow.
   *
   * Existing field values remain available so the current idea
   * can be refined and analyzed again.
   */
  function startNewAnalysis() {
    clearPipelineInterval();

    setReport(null);
    setError("");
    setHasCopiedReport(false);
    setIsAnalyzing(false);
    setPipelineSteps(createAnalysisPipeline());

    requestInProgressRef.current = false;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /**
   * Converts the Insight Engine package into readable plain text.
   */
  function createInsightText(currentReport: VentureReport): string {
    if (!currentReport.insights) {
      return "";
    }

    const competitors = currentReport.insights.competitors
      .map(
        (competitor) => `
- ${competitor.name}
  ${competitor.description}
  Relevance: ${competitor.relevance}
  Strength: ${competitor.strength}
`,
      )
      .join("\n");

    const marketSignals = currentReport.insights.marketSignals
      .map(
        (signal) => `
- ${signal.title}
  ${signal.summary}
  Why it matters: ${signal.significance}
`,
      )
      .join("\n");

    const industryFacts = currentReport.insights.industryFacts
      .map(
        (fact) => `
- ${fact.fact}
  Venture relevance: ${fact.relevance}
`,
      )
      .join("\n");

    return `
EMPRESAFI STRATEGIC INSIGHT ENGINE

Insight Mode:
${currentReport.insights.researchMode}

Competitive Landscape:
${competitors}

Market Signals:
${marketSignals}

Industry Intelligence:
${industryFacts}

Insight Summary:
${currentReport.insights.researchSummary}
`.trim();
  }

  /**
   * Converts the structured intelligence report into readable plain text.
   */
  function createReportText(currentReport: VentureReport): string {
    const roadmapText = currentReport.roadmap
      .map(
        (stage) => `
${stage.period}: ${stage.title}
${stage.actions.map((action) => `- ${action}`).join("\n")}
`,
      )
      .join("\n");

    const insightText = createInsightText(currentReport);

    return `
${currentReport.ventureName}

EMPRESAFI BUSINESS INTELLIGENCE REPORT

VENTURE METRICS

Venture Health Score: ${currentReport.ventureScore}/100
Market Opportunity Score: ${currentReport.marketOpportunityScore}/100
Investor Readiness Score: ${currentReport.investorReadinessScore}/100
Risk Level: ${currentReport.riskLevel}
Revenue Potential: ${currentReport.revenuePotential}
Startup Cost Estimate: ${currentReport.startupCostEstimate}

${insightText}

EXECUTIVE INTELLIGENCE

${currentReport.executiveSummary}

MARKET INTELLIGENCE

${currentReport.marketAnalysis}

COMPETITOR INTELLIGENCE

${currentReport.competitorAnalysis}

BUSINESS MODEL

${currentReport.businessModel}

PRICING STRATEGY

${currentReport.pricingStrategy}

FINANCIAL PROJECTION

${currentReport.financialProjection}

KEY RISKS

${currentReport.keyRisks.map((risk) => `- ${risk}`).join("\n")}

GROWTH BLUEPRINT

${currentReport.growthStrategy}

EXECUTION ROADMAP

${roadmapText}

INVESTOR MEMO

${currentReport.investorBrief}

Generated by EmpresaFi AI Venture Intelligence.
`.trim();
  }

  /**
   * Copies the complete business intelligence report.
   */
  async function copyReport() {
    if (!report) {
      return;
    }

    try {
      await navigator.clipboard.writeText(createReportText(report));

      setHasCopiedReport(true);

      window.setTimeout(() => {
        setHasCopiedReport(false);
      }, 2000);
    } catch {
      setError(
        "The report could not be copied. Please use the shareable report page instead.",
      );
    }
  }

  /**
   * Creates the shared input used by the explainable-scoring engine.
   */
  const confidenceInput: ConfidenceInput | null = report
    ? {
        ventureScore: report.ventureScore,

        marketOpportunityScore: report.marketOpportunityScore,

        investorReadinessScore: report.investorReadinessScore,

        riskLevel: report.riskLevel,

        revenuePotential: report.revenuePotential,

        startupCostEstimate: report.startupCostEstimate,

        keyRisks: report.keyRisks,
      }
    : null;

  /**
   * Produces section-level confidence values only after a report exists.
   */
  const sectionConfidence = confidenceInput
    ? generateSectionConfidence(confidenceInput)
    : null;

  return (
    <div className="space-y-8">
      {!report ? (
        <div className="space-y-8">
          <div
            className={`grid items-start gap-8 ${
              isAnalyzing
                ? "xl:grid-cols-[0.8fr_1.2fr]"
                : "lg:grid-cols-[1fr_0.8fr]"
            }`}
          >
            <form
              onSubmit={handleSubmit}
              className="venture-panel rounded-[2rem] p-6 text-white md:p-8"
            >
              <div className="mb-8">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-200">
                  <Sparkles className="h-4 w-4" />
                  Business Intelligence Intake
                </div>

                <h2 className="venture-gradient-text text-3xl font-bold tracking-tight md:text-5xl">
                  Analyze a new business idea.
                </h2>

                <p className="mt-4 max-w-2xl leading-7 text-white/50">
                  Enter your idea and EmpresaFi will generate a structured,
                  investor-ready business intelligence report with stable
                  scoring and decisive founder guidance.
                </p>
              </div>

              <fieldset
                disabled={isAnalyzing}
                className="space-y-5 disabled:cursor-not-allowed"
              >
                <label className="block">
                  <span className="text-sm text-white/70">Business idea</span>

                  <textarea
                    required
                    value={form.businessIdea}
                    onChange={(event) =>
                      updateField("businessIdea", event.target.value)
                    }
                    placeholder="Example: A WhatsApp-based AI assistant that helps Nigerian fashion vendors manage orders, inventory, and payments."
                    className="mt-2 min-h-32 w-full resize-y rounded-2xl border border-white/10 bg-black/30 p-4 outline-none ring-violet-400/40 placeholder:text-white/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>

                <div className="grid gap-5 md:grid-cols-2">
                  <label>
                    <span className="text-sm text-white/70">
                      Location / Country
                    </span>

                    <input
                      required
                      value={form.location}
                      onChange={(event) =>
                        updateField("location", event.target.value)
                      }
                      placeholder="Nigeria"
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none ring-violet-400/40 placeholder:text-white/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </label>

                  <label>
                    <span className="text-sm text-white/70">Industry</span>

                    <input
                      required
                      value={form.industry}
                      onChange={(event) =>
                        updateField("industry", event.target.value)
                      }
                      placeholder="Fintech, fashion, aquaculture, logistics..."
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none ring-violet-400/40 placeholder:text-white/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm text-white/70">
                    Target customers
                  </span>

                  <input
                    required
                    value={form.targetCustomers}
                    onChange={(event) =>
                      updateField("targetCustomers", event.target.value)
                    }
                    placeholder="Small businesses, freelancers, fish farmers..."
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none ring-violet-400/40 placeholder:text-white/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>

                <div className="grid gap-5 md:grid-cols-3">
                  <label>
                    <span className="text-sm text-white/70">
                      Starting budget
                    </span>

                    <input
                      value={form.budget}
                      onChange={(event) =>
                        updateField("budget", event.target.value)
                      }
                      placeholder="$500"
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none ring-violet-400/40 placeholder:text-white/30 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </label>

                  <label>
                    <span className="text-sm text-white/70">Goal</span>

                    <select
                      value={form.goal}
                      onChange={(event) =>
                        updateField(
                          "goal",
                          event.target.value as VentureInput["goal"],
                        )
                      }
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none ring-violet-400/40 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="validate">Validate</option>

                      <option value="launch">Launch</option>

                      <option value="raise_funds">Raise Funds</option>

                      <option value="expand">Expand</option>
                    </select>
                  </label>

                  <label>
                    <span className="text-sm text-white/70">Business type</span>

                    <select
                      value={form.ventureType}
                      onChange={(event) =>
                        updateField(
                          "ventureType",
                          event.target.value as VentureInput["ventureType"],
                        )
                      }
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none ring-violet-400/40 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="non_crypto">Non-crypto</option>

                      <option value="crypto">Crypto</option>

                      <option value="hybrid">Hybrid</option>
                    </select>
                  </label>
                </div>
              </fieldset>

              {error && (
                <div
                  role="alert"
                  className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm leading-6 text-red-200"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isAnalyzing}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isAnalyzing ? (
                  <>
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                    Building intelligence report...
                  </>
                ) : (
                  <>
                    Generate Intelligence Report
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              {isAnalyzing && (
                <p className="mt-3 text-center text-xs leading-5 text-white/45">
                  Keep this page open while EmpresaFi completes the intelligence
                  workflow.
                </p>
              )}
            </form>

            {isAnalyzing ? (
              <div className="xl:sticky xl:top-8">
                <AnalysisPipeline
                  steps={pipelineSteps}
                  isRunning={isAnalyzing}
                />
              </div>
            ) : (
              <aside className="venture-panel rounded-[2rem] p-6 text-white md:p-8 lg:sticky lg:top-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  EmpresaFi Intelligence Workflow
                </div>

                <h2 className="mt-5 text-2xl font-semibold tracking-tight md:text-3xl">
                  From raw idea to founder decision.
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/50">
                  EmpresaFi combines deterministic scoring, AI strategic
                  intelligence, financial modeling, risk analysis, and investor
                  guidance in one structured workflow.
                </p>

                <div className="mt-7 space-y-3">
                  {[
                    {
                      number: "01",
                      title: "Stable venture scoring",
                      description:
                        "Repeatable market, venture, investor, risk, and revenue signals.",
                    },
                    {
                      number: "02",
                      title: "Strategic intelligence",
                      description:
                        "Competitive landscape, market signals, and industry context.",
                    },
                    {
                      number: "03",
                      title: "Decision guidance",
                      description:
                        "A clear verdict, biggest blocker, experiment, and founder path.",
                    },
                    {
                      number: "04",
                      title: "Investor-ready output",
                      description:
                        "Financial scenarios, roadmap, radar analysis, and shareable report.",
                    },
                  ].map((item) => (
                    <article
                      key={item.number}
                      className="flex gap-4 rounded-2xl border border-white/7 bg-white/[0.025] p-4"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-xs font-semibold text-violet-200">
                        {item.number}
                      </span>

                      <div>
                        <h3 className="text-sm font-semibold text-white/80">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-white/40">
                          {item.description}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-amber-400/15 bg-amber-400/[0.05] px-4 py-3 text-xs leading-5 text-amber-100/55">
                  EmpresaFi provides strategic planning intelligence. Its
                  estimates should be validated with real customers and business
                  data before major financial decisions.
                </div>
              </aside>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <section className="venture-panel rounded-[2rem] p-6 text-white md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Intelligence Report Generated
                  </div>

                  <StatusBadge mode={report.generationMode} />
                </div>

                <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
                  {report.ventureName}
                </h2>

                <p className="mt-3 text-sm text-white/45">
                  Generated by the EmpresaFi AI Venture Intelligence Engine
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={copyReport}
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70 transition hover:bg-white/10"
                >
                  {hasCopiedReport ? (
                    <>
                      <Check className="mr-2 h-4 w-4 text-emerald-300" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Report
                    </>
                  )}
                </button>

                <Link
                  href={`/report/${report.id}`}
                  className="inline-flex items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 px-4 py-3 text-sm text-violet-100 transition hover:bg-violet-400/15"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Shareable Report
                </Link>

                <button
                  type="button"
                  onClick={startNewAnalysis}
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-sm text-white/60 transition hover:bg-white/10"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Analysis
                </button>
              </div>
            </div>
          </section>

          <ReportCover
  reportId={report.id}
  ventureName={report.ventureName}
  createdAt={report.createdAt}
  generationDurationMs={
    report.generationDurationMs
  }
  generationMode={report.generationMode}
  reportVersion={report.reportVersion}
  modelName={report.modelName}
  scoringVersion={report.scoringVersion}
  insightMode={
    report.insights?.researchMode
  }
  industry={
    report.industry ?? form.industry
  }
  location={
    report.location ?? form.location
  }
  ventureScore={report.ventureScore}
  marketOpportunityScore={
    report.marketOpportunityScore
  }
  investorReadinessScore={
    report.investorReadinessScore
  }
  riskLevel={report.riskLevel}
  goal={report.goal ?? form.goal}
  targetCustomers={
    report.targetCustomers ??
    form.targetCustomers
  }
  ventureType={
    report.ventureType ??
    form.ventureType
  }
/>


          <EmpresaFiAdvisor
            ventureScore={report.ventureScore}
            marketOpportunityScore={report.marketOpportunityScore}
            investorReadinessScore={report.investorReadinessScore}
            riskLevel={report.riskLevel}
            goal={report.goal ?? form.goal}
            targetCustomers={report.targetCustomers ?? form.targetCustomers}
            industry={report.industry ?? form.industry}
            location={report.location ?? form.location}
            ventureType={report.ventureType ?? form.ventureType}
          />

          <EmpresaFiInsightFeed insights={report.insights} />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <VentureScoreCard
              label="Venture Health Score"
              value={`${report.ventureScore}/100`}
              helper="Overall business strength"
            />

            <VentureScoreCard
              label="Market Opportunity"
              value={`${report.marketOpportunityScore}/100`}
              helper="Demand and market timing"
            />

            <VentureScoreCard
              label="Investor Readiness"
              value={`${report.investorReadinessScore}/100`}
              helper="Funding preparedness"
            />

            <VentureScoreCard
              label="Risk Level"
              value={report.riskLevel}
              helper="Execution and market risk"
            />

            <VentureScoreCard
              label="Revenue Potential"
              value={report.revenuePotential}
              helper="Commercial upside"
            />

            <VentureScoreCard
              label="Startup Cost"
              value={report.startupCostEstimate}
              helper="Estimated launch capital"
            />
          </div>

          {confidenceInput && <ScoreExplanationPanel {...confidenceInput} />}

          <div className="grid gap-6 xl:grid-cols-2">
            <ReportSection
              title="Executive Intelligence"
              text={report.executiveSummary}
              confidence={sectionConfidence?.executiveSummary}
              provenance={
                report.generationMode === "fallback"
                  ? "local_recovery"
                  : "ai_generated"
              }
            />

            <ReportSection
              title="Market Intelligence"
              text={report.marketAnalysis}
              confidence={sectionConfidence?.marketAnalysis}
              provenance={
                report.generationMode === "fallback"
                  ? "local_recovery"
                  : "ai_generated"
              }
            />

            <ReportSection
              title="Competitor Intelligence"
              text={report.competitorAnalysis}
              confidence={sectionConfidence?.competitorAnalysis}
              provenance={
                report.generationMode === "fallback"
                  ? "local_recovery"
                  : "ai_generated"
              }
            />

            <ReportSection
              title="Business Model"
              text={report.businessModel}
              confidence={sectionConfidence?.businessModel}
              provenance={
                report.generationMode === "fallback"
                  ? "local_recovery"
                  : "ai_generated"
              }
            />

            <ReportSection
              title="Pricing Strategy"
              text={report.pricingStrategy}
              confidence={sectionConfidence?.pricingStrategy}
              provenance={
                report.generationMode === "fallback"
                  ? "local_recovery"
                  : "ai_generated"
              }
            />

            <ReportSection
              title="Financial Projection"
              text={report.financialProjection}
              confidence={sectionConfidence?.financialProjection}
              provenance={
                report.generationMode === "fallback"
                  ? "local_recovery"
                  : "ai_generated"
              }
            />

            <ReportSection
              title="Growth Blueprint"
              text={report.growthStrategy}
              confidence={sectionConfidence?.growthStrategy}
              provenance={
                report.generationMode === "fallback"
                  ? "local_recovery"
                  : "ai_generated"
              }
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <section className="rounded-[2rem] border border-red-400/15 bg-red-400/[0.06] p-6 text-white backdrop-blur md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300/70">
                Risk intelligence
              </p>

              <h2 className="mt-2 text-2xl font-semibold">Key Risks</h2>

              <ul className="mt-6 space-y-3">
                {report.keyRisks.map((risk, index) => (
                  <li
                    key={`${risk}-${index}`}
                    className="rounded-2xl border border-white/8 bg-black/15 p-4 text-sm leading-6 text-white/65"
                  >
                    <span className="mr-3 font-medium text-red-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {risk}
                  </li>
                ))}
              </ul>
            </section>

            <ReportSection
              title="Growth Blueprint"
              text={report.growthStrategy}
              confidence={sectionConfidence?.growthStrategy}
            />
          </div>

          <SwotAnalysis
            ventureScore={report.ventureScore}
            marketOpportunityScore={report.marketOpportunityScore}
            investorReadinessScore={report.investorReadinessScore}
            riskLevel={report.riskLevel}
            revenuePotential={report.revenuePotential}
            startupCostEstimate={report.startupCostEstimate}
            businessModel={report.businessModel}
            competitorAnalysis={report.competitorAnalysis}
            growthStrategy={report.growthStrategy}
            keyRisks={report.keyRisks}
          />

          <BusinessModelCanvas
            businessIdea={report.businessIdea ?? form.businessIdea}
            location={report.location ?? form.location}
            industry={report.industry ?? form.industry}
            targetCustomers={report.targetCustomers ?? form.targetCustomers}
            startupCostEstimate={report.startupCostEstimate}
            businessModel={report.businessModel}
            pricingStrategy={report.pricingStrategy}
            growthStrategy={report.growthStrategy}
            competitorAnalysis={report.competitorAnalysis}
            financialProjection={report.financialProjection}
          />

          <RevenueProjectionChart
            ventureScore={report.ventureScore}
            marketOpportunityScore={report.marketOpportunityScore}
            investorReadinessScore={report.investorReadinessScore}
            revenuePotential={report.revenuePotential}
            startupCostEstimate={report.startupCostEstimate}
            financialProjection={report.financialProjection}
          />

          <MarketSizingVisualization
            marketOpportunityScore={report.marketOpportunityScore}
            ventureScore={report.ventureScore}
            investorReadinessScore={report.investorReadinessScore}
            startupCostEstimate={report.startupCostEstimate}
            financialProjection={report.financialProjection}
            location={report.location ?? form.location}
            industry={report.industry ?? form.industry}
            targetCustomers={report.targetCustomers ?? form.targetCustomers}
          />

          <RoadmapTimeline roadmap={report.roadmap} />

          <InvestorReadinessRadar
            ventureScore={report.ventureScore}
            marketOpportunityScore={report.marketOpportunityScore}
            investorReadinessScore={report.investorReadinessScore}
            riskLevel={report.riskLevel}
            revenuePotential={report.revenuePotential}
            businessModel={report.businessModel}
            pricingStrategy={report.pricingStrategy}
            financialProjection={report.financialProjection}
            keyRisks={report.keyRisks}
          />

          <InvestorBrief brief={report.investorBrief} />
        </div>
      )}
    </div>
  );
}
