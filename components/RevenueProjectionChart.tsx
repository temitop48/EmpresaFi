"use client";

// components/RevenueProjectionChart.tsx

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BadgeDollarSign,
  CalendarCheck2,
  LineChart,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  generateRevenueProjection,
  type RevenueProjectionInput,
} from "@/lib/revenueProjectionEngine";
import { ProvenanceBadge } from "./ProvenanceBadge";

type RevenueProjectionChartProps = RevenueProjectionInput;

type TooltipPayloadItem = {
  name?: string;
  value?: number;
};

type CustomTooltipProps = {
  active?: boolean;
  label?: string;
  payload?: TooltipPayloadItem[];
  currencySymbol: string;
};

/**
 * Formats a complete monetary value for cards and tooltips.
 */
function formatCurrency(
  value: number,
  currencySymbol: string
): string {
  return `${currencySymbol}${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value)}`;
}

/**
 * Formats large chart-axis values into compact labels.
 *
 * Examples:
 * 1500 becomes $1.5K
 * 1200000 becomes $1.2M
 */
function formatCompactAmount(
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
    ).toFixed(1)}K`;
  }

  return `${currencySymbol}${Math.round(value)}`;
}

/**
 * Custom tooltip displayed when the user hovers over a chart point.
 *
 * Each value represents revenue for that individual month.
 */
function RevenueTooltip({
  active,
  label,
  payload,
  currencySymbol,
}: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1020]/95 p-4 shadow-2xl backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
        {label} monthly revenue
      </p>

      <div className="mt-3 space-y-2">
        {payload.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-6 text-sm"
          >
            <span className="capitalize text-white/55">
              {item.name}
            </span>

            <span className="font-medium text-white">
              {formatCurrency(
                item.value ?? 0,
                currencySymbol
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * RevenueProjectionChart visualizes EmpresaFi's unified twelve-month
 * financial-planning model.
 *
 * Every headline metric is derived from the same monthly projection
 * dataset, which keeps the chart, annual totals, growth assumption,
 * and capital-recovery signal internally consistent.
 */
export function RevenueProjectionChart(
  props: RevenueProjectionChartProps
) {
  const projection = generateRevenueProjection(props);

  return (
    <section className="venture-panel rounded-[2rem] p-6 text-white md:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
            <Sparkles className="h-3.5 w-3.5" />
            Financial Intelligence
          </div>

          <h2 className="mt-5 text-2xl font-semibold tracking-tight md:text-4xl">
            Unified revenue projection
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50 md:text-base">
            Monthly revenue scenarios and headline financial metrics
            generated from one consistent projection model.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ProvenanceBadge
            type="modeled"
            showConfidence={false}
          />

          <span className="rounded-full border border-white/8 bg-black/15 px-3 py-1.5 text-xs text-white/40">
            Monthly revenue model
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.05] p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-200">
            <BadgeDollarSign className="h-5 w-5" />
          </div>

          <p className="mt-5 text-xs uppercase tracking-[0.18em] text-white/35">
            Year-one base revenue
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {formatCurrency(
              projection.yearOneRevenue.base,
              projection.currencySymbol
            )}
          </p>

          <p className="mt-3 text-xs leading-5 text-white/40">
            Sum of the base monthly projections from Month 1 through
            Month 12.
          </p>
        </article>

        <article className="rounded-3xl border border-cyan-400/15 bg-cyan-400/[0.05] p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
            <LineChart className="h-5 w-5" />
          </div>

          <p className="mt-5 text-xs uppercase tracking-[0.18em] text-white/35">
            Month-12 base revenue
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {formatCurrency(
              projection.monthTwelveRevenue.base,
              projection.currencySymbol
            )}
          </p>

          <p className="mt-3 text-xs leading-5 text-white/40">
            Projected revenue generated during the final individual
            month.
          </p>
        </article>

        <article className="rounded-3xl border border-violet-400/15 bg-violet-400/[0.05] p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-200">
            <TrendingUp className="h-5 w-5" />
          </div>

          <p className="mt-5 text-xs uppercase tracking-[0.18em] text-white/35">
            Monthly growth assumption
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {projection.monthlyGrowthRate}%
          </p>

          <p className="mt-3 text-xs leading-5 text-white/40">
            Base-scenario modeled month-over-month growth.
          </p>
        </article>

        <article className="rounded-3xl border border-amber-400/15 bg-amber-400/[0.05] p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-amber-200">
            <CalendarCheck2 className="h-5 w-5" />
          </div>

          <p className="mt-5 text-xs uppercase tracking-[0.18em] text-white/35">
            Capital-recovery proxy
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {projection.capitalRecoveryMonth
              ? `Month ${projection.capitalRecoveryMonth}`
              : "Beyond Year 1"}
          </p>

          <p className="mt-3 text-xs leading-5 text-white/40">
            The first month where cumulative modeled base revenue
            covers the estimated launch-cost reference.
          </p>
        </article>
      </div>

      <div className="mt-6 rounded-3xl border border-white/8 bg-black/10 p-4 md:p-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-white/75">
              Monthly revenue forecast
            </p>

            <p className="mt-1 text-xs text-white/35">
              Each chart point represents revenue for that individual
              month, not cumulative annual revenue.
            </p>
          </div>

          <p className="text-xs text-white/35">
            Month 1 through Month 12
          </p>
        </div>

        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={projection.data}
              margin={{
                top: 16,
                right: 16,
                left: 4,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="unifiedConservativeGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#f59e0b"
                    stopOpacity={0.22}
                  />
                  <stop
                    offset="95%"
                    stopColor="#f59e0b"
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient
                  id="unifiedBaseGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#8b5cf6"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="#8b5cf6"
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient
                  id="unifiedOptimisticGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#22d3ee"
                    stopOpacity={0.24}
                  />
                  <stop
                    offset="95%"
                    stopColor="#22d3ee"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tick={{
                  fill: "rgba(255,255,255,0.4)",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tickFormatter={(value: number) =>
                  formatCompactAmount(
                    value,
                    projection.currencySymbol
                  )
                }
                tick={{
                  fill: "rgba(255,255,255,0.4)",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
                width={64}
              />

              <Tooltip
                content={
                  <RevenueTooltip
                    currencySymbol={
                      projection.currencySymbol
                    }
                  />
                }
              />

              <Legend
                wrapperStyle={{
                  paddingTop: 20,
                  color: "rgba(255,255,255,0.55)",
                  fontSize: 12,
                }}
              />

              <Area
                type="monotone"
                dataKey="conservative"
                name="Conservative"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#unifiedConservativeGradient)"
              />

              <Area
                type="monotone"
                dataKey="base"
                name="Base"
                stroke="#8b5cf6"
                strokeWidth={3}
                fill="url(#unifiedBaseGradient)"
              />

              <Area
                type="monotone"
                dataKey="optimistic"
                name="Optimistic"
                stroke="#22d3ee"
                strokeWidth={2}
                fill="url(#unifiedOptimisticGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-amber-400/10 bg-amber-400/[0.035] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-white/35">
            Conservative year
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {formatCurrency(
              projection.yearOneRevenue.conservative,
              projection.currencySymbol
            )}
          </p>

          <p className="mt-3 text-xs leading-5 text-white/35">
            Total projected revenue across the conservative monthly
            scenario.
          </p>
        </article>

        <article className="rounded-3xl border border-violet-400/10 bg-violet-400/[0.035] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-white/35">
            Base year
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {formatCurrency(
              projection.yearOneRevenue.base,
              projection.currencySymbol
            )}
          </p>

          <p className="mt-3 text-xs leading-5 text-white/35">
            Total projected revenue across the base monthly scenario.
          </p>
        </article>

        <article className="rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.035] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-white/35">
            Optimistic year
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {formatCurrency(
              projection.yearOneRevenue.optimistic,
              projection.currencySymbol
            )}
          </p>

          <p className="mt-3 text-xs leading-5 text-white/35">
            Total projected revenue across the optimistic monthly
            scenario.
          </p>
        </article>
      </div>

      <div className="mt-6 rounded-3xl border border-white/8 bg-white/[0.025] p-5 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Model assumptions and limitations
            </p>

            <p className="mt-2 text-xs leading-5 text-white/35">
              These figures support early-stage planning and should be
              updated when real customer, pricing, cost, and retention
              data becomes available.
            </p>
          </div>

          <ProvenanceBadge
            type="planning_estimate"
            showConfidence={false}
          />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {projection.assumptions.map(
            (assumption, index) => (
              <div
                key={`${assumption}-${index}`}
                className="flex gap-3 rounded-2xl border border-white/6 bg-black/10 p-4"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-violet-400/20 bg-violet-400/10 text-[11px] text-violet-200">
                  {index + 1}
                </span>

                <p className="text-sm leading-6 text-white/50">
                  {assumption}
                </p>
              </div>
            )
          )}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-400/15 bg-amber-400/[0.05] px-4 py-3 text-xs leading-5 text-amber-100/60">
        This projection is a modeled business-planning estimate. It is
        not a guarantee of future revenue, profitability, cash flow, or
        formal accounting break-even.
      </div>
    </section>
  );
}