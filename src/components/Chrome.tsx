'use client';

import { Icon, type IconName } from './Icon';
import { ImportButton } from './ImportButton';
import { Logo } from './Logo';
import { useLib } from '@/lib/library-context';
import type { View } from '@/lib/types';

const NAV: { k: View; l: string; i: IconName }[] = [
  { k: 'home', l: 'الرئيسية', i: 'home' },
  { k: 'lib', l: 'المكتبة', i: 'lib' },
  { k: 'search', l: 'بحث', i: 'search' },
  { k: 'fav', l: 'المحفوظات', i: 'bookmark' },
];

const ICON_BTN = 'grid h-9 w-9 place-items-center rounded-xl text-mut hover:text-pri';

export function Header() {
  const { view, go, toggleTheme } = useLib();
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-card">
      <div className="wrap flex h-16 items-center gap-1">
        <button type="button" onClick={() => go('home')} aria-label="الرئيسية">
          <Logo />
        </button>
        <nav aria-label="التنقل الرئيسي" className="ms-4 hidden gap-1 min-[860px]:flex">
          {NAV.filter((n) => n.k !== 'search').map((n) => (
            <button
              key={n.k}
              type="button"
              onClick={() => go(n.k)}
              aria-current={view === n.k ? 'page' : undefined}
              className={`rounded-full px-4 py-1.5 text-sm ${
                view === n.k ? 'bg-brand-50 font-bold text-pri' : 'text-mut'
              }`}
            >
              {n.l}
            </button>
          ))}
        </nav>
        <span className="flex-1" />
        <ImportButton className={ICON_BTN} label="تحميل ملف الفهرس">
          <Icon name="up" />
        </ImportButton>
        <button type="button" aria-label="بحث" onClick={() => go('search')} className={ICON_BTN}>
          <Icon name="search" />
        </button>
        <button type="button" aria-label="المحفوظات" onClick={() => go('fav')} className={ICON_BTN}>
          <Icon name="bookmark" />
        </button>
        <button type="button" aria-label="تبديل الثيم" onClick={toggleTheme} className={ICON_BTN}>
          <Icon name="moon" />
        </button>
      </div>
    </header>
  );
}

export function BottomNav() {
  const { view, go } = useLib();
  return (
    <nav
      aria-label="التنقل السفلي"
      className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-line bg-card px-2 pb-[calc(6px+env(safe-area-inset-bottom,0px))] pt-1.5 min-[860px]:hidden"
    >
      {NAV.map((n) => {
        const on = view === n.k;
        return (
          <button
            key={n.k}
            type="button"
            onClick={() => go(n.k)}
            aria-label={n.l}
            aria-current={on ? 'page' : undefined}
            className={`relative flex flex-col items-center gap-px py-1.5 text-xs ${
              on
                ? "font-bold text-pri after:absolute after:-bottom-px after:h-[5px] after:w-[5px] after:rounded-full after:bg-gold after:content-['']"
                : 'text-mut'
            }`}
          >
            <Icon name={n.i} />
            {n.l}
          </button>
        );
      })}
    </nav>
  );
}

export function Toast() {
  const { msg } = useLib();
  return (
    <div
      role="status"
      className={`pointer-events-none fixed bottom-[100px] left-1/2 z-50 -translate-x-1/2 rounded-full bg-brand-800 px-5 py-2.5 text-sm text-white transition-opacity ${
        msg ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {msg}
    </div>
  );
}
