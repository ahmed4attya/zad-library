'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { buildIndex, isCatalog } from './catalog';
import {
  calculatePrayerStatus,
  CityInfo,
  PrayerStatus,
} from './prayer-service';
import type { CatNode, Filter, Index, Item, Persist, View } from './types';
import citiesData from '@/data/cities.json';
import adhansData from '@/data/adhans.json';
import {
  checkPrayerAlerts,
  checkAzkarAndDailyAlerts,
  getNotificationSettings,
} from './notification-service';

const DEFAULT_CITY: CityInfo = (citiesData as CityInfo[]).find((c) => c.id === 'makkah') || {
  id: 'makkah',
  name: 'مكة المكرمة',
  country: 'المملكة العربية السعودية',
  lat: 21.4225,
  lng: 39.8262,
  method: 'UmmAlQura',
};

const DEF: Persist = {
  fav: {},
  done: {},
  pos: {},
  last: null,
  theme: 'light',
  cityId: 'makkah',
  calcMethod: 'UmmAlQura',
  madhab: 'shafi',
  selectedAdhanId: 'makka_malla',
  tasbeehCounts: {},
  hijriOffset: 0,
};

const KEY = 'zad:v2';
const CKEY = 'zad:catalog';
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

interface Sheet {
  item: Item;
  queue: Item[];
  index: number;
}

interface Ctx {
  tree: CatNode | null;
  data: Index;
  loading: boolean;
  view: View;
  path: CatNode[];
  filter: Filter;
  q: string;
  st: Persist;
  sheet: Sheet | null;
  rate: number;
  msg: string | null;
  city: CityInfo;
  calcMethod: string;
  madhab: 'shafi' | 'hanafi';
  prayerStatus: PrayerStatus;
  activeAdhanAudio: { id: string; name: string; url: string } | null;
  go: (v: View) => void;
  openSection: (n: CatNode) => void;
  enter: (n: CatNode) => void;
  crumb: (i: number) => void;
  setFilter: (f: Filter) => void;
  setQ: (s: string) => void;
  searchFor: (s: string) => void;
  setRate: (r: number) => void;
  toggleTheme: () => void;
  toggleFav: (id: string) => void;
  markDone: (id: string) => void;
  savePos: (id: string, t: number, d: number) => void;
  openFile: (item: Item, list?: Item[]) => void;
  step: (d: number) => boolean;
  closeSheet: () => void;
  importFile: (f: File) => Promise<void>;
  setCity: (c: CityInfo) => void;
  setCalcMethod: (m: string) => void;
  setMadhab: (m: 'shafi' | 'hanafi') => void;
  detectLocation: () => Promise<boolean>;
  playAdhan: (adhanId: string) => void;
  stopAdhan: () => void;
  updateTasbeehCount: (dhikrKey: string, delta: number, reset?: boolean) => number;
  toast: (m: string) => void;
  notifModalOpen: boolean;
  openNotifModal: () => void;
  closeNotifModal: () => void;
}

const C = createContext<Ctx | null>(null);

export function useLib(): Ctx {
  const c = useContext(C);
  if (!c) throw new Error('useLib must be used inside LibraryProvider');
  return c;
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [tree, setTree] = useState<CatNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('home');
  const [path, setPath] = useState<CatNode[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');
  const [st, setSt] = useState<Persist>(DEF);
  const [ready, setReady] = useState(false);
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [rate, setRate] = useState(1);
  const [msg, setMsg] = useState<string | null>(null);
  const [city, setCityState] = useState<CityInfo>(DEFAULT_CITY);
  const [calcMethod, setCalcMethodState] = useState<string>('UmmAlQura');
  const [madhab, setMadhabState] = useState<'shafi' | 'hanafi'>('shafi');
  const [activeAdhanAudio, setActiveAdhanAudio] = useState<{ id: string; name: string; url: string } | null>(null);
  const [nowDate, setNowDate] = useState<Date>(new Date());

  const toastT = useRef<ReturnType<typeof setTimeout>>();
  const adhanAudioRef = useRef<HTMLAudioElement | null>(null);

  const data = useMemo<Index>(() => (tree ? buildIndex(tree) : { all: [], by: {} }), [tree]);

  const toast = useCallback((m: string) => {
    setMsg(m);
    clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setMsg(null), 2500);
  }, []);

  // Live timer tick every second for prayer times countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setNowDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const prayerStatus = useMemo<PrayerStatus>(() => {
    return calculatePrayerStatus(
      city.lat,
      city.lng,
      calcMethod,
      madhab,
      st.hijriOffset ?? 0,
      nowDate
    );
  }, [city, calcMethod, madhab, st.hijriOffset, nowDate]);

  const applyTree = useCallback((d: CatNode) => {
    setTree(d);
    setPath([d]);
  }, []);

  /* تحميل الحالة المحفوظة */
  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY) || localStorage.getItem('zad:v1');
      if (s) {
        const p = JSON.parse(s) as Partial<Persist>;
        setSt({
          fav: p.fav ?? {},
          done: p.done ?? {},
          pos: p.pos ?? {},
          last: p.last ?? null,
          theme: p.theme === 'dark' ? 'dark' : 'light',
          cityId: p.cityId ?? 'makkah',
          calcMethod: p.calcMethod ?? 'UmmAlQura',
          madhab: p.madhab ?? 'shafi',
          selectedAdhanId: p.selectedAdhanId ?? 'makka_malla',
          tasbeehCounts: p.tasbeehCounts ?? {},
          hijriOffset: p.hijriOffset ?? 0,
        });

        if (p.cityId) {
          const found = (citiesData as CityInfo[]).find((c) => c.id === p.cityId);
          if (found) {
            setCityState(found);
            if (!p.calcMethod && found.method) {
              setCalcMethodState(found.method);
            }
          }
        }
        if (p.calcMethod) setCalcMethodState(p.calcMethod);
        if (p.madhab) setMadhabState(p.madhab);
      }
    } catch {
      /* تجاهل أخطاء التخزين المحلي */
    } finally {
      setReady(true);
    }
  }, []);

  /* تطبيق الثيم */
  useEffect(() => {
    if (!ready) return;
    document.documentElement.setAttribute('data-t', st.theme);
    try {
      localStorage.setItem(KEY, JSON.stringify(st));
    } catch {
      /* تجاهل */
    }
  }, [st, ready]);

  /* جلب الفهرس من التخزين ثم من الشبكة */
  useEffect(() => {
    let alive = true;
    try {
      const c = localStorage.getItem(CKEY);
      if (c) {
        const parsed = JSON.parse(c);
        if (isCatalog(parsed)) {
          applyTree(parsed);
          setLoading(false);
          return;
        }
      }
    } catch {
      /* تجاهل خطأ الكاش */
    }

    fetch(`${BASE}/catalog.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        if (!alive) return;
        if (isCatalog(d)) {
          applyTree(d);
          try {
            localStorage.setItem(CKEY, JSON.stringify(d));
          } catch {
            /* تجاهل امتلاء التخزين */
          }
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [applyTree]);

  const go = useCallback((v: View) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openSection = useCallback(
    (n: CatNode) => {
      setPath([tree ?? n, n]);
      setView('lib');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [tree]
  );

  const enter = useCallback((n: CatNode) => {
    setPath((p) => [...p, n]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const crumb = useCallback((i: number) => {
    setPath((p) => p.slice(0, i + 1));
  }, []);

  const searchFor = useCallback((s: string) => {
    setQ(s);
    setView('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleTheme = useCallback(() => {
    setSt((s) => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }));
  }, []);

  const toggleFav = useCallback(
    (id: string) => {
      setSt((s) => {
        const next = { ...s.fav };
        if (next[id]) delete next[id];
        else next[id] = 1;
        toast(next[id] ? 'أُضيف إلى المحفوظات' : 'أُزيل من المحفوظات');
        return { ...s, fav: next };
      });
    },
    [toast]
  );

  const markDone = useCallback((id: string) => {
    setSt((s) => ({ ...s, done: { ...s.done, [id]: 1 } }));
  }, []);

  const savePos = useCallback((id: string, t: number, d: number) => {
    setSt((s) => ({ ...s, pos: { ...s.pos, [id]: { t, d } } }));
  }, []);

  const openFile = useCallback(
    (item: Item, list?: Item[]) => {
      const q = list && list.length ? list : [item];
      const idx = q.findIndex((x) => x.id === item.id);
      setSheet({ item, queue: q, index: Math.max(0, idx) });
      setSt((s) => ({ ...s, last: item.id }));
    },
    []
  );

  const step = useCallback(
    (delta: number) => {
      if (!sheet) return false;
      const nextIdx = sheet.index + delta;
      if (nextIdx < 0 || nextIdx >= sheet.queue.length) return false;
      const nextItem = sheet.queue[nextIdx];
      setSheet({ item: nextItem, queue: sheet.queue, index: nextIdx });
      setSt((s) => ({ ...s, last: nextItem.id }));
      return true;
    },
    [sheet]
  );

  const closeSheet = useCallback(() => setSheet(null), []);

  const importFile = useCallback(
    async (file: File) => {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!isCatalog(parsed)) {
        toast('الملف ليس فهرسًا صالحًا لمكتبة زاد');
        return;
      }
      applyTree(parsed);
      try {
        localStorage.setItem(CKEY, text);
      } catch {
        /* تجاهل امتلاء التخزين */
      }
      toast('تم استيراد الفهرس بنجاح');
    },
    [applyTree, toast]
  );

  const setCity = useCallback(
    (newCity: CityInfo) => {
      setCityState(newCity);
      setSt((s) => ({ ...s, cityId: newCity.id }));
      if (newCity.method) {
        setCalcMethodState(newCity.method);
        setSt((s) => ({ ...s, calcMethod: newCity.method }));
      }
      toast(`تم ضبط الموقع: ${newCity.name}`);
    },
    [toast]
  );

  const setCalcMethod = useCallback(
    (method: string) => {
      setCalcMethodState(method);
      setSt((s) => ({ ...s, calcMethod: method }));
      toast('تم تحديث طريقة الحساب');
    },
    [toast]
  );

  const setMadhab = useCallback(
    (m: 'shafi' | 'hanafi') => {
      setMadhabState(m);
      setSt((s) => ({ ...s, madhab: m }));
      toast(m === 'hanafi' ? 'المذهب الحنفي (العصر)' : 'مذهب الجمهور (العصر)');
    },
    [toast]
  );

  const detectLocation = useCallback(async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      toast('خاصية تحديد الموقع غير مدعومة في متصفحك');
      return false;
    }
    return new Promise((resolve) => {
      toast('جارٍ تحديد موقعك الجغرافي...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const detectedCity: CityInfo = {
            id: 'custom_gps',
            name: 'موقعي الحالي (GPS)',
            country: 'تحديد تلقائي',
            lat,
            lng,
            method: calcMethod,
          };
          setCityState(detectedCity);
          setSt((s) => ({ ...s, cityId: 'custom_gps' }));
          toast('تم تحديد موقعك بدقة');
          resolve(true);
        },
        () => {
          toast('تعذر تحديد الموقع، يرجى اختيار المدينة يدويًا');
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }, [calcMethod, toast]);

  const playAdhan = useCallback(
    (adhanId: string) => {
      const adhan = adhansData.find((a) => a.id === adhanId) || adhansData[0];
      const audioUrl =
        (adhan as { url?: string; driveId?: string }).url ||
        `https://drive.google.com/uc?export=download&id=${adhan.driveId}`;

      if (adhanAudioRef.current) {
        adhanAudioRef.current.pause();
      }

      const audio = new Audio();
      audio.src = audioUrl;
      audio.preload = 'auto';
      adhanAudioRef.current = audio;
      setActiveAdhanAudio({ id: adhan.id, name: adhan.name, url: audioUrl });

      audio.play().catch((err) => {
        console.error('Audio play error:', err);
        toast('تعذر تشغيل ملف الأذان المباشر');
      });

      audio.onended = () => {
        setActiveAdhanAudio(null);
      };
    },
    [toast]
  );

  const stopAdhan = useCallback(() => {
    if (adhanAudioRef.current) {
      adhanAudioRef.current.pause();
      adhanAudioRef.current = null;
    }
    setActiveAdhanAudio(null);
  }, []);

  const updateTasbeehCount = useCallback((dhikrKey: string, delta: number, reset?: boolean) => {
    let nextCount = 0;
    setSt((s) => {
      const current = s.tasbeehCounts?.[dhikrKey] || 0;
      nextCount = reset ? 0 : Math.max(0, current + delta);
      return {
        ...s,
        tasbeehCounts: {
          ...(s.tasbeehCounts || {}),
          [dhikrKey]: nextCount,
        },
      };
    });
    return nextCount;
  }, []);

  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const openNotifModal = useCallback(() => setNotifModalOpen(true), []);
  const closeNotifModal = useCallback(() => setNotifModalOpen(false), []);

  // Periodic alert check for Prayer times (Adhan) and Azkar
  useEffect(() => {
    const check = () => {
      if (prayerStatus && prayerStatus.entries) {
        checkPrayerAlerts(prayerStatus.entries, (prayerName) => {
          const settings = getNotificationSettings();
          playAdhan(settings.selectedAdhanId || 'makkah');
          toast(`حان موعد أذان ${prayerName} 🕌`);
        });
      }
      checkAzkarAndDailyAlerts();
    };

    check();
    const interval = setInterval(check, 25000);
    return () => clearInterval(interval);
  }, [prayerStatus, playAdhan, toast]);

  const val = useMemo<Ctx>(
    () => ({
      tree,
      data,
      loading,
      view,
      path,
      filter,
      q,
      st,
      sheet,
      rate,
      msg,
      city,
      calcMethod,
      madhab,
      prayerStatus,
      activeAdhanAudio,
      notifModalOpen,
      openNotifModal,
      closeNotifModal,
      go,
      openSection,
      enter,
      crumb,
      setFilter,
      setQ,
      searchFor,
      setRate,
      toggleTheme,
      toggleFav,
      markDone,
      savePos,
      openFile,
      step,
      closeSheet,
      importFile,
      setCity,
      setCalcMethod,
      setMadhab,
      detectLocation,
      playAdhan,
      stopAdhan,
      updateTasbeehCount,
      toast,
    }),
    [
      tree,
      data,
      loading,
      view,
      path,
      filter,
      q,
      st,
      sheet,
      rate,
      msg,
      city,
      calcMethod,
      madhab,
      prayerStatus,
      activeAdhanAudio,
      notifModalOpen,
      openNotifModal,
      closeNotifModal,
      go,
      openSection,
      enter,
      crumb,
      setFilter,
      setQ,
      searchFor,
      setRate,
      toggleTheme,
      toggleFav,
      markDone,
      savePos,
      openFile,
      step,
      closeSheet,
      importFile,
      setCity,
      setCalcMethod,
      setMadhab,
      detectLocation,
      playAdhan,
      stopAdhan,
      updateTasbeehCount,
      toast,
    ]
  );

  return <C.Provider value={val}>{children}</C.Provider>;
}
