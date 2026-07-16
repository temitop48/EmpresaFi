// components/LandingHero.tsx

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Building2,
  ChartNoAxesCombined,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

/**
 * LandingHero is the first section users see.
 *
 * Its purpose is to immediately explain what EmpresaFi does,
 * establish credibility, and encourage founders to begin
 * an AI business analysis.
 */
export function LandingHero() {
  return (
    <section className="relative overflow-hidden px-6 py-24 text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-20 bg-[#050816]" />

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#4f46e5_0%,#09090b_40%,#020617_100%)]" />

      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-violet-500/20 blur-[150px]" />

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[170px]" />

      <div className="mx-auto max-w-7xl">
        {/* =======================================================
            EmpresaFi Branding
        ======================================================= */}

        <div className="mb-10 flex items-center gap-4">
          <Image
            src="/empresafi-logo.png"
            alt="EmpresaFi Logo"
            width={56}
            height={56}
            priority
            className="rounded-2xl shadow-xl shadow-violet-500/20"
          />

          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              EmpresaFi
            </h2>

            <p className="text-sm text-white/60">
              AI Venture Intelligence Platform
            </p>
          </div>
        </div>

        {/* Badge */}

        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-5 py-2 text-sm text-violet-100 backdrop-blur-xl">
          <Sparkles className="h-4 w-4" />

          The AI Venture Intelligence Platform
        </div>

        {/* Headline */}

        <h1 className="max-w-5xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          Transform ideas into{" "}
          <span className="venture-gradient-text">
            investor-ready ventures.
          </span>
        </h1>

        {/* Description */}

        <p className="mt-8 max-w-3xl text-lg leading-8 text-white/65 md:text-xl">
          EmpresaFi combines AI-powered market intelligence,
          financial analysis, investor readiness, business
          validation and strategic recommendations into one
          premium workspace built for founders, freelancers,
          startups and growing businesses.
        </p>

        {/* CTA */}

        <div className="mt-12 flex flex-col gap-5 sm:flex-row">
          <a
            href="/analyze"
            style={{
              color: "#0f172a",
              WebkitTextFillColor: "#0f172a",
            }}
            className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-[1.02] hover:bg-slate-100"
          >
            Analyze My Business Idea

            <ArrowRight className="ml-2 h-5 w-5" />
          </a>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white/70 backdrop-blur-xl">
            Built for the OKX AI Genesis Hackathon
          </div>
        </div>

        {/* Stats */}

        <div className="mt-16 flex flex-wrap gap-6 text-sm text-white/60">
          <div>
            <p className="text-3xl font-bold text-white">5</p>
            AI Specialist Agents
          </div>

          <div>
            <p className="text-3xl font-bold text-white">15+</p>
            Venture Intelligence Sections
          </div>

          <div>
            <p className="text-3xl font-bold text-white">1</p>
            Investor-Ready Report
          </div>
        </div>

        {/* Feature Cards */}

        <div className="mt-20 grid gap-6 lg:grid-cols-4">
          {[
            {
              icon: BrainCircuit,
              title: "Business Intelligence",
              text:
                "Validate ideas with AI-powered market, customer and competitor intelligence.",
            },
            {
              icon: ChartNoAxesCombined,
              title: "Financial Intelligence",
              text:
                "Estimate startup costs, revenue potential, pricing strategy and business viability.",
            },
            {
              icon: ShieldCheck,
              title: "Risk Intelligence",
              text:
                "Identify execution risks, funding readiness and strategic weaknesses before launch.",
            },
            {
              icon: Building2,
              title: "Founder Intelligence",
              text:
                "Receive actionable recommendations, investor insights and execution roadmaps.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl transition-all duration-300 hover:border-violet-400/20 hover:bg-white/[0.06]"
            >
              <div className="mb-6 inline-flex rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4">
                <feature.icon className="h-7 w-7 text-violet-300" />
              </div>

              <h3 className="text-xl font-semibold">
                {feature.title}
              </h3>

              <p className="mt-4 leading-7 text-white/55">
                {feature.text}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Message */}

        <div className="mt-20 rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">
                Why EmpresaFi
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                More than an AI report generator.
              </h2>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/60">
                EmpresaFi doesn&apos;t just analyze your business idea.
                It delivers structured business intelligence,
                investor-ready documentation and strategic founder
                guidance, helping you make smarter decisions before
                investing time or capital.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <p className="text-sm uppercase tracking-widest text-violet-300">
                Output
              </p>

              <ul className="mt-5 space-y-4 text-white/70">
                <li>✓ Executive Intelligence Report</li>
                <li>✓ Market & Competitor Analysis</li>
                <li>✓ Financial Projection</li>
                <li>✓ Investor Readiness</li>
                <li>✓ Business Roadmap</li>
                <li>✓ Founder AI Recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}