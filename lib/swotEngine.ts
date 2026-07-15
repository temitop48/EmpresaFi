// lib/swotEngine.ts

export type SwotInput = {
  ventureScore: number;
  marketOpportunityScore: number;
  investorReadinessScore: number;
  riskLevel: string;
  revenuePotential: string;
  startupCostEstimate: string;
  businessModel: string;
  competitorAnalysis: string;
  growthStrategy: string;
  keyRisks: string[];
};

export type SwotResult = {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
};

/**
 * Prevents duplicate SWOT statements.
 */
function uniqueItems(items: string[]): string[] {
  return [...new Set(items)];
}

/**
 * Produces a structured SWOT analysis from the existing EmpresaFi report.
 *
 * No additional AI request is required, which keeps the workflow fast
 * and available even when the model provider is temporarily unavailable.
 */
export function generateSwotAnalysis(input: SwotInput): SwotResult {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const opportunities: string[] = [];
  const threats: string[] = [];

  if (input.ventureScore >= 75) {
    strengths.push(
      "The venture has a strong overall foundation across feasibility, execution, and commercial potential."
    );
  } else if (input.ventureScore >= 60) {
    strengths.push(
      "The concept has a credible foundation that can improve with focused validation."
    );
  }

  if (input.marketOpportunityScore >= 70) {
    strengths.push(
      "The target market shows attractive demand potential and room for differentiation."
    );
  }

  if (input.investorReadinessScore >= 70) {
    strengths.push(
      "The venture has a relatively clear scalability and funding narrative."
    );
  }

  if (input.revenuePotential === "High") {
    strengths.push(
      "The business has strong monetization potential if customer acquisition and retention are validated."
    );
  }

  if (input.investorReadinessScore < 65) {
    weaknesses.push(
      "The venture needs stronger traction, financial evidence, and investor-ready metrics."
    );
  }

  if (input.ventureScore < 65) {
    weaknesses.push(
      "Important assumptions around execution, differentiation, or monetization remain unproven."
    );
  }

  if (input.riskLevel === "Medium") {
    weaknesses.push(
      "Execution discipline will be essential because the venture carries moderate operational and market uncertainty."
    );
  }

  if (input.riskLevel === "High") {
    weaknesses.push(
      "The current risk profile may make the venture difficult to fund or scale without major changes."
    );
  }

  if (
    input.startupCostEstimate.toLowerCase().includes("high") ||
    input.startupCostEstimate.includes("$10,000") ||
    input.startupCostEstimate.includes("$20,000")
  ) {
    weaknesses.push(
      "The estimated startup cost may create early runway pressure."
    );
  }

  if (input.marketOpportunityScore >= 65) {
    opportunities.push(
      "A focused entry into the strongest customer segment could produce early traction."
    );
  }

  if (input.revenuePotential === "High") {
    opportunities.push(
      "Recurring, premium, or usage-based revenue models could improve long-term margins."
    );
  }

  opportunities.push(
    "Partnerships, referrals, and niche communities may lower customer acquisition costs."
  );

  opportunities.push(
    "Early customer data and workflow insights could create future defensibility."
  );

  if (input.growthStrategy.toLowerCase().includes("expand")) {
    opportunities.push(
      "The venture may expand into adjacent customer segments or geographic markets after proving retention."
    );
  }

  if (input.competitorAnalysis.toLowerCase().includes("compet")) {
    threats.push(
      "Established competitors may respond with stronger distribution, lower pricing, or similar features."
    );
  }

  if (input.riskLevel === "High" || input.riskLevel === "Medium") {
    threats.push(
      "Weak validation or poor execution could increase customer acquisition costs and delay revenue."
    );
  }

  input.keyRisks.slice(0, 4).forEach((risk) => {
    threats.push(risk);
  });

  return {
    strengths: uniqueItems(strengths).slice(0, 4),
    weaknesses: uniqueItems(weaknesses).slice(0, 4),
    opportunities: uniqueItems(opportunities).slice(0, 4),
    threats: uniqueItems(threats).slice(0, 4),
  };
}