// lib/reportSchema.ts

import { z } from "zod";
import type { VentureInsights } from "./insightSchema";

/* =========================================================
   Venture Input
========================================================= */

export const ventureGoalSchema = z.enum([
  "validate",
  "launch",
  "raise_funds",
  "expand",
]);

export const ventureTypeSchema = z.enum([
  "crypto",
  "non_crypto",
  "hybrid",
]);

export const ventureInputSchema = z.object({
  businessIdea: z
    .string()
    .trim()
    .min(20, "Business idea must contain at least 20 characters.")
    .max(3000),

  location: z
    .string()
    .trim()
    .min(2)
    .max(100),

  industry: z
    .string()
    .trim()
    .min(2)
    .max(100),

  targetCustomers: z
    .string()
    .trim()
    .min(3)
    .max(500),

  budget: z
    .string()
    .trim()
    .max(100)
    .default(""),

  goal: ventureGoalSchema,

  ventureType: ventureTypeSchema,
});

export type VentureInput = z.infer<
  typeof ventureInputSchema
>;

/* =========================================================
   Roadmap
========================================================= */

export const roadmapItemSchema = z.object({
  period: z.enum([
    "30 Days",
    "90 Days",
    "365 Days",
  ]),

  title: z.string().trim().min(3),

  actions: z
    .array(
      z.string().trim().min(3)
    )
    .min(3)
    .max(6),
});

export type RoadmapItem = z.infer<
  typeof roadmapItemSchema
>;

/* =========================================================
   Confidence
========================================================= */

export const reportSectionConfidenceSchema =
  z.object({
    executiveSummary: z.number().min(0).max(100),

    marketAnalysis: z.number().min(0).max(100),

    competitorAnalysis: z.number().min(0).max(100),

    businessModel: z.number().min(0).max(100),

    pricingStrategy: z.number().min(0).max(100),

    financialProjection: z.number().min(0).max(100),

    growthStrategy: z.number().min(0).max(100),
  });

export type ReportSectionConfidence =
  z.infer<
    typeof reportSectionConfidenceSchema
  >;

/* =========================================================
   AI Venture Report
========================================================= */

export const aiVentureReportSchema = z.object({
  ventureName: z.string().trim().min(3),

  ventureScore: z.number().int().min(0).max(100),

  marketOpportunityScore: z
    .number()
    .int()
    .min(0)
    .max(100),

  investorReadinessScore: z
    .number()
    .int()
    .min(0)
    .max(100),

  riskLevel: z.enum([
    "Low",
    "Medium",
    "High",
  ]),

  revenuePotential: z.enum([
    "Low",
    "Medium",
    "High",
  ]),

  startupCostEstimate: z
    .string()
    .trim()
    .min(1),

  executiveSummary: z
    .string()
    .trim()
    .min(20),

  marketAnalysis: z
    .string()
    .trim()
    .min(20),

  competitorAnalysis: z
    .string()
    .trim()
    .min(20),

  businessModel: z
    .string()
    .trim()
    .min(20),

  pricingStrategy: z
    .string()
    .trim()
    .min(20),

  financialProjection: z
    .string()
    .trim()
    .min(20),

  keyRisks: z
    .array(
      z.string().trim().min(3)
    )
    .min(3)
    .max(7),

  growthStrategy: z
    .string()
    .trim()
    .min(20),

  roadmap: z
    .array(roadmapItemSchema)
    .length(3),

  investorBrief: z
    .string()
    .trim()
    .min(20),
});

export type AiVentureReport = z.infer<
  typeof aiVentureReportSchema
>;

/* =========================================================
   Report Metadata
========================================================= */

export type ReportGenerationMode =
  | "ai"
  | "fallback";

/* =========================================================
   Venture Report
========================================================= */

export type VentureReport =
  AiVentureReport & {
    /**
     * Persistent database ID
     */
    id: string;

    /**
     * Creation timestamp.
     */
    createdAt: string | Date;

    /**
     * Last modification timestamp.
     */
    updatedAt?: string | Date;

    /**
     * AI or fallback.
     */
    generationMode?: ReportGenerationMode;

    /**
     * Time required to generate the report.
     */
    generationDurationMs?: number;

    /**
     * EmpresaFi report version.
     */
    reportVersion?: string;

    /**
     * AI model used.
     */
    modelName?: string;

    /**
     * Deterministic scoring version.
     */
    scoringVersion?: string;

    /**
     * Overall report confidence.
     */
    overallConfidence?: number;

    /**
     * Advisor confidence.
     */
    advisorConfidence?: number;

    /**
     * Confidence for each narrative section.
     */
    sectionConfidence?: ReportSectionConfidence;

    /**
     * Insight Engine output.
     */
    insights?: VentureInsights;

    /**
     * Original founder submission.
     */
    businessIdea?: string;

    location?: string;

    industry?: string;

    targetCustomers?: string;

    budget?: string | null;

    goal?: VentureInput["goal"];

    ventureType?: VentureInput["ventureType"];
  };