// components/VentureScoreCard.tsx

type VentureScoreCardProps = {
  label: string;
  value: number | string;
  helper?: string;
};

/**
 * VentureScoreCard displays one important business metric
 * such as Venture Score, Market Opportunity, or Risk Level.
 */
export function VentureScoreCard({
  label,
  value,
  helper,
}: VentureScoreCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 text-white shadow-xl backdrop-blur">
      <p className="text-sm text-white/50">{label}</p>

      <div className="mt-3 text-4xl font-bold tracking-tight">{value}</div>

      {helper && <p className="mt-3 text-sm text-white/50">{helper}</p>}
    </div>
  );
}