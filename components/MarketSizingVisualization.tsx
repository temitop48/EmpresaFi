// components/MarketSizingVisualization.tsx

import {
  Crosshair,
  Globe2,
  MapPinned,
  Sparkles,
  Target,
} from "lucide-react";
import {
  generateMarketSizing,
  type MarketSizeLevel,
  type MarketSizingInput,
} from "@/lib/marketSizingEngine";
import { ProvenanceBadge } from "./ProvenanceBadge";

type MarketSizingVisualizationProps = MarketSizingInput;

type MarketLevelCardProps = {
  level: MarketSizeLevel;
  currencySymbol: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  className: string;
  barClassName: string;
};

/**
 * Formats market values into compact executive-friendly labels.
 *
 * Examples:
 * 250000 becomes $250K
 * 1500000 becomes $1.5M
 */
function formatCompactMarketValue(
  value: number,
  currencySymbol: string
): string {
  if (value >= 1_000_000_000) {
    return `${currencySymbol}${(
      value / 1_000_000_000
    ).toFixed(1)}B`;
  }

  if (value >= 1_000_000) {
    return `${currencySymbol}${(
      value / 1_000_000
    ).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${currencySymbol}${(
      value / 1_000
    ).toFixed(0)}K`;
  }

  return `${currencySymbol}${value}`;
}

/**
 * MarketLevelCard renders one level of the market opportunity funnel.
 */
function MarketLevelCard({
  level,
  currencySymbol,
  icon: Icon,
  className,
  barClassName,
}: MarketLevelCardProps) {
  const relativeWidth = Math.max(
    level.percentageOfTam,
    3
  );

  return (
    <article
      className={`rounded-3xl border p-5 md:p-6 ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
            {level.label}
          </p>

          <h3 className="mt-2 text-lg font-semibold">
            {level.fullName}
          </h3>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl">
        {formatCompactMarketValue(
          level.value,
          currencySymbol
        )}
      </p>

      <div className="mt-5 flex items-center justify-between gap-4 text-xs text-white/40">
        <span>Relative market scope</span>
        <span>{level.percentageOfTam}%</span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full rounded-full transition-[width] duration-700 ${barClassName}`}
          style={{
            width: `${relativeWidth}%`,
          }}
        />
      </div>

      <p className="mt-5 text-sm leading-6 text-white/50">
        {level.description}
      </p>
    </article>
  );
}

/**
 * MarketSizingVisualization displays an illustrative TAM, SAM,
 * and SOM opportunity model.
 *
 * The section is explicitly labelled as a planning estimate because
 * it is generated from EmpresaFi's modeling assumptions rather than
 * independently verified live market statistics.
 */
export function MarketSizingVisualization(
  props: MarketSizingVisualizationProps
) {
  const marketSizing = generateMarketSizing(props);

  return (
    <section className="venture-panel rounded-[2rem] p-6 text-white md:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-200">
            <Sparkles className="h-3.5 w-3.5" />
            Market Intelligence
          </div>

          <h2 className="mt-5 text-2xl font-semibold tracking-tight md:text-4xl">
            Market opportunity model
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50 md:text-base">
            An illustrative TAM, SAM, and SOM model showing the
            venture&apos;s broad market, accessible market, and
            realistic early-stage opportunity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ProvenanceBadge
            type="planning_estimate"
            showConfidence={false}
          />

          <div className="rounded-2xl border border-white/8 bg-black/15 px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
              Opportunity signal
            </p>

            <p className="mt-1 text-lg font-semibold">
              {marketSizing.opportunityLevel}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        <MarketLevelCard
          level={marketSizing.tam}
          currencySymbol={
            marketSizing.currencySymbol
          }
          icon={Globe2}
          className="border-violet-400/15 bg-violet-400/[0.05]"
          barClassName="bg-gradient-to-r from-violet-500 to-fuchsia-400"
        />

        <MarketLevelCard
          level={marketSizing.sam}
          currencySymbol={
            marketSizing.currencySymbol
          }
          icon={MapPinned}
          className="border-cyan-400/15 bg-cyan-400/[0.05]"
          barClassName="bg-gradient-to-r from-cyan-500 to-blue-400"
        />

        <MarketLevelCard
          level={marketSizing.som}
          currencySymbol={
            marketSizing.currencySymbol
          }
          icon={Target}
          className="border-emerald-400/15 bg-emerald-400/[0.05]"
          barClassName="bg-gradient-to-r from-emerald-500 to-cyan-400"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.65fr_1.35fr]">
        <article className="rounded-3xl border border-white/8 bg-black/10 p-5 md:p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-200">
            <Crosshair className="h-5 w-5" />
          </div>

          <p className="mt-5 text-xs uppercase tracking-[0.2em] text-white/35">
            Initial capture target
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {marketSizing.marketCaptureRate}%
          </p>

          <p className="mt-3 text-sm leading-6 text-white/45">
            Estimated SOM as a percentage of the total modeled
            addressable market.
          </p>
        </article>

        <article className="rounded-3xl border border-white/8 bg-white/[0.025] p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
            Market-model assumptions
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {marketSizing.assumptions.map(
              (assumption, index) => (
                <div
                  key={`${assumption}-${index}`}
                  className="flex gap-3 rounded-2xl border border-white/6 bg-black/10 p-4"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-[11px] text-cyan-200">
                    {index + 1}
                  </span>

                  <p className="text-sm leading-6 text-white/50">
                    {assumption}
                  </p>
                </div>
              )
            )}
          </div>
        </article>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-400/15 bg-amber-400/[0.05] px-4 py-3 text-xs leading-5 text-amber-100/60">
        These figures are illustrative planning estimates derived
        from EmpresaFi&apos;s venture assumptions and modeling logic.
        They are not live or independently verified market statistics.
      </div>
    </section>
  );
}