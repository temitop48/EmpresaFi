// lib/reportRecovery.ts

import { createMockVentureReport } from "./mockReport";
import {
  AiVentureReport,
  aiVentureReportSchema,
  VentureInput,
} from "./reportSchema";

/**
 * Lists every AI report field that can be recovered independently.
 */
export type RecoverableReportField = keyof AiVentureReport;

export type ReportRecoveryResult = {
  report: AiVentureReport;
  recoveredFields: RecoverableReportField[];
  aiGeneratedFields: RecoverableReportField[];
};

/**
 * Reads one unknown property from a parsed Gemini response.
 */
function readProperty(
  value: unknown,
  property: string
): unknown {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return undefined;
  }

  return (value as Record<string, unknown>)[property];
}

/**
 * Keeps a valid Gemini value or replaces only that field
 * with the equivalent local fallback value.
 */
function recoverField<T>({
  rawValue,
  schema,
  fallbackValue,
  field,
  recoveredFields,
  aiGeneratedFields,
}: {
  rawValue: unknown;
  schema: {
    safeParse: (
      value: unknown
    ) =>
      | {
          success: true;
          data: T;
        }
      | {
          success: false;
        };
  };
  fallbackValue: T;
  field: RecoverableReportField;
  recoveredFields: RecoverableReportField[];
  aiGeneratedFields: RecoverableReportField[];
}): T {
  const result = schema.safeParse(rawValue);

  if (result.success) {
    aiGeneratedFields.push(field);
    return result.data;
  }

  recoveredFields.push(field);
  return fallbackValue;
}

/**
 * Recovers a partially valid Gemini report field by field.
 *
 * Valid AI-written sections remain untouched. Only invalid, missing,
 * or incomplete fields are replaced with dependable local content.
 */
export function recoverAiVentureReport(
  parsedResponse: unknown,
  input: VentureInput
): ReportRecoveryResult {
  const fallback = createMockVentureReport(input);

  const recoveredFields: RecoverableReportField[] = [];
  const aiGeneratedFields: RecoverableReportField[] = [];

  const shape = aiVentureReportSchema.shape;

  const report: AiVentureReport = {
    ventureName: recoverField({
      rawValue: readProperty(
        parsedResponse,
        "ventureName"
      ),
      schema: shape.ventureName,
      fallbackValue: fallback.ventureName,
      field: "ventureName",
      recoveredFields,
      aiGeneratedFields,
    }),

    ventureScore: recoverField({
      rawValue: readProperty(
        parsedResponse,
        "ventureScore"
      ),
      schema: shape.ventureScore,
      fallbackValue: fallback.ventureScore,
      field: "ventureScore",
      recoveredFields,
      aiGeneratedFields,
    }),

    marketOpportunityScore: recoverField({
      rawValue: readProperty(
        parsedResponse,
        "marketOpportunityScore"
      ),
      schema: shape.marketOpportunityScore,
      fallbackValue:
        fallback.marketOpportunityScore,
      field: "marketOpportunityScore",
      recoveredFields,
      aiGeneratedFields,
    }),

    investorReadinessScore: recoverField({
      rawValue: readProperty(
        parsedResponse,
        "investorReadinessScore"
      ),
      schema: shape.investorReadinessScore,
      fallbackValue:
        fallback.investorReadinessScore,
      field: "investorReadinessScore",
      recoveredFields,
      aiGeneratedFields,
    }),

    riskLevel: recoverField({
      rawValue: readProperty(
        parsedResponse,
        "riskLevel"
      ),
      schema: shape.riskLevel,
      fallbackValue: fallback.riskLevel,
      field: "riskLevel",
      recoveredFields,
      aiGeneratedFields,
    }),

    revenuePotential: recoverField({
      rawValue: readProperty(
        parsedResponse,
        "revenuePotential"
      ),
      schema: shape.revenuePotential,
      fallbackValue:
        fallback.revenuePotential,
      field: "revenuePotential",
      recoveredFields,
      aiGeneratedFields,
    }),

    startupCostEstimate: recoverField({
      rawValue: readProperty(
        parsedResponse,
        "startupCostEstimate"
      ),
      schema: shape.startupCostEstimate,
      fallbackValue:
        fallback.startupCostEstimate,
      field: "startupCostEstimate",
      recoveredFields,
      aiGeneratedFields,
    }),

    executiveSummary: recoverField({
      rawValue: readProperty(
        parsedResponse,
        "executiveSummary"
      ),
      schema: shape.executiveSummary,
      fallbackValue:
        fallback.executiveSummary,
      field: "executiveSummary",
      recoveredFields,
      aiGeneratedFields,
    }),

    marketAnalysis: recoverField({
      rawValue: readProperty(
        parsedResponse,
        "marketAnalysis"
      ),
      schema: shape.marketAnalysis,
      fallbackValue:
        fallback.marketAnalysis,
      field: "marketAnalysis",
      recoveredFields,
      aiGeneratedFields,
    }),

    competitorAnalysis: recoverField({
      rawValue: readProperty(
        parsedResponse,
        "competitorAnalysis"
      ),
      schema: shape.competitorAnalysis,
      fallbackValue:
        fallback.competitorAnalysis,
      field: "competitorAnalysis",
      recoveredFields,
      aiGeneratedFields,
    }),

    businessModel: recoverField({
      rawValue: readProperty(
        parsedResponse,
        "businessModel"
      ),
      schema: shape.businessModel,
      fallbackValue: fallback.businessModel,
      field: "businessModel",
      recoveredFields,
      aiGeneratedFields,
    }),

    pricingStrategy: recoverField({
      rawValue: readProperty(
        parsedResponse,
        "pricingStrategy"
      ),
      schema: shape.pricingStrategy,
      fallbackValue:
        fallback.pricingStrategy,
      field: "pricingStrategy",
      recoveredFields,
      aiGeneratedFields,
    }),

    financialProjection: recoverField({
      rawValue: readProperty(
        parsedResponse,
        "financialProjection"
      ),
      schema: shape.financialProjection,
      fallbackValue:
        fallback.financialProjection,
      field: "financialProjection",
      recoveredFields,
      aiGeneratedFields,
    }),

    keyRisks: recoverField({
      rawValue: readProperty(
        parsedResponse,
        "keyRisks"
      ),
      schema: shape.keyRisks,
      fallbackValue: fallback.keyRisks,
      field: "keyRisks",
      recoveredFields,
      aiGeneratedFields,
    }),

    growthStrategy: recoverField({
      rawValue: readProperty(
        parsedResponse,
        "growthStrategy"
      ),
      schema: shape.growthStrategy,
      fallbackValue:
        fallback.growthStrategy,
      field: "growthStrategy",
      recoveredFields,
      aiGeneratedFields,
    }),

    roadmap: recoverField({
      rawValue: readProperty(
        parsedResponse,
        "roadmap"
      ),
      schema: shape.roadmap,
      fallbackValue: fallback.roadmap,
      field: "roadmap",
      recoveredFields,
      aiGeneratedFields,
    }),

    investorBrief: recoverField({
      rawValue: readProperty(
        parsedResponse,
        "investorBrief"
      ),
      schema: shape.investorBrief,
      fallbackValue:
        fallback.investorBrief,
      field: "investorBrief",
      recoveredFields,
      aiGeneratedFields,
    }),
  };

  return {
    report,
    recoveredFields,
    aiGeneratedFields,
  };
}