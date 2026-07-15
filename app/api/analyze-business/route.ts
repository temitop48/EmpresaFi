// app/api/analyze-business/route.ts

import { NextResponse } from "next/server";
import { analyzeVenture } from "@/lib/ventureEngine";
import { prisma } from "@/lib/prisma";
import { ventureInputSchema } from "@/lib/reportSchema";

/**
 * Prevents browsers, proxies, and deployment platforms from caching
 * newly generated intelligence reports.
 */
const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

/**
 * Returns the public model label attached to the report metadata.
 *
 * Environment configuration remains the source of truth, while the
 * fallback keeps local development predictable.
 */
function getModelName(): string {
  return (
    process.env.GEMINI_MODEL?.trim() ||
    "gemini-3.1-flash-lite"
  );
}

/**
 * POST /api/analyze-business
 *
 * Main EmpresaFi ASP endpoint.
 *
 * Workflow:
 * 1. Validate the founder's submitted business information.
 * 2. Run deterministic scoring and strategic intelligence generation.
 * 3. Generate and recover the structured AI report.
 * 4. Apply the complete local fallback only when AI generation fails.
 * 5. Save the report and strategic-insight package to PostgreSQL.
 * 6. Return a reusable response with report and generation metadata.
 */
export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();

  try {
    /**
     * Read the incoming payload as unknown data.
     *
     * EmpresaFi does not trust the request body until Zod validates it.
     */
    let rawBody: unknown;

    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          requestId,

          error: {
            code: "INVALID_JSON",
            message:
              "The request body must contain valid JSON.",
          },
        },
        {
          status: 400,
          headers: noStoreHeaders,
        }
      );
    }

    const validationResult =
      ventureInputSchema.safeParse(rawBody);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          requestId,

          error: {
            code: "INVALID_INPUT",
            message:
              "The business analysis request contains invalid or missing information.",

            fields:
              validationResult.error.flatten().fieldErrors,
          },
        },
        {
          status: 400,
          headers: noStoreHeaders,
        }
      );
    }

    const input = validationResult.data;

    /**
     * analyzeVenture runs the complete EmpresaFi intelligence workflow:
     *
     * - deterministic scoring
     * - strategic Insight Engine
     * - Gemini narrative generation
     * - field-level report recovery
     * - complete local fallback when necessary
     */
    const report = await analyzeVenture(input);

    const durationMs = Date.now() - startedAt;

    const generationMode =
      report.generationMode ?? "ai";

    const insightMode =
      report.insights?.researchMode ?? "fallback";

    const reportVersion = "1.0";
    const scoringVersion = "1.0";
    const modelName = getModelName();

    /**
     * Save the stable report fields and strategic intelligence.
     *
     * generationMode, duration, model, and version metadata currently
     * remain response metadata unless matching Prisma columns are added.
     */
    const savedReport =
      await prisma.ventureReport.create({
        data: {
          ventureName: report.ventureName,

          businessIdea: input.businessIdea,
          location: input.location,
          industry: input.industry,
          targetCustomers: input.targetCustomers,
          budget: input.budget || null,
          goal: input.goal,
          ventureType: input.ventureType,

          ventureScore: report.ventureScore,

          marketOpportunityScore:
            report.marketOpportunityScore,

          investorReadinessScore:
            report.investorReadinessScore,

          riskLevel: report.riskLevel,

          revenuePotential:
            report.revenuePotential,

          startupCostEstimate:
            report.startupCostEstimate,

          executiveSummary:
            report.executiveSummary,

          marketAnalysis:
            report.marketAnalysis,

          competitorAnalysis:
            report.competitorAnalysis,

          businessModel:
            report.businessModel,

          pricingStrategy:
            report.pricingStrategy,

          financialProjection:
            report.financialProjection,

          growthStrategy:
            report.growthStrategy,

          investorBrief:
            report.investorBrief,

          keyRisks: report.keyRisks,
          roadmap: report.roadmap,

          /**
           * Preserve competitors, market signals, industry intelligence,
           * methodology details, and insight provenance for shareable
           * reports and refresh-safe report viewing.
           */
          insights:
            report.insights ?? undefined,
        },
      });

    /**
     * These counts support response metadata, debugging, and future
     * report methodology or monitoring features.
     */
    const insightSummary = {
      mode: insightMode,

      generatedAt:
        report.insights?.researchedAt ?? null,

      competitorCount:
        report.insights?.competitors.length ?? 0,

      marketSignalCount:
        report.insights?.marketSignals.length ?? 0,

      industryIntelligenceCount:
        report.insights?.industryFacts.length ?? 0,

      sourceCount:
        report.insights?.sources.length ?? 0,
    };

    console.log(
      `[EmpresaFi ${requestId}] Analysis completed in ${durationMs}ms. ` +
        `Report mode: ${generationMode}. ` +
        `Insight mode: ${insightMode}. ` +
        `Saved report: ${savedReport.id}.`
    );

    return NextResponse.json(
      {
        success: true,

        requestId,

        service: {
          name: "EmpresaFi",
          version: "1.0.0",
          type: "AI Venture Intelligence ASP",
        },

        generation: {
          mode: generationMode,
          durationMs,
          modelName,
          reportVersion,
          scoringVersion,
          insights: insightSummary,
        },

        /**
         * The saved Prisma object is enriched with response-only metadata
         * used by the professional report cover and methodology sections.
         */
        report: {
          ...savedReport,

          generationMode,
          generationDurationMs: durationMs,
          reportVersion,
          modelName,
          scoringVersion,
        },
      },
      {
        status: 200,
        headers: noStoreHeaders,
      }
    );
  } catch (error) {
    const durationMs = Date.now() - startedAt;

    const errorMessage =
      error instanceof Error
        ? error.message
        : "The business analysis failed unexpectedly.";

    console.error(
      `[EmpresaFi ${requestId}] Analysis failed after ${durationMs}ms:`,
      error
    );

    return NextResponse.json(
      {
        success: false,

        requestId,

        service: {
          name: "EmpresaFi",
          version: "1.0.0",
          type: "AI Venture Intelligence ASP",
        },

        error: {
          code: "ANALYSIS_FAILED",

          /**
           * Suitable for the MVP. Before a wider public launch, replace
           * provider or database details with a generic public message
           * and retain the full error only in server logs.
           */
          message: errorMessage,
        },

        durationMs,
      },
      {
        status: 500,
        headers: noStoreHeaders,
      }
    );
  }
}