"use client";

// components/InvestorReadinessRadar.tsx

import {
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  BarChart3,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  generateInvestorRadar,
  InvestorRadarInput,
} from "@/lib/investorRadarEngine";

type InvestorReadinessRadarProps =
  InvestorRadarInput;

type RadarTooltipPayloadItem = {
  payload?: {
    category?: string;
    score?: number;
  };
};

type RadarTooltipProps = {
  active?: boolean;
  payload?: RadarTooltipPayloadItem[];
};

/**
 * Custom tooltip shown when a user hovers over one radar point.
 */
function InvestorRadarTooltip({
  active,
  payload,
}: RadarTooltipProps) {
  const point = payload?.[0]?.payload;

  if (!active || !point) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1020]/95 p-4 shadow-2xl backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
        {point.category}
      </p>

      <p className="mt-2 text-2xl font-semibold text-white">
        {point.score}/100
      </p>

      <p className="mt-2 text-xs text-white/40">
        Investor readiness dimension
      </p>
    </div>
  );
}

/**
 * Returns a readable label for the overall investor profile.
 */
function getInvestorProfileLabel(
  score: number
): string {
  if (score >= 80) return "Strong";
  if (score >= 65) return "Promising";
  if (score >= 50) return "Developing";

  return "Early";
}

/**
 * InvestorReadinessRadar visualizes the venture across six
 * investor-facing dimensions.
 */
export function InvestorReadinessRadar(
  props: InvestorReadinessRadarProps
) {
  const radar = generateInvestorRadar(props);

  return (
    <section className="venture-panel rounded-[2rem] p-6 text-white md:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1.5 text-xs font-medium text-fuchsia-200">
            <Sparkles className="h-3.5 w-3.5" />
            Investor Intelligence
          </div>

          <h2 className="mt-5 text-2xl font-semibold tracking-tight md:text-4xl">
            Investor readiness radar
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50 md:text-base">
            A six-dimension view of how the venture may appear to
            early-stage investors.
          </p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-black/15 px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
            Investor profile
          </p>

          <p className="mt-1 text-lg font-semibold">
            {getInvestorProfileLabel(
              radar.overallScore
            )}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-white/8 bg-black/10 p-4 md:p-6">
          <div className="h-[420px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <RadarChart
                data={radar.data}
                outerRadius="72%"
              >
                <PolarGrid
                  stroke="rgba(255,255,255,0.08)"
                />

                <PolarAngleAxis
                  dataKey="category"
                  tick={{
                    fill: "rgba(255,255,255,0.55)",
                    fontSize: 12,
                  }}
                />

                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tickCount={6}
                  axisLine={false}
                  tick={{
                    fill: "rgba(255,255,255,0.22)",
                    fontSize: 10,
                  }}
                />

                <Tooltip
                  content={
                    <InvestorRadarTooltip />
                  }
                />

                <Radar
                  name="Investor Readiness"
                  dataKey="score"
                  stroke="#c084fc"
                  strokeWidth={3}
                  fill="#8b5cf6"
                  fillOpacity={0.28}
                  dot={{
                    fill: "#67e8f9",
                    strokeWidth: 0,
                    r: 4,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <div className="space-y-4">
          <article className="rounded-3xl border border-fuchsia-400/15 bg-fuchsia-400/[0.05] p-5 md:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-200">
              <BarChart3 className="h-5 w-5" />
            </div>

            <p className="mt-5 text-xs uppercase tracking-[0.2em] text-white/35">
              Overall investor score
            </p>

            <p className="mt-2 text-4xl font-semibold">
              {radar.overallScore}/100
            </p>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400"
                style={{
                  width: `${radar.overallScore}%`,
                }}
              />
            </div>

            <p className="mt-5 text-sm leading-6 text-white/50">
              {radar.summary}
            </p>
          </article>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <article className="rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.05] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-200">
                  <TrendingUp className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                    Strongest dimension
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {radar.strongestDimension}
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-amber-400/15 bg-amber-400/[0.05] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-amber-200">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                    Priority improvement
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {radar.weakestDimension}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {radar.data.map((item) => (
          <article
            key={item.category}
            className="rounded-2xl border border-white/8 bg-white/[0.025] p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-white/50">
                {item.category}
              </span>

              <span className="text-sm font-semibold">
                {item.score}
              </span>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                style={{
                  width: `${item.score}%`,
                }}
              />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-amber-400/15 bg-amber-400/[0.05] px-4 py-3 text-xs leading-5 text-amber-100/60">
        This radar is an advisory interpretation of the EmpresaFi
        report. It is not a guarantee of investor interest or funding.
      </div>
    </section>
  );
}