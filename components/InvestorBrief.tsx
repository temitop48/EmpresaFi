"use client";

// components/InvestorBrief.tsx

import { Copy } from "lucide-react";

type InvestorBriefProps = {
  brief: string;
};

/**
 * InvestorBrief highlights the part of the report that can be copied
 * into a pitch, grant application, or investor message.
 */
export function InvestorBrief({ brief }: InvestorBriefProps) {
  async function copyBrief() {
    await navigator.clipboard.writeText(brief);
  }

  return (
    <section className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6 text-white shadow-xl backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-3 inline-flex rounded-full border border-emerald-400/20 px-3 py-1 text-sm text-emerald-200">
            Investor Brief
          </p>

          <h2 className="text-xl font-semibold">
            Ready-to-share venture summary
          </h2>
        </div>

        <button
          onClick={copyBrief}
          className="inline-flex items-center rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10"
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </button>
      </div>

      <p className="mt-5 leading-7 text-white/70">{brief}</p>
    </section>
  );
}