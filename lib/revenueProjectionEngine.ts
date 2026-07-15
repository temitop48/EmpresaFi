// lib/revenueProjectionEngine.ts

export type RevenueProjectionInput = {
  ventureScore: number;
  marketOpportunityScore: number;
  investorReadinessScore: number;
  revenuePotential: string;
  startupCostEstimate: string;
  financialProjection: string;
};

export type RevenueProjectionPoint = {
  month: string;
  monthNumber: number;

  conservative: number;
  base: number;
  optimistic: number;

  cumulativeConservative: number;
  cumulativeBase: number;
  cumulativeOptimistic: number;
};

export type RevenueProjectionResult = {
  currencySymbol: string;
  startupCostReference: number;

  data: RevenueProjectionPoint[];

  yearOneRevenue: {
    conservative: number;
    base: number;
    optimistic: number;
  };

  monthTwelveRevenue: {
    conservative: number;
    base: number;
    optimistic: number;
  };

  monthlyGrowthRate: number;
  yearGrowthRate: number;

  /**
   * This is a revenue-based proxy, not accounting break-even.
   * It indicates when cumulative modeled revenue covers estimated launch cost.
   */
  capitalRecoveryMonth: number | null;

  assumptions: string[];
};

/**
 * Extracts all valid positive numbers from a money-related string.
 *
 * Examples:
 * "$1,000 - $5,000" becomes [1000, 5000]
 * "₦500,000" becomes [500000]
 */
function extractNumbers(value: string): number[] {
  const normalized = value.replace(/,/g, "");
  const matches = normalized.match(/\d+(\.\d+)?/g);

  if (!matches) {
    return [];
  }

  return matches
    .map(Number)
    .filter((number) => Number.isFinite(number) && number > 0);
}

/**
 * Creates one practical launch-cost reference.
 *
 * When a cost range is provided, EmpresaFi uses the midpoint.
 */
function extractStartupCostReference(value: string): number {
  const numbers = extractNumbers(value);

  if (numbers.length === 0) {
    return 1_000;
  }

  if (numbers.length === 1) {
    return numbers[0];
  }

  const minimum = Math.min(...numbers);
  const maximum = Math.max(...numbers);

  return (minimum + maximum) / 2;
}

/**
 * Detects the currency symbol shown in the submitted financial data.
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
 * Keeps generated amounts positive and presentation-friendly.
 */
function normalizeAmount(value: number): number {
  return Math.max(0, Math.round(value));
}

/**
 * Keeps calculated scores inside a safe numeric range.
 */
function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

/**
 * Adds all monthly values for one financial scenario.
 */
function sumScenario(
  data: RevenueProjectionPoint[],
  field: "conservative" | "base" | "optimistic"
): number {
  return normalizeAmount(
    data.reduce((total, point) => total + point[field], 0)
  );
}

/**
 * Finds the first month where cumulative base revenue covers
 * the estimated startup-cost reference.
 *
 * This is labelled as a capital-recovery proxy because true break-even
 * also requires operating expenses, taxes, margins, and cash-flow data.
 */
function findCapitalRecoveryMonth(
  data: RevenueProjectionPoint[],
  startupCostReference: number
): number | null {
  const recoveryPoint = data.find(
    (point) => point.cumulativeBase >= startupCostReference
  );

  return recoveryPoint?.monthNumber ?? null;
}

/**
 * Generates one unified twelve-month financial projection.
 *
 * Every displayed financial metric is derived from the same monthly
 * dataset, preventing the chart and summary cards from contradicting
 * one another.
 */
export function generateRevenueProjection(
  input: RevenueProjectionInput
): RevenueProjectionResult {
  const startupCostReference = extractStartupCostReference(
    input.startupCostEstimate
  );

  const currencySymbol = detectCurrencySymbol(
    input.startupCostEstimate,
    input.financialProjection
  );

  const averageScore =
    (input.ventureScore +
      input.marketOpportunityScore +
      input.investorReadinessScore) /
    3;

  const revenuePotentialMultiplier =
    input.revenuePotential === "High"
      ? 1.2
      : input.revenuePotential === "Medium"
        ? 0.95
        : 0.7;

  const scoreMultiplier = clamp(
    averageScore / 75,
    0.55,
    1.35
  );

  /**
   * The first-month base projection is deliberately conservative.
   * It is anchored to estimated launch cost and overall venture quality.
   */
  const firstMonthBaseRevenue =
    startupCostReference *
    0.08 *
    revenuePotentialMultiplier *
    scoreMultiplier;

  /**
   * Monthly growth is derived from market opportunity.
   * It is capped so the chart does not become fantasy-shaped.
   */
  const monthlyGrowthRate = clamp(
    input.marketOpportunityScore >= 85
      ? 0.18
      : input.marketOpportunityScore >= 70
        ? 0.14
        : input.marketOpportunityScore >= 55
          ? 0.1
          : 0.07,
    0.05,
    0.2
  );

  const data: RevenueProjectionPoint[] = [];

  let conservative = firstMonthBaseRevenue * 0.72;
  let base = firstMonthBaseRevenue;
  let optimistic = firstMonthBaseRevenue * 1.3;

  let cumulativeConservative = 0;
  let cumulativeBase = 0;
  let cumulativeOptimistic = 0;

  for (let monthNumber = 1; monthNumber <= 12; monthNumber++) {
    const normalizedConservative = normalizeAmount(conservative);
    const normalizedBase = normalizeAmount(base);
    const normalizedOptimistic = normalizeAmount(optimistic);

    cumulativeConservative += normalizedConservative;
    cumulativeBase += normalizedBase;
    cumulativeOptimistic += normalizedOptimistic;

    data.push({
      month: `M${monthNumber}`,
      monthNumber,

      conservative: normalizedConservative,
      base: normalizedBase,
      optimistic: normalizedOptimistic,

      cumulativeConservative:
        normalizeAmount(cumulativeConservative),

      cumulativeBase:
        normalizeAmount(cumulativeBase),

      cumulativeOptimistic:
        normalizeAmount(cumulativeOptimistic),
    });

    conservative *= 1 + monthlyGrowthRate * 0.55;
    base *= 1 + monthlyGrowthRate;
    optimistic *= 1 + monthlyGrowthRate * 1.3;
  }

  const firstMonth = data[0];
  const finalMonth = data[data.length - 1];

  const yearGrowthRate =
    firstMonth.base > 0
      ? normalizeAmount(
          ((finalMonth.base - firstMonth.base) /
            firstMonth.base) *
            100
        )
      : 0;

  return {
    currencySymbol,
    startupCostReference,
    data,

    yearOneRevenue: {
      conservative: sumScenario(data, "conservative"),
      base: sumScenario(data, "base"),
      optimistic: sumScenario(data, "optimistic"),
    },

    monthTwelveRevenue: {
      conservative: finalMonth.conservative,
      base: finalMonth.base,
      optimistic: finalMonth.optimistic,
    },

    monthlyGrowthRate: Number(
      (monthlyGrowthRate * 100).toFixed(1)
    ),

    yearGrowthRate,

    capitalRecoveryMonth: findCapitalRecoveryMonth(
      data,
      startupCostReference
    ),

    assumptions: [
      "The chart displays projected monthly revenue, not cumulative annual revenue.",
      "Year-one revenue is calculated by adding the twelve monthly projections shown in the chart.",
      "The model assumes gradual customer acquisition and improving retention.",
      "The capital-recovery month is a revenue proxy, not formal accounting break-even.",
      "Operating expenses, taxes, gross margin, and financing costs require real business data.",
    ],
  };
}