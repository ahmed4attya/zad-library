/**
 * Notification Service for Zad Al-Muslim
 * Handles browser & PWA notifications for Prayer Times (Adhan), Azkar, and Islamic Reminders.
 */

export interface NotificationSettings {
  enabled: boolean;
  adhanSound: boolean;
  selectedAdhanId: string;
  // Individual prayer alerts
  notifyFajr: boolean;
  notifyDhuhr: boolean;
  notifyAsr: boolean;
  notifyMaghrib: boolean;
  notifyIsha: boolean;
  // Azkar & Daily alerts
  morningAzkar: boolean;
  eveningAzkar: boolean;
  sleepAzkar: boolean;
  fridayKahf: boolean;
  dailyHadith: boolean;
}

const SETTINGS_KEY = 'zad_notification_settings_v1';
const HISTORY_KEY = 'zad_notification_history_v1';

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false,
  adhanSound: true,
  selectedAdhanId: 'makkah',
  notifyFajr: true,
  notifyDhuhr: true,
  notifyAsr: true,
  notifyMaghrib: true,
  notifyIsha: true,
  morningAzkar: true,
  eveningAzkar: true,
  sleepAzkar: true,
  fridayKahf: true,
  dailyHadith: true,
};

export function getNotificationSettings(): NotificationSettings {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_NOTIFICATION_SETTINGS;
    return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save notification settings:', err);
  }
}

export function getNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'denied';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'denied';
  try {
    const res = await Notification.requestPermission();
    if (res === 'granted') {
      const s = getNotificationSettings();
      saveNotificationSettings({ ...s, enabled: true });
    }
    return res;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return 'denied';
  }
}

function getTriggerHistory(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function markTriggered(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getTriggerHistory();
    history[key] = Date.now();
    // Keep history under 100 entries
    const keys = Object.keys(history);
    if (keys.length > 100) {
      delete history[keys[0]];
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {}
}

function wasTriggeredRecently(key: string, maxAgeMs = 15 * 60 * 1000): boolean {
  const history = getTriggerHistory();
  const timestamp = history[key];
  if (!timestamp) return false;
  return Date.now() - timestamp < maxAgeMs;
}

/**
 * Show a system notification via Service Worker (preferred for PWA) or standard Notification API
 */
export async function showIslamicNotification(
  title: string,
  options: {
    body: string;
    tag?: string;
    icon?: string;
    badge?: string;
    data?: { url?: string; view?: string };
    vibrate?: number[];
  }
): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission !== 'granted') return false;

  const notifOptions: NotificationOptions = {
    body: options.body,
    tag: options.tag || 'zad-general',
    icon: options.icon || '/icons/icon.svg',
    badge: options.badge || '/icons/icon.svg',
    dir: 'rtl',
    lang: 'ar',
    data: options.data || { url: '/' },
  };
  (notifOptions as any).vibrate = options.vibrate || [200, 100, 200, 100, 400];

  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(title, notifOptions);
        return true;
      }
    }
  } catch (e) {
    console.warn('Service worker notification failed, using window fallback:', e);
  }

  try {
    new Notification(title, notifOptions);
    return true;
  } catch (err) {
    console.error('Window notification error:', err);
    return false;
  }
}

/**
 * Send an immediate test notification with optional audio preview
 */
export async function sendTestNotification(
  onPlayAudio?: () => void
): Promise<{ success: boolean; message: string }> {
  const perm = getNotificationPermission();
  if (perm !== 'granted') {
    const requested = await requestNotificationPermission();
    if (requested !== 'granted') {
      return {
        success: false,
        message: 'تم رفض إذن الإشعارات من المتصفح. يُرجى تفعيل الإشعارات من إعدادات المتصفح.',
      };
    }
  }

  const ok = await showIslamicNotification('زاد المسلم | اختبار الإشعارات بنجاح 🔔', {
    body: 'تم تفعيل إشعارات مواقيت الصلاة والأذكار والسنن النبوية بنجاح على جهازك.',
    tag: 'test-notification',
  });

  if (ok && onPlayAudio) {
    onPlayAudio();
  }

  return {
    success: ok,
    message: ok ? 'تم إرسال الإشعار بنجاح!' : 'تعذر إرسال الإشعار، يرجى مراجعة إعدادات المتصفح.',
  };
}

/**
 * Check prayer times and trigger notification if current time is within 1 minute of prayer
 */
export function checkPrayerAlerts(
  prayers: Array<{ key: string; name: string; time: Date | string; formatted?: string }>,
  onAdhanTrigger: (prayerName: string) => void
): void {
  const settings = getNotificationSettings();
  if (!settings.enabled || getNotificationPermission() !== 'granted') return;

  const now = Date.now();
  const todayDateStr = new Date().toISOString().slice(0, 10);

  const prayerKeyMap: Record<string, boolean> = {
    fajr: settings.notifyFajr,
    dhuhr: settings.notifyDhuhr,
    asr: settings.notifyAsr,
    maghrib: settings.notifyMaghrib,
    isha: settings.notifyIsha,
  };

  for (const prayer of prayers) {
    const isAllowed = prayerKeyMap[prayer.key];
    if (!isAllowed) continue;

    const timeMs =
      prayer.time instanceof Date ? prayer.time.getTime() : new Date(prayer.time).getTime();
    if (isNaN(timeMs)) continue;

    // Diff between now and prayer time (in milliseconds)
    const diff = now - timeMs;
    // Trigger if within [0, 90 seconds] after prayer time
    if (diff >= 0 && diff <= 90 * 1000) {
      const historyKey = `${todayDateStr}-prayer-${prayer.key}`;
      if (!wasTriggeredRecently(historyKey, 60 * 60 * 1000)) {
        markTriggered(historyKey);

        showIslamicNotification(`حان الآن موعد أذان ${prayer.name} 🕌`, {
          body: `حي على الصلاة، حي على الفلاح. تقبل الله طاعتكم وصالح أعمالكم.`,
          tag: `prayer-${prayer.key}`,
          data: { view: 'prayer' },
        });

        if (settings.adhanSound) {
          onAdhanTrigger(prayer.name);
        }
        break;
      }
    }
  }
}

/**
 * Check and trigger Azkar and daily reminders
 */
export function checkAzkarAndDailyAlerts(): void {
  const settings = getNotificationSettings();
  if (!settings.enabled || getNotificationPermission() !== 'granted') return;

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const dayOfWeek = now.getDay(); // 5 = Friday
  const todayDateStr = now.toISOString().slice(0, 10);

  // 1. Morning Azkar (07:00 - 07:15)
  if (settings.morningAzkar && hours === 7 && minutes <= 15) {
    const key = `${todayDateStr}-azkar-morning`;
    if (!wasTriggeredRecently(key, 12 * 60 * 60 * 1000)) {
      markTriggered(key);
      showIslamicNotification('أذكار الصباح المباركة ☀️', {
        body: 'أصبحنا وأصبح الملك لله والحمد لله. حصّن نفسك وبداية يومك بأذكار الصباح.',
        tag: 'azkar-morning',
        data: { view: 'azkar' },
      });
    }
  }

  // 2. Evening Azkar (17:00 - 17:15)
  if (settings.eveningAzkar && hours === 17 && minutes <= 15) {
    const key = `${todayDateStr}-azkar-evening`;
    if (!wasTriggeredRecently(key, 12 * 60 * 60 * 1000)) {
      markTriggered(key);
      showIslamicNotification('أذكار المساء وحصن المسلم 🌙', {
        body: 'أمسينا وأمسى الملك لله والحمد لله. لا تنسَ وردك من أذكار المساء.',
        tag: 'azkar-evening',
        data: { view: 'azkar' },
      });
    }
  }

  // 3. Sleep Azkar (22:30 - 22:45)
  if (settings.sleepAzkar && hours === 22 && minutes >= 30 && minutes <= 45) {
    const key = `${todayDateStr}-azkar-sleep`;
    if (!wasTriggeredRecently(key, 12 * 60 * 60 * 1000)) {
      markTriggered(key);
      showIslamicNotification('أذكار النوم وسورة الملك 🛏️', {
        body: 'باسمك ربي وضعت جنبي وبك أرفعه. اختم يومك بذكر الله وتلاوة المنجية من عذاب القبر.',
        tag: 'azkar-sleep',
        data: { view: 'azkar' },
      });
    }
  }

  // 4. Friday Surah Al-Kahf reminder (Friday between 10:00 and 10:30)
  if (settings.fridayKahf && dayOfWeek === 5 && hours === 10 && minutes <= 30) {
    const key = `${todayDateStr}-friday-kahf`;
    if (!wasTriggeredRecently(key, 24 * 60 * 60 * 1000)) {
      markTriggered(key);
      showIslamicNotification('تذكير يوم الجمعة المبارك 📖', {
        body: 'نورٌ ما بين الجمعتين. لا تنسَ قراءة سورة الكهف والإكثار من الصلاة على النبي ﷺ.',
        tag: 'friday-kahf',
        data: { view: 'quran' },
      });
    }
  }
}
