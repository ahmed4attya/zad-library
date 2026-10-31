'use client';

import { Icon } from './Icon';
import { filesOf } from '@/lib/catalog';
import { cleanName, nf } from '@/lib/format';
import { useLib } from '@/lib/library-context';
import { TILES, iconFor } from '@/lib/style';
import type { CatNode } from '@/lib/types';

const BASE =
  'flex h-[118px] flex-col items-center justify-center gap-1 rounded-[20px] p-3 text-center text-white shadow-md shadow-black/10 transition hover:-translate-y-0.5 sm:h-[130px]';

export function Tile({ node, index }: { node: CatNode; index: number }) {
  const { data, openSection } = useLib();
  const n = filesOf(node, data.by).length;
  const [a, b] = TILES[index % TILES.length] ?? TILES[0]!;
  return (
    <button
      type="button"
      onClick={() => openSection(node)}
      className={BASE}
      style={{
        backgroundImage: `radial-gradient(circle at 85% 0%, rgba(255,255,255,.18), transparent 55%), linear-gradient(145deg, ${a}, ${b})`,
      }}
    >
      <Icon name={iconFor(node.name, index)} className="h-8 w-8" />
      <b className="text-[15px] font-bold leading-tight sm:text-[17px]">{cleanName(node.name)}</b>
      <small className="text-xs text-white/80">ملف {nf(n)}</small>
    </button>
  );
}

export function MoreTile({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={BASE}
      style={{
        backgroundImage:
          'radial-gradient(circle at 85% 0%, rgba(255,255,255,.18), transparent 55%), linear-gradient(145deg, #7E7E7E, #5F5F5F)',
      }}
    >
      <Icon name="dots" className="h-8 w-8" />
      <b className="text-[15px] font-bold leading-tight sm:text-[17px]">المزيد</b>
    </button>
  );
}
