// lib/mockInsights.ts

import { VentureInput } from "./reportSchema";
import { VentureInsights } from "./insightSchema";

/**
 * Creates a transparent fallback insight package.
 *
 * These entries are strategic estimates rather than live findings.
 * The UI must clearly label them as fallback intelligence.
 */
export function createFallbackInsights(input: VentureInput): VentureInsights {
  return {
    competitors: [
      {
        name: "Direct category competitors",
        description: `Existing businesses already serving ${input.targetCustomers} in the ${input.industry} market.`,
        relevance:
          "These businesses compete for the same customer attention, budget, or workflow.",
        strength:
          "Existing market presence and established customer relationships.",
      },
      {
        name: "Manual alternatives",
        description:
          "Spreadsheets, messaging applications, paper records, and informal service processes.",
        relevance:
          "Customers may continue using familiar tools instead of adopting a new solution.",
        strength: "Low switching cost and existing user familiarity.",
      },
      {
        name: "Adjacent software platforms",
        description:
          "General-purpose tools that solve part of the customer problem without focusing on the full workflow.",
        relevance:
          "These products may satisfy enough of the need to reduce demand for a specialized platform.",
        strength: "Broader product ecosystems and larger marketing budgets.",
      },
    ],

    marketSignals: [
      {
        title: "Digital workflow adoption",
        summary: `Businesses in ${input.location} are increasingly evaluating digital tools that reduce manual work.`,
        significance:
          "This may improve willingness to test focused automation products.",
      },
      {
        title: "Demand for affordable business software",
        summary:
          "Small businesses continue to favor tools that are simple, mobile-friendly, and affordable.",
        significance:
          "A lean and accessible product may outperform a complex enterprise-style solution.",
      },
      {
        title: "AI-assisted operations",
        summary:
          "AI features are increasingly being introduced into customer support, operations, and business decision workflows.",
        significance:
          "AI can strengthen the venture if it delivers measurable outcomes rather than novelty alone.",
      },
    ],

    industryFacts: [
      {
        fact: "Early-stage ventures should validate customer urgency and willingness to pay before using broad market estimates.",
        relevance:
          "This reduces the risk of confusing general interest with actual commercial demand.",
      },
      {
        fact: "Founder-led customer discovery is usually the fastest way to test positioning during an MVP stage.",
        relevance:
          "Direct interviews can reveal stronger problems, objections, and pricing expectations.",
      },
    ],

    sources: [],

    researchSummary:
      "EmpresaFi used its local strategic-intelligence fallback to identify likely competitors, market signals, and industry considerations from the submitted venture context.",

    researchMode: "fallback",
    researchedAt: new Date().toISOString(),
  };
}
