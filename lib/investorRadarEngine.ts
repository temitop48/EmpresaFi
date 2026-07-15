// lib/investorRadarEngine.ts

export type InvestorRadarInput = {
  ventureScore: number;
  marketOpportunityScore: number;
  investorReadinessScore: number;
  riskLevel: string;
  revenuePotential: string;
  businessModel: string;
  pricingStrategy: string;
  financialProjection: string;
  keyRisks: string[];
};

export type InvestorRadarPoint = {
  category: string;
  score: number;
  fullMark: 100;
};

export type InvestorRadarResult = {
  data: InvestorRadarPoint[];
  overallScore: number;
  strongestDimension: string;
  weakestDimension: string;
  summary: string;
};

/**
 * Keeps all calculated values inside the 0–100 range.
 */
function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/**
 * Returns a small score adjustment based on whether a report section
 * contains useful commercial signals.
 */
function textSignalScore(
  text: string,
  keywords: string[]
): number {
  const normalizedText = text.toLowerCase();

  const matches = keywords.filter((keyword) =>
    normalizedText.includes(keyword.toLowerCase())
  ).length;

  return Math.min(12, matches * 3);
}

/**
 * Converts the risk level into a positive investor-facing score.
 *
 * Lower venture risk produces a higher radar score.
 */
function calculateRiskPosition(riskLevel: string): number {
  if (riskLevel === "Low") return 88;
  if (riskLevel === "Medium") return 68;

  return 38;
}

/**
 * Calculates a revenue-potential score.
 */
function calculateRevenuePotentialScore(
  revenuePotential: string
): number {
  if (revenuePotential === "High") return 86;
  if (revenuePotential === "Medium") return 66;

  return 42;
}

/**
 * Builds the six investor-readiness dimensions used by the radar chart.
 */
export function generateInvestorRadar(
  input: InvestorRadarInput
): InvestorRadarResult {
  const marketAttractiveness = clampScore(
    input.marketOpportunityScore * 0.8 +
      input.ventureScore * 0.2
  );

  const businessModelSignal = textSignalScore(
    `${input.businessModel} ${input.pricingStrategy}`,
    [
      "subscription",
      "recurring",
      "commission",
      "usage",
      "enterprise",
      "premium",
      "margin",
      "scalable",
    ]
  );

  const businessModelScore = clampScore(
    input.ventureScore * 0.55 +
      input.investorReadinessScore * 0.3 +
      businessModelSignal
  );

  const revenuePotentialScore = clampScore(
    calculateRevenuePotentialScore(
      input.revenuePotential
    ) *
      0.7 +
      input.marketOpportunityScore * 0.3
  );

  const executionReadiness = clampScore(
    input.ventureScore * 0.6 +
      input.investorReadinessScore * 0.4 -
      Math.min(12, input.keyRisks.length * 2)
  );

  const riskPosition = calculateRiskPosition(
    input.riskLevel
  );

  const financialSignal = textSignalScore(
    input.financialProjection,
    [
      "revenue",
      "margin",
      "runway",
      "cash flow",
      "break-even",
      "acquisition cost",
      "retention",
      "unit economics",
    ]
  );

  const fundingReadiness = clampScore(
    input.investorReadinessScore * 0.75 +
      input.ventureScore * 0.15 +
      financialSignal
  );

  const data: InvestorRadarPoint[] = [
    {
      category: "Market",
      score: marketAttractiveness,
      fullMark: 100,
    },
    {
      category: "Business Model",
      score: businessModelScore,
      fullMark: 100,
    },
    {
      category: "Revenue",
      score: revenuePotentialScore,
      fullMark: 100,
    },
    {
      category: "Execution",
      score: executionReadiness,
      fullMark: 100,
    },
    {
      category: "Risk Position",
      score: riskPosition,
      fullMark: 100,
    },
    {
      category: "Funding",
      score: fundingReadiness,
      fullMark: 100,
    },
  ];

  const overallScore = clampScore(
    data.reduce(
      (total, item) => total + item.score,
      0
    ) / data.length
  );

  const strongestDimension = [...data].sort(
    (a, b) => b.score - a.score
  )[0].category;

  const weakestDimension = [...data].sort(
    (a, b) => a.score - b.score
  )[0].category;

  const summary =
    overallScore >= 80
      ? "The venture presents a strong investor profile, with relatively balanced market, business, financial, and execution signals."
      : overallScore >= 65
        ? "The venture appears promising, but investors would likely expect stronger evidence in the weaker dimensions before committing capital."
        : overallScore >= 50
          ? "The venture has potential, but several investor-facing fundamentals still require validation and improvement."
          : "The current investor profile is weak and should be strengthened before serious fundraising begins.";

  return {
    data,
    overallScore,
    strongestDimension,
    weakestDimension,
    summary,
  };
}