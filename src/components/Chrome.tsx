'use client';

import { useState } from 'react';
import {
  Home,
  Clock,
  BookOpen,
  Sparkles,
  Compass,
  Layers,
  Scroll,
  Coins,
  Calendar,
  Search,
  Bookmark,
  Radio,
  Moon,
  Sun,
  Menu,
  X,
  Upload,
  MoreHorizontal,
  ChevronDown,
  Bell,
  Heart,
} from 'lucide-react';
import { ImportButton } from './ImportButton';
import { Logo } from './Logo';
import { useLib } from '@/lib/library-context';
import type { View } from '@/lib/types';

const PRIMARY_NAV: { k: View; l: string; icon: typeof Home }[] = [
  { k: 'home', l: 'الرئيسية', icon: Home },
  { k: 'prayer', l: 'المواقيت', icon: Clock },
  { k: 'quran', l: 'المصحف', icon: BookOpen },
  { k: 'azkar', l: 'الأذكار', icon: Sparkles },
  { k: 'lib', l: 'المكتبة', icon: Layers },
];

const MORE_NAV: { k: View; l: string; desc: string; icon: typeof Compass }[] = [
  { k: 'qibla', l: 'بوصلة القبلة', desc: 'تحديد دقيق لاتجاه الكعبة', icon: Compass },
  { k: 'tasbeeh', l: 'السبحة الذكية', desc: 'عداد إلكتروني وتسبيح', icon: Layers },
  { k: 'hadith', l: 'الأربعون النووية', desc: 'أحاديث نبوية مع الشرح', icon: Scroll },
  { k: 'zakat', l: 'حاسبة الزكاة', desc: 'حساب زكاة المال والذهب', icon: Coins },
  { k: 'calendar', l: 'التقويم الهجري', desc: 'شهور السنة والمناسبات', icon: Calendar },
  { k: 'radio', l: 'إذاعة القرآن', desc: 'بث إذاعي مباشر 24 ساعة', icon: Radio },
  { k: 'names', l: 'أسماء الله الحسنى', desc: '99 اسماً مع الشرح والتدبر', icon: Heart },
  { k: 'fav', l: 'المحفوظات', desc: 'قائمتك المفضلة والمراجع', icon: Bookmark },
  { k: 'search', l: 'البحث الشامل', desc: 'بحث في المكتبة والقرآن', icon: Search },
];

const ICON_BTN = 'grid h-9 w-9 place-items-center rounded-xl text-mut hover:text-pri hover:bg-surface transition-colors';

export function Header() {
  const { view, go, toggleTheme, st, openNotifModal } = useLib();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-card/95 backdrop-blur">
      <div className="wrap flex h-16 items-center gap-2">
        <button
          type="button"
          onClick={() => go('home')}
          aria-label="الرئيسية"
          className="flex items-center gap-2.5 text-start"
        >
          <Logo />
          <div className="hidden sm:block">
            <span className="font-bold text-sm text-ink block leading-tight">زاد المسلم</span>
            <span className="text-[10px] text-gold-700 font-semibold block">وقف لله تعالى</span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav aria-label="التنقل الرئيسي" className="ms-6 hidden gap-1 lg:flex items-center">
          {PRIMARY_NAV.map((n) => {
            const on = view === n.k;
            const IconComponent = n.icon;
            return (
              <button
                key={n.k}
                type="button"
                onClick={() => go(n.k)}
                aria-current={on ? 'page' : undefined}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                  on ? 'bg-brand-50 text-pri shadow-sm' : 'text-mut hover:text-ink'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{n.l}</span>
              </button>
            );
          })}

          {/* More Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen(!moreOpen)}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                MORE_NAV.some((m) => m.k === view) ? 'bg-brand-50 text-pri' : 'text-mut hover:text-ink'
              }`}
            >
              <span>المزيد</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {moreOpen && (
              <div
                className="absolute start-0 top-full mt-2 w-56 rounded-2xl border border-line bg-card p-2 shadow-xl z-50"
                onClick={() => setMoreOpen(false)}
              >
                {MORE_NAV.map((m) => {
                  const IconComp = m.icon;
                  const isSelected = view === m.k;
                  return (
                    <button
                      key={m.k}
                      type="button"
                      onClick={() => go(m.k)}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-start text-xs font-medium transition-colors ${
                        isSelected ? 'bg-brand-50 font-bold text-pri' : 'text-ink hover:bg-surface'
                      }`}
                    >
                      <IconComp className="h-4 w-4 text-gold" />
                      <div>
                        <span>{m.l}</span>
                        <p className="text-[10px] text-mut">{m.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        <span className="flex-1" />

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="إعدادات الأذان والتنبيهات"
            onClick={openNotifModal}
            className={ICON_BTN}
            title="إعدادات الأذان والتنبيهات"
          >
            <Bell className="h-4 w-4 text-[var(--gold-500)]" />
          </button>

          <ImportButton className={ICON_BTN} label="تحميل ملف الفهرس">
            <Upload className="h-4 w-4" />
          </ImportButton>

          <button
            type="button"
            aria-label="بحث"
            onClick={() => go('search')}
            className={ICON_BTN}
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="المحفوظات"
            onClick={() => go('fav')}
            className={ICON_BTN}
          >
            <Bookmark className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="تبديل الثيم"
            onClick={toggleTheme}
            className={ICON_BTN}
          >
            {st.theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  const { view, go, openNotifModal } = useLib();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="التنقل السفلي"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-card/95 backdrop-blur px-2 pb-[calc(6px+env(safe-area-inset-bottom,0px))] pt-1.5 lg:hidden shadow-lg"
      >
        {PRIMARY_NAV.slice(0, 4).map((n) => {
          const on = view === n.k;
          const IconComponent = n.icon;
          return (
            <button
              key={n.k}
              type="button"
              onClick={() => go(n.k)}
              aria-label={n.l}
              aria-current={on ? 'page' : undefined}
              className={`relative flex flex-col items-center gap-1 py-1 text-[11px] font-medium transition-colors ${
                on ? 'font-bold text-pri' : 'text-mut'
              }`}
            >
              <IconComponent className={`h-5 w-5 ${on ? 'text-pri' : 'text-mut'}`} />
              <span>{n.l}</span>
              {on && (
                <span className="absolute -bottom-1 h-1 w-5 rounded-full bg-gold content-['']" />
              )}
            </button>
          );
        })}

        {/* More / Menu Drawer Toggle */}
        <button
          type="button"
          onClick={() => setDrawerOpen(!drawerOpen)}
          aria-label="المزيد من الأقسام"
          className={`relative flex flex-col items-center gap-1 py-1 text-[11px] font-medium transition-colors ${
            drawerOpen || MORE_NAV.some((m) => m.k === view) || view === 'lib'
              ? 'font-bold text-pri'
              : 'text-mut'
          }`}
        >
          <MoreHorizontal className="h-5 w-5" />
          <span>المزيد</span>
        </button>
      </nav>

      {/* Drawer Overlay for Mobile */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden flex flex-col justify-end"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="w-full rounded-t-3xl border-t border-line bg-card p-5 shadow-2xl space-y-4 max-h-[75vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <h3 className="text-sm font-bold text-ink">أقسام زاد المسلم</h3>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-mut hover:bg-surface"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Notifications Button in Drawer */}
            <button
              type="button"
              onClick={() => {
                setDrawerOpen(false);
                openNotifModal();
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[var(--emerald-800)] to-[var(--emerald-700)] text-white shadow-md font-bold text-xs"
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-[var(--gold-400)]" />
                <span>إعدادات الأذان والتنبيهات اليومية</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20">تخصيص</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  go('lib');
                  setDrawerOpen(false);
                }}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-start transition-all ${
                  view === 'lib' ? 'border-brand-700 bg-brand-50 text-pri font-bold' : 'border-line bg-surface/50 text-ink'
                }`}
              >
                <Layers className="h-5 w-5 text-gold" />
                <div>
                  <h4 className="text-xs font-bold">المكتبة الوقفية</h4>
                  <p className="text-[10px] text-mut">تصفح الفهرس الشامل</p>
                </div>
              </button>

              {MORE_NAV.map((item) => {
                const IconComp = item.icon;
                const isSelected = view === item.k;
                return (
                  <button
                    key={item.k}
                    type="button"
                    onClick={() => {
                      go(item.k);
                      setDrawerOpen(false);
                    }}
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-start transition-all ${
                      isSelected
                        ? 'border-brand-700 bg-brand-50 text-pri font-bold'
                        : 'border-line bg-surface/50 text-ink'
                    }`}
                  >
                    <IconComp className="h-5 w-5 text-gold" />
                    <div>
                      <h4 className="text-xs font-bold">{item.l}</h4>
                      <p className="text-[10px] text-mut truncate">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function Toast() {
  const { msg } = useLib();
  return (
    <div
      role="status"
      className={`pointer-events-none fixed bottom-[84px] left-1/2 z-50 -translate-x-1/2 rounded-full bg-brand-800 px-5 py-2.5 text-xs font-bold text-white shadow-xl transition-all ${
        msg ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      {msg}
    </div>
  );
}
