'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // Register service worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch(() => undefined);
    }

    // Capture install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showInstallBanner || !deferredPrompt) return null;

  return (
    <aside
      aria-label="تثبيت التطبيق"
      className="fixed bottom-20 start-4 end-4 z-40 mx-auto max-w-md rounded-2xl border border-gold/50 bg-brand-900/95 p-3.5 text-white shadow-2xl backdrop-blur animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold/20 text-gold">
            <Download className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold">تثبيت تطبيق زاد المسلم</h4>
            <p className="text-[11px] text-emerald-200/80">
              لتجربة أسرع بدون اتصال وبكامل الشاشة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleInstall}
            className="rounded-xl bg-gold px-3.5 py-1.5 text-xs font-bold text-brand-950 shadow hover:brightness-110"
          >
            تثبيت
          </button>
          <button
            type="button"
            onClick={() => setShowInstallBanner(false)}
            className="text-xs text-white/60 hover:text-white px-2 py-1"
          >
            لاحقاً
          </button>
        </div>
      </div>
    </aside>
  );
}
