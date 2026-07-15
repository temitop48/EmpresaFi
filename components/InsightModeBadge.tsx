// components/InsightModeBadge.tsx

import {
  BrainCircuit,
  DatabaseZap,
  ShieldCheck,
} from "lucide-react";
import type { VentureInsights } from "@/lib/insightSchema";

type InsightModeBadgeProps = {
  mode: VentureInsights["researchMode"];
};

/**
 * Displays the provenance of EmpresaFi's strategic intelligence.
 */
export function InsightModeBadge({
  mode,
}: InsightModeBadgeProps) {
  if (mode === "live_search") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-200">
        <DatabaseZap className="h-3.5 w-3.5" />
        Live market intelligence
      </span>
    );
  }

  if (mode === "fallback") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs text-amber-200">
        <ShieldCheck className="h-3.5 w-3.5" />
        Strategic fallback
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs text-violet-200">
      <BrainCircuit className="h-3.5 w-3.5" />
      AI strategic intelligence
    </span>
  );
}