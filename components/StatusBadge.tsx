// components/StatusBadge.tsx

import { Bot, ShieldCheck } from "lucide-react";

type StatusBadgeProps = {
  mode?: "ai" | "fallback";
};

/**
 * StatusBadge tells users how the report was generated.
 *
 * This improves transparency and makes the fallback system visible
 * without making the interface feel technical or alarming.
 */
export function StatusBadge({ mode = "ai" }: StatusBadgeProps) {
  const isAi = mode === "ai";

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
        isAi
          ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-200"
          : "border-amber-400/20 bg-amber-400/10 text-amber-200"
      }`}
    >
      {isAi ? (
        <Bot className="h-3.5 w-3.5" />
      ) : (
        <ShieldCheck className="h-3.5 w-3.5" />
      )}

      {isAi ? "AI-generated analysis" : "Reliable fallback analysis"}
    </div>
  );
}