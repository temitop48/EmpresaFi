// components/SwotAnalysis.tsx

import {
  ArrowDownRight,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import {
  generateSwotAnalysis,
  SwotInput,
} from "@/lib/swotEngine";

type SwotAnalysisProps = SwotInput;

type SwotCardProps = {
  label: string;
  description: string;
  items: string[];
  icon: React.ComponentType<{ className?: string }>;
  className: string;
  iconClassName: string;
};

/**
 * SwotCard renders one quadrant of the SWOT analysis.
 */
function SwotCard({
  label,
  description,
  items,
  icon: Icon,
  className,
  iconClassName,
}: SwotCardProps) {
  return (
    <article className={`rounded-3xl border p-5 md:p-6 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            {label}
          </p>

          <p className="mt-2 text-sm leading-6 text-white/45">
            {description}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${iconClassName}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <ul className="mt-5 space-y-3">
        {items.map((item, index) => (
          <li
            key={`${label}-${index}-${item}`}
            className="flex gap-3 rounded-2xl border border-white/6 bg-black/10 p-4"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[11px] font-semibold text-white/50">
              {index + 1}
            </span>

            <p className="text-sm leading-6 text-white/60">
              {item}
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}

/**
 * SwotAnalysis converts existing report intelligence into a visual
 * strengths, weaknesses, opportunities, and threats framework.
 */
export function SwotAnalysis(props: SwotAnalysisProps) {
  const swot = generateSwotAnalysis(props);

  return (
    <section className="venture-panel rounded-[2rem] p-6 text-white md:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-200">
            <Sparkles className="h-3.5 w-3.5" />
            Strategic Intelligence
          </div>

          <h2 className="mt-5 text-2xl font-semibold tracking-tight md:text-4xl">
            SWOT analysis
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50 md:text-base">
            A structured view of the venture’s internal advantages,
            internal limitations, external opportunities, and external threats.
          </p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-black/15 px-4 py-3 text-xs uppercase tracking-[0.18em] text-white/35">
          Executive strategy view
        </div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-2">
        <SwotCard
          label="Strengths"
          description="Internal advantages that support execution and growth."
          items={swot.strengths}
          icon={ArrowUpRight}
          className="border-emerald-400/15 bg-emerald-400/[0.05]"
          iconClassName="border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
        />

        <SwotCard
          label="Weaknesses"
          description="Internal gaps that could slow progress or reduce credibility."
          items={swot.weaknesses}
          icon={ArrowDownRight}
          className="border-amber-400/15 bg-amber-400/[0.05]"
          iconClassName="border-amber-400/20 bg-amber-400/10 text-amber-200"
        />

        <SwotCard
          label="Opportunities"
          description="External paths that could improve traction, revenue, or scale."
          items={swot.opportunities}
          icon={Sparkles}
          className="border-cyan-400/15 bg-cyan-400/[0.05]"
          iconClassName="border-cyan-400/20 bg-cyan-400/10 text-cyan-200"
        />

        <SwotCard
          label="Threats"
          description="External risks that could weaken adoption or execution."
          items={swot.threats}
          icon={ShieldAlert}
          className="border-red-400/15 bg-red-400/[0.05]"
          iconClassName="border-red-400/20 bg-red-400/10 text-red-200"
        />
      </div>
    </section>
  );
}