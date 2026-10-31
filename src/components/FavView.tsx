'use client';

import { FileRow } from './FileRow';
import { PageHead } from './PageHead';
import { useLib } from '@/lib/library-context';

export function FavView() {
  const { data, st } = useLib();
  const r = data.all.filter((f) => st.fav[f.id]);
  return (
    <div className="wrap mx-auto max-w-[820px] space-y-3 pt-4">
      <PageHead title="المحفوظات" sub="لحفظ ما يهمك" icon="bookmark" />
      {r.length === 0 ? (
        <div className="card-box py-9 text-center text-mut">
          لم تحفظ شيئًا بعد. اضغط أيقونة الإشارة بجانب أي ملف لتجده هنا.
        </div>
      ) : (
        <div className="grid gap-2.5">
          {r.map((f) => (
            <FileRow key={f.id} item={f} list={r} sub={f.path.join(' / ')} />
          ))}
        </div>
      )}
    </div>
  );
}
