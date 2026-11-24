'use client';

import { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Clock,
  Sparkles,
  Maximize2,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Heart,
  Volume2,
  Lock,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { useLib } from '@/lib/library-context';
import {
  getNotificationSettings,
  saveNotificationSettings,
  requestNotificationPermission,
  NotificationSettings,
} from '@/lib/notification-service';

export function WaqfaView() {
  const { startWaqfa, prayerStatus, toast, go } = useLib();
  const [settings, setSettings] = useState<NotificationSettings>(getNotificationSettings());
  const [selectedDuration, setSelectedDuration] = useState<number>(settings.waqfaDuration || 15);
  const [notifGranted, setNotifGranted] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifGranted(Notification.permission === 'granted');
    }
  }, []);

  const handleDurationChange = (dur: number) => {
    setSelectedDuration(dur);
    const updated = { ...settings, waqfaDuration: dur };
    setSettings(updated);
    saveNotificationSettings(updated);
    toast(`تم ضبط مدة استراحة الصلاة إلى ${dur} دقيقة`);
  };

  const handleToggleAutoLock = () => {
    const updated = { ...settings, waqfaAutoLock: !settings.waqfaAutoLock };
    setSettings(updated);
    saveNotificationSettings(updated);
    toast(updated.waqfaAutoLock ? 'تم تفعيل وضع وقفة التلقائي عند كل صلاة' : 'تم تعطيل القفل التلقائي');
  };

  const handleTogglePreAlert = () => {
    const updated = { ...settings, waqfaPreAlert: !settings.waqfaPreAlert };
    setSettings(updated);
    saveNotificationSettings(updated);
    toast(updated.waqfaPreAlert ? 'تم تفعيل التنبيه المسبق قبل الصلاة بـ 5 دقائق' : 'تم تعطيل التنبيه المسبق');
  };

  const handleEnableNotifications = async () => {
    const perm = await requestNotificationPermission();
    const isGranted = perm === 'granted';
    setNotifGranted(isGranted);
    if (isGranted) {
      const updated = { ...settings, enabled: true };
      setSettings(updated);
      saveNotificationSettings(updated);
      toast('تم تفعيل كافة الإشعارات الإجبارية بنجاح 🔔');
    } else {
      toast('يرجى السماح بالإشعارات من إعدادات المتصفح');
    }
  };

  const handleStartWaqfaNow = () => {
    const prayerName = prayerStatus?.nextPrayer?.name || 'الصلاة';
    startWaqfa(prayerName, selectedDuration);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-6 font-cairo">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 p-6 text-white shadow-xl sm:p-10 border border-emerald-700/40">
        <div className="absolute -left-12 -top-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-4 py-1 text-xs font-bold text-amber-300 border border-amber-400/30">
              <ShieldAlert className="h-4 w-4" />
              مستوحى من أداة "وقفة — صلاتك أولاً"
            </div>
            <h1 className="text-3xl font-extrabold sm:text-4xl text-amber-300 font-amiri tracking-wide">
              وَقْفَة — صلاتك أولاً
            </h1>
            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-xl">
              وضع كامل الشاشة الإجباري عند دخول وقت الصلاة لحجب كل المشتتات، ترك الهاتف، وإعانة نفسك على إدراك تكبيرة الإحرام في المسجد.
            </p>
          </div>

          <div className="flex flex-col gap-3 shrink-0">
            <button
              onClick={handleStartWaqfaNow}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-4 text-base font-bold text-emerald-950 shadow-lg hover:from-amber-300 hover:to-amber-400 active:scale-95 transition-all"
            >
              <Maximize2 className="h-5 w-5" />
              بدء وضع وقفة الآن (شاشة كاملة)
            </button>
            <div className="text-center text-xs text-amber-200/80 flex items-center justify-center gap-1">
              <Lock className="h-3.5 w-3.5" />
              قفل إجباري لمدة دقيقة لمنع التراجع الفوري
            </div>
          </div>
        </div>
      </div>

      {/* Compulsory Notifications Callout */}
      {!notifGranted && (
        <div className="rounded-2xl border-2 border-amber-500/40 bg-amber-500/10 p-5 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-800 dark:text-amber-300">
                  تفعيل الإشعارات الإجبارية للتطبيق
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-400/90 mt-1">
                  لتتمكن خاصية "وقفة" من إيقاظ هاتفك وإظهار شاشة الصلاة عند دخول الأذان مباشرة حتى عند إغلاق التطبيق.
                </p>
              </div>
            </div>
            <button
              onClick={handleEnableNotifications}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-emerald-950 hover:bg-amber-400 shrink-0 shadow-md transition-colors"
            >
              <Bell className="h-4 w-4" />
              تفعيل الإشعارات الآن
            </button>
          </div>
        </div>
      )}

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Settings Card 1: Automation */}
        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">التشغيل التلقائي لوقفة</h2>
              <p className="text-xs text-muted-foreground">التحكم في استجابة التطبيق لمواعيد الصلاة</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/40 hover:bg-secondary/60 cursor-pointer transition-colors border border-border/40">
              <div className="space-y-0.5 pr-2">
                <span className="text-sm font-bold">القفل التلقائي عند الأذان</span>
                <p className="text-xs text-muted-foreground">
                  فتح الشاشة الكاملة لوقفة إجبارياً بمجرد دخول وقت أي صلاة
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.waqfaAutoLock}
                onChange={handleToggleAutoLock}
                className="h-5 w-5 rounded border-emerald-500 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/40 hover:bg-secondary/60 cursor-pointer transition-colors border border-border/40">
              <div className="space-y-0.5 pr-2">
                <span className="text-sm font-bold">تنبيه مسبق قبل الصلاة بـ 5 دقائق</span>
                <p className="text-xs text-muted-foreground">
                  إشعار مبكر للوضوء والاستعداد للذهاب إلى المسجد
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.waqfaPreAlert}
                onChange={handleTogglePreAlert}
                className="h-5 w-5 rounded border-emerald-500 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
              />
            </label>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <span>
                عند تفعيل القفل، يتم تشغيل صوت الأذان المختار تلقائياً، وتنشيط منع إغلاق الشاشة (Wake Lock).
              </span>
            </div>
          </div>
        </div>

        {/* Settings Card 2: Duration & Rules */}
        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">مدة استراحة الصلاة</h2>
              <p className="text-xs text-muted-foreground">الوقت المخصص للصلاة وأذكار ما بعد الصلاة</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-4 gap-2">
              {[10, 15, 20, 30].map((dur) => (
                <button
                  key={dur}
                  onClick={() => handleDurationChange(dur)}
                  className={`flex flex-col items-center justify-center rounded-2xl py-3 px-2 border text-center transition-all ${
                    selectedDuration === dur
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-md'
                      : 'border-border/60 bg-secondary/30 hover:bg-secondary/60 text-foreground'
                  }`}
                >
                  <span className="text-base font-extrabold">{dur}</span>
                  <span className="text-[11px] opacity-80">دقيقة</span>
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-border/50 bg-secondary/30 p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Lock className="h-4 w-4 text-amber-500" />
                آلية حماية التراجع (60 ثانية إجبارية):
              </div>
              <p className="text-muted-foreground leading-relaxed">
                في أول دقيقة من تفعيل وضع وقفة، يتم قفل زر الخروج كلياً لمنع عادة إغلاق التنبيه التلقائي باليد، مما يمنح عقلك فرصة للتوقف وترك الهاتف والتوجّه للوضوء.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Spiritual Philosophy & Hadith */}
      <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-transparent p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
          <Heart className="h-4 w-4" />
          لماذا طوّرنا وضع "وقفة"؟
        </div>
        <blockquote className="border-r-4 border-amber-500 pr-4 text-base sm:text-lg font-amiri text-foreground leading-relaxed italic">
          «عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ ﷺ يَقُولُ: إِنَّ أَوَّلَ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلَاتُهُ، فَإِنْ صَلَحَتْ فَقَدْ أَفْلَحَ وَأَنْجَحَ، وَإِنْ فَسَدَتْ فَقَدْ خَابَ وَخَسِرَ»
        </blockquote>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-background/60 border border-border/40">
            <Smartphone className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm">كسر إدمان الهاتف</div>
              <p className="text-xs text-muted-foreground mt-1">
                إيقاف الإشعارات والمكالمات والتطبيقات لحظة دخول الأذان.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-background/60 border border-border/40">
            <Flame className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm">إدراك تكبيرة الإحرام</div>
              <p className="text-xs text-muted-foreground mt-1">
                التنبيه المبكر يوفر وقت الوضوء والمشي للمسجد بسكينة.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-background/60 border border-border/40">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm">استراحة روحانية</div>
              <p className="text-xs text-muted-foreground mt-1">
                شاشة خضراء هادئة مع أذكار الأذان ودعاء ما بعد الصلاة.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <button
          onClick={() => go('prayer')}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-600 transition-colors"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          العودة إلى مواقيت الصلاة
        </button>

        <button
          onClick={handleStartWaqfaNow}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow hover:bg-emerald-700 transition-colors"
        >
          <Maximize2 className="h-4 w-4" />
          اختبار وضع وقفة (شاشة كاملة)
        </button>
      </div>
    </div>
  );
}
