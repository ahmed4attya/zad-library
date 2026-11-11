'use client';

import { useState, useEffect } from 'react';
import {
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle,
  X,
  Play,
  Sparkles,
  Sun,
  Moon,
  Clock,
  BookOpen,
} from 'lucide-react';
import {
  NotificationSettings,
  getNotificationSettings,
  saveNotificationSettings,
  getNotificationPermission,
  requestNotificationPermission,
  sendTestNotification,
} from '@/lib/notification-service';
import adhansData from '@/data/adhans.json';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPlayAdhan: (adhanId: string) => void;
  toast: (msg: string) => void;
}

export function NotificationSettingsModal({ isOpen, onClose, onPlayAdhan, toast }: Props) {
  const [settings, setSettings] = useState<NotificationSettings>(getNotificationSettings());
  const [perm, setPerm] = useState<NotificationPermission>('default');
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getNotificationSettings());
      setPerm(getNotificationPermission());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleMaster = async () => {
    if (!settings.enabled) {
      // Trying to enable
      if (perm !== 'granted') {
        const requested = await requestNotificationPermission();
        setPerm(requested);
        if (requested !== 'granted') {
          toast('تم رفض إذن الإشعارات من المتصفح. يُرجى تفعيلها من إعدادات المتصفح.');
          return;
        }
      }
      const updated = { ...settings, enabled: true };
      setSettings(updated);
      saveNotificationSettings(updated);
      toast('تم تفعيل التنبيهات والإشعارات بنجاح 🔔');
    } else {
      const updated = { ...settings, enabled: false };
      setSettings(updated);
      saveNotificationSettings(updated);
      toast('تم إيقاف التنبيهات');
    }
  };

  const updateSetting = <K extends keyof NotificationSettings>(
    key: K,
    val: NotificationSettings[K]
  ) => {
    const updated = { ...settings, [key]: val };
    setSettings(updated);
    saveNotificationSettings(updated);
  };

  const handleTest = async () => {
    setTesting(true);
    const res = await sendTestNotification(() => {
      if (settings.adhanSound) {
        onPlayAdhan(settings.selectedAdhanId);
      }
    });
    setTesting(false);
    toast(res.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-lg bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between bg-gradient-to-r from-[var(--emerald-900)] to-[var(--emerald-800)] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Bell className="w-5 h-5 text-[var(--gold-300)]" />
            </div>
            <div>
              <h3 className="font-bold text-lg font-cairo">إعدادات الأذان والتنبيهات</h3>
              <p className="text-xs text-white/70">تنبيهات مواقيت الصلاة والأذكار والسنن</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* Permission State Banner */}
          {perm === 'denied' && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-600 dark:text-amber-400">
                  الإشعارات محظورة في متصفحك
                </p>
                <p className="text-xs text-[var(--text-subtle)] mt-1">
                  لتلقي الأذان والأذكار، انقر على أيقونة القفل أو الإعدادات بجانب شريط العنوان في
                  المتصفح وفعّل خيار (الإشعارات).
                </p>
              </div>
            </div>
          )}

          {/* Master Toggle */}
          <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  settings.enabled
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-zinc-500/10 text-zinc-400'
                }`}
              >
                {settings.enabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-bold text-[var(--text-main)] font-cairo">
                  تفعيل الإشعارات والتنبيهات
                </div>
                <div className="text-xs text-[var(--text-subtle)]">
                  {settings.enabled ? 'التنبيهات مفعلة على هذا الجهاز' : 'التنبيهات متوقفة حالياً'}
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={handleToggleMaster}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-[-1.5rem] rtl:peer-checked:after:translate-x-[-1.5rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--emerald-600)]"></div>
            </label>
          </div>

          {settings.enabled && (
            <>
              {/* Adhan Sound & Voice Selector */}
              <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-subtle)] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {settings.adhanSound ? (
                      <Volume2 className="w-4 h-4 text-[var(--gold-500)]" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-zinc-400" />
                    )}
                    <span className="font-semibold text-[var(--text-main)]">
                      تشغيل صوت الأذان تلقائياً
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.adhanSound}
                      onChange={(e) => updateSetting('adhanSound', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-zinc-300 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-[-1.25rem] rtl:peer-checked:after:translate-x-[-1.25rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--emerald-600)]"></div>
                  </label>
                </div>

                {settings.adhanSound && (
                  <div>
                    <label className="text-xs text-[var(--text-subtle)] mb-1.5 block">
                      صوت المؤذن المعتمد:
                    </label>
                    <select
                      value={settings.selectedAdhanId}
                      onChange={(e) => updateSetting('selectedAdhanId', e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--emerald-500)]"
                    >
                      {adhansData.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Prayers To Notify */}
              <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center gap-2 font-semibold text-[var(--text-main)] mb-1">
                  <Clock className="w-4 h-4 text-[var(--emerald-600)]" />
                  <span>تنبيهات أوقات الصلوات الخمس:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'notifyFajr', label: 'الفجر' },
                    { id: 'notifyDhuhr', label: 'الظهر' },
                    { id: 'notifyAsr', label: 'العصر' },
                    { id: 'notifyMaghrib', label: 'المغرب' },
                    { id: 'notifyIsha', label: 'العشاء' },
                  ].map((p) => {
                    const active = (settings as any)[p.id];
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => updateSetting(p.id as any, !active)}
                        className={`p-2.5 rounded-xl border text-center transition-all flex items-center justify-between text-xs ${
                          active
                            ? 'bg-[var(--emerald-500)]/10 border-[var(--emerald-500)] text-[var(--emerald-700)] dark:text-[var(--emerald-300)] font-bold'
                            : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-subtle)] opacity-70'
                        }`}
                      >
                        <span>{p.label}</span>
                        {active && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--emerald-600)]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Daily Azkar & Reminders */}
              <div className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center gap-2 font-semibold text-[var(--text-main)] mb-1">
                  <Sparkles className="w-4 h-4 text-[var(--gold-500)]" />
                  <span>أذكار اليوم والليلة والسنن:</span>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      key: 'morningAzkar',
                      title: 'أذكار الصباح المباركة',
                      desc: 'تنبيه صباحي (بعد صلاة الفجر والشروق)',
                      icon: Sun,
                    },
                    {
                      key: 'eveningAzkar',
                      title: 'أذكار المساء وحصن المسلم',
                      desc: 'تنبيه مسائي (بعد صلاة العصر وقبل الغروب)',
                      icon: Moon,
                    },
                    {
                      key: 'sleepAzkar',
                      title: 'أذكار النوم وسورة الملك',
                      desc: 'تنبيه ليلي قبل النوم للحفظ والبركة',
                      icon: Moon,
                    },
                    {
                      key: 'fridayKahf',
                      title: 'سورة الكهف والصلاة على النبي ﷺ',
                      desc: 'تنبيه خاص كل يوم جمعة في الصباح',
                      icon: BookOpen,
                    },
                  ].map((item) => {
                    const active = (settings as any)[item.key];
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.key}
                        onClick={() => updateSetting(item.key as any, !active)}
                        className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-between cursor-pointer hover:border-[var(--emerald-500)] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[var(--emerald-500)]/10 text-[var(--emerald-600)] flex items-center justify-center">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-[var(--text-main)]">
                              {item.title}
                            </div>
                            <div className="text-[10px] text-[var(--text-subtle)]">{item.desc}</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => {}}
                          className="w-4 h-4 accent-[var(--emerald-600)]"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Test Notification Button */}
          <div className="pt-2">
            <button
              onClick={handleTest}
              disabled={testing}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[var(--emerald-700)] to-[var(--emerald-800)] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              <span>{testing ? 'جاري الإرسال...' : 'تجربة إشعار وصوت فوري الآن'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-panel)] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[var(--gold-500)] hover:bg-[var(--gold-600)] text-[var(--emerald-950)] font-bold text-sm transition-colors shadow-sm"
          >
            حفظ وإغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
