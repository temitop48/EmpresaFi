// app/api/asp/route.ts

import { NextResponse } from "next/server";

/**
 * GET /api/asp
 *
 * Describes EmpresaFi as a reusable AI service.
 * This metadata can support marketplace listings,
 * integrations, and developer documentation.
 */
export async function GET() {
  return NextResponse.json({
    name: "EmpresaFi",

    version: "1.0.0",

    category: "AI Venture Intelligence",

    description:
      "EmpresaFi transforms a raw business idea into a structured, investor-ready venture report.",

    useCases: [
      "Business idea validation",
      "Market opportunity analysis",
      "Competitor analysis",
      "Financial projection",
      "Risk assessment",
      "Launch roadmap generation",
      "Investor readiness evaluation",
    ],

    endpoint: {
      method: "POST",
      path: "/api/analyze-business",
      contentType: "application/json",
    },

    requiredInput: [
      "businessIdea",
      "location",
      "industry",
      "targetCustomers",
      "budget",
      "goal",
      "ventureType",
    ],

    output: [
      "ventureScore",
      "marketOpportunityScore",
      "investorReadinessScore",
      "riskLevel",
      "revenuePotential",
      "startupCostEstimate",
      "executiveSummary",
      "marketAnalysis",
      "competitorAnalysis",
      "businessModel",
      "pricingStrategy",
      "financialProjection",
      "keyRisks",
      "growthStrategy",
      "roadmap",
      "investorBrief",
    ],

    reliability: {
      primaryModel: process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
      fallbackModel:
        process.env.GEMINI_FALLBACK_MODEL ||  "gemini-3.5-flash",
      localFallback: true,
    },

    healthEndpoint: "/api/health",
  });
}