'use client';

import { Icon } from './Icon';
import { kindLabel, nf } from '@/lib/format';
import { useLib } from '@/lib/library-context';
import type { Item } from '@/lib/types';

export function FileRow({ item, list, sub }: { item: Item; list: Item[]; sub?: string }) {
  const { st, openFile, toggleFav } = useLib();
  const p = st.pos[item.id];
  const pr = p && p.d ? p.t / p.d : 0;
  const done = !!st.done[item.id];
  const fav = !!st.fav[item.id];
  const status = done ? ' · مكتمل' : pr > 0.02 ? ` · ${nf(Math.round(pr * 100))}%` : '';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => openFile(item, list)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') openFile(item, list);
      }}
      className="flex cursor-pointer items-center gap-3 rounded-[20px] border border-line bg-card p-2.5 transition-colors hover:border-brand-600"
    >
      <span
        className={`grid h-[42px] w-[42px] flex-none place-items-center rounded-2xl text-pri ${
          done ? 'bg-brand-100' : 'bg-brand-50'
        }`}
      >
        <Icon name={item.kind === 'audio' ? 'audio' : 'pdf'} />
      </span>
      <div className="min-w-0 flex-1">
        <b className="line-clamp-2 text-[14.5px] font-semibold leading-relaxed">{item.title}</b>
        <small className="block truncate text-mut">{sub ?? `${kindLabel(item)}${status}`}</small>
        {pr > 0.02 && !done && (
          <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-sand-200">
            <i className="block h-full rounded-full bg-brand-600" style={{ width: `${Math.round(pr * 100)}%` }} />
          </span>
        )}
      </div>
      <button
        type="button"
        aria-label="المفضلة"
        onClick={(e) => {
          e.stopPropagation();
          toggleFav(item.id);
        }}
        className={`grid h-[38px] w-[38px] flex-none place-items-center rounded-xl ${fav ? 'text-gold' : 'text-mut'}`}
      >
        <Icon name="star" className={`h-[22px] w-[22px] ${fav ? 'fill-current' : ''}`} />
      </button>
    </div>
  );
}
