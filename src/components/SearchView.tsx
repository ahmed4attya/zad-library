'use client';

import { useMemo } from 'react';
import { EmptyCatalog } from './EmptyCatalog';
import { FileRow } from './FileRow';
import { Hero } from './Hero';
import { useLib } from '@/lib/library-context';

export function SearchView() {
  const { tree, data, q, setQ } = useLib();
  const res = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return null;
    return data.all.filter((f) => `${f.title} ${f.path.join(' ')}`.toLowerCase().includes(s)).slice(0, 100);
  }, [q, data]);

  return (
    <>
      <Hero title="بحث" sub="ابحث في أسماء كل الملفات" small />
      <div className="wrap">
        {!tree ? (
          <EmptyCatalog />
        ) : (
          <>
            <input
              type="search"
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="اكتب اسم محاضرة أو كتاب أو قارئ"
              aria-label="بحث"
              className="relative -mt-[52px] w-full rounded-full border border-line bg-card px-5 py-[15px] text-ink shadow-lg shadow-black/5"
            />
            <div className="mt-[18px] grid gap-2.5 md:grid-cols-2">
              {res === null && <div className="col-span-full py-9 text-center text-mut">ابدأ بكتابة كلمة للبحث.</div>}
              {res?.length === 0 && (
                <div className="col-span-full py-9 text-center text-mut">لا توجد نتائج لهذه الكلمة.</div>
              )}
              {res?.map((f) => <FileRow key={f.id} item={f} list={res} sub={f.path.join(' / ')} />)}
            </div>
          </>
        )}
      </div>
    </>
  );
}
