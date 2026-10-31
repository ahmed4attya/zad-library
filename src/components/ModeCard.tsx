'use client';

import { Icon, type IconName } from './Icon';
import { filesOf } from '@/lib/catalog';
import { nf } from '@/lib/format';
import { useLib } from '@/lib/library-context';
import type { CatNode } from '@/lib/types';

const ICONS: IconName[] = ['lib', 'audio', 'pdf', 'folder'];

export function ModeCard({ node, index }: { node: CatNode; index: number }) {
  const { data, st, openSection } = useLib();
  const fs = filesOf(node, data.by);
  const done = fs.filter((f) => st.done[f.id]).length;
  const audio = fs.filter((f) => f.kind === 'audio').length;
  const pct = fs.length ? Math.round((done / fs.length) * 100) : 0;
  return (
    <button
      type="button"
      onClick={() => openSection(node)}
      className="flex flex-col gap-2 rounded-3xl border border-line bg-card p-3.5 text-start shadow-lg shadow-black/5 transition hover:-translate-y-0.5 hover:border-brand-600"
    >
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-pri">
        <Icon name={ICONS[index % ICONS.length] ?? 'folder'} />
      </span>
      <b className="text-[15px] leading-relaxed">{node.name}</b>
      <small className="text-mut">
        {nf(fs.length)} ملفًا{audio ? ` · ${nf(audio)} صوتيًا` : ''}
      </small>
      <span className="block h-1.5 overflow-hidden rounded-full bg-sand-200">
        <i className="block h-full rounded-full bg-brand-600" style={{ width: `${pct}%` }} />
      </span>
      <small className="text-mut">{nf(pct)}% مكتمل</small>
    </button>
  );
}
