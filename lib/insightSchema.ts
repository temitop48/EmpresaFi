// lib/insightSchema.ts

import { z } from "zod";

/**
 * One external source used by EmpresaFi's live research layer.
 */
export const insightSourceSchema = z.object({
  title: z.string().min(2),
  url: z.string().url(),
  domain: z.string().min(2),
});

/**
 * One competitor discovered during live market research.
 */
export const competitorInsightSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  relevance: z.string().min(10),
  strength: z.string().min(5),
  sourceUrl: z.string().url().optional(),
});

/**
 * One recent signal affecting the venture's target market.
 */
export const marketSignalSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(15),
  significance: z.string().min(10),
  sourceUrl: z.string().url().optional(),
  publishedAt: z.string().optional(),
});

/**
 * One industry fact supported by the grounded research response.
 */
export const industryFactSchema = z.object({
  fact: z.string().min(15),
  relevance: z.string().min(10),
  sourceUrl: z.string().url().optional(),
});

/**
 * Full live-market intelligence package used by the report generator.
 */
export const ventureInsightsSchema = z.object({
  competitors: z.array(competitorInsightSchema).min(1).max(5),
  marketSignals: z.array(marketSignalSchema).min(1).max(5),
  industryFacts: z.array(industryFactSchema).min(1).max(3),
  sources: z.array(insightSourceSchema).max(12),

  researchSummary: z.string().min(20),

  researchMode: z.enum([
    "live_search",
    "ai_estimate",
    "fallback",
  ]),

  researchedAt: z.string(),
});

export type VentureInsights = z.infer<
  typeof ventureInsightsSchema
>;