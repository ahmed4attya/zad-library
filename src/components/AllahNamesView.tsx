'use client';

import { useState, useMemo } from 'react';
import { Sparkles, Search, BookOpen, Heart, Copy, Check } from 'lucide-react';
import allahNames from '@/data/allahNames.json';

interface Props {
  toast: (msg: string) => void;
}

export function AllahNamesView({ toast }: Props) {
  const [q, setQ] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!q.trim()) return allahNames;
    const term = q.trim().toLowerCase();
    return allahNames.filter(
      (n) => n.name.includes(term) || n.meaning.includes(term) || String(n.id) === term
    );
  }, [q]);

  const dailyName = useMemo(() => {
    // Deterministic daily name based on day of year
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const index = dayOfYear % allahNames.length;
    return allahNames[index] || allahNames[0];
  }, []);

  const handleCopy = (name: string, meaning: string, id: number) => {
    const text = `﴿ ${name} ﴾\n${meaning}\n— من أسماء الله الحسنى (زاد المسلم)`;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast(`تم نسخ اسم الله (${name}) مع معناه`);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[var(--emerald-900)] via-[var(--emerald-850)] to-[var(--emerald-800)] text-white relative overflow-hidden shadow-xl border border-[var(--emerald-700)]/30">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[var(--gold-300)] text-xs font-semibold backdrop-blur-md mb-3 border border-white/15">
            <Sparkles className="w-3.5 h-3.5" />
            <span>وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-cairo text-white mb-2">
            أسماء الله الحسنى الـ 99
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            قال رسول الله ﷺ: «إنَّ لِلَّهِ تِسْعَةً وتِسْعِينَ اسْمًا، مِائَةً إلَّا واحِدًا، مَن أحْصَاهَا دَخَلَ الجَنَّةَ». تدبّر معانيها وادعُ بها في سجودك وصلاتك.
          </p>
        </div>
      </div>

      {/* Daily Name Highlight Card */}
      <div className="p-5 md:p-6 rounded-3xl bg-[var(--bg-card)] border-2 border-[var(--gold-500)]/40 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[var(--gold-600)] dark:text-[var(--gold-400)] flex items-center gap-1.5 uppercase">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            اسم اليوم للتدبر والدعاء
          </span>
          <span className="text-xs text-[var(--text-subtle)] font-mono">#{dailyName.id}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-3xl md:text-4xl font-amiri font-bold text-[var(--emerald-800)] dark:text-[var(--gold-300)] mb-1">
              ﴿ {dailyName.name} ﴾
            </div>
            <p className="text-sm text-[var(--text-main)] leading-relaxed">
              {dailyName.meaning}
            </p>
          </div>
          <button
            onClick={() => handleCopy(dailyName.name, dailyName.meaning, dailyName.id)}
            className="self-start md:self-center shrink-0 px-4 py-2 rounded-xl bg-[var(--gold-500)]/15 hover:bg-[var(--gold-500)]/25 text-[var(--gold-700)] dark:text-[var(--gold-300)] text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            {copiedId === dailyName.id ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>تم النسخ</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>مشاركة وتدبر</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)] pointer-events-none" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث في أسماء الله الحسنى أو المعاني..."
          className="w-full pr-11 pl-4 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-main)] placeholder-[var(--text-subtle)] text-sm focus:outline-none focus:border-[var(--emerald-500)] shadow-sm"
        />
        {q && (
          <button
            onClick={() => setQ('')}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-subtle)] hover:text-[var(--text-main)] px-2 py-1 rounded"
          >
            مسح
          </button>
        )}
      </div>

      {/* Names Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {filtered.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedId(isSelected ? null : item.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                isSelected
                  ? 'bg-[var(--emerald-900)] text-white border-[var(--gold-500)] shadow-lg scale-[1.02]'
                  : 'bg-[var(--bg-card)] border-[var(--border-subtle)] hover:border-[var(--emerald-500)]/50 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-[var(--text-subtle)] mb-2 group-hover:text-[var(--gold-500)]">
                <span className="font-mono">#{item.id}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(item.name, item.meaning, item.id);
                  }}
                  className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  title="نسخ"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-[var(--text-subtle)]" />
                  )}
                </button>
              </div>

              <div className="text-center py-2">
                <div
                  className={`text-2xl md:text-3xl font-amiri font-bold transition-colors ${
                    isSelected
                      ? 'text-[var(--gold-300)]'
                      : 'text-[var(--text-main)] group-hover:text-[var(--emerald-600)] dark:group-hover:text-[var(--gold-400)]'
                  }`}
                >
                  {item.name}
                </div>
              </div>

              <p
                className={`text-xs mt-2 line-clamp-2 text-center transition-colors ${
                  isSelected ? 'text-white/90' : 'text-[var(--text-subtle)]'
                }`}
              >
                {item.meaning}
              </p>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[var(--text-subtle)]">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-bold">لم نجد أي اسم مطابق لبحثك</p>
        </div>
      )}
    </div>
  );
}
