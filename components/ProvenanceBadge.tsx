// components/ProvenanceBadge.tsx

import {
  BrainCircuit,
  Calculator,
  DatabaseBackup,
  LineChart,
  Sparkles,
  Target,
} from "lucide-react";
import {
  getProvenanceConfig,
  type ProvenanceType,
} from "@/lib/provenance";

type ProvenanceBadgeProps = {
  type: ProvenanceType;
  confidence?: number;
  showConfidence?: boolean;
};

/**
 * Returns the visual configuration associated with each
 * intelligence source.
 */
function getBadgeStyle(type: ProvenanceType) {
  switch (type) {
    case "deterministic":
      return {
        icon: Calculator,
        className:
          "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
      };

    case "ai_generated":
      return {
        icon: Sparkles,
        className:
          "border-violet-400/20 bg-violet-400/10 text-violet-200",
      };

    case "ai_estimate":
      return {
        icon: BrainCircuit,
        className:
          "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
      };

    case "modeled":
      return {
        icon: LineChart,
        className:
          "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-200",
      };

    case "planning_estimate":
      return {
        icon: Target,
        className:
          "border-amber-400/20 bg-amber-400/10 text-amber-200",
      };

    default:
      return {
        icon: DatabaseBackup,
        className:
          "border-orange-400/20 bg-orange-400/10 text-orange-200",
      };
  }
}

/**
 * Displays the source and optional confidence value for one
 * EmpresaFi report section.
 */
export function ProvenanceBadge({
  type,
  confidence,
  showConfidence = true,
}: ProvenanceBadgeProps) {
  const config = getProvenanceConfig(type, confidence);
  const style = getBadgeStyle(type);
  const Icon = style.icon;

  return (
    <span
      title={config.description}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${style.className}`}
    >
      <Icon className="h-3.5 w-3.5" />

      <span>{config.label}</span>

      {showConfidence &&
        typeof confidence === "number" && (
          <>
            <span className="opacity-40">•</span>
            <span>{Math.round(confidence)}%</span>
          </>
        )}
    </span>
  );
}