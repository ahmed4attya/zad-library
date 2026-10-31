'use client';

import { useState } from 'react';
import { MosqueArt, QuranArt } from './Art';
import { Icon } from './Icon';
import { useLib } from '@/lib/library-context';

export function HomeHero() {
  const { searchFor, openFile, go, st, data } = useLib();
  const [v, setV] = useState('');
  const last = st.last ? data.by[st.last] : undefined;

  return (
    <section
      className="relative overflow-hidden rounded-[28px] border border-[rgba(201,162,74,.45)] px-5 pb-8 pt-8 text-center sm:px-10 sm:pb-12 sm:pt-10"
      style={{ backgroundImage: 'linear-gradient(120deg, var(--hero-a), var(--hero-b))' }}
    >
      <MosqueArt className="pointer-events-none absolute bottom-0 end-0 w-[48%] max-w-[340px] opacity-[.14] sm:opacity-[.22]" />
      <QuranArt className="pointer-events-none absolute bottom-0 start-0 w-[34%] max-w-[250px] opacity-40 sm:opacity-100" />
      <div className="relative mx-auto max-w-[560px]">
        <h1 className="text-[22px] font-extrabold leading-snug text-pri sm:text-[28px]">
          مرحباً بك في مكتبة زاد المسلم
        </h1>
        <p className="mt-1.5 text-[13px] text-mut sm:text-sm">
          تصفح الكتب الإسلامية، واقرأ المراجع، واستمع إلى الدروس والمحاضرات من مكان واحد.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchFor(v);
          }}
          className="mx-auto mt-5 flex max-w-[480px] items-center rounded-full border border-line bg-card p-1.5 shadow-md shadow-black/5 focus-within:ring-2 focus-within:ring-gold"
        >
          <input
            type="text"
            inputMode="search"
            value={v}
            onChange={(e) => setV(e.target.value)}
            placeholder="ابحث عن كتاب أو مؤلف أو محاضرة..."
            aria-label="بحث"
            className="min-w-0 flex-1 bg-transparent px-4 py-2 text-[15px] text-ink outline-none placeholder:text-mut"
          />
          <button
            type="submit"
            aria-label="بحث"
            className="grid h-10 w-10 flex-none place-items-center rounded-full bg-brand-700 text-white"
          >
            <Icon name="search" className="h-5 w-5" />
          </button>
        </form>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => go('lib')}
            className="rounded-full bg-brand-700 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-black/10"
          >
            تصفح المكتبة
          </button>
          <button
            type="button"
            disabled={!last}
            title={last ? undefined : 'لا يوجد ملف سابق بعد'}
            onClick={() => last && openFile(last, [last])}
            className="rounded-full bg-brand-800 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-black/10 disabled:opacity-50"
          >
            تابع القراءة
          </button>
        </div>
      </div>
    </section>
  );
}
