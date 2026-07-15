// components/AgentProgress.tsx

import {
  BarChart3,
  Check,
  CircleDashed,
  Coins,
  Loader2,
  Rocket,
  ShieldAlert,
  Users,
} from "lucide-react";

type AgentStatus = "queued" | "analyzing" | "complete";

type Agent = {
  name: string;
  description: string;
  status: AgentStatus;
};

type AgentProgressProps = {
  agents: Agent[];
};

const agentIcons = {
  "Market Agent": Users,
  "Finance Agent": Coins,
  "Risk Agent": ShieldAlert,
  "Growth Agent": Rocket,
  "Investor Agent": BarChart3,
};

/**
 * AgentProgress visualizes the specialist analysis workflow.
 *
 * Each row communicates what the agent is responsible for and whether
 * it is queued, currently analyzing, or complete.
 */
export function AgentProgress({ agents }: AgentProgressProps) {
  const completeCount = agents.filter(
    (agent) => agent.status === "complete"
  ).length;

  const progressPercentage = Math.round(
    (completeCount / agents.length) * 100
  );

  return (
    <section className="venture-panel rounded-[2rem] p-6 text-white md:p-7">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300/70">
            Intelligence workflow
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Specialist agents
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/45">
            Five business specialists collaborate to build one unified
            venture report.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-right">
          <p className="text-2xl font-semibold">{progressPercentage}%</p>
          <p className="text-[11px] uppercase tracking-wider text-white/35">
            Complete
          </p>
        </div>
      </div>

      <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400 transition-all duration-700"
          style={{
            width: `${progressPercentage}%`,
          }}
        />
      </div>

      <div className="mt-6 space-y-3">
        {agents.map((agent) => {
          const Icon =
            agentIcons[agent.name as keyof typeof agentIcons] ??
            CircleDashed;

          return (
            <div
              key={agent.name}
              className={`group flex items-center gap-4 rounded-2xl border p-4 transition-all duration-500 ${
                agent.status === "analyzing"
                  ? "border-violet-400/30 bg-violet-400/10 shadow-[0_0_35px_rgba(139,92,246,0.12)]"
                  : agent.status === "complete"
                    ? "border-emerald-400/15 bg-emerald-400/5"
                    : "border-white/5 bg-black/10"
              }`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                  agent.status === "analyzing"
                    ? "border-violet-400/30 bg-violet-400/15 text-violet-200"
                    : agent.status === "complete"
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                      : "border-white/5 bg-white/[0.03] text-white/30"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{agent.name}</h3>

                  {agent.status === "analyzing" && (
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-300" />
                  )}
                </div>

                <p className="mt-1 text-sm leading-5 text-white/40">
                  {agent.description}
                </p>
              </div>

              <div
                className={`flex h-8 min-w-8 items-center justify-center rounded-full border px-2.5 text-xs capitalize ${
                  agent.status === "complete"
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                    : agent.status === "analyzing"
                      ? "border-violet-400/20 bg-violet-400/10 text-violet-200"
                      : "border-white/5 bg-white/[0.02] text-white/25"
                }`}
              >
                {agent.status === "complete" ? (
                  <Check className="h-4 w-4" />
                ) : agent.status === "analyzing" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Queued"
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}