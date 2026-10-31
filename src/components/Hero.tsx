import type { CSSProperties } from 'react';

const BRAND: CSSProperties = {
  backgroundImage:
    'radial-gradient(circle at 12% 18%, rgba(219,184,95,.22), transparent 34%), radial-gradient(circle at 92% 0%, rgba(255,255,255,.08), transparent 28%), linear-gradient(135deg, #174f32 0%, #0d3825 100%)',
};
const GOLD: CSSProperties = {
  backgroundImage:
    'radial-gradient(circle at 85% 10%, rgba(255,255,255,.3), transparent 45%), linear-gradient(135deg, #e2c36f, #b48a2b)',
};

interface Props {
  title: string;
  sub: string;
  chips?: string[];
  variant?: 'brand' | 'gold';
  small?: boolean;
}

export function Hero({ title, sub, chips = [], variant = 'brand', small = false }: Props) {
  const gold = variant === 'gold';
  return (
    <section
      style={gold ? GOLD : BRAND}
      className={`relative isolate overflow-hidden ${gold ? 'text-[#2a2005]' : 'text-white'} ${small ? 'pb-[68px] pt-[26px]' : 'pb-[82px] pt-9'}`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute -left-12 -top-16 h-52 w-52 rounded-full border border-white/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-5 -top-9 h-36 w-36 rounded-full border border-white/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -bottom-24 h-64 w-64 rounded-full border border-[#d7b75f]/25" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-8 -bottom-16 h-44 w-44 rounded-full border border-[#d7b75f]/20" />
      <div className="wrap relative">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold tracking-[.12em] text-[#f0d68b]">
          <span className="h-px w-7 bg-[#d7b75f]" />
          مَكْتَبَةٌ لِلْعِلْمِ وَالْمَعْرِفَة
        </div>
        <h1 className={`mb-2 max-w-3xl font-bold leading-[1.35] tracking-tight ${small ? 'text-2xl sm:text-3xl' : 'text-[28px] sm:text-4xl'}`}>{title}</h1>
        <p className="max-w-2xl text-sm leading-7 opacity-90 sm:text-base">{sub}</p>
        {chips.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {chips.map((c) => (
              <span
                key={c}
                className={`rounded-full border px-3.5 py-1 text-[12px] backdrop-blur-sm ${gold ? 'border-black/10 bg-white/40' : 'border-white/20 bg-white/10'}`}
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
