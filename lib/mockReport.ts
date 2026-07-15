// lib/mockReport.ts

import { VentureInput, VentureReport } from "./reportSchema";

/**
 * createMockVentureReport generates a dependable fallback report.
 *
 * This report is returned when Gemini is unavailable, exceeds its
 * rate limit, times out, or returns an invalid response.
 */
export function createMockVentureReport(
  input: VentureInput
): VentureReport {
  const industry = input.industry || "business services";
  const budget = input.budget || "A lean founder-defined budget";

  return {
    id: crypto.randomUUID(),

    ventureName: `${industry} Venture Intelligence`,

    ventureScore: 82,
    marketOpportunityScore: 78,
    investorReadinessScore: 71,

    riskLevel: "Medium",
    revenuePotential: "High",
    startupCostEstimate: budget,

    executiveSummary:
      `${input.businessIdea} addresses a potentially valuable need among ${input.targetCustomers} in ${input.location}. The most suitable starting approach is a focused minimum viable product built around one clear customer problem rather than a broad platform. The founder should validate willingness to pay, identify the most urgent workflow, and test whether customers will repeatedly use the solution. The opportunity appears commercially promising, but investor readiness will depend on proof of demand, measurable traction, a repeatable revenue model, and evidence that the product can serve customers efficiently.`,

    marketAnalysis:
      `The initial market should be defined narrowly around ${input.targetCustomers} in ${input.location}. Rather than assuming the entire ${industry} industry is immediately accessible, the venture should begin with a reachable customer segment that has a frequent and expensive problem. Early research should examine how customers currently solve the problem, what those alternatives cost, and why they would switch. Demand can be tested through interviews, landing-page registrations, pilot offers, and small paid experiments. Expansion should only begin after the venture identifies a customer profile with clear urgency, retention potential, and an affordable acquisition channel.`,

    competitorAnalysis:
      `Likely competition includes direct software products, traditional service providers, spreadsheets, manual workflows, and customers choosing to do nothing. EmpresaFi recommends comparing competitors across pricing, speed, accessibility, trust, customer support, and measurable outcomes. The strongest positioning will not come from having more features. It should come from solving one important problem faster and with less friction. The founder should build a competitor matrix, test alternative positioning statements, and avoid claims that cannot be demonstrated. Customer experience, local relevance, distribution partnerships, and proprietary workflow data may become useful differentiators over time.`,

    businessModel:
      `A service-assisted MVP is the recommended starting model because it allows the founder to learn directly from customers before automating every workflow. Initial revenue could come from a fixed setup fee, monthly subscription, usage-based charge, transaction commission, or a combination of these methods. The correct model should depend on how customers receive value. Recurring value supports subscriptions, while measurable transactions may support commission pricing. Enterprise or premium plans can be introduced after the product proves reliability. The founder should monitor gross margin, support cost, retention, acquisition cost, and customer lifetime value before attempting rapid expansion.`,

    pricingStrategy:
      `Begin with three understandable options: a low-risk starter plan, a core plan connected to the main customer outcome, and a premium plan for customers needing additional support or capacity. Pricing should not be based only on development cost. It should reflect the economic or operational value delivered to the customer. The founder can test pricing through pilot offers and customer interviews rather than relying on assumptions. Discounts should be limited and tied to useful commitments such as annual payment, case-study participation, or early feedback. Pricing should be reviewed after the first ten to twenty active customers.`,

    financialProjection:
      `With a starting budget of ${budget}, the venture should prioritize validation, product development, essential infrastructure, and targeted customer acquisition. Financial forecasts should initially be treated as planning scenarios rather than guaranteed outcomes. A conservative case should assume slow customer acquisition and higher support costs. A base case should assume steady monthly adoption, while an upside case can model stronger referrals or partnerships. The founder should track monthly recurring revenue, operating expenses, gross margin, cash balance, customer acquisition cost, and runway. A detailed forecast can become more accurate after the first three months of real customer behavior.`,

    keyRisks: [
      "Customers may show interest without demonstrating willingness to pay.",
      "The first product version may attempt to serve too many customer needs.",
      "Customer acquisition costs may exceed early revenue.",
      "Competitors may respond with lower pricing or similar features.",
      "Limited founder time and capital may slow execution.",
    ],

    growthStrategy:
      `Growth should begin with founder-led sales and direct customer discovery. The first objective is not maximum reach, but identifying a repeatable message and customer profile. Early traction can come from niche communities, professional associations, partnerships, referrals, educational content, and direct outreach. Once the venture understands which channel produces retained customers, it can invest more heavily in that channel. Product-led referrals, templates, integrations, and community partnerships may later reduce acquisition costs. Geographic or customer-segment expansion should happen only after onboarding, support, pricing, and retention are stable in the initial market.`,

    roadmap: [
      {
        period: "30 Days",
        title: "Customer Validation Sprint",
        actions: [
          "Interview at least 15 potential customers.",
          "Document the three most painful existing workflows.",
          "Create a focused landing page and waitlist.",
          "Test willingness to pay with a pilot offer.",
        ],
      },
      {
        period: "90 Days",
        title: "MVP Launch and Revenue Testing",
        actions: [
          "Launch one core workflow for the strongest customer segment.",
          "Onboard the first pilot customers manually.",
          "Measure activation, usage, retention, and support requests.",
          "Refine positioning and pricing from customer evidence.",
        ],
      },
      {
        period: "365 Days",
        title: "Repeatable Growth and Investor Readiness",
        actions: [
          "Build a repeatable customer acquisition process.",
          "Automate the most expensive operational workflows.",
          "Document revenue, retention, and unit economics.",
          "Prepare an investor memo supported by real traction.",
        ],
      },
    ],

    investorBrief:
      `${input.businessIdea} is an early-stage ${industry} opportunity designed for ${input.targetCustomers} in ${input.location}. The venture proposes a focused solution to a recurring customer problem and can begin with a capital-efficient, service-assisted MVP. Its investment potential will depend on demonstrating willingness to pay, customer retention, strong unit economics, and a scalable acquisition channel. The immediate strategy is to validate one high-value use case, win an initial group of paying users, and use their behavior to shape the product. With measurable traction and disciplined execution, the venture could expand into adjacent customer segments and markets.`,

    createdAt: new Date().toISOString(),
  };
}