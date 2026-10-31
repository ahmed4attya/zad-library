'use client';

import { useMemo } from 'react';
import { EmptyCatalog } from './EmptyCatalog';
import { FileRow } from './FileRow';
import { PageHead } from './PageHead';
import { SearchBox } from './SearchBox';
import { useLib } from '@/lib/library-context';

export function SearchView() {
  const { tree, data, q, setQ } = useLib();
  const res = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return null;
    return data.all.filter((f) => `${f.title} ${f.path.join(' ')}`.toLowerCase().includes(s)).slice(0, 100);
  }, [q, data]);

  return (
    <div className="wrap mx-auto max-w-[820px] space-y-3 pt-4">
      <PageHead title="بحث" sub="ابحث في أسماء كل الملفات والأقسام" icon="search" />
      {!tree ? (
        <EmptyCatalog />
      ) : (
        <>
          <SearchBox value={q} onChange={setQ} placeholder="ابحث عن كتاب أو مؤلف أو محاضرة..." autoFocus />
          <div className="grid gap-2.5">
            {res === null && <div className="py-9 text-center text-mut">ابدأ بكتابة كلمة للبحث.</div>}
            {res?.length === 0 && <div className="py-9 text-center text-mut">لا توجد نتائج لهذه الكلمة.</div>}
            {res?.map((f) => <FileRow key={f.id} item={f} list={res} sub={f.path.join(' / ')} />)}
          </div>
        </>
      )}
    </div>
  );
}
