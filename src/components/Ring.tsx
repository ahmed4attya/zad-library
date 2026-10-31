export function Ring({ p, label }: { p: number; label: string }) {
  const C = 213.6;
  const off = C * (1 - Math.min(1, p));
  return (
    <div className="relative h-[86px] w-[86px] flex-none">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="40" cy="40" r="34" fill="none" strokeWidth="8" className="stroke-sand-200" />
        <circle
          cx="40"
          cy="40"
          r="34"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={off}
          className="stroke-brand-600 transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-lg font-bold">{label}</span>
    </div>
  );
}
