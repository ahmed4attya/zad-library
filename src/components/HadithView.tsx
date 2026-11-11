'use client';

import { useState } from 'react';
import {
  BookOpen,
  Search,
  Copy,
  Check,
  Share2,
  Sparkles,
  ArrowRight,
  BookMarked,
  Scroll,
} from 'lucide-react';
import nawawiData from '@/data/nawawi40.json';

export function HadithView() {
  const [search, setSearch] = useState('');
  const [selectedHadithNum, setSelectedHadithNum] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Daily Hadith based on day of year
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
  );
  const dailyHadith = nawawiData[dayOfYear % nawawiData.length];

  const selectedHadith = selectedHadithNum
    ? nawawiData.find((h) => h.number === selectedHadithNum)
    : null;

  const filtered = nawawiData.filter(
    (h) =>
      h.title.includes(search) ||
      h.narrator.includes(search) ||
      h.text.includes(search) ||
      String(h.number) === search.trim()
  );

  const copyHadith = (h: (typeof nawawiData)[0]) => {
    const textToCopy = `«${h.title}»\nعن ${h.narrator}:\n${h.text}\n\n[الأربعون النووية - حديث رقم ${h.number}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(h.number);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="wrap space-y-6 pt-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-pri">
            <Scroll className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">الأحاديث النبوية الشريفة</h2>
            <p className="text-xs text-mut">الأربعون النووية للإمام النووي رحمه الله مع الشرح والفوائد</p>
          </div>
        </div>

        {selectedHadith && (
          <button
            type="button"
            onClick={() => setSelectedHadithNum(null)}
            className="btn gap-1 text-xs font-semibold hover:border-gold hover:text-pri"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            <span>فهرس الأحاديث</span>
          </button>
        )}
      </div>

      {/* SINGLE HADITH DETAIL VIEW */}
      {selectedHadith ? (
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-[28px] border border-gold/40 bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 p-6 text-white shadow-xl md:p-8">
            <div className="relative z-10 flex flex-col items-center text-center">
              <span className="rounded-full border border-gold/40 bg-black/20 px-4 py-1 text-xs text-gold">
                الحديث رقم {selectedHadith.number}
              </span>
              <h1 className="mt-3 text-2xl font-extrabold text-white md:text-3xl">
                {selectedHadith.title}
              </h1>
              <p className="mt-2 text-xs text-emerald-100/90">
                رواه {selectedHadith.narrator}
              </p>
            </div>
          </div>

          {/* Matn Card */}
          <div className="rounded-3xl border border-line bg-card p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="text-xs font-bold text-gold-700">نص الحديث الشريف</span>
              <button
                type="button"
                onClick={() => copyHadith(selectedHadith)}
                className="btn gap-1 text-xs font-semibold hover:border-gold hover:text-pri"
              >
                {copiedId === selectedHadith.number ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>نسخ الحديث</span>
                  </>
                )}
              </button>
            </div>

            <p className="mt-6 font-serif text-[18px] leading-[2.4] text-ink md:text-[21px]">
              {selectedHadith.text}
            </p>
          </div>

          {/* Explanation & Lessons Card */}
          <div className="rounded-3xl border border-line bg-surface/70 p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-pri">
              <Sparkles className="h-4 w-4 text-gold" />
              <span>الشرح والفوائد المستفادة</span>
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-ink md:text-sm">
              {selectedHadith.explanation}
            </p>
          </div>
        </div>
      ) : (
        /* HADITH LIST & DAILY HADITH */
        <div className="space-y-6">
          {/* Daily Hadith Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-r from-amber-500/10 via-card to-emerald-500/10 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-xs font-bold text-gold-700">
                <Sparkles className="h-3.5 w-3.5" />
                <span>حديث اليوم</span>
              </span>
              <span className="text-[11px] text-mut">عن {dailyHadith.narrator}</span>
            </div>

            <h3 className="mt-3 text-base font-bold text-ink">«{dailyHadith.title}»</h3>
            <p className="mt-2 text-xs leading-relaxed text-ink/90 line-clamp-3">
              {dailyHadith.text}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedHadithNum(dailyHadith.number)}
                className="text-xs font-bold text-pri hover:underline"
              >
                قراءة الحديث كاملاً مع الشرح ←
              </button>
              <button
                type="button"
                onClick={() => copyHadith(dailyHadith)}
                className="grid h-8 w-8 place-items-center rounded-xl text-mut hover:bg-surface hover:text-ink"
                title="نسخ"
              >
                {copiedId === dailyHadith.number ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mut" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث برقم الحديث، العنوان، أو الراوي..."
              className="w-full rounded-2xl border border-line bg-card py-2.5 pe-4 ps-10 text-xs text-ink placeholder:text-mut focus:border-gold focus:outline-none"
            />
          </div>

          {/* Hadiths Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filtered.map((hadith) => (
              <button
                key={hadith.number}
                type="button"
                onClick={() => setSelectedHadithNum(hadith.number)}
                className="group flex flex-col justify-between rounded-2xl border border-line bg-card p-4 text-start shadow-sm transition-all hover:border-gold hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-surface font-mono text-xs font-bold text-pri group-hover:bg-brand-50">
                      {hadith.number}
                    </span>
                    <span className="text-[11px] text-mut truncate max-w-[180px]">
                      {hadith.narrator}
                    </span>
                  </div>
                  <h4 className="mt-2.5 text-sm font-bold text-ink group-hover:text-pri">
                    {hadith.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-mut line-clamp-2 leading-relaxed">
                    {hadith.text}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-line/40 flex items-center justify-between text-[11px] text-pri font-medium">
                  <span>عرض الشرح والفوائد</span>
                  <span>←</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
