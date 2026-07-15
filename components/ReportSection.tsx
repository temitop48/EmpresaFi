// components/ReportSection.tsx

import type { ProvenanceType } from "@/lib/provenance";
import { ConfidenceIndicator } from "./ConfidenceIndicator";
import { ProvenanceBadge } from "./ProvenanceBadge";

type ReportSectionProps = {
  title: string;
  text: string;
  confidence?: number;
  provenance?: ProvenanceType;
};

/**
 * ReportSection renders one intelligence section together with
 * optional confidence and provenance information.
 */
export function ReportSection({
  title,
  text,
  confidence,
  provenance = "ai_generated",
}: ReportSectionProps) {
  return (
    <section className="venture-panel-soft h-full rounded-[2rem] p-6 text-white md:p-7">
      <div className="flex h-full flex-col">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight">
            {title}
          </h2>

          <ProvenanceBadge
            type={provenance}
            confidence={confidence}
          />
        </div>

        <p className="mt-5 flex-1 text-sm leading-7 text-white/60 md:text-[15px]">
          {text}
        </p>

        {typeof confidence === "number" && (
          <div className="mt-6 border-t border-white/6 pt-4">
            <ConfidenceIndicator value={confidence} />
          </div>
        )}
      </div>
    </section>
  );
}