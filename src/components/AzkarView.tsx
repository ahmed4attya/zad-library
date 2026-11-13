'use client';

import { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Copy,
  Check,
  Share2,
  BookOpen,
  Sun,
  Moon,
  Shield,
  HeartHandshake,
} from 'lucide-react';
import { useLib } from '@/lib/library-context';
import azkarData from '@/data/azkar.json';

export function AzkarView() {
  const [selectedCategory, setSelectedCategory] = useState(azkarData[0].category);
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeCategory = azkarData.find((c) => c.category === selectedCategory) || azkarData[0];

  const handleTap = (id: string, initialCount: number) => {
    // Haptic vibration feedback if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(30);
      } catch {
        /* ignore */
      }
    }

    setItemCounts((prev) => {
      const current = prev[id] !== undefined ? prev[id] : initialCount;
      if (current <= 1) {
        return { ...prev, [id]: 0 };
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  const handleResetItem = (id: string, initialCount: number) => {
    setItemCounts((prev) => ({ ...prev, [id]: initialCount }));
  };

  const handleResetAll = () => {
    const next: Record<string, number> = { ...itemCounts };
    activeCategory.items.forEach((item) => {
      next[item.id] = item.count;
    });
    setItemCounts(next);
  };

  const copyDhikr = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'morning':
        return <Sun className="h-4 w-4 text-amber-500" />;
      case 'evening':
        return <Moon className="h-4 w-4 text-indigo-400" />;
      case 'after_prayer':
        return <Sparkles className="h-4 w-4 text-emerald-500" />;
      case 'sleep':
        return <Moon className="h-4 w-4 text-purple-400" />;
      case 'ruqyah':
        return <Shield className="h-4 w-4 text-cyan-500" />;
      case 'prophets':
      default:
        return <HeartHandshake className="h-4 w-4 text-rose-400" />;
    }
  };

  return (
    <div className="wrap space-y-6 pt-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-pri">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">الأذكار وحصن المسلم</h2>
            <p className="text-xs text-mut">{activeCategory.description}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetAll}
          className="btn gap-1.5 text-xs font-semibold hover:border-gold hover:text-pri"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>إعادة ضبط العدادات</span>
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {azkarData.map((cat) => {
          const isSelected = selectedCategory === cat.category;
          return (
            <button
              key={cat.category}
              type="button"
              onClick={() => setSelectedCategory(cat.category)}
              className={`flex flex-none items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-brand-700 text-white shadow-md'
                  : 'border border-line bg-card text-ink hover:border-gold/50'
              }`}
            >
              {getCategoryIcon(cat.category)}
              <span>{cat.title}</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${isSelected ? 'bg-white/20' : 'bg-surface text-mut'}`}>
                {cat.items.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dhikr Cards List */}
      <div className="space-y-4">
        {activeCategory.items.map((item, index) => {
          const remaining = itemCounts[item.id] !== undefined ? itemCounts[item.id] : item.count;
          const isCompleted = remaining === 0;

          return (
            <div
              key={item.id}
              className={`relative overflow-hidden rounded-3xl border p-5 transition-all shadow-sm md:p-6 ${
                isCompleted
                  ? 'border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : 'border-line bg-card hover:border-gold/50'
              }`}
            >
              {/* Top Meta info */}
              <div className="flex items-center justify-between border-b border-line/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-surface text-xs font-bold text-mut">
                    {index + 1}
                  </span>
                  <span className="text-xs font-bold text-pri">{item.reference}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyDhikr(item.id, item.text)}
                    title="نسخ الذكر"
                    className="grid h-8 w-8 place-items-center rounded-xl text-mut hover:bg-surface hover:text-ink"
                  >
                    {copiedId === item.id ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleResetItem(item.id, item.count)}
                    title="إعادة ضبط الذكر"
                    className="grid h-8 w-8 place-items-center rounded-xl text-mut hover:bg-surface hover:text-ink"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Main Arabic Text */}
              <div
                onClick={() => handleTap(item.id, item.count)}
                className="cursor-pointer py-4 select-none"
              >
                <p className="text-[17px] font-medium leading-[2.2] text-ink md:text-[19px]">
                  {item.text}
                </p>
              </div>

              {/* Virtue & Reward Box */}
              {item.reward && (
                <div className="rounded-xl border border-gold/20 bg-amber-500/5 p-3 text-xs leading-relaxed text-gold-700">
                  <span className="font-bold">الفضل: </span>
                  {item.reward}
                </div>
              )}

              {/* Counter Tap Button */}
              <div className="mt-4 flex items-center justify-between pt-2">
                <div className="text-xs text-mut">
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>تم بحمد الله</span>
                    </span>
                  ) : (
                    <span>المتبقي: {remaining} من {item.count}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleTap(item.id, item.count)}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-2.5 font-mono text-base font-extrabold shadow-md transition-transform active:scale-95 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-brand-700 text-white hover:bg-brand-800'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span>مكتمل</span>
                    </>
                  ) : (
                    <span>{remaining}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
