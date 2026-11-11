'use client';

import { useState } from 'react';
import {
  Clock,
  Compass,
  MapPin,
  Volume2,
  VolumeX,
  Play,
  Square,
  Settings,
  ChevronDown,
  Navigation,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Sparkles,
  Bell,
} from 'lucide-react';
import { useLib } from '@/lib/library-context';
import { CALC_METHODS, CityInfo } from '@/lib/prayer-service';
import citiesData from '@/data/cities.json';
import adhansData from '@/data/adhans.json';

export function PrayerTimesView() {
  const {
    prayerStatus,
    city,
    setCity,
    calcMethod,
    setCalcMethod,
    madhab,
    setMadhab,
    detectLocation,
    playAdhan,
    stopAdhan,
    activeAdhanAudio,
    openNotifModal,
    go,
  } = useLib();

  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [selectedAdhanId, setSelectedAdhanId] = useState(adhansData[0].id);

  const filteredCities = (citiesData as CityInfo[]).filter(
    (c) =>
      c.name.includes(citySearch) ||
      c.country.includes(citySearch) ||
      c.id.toLowerCase().includes(citySearch.toLowerCase())
  );

  const formatCountdown = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getPrayerIcon = (key: string) => {
    switch (key) {
      case 'fajr':
        return <Sunrise className="h-6 w-6 text-amber-500" />;
      case 'sunrise':
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'dhuhr':
        return <Sun className="h-6 w-6 text-amber-400" />;
      case 'asr':
        return <Sunset className="h-6 w-6 text-orange-500" />;
      case 'maghrib':
        return <Sunset className="h-6 w-6 text-rose-500" />;
      case 'isha':
      default:
        return <Moon className="h-6 w-6 text-indigo-400" />;
    }
  };

  return (
    <div className="wrap space-y-6 pt-4">
      {/* Top Bar: Location & Dates */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-pri">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-ink">{city.name}</h2>
              <span className="text-xs text-mut">({city.country})</span>
            </div>
            <p className="text-xs text-mut">{prayerStatus.hijriStr} • {prayerStatus.dateStr}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={detectLocation}
            title="تحديد الموقع التلقائي (GPS)"
            className="btn gap-1.5 text-xs font-semibold hover:border-gold hover:text-pri"
          >
            <Navigation className="h-3.5 w-3.5" />
            <span>موقعي الحالي</span>
          </button>
          <button
            type="button"
            onClick={() => setShowCityPicker(true)}
            className="btn gap-1.5 text-xs font-semibold hover:border-gold hover:text-pri"
          >
            <span>تغيير المدينة</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={openNotifModal}
            aria-label="إعدادات وتنبيهات الأذان"
            className="btn h-9 px-3 gap-1.5 place-items-center text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
            title="تفعيل إشعارات الأذان"
          >
            <Bell className="h-4 w-4 text-[var(--gold-500)]" />
            <span className="hidden sm:inline">تنبيهات الأذان</span>
          </button>
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            aria-label="إعدادات الحساب"
            className="btn h-9 w-9 p-0 place-items-center"
          >
            <Settings className="h-4 w-4 text-mut hover:text-pri" />
          </button>
        </div>
      </div>

      {/* Main Hero Card: Next Prayer & Countdown */}
      <div className="relative overflow-hidden rounded-[28px] border border-gold/40 bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 p-6 text-white shadow-xl md:p-8">
        <div className="pointer-events-none absolute -bottom-10 -end-10 h-48 w-48 rounded-full bg-gold/15 blur-2xl" />
        <div className="pointer-events-none absolute -top-10 -start-10 h-48 w-48 rounded-full bg-emerald-400/10 blur-2xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black/20 px-4 py-1 text-xs text-gold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>الصلاة القادمة: {prayerStatus.nextPrayer?.name}</span>
          </div>

          <div className="mt-4 font-mono text-5xl font-black tracking-wider text-white md:text-6xl">
            {formatCountdown(prayerStatus.timeRemainingSeconds)}
          </div>
          <p className="mt-2 text-xs text-emerald-100/80 md:text-sm">
            المتبقي حتى أذان {prayerStatus.nextPrayer?.name} ({prayerStatus.nextPrayer?.formatted})
          </p>

          {/* Progress bar */}
          <div className="mt-6 w-full max-w-md">
            <div className="flex justify-between text-[11px] text-emerald-200/70">
              <span>الصلاة الحالية: {prayerStatus.currentPrayer?.name}</span>
              <span>{prayerStatus.progressPercent}%</span>
              <span>{prayerStatus.nextPrayer?.name}</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-black/30">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold to-amber-300 transition-all duration-1000"
                style={{ width: `${prayerStatus.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Quick Action Buttons inside Hero */}
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                if (activeAdhanAudio) {
                  stopAdhan();
                } else {
                  playAdhan(selectedAdhanId);
                }
              }}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-xs font-bold text-brand-900 shadow-md transition-transform hover:scale-105"
            >
              {activeAdhanAudio ? (
                <>
                  <Square className="h-4 w-4 fill-current" />
                  <span>إيقاف الأذان</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4" />
                  <span>سماع الأذان الآن</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => go('qibla')}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-bold text-white backdrop-blur hover:bg-white/20"
            >
              <Compass className="h-4 w-4 text-gold" />
              <span>اتجاه القبلة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Today's Prayers Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {prayerStatus.entries.map((prayer) => {
          const isNext = prayer.isNext;
          const isCurrent = prayer.isCurrent;

          return (
            <div
              key={prayer.key}
              className={`relative flex flex-col items-center justify-between rounded-2xl border p-4 text-center transition-all ${
                isNext
                  ? 'border-gold bg-gradient-to-b from-amber-500/10 to-transparent shadow-md ring-2 ring-gold/40'
                  : isCurrent
                  ? 'border-brand-600 bg-brand-50/60'
                  : 'border-line bg-card hover:border-gold/30'
              }`}
            >
              {isNext && (
                <span className="absolute -top-2.5 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-brand-900">
                  القادمة
                </span>
              )}
              {isCurrent && !isNext && (
                <span className="absolute -top-2.5 rounded-full bg-brand-700 px-2 py-0.5 text-[10px] font-bold text-white">
                  الحالية
                </span>
              )}

              <div className="my-1">{getPrayerIcon(prayer.key)}</div>
              <h3 className="mt-1 text-sm font-bold text-ink">{prayer.name}</h3>
              <p className="mt-2 text-base font-extrabold text-pri">{prayer.formatted}</p>
            </div>
          );
        })}
      </div>

      {/* Sunnah & Islamic Times Card */}
      <div className="rounded-2xl border border-line bg-card p-5 shadow-sm">
        <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
          <Clock className="h-4 w-4 text-gold" />
          <span>أوقات مستحبة وقيام الليل</span>
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-line/60 bg-surface/50 p-3 text-center">
            <span className="text-xs text-mut">الإمساك</span>
            <p className="mt-1 text-sm font-bold text-pri">{prayerStatus.additional.imsak}</p>
            <span className="text-[10px] text-mut">قبل الفجر بـ 10 دقائق</span>
          </div>
          <div className="rounded-xl border border-line/60 bg-surface/50 p-3 text-center">
            <span className="text-xs text-mut">صلاة الضحى</span>
            <p className="mt-1 text-sm font-bold text-pri">{prayerStatus.additional.duha}</p>
            <span className="text-[10px] text-mut">صلاة الأوابين</span>
          </div>
          <div className="rounded-xl border border-line/60 bg-surface/50 p-3 text-center">
            <span className="text-xs text-mut">منتصف الليل الشرعي</span>
            <p className="mt-1 text-sm font-bold text-pri">{prayerStatus.additional.midnight}</p>
            <span className="text-[10px] text-mut">نهاية وقت العشاء الاختياري</span>
          </div>
          <div className="rounded-xl border border-line/60 bg-surface/50 p-3 text-center">
            <span className="text-xs text-mut">ثلث الليل الأخير</span>
            <p className="mt-1 text-sm font-bold text-gold-700">{prayerStatus.additional.lastThird}</p>
            <span className="text-[10px] text-mut">وقت النزول الإلهي واستجابة الدعاء</span>
          </div>
        </div>
      </div>

      {/* Adhan Sound Selection Section */}
      <div className="rounded-2xl border border-line bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-ink">
              <Volume2 className="h-5 w-5 text-gold" />
              <span>أصوات كبار المؤذنين (مكتبة الأذان الوقفية)</span>
            </h3>
            <p className="mt-0.5 text-xs text-mut">
              استمع لأشهر أصوات الأذان المسجلة لكبار القراء والمؤذنين المحفوظة بالوقف
            </p>
          </div>

          {activeAdhanAudio && (
            <button
              type="button"
              onClick={stopAdhan}
              className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-4 py-1.5 text-xs font-bold text-white shadow"
            >
              <Square className="h-3.5 w-3.5" />
              <span>إيقاف التشغيل</span>
            </button>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {adhansData.map((adhan) => {
            const isPlaying = activeAdhanAudio?.id === adhan.id;
            const isSelected = selectedAdhanId === adhan.id;

            return (
              <div
                key={adhan.id}
                className={`flex items-center justify-between rounded-xl border p-3 transition-colors ${
                  isPlaying
                    ? 'border-gold bg-amber-500/10'
                    : isSelected
                    ? 'border-brand-600 bg-brand-50/50'
                    : 'border-line hover:border-gold/40'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-xs font-bold text-ink">{adhan.name}</h4>
                  <p className="truncate text-[11px] text-mut">{adhan.muadhin}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAdhanId(adhan.id);
                      if (isPlaying) {
                        stopAdhan();
                      } else {
                        playAdhan(adhan.id);
                      }
                    }}
                    aria-label={isPlaying ? 'إيقاف' : 'تشغيل'}
                    className={`grid h-8 w-8 place-items-center rounded-full text-white transition-transform hover:scale-105 ${
                      isPlaying ? 'bg-rose-600' : 'bg-brand-700'
                    }`}
                  >
                    {isPlaying ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ms-0.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dua After Adhan Card */}
      <div className="rounded-2xl border border-gold/30 bg-gradient-to-r from-amber-500/5 via-card to-emerald-500/5 p-5 text-center">
        <h4 className="text-xs font-bold text-gold-700">دعاء ما بعد الأذان</h4>
        <p className="mt-2 text-sm font-medium leading-relaxed text-ink">
          «اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّداً الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَاماً مَحْمُوداً الَّذِي وَعَدْتَهُ، [إِنَّكَ لَا تُخْلِفُ الْمِيعَادَ]»
        </p>
        <p className="mt-1 text-[11px] text-mut">قال النبي ﷺ: «حلت له شفاعتي يوم القيامة» (رواه البخاري)</p>
      </div>

      {/* Settings Modal/Collapsible */}
      {showSettings && (
        <div className="rounded-2xl border border-line bg-card p-5 shadow-sm">
          <h3 className="text-sm font-bold text-ink">إعدادات حساب مواقيت الصلاة</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-mut">طريقة الحساب الفلكي</label>
              <select
                value={calcMethod}
                onChange={(e) => setCalcMethod(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-line bg-surface p-2.5 text-xs text-ink focus:border-gold focus:outline-none"
              >
                {CALC_METHODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-mut">مذهب صلاة العصر</label>
              <div className="mt-1.5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setMadhab('shafi')}
                  className={`flex-1 rounded-xl border p-2 text-xs font-medium ${
                    madhab === 'shafi'
                      ? 'border-brand-700 bg-brand-700 text-white'
                      : 'border-line text-ink hover:border-gold'
                  }`}
                >
                  الجمهور (الشافعي والمالكي والحنبلي)
                </button>
                <button
                  type="button"
                  onClick={() => setMadhab('hanafi')}
                  className={`flex-1 rounded-xl border p-2 text-xs font-medium ${
                    madhab === 'hanafi'
                      ? 'border-brand-700 bg-brand-700 text-white'
                      : 'border-line text-ink hover:border-gold'
                  }`}
                >
                  المذهب الحنفي (ظل الشيء مثليه)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* City Picker Modal */}
      {showCityPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-3xl border border-line bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-line p-4">
              <h3 className="text-base font-bold text-ink">اختر المدينة</h3>
              <button
                type="button"
                onClick={() => setShowCityPicker(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-mut hover:bg-surface hover:text-ink"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              <input
                type="text"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                placeholder="ابحث باسم المدينة أو الدولة..."
                className="w-full rounded-2xl border border-line bg-surface px-4 py-2.5 text-xs text-ink placeholder:text-mut focus:border-gold focus:outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <div className="grid grid-cols-1 gap-1.5">
                {filteredCities.map((c) => {
                  const isSelected = city.id === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setCity(c);
                        setShowCityPicker(false);
                      }}
                      className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-start transition-colors ${
                        isSelected
                          ? 'bg-brand-50 font-bold text-pri'
                          : 'hover:bg-surface text-ink'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gold" />
                        <span className="text-xs">{c.name}</span>
                      </div>
                      <span className="text-[11px] text-mut">{c.country}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
