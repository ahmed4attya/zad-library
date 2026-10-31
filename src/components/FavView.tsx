'use client';

import { FileRow } from './FileRow';
import { Hero } from './Hero';
import { useLib } from '@/lib/library-context';

export function FavView() {
  const { data, st } = useLib();
  const r = data.all.filter((f) => st.fav[f.id]);
  return (
    <>
      <Hero title="مفضلتي" sub="ملفاتك التي تعود إليها دائمًا" variant="gold" small />
      <div className="wrap">
        {r.length === 0 ? (
          <div className="card-box relative -mt-[52px] py-9 text-center text-mut">
            لم تضف شيئًا بعد. اضغط النجمة بجانب أي ملف لتجده هنا.
          </div>
        ) : (
          <div className="relative -mt-[52px] grid gap-2.5 md:grid-cols-2">
            {r.map((f) => (
              <FileRow key={f.id} item={f} list={r} sub={f.path.join(' / ')} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
