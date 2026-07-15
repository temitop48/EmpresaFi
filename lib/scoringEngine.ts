// lib/scoringEngine.ts

import type { VentureInput } from "./reportSchema";

export type DeterministicRiskLevel = "Low" | "Medium" | "High";

export type DeterministicRevenuePotential =
  | "Low"
  | "Medium"
  | "High";

export type VentureScoringResult = {
  ventureScore: number;
  marketOpportunityScore: number;
  investorReadinessScore: number;

  riskLevel: DeterministicRiskLevel;
  revenuePotential: DeterministicRevenuePotential;

  scoringVersion: "1.0";

  scoreFactors: {
    positives: string[];
    concerns: string[];
  };
};

/**
 * Keeps a score inside the supported 0–100 range.
 */
function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Normalizes user input before scoring.
 *
 * This ensures differences in spacing or capitalization do not change
 * the score for otherwise identical submissions.
 */
function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Checks whether a text field includes at least one useful signal.
 */
function includesAny(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

/**
 * Extracts the first positive number from the budget field.
 */
function extractBudgetAmount(value: string): number | null {
  const normalized = value.replace(/,/g, "");
  const match = normalized.match(/\d+(\.\d+)?/);

  if (!match) {
    return null;
  }

  const amount = Number(match[0]);

  return Number.isFinite(amount) && amount > 0
    ? amount
    : null;
}

/**
 * Scores how clearly the founder has described the opportunity.
 */
function calculateClarityScore(input: VentureInput): number {
  const idea = normalizeText(input.businessIdea);
  const customers = normalizeText(input.targetCustomers);

  let score = 45;

  if (idea.length >= 60) score += 8;
  if (idea.length >= 120) score += 5;

  if (customers.length >= 15) score += 7;
  if (customers.length >= 40) score += 5;

  if (normalizeText(input.location).length >= 2) score += 5;
  if (normalizeText(input.industry).length >= 3) score += 5;

  const problemSignals = [
    "help",
    "reduce",
    "solve",
    "manage",
    "automate",
    "improve",
    "save",
    "prevent",
    "connect",
  ];

  if (includesAny(idea, problemSignals)) {
    score += 8;
  }

  return clampScore(score);
}

/**
 * Measures how commercially accessible the described market appears.
 *
 * This is a deterministic planning score, not a live market-size claim.
 */
function calculateMarketOpportunityScore(
  input: VentureInput
): number {
  const idea = normalizeText(input.businessIdea);
  const customers = normalizeText(input.targetCustomers);
  const industry = normalizeText(input.industry);

  let score = 48;

  if (customers.length >= 15) score += 8;
  if (customers.length >= 35) score += 5;

  const recurringProblemSignals = [
    "daily",
    "weekly",
    "monthly",
    "orders",
    "payments",
    "inventory",
    "operations",
    "workflow",
    "customers",
    "sales",
    "finance",
    "compliance",
  ];

  if (
    includesAny(
      `${idea} ${customers}`,
      recurringProblemSignals
    )
  ) {
    score += 10;
  }

  const digitalDistributionSignals = [
    "online",
    "mobile",
    "whatsapp",
    "platform",
    "software",
    "saas",
    "api",
    "marketplace",
    "ai",
  ];

  if (
    includesAny(
      `${idea} ${industry}`,
      digitalDistributionSignals
    )
  ) {
    score += 8;
  }

  const broadCustomerSignals = [
    "business",
    "businesses",
    "sme",
    "smes",
    "freelancer",
    "freelancers",
    "vendors",
    "creators",
    "students",
    "professionals",
  ];

  if (includesAny(customers, broadCustomerSignals)) {
    score += 6;
  }

  if (input.goal === "expand") {
    score += 4;
  }

  return clampScore(score);
}

/**
 * Scores whether the venture currently has a credible investor story.
 */
function calculateInvestorReadinessScore(
  input: VentureInput
): number {
  const idea = normalizeText(input.businessIdea);
  const budgetAmount = extractBudgetAmount(input.budget);

  let score = 42;

  const monetizationSignals = [
    "subscription",
    "commission",
    "fee",
    "premium",
    "revenue",
    "payment",
    "marketplace",
    "transaction",
    "licence",
    "license",
    "saas",
  ];

  if (includesAny(idea, monetizationSignals)) {
    score += 12;
  }

  const scalabilitySignals = [
    "platform",
    "software",
    "api",
    "automation",
    "ai",
    "marketplace",
    "digital",
    "online",
  ];

  if (includesAny(idea, scalabilitySignals)) {
    score += 10;
  }

  if (budgetAmount !== null) {
    score += 7;
  }

  if (input.goal === "raise_funds") {
    score += 5;
  }

  if (input.goal === "launch") {
    score += 4;
  }

  if (normalizeText(input.targetCustomers).length >= 25) {
    score += 6;
  }

  if (input.ventureType === "hybrid") {
    score -= 3;
  }

  return clampScore(score);
}

/**
 * Calculates the deterministic revenue-potential classification.
 */
function calculateRevenuePotential(
  input: VentureInput,
  marketOpportunityScore: number,
  investorReadinessScore: number
): DeterministicRevenuePotential {
  const idea = normalizeText(input.businessIdea);

  const recurringRevenueSignals = [
    "subscription",
    "saas",
    "commission",
    "transaction",
    "marketplace",
    "premium",
    "membership",
    "fee",
    "payment",
  ];

  const hasRevenueSignal = includesAny(
    idea,
    recurringRevenueSignals
  );

  const commercialScore =
    marketOpportunityScore * 0.55 +
    investorReadinessScore * 0.45 +
    (hasRevenueSignal ? 8 : 0);

  if (commercialScore >= 76) {
    return "High";
  }

  if (commercialScore >= 57) {
    return "Medium";
  }

  return "Low";
}

/**
 * Calculates the overall risk classification.
 */
function calculateRiskLevel({
  ventureScore,
  marketOpportunityScore,
  investorReadinessScore,
  input,
}: {
  ventureScore: number;
  marketOpportunityScore: number;
  investorReadinessScore: number;
  input: VentureInput;
}): DeterministicRiskLevel {
  const budgetAmount = extractBudgetAmount(input.budget);

  let riskPoints = 0;

  if (marketOpportunityScore < 55) riskPoints += 2;
  if (investorReadinessScore < 55) riskPoints += 2;
  if (ventureScore < 60) riskPoints += 2;

  if (budgetAmount === null) {
    riskPoints += 1;
  }

  if (input.ventureType === "hybrid") {
    riskPoints += 1;
  }

  if (input.goal === "expand" && ventureScore < 70) {
    riskPoints += 1;
  }

  if (riskPoints >= 5) {
    return "High";
  }

  if (riskPoints >= 2) {
    return "Medium";
  }

  return "Low";
}

/**
 * Produces transparent positive and concern factors for the score.
 */
function buildScoreFactors({
  input,
  ventureScore,
  marketOpportunityScore,
  investorReadinessScore,
  riskLevel,
  revenuePotential,
}: {
  input: VentureInput;
  ventureScore: number;
  marketOpportunityScore: number;
  investorReadinessScore: number;
  riskLevel: DeterministicRiskLevel;
  revenuePotential: DeterministicRevenuePotential;
}) {
  const positives: string[] = [];
  const concerns: string[] = [];

  if (marketOpportunityScore >= 70) {
    positives.push(
      "The target customer and recurring problem are described clearly."
    );
  }

  if (ventureScore >= 70) {
    positives.push(
      "The submitted concept has a credible foundation for lean execution."
    );
  }

  if (investorReadinessScore >= 65) {
    positives.push(
      "The concept contains useful scalability or monetization signals."
    );
  }

  if (revenuePotential === "High") {
    positives.push(
      "The business idea supports a potentially repeatable revenue model."
    );
  }

  if (!input.budget.trim()) {
    concerns.push(
      "No starting budget was supplied, reducing financial-planning confidence."
    );
  }

  if (investorReadinessScore < 65) {
    concerns.push(
      "The venture needs stronger traction, validation, or unit-economics evidence."
    );
  }

  if (marketOpportunityScore < 65) {
    concerns.push(
      "Customer urgency and accessible demand require further validation."
    );
  }

  if (riskLevel === "High") {
    concerns.push(
      "Multiple execution and commercial assumptions remain unresolved."
    );
  }

  return {
    positives: positives.slice(0, 4),
    concerns: concerns.slice(0, 4),
  };
}

/**
 * Main EmpresaFi deterministic scoring entry point.
 *
 * The same normalized founder input always produces the same scores.
 * Gemini may explain the result, but it does not control the result.
 */
export function scoreVenture(
  input: VentureInput
): VentureScoringResult {
  const clarityScore = calculateClarityScore(input);

  const marketOpportunityScore =
    calculateMarketOpportunityScore(input);

  const investorReadinessScore =
    calculateInvestorReadinessScore(input);

  const initialVentureScore = clampScore(
    clarityScore * 0.3 +
      marketOpportunityScore * 0.4 +
      investorReadinessScore * 0.3
  );

  const revenuePotential = calculateRevenuePotential(
    input,
    marketOpportunityScore,
    investorReadinessScore
  );

  const riskLevel = calculateRiskLevel({
    ventureScore: initialVentureScore,
    marketOpportunityScore,
    investorReadinessScore,
    input,
  });

  const riskAdjustment =
    riskLevel === "Low"
      ? 3
      : riskLevel === "High"
        ? -7
        : 0;

  const ventureScore = clampScore(
    initialVentureScore + riskAdjustment
  );

  return {
    ventureScore,
    marketOpportunityScore,
    investorReadinessScore,
    riskLevel,
    revenuePotential,
    scoringVersion: "1.0",

    scoreFactors: buildScoreFactors({
      input,
      ventureScore,
      marketOpportunityScore,
      investorReadinessScore,
      riskLevel,
      revenuePotential,
    }),
  };
}