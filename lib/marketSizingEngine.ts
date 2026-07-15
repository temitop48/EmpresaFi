// lib/marketSizingEngine.ts

export type MarketSizingInput = {
  marketOpportunityScore: number;
  ventureScore: number;
  investorReadinessScore: number;
  startupCostEstimate: string;
  financialProjection: string;
  location: string;
  industry: string;
  targetCustomers: string;
};

export type MarketSizeLevel = {
  label: "TAM" | "SAM" | "SOM";
  fullName: string;
  value: number;
  percentageOfTam: number;
  description: string;
};

export type MarketSizingResult = {
  currencySymbol: string;
  tam: MarketSizeLevel;
  sam: MarketSizeLevel;
  som: MarketSizeLevel;
  marketCaptureRate: number;
  opportunityLevel: "Emerging" | "Promising" | "Strong";
  assumptions: string[];
};

/**
 * Extracts all usable numbers from text.
 *
 * Example:
 * "$3,000 launch cost and $12,000 annual revenue"
 * becomes [3000, 12000].
 */
function extractNumbers(value: string): number[] {
  const normalizedValue = value.replace(/,/g, "");

  const matches = normalizedValue.match(/\d+(\.\d+)?/g);

  if (!matches) {
    return [];
  }

  return matches
    .map((match) => Number(match))
    .filter((number) => Number.isFinite(number) && number > 0);
}

/**
 * Detects the most likely currency symbol used in the report.
 */
function detectCurrencySymbol(
  startupCostEstimate: string,
  financialProjection: string
): string {
  const combinedText =
    `${startupCostEstimate} ${financialProjection}`;

  if (combinedText.includes("₦")) return "₦";
  if (combinedText.includes("€")) return "€";
  if (combinedText.includes("£")) return "£";

  return "$";
}

/**
 * Keeps percentage calculations inside a valid range.
 */
function clampPercentage(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/**
 * Rounds market values to cleaner presentation figures.
 */
function roundMarketValue(value: number): number {
  if (value >= 1_000_000) {
    return Math.round(value / 100_000) * 100_000;
  }

  if (value >= 100_000) {
    return Math.round(value / 10_000) * 10_000;
  }

  if (value >= 10_000) {
    return Math.round(value / 1_000) * 1_000;
  }

  return Math.round(value / 100) * 100;
}

/**
 * Estimates a reasonable annual-revenue reference from existing
 * report text.
 *
 * This is only used as a planning anchor. It is not treated as
 * verified market research.
 */
function estimateAnnualRevenueReference(
  startupCostEstimate: string,
  financialProjection: string
): number {
  const projectionNumbers = extractNumbers(financialProjection);

  if (projectionNumbers.length > 0) {
    return Math.max(...projectionNumbers);
  }

  const startupNumbers = extractNumbers(startupCostEstimate);
  const startupCost =
    startupNumbers.length > 0
      ? Math.max(...startupNumbers)
      : 1_000;

  return startupCost * 4;
}

/**
 * Creates an illustrative TAM / SAM / SOM model from the existing
 * EmpresaFi report.
 *
 * The estimates are intentionally conservative and should be replaced
 * by live market research in a future product version.
 */
export function generateMarketSizing(
  input: MarketSizingInput
): MarketSizingResult {
  const annualRevenueReference =
    estimateAnnualRevenueReference(
      input.startupCostEstimate,
      input.financialProjection
    );

  const opportunityMultiplier =
    input.marketOpportunityScore >= 80
      ? 50
      : input.marketOpportunityScore >= 65
        ? 35
        : 22;

  const tamValue = roundMarketValue(
    annualRevenueReference * opportunityMultiplier
  );

  const samPercentage =
    input.marketOpportunityScore >= 80
      ? 45
      : input.marketOpportunityScore >= 65
        ? 35
        : 25;

  const samValue = roundMarketValue(
    tamValue * (samPercentage / 100)
  );

  const combinedReadiness =
    (input.ventureScore +
      input.investorReadinessScore) /
    2;

  const somPercentageOfSam =
    combinedReadiness >= 80
      ? 10
      : combinedReadiness >= 65
        ? 7
        : 4;

  const somValue = roundMarketValue(
    samValue * (somPercentageOfSam / 100)
  );

  const marketCaptureRate = clampPercentage(
    (somValue / tamValue) * 100
  );

  const opportunityLevel =
    input.marketOpportunityScore >= 80
      ? "Strong"
      : input.marketOpportunityScore >= 60
        ? "Promising"
        : "Emerging";

  return {
    currencySymbol: detectCurrencySymbol(
      input.startupCostEstimate,
      input.financialProjection
    ),

    tam: {
      label: "TAM",
      fullName: "Total Addressable Market",
      value: tamValue,
      percentageOfTam: 100,
      description: `The broadest modeled opportunity across the ${input.industry} market.`,
    },

    sam: {
      label: "SAM",
      fullName: "Serviceable Available Market",
      value: samValue,
      percentageOfTam: samPercentage,
      description: `The portion EmpresaFi estimates is realistically serviceable in ${input.location}.`,
    },

    som: {
      label: "SOM",
      fullName: "Serviceable Obtainable Market",
      value: somValue,
      percentageOfTam: marketCaptureRate,
      description: `The near-term opportunity that may be reachable among ${input.targetCustomers}.`,
    },

    marketCaptureRate,
    opportunityLevel,

    assumptions: [
      "The figures are strategic planning estimates rather than verified market statistics.",
      "TAM represents the broadest commercial opportunity implied by the venture model.",
      "SAM narrows the market using location, accessibility, and market-opportunity signals.",
      "SOM reflects a conservative early-stage capture scenario based on execution readiness.",
    ],
  };
}