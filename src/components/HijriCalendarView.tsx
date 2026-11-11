'use client';

import { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Sparkles,
  Clock,
  Heart,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Info,
} from 'lucide-react';
import { useLib } from '@/lib/library-context';
import islamicEventsData from '@/data/islamicEvents.json';

export function HijriCalendarView() {
  const { prayerStatus } = useLib();

  // Find upcoming event
  const currentMonth = prayerStatus.hijriMonth;
  const currentDay = prayerStatus.hijriDay;

  // Days in current Hijri month (roughly 29 or 30 days)
  const totalDays = 30;
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className="wrap space-y-6 pt-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-pri">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">التقويم الهجري والمناسبات الإسلامية</h2>
            <p className="text-xs text-mut">متابعة الشهور القمرية والأيام الفاضلة وسنن الصيام</p>
          </div>
        </div>

        <div className="text-end">
          <span className="font-mono text-xs font-bold text-pri">{prayerStatus.hijriStr}</span>
          <p className="text-[11px] text-mut">{prayerStatus.dateStr}</p>
        </div>
      </div>

      {/* Main Hijri Date Card */}
      <div className="relative overflow-hidden rounded-[28px] border border-gold/40 bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 p-6 text-white shadow-xl md:p-8">
        <div className="relative z-10 flex flex-col items-center text-center">
          <span className="rounded-full border border-gold/40 bg-black/20 px-4 py-1 text-xs text-gold">
            اليوم الحالي
          </span>
          <div className="mt-4 font-mono text-6xl font-black text-amber-300 md:text-7xl">
            {prayerStatus.hijriDay}
          </div>
          <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">
            شهر {prayerStatus.hijriMonthName} {prayerStatus.hijriYear} هـ
          </h1>
          <p className="mt-1 text-xs text-emerald-100/80">الموافق: {prayerStatus.dateStr}</p>
        </div>
      </div>

      {/* Month Days Grid with Sunnah highlights */}
      <div className="rounded-3xl border border-line bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
          <h3 className="text-sm font-bold text-ink">
            أيام شهر {prayerStatus.hijriMonthName} ({prayerStatus.hijriYear} هـ)
          </h3>
          <div className="flex items-center gap-2 text-[11px] text-mut">
            <span className="inline-flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-gold" />
              <span>صيام أيام البيض (13، 14، 15)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
          {daysArray.map((d) => {
            const isToday = d === currentDay;
            const isWhiteDay = d === 13 || d === 14 || d === 15;

            return (
              <div
                key={d}
                className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all ${
                  isToday
                    ? 'border-brand-700 bg-brand-700 text-white font-bold shadow-md'
                    : isWhiteDay
                    ? 'border-gold bg-amber-500/10 text-gold-700 font-bold'
                    : 'border-line/70 bg-surface/40 text-ink hover:border-gold/40'
                }`}
              >
                <span className="text-base font-mono">{d}</span>
                {isToday && <span className="text-[10px] mt-0.5">اليوم</span>}
                {isWhiteDay && !isToday && <span className="text-[9px] mt-0.5">أيام البيض</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Islamic Events & Occasions List */}
      <div className="rounded-3xl border border-line bg-card p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-base font-bold text-ink mb-4">
          <Sparkles className="h-4 w-4 text-gold" />
          <span>المناسبات والمحطات الإسلامية المباركة</span>
        </h3>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {islamicEventsData.map((ev) => {
            const isCurrentMonth = ev.hijriMonth === currentMonth;

            return (
              <div
                key={ev.id}
                className={`flex flex-col justify-between rounded-2xl border p-4 transition-all ${
                  isCurrentMonth
                    ? 'border-gold bg-amber-500/5 shadow-sm'
                    : 'border-line bg-surface/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-surface px-2.5 py-0.5 font-mono text-[11px] font-bold text-pri border border-line">
                      {ev.hijriDay} {ev.monthName}
                    </span>
                    {isCurrentMonth && (
                      <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-brand-900">
                        هذا الشهر
                      </span>
                    )}
                  </div>

                  <h4 className="mt-2.5 text-sm font-bold text-ink">{ev.name}</h4>
                  <p className="mt-1.5 text-xs text-mut leading-relaxed">{ev.description}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-line/40 text-[11px] text-pri font-medium">
                  <span className="font-bold">المستحب: </span>
                  <span>{ev.deeds}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
