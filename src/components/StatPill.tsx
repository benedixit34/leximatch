/** Dark pill with a big icon overlapping its left edge (coins, gems, timer) */
export default function StatPill({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div
      aria-label={label}
      className="relative flex h-7 min-w-[3.3rem] items-center justify-end rounded-full border border-white/25 bg-slate-900/55 pl-6 pr-2 backdrop-blur-sm"
    >
      <span className="absolute -left-2 top-1/2 h-8 w-8 -translate-y-1/2 drop-shadow">{icon}</span>
      <span className="font-mono text-xs font-bold tabular-nums text-white">{value}</span>
    </div>
  );
}