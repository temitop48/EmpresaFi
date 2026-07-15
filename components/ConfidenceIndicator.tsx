// components/ConfidenceIndicator.tsx

import {
  getConfidenceLevel,
  type ConfidenceLevel,
} from "@/lib/confidenceEngine";

type ConfidenceIndicatorProps = {
  value: number;
  compact?: boolean;
};

/**
 * Returns the visual style for each confidence level.
 */
function getConfidenceStyle(level: ConfidenceLevel) {
  switch (level) {
    case "Very High":
      return {
        text: "text-emerald-200",
        bar: "bg-gradient-to-r from-emerald-500 to-cyan-400",
        badge:
          "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
      };

    case "High":
      return {
        text: "text-cyan-200",
        bar: "bg-gradient-to-r from-cyan-500 to-violet-400",
        badge:
          "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
      };

    case "Moderate":
      return {
        text: "text-amber-200",
        bar: "bg-gradient-to-r from-amber-500 to-orange-400",
        badge:
          "border-amber-400/20 bg-amber-400/10 text-amber-200",
      };

    default:
      return {
        text: "text-red-200",
        bar: "bg-gradient-to-r from-red-500 to-orange-400",
        badge:
          "border-red-400/20 bg-red-400/10 text-red-200",
      };
  }
}

/**
 * Displays a reusable confidence signal with a label and progress bar.
 */
export function ConfidenceIndicator({
  value,
  compact = false,
}: ConfidenceIndicatorProps) {
  const normalizedValue = Math.max(
    0,
    Math.min(100, Math.round(value))
  );

  const level = getConfidenceLevel(normalizedValue);
  const style = getConfidenceStyle(level);

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${style.badge}`}
      >
        <span>{normalizedValue}% confidence</span>
        <span className="opacity-50">•</span>
        <span>{level}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs uppercase tracking-[0.18em] text-white/35">
          Confidence
        </span>

        <span className={`text-sm font-medium ${style.text}`}>
          {normalizedValue}% · {level}
        </span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full rounded-full ${style.bar}`}
          style={{
            width: `${normalizedValue}%`,
          }}
        />
      </div>
    </div>
  );
}