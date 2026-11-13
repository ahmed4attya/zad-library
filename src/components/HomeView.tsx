'use client';

import { Heart, Sparkles, BookOpen, Layers } from 'lucide-react';
import { EmptyCatalog } from './EmptyCatalog';
import { HomeHero } from './HomeHero';
import { MoreTile, Tile } from './Tile';
import { useLib } from '@/lib/library-context';

const MAX = 8;

export function HomeView() {
  const { tree, go } = useLib();
  const secs = tree?.folders ?? [];
  const shown = secs.length > MAX ? secs.slice(0, MAX) : secs;

  return (
    <div className="wrap space-y-8 pt-4">
      <HomeHero />

      {/* Waqf Endowment Banner */}
      <div className="rounded-2xl border border-gold/40 bg-gradient-to-r from-amber-500/10 via-card to-emerald-500/10 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold/20 text-gold-700">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ink md:text-sm">
              مكتبة إسلامية شاملة • وقف لله تعالى
            </h3>
            <p className="text-[11px] text-mut">
              مبنية على مكتبة Google Drive الوقفية بعد استئذان صاحب الوقف — نسأل الله أن يتقبلها صدقة جارية لكل من ساهم ونشر واستفاد
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => go('lib')}
          className="btn gap-1 text-xs font-bold text-pri hover:border-gold"
        >
          <span>تصفح الفهرس الكامل</span>
          <span>←</span>
        </button>
      </div>

      {/* Waqf Library Sections Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-gold" />
            <h2 className="text-sm font-bold text-ink">أقسام المكتبة الوقفية الشاملة</h2>
          </div>
          <button
            type="button"
            onClick={() => go('lib')}
            className="text-xs font-bold text-pri hover:underline"
          >
            عرض جميع الأقسام والملفات ←
          </button>
        </div>

        {!tree ? (
          <EmptyCatalog />
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {shown.map((n, i) => (
              <Tile key={n.id ?? n.name} node={n} index={i} />
            ))}
            {secs.length > MAX && <MoreTile onClick={() => go('lib')} />}
          </div>
        )}
      </div>
    </div>
  );
}
