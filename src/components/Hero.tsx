import type { CSSProperties } from 'react';

const BRAND: CSSProperties = {
  backgroundImage:
    'radial-gradient(circle at 12% 18%, rgba(200,161,58,.28), transparent 42%), linear-gradient(135deg, var(--b600), var(--b800))',
};
const GOLD: CSSProperties = {
  backgroundImage:
    'radial-gradient(circle at 85% 10%, rgba(255,255,255,.3), transparent 45%), linear-gradient(135deg, #dcb650, #a07c1a)',
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
      className={`${gold ? 'text-[#2a2005]' : 'text-white'} ${small ? 'pb-[68px] pt-[22px]' : 'pb-[78px] pt-7'}`}
    >
      <div className="wrap">
        <h1 className="mb-1 text-[26px] font-bold leading-snug">{title}</h1>
        <p className="opacity-90">{sub}</p>
        {chips.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-2">
            {chips.map((c) => (
              <span
                key={c}
                className={`rounded-full border px-3.5 py-0.5 text-[13px] ${
                  gold ? 'border-black/10 bg-white/40' : 'border-white/20 bg-white/15'
                }`}
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
