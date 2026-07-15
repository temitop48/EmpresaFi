// components/AppLogo.tsx

import Link from "next/link";
import { Orbit } from "lucide-react";

type AppLogoProps = {
  href?: string;
};

/**
 * AppLogo provides a reusable EmpresaFi brand mark.
 * It is used across the landing, analysis, and report pages.
 */
export function AppLogo({ href = "/" }: AppLogoProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-3 text-white"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
        <Orbit className="h-5 w-5 text-violet-300" />
      </span>

      <span>
        <span className="block text-lg font-bold tracking-tight">
          EmpresaFi
        </span>

        <span className="block text-[10px] uppercase tracking-[0.24em] text-white/35">
          AI Venture Intelligence
        </span>
      </span>
    </Link>
  );
}