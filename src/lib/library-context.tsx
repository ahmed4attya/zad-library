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
import { dayKey } from './format';
import type { CatNode, Filter, Index, Item, Persist, View } from './types';

const DEF: Persist = { fav: {}, done: {}, pos: {}, days: {}, last: null, goal: 3, theme: 'light' };
const KEY = 'zad:v1';
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
  go: (v: View) => void;
  openSection: (n: CatNode) => void;
  enter: (n: CatNode) => void;
  crumb: (i: number) => void;
  setFilter: (f: Filter) => void;
  setQ: (s: string) => void;
  setGoal: (n: number) => void;
  setRate: (r: number) => void;
  toggleTheme: () => void;
  toggleFav: (id: string) => void;
  markDone: (id: string) => void;
  savePos: (id: string, t: number, d: number) => void;
  openFile: (item: Item, list?: Item[]) => void;
  step: (d: number) => boolean;
  closeSheet: () => void;
  importFile: (f: File) => Promise<void>;
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
  const toastT = useRef<ReturnType<typeof setTimeout>>();

  const data = useMemo<Index>(() => (tree ? buildIndex(tree) : { all: [], by: {} }), [tree]);

  const toast = useCallback((m: string) => {
    setMsg(m);
    clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setMsg(null), 2200);
  }, []);

  const applyTree = useCallback((d: CatNode) => {
    setTree(d);
    setPath([d]);
  }, []);

  /* تحميل الحالة المحفوظة */
  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) setSt({ ...DEF, ...(JSON.parse(s) as Partial<Persist>) });
    } catch {
      /* تجاهل */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(st));
      } catch {
        /* تجاهل */
      }
    }, 250);
    return () => clearTimeout(t);
  }, [st, ready]);

  useEffect(() => {
    document.documentElement.dataset.t = st.theme;
  }, [st.theme]);

  /* تحميل الفهرس: public/catalog.json ثم المتصفح */
  useEffect(() => {
    let off = false;
    (async () => {
      let found: CatNode | null = null;
      try {
        const r = await fetch(`${BASE}/catalog.json`, { cache: 'no-store' });
        if (r.ok) {
          const j: unknown = await r.json();
          if (isCatalog(j)) found = j;
        }
      } catch {
        /* تجاهل */
      }
      if (!found) {
        try {
          const s = localStorage.getItem(CKEY);
          if (s) {
            const j: unknown = JSON.parse(s);
            if (isCatalog(j)) found = j;
          }
        } catch {
          /* تجاهل */
        }
      }
      if (off) return;
      if (found) applyTree(found);
      setLoading(false);
    })();
    return () => {
      off = true;
    };
  }, [applyTree]);

  const go = useCallback((v: View) => {
    setView(v);
    window.scrollTo(0, 0);
  }, []);

  const openSection = useCallback(
    (n: CatNode) => {
      if (!tree) return;
      setPath([tree, n]);
      setFilter('all');
      go('lib');
    },
    [tree, go],
  );

  const enter = useCallback((n: CatNode) => {
    setPath((p) => [...p, n]);
    window.scrollTo(0, 0);
  }, []);

  const crumb = useCallback((i: number) => setPath((p) => p.slice(0, i + 1)), []);

  const setGoal = useCallback((n: number) => setSt((p) => ({ ...p, goal: n })), []);
  const toggleTheme = useCallback(
    () => setSt((p) => ({ ...p, theme: p.theme === 'dark' ? 'light' : 'dark' })),
    [],
  );

  const toggleFav = useCallback(
    (id: string) => {
      toast(st.fav[id] ? 'أُزيل من المفضلة' : 'أُضيف إلى المفضلة');
      setSt((p) => {
        const fav = { ...p.fav };
        if (fav[id]) delete fav[id];
        else fav[id] = 1;
        return { ...p, fav };
      });
    },
    [st.fav, toast],
  );

  const markDone = useCallback((id: string) => {
    setSt((p) => {
      if (p.done[id]) return p;
      const k = dayKey(new Date());
      return { ...p, done: { ...p.done, [id]: 1 }, days: { ...p.days, [k]: (p.days[k] ?? 0) + 1 } };
    });
  }, []);

  const savePos = useCallback((id: string, t: number, d: number) => {
    setSt((p) => ({ ...p, pos: { ...p.pos, [id]: { t, d } } }));
  }, []);

  const openFile = useCallback(
    (item: Item, list?: Item[]) => {
      const queue = list && list.some((x) => x.id === item.id) ? list : [item];
      setSheet({ item, queue, index: queue.findIndex((x) => x.id === item.id) });
      setSt((p) => ({ ...p, last: item.id }));
      if (item.kind !== 'audio') markDone(item.id);
    },
    [markDone],
  );

  const step = useCallback(
    (d: number): boolean => {
      if (!sheet) return false;
      const i = sheet.index + d;
      const n = sheet.queue[i];
      if (!n) return false;
      setSheet({ ...sheet, item: n, index: i });
      setSt((p) => ({ ...p, last: n.id }));
      if (n.kind !== 'audio') markDone(n.id);
      return true;
    },
    [sheet, markDone],
  );

  const closeSheet = useCallback(() => setSheet(null), []);

  const importFile = useCallback(
    async (f: File) => {
      try {
        const j: unknown = JSON.parse(await f.text());
        if (!isCatalog(j)) throw new Error('bad');
        applyTree(j);
        try {
          localStorage.setItem(CKEY, JSON.stringify(j));
          toast('تم تحميل الفهرس وحفظه في المتصفح');
        } catch {
          toast('تم التحميل، لكن تعذّر حفظ الفهرس في المتصفح');
        }
      } catch {
        toast('الملف ليس فهرسًا صالحًا');
      }
    },
    [applyTree, toast],
  );

  const value: Ctx = {
    tree, data, loading, view, path, filter, q, st, sheet, rate, msg,
    go, openSection, enter, crumb, setFilter, setQ, setGoal, setRate,
    toggleTheme, toggleFav, markDone, savePos, openFile, step, closeSheet, importFile,
  };

  return <C.Provider value={value}>{children}</C.Provider>;
}
