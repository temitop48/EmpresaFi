// lib/advisoryEngine.ts

export type AdvisorVerdict =
  | "Build Now"
  | "Validate First"
  | "Pivot"
  | "Do Not Build Yet";

export type InvestorOpinion =
  | "Investment Ready"
  | "Promising, But Early"
  | "Needs Stronger Evidence"
  | "Not Investment Ready";

export type RiskLevel = "Low" | "Medium" | "High";

export type AdvisoryInput = {
  ventureScore: number;
  marketOpportunityScore: number;
  investorReadinessScore: number;
  riskLevel: string;

  goal?: string;
  targetCustomers?: string;
  industry?: string;
  location?: string;
  ventureType?: string;
};

export type AdvisorReason = {
  label: string;
  detail: string;
  type: "positive" | "warning";
};

export type ExperimentMetric = {
  label: string;
  target: string;
};

export type DecisionPathStep = {
  label: string;
  description: string;
  type: "start" | "decision" | "success" | "pivot";
};

export type AdvisoryResult = {
  verdict: AdvisorVerdict;
  confidence: number;

  summary: string;
  reasons: AdvisorReason[];

  biggestBlocker: {
    title: string;
    description: string;
  };

  nextExperiment: {
    title: string;
    description: string;
    duration: string;
    actions: string[];
    successMetrics: ExperimentMetric[];
  };

  investorOpinion: InvestorOpinion;
  investorConfidence: number;

  fundingStrategy: string[];
  launchStrategy: string[];

  decisionPath: DecisionPathStep[];

  founderGuidance: string;
};

/**
 * Keeps calculated values inside the supported 0–100 range.
 */
function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/**
 * Converts user-facing values to a consistent lowercase format.
 */
function normalizeText(value?: string): string {
  return value?.trim().toLowerCase() ?? "";
}

/**
 * Determines the final founder recommendation.
 *
 * This is deterministic, so the same scoring inputs always return
 * the same verdict.
 */
function calculateVerdict(
  input: AdvisoryInput
): AdvisorVerdict {
  const {
    ventureScore,
    marketOpportunityScore,
    investorReadinessScore,
    riskLevel,
  } = input;

  if (
    riskLevel === "High" &&
    (ventureScore < 55 ||
      marketOpportunityScore < 50)
  ) {
    return "Do Not Build Yet";
  }

  if (
    marketOpportunityScore < 55 &&
    ventureScore >= 50
  ) {
    return "Pivot";
  }

  if (
    ventureScore >= 80 &&
    marketOpportunityScore >= 75 &&
    investorReadinessScore >= 70 &&
    riskLevel === "Low"
  ) {
    return "Build Now";
  }

  return "Validate First";
}

/**
 * Calculates how strongly the available scoring evidence supports
 * the recommendation.
 */
function calculateConfidence(
  input: AdvisoryInput
): number {
  const weightedScore =
    input.ventureScore * 0.45 +
    input.marketOpportunityScore * 0.35 +
    input.investorReadinessScore * 0.2;

  const riskAdjustment =
    input.riskLevel === "Low"
      ? 5
      : input.riskLevel === "High"
        ? -12
        : -2;

  return Math.max(
    45,
    Math.min(98, clampScore(weightedScore + riskAdjustment))
  );
}

/**
 * Produces the investor-facing interpretation.
 */
function calculateInvestorOpinion(
  input: AdvisoryInput
): InvestorOpinion {
  if (
    input.investorReadinessScore >= 80 &&
    input.ventureScore >= 75 &&
    input.riskLevel === "Low"
  ) {
    return "Investment Ready";
  }

  if (
    input.investorReadinessScore >= 65 &&
    input.ventureScore >= 65 &&
    input.riskLevel !== "High"
  ) {
    return "Promising, But Early";
  }

  if (input.investorReadinessScore >= 48) {
    return "Needs Stronger Evidence";
  }

  return "Not Investment Ready";
}

/**
 * Finds the single most important obstacle that the founder
 * should address before committing more capital.
 */
function determineBiggestBlocker(
  input: AdvisoryInput
): AdvisoryResult["biggestBlocker"] {
  if (input.marketOpportunityScore < 55) {
    return {
      title: "Unproven Market Demand",
      description:
        "The current opportunity does not yet show enough evidence that the target customers experience an urgent problem or will pay for the proposed solution.",
    };
  }

  if (input.investorReadinessScore < 60) {
    return {
      title: "Insufficient Commercial Evidence",
      description:
        "The venture needs stronger proof of customer interest, willingness to pay, retention potential, and credible unit economics.",
    };
  }

  if (input.riskLevel === "High") {
    return {
      title: "Execution Risk Is Too High",
      description:
        "The venture currently carries several unresolved operational, financial, or market assumptions that could weaken an early launch.",
    };
  }

  if (input.ventureScore < 70) {
    return {
      title: "Weak Differentiation",
      description:
        "The value proposition and execution model need sharper positioning against existing competitors and familiar alternatives.",
    };
  }

  return {
    title: "Customer Validation",
    description:
      "The concept is promising, but real customer behavior must confirm the pricing, urgency, onboarding, and retention assumptions.",
  };
}

/**
 * Creates venture-specific evidence explaining the decision.
 */
function buildReasons(
  input: AdvisoryInput
): AdvisorReason[] {
  const reasons: AdvisorReason[] = [];

  if (input.marketOpportunityScore >= 75) {
    reasons.push({
      label: "Attractive Market Signal",
      detail:
        "The opportunity score suggests a meaningful customer problem and commercially accessible target segment.",
      type: "positive",
    });
  } else {
    reasons.push({
      label: "Demand Requires Validation",
      detail:
        "The target market still needs stronger proof of customer urgency and willingness to pay.",
      type: "warning",
    });
  }

  if (input.ventureScore >= 75) {
    reasons.push({
      label: "Credible Venture Structure",
      detail:
        "The concept has a relatively clear value proposition, execution path, and commercial foundation.",
      type: "positive",
    });
  } else {
    reasons.push({
      label: "Business Model Needs Refinement",
      detail:
        "Important assumptions around differentiation, delivery, or monetization remain unresolved.",
      type: "warning",
    });
  }

  if (input.investorReadinessScore >= 70) {
    reasons.push({
      label: "Investor Narrative Is Emerging",
      detail:
        "The venture presents useful scalability, monetization, and funding signals.",
      type: "positive",
    });
  } else {
    reasons.push({
      label: "Funding Case Is Incomplete",
      detail:
        "Investors would likely request traction, retention, revenue proof, and clearer unit economics.",
      type: "warning",
    });
  }

  if (input.riskLevel === "Low") {
    reasons.push({
      label: "Manageable Risk Profile",
      detail:
        "The current risk level supports disciplined early execution.",
      type: "positive",
    });
  } else {
    reasons.push({
      label: `${input.riskLevel} Risk Profile`,
      detail:
        "The venture should test its riskiest assumptions before increasing investment or expanding scope.",
      type: "warning",
    });
  }

  return reasons;
}

/**
 * Creates the most useful immediate validation experiment.
 */
function buildNextExperiment(
  input: AdvisoryInput,
  verdict: AdvisorVerdict
): AdvisoryResult["nextExperiment"] {
  const customers =
    input.targetCustomers?.trim() || "target customers";

  const industry = normalizeText(input.industry);
  const ventureType = normalizeText(input.ventureType);

  if (verdict === "Do Not Build Yet") {
    return {
      title: "Problem Revalidation Sprint",
      description:
        "Pause product development and determine whether the customer problem is urgent, frequent, and valuable enough to support a business.",
      duration: "7–10 days",
      actions: [
        `Interview 20 ${customers}.`,
        "Ask how they currently solve the problem and what it costs them.",
        "Identify the three strongest reasons customers may refuse the product.",
        "Rewrite the value proposition using only validated customer language.",
      ],
      successMetrics: [
        {
          label: "Problem urgency",
          target: "At least 60% describe it as frequent or costly",
        },
        {
          label: "Willingness to act",
          target: "At least 30% request a pilot or follow-up",
        },
      ],
    };
  }

  if (verdict === "Pivot") {
    return {
      title: "Customer-Segment Pivot Test",
      description:
        "Test whether a narrower customer group experiences the problem more intensely and is easier to reach.",
      duration: "7 days",
      actions: [
        "Select two alternative customer segments.",
        `Run 10 interviews in each segment within the ${industry || "target"} market.`,
        "Compare urgency, budget, current alternatives, and switching resistance.",
        "Choose the segment with the strongest combination of pain and willingness to pay.",
      ],
      successMetrics: [
        {
          label: "Preferred segment",
          target: "One segment clearly outperforms the other",
        },
        {
          label: "Payment signal",
          target: "At least 5 prospects accept a paid pilot discussion",
        },
      ],
    };
  }

  if (
    ventureType === "crypto" ||
    ventureType === "hybrid"
  ) {
    return {
      title: "Closed Beta Validation",
      description:
        "Test real usage behavior before adding more protocol, token, or blockchain complexity.",
      duration: "14 days",
      actions: [
        "Recruit 20 qualified beta users.",
        "Launch one narrow end-to-end workflow.",
        "Track activation, wallet connection, repeat usage, and drop-off.",
        "Interview users who fail to complete the core action.",
      ],
      successMetrics: [
        {
          label: "Activation",
          target: "At least 50% complete the core workflow",
        },
        {
          label: "Retention",
          target: "At least 30% return during the second week",
        },
      ],
    };
  }

  if (verdict === "Build Now") {
    return {
      title: "Paid MVP Pilot",
      description:
        "Launch one focused workflow with a small paying customer group and measure whether the value repeats.",
      duration: "14–21 days",
      actions: [
        `Recruit 10–20 ${customers}.`,
        "Deliver one high-value workflow manually or through a lean MVP.",
        "Charge a real pilot price rather than offering unlimited free access.",
        "Measure activation, repeat usage, support effort, and retention.",
      ],
      successMetrics: [
        {
          label: "Willingness to pay",
          target: "At least 30% accept the pilot price",
        },
        {
          label: "Usage",
          target: "At least 50% use the core workflow repeatedly",
        },
      ],
    };
  }

  return {
    title: "Seven-Day Validation Sprint",
    description:
      "Validate customer urgency, positioning, pricing, and acquisition before committing to a larger build.",
    duration: "7 days",
    actions: [
      `Interview 15–20 ${customers}.`,
      "Create a one-page offer describing one clear customer outcome.",
      "Present two pricing options during interviews.",
      "Invite qualified prospects into a manual or concierge pilot.",
    ],
    successMetrics: [
      {
        label: "Customer urgency",
        target: "At least 50% confirm the problem is important",
      },
      {
        label: "Pilot interest",
        target: "At least 5 qualified prospects join the pilot",
      },
    ],
  };
}

/**
 * Generates a financing path appropriate for the venture's
 * current readiness and founder goal.
 */
function buildFundingStrategy(
  input: AdvisoryInput,
  verdict: AdvisorVerdict
): string[] {
  if (
    verdict === "Do Not Build Yet" ||
    verdict === "Pivot"
  ) {
    return [
      "Founder-funded validation",
      "Customer discovery",
      "Paid pilot evidence",
      "Reassess fundraising",
    ];
  }

  if (
    input.investorReadinessScore >= 80 &&
    input.goal === "raise_funds"
  ) {
    return [
      "Founder capital",
      "Angel or accelerator",
      "Pre-seed round",
      "Seed after traction",
    ];
  }

  if (input.investorReadinessScore >= 65) {
    return [
      "Bootstrap MVP",
      "Generate pilot revenue",
      "Angel or accelerator",
      "Pre-seed after retention",
    ];
  }

  return [
    "Bootstrap validation",
    "Customer-funded pilot",
    "Document unit economics",
    "Raise only after evidence",
  ];
}

/**
 * Creates a rollout sequence appropriate for the location and
 * current venture maturity.
 */
function buildLaunchStrategy(
  input: AdvisoryInput,
  verdict: AdvisorVerdict
): string[] {
  const location =
    input.location?.trim() || "initial target market";

  if (verdict === "Do Not Build Yet") {
    return [
      "Problem interviews",
      "Narrow customer segment",
      "Manual pilot",
      "Launch only after validation",
    ];
  }

  if (verdict === "Pivot") {
    return [
      "Test two niches",
      "Select stronger segment",
      "Run focused pilot",
      "Expand after retention",
    ];
  }

  return [
    "Founder-led pilot",
    `Focused launch in ${location}`,
    "Expand to adjacent segments",
    "Regional or international scale",
  ];
}

/**
 * Creates an easy-to-understand decision path for the founder.
 */
function buildDecisionPath(
  verdict: AdvisorVerdict
): DecisionPathStep[] {
  if (verdict === "Do Not Build Yet") {
    return [
      {
        label: "Revalidate the problem",
        description:
          "Confirm that the problem is urgent and commercially meaningful.",
        type: "start",
      },
      {
        label: "Strong demand found?",
        description:
          "Evaluate interviews, pilot interest, and willingness to pay.",
        type: "decision",
      },
      {
        label: "Redesign or stop",
        description:
          "Avoid investing further if the evidence remains weak.",
        type: "pivot",
      },
      {
        label: "Build a narrow pilot",
        description:
          "Proceed only when customer evidence becomes convincing.",
        type: "success",
      },
    ];
  }

  if (verdict === "Pivot") {
    return [
      {
        label: "Test new segment",
        description:
          "Identify a customer group with greater urgency or purchasing power.",
        type: "start",
      },
      {
        label: "Better signal?",
        description:
          "Compare demand, pricing acceptance, and acquisition difficulty.",
        type: "decision",
      },
      {
        label: "Refine positioning",
        description:
          "Repeat the test if no segment produces strong evidence.",
        type: "pivot",
      },
      {
        label: "Launch focused MVP",
        description:
          "Build around the strongest validated segment.",
        type: "success",
      },
    ];
  }

  return [
    {
      label: "Run validation experiment",
      description:
        "Test demand, pricing, and customer behavior.",
      type: "start",
    },
    {
      label: "Success threshold reached?",
      description:
        "Review willingness to pay, usage, and pilot retention.",
      type: "decision",
    },
    {
      label: "Refine and retest",
      description:
        "Adjust pricing, positioning, or customer segment.",
      type: "pivot",
    },
    {
      label: "Build and launch",
      description:
        "Invest in the MVP after customer evidence is strong.",
      type: "success",
    },
  ];
}

/**
 * Returns a concise summary associated with each verdict.
 */
function buildVerdictSummary(
  verdict: AdvisorVerdict
): string {
  const summaries: Record<AdvisorVerdict, string> = {
    "Build Now":
      "The venture shows sufficient market, execution, and investor signals to justify a focused MVP launch.",

    "Validate First":
      "The opportunity is promising, but key commercial assumptions should be tested before significant capital is committed.",

    Pivot:
      "The current customer, positioning, or market approach is not strong enough, but a narrower version may still be viable.",

    "Do Not Build Yet":
      "The current evidence does not support immediate development. Revalidate the problem before investing further.",
  };

  return summaries[verdict];
}

/**
 * Produces stronger founder guidance tied to the final recommendation.
 */
function buildFounderGuidance(
  verdict: AdvisorVerdict
): string {
  if (verdict === "Build Now") {
    return "Move quickly, but keep the first version narrow. Revenue and retained customer behavior matter more than feature volume.";
  }

  if (verdict === "Validate First") {
    return "Do not confuse positive feedback with demand. Ask customers to commit time, money, data, or workflow access before treating the idea as validated.";
  }

  if (verdict === "Pivot") {
    return "Preserve the underlying problem insight, but change the customer segment, positioning, pricing, or delivery model before expanding development.";
  }

  return "Stopping or delaying a weak concept is a successful decision. Use evidence from customer interviews to determine whether the idea deserves redesign or retirement.";
}

/**
 * Main EmpresaFi executive-advisory entry point.
 *
 * All outputs are derived deterministically from stable EmpresaFi
 * scoring inputs.
 */
export function generateVentureAdvisory(
  input: AdvisoryInput
): AdvisoryResult {
  const verdict = calculateVerdict(input);
  const confidence = calculateConfidence(input);

  return {
    verdict,
    confidence,

    summary: buildVerdictSummary(verdict),
    reasons: buildReasons(input),

    biggestBlocker: determineBiggestBlocker(input),

    nextExperiment: buildNextExperiment(
      input,
      verdict
    ),

    investorOpinion:
      calculateInvestorOpinion(input),

    investorConfidence: clampScore(
      input.investorReadinessScore +
        (input.riskLevel === "Low"
          ? 5
          : input.riskLevel === "High"
            ? -10
            : -2)
    ),

    fundingStrategy: buildFundingStrategy(
      input,
      verdict
    ),

    launchStrategy: buildLaunchStrategy(
      input,
      verdict
    ),

    decisionPath: buildDecisionPath(verdict),

    founderGuidance:
      buildFounderGuidance(verdict),
  };
}