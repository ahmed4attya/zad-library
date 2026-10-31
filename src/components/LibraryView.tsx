'use client';

import { useEffect, useMemo, useState } from 'react';
import { EmptyCatalog } from './EmptyCatalog';
import { FileRow } from './FileRow';
import { FolderRow } from './FolderRow';
import { PageHead } from './PageHead';
import { SearchBox } from './SearchBox';
import { filesOf } from '@/lib/catalog';
import { cleanName, nf } from '@/lib/format';
import { useLib } from '@/lib/library-context';
import { iconFor } from '@/lib/style';
import type { Filter, Item } from '@/lib/types';

const FILTERS: { k: Filter; l: string }[] = [
  { k: 'all', l: 'الكل' },
  { k: 'audio', l: 'صوتيات' },
  { k: 'pdf', l: 'PDF' },
];

export function LibraryView() {
  const { tree, data, path, filter, setFilter, go, crumb, enter } = useLib();
  const [lq, setLq] = useState('');
  const cur = path[path.length - 1];

  useEffect(() => {
    setLq('');
  }, [cur]);

  const total = useMemo(() => (cur ? filesOf(cur, data.by) : []), [cur, data]);
  const found = useMemo(() => {
    const s = lq.trim().toLowerCase();
    if (!s) return null;
    return total.filter((f) => f.title.toLowerCase().includes(s)).slice(0, 100);
  }, [lq, total]);

  if (!tree || !cur) {
    return (
      <div className="wrap pt-4">
        <EmptyCatalog />
      </div>
    );
  }

  const root = path.length === 1;
  const subs = cur.folders ?? [];
  const secIndex = path[1] ? (tree.folders ?? []).indexOf(path[1]) : 0;
  const fs: Item[] = (cur.files ?? [])
    .map((f) => data.by[f.id])
    .filter((f): f is Item => !!f && (filter === 'all' || f.kind === filter));

  const crumbs: { label: string; onClick?: () => void }[] = [{ label: 'الرئيسية', onClick: () => go('home') }];
  if (root) crumbs.push({ label: 'المكتبة' });
  else
    path.slice(1).forEach((n, i) => {
      const idx = i + 1;
      crumbs.push({ label: cleanName(n.name), onClick: idx < path.length - 1 ? () => crumb(idx) : undefined });
    });

  const sub = `${nf(total.length)} ملف${subs.length ? ` · ${nf(subs.length)} مجلد` : ''}`;

  return (
    <div className="wrap mx-auto max-w-[820px] space-y-3 pt-4">
      <nav aria-label="مسار التصفح" className="flex flex-wrap items-center gap-1.5 text-sm text-mut">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">‹</span>}
            {c.onClick ? (
              <button type="button" onClick={c.onClick} className="font-medium">
                {c.label}
              </button>
            ) : (
              <b className="text-ink">{c.label}</b>
            )}
          </span>
        ))}
      </nav>

      <PageHead
        title={root ? 'المكتبة' : cleanName(cur.name)}
        sub={sub}
        icon={root ? 'lib' : path.length === 2 ? iconFor(cur.name, Math.max(secIndex, 0)) : 'folder'}
      />

      <SearchBox value={lq} onChange={setLq} placeholder="ابحث داخل هذا القسم..." />

      {found ? (
        <div className="grid gap-2.5">
          {found.length === 0 && <div className="py-9 text-center text-mut">لا توجد نتائج لهذه الكلمة.</div>}
          {found.map((f) => (
            <FileRow key={f.id} item={f} list={found} sub={f.path.join(' / ')} />
          ))}
        </div>
      ) : (
        <>
          {(cur.files ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {FILTERS.map(({ k, l }) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setFilter(k)}
                  className={`chip ${filter === k ? 'chip-on' : ''}`}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
          <div className="grid gap-2.5">
            {subs.map((d) => (
              <FolderRow key={d.id ?? d.name} node={d} onClick={() => enter(d)} />
            ))}
            {fs.map((f) => (
              <FileRow key={f.id} item={f} list={fs} />
            ))}
            {subs.length === 0 && fs.length === 0 && (
              <div className="py-9 text-center text-mut">لا توجد ملفات مطابقة هنا.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
