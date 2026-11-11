'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Vibrate,
  Award,
  ChevronDown,
  Plus,
  Check,
} from 'lucide-react';

const PRESETS = [
  'سُبْحَانَ اللَّهِ',
  'الْحَمْدُ لِلَّهِ',
  'لَا إِلَهَ إِلَّا اللَّهُ',
  'اللَّهُ أَكْبَرُ',
  'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
  'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
  'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
  'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
];

const TARGETS = [33, 100, 1000, 0]; // 0 = unlimited

export function TasbeehView() {
  const [currentDhikr, setCurrentDhikr] = useState(PRESETS[0]);
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [target, setTarget] = useState(33);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [totalLifetime, setTotalLifetime] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  useEffect(() => {
    try {
      const savedTotal = localStorage.getItem('zad:tasbeeh_lifetime');
      if (savedTotal) setTotalLifetime(parseInt(savedTotal, 10) || 0);
    } catch {
      /* ignore */
    }
  }, []);

  const playClickSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      /* ignore */
    }
  };

  const handleIncrement = () => {
    if (vibrationEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {
        /* ignore */
      }
    }
    if (soundEnabled) {
      playClickSound();
    }

    setCount((prev) => {
      const next = prev + 1;
      if (target > 0 && next >= target) {
        setCycles((c) => c + 1);
        if (vibrationEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate([40, 60, 40]);
          } catch {
            /* ignore */
          }
        }
        return 0;
      }
      return next;
    });

    setTotalLifetime((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem('zad:tasbeeh_lifetime', String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const handleReset = () => {
    setCount(0);
    setCycles(0);
  };

  const progressPercent = target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 100;

  return (
    <div className="wrap space-y-6 pt-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-pri">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">السبحة الإلكترونية الذكية</h2>
            <p className="text-xs text-mut">ألا بذكر الله تطمئن القلوب</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setVibrationEnabled(!vibrationEnabled)}
            title="تفعيل/تعطيل الاهتزاز"
            className={`btn h-9 w-9 p-0 place-items-center ${vibrationEnabled ? 'border-gold text-pri' : 'text-mut'}`}
          >
            <Vibrate className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title="تفعيل/تعطيل صوت النقر"
            className={`btn h-9 w-9 p-0 place-items-center ${soundEnabled ? 'border-gold text-pri' : 'text-mut'}`}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={handleReset}
            title="إعادة ضبط العداد"
            className="btn gap-1 text-xs font-semibold hover:border-gold hover:text-pri"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>تصفير</span>
          </button>
        </div>
      </div>

      {/* Main Tasbeeh Device Card */}
      <div className="relative mx-auto max-w-lg overflow-hidden rounded-[36px] border border-gold/40 bg-gradient-to-br from-brand-900 via-brand-800 to-black p-6 text-white shadow-2xl md:p-10">
        <div className="pointer-events-none absolute -bottom-10 -end-10 h-60 w-60 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -top-10 -start-10 h-60 w-60 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Active Dhikr Selector */}
          <div className="w-full">
            <h3 className="font-serif text-2xl font-bold text-white md:text-3xl">
              {currentDhikr}
            </h3>
            {target > 0 && (
              <p className="mt-1 text-xs text-emerald-200/80">
                الهدف: {target} تسبيحة • الدورات المكتملة: {cycles}
              </p>
            )}
          </div>

          {/* Digital Counter Display */}
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-black/50 px-8 py-4 backdrop-blur shadow-inner">
            <span className="font-mono text-6xl font-black tracking-widest text-amber-300 md:text-7xl">
              {String(count).padStart(target > 0 && target <= 99 ? 2 : 3, '0')}
            </span>
            {target > 0 && (
              <div className="mt-2 h-1.5 w-36 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full bg-gold transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}
          </div>

          {/* Big Circular Tap Button */}
          <button
            type="button"
            onClick={handleIncrement}
            className="group relative my-8 h-44 w-44 rounded-full border-4 border-gold/60 bg-gradient-to-br from-emerald-600 to-brand-900 p-2 shadow-[0_0_35px_rgba(201,162,74,0.3)] transition-all active:scale-95 hover:border-gold hover:shadow-[0_0_50px_rgba(201,162,74,0.5)] flex items-center justify-center select-none"
          >
            <div className="h-full w-full rounded-full border-2 border-white/20 bg-brand-800/80 flex flex-col items-center justify-center text-white">
              <span className="text-xl font-black tracking-wider text-gold group-hover:scale-105 transition-transform">
                اضغط هنا
              </span>
              <span className="text-[11px] text-white/60 mt-1">للتسبيح</span>
            </div>
          </button>

          {/* Target options */}
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/30 p-1">
            {TARGETS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTarget(t);
                  setCount(0);
                }}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                  target === t ? 'bg-gold text-brand-900 shadow' : 'text-white/70 hover:text-white'
                }`}
              >
                {t === 0 ? 'مفتوح' : `${t}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lifetime Stats Card */}
      <div className="mx-auto max-w-lg rounded-2xl border border-line bg-card p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-gold-700">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink">مجموع التسبيحات الكلي</h4>
            <p className="text-[11px] text-mut">محفوظ على جهازك تلقائياً</p>
          </div>
        </div>
        <span className="font-mono text-xl font-extrabold text-pri">
          {totalLifetime.toLocaleString('ar-EG')}
        </span>
      </div>

      {/* Presets List */}
      <div className="mx-auto max-w-lg rounded-2xl border border-line bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-ink">اختر الذكر أو الورد</h3>
          <button
            type="button"
            onClick={() => setShowCustomModal(true)}
            className="inline-flex items-center gap-1 text-xs font-bold text-pri hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>ورد مخصص</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {PRESETS.map((p) => {
            const isSelected = currentDhikr === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setCurrentDhikr(p);
                  setCount(0);
                }}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-start transition-colors ${
                  isSelected
                    ? 'border border-gold bg-brand-50/60 font-bold text-pri'
                    : 'border border-line/60 hover:border-gold/50 text-ink'
                }`}
              >
                <span className="text-xs md:text-sm">{p}</span>
                {isSelected && <Check className="h-4 w-4 text-pri" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Dhikr Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-line bg-card p-6 shadow-2xl">
            <h3 className="text-base font-bold text-ink">إضافة ورد مخصص</h3>
            <p className="mt-1 text-xs text-mut">اكتب الذكر أو الدعاء الذي تود التسبيح به</p>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="مثال: حسبي الله ونعم الوكيل..."
              className="mt-4 w-full rounded-2xl border border-line bg-surface p-3 text-xs text-ink placeholder:text-mut focus:border-gold focus:outline-none"
            />
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (customInput.trim()) {
                    setCurrentDhikr(customInput.trim());
                    setCount(0);
                    setShowCustomModal(false);
                    setCustomInput('');
                  }
                }}
                className="flex-1 rounded-2xl bg-brand-700 py-2.5 text-xs font-bold text-white shadow hover:bg-brand-800"
              >
                اعتماد
              </button>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="rounded-2xl border border-line px-4 py-2.5 text-xs font-semibold text-mut hover:bg-surface hover:text-ink"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
