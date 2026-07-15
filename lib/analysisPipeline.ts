// lib/analysisPipeline.ts

import {
  BarChart3,
  BrainCircuit,
  Building2,
  Calculator,
  CheckCircle2,
  FileCheck2,
  LineChart,
  ShieldCheck,
  Target,
} from "lucide-react";

export type AnalysisStepStatus =
  | "queued"
  | "analyzing"
  | "complete";

export type AnalysisPipelineStep = {
  id: string;
  title: string;
  description: string;
  status: AnalysisStepStatus;
  icon: React.ComponentType<{
    className?: string;
  }>;
};

/**
 * Returns a fresh copy of the EmpresaFi analysis pipeline.
 *
 * A function is used instead of a shared array so every new analysis
 * begins with clean status values.
 */
export function createAnalysisPipeline(): AnalysisPipelineStep[] {
  return [
    {
      id: "understand",
      title: "Understanding the venture",
      description:
        "Interpreting the business idea, location, industry, customers, budget, and founder goal.",
      status: "queued",
      icon: BrainCircuit,
    },
    {
      id: "score",
      title: "Calculating venture scores",
      description:
        "Running EmpresaFi’s deterministic scoring engine for stable and repeatable results.",
      status: "queued",
      icon: Calculator,
    },
    {
      id: "insights",
      title: "Generating strategic intelligence",
      description:
        "Identifying relevant market signals, industry considerations, and customer dynamics.",
      status: "queued",
      icon: Target,
    },
    {
      id: "competitors",
      title: "Mapping the competitive landscape",
      description:
        "Reviewing likely competitors, indirect alternatives, and differentiation opportunities.",
      status: "queued",
      icon: Building2,
    },
    {
      id: "finance",
      title: "Modeling financial potential",
      description:
        "Estimating launch capital, revenue scenarios, growth assumptions, and recovery signals.",
      status: "queued",
      icon: LineChart,
    },
    {
      id: "risk",
      title: "Evaluating venture risks",
      description:
        "Assessing market, execution, competition, and financial risks.",
      status: "queued",
      icon: ShieldCheck,
    },
    {
      id: "strategy",
      title: "Building the execution strategy",
      description:
        "Creating the SWOT analysis, business model, growth blueprint, and launch roadmap.",
      status: "queued",
      icon: BarChart3,
    },
    {
      id: "investor",
      title: "Preparing investor intelligence",
      description:
        "Evaluating investor readiness, funding strategy, and the founder decision path.",
      status: "queued",
      icon: CheckCircle2,
    },
    {
      id: "finalize",
      title: "Finalizing the intelligence report",
      description:
        "Validating the structured report and preparing the shareable founder dashboard.",
      status: "queued",
      icon: FileCheck2,
    },
  ];
}