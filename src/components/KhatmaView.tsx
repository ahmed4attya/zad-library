'use client';

import { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Calendar,
  Layers,
  ChevronLeft,
  Award,
  BookmarkCheck,
} from 'lucide-react';
import { useLib } from '@/lib/library-context';

interface KhatmaState {
  planDays: number;
  currentDay: number;
  startDate: string;
  completedDays: Record<number, boolean>;
}

const STORAGE_KEY = 'zad_khatma_tracker_v1';

export function KhatmaView() {
  const { toast } = useLib();

  const [state, setState] = useState<KhatmaState>({
    planDays: 30,
    currentDay: 1,
    startDate: new Date().toISOString(),
    completedDays: {},
  });

  const [showDua, setShowDua] = useState<boolean>(false);

  // Load from local storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setState(JSON.parse(raw));
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Save changes
  const save = (next: KhatmaState) => {
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const setPlan = (days: number) => {
    const next: KhatmaState = {
      planDays: days,
      currentDay: 1,
      startDate: new Date().toISOString(),
      completedDays: {},
    };
    save(next);
    toast(`تم اختيار خطة ختم القرآن خلال ${days} يوماً بنجاح`);
  };

  const toggleDay = (dayNum: number) => {
    const nextCompleted = { ...state.completedDays, [dayNum]: !state.completedDays[dayNum] };
    const next: KhatmaState = {
      ...state,
      completedDays: nextCompleted,
    };
    save(next);
    if (nextCompleted[dayNum]) {
      toast(`بارك الله فيك! أتممت قراءة ورد اليوم ${dayNum}`);
    }
  };

  const resetKhatma = () => {
    const next: KhatmaState = {
      ...state,
      currentDay: 1,
      startDate: new Date().toISOString(),
      completedDays: {},
    };
    save(next);
    toast('تم إعادة ضبط تقدم الختمة للبدء من جديد');
  };

  // Calculations
  const completedCount = Object.values(state.completedDays).filter(Boolean).length;
  const progressPercent = Math.min(100, Math.round((completedCount / state.planDays) * 100));
  const pagesPerDay = Math.ceil(604 / state.planDays);

  return (
    <div className="wrap space-y-6 pt-4 max-w-4xl mx-auto px-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-card p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0F2D1F] text-gold">
            <BookmarkCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">مُتتبع الورد القرآني وخطط الختم</h2>
            <p className="text-xs text-mut">نظم قراءتك اليومية لكتاب الله وحقق ختمتك بسهولة ويسر</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowDua(!showDua)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gold/50 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-gold hover:bg-amber-500/20"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>دعاء ختم القرآن</span>
        </button>
      </div>

      {/* Main Khatma Banner */}
      <div className="relative overflow-hidden rounded-[28px] border border-gold/40 bg-gradient-to-br from-[#0F2D1F] via-[#163A29] to-[#0A1F15] p-6 text-white shadow-xl md:p-8">
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center justify-between w-full max-w-md mb-3">
            <span className="text-xs font-bold text-emerald-200">
              خطة {state.planDays} يوماً ({pagesPerDay} صفحة يومياً)
            </span>
            <button
              type="button"
              onClick={resetKhatma}
              className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] text-white hover:bg-white/20"
            >
              <RotateCcw className="h-3 w-3" />
              <span>بدء ختمة جديدة</span>
            </button>
          </div>

          <div className="font-mono text-6xl font-black text-amber-300 my-1 md:text-7xl">
            %{progressPercent}
          </div>

          <h3 className="text-lg font-bold text-white mt-1">
            أنجزت {completedCount} من {state.planDays} يوماً
          </h3>

          {/* Progress Bar */}
          <div className="w-full max-w-md bg-white/10 h-3 rounded-full mt-4 overflow-hidden border border-white/15">
            <div
              className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {progressPercent === 100 && (
            <div className="mt-4 p-3 rounded-xl bg-amber-400 text-[#0F2D1F] font-bold text-xs flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>هنيئاً لك! أتممت ختم كتاب الله كاملاً، تقبل الله طاعتك.</span>
            </div>
          )}
        </div>
      </div>

      {/* Plan Selection Buttons */}
      <div className="rounded-3xl border border-line bg-card p-6 shadow-sm">
        <h3 className="text-sm font-bold text-ink mb-3">اختر خطة الختم المناسبة لوقتك:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { days: 30, title: 'ختمة شهرية (٣٠ يوماً)', desc: 'جزء كامل يومياً (٢٠ صفحة) بعد كل صلاة ٤ صفحات' },
            { days: 15, title: 'ختمة مكثفة (١٥ يوماً)', desc: 'جزآن يومياً (٤٠ صفحة) للأوقات الفاضلة وشهر رمضان' },
            { days: 60, title: 'ختمة متأنية (٦٠ يوماً)', desc: 'نصف جزء يومياً (١٠ صفحات) تناسب أصحاب المشاغل' },
          ].map((plan) => (
            <button
              key={plan.days}
              type="button"
              onClick={() => setPlan(plan.days)}
              className={`p-4 rounded-2xl border text-start transition-all ${
                state.planDays === plan.days
                  ? 'border-gold bg-amber-500/10 shadow-xs'
                  : 'border-line bg-surface/40 hover:border-gold/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-pri">{plan.title}</span>
                {state.planDays === plan.days && (
                  <span className="h-2 w-2 rounded-full bg-gold" />
                )}
              </div>
              <p className="text-[11px] text-mut leading-relaxed">{plan.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Days Checklist */}
      <div className="rounded-3xl border border-line bg-card p-6 shadow-sm">
        <h3 className="text-sm font-bold text-ink mb-4">
          جدول الأوراد اليومية ({state.planDays} يوماً) — اضغط لتسجيل الإتمام:
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {Array.from({ length: state.planDays }, (_, i) => i + 1).map((d) => {
            const isDone = !!state.completedDays[d];
            const startPage = (d - 1) * pagesPerDay + 1;
            const endPage = Math.min(604, d * pagesPerDay);

            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleDay(d)}
                className={`p-3 rounded-2xl border text-start transition-all flex flex-col justify-between ${
                  isDone
                    ? 'border-emerald-600 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                    : 'border-line/70 bg-surface/40 text-ink hover:border-gold/60'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs">اليوم {d}</span>
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-line" />
                  )}
                </div>
                <div className="text-[10px] text-mut mt-2">
                  ص {startPage} - {endPage}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dua Modal / Section */}
      {showDua && (
        <div className="rounded-3xl border border-gold/50 bg-amber-500/5 p-6 shadow-md space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-gold/30 pb-3">
            <h3 className="text-base font-bold text-pri flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-gold" />
              <span>دعاء ختم القرآن الكريم المبارك</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowDua(false)}
              className="text-xs text-mut hover:text-ink"
            >
              إغلاق
            </button>
          </div>

          <div className="font-serif text-sm leading-loose text-ink space-y-3 p-4 rounded-2xl bg-card border border-line">
            <p>
              «اللَّهُمَّ ارْحَمْنِي بِالقُرْآنِ، وَاجْعَلْهُ لِي إِمَاماً وَنُوراً وَهُدًى وَرَحْمَةً، اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نَسِيتُ، وَعَلِّمْنِي مِنْهُ مَا جَهِلْتُ، وَارْزُقْنِي تِلاوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ، وَاجْعَلْهُ لِي حُجَّةً يَا رَبَّ العَالَمِينَ».
            </p>
            <p>
              «اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي، وَاجْعَلِ الحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ، وَاجْعَلِ المَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ».
            </p>
            <p>
              «اللَّهُمَّ اجْعَلْ خَيْرَ عُمْرِي آخِرَهُ، وَخَيْرَ عَمَلِي خَوَاتِيمَهُ، وَخَيْرَ أَيَّامِي يَوْمَ أَلْقَاكَ فِيهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ عِيشَةً هَنِيَّةً، وَمِيتَةً سَوِيَّةً، وَمَرَدّاً غَيْرَ مُخْزٍ وَلا فَاضِحٍ، اللَّهُمَّ آمِينَ».
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
