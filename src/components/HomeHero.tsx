'use client';

import { useState } from 'react';
import {
  Clock,
  Compass,
  BookOpen,
  Sparkles,
  Search,
  MapPin,
  Volume2,
  Calendar,
  Radio,
  Layers,
  Scroll,
  Coins,
  ChevronLeft,
  Heart,
} from 'lucide-react';
import { MosqueArt, QuranArt } from './Art';
import { useLib } from '@/lib/library-context';
import type { View } from '@/lib/types';

export function HomeHero() {
  const {
    searchFor,
    openFile,
    go,
    st,
    data,
    prayerStatus,
    city,
  } = useLib();
  const [v, setV] = useState('');
  const last = st.last ? data.by[st.last] : undefined;

  const formatCountdown = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const QUICK_ACTIONS: { key: View; label: string; desc: string; icon: typeof Clock; color: string }[] = [
    { key: 'prayer', label: 'مواقيت الصلاة', desc: 'الأذان والعد التنازلي الدقيق', icon: Clock, color: 'text-[#B88B35] bg-[#B88B35]/10' },
    { key: 'quran', label: 'القرآن الكريم', desc: 'المصحف المرتل وتلاوات القراء', icon: BookOpen, color: 'text-[#1F6E4C] bg-[#1F6E4C]/10' },
    { key: 'azkar', label: 'الأذكار وحصن المسلم', desc: 'أذكار الصباح والمساء والرقية', icon: Sparkles, color: 'text-[#2D7A5B] bg-[#2D7A5B]/10' },
    { key: 'qibla', label: 'بوصلة القبلة', desc: 'تحديد دقيق لاتجاه الكعبة المشرفة', icon: Compass, color: 'text-[#A07026] bg-[#A07026]/10' },
    { key: 'tasbeeh', label: 'السبحة الذكية', desc: 'عداد إلكتروني وتتبع الأوراد', icon: Layers, color: 'text-[#1E5E42] bg-[#1E5E42]/10' },
    { key: 'hadith', label: 'الأحاديث النبوية', desc: 'الأربعون النووية مع الشرح الفقهي', icon: Scroll, color: 'text-[#966E2E] bg-[#966E2E]/10' },
    { key: 'zakat', label: 'حاسبة الزكاة', desc: 'احتساب زكاة المال والذهب والأسهم', icon: Coins, color: 'text-[#B38734] bg-[#B38734]/10' },
    { key: 'calendar', label: 'التقويم الهجري', desc: 'المناسبات الشرعية وأيام البيض', icon: Calendar, color: 'text-[#256B4D] bg-[#256B4D]/10' },
    { key: 'names', label: 'أسماء الله الحسنى', desc: '99 اسماً جليلاً مع المعاني والتدبر', icon: Heart, color: 'text-[#A87B2C] bg-[#A87B2C]/10' },
    { key: 'radio', label: 'إذاعات القرآن الكريم', desc: 'بث إذاعي مباشر متواصل 24 ساعة', icon: Radio, color: 'text-[#194D35] bg-[#194D35]/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Greeting, Hijri Date, Next Prayer */}
      <section
        className="relative overflow-hidden rounded-[30px] border border-[rgba(201,162,74,.45)] p-6 shadow-sm md:p-8"
        style={{ backgroundImage: 'linear-gradient(135deg, var(--hero-a), var(--hero-b))' }}
      >
        <MosqueArt className="pointer-events-none absolute bottom-0 end-0 w-[45%] max-w-[320px] opacity-[.12] sm:opacity-[.20]" />
        <QuranArt className="pointer-events-none absolute bottom-0 start-0 w-[30%] max-w-[220px] opacity-30 sm:opacity-80" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card/70 px-4 py-1 text-xs text-pri backdrop-blur">
            <MapPin className="h-3.5 w-3.5 text-gold" />
            <span>{city.name}</span>
            <span>•</span>
            <span>{prayerStatus.hijriStr}</span>
          </div>

          <h1 className="mt-3 text-2xl font-extrabold text-pri sm:text-3xl md:text-4xl">
            زاد المسلم | تطبيقك ومكتبتك الإسلامية الشاملة
          </h1>
          <p className="mt-1.5 max-w-xl text-xs text-mut sm:text-sm">
            مواقيت الصلاة، الأذان، اتجاه القبلة، القرآن الكريم، الأذكار، والمكتبة الوقفية المكتملة لله تعالى.
          </p>

          {/* Next Prayer Countdown Card inside Hero */}
          <div className="mt-5 flex w-full max-w-md items-center justify-between rounded-2xl border border-gold/50 bg-card/90 p-3.5 shadow-md backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-gold-700">
                <Clock className="h-5 w-5" />
              </div>
              <div className="text-start">
                <span className="text-[11px] text-mut">الصلاة القادمة: {prayerStatus.nextPrayer?.name} ({prayerStatus.nextPrayer?.formatted})</span>
                <p className="font-mono text-base font-extrabold text-pri">
                  متبقي {formatCountdown(prayerStatus.timeRemainingSeconds)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => go('prayer')}
              className="inline-flex items-center gap-1 rounded-xl bg-brand-700 px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-brand-800"
            >
              <span>المواقيت</span>
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Search bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              searchFor(v);
            }}
            className="mt-5 flex w-full max-w-lg items-center rounded-full border border-line bg-card p-1.5 shadow-md shadow-black/5 focus-within:ring-2 focus-within:ring-gold"
          >
            <input
              type="text"
              inputMode="search"
              value={v}
              onChange={(e) => setV(e.target.value)}
              placeholder="ابحث في المكتبة، القرآن، الأذكار، أو المحاضرات..."
              aria-label="بحث"
              className="min-w-0 flex-1 bg-transparent px-4 py-2 text-xs text-ink outline-none placeholder:text-mut md:text-sm"
            />
            <button
              type="submit"
              aria-label="بحث"
              className="grid h-10 w-10 flex-none place-items-center rounded-full bg-brand-700 text-white hover:bg-brand-800 transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          {/* Action pills */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => go('lib')}
              className="rounded-full bg-brand-700 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-brand-800 transition-colors"
            >
              تصفح المكتبة الوقفية
            </button>
            <button
              type="button"
              onClick={() => go('quran')}
              className="rounded-full bg-gold px-5 py-2 text-xs font-bold text-brand-900 shadow-md hover:brightness-105 transition-all"
            >
              المصحف الشريف
            </button>
            {last && (
              <button
                type="button"
                onClick={() => openFile(last, [last])}
                className="rounded-full bg-brand-800 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-brand-900"
              >
                تابع القراءة / الاستماع
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Features Hubs Grid (المحاور الدينية الرئيسية) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold text-ink">المحاور الإسلامية المتكاملة</h2>
          <span className="text-[11px] text-mut">خدمات المسلم اليومية</span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {QUICK_ACTIONS.map((action) => {
            const IconComponent = action.icon;
            return (
              <button
                key={action.key}
                type="button"
                onClick={() => go(action.key)}
                className="group flex flex-col items-start justify-between rounded-2xl border border-line bg-card p-4 text-start shadow-sm transition-all hover:border-gold hover:shadow-md"
              >
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${action.color} group-hover:scale-105 transition-transform`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="mt-3">
                  <h3 className="text-xs font-bold text-ink group-hover:text-pri md:text-sm">
                    {action.label}
                  </h3>
                  <p className="mt-0.5 text-[10px] text-mut md:text-[11px]">
                    {action.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
