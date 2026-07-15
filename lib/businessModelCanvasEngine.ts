// lib/businessModelCanvasEngine.ts

export type BusinessModelCanvasInput = {
  businessIdea: string;
  location: string;
  industry: string;
  targetCustomers: string;
  startupCostEstimate: string;
  businessModel: string;
  pricingStrategy: string;
  growthStrategy: string;
  competitorAnalysis: string;
  financialProjection: string;
};

export type BusinessModelCanvasResult = {
  customerSegments: string[];
  valuePropositions: string[];
  channels: string[];
  customerRelationships: string[];
  revenueStreams: string[];
  keyActivities: string[];
  keyResources: string[];
  keyPartners: string[];
  costStructure: string[];
};

/**
 * Removes duplicate canvas entries and keeps each section concise.
 */
function uniqueItems(items: string[]): string[] {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

/**
 * Checks whether a report section includes a keyword.
 */
function includesText(text: string, keyword: string): boolean {
  return text.toLowerCase().includes(keyword.toLowerCase());
}

/**
 * Builds a Business Model Canvas from EmpresaFi's existing report.
 *
 * This avoids another AI request while still creating a useful
 * strategic summary for founders and judges.
 */
export function generateBusinessModelCanvas(
  input: BusinessModelCanvasInput
): BusinessModelCanvasResult {
  const customerSegments = [
    input.targetCustomers,
    `Early adopters in the ${input.industry} market`,
    `Customers in ${input.location} with the strongest problem urgency`,
  ];

  const valuePropositions = [
    `A focused solution based on: ${input.businessIdea}`,
    "Reduced time, friction, or cost compared with current alternatives",
    "Clearer outcomes and a more accessible customer experience",
  ];

  const channels = [
    "Founder-led outreach and direct sales",
    "Niche communities and professional networks",
    "Referral and partnership channels",
    "Educational content and targeted digital distribution",
  ];

  if (includesText(input.growthStrategy, "social")) {
    channels.push("Social media and community-led acquisition");
  }

  if (includesText(input.growthStrategy, "partner")) {
    channels.push("Strategic partner distribution");
  }

  const customerRelationships = [
    "High-touch onboarding for early customers",
    "Ongoing customer feedback and support",
    "Self-service workflows as the product matures",
    "Retention through measurable customer outcomes",
  ];

  const revenueStreams = [
    "Starter plan or entry-level service package",
    "Recurring subscription or membership revenue",
    "Premium support or advanced service tier",
  ];

  if (
    includesText(input.businessModel, "commission") ||
    includesText(input.pricingStrategy, "commission")
  ) {
    revenueStreams.push("Transaction or commission-based revenue");
  }

  if (
    includesText(input.businessModel, "usage") ||
    includesText(input.pricingStrategy, "usage")
  ) {
    revenueStreams.push("Usage-based pricing");
  }

  if (
    includesText(input.businessModel, "enterprise") ||
    includesText(input.pricingStrategy, "enterprise")
  ) {
    revenueStreams.push("Enterprise or custom contracts");
  }

  const keyActivities = [
    "Customer discovery and validation",
    "Product or service development",
    "Customer onboarding and support",
    "Marketing, sales, and partnership development",
    "Performance measurement and product iteration",
  ];

  const keyResources = [
    "Founder expertise and execution capacity",
    "Product technology or service infrastructure",
    "Customer insight and usage data",
    "Brand trust and distribution relationships",
    "Operating capital and runway",
  ];

  const keyPartners = [
    "Industry associations and niche communities",
    "Technology and infrastructure providers",
    "Distribution and referral partners",
    "Professional advisers or domain specialists",
  ];

  if (includesText(input.competitorAnalysis, "local")) {
    keyPartners.push("Local market and community partners");
  }

  const costStructure = [
    `Initial setup and launch cost: ${input.startupCostEstimate}`,
    "Product development and technical infrastructure",
    "Customer acquisition and sales",
    "Operations, support, and administration",
    "Compliance, professional services, and contingency costs",
  ];

  if (includesText(input.financialProjection, "marketing")) {
    costStructure.push("Paid and organic marketing activities");
  }

  return {
    customerSegments: uniqueItems(customerSegments).slice(0, 4),
    valuePropositions: uniqueItems(valuePropositions).slice(0, 4),
    channels: uniqueItems(channels).slice(0, 5),
    customerRelationships: uniqueItems(customerRelationships).slice(0, 4),
    revenueStreams: uniqueItems(revenueStreams).slice(0, 5),
    keyActivities: uniqueItems(keyActivities).slice(0, 5),
    keyResources: uniqueItems(keyResources).slice(0, 5),
    keyPartners: uniqueItems(keyPartners).slice(0, 5),
    costStructure: uniqueItems(costStructure).slice(0, 5),
  };
}