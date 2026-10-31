'use client';

import { EmptyCatalog } from './EmptyCatalog';
import { FileRow } from './FileRow';
import { Hero } from './Hero';
import { ModeCard } from './ModeCard';
import { Icon } from './Icon';
import { Ring } from './Ring';
import { dayKey, greet, nf, streak } from '@/lib/format';
import { useLib } from '@/lib/library-context';

export function HomeView() {
  const { tree, data, st, setGoal } = useLib();
  const secs = tree?.folders ?? [];
  const done = st.days[dayKey(new Date())] ?? 0;
  const goal = st.goal;
  const last = st.last ? data.by[st.last] : undefined;

  return (
    <>
      <Hero
        title={`${greet()} في مكتبة زاد المسلم`}
        sub="استمع واقرأ وتابع وِردك كل يوم."
        chips={
          tree
            ? [`${nf(secs.length)} أقسام`, `${nf(data.all.length)} ملفًا`, `سلسلتك ${nf(streak(st.days))} يوم`]
            : []
        }
      />
      <div className="wrap">
        {!tree ? (
          <EmptyCatalog />
        ) : (
          <>
            <div className="card-box relative -mt-[52px] flex items-center gap-4">
              <Ring p={done / goal} label={`${nf(done)}/${nf(goal)}`} />
              <div className="flex-1">
                <b>هدف اليوم</b>
                <div className="text-mut">
                  {done >= goal ? 'أتممت هدفك اليوم، بارك الله فيك.' : `أنجزت ${nf(done)} من ${nf(goal)} ملفات`}
                </div>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {[1, 3, 5, 10].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setGoal(n)}
                      className={`chip ${n === goal ? 'chip-on' : ''}`}
                    >
                      {nf(n)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {last && (
              <>
                <div className="h2">تابع من حيث توقفت</div>
                <div className="grid gap-2.5">
                  <FileRow item={last} list={[last]} sub={last.path.join(' / ')} />
                </div>
              </>
            )}

            <div className="h2">أقسام المكتبة</div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {secs.map((n, i) => (
                <ModeCard key={n.id ?? n.name} node={n} index={i} />
              ))}
              <div className="flex cursor-default flex-col gap-2 rounded-3xl border-2 border-dashed border-sand-200 p-3.5 opacity-70">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-pri">
                  <Icon name="star" />
                </span>
                <b className="text-[15px]">الوِرد اليومي</b>
                <small className="text-mut">جدول قراءة واستماع مخصص لك.</small>
                <span className="self-start rounded-full bg-sand px-2.5 text-[11px] font-semibold text-gold-700">
                  قريبًا
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
