'use client';

import { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sliders,
  Check,
} from 'lucide-react';
import { useLib } from '@/lib/library-context';
import islamicEventsData from '@/data/islamicEvents.json';

const HIJRI_MONTHS = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

export function HijriCalendarView() {
  const { prayerStatus, toast } = useLib();

  // Active view month & year (starts at current)
  const [viewMonth, setViewMonth] = useState<number>(prayerStatus.hijriMonth || 1);
  const [viewYear, setViewYear] = useState<number>(prayerStatus.hijriYear || 1448);
  const [showAdjustment, setShowAdjustment] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);

  const isCurrentMonth = viewMonth === prayerStatus.hijriMonth && viewYear === prayerStatus.hijriYear;
  const currentDay = prayerStatus.hijriDay;

  const nextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const prevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const resetToToday = () => {
    setViewMonth(prayerStatus.hijriMonth);
    setViewYear(prayerStatus.hijriYear);
    toast('تمت العودة للشهر الحالي');
  };

  // Month days count (Islamic months alternate 29 or 30 days)
  const daysInMonth = viewMonth % 2 === 1 ? 30 : 29;
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Filter events for the viewed month
  const monthEvents = islamicEventsData.filter((ev) => ev.hijriMonth === viewMonth);

  return (
    <div className="wrap space-y-6 pt-4 max-w-5xl mx-auto px-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-card p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-pri">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">التقويم الهجري الشامل والمناسبات</h2>
            <p className="text-xs text-mut">تقويم أم القرى المعتمد مع سنن الصيام والأيام الفاضلة</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAdjustment(!showAdjustment)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-mut hover:text-pri"
          >
            <Sliders className="h-3.5 w-3.5 text-gold" />
            <span>ضبط الرؤية</span>
          </button>
          {!isCurrentMonth && (
            <button
              type="button"
              onClick={resetToToday}
              className="inline-flex items-center gap-1 rounded-xl bg-brand-50 px-3 py-1.5 text-xs font-bold text-pri hover:bg-brand-100"
            >
              <RotateCcw className="h-3 w-3" />
              <span>اليوم</span>
            </button>
          )}
        </div>
      </div>

      {/* Moon Sighting Adjustment Drawer */}
      {showAdjustment && (
        <div className="rounded-2xl border border-gold/40 bg-card p-4 text-xs shadow-xs animate-in fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-ink">تعديل موافقة رؤية الهلال المحلية:</span>
            <span className="text-mut">الفارق الحالي: {offset > 0 ? `+${offset}` : offset} يوم</span>
          </div>
          <div className="flex items-center gap-2">
            {[-2, -1, 0, 1, 2].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => {
                  setOffset(val);
                  toast(val === 0 ? 'التقويم مطابق لتقويم أم القرى' : `تم تعديل الفارق بمقدار ${val} يوم`);
                }}
                className={`flex-1 rounded-xl border py-2 text-center font-mono font-bold transition-all ${
                  offset === val
                    ? 'border-brand-700 bg-brand-700 text-white'
                    : 'border-line bg-surface text-ink hover:border-gold'
                }`}
              >
                {val > 0 ? `+${val}` : val}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Hijri Date Banner */}
      <div className="relative overflow-hidden rounded-[28px] border border-gold/40 bg-gradient-to-br from-[#0F2D1F] via-[#163A29] to-[#0A1F15] p-6 text-white shadow-xl md:p-8">
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center justify-between w-full max-w-md mb-2">
            <button
              type="button"
              onClick={prevMonth}
              aria-label="الشهر السابق"
              className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <span className="rounded-full border border-gold/40 bg-black/20 px-4 py-1 text-xs font-bold text-gold">
              شهر {HIJRI_MONTHS[viewMonth - 1]} ({viewMonth} من 12)
            </span>

            <button
              type="button"
              onClick={nextMonth}
              aria-label="الشهر التالي"
              className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-2 font-mono text-6xl font-black text-amber-300 md:text-7xl">
            {isCurrentMonth ? currentDay : 1}
          </div>

          <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">
            {HIJRI_MONTHS[viewMonth - 1]} {viewYear} هـ
          </h1>

          <p className="mt-1.5 text-xs text-emerald-100/80">
            {isCurrentMonth
              ? `اليوم: ${prayerStatus.dateStr}`
              : `تصفح شهور السنة الهجرية ${viewYear} هـ`}
          </p>
        </div>
      </div>

      {/* Month Days Grid with Sunnah Highlights */}
      <div className="rounded-3xl border border-line bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between border-b border-line pb-4 mb-4 gap-2">
          <h3 className="text-sm font-bold text-ink">
            أيام شهر {HIJRI_MONTHS[viewMonth - 1]} ({viewYear} هـ) — {daysInMonth} يوماً
          </h3>
          <div className="flex items-center gap-3 text-[11px] text-mut">
            <span className="inline-flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-gold" />
              <span>صيام أيام البيض (13، 14، 15)</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-700" />
              <span>اليوم الحالي</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
          {daysArray.map((d) => {
            const isToday = isCurrentMonth && d === currentDay;
            const isWhiteDay = d === 13 || d === 14 || d === 15;
            const hasEvent = monthEvents.find((e) => e.hijriDay === d);

            return (
              <div
                key={d}
                className={`relative flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all ${
                  isToday
                    ? 'border-brand-700 bg-brand-700 text-white font-bold shadow-md'
                    : isWhiteDay
                    ? 'border-gold/80 bg-amber-500/10 text-gold-700 font-bold'
                    : 'border-line/70 bg-surface/40 text-ink hover:border-gold/40'
                }`}
              >
                <span className="text-base font-mono">{d}</span>
                {isToday && <span className="text-[10px] mt-0.5">اليوم</span>}
                {isWhiteDay && !isToday && <span className="text-[9px] mt-0.5">أيام البيض</span>}
                {hasEvent && !isToday && (
                  <span className="absolute top-1 end-1 h-2 w-2 rounded-full bg-emerald-500" title={hasEvent.name} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Islamic Events for This Month */}
      <div className="rounded-3xl border border-line bg-card p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-base font-bold text-ink mb-4">
          <Sparkles className="h-4 w-4 text-gold" />
          <span>المناسبات والمحطات الإسلامية في شهر {HIJRI_MONTHS[viewMonth - 1]}</span>
        </h3>

        {monthEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line p-6 text-center text-xs text-mut">
            لا توجد مناسبات رسمية مسجلة في هذا الشهر، ويستحب فيه عمارة الأيام بالصيام والذكر والعمل الصالح.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {monthEvents.map((ev) => (
              <div
                key={ev.id}
                className="flex flex-col justify-between rounded-2xl border border-gold/40 bg-amber-500/5 p-4 shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-surface px-2.5 py-0.5 font-mono text-[11px] font-bold text-pri border border-line">
                      {ev.hijriDay} {HIJRI_MONTHS[viewMonth - 1]}
                    </span>
                    <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-[#8A631E]">
                      محطة مباركة
                    </span>
                  </div>

                  <h4 className="mt-2.5 text-sm font-bold text-ink">{ev.name}</h4>
                  <p className="mt-1.5 text-xs text-mut leading-relaxed">{ev.description}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-line/40 text-[11px] text-pri font-medium">
                  <span className="font-bold">المستحب: </span>
                  <span>{ev.deeds}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
