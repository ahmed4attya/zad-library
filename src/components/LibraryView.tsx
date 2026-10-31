'use client';

import { EmptyCatalog } from './EmptyCatalog';
import { FileRow } from './FileRow';
import { Hero } from './Hero';
import { Icon } from './Icon';
import { filesOf } from '@/lib/catalog';
import { nf } from '@/lib/format';
import { useLib } from '@/lib/library-context';
import type { Filter, Item } from '@/lib/types';

const FILTERS: { k: Filter; l: string }[] = [
  { k: 'all', l: 'الكل' },
  { k: 'audio', l: 'صوتيات' },
  { k: 'pdf', l: 'PDF' },
];

export function LibraryView() {
  const { tree, data, path, filter, setFilter, crumb, enter } = useLib();
  const cur = path[path.length - 1];

  if (!tree || !cur) {
    return (
      <>
        <Hero title="المكتبة" sub="تصفّح الأقسام والملفات" small />
        <div className="wrap">
          <EmptyCatalog />
        </div>
      </>
    );
  }

  const subs = cur.folders ?? [];
  const fs = (cur.files ?? [])
    .map((f) => data.by[f.id])
    .filter((f): f is Item => !!f && (filter === 'all' || f.kind === filter));

  return (
    <>
      <Hero title={path.length === 1 ? 'المكتبة' : cur.name} sub="تصفّح الأقسام والملفات" small />
      <div className="wrap">
        <div className="card-box relative -mt-[52px]">
          <nav aria-label="مسار التصفح" className="flex flex-wrap gap-1.5 text-sm text-mut">
            {path.map((n, i) => (
              <span key={i} className="flex gap-1.5">
                {i > 0 && <span>/</span>}
                {i < path.length - 1 ? (
                  <button type="button" onClick={() => crumb(i)} className="font-medium text-pri">
                    {i === 0 ? 'المكتبة' : n.name}
                  </button>
                ) : (
                  <b className="text-ink">{i === 0 ? 'المكتبة' : n.name}</b>
                )}
              </span>
            ))}
          </nav>
          <div className="mt-2.5 flex flex-wrap gap-2">
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
        </div>

        {subs.length > 0 && (
          <>
            <div className="h2">الأقسام</div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {subs.map((d) => (
                <button
                  key={d.id ?? d.name}
                  type="button"
                  onClick={() => enter(d)}
                  className="flex flex-col gap-2 rounded-3xl border border-line bg-card p-3.5 text-start shadow-lg shadow-black/5 transition hover:-translate-y-0.5 hover:border-brand-600"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-pri">
                    <Icon name="folder" />
                  </span>
                  <b className="text-[15px] leading-relaxed">{d.name}</b>
                  <small className="text-mut">{nf(filesOf(d, data.by).length)} ملفًا</small>
                </button>
              ))}
            </div>
          </>
        )}

        {fs.length > 0 && (
          <>
            <div className="h2">الملفات ({nf(fs.length)})</div>
            <div className="grid gap-2.5 md:grid-cols-2">
              {fs.map((f) => (
                <FileRow key={f.id} item={f} list={fs} />
              ))}
            </div>
          </>
        )}

        {subs.length === 0 && fs.length === 0 && (
          <div className="px-3 py-9 text-center text-mut">لا توجد ملفات مطابقة هنا.</div>
        )}
      </div>
    </>
  );
}
