// lib/ventureEngine.ts

import { generateAiVentureReport } from "./aiClient";
import { generateVentureInsights } from "./insightEngine";
import { createMockVentureReport } from "./mockReport";
import {
  scoreVenture,
  type VentureScoringResult,
} from "./scoringEngine";
import {
  type VentureInput,
  type VentureReport,
} from "./reportSchema";

/**
 * Validates the minimum founder information required before EmpresaFi
 * starts its scoring, insight, and report-generation workflow.
 *
 * The API already validates requests with Zod, but this additional check
 * protects the intelligence engine when it is called from another service,
 * integration, test, or future delivery channel.
 */
function validateVentureInput(input: VentureInput): void {
  if (!input.businessIdea.trim()) {
    throw new Error("Business idea is required.");
  }

  if (!input.location.trim()) {
    throw new Error("Location is required.");
  }

  if (!input.industry.trim()) {
    throw new Error("Industry is required.");
  }

  if (!input.targetCustomers.trim()) {
    throw new Error("Target customers are required.");
  }
}

/**
 * Creates the application metadata attached to every generated report.
 *
 * Prisma creates the final persistent database ID after the report is saved.
 * This temporary ID allows the engine result to satisfy the VentureReport
 * shape before persistence.
 */
function createReportMetadata() {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
}

/**
 * Applies EmpresaFi's deterministic scoring result to a report.
 *
 * Gemini generates and personalizes the narrative, but it is never allowed
 * to override the headline scores or classifications calculated by the
 * deterministic scoring engine.
 */
function applyStableScoring(
  report: VentureReport,
  scoring: VentureScoringResult
): VentureReport {
  return {
    ...report,

    ventureScore: scoring.ventureScore,

    marketOpportunityScore:
      scoring.marketOpportunityScore,

    investorReadinessScore:
      scoring.investorReadinessScore,

    riskLevel: scoring.riskLevel,

    revenuePotential: scoring.revenuePotential,
  };
}

/**
 * analyzeVenture is the main EmpresaFi Venture Intelligence Engine.
 *
 * Workflow:
 * 1. Validate the founder input.
 * 2. Calculate stable, deterministic venture scores.
 * 3. Generate venture-specific strategic intelligence.
 * 4. Ask Gemini to generate the personalized report narrative.
 * 5. Recover individual invalid report fields inside the AI client.
 * 6. Reapply EmpresaFi's deterministic scores as the final authority.
 * 7. Return a complete local fallback report only if AI generation fails.
 *
 * Identical normalized founder input always produces identical:
 * - Venture score
 * - Market opportunity score
 * - Investor readiness score
 * - Risk level
 * - Revenue potential
 *
 * Gemini wording may vary slightly, but the core decision intelligence
 * remains stable.
 */
export async function analyzeVenture(
  input: VentureInput
): Promise<VentureReport> {
  validateVentureInput(input);

  /**
   * Calculate all headline scores before Gemini is called.
   *
   * Gemini receives these values for explanation, but it does not decide
   * or modify them.
   */
  const scoring: VentureScoringResult =
    scoreVenture(input);

  /**
   * Keep this concise development log until deployment verification is
   * complete. It helps confirm that repeated submissions produce the
   * same deterministic scoring result.
   */
  console.log("[EmpresaFi Scoring]", {
    scoringVersion: scoring.scoringVersion,

    ventureScore: scoring.ventureScore,

    marketOpportunityScore:
      scoring.marketOpportunityScore,

    investorReadinessScore:
      scoring.investorReadinessScore,

    riskLevel: scoring.riskLevel,

    revenuePotential: scoring.revenuePotential,
  });

  /**
   * Generate venture-specific strategic intelligence.
   *
   * The Insight Engine has its own recovery path. If its Gemini request
   * fails, it returns a transparent local strategic-insight package rather
   * than stopping the complete report workflow.
   */
  const insights =
    await generateVentureInsights(input);

  try {
    /**
     * Gemini receives:
     * - Founder input
     * - Strategic intelligence
     * - Deterministic scoring
     *
     * The AI client now performs field-level recovery. Valid AI sections
     * remain intact while only missing or invalid fields are replaced.
     */
    const aiReport =
      await generateAiVentureReport(
        input,
        insights,
        scoring
      );

    const reportWithMetadata: VentureReport = {
      ...aiReport,
      ...createReportMetadata(),

      generationMode: "ai",

      /**
       * Preserve the strategic intelligence package for:
       * - the immediate report dashboard
       * - the API response
       * - PostgreSQL persistence
       * - the shareable report page
       */
      insights,
    };

    /**
     * Reapply EmpresaFi's deterministic scores after AI generation and
     * field-level recovery. This is the final consistency safeguard.
     */
    return applyStableScoring(
      reportWithMetadata,
      scoring
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown AI report-generation error.";

    console.error(
      `[EmpresaFi Report Engine] AI generation failed. Using complete local fallback: ${message}`
    );

    /**
     * A complete local fallback is now used only when the AI request,
     * response parsing, or report-generation process fails entirely.
     *
     * Individual invalid fields are already handled inside aiClient.ts
     * through section-level recovery.
     */
    const fallbackReport =
      createMockVentureReport(input);

    const reportWithMetadata: VentureReport = {
      ...fallbackReport,
      ...createReportMetadata(),

      generationMode: "fallback",

      insights,
    };

    /**
     * Apply the same deterministic scoring values to the fallback report.
     * The founder therefore receives stable decision intelligence even
     * when Gemini is unavailable.
     */
    return applyStableScoring(
      reportWithMetadata,
      scoring
    );
  }
}