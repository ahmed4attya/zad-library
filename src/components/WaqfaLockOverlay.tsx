'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Clock,
  Sparkles,
  Heart,
  AlertCircle,
  CheckCircle2,
  X,
  Compass,
} from 'lucide-react';
import { useLib } from '@/lib/library-context';

interface Props {
  isOpen?: boolean;
  prayerName: string;
  durationMinutes?: number;
  onDismiss: () => void;
}

export function WaqfaLockOverlay({
  isOpen = true,
  prayerName,
  durationMinutes = 15,
  onDismiss,
}: Props) {
  const { playAdhan, stopAdhan, activeAdhanAudio, toast, go } = useLib();

  // 60-second lock timer to compel user to leave the phone
  const [secondsUntilUnlock, setSecondsUntilUnlock] = useState(60);
  const [breakSecondsLeft, setBreakSecondsLeft] = useState(durationMinutes * 60);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundPlaying, setSoundPlaying] = useState(true);
  const [showDua, setShowDua] = useState(false);
  const [temporaryPass, setTemporaryPass] = useState(false);
  const wakeLockRef = useRef<any>(null);

  // Initialize and reset timers when opened
  useEffect(() => {
    if (!isOpen) {
      if (wakeLockRef.current) {
        try {
          wakeLockRef.current.release();
        } catch {}
        wakeLockRef.current = null;
      }
      return;
    }

    setSecondsUntilUnlock(60);
    setBreakSecondsLeft(durationMinutes * 60);
    setTemporaryPass(false);

    // Vibrate phone with solemn pattern
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([300, 150, 300, 150, 500]);
      } catch {}
    }

    // Attempt Fullscreen
    if (typeof document !== 'undefined') {
      const docEl = document.documentElement as any;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
        setIsFullscreen(true);
      }
    }

    // Keep screen awake
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      (navigator as any).wakeLock
        .request('screen')
        .then((lock: any) => {
          wakeLockRef.current = lock;
        })
        .catch(() => {});
    }

    // Timers
    const interval = setInterval(() => {
      setSecondsUntilUnlock((prev) => (prev > 0 ? prev - 1 : 0));
      setBreakSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, durationMinutes]);

  if (!isOpen) return null;

  const toggleFullscreen = () => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleTemporaryPass = () => {
    if (secondsUntilUnlock > 0) return;
    setTemporaryPass(true);
    toast('تم فتح شاشة الهاتف مؤقتًا لدقيقتين للضرورة ⏳');
    onDismiss();
  };

  const handleCompletePrayer = () => {
    if (secondsUntilUnlock > 0) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    toast('تقبل الله طاعتكم وصالح أعمالكم 🤲');
    onDismiss();
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const isLocked = secondsUntilUnlock > 0;

  return (
    <div
      className="fixed inset-0 z-[999999] flex flex-col justify-between p-6 sm:p-10 select-none overflow-y-auto animate-fadeIn text-white"
      style={{
        background: 'radial-gradient(ellipse at top, #143d2f 0%, #0c261d 55%, #061510 100%)',
      }}
      dir="rtl"
    >
      {/* Background Decorative Islamic Geometry */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[radial-gradient(#e8d9a4_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="pointer-events-none absolute -top-40 -end-40 w-96 h-96 rounded-full bg-[var(--gold-500)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -start-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Top Header Bar */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2b6a54] to-[#143d2f] border border-[#e8d9a4]/40 flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 48 48" className="w-7 h-7" fill="none" stroke="#e8d9a4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M24 6v6M12 40V28a12 12 0 0 1 24 0v12M8 40h32M18 40v-8a6 6 0 0 1 12 0v8" />
            </svg>
          </div>
          <div>
            <div className="font-extrabold text-xl font-cairo text-[#e8d9a4] tracking-wide">
              وَقْفَة
            </div>
            <div className="text-[11px] text-emerald-200/70 font-medium">
              صَلَاتُكَ أَوَّلًا • الشُّغْلُ يَسْتَنَّى
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => {
              if (activeAdhanAudio) {
                stopAdhan();
                setSoundPlaying(false);
              } else {
                playAdhan('makkah');
                setSoundPlaying(true);
              }
            }}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10 text-[#e8d9a4]"
            title={activeAdhanAudio ? 'إيقاف الصوت' : 'تشغيل الأذان'}
          >
            {activeAdhanAudio ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-white/50" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10 text-white/80"
            title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Center Main Stage */}
      <div className="relative z-10 my-auto text-center py-6 max-w-xl mx-auto space-y-6">
        {/* Glowing Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-[#e8d9a4]/30 backdrop-blur-md shadow-inner text-[#e8d9a4] text-xs sm:text-sm font-bold animate-pulse">
          <Sparkles className="w-4 h-4 text-[#e8d9a4]" />
          <span>حَانَ الآنَ مَوْعِدُ صَلَاةِ {prayerName.toUpperCase()}</span>
        </div>

        {/* Big Spiritual Heading */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black font-cairo text-white leading-tight drop-shadow-md">
            اترك الهاتف.. أقبل على ربك
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/80 max-w-md mx-auto leading-relaxed">
            «الشغل يستنى، وركعة بين يدي خالقك خيرٌ من الدنيا وما فيها».
          </p>
        </div>

        {/* Big Prayer Break Countdown Card */}
        <div className="p-6 rounded-3xl bg-[#0b2119]/80 border border-[#e8d9a4]/30 shadow-2xl backdrop-blur-md max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-between text-xs text-emerald-200/70 border-b border-white/10 pb-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#e8d9a4]" />
              استراحة الصلاة المقترحة
            </span>
            <span className="font-mono text-[#e8d9a4] font-bold">{durationMinutes} دقيقة</span>
          </div>

          <div className="font-mono text-5xl sm:text-6xl font-black text-[#e8d9a4] tracking-wider py-1 drop-shadow-lg">
            {formatTimer(breakSecondsLeft)}
          </div>

          <p className="text-[11px] text-emerald-200/60">
            الوقت التقديري لإسباغ الوضوء وأداء الفريضة وسننها وأذكارها
          </p>
        </div>

        {/* Quranic Verse */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center font-amiri text-lg text-emerald-100/90 leading-relaxed shadow-sm">
          ﴿ حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ ﴾
        </div>

        {/* Dua After Adhan Toggle */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowDua(!showDua)}
            className="text-xs text-[#e8d9a4] hover:underline inline-flex items-center gap-1.5 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 transition-colors"
          >
            <span>{showDua ? 'إخفاء دعاء ما بعد الأذان' : 'عرض دعاء ما بعد الأذان المستجاب 🤲'}</span>
          </button>

          {showDua && (
            <div className="mt-3 p-4 rounded-2xl bg-[#0c261d] border border-[#e8d9a4]/30 text-xs text-emerald-100 text-center space-y-1.5 animate-fadeIn font-amiri text-base leading-relaxed">
              <div className="font-bold text-[#e8d9a4] text-xs font-cairo">دعاء ما بعد الأذان:</div>
              <div>«اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ»</div>
              <div className="text-[11px] text-white/50 font-cairo">تحل لك به شفاعة الحبيب المصطفى ﷺ يوم القيامة</div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Mandatory 60-Second Cooldown & Exit Panel */}
      <div className="relative z-10 w-full max-w-xl mx-auto pt-4 border-t border-white/10 space-y-3">
        {/* Lockout status indicator */}
        <div className="flex items-center justify-center gap-2 text-xs">
          {isLocked ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 font-bold animate-pulse">
              <Lock className="w-4 h-4 text-rose-400" />
              <span>إغلاق إجباري: الخروج متاح بعد ({secondsUntilUnlock} ثانية)</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
              <Unlock className="w-4 h-4 text-emerald-400" />
              <span>انقضت الدقيقة الإجبارية.. متاح الخروج للضرورة</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Emergency Temporary Pass Button */}
          <button
            type="button"
            disabled={isLocked}
            onClick={handleTemporaryPass}
            className={`py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              isLocked
                ? 'bg-white/5 text-white/30 border border-white/5 cursor-not-allowed opacity-50'
                : 'bg-white/10 hover:bg-white/20 text-[#e8d9a4] border border-[#e8d9a4]/30 shadow-md active:scale-95'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>فتح مؤقت لدقيقتين (للضرورة)</span>
          </button>

          {/* Complete Prayer Button */}
          <button
            type="button"
            disabled={isLocked}
            onClick={handleCompletePrayer}
            className={`py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              isLocked
                ? 'bg-white/5 text-white/30 border border-white/5 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-[#e8d9a4] to-[#cfc6a8] text-[#17372c] font-black shadow-lg hover:brightness-105 active:scale-95'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>أتممت الصلاة بحمد الله (إنهاء وقفة)</span>
          </button>
        </div>

        <p className="text-[11px] text-center text-emerald-200/50">
          تم تصميم وضع وقفة لإعانتك على طرد التسويف وترك الهاتف في سبيل الله وقت الصلاة.
        </p>
      </div>
    </div>
  );
}
