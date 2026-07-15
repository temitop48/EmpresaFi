// lib/confidenceEngine.ts

export type ConfidenceLevel = "Low" | "Moderate" | "High" | "Very High";

export type ScoreExplanation = {
  score: number;
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  positiveFactors: string[];
  concerns: string[];
};

export type ConfidenceInput = {
  ventureScore: number;
  marketOpportunityScore: number;
  investorReadinessScore: number;
  riskLevel: string;
  revenuePotential: string;
  startupCostEstimate: string;
  keyRisks: string[];
};

/**
 * Keeps calculated values between 0 and 100.
 */
function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/**
 * Converts a numeric confidence value into a readable label.
 */
export function getConfidenceLevel(
  confidence: number
): ConfidenceLevel {
  if (confidence >= 85) return "Very High";
  if (confidence >= 70) return "High";
  if (confidence >= 50) return "Moderate";

  return "Low";
}

/**
 * Calculates confidence for the overall venture score.
 */
export function calculateVentureConfidence(
  input: ConfidenceInput
): number {
  const scoreAgreement =
    100 -
    Math.abs(
      input.ventureScore -
        (input.marketOpportunityScore +
          input.investorReadinessScore) /
          2
    );

  const riskAdjustment =
    input.riskLevel === "Low"
      ? 6
      : input.riskLevel === "High"
        ? -12
        : 0;

  return clampScore(scoreAgreement + riskAdjustment);
}

/**
 * Calculates confidence for the market-opportunity score.
 */
export function calculateMarketConfidence(
  input: ConfidenceInput
): number {
  const base =
    input.marketOpportunityScore * 0.7 +
    input.ventureScore * 0.3;

  const revenueAdjustment =
    input.revenuePotential === "High"
      ? 7
      : input.revenuePotential === "Low"
        ? -8
        : 0;

  return clampScore(base + revenueAdjustment);
}

/**
 * Calculates confidence for investor-readiness scoring.
 */
export function calculateInvestorConfidence(
  input: ConfidenceInput
): number {
  const base =
    input.investorReadinessScore * 0.75 +
    input.ventureScore * 0.25;

  const riskAdjustment =
    input.riskLevel === "Low"
      ? 6
      : input.riskLevel === "High"
        ? -14
        : -2;

  return clampScore(base + riskAdjustment);
}

/**
 * Creates section-level confidence values for the report.
 */
export function generateSectionConfidence(
  input: ConfidenceInput
) {
  return {
    executiveSummary: clampScore(
      input.ventureScore * 0.6 +
        input.marketOpportunityScore * 0.4
    ),

    marketAnalysis: calculateMarketConfidence(input),

    competitorAnalysis: clampScore(
      input.marketOpportunityScore * 0.75 +
        input.ventureScore * 0.25 -
        4
    ),

    businessModel: clampScore(
      input.ventureScore * 0.55 +
        input.investorReadinessScore * 0.45
    ),

    pricingStrategy: clampScore(
      input.investorReadinessScore * 0.45 +
        input.ventureScore * 0.25 +
    (input.revenuePotential === "High"
      ? 25
      : input.revenuePotential === "Medium"
        ? 18
        : 10)
     ),

    financialProjection: clampScore(
      input.investorReadinessScore * 0.55 +
        input.ventureScore * 0.25 +
        12
    ),

    growthStrategy: clampScore(
      input.marketOpportunityScore * 0.5 +
        input.ventureScore * 0.5
    ),
  };
}

/**
 * Explains the venture-health score.
 */
export function explainVentureScore(
  input: ConfidenceInput
): ScoreExplanation {
  const positiveFactors: string[] = [];
  const concerns: string[] = [];

  if (input.ventureScore >= 75) {
    positiveFactors.push(
      "The venture shows strong overall feasibility and commercial structure."
    );
  } else if (input.ventureScore >= 60) {
    positiveFactors.push(
      "The venture has a credible foundation that can improve through validation."
    );
  }

  if (input.marketOpportunityScore >= 70) {
    positiveFactors.push(
      "Market demand and timing support the overall score."
    );
  }

  if (input.revenuePotential === "High") {
    positiveFactors.push(
      "The report identifies meaningful monetization potential."
    );
  }

  if (input.riskLevel === "High") {
    concerns.push(
      "A high risk profile reduces confidence in immediate execution."
    );
  }

  if (input.investorReadinessScore < 65) {
    concerns.push(
      "The business needs stronger evidence, traction, or funding readiness."
    );
  }

  if (input.keyRisks.length >= 5) {
    concerns.push(
      "The report identifies several execution and market risks."
    );
  }

  return {
    score: input.ventureScore,
    confidence: calculateVentureConfidence(input),
    confidenceLevel: getConfidenceLevel(
      calculateVentureConfidence(input)
    ),
    positiveFactors: positiveFactors.slice(0, 3),
    concerns: concerns.slice(0, 3),
  };
}

/**
 * Explains the market-opportunity score.
 */
export function explainMarketScore(
  input: ConfidenceInput
): ScoreExplanation {
  const positiveFactors: string[] = [];
  const concerns: string[] = [];

  if (input.marketOpportunityScore >= 75) {
    positiveFactors.push(
      "The target market appears attractive and commercially accessible."
    );
  }

  if (input.revenuePotential === "High") {
    positiveFactors.push(
      "Revenue potential supports the market-opportunity assessment."
    );
  }

  if (input.ventureScore >= 70) {
    positiveFactors.push(
      "The venture is structured well enough to pursue the identified market."
    );
  }

  if (input.marketOpportunityScore < 65) {
    concerns.push(
      "Customer urgency and accessible demand still need stronger validation."
    );
  }

  if (input.riskLevel === "High") {
    concerns.push(
      "Market-entry risk may reduce the realistic accessible opportunity."
    );
  }

  return {
    score: input.marketOpportunityScore,
    confidence: calculateMarketConfidence(input),
    confidenceLevel: getConfidenceLevel(
      calculateMarketConfidence(input)
    ),
    positiveFactors: positiveFactors.slice(0, 3),
    concerns: concerns.slice(0, 3),
  };
}

/**
 * Explains the investor-readiness score.
 */
export function explainInvestorScore(
  input: ConfidenceInput
): ScoreExplanation {
  const positiveFactors: string[] = [];
  const concerns: string[] = [];

  if (input.investorReadinessScore >= 70) {
    positiveFactors.push(
      "The venture has a clearer funding, scalability, and execution story."
    );
  }

  if (input.ventureScore >= 75) {
    positiveFactors.push(
      "Overall business quality supports investor interest."
    );
  }

  if (input.revenuePotential === "High") {
    positiveFactors.push(
      "The commercial model provides an attractive investor narrative."
    );
  }

  if (input.investorReadinessScore < 70) {
    concerns.push(
      "Investors would likely request stronger traction and customer evidence."
    );
  }

  if (input.riskLevel !== "Low") {
    concerns.push(
      "Current execution risk may delay fundraising readiness."
    );
  }

  if (input.keyRisks.length >= 4) {
    concerns.push(
      "Multiple identified risks may require mitigation before fundraising."
    );
  }

  return {
    score: input.investorReadinessScore,
    confidence: calculateInvestorConfidence(input),
    confidenceLevel: getConfidenceLevel(
      calculateInvestorConfidence(input)
    ),
    positiveFactors: positiveFactors.slice(0, 3),
    concerns: concerns.slice(0, 3),
  };
}