'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { driveDownload, drivePreview, driveView, tf } from '@/lib/format';
import { useLib } from '@/lib/library-context';
import type { Item } from '@/lib/types';

function FramePreview({ item, note }: { item: Item; note?: string }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {note && <p className="bg-sand px-[18px] py-2.5 text-[13px] text-gold-700">{note}</p>}
      <iframe
        src={drivePreview(item.id)}
        title={item.title}
        allow="autoplay"
        className="min-h-[55vh] w-full flex-1 border-0 bg-white"
      />
    </div>
  );
}

function AudioPlayer({ item }: { item: Item }) {
  const { st, rate, setRate, savePos, markDone, step } = useLib();
  const ref = useRef<HTMLAudioElement>(null);
  const drag = useRef(false);
  const lastSave = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    a.play().catch(() => undefined);
    return () => a.pause();
  }, []);

  useEffect(() => {
    if (ref.current) ref.current.playbackRate = rate;
  }, [rate]);

  if (failed) {
    return (
      <FramePreview
        item={item}
        note="تعذّر التشغيل المباشر لهذا الملف (غالبًا بسبب إعدادات المشاركة)، فتحنا معاينة Drive بدلًا منه."
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 overflow-auto px-[18px] py-[22px]">
      <audio
        ref={ref}
        src={driveDownload(item.id)}
        preload="metadata"
        onLoadedMetadata={(e) => {
          const a = e.currentTarget;
          setDur(a.duration);
          a.playbackRate = rate;
          const p = st.pos[item.id];
          if (p && p.t > 2 && p.t < a.duration - 3) a.currentTime = p.t;
        }}
        onTimeUpdate={(e) => {
          const a = e.currentTarget;
          if (!isFinite(a.duration) || !a.duration) return;
          if (!drag.current) setCur(a.currentTime);
          if (Date.now() - lastSave.current > 3000) {
            lastSave.current = Date.now();
            savePos(item.id, a.currentTime, a.duration);
            if (a.currentTime / a.duration >= 0.9) markDone(item.id);
          }
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          markDone(item.id);
          savePos(item.id, 0, dur);
          step(1);
        }}
        onError={() => setFailed(true)}
      />
      <div className="grid h-[132px] w-[132px] place-items-center rounded-[36px] bg-gradient-to-br from-brand-600 to-brand-800 text-[#f3d98a]">
        <Icon name="audio" className="h-14 w-14" />
      </div>
      <input
        type="range"
        dir="ltr"
        min={0}
        max={dur || 1}
        step={0.5}
        value={Math.min(cur, dur || 1)}
        aria-label="موضع التشغيل"
        onPointerDown={() => {
          drag.current = true;
        }}
        onPointerUp={() => {
          drag.current = false;
        }}
        onChange={(e) => {
          const v = Number(e.target.value);
          setCur(v);
          if (ref.current) ref.current.currentTime = v;
        }}
        className="w-full accent-brand-600"
      />
      <div dir="ltr" className="flex w-full justify-between text-[13px] text-mut">
        <span>{tf(cur)}</span>
        <span>{tf(dur)}</span>
      </div>
      <div dir="ltr" className="flex items-center gap-6">
        <button
          type="button"
          aria-label="السابق"
          onClick={() => step(-1)}
          className="grid h-[38px] w-[38px] place-items-center rounded-xl text-mut"
        >
          <Icon name="prev" />
        </button>
        <button
          type="button"
          aria-label={playing ? 'إيقاف مؤقت' : 'تشغيل'}
          onClick={() => {
            const a = ref.current;
            if (!a) return;
            if (a.paused) a.play().catch(() => undefined);
            else a.pause();
          }}
          className="grid h-[68px] w-[68px] place-items-center rounded-full bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-700/30"
        >
          <Icon name={playing ? 'pause' : 'play'} className="h-7 w-7" />
        </button>
        <button
          type="button"
          aria-label="التالي"
          onClick={() => step(1)}
          className="grid h-[38px] w-[38px] place-items-center rounded-xl text-mut"
        >
          <Icon name="next" />
        </button>
      </div>
      <div dir="ltr" className="flex flex-wrap justify-center gap-2">
        {[1, 1.25, 1.5, 2].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRate(r)}
            className={`chip ${r === rate ? 'chip-on' : ''}`}
          >
            {r}×
          </button>
        ))}
      </div>
    </div>
  );
}

export function Sheet() {
  const { sheet, closeSheet, st, toggleFav } = useLib();

  useEffect(() => {
    if (!sheet) return;
    const f = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSheet();
    };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [sheet, closeSheet]);

  if (!sheet) return null;
  const { item } = sheet;
  const fav = !!st.fav[item.id];

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-[rgba(10,20,14,.55)] md:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSheet();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        className="flex max-h-[94vh] w-full max-w-[720px] flex-col overflow-hidden rounded-t-[28px] bg-card md:h-[min(86vh,760px)] md:rounded-[28px]"
      >
        <div className="flex items-center gap-2 border-b border-line py-3 pe-3 ps-[18px]">
          <b className="flex-1 text-[15px] leading-relaxed">{item.title}</b>
          <button
            type="button"
            aria-label="إغلاق"
            onClick={closeSheet}
            className="grid h-[38px] w-[38px] place-items-center rounded-xl text-mut"
          >
            <Icon name="x" />
          </button>
        </div>
        {item.kind === 'audio' ? <AudioPlayer key={item.id} item={item} /> : <FramePreview item={item} />}
        <div className="flex flex-wrap gap-2 border-t border-line px-[18px] pb-[calc(14px+env(safe-area-inset-bottom,0px))] pt-3">
          <button
            type="button"
            onClick={() => toggleFav(item.id)}
            className={`btn ${fav ? 'border-gold text-gold-700' : ''}`}
          >
            <Icon name="bookmark" className={`h-[18px] w-[18px] ${fav ? 'fill-current' : ''}`} />
            المحفوظات
          </button>
          <a className="btn" href={driveView(item.id)} target="_blank" rel="noopener noreferrer">
            <Icon name="ext" className="h-[18px] w-[18px]" />
            فتح في Drive
          </a>
          <a className="btn" href={driveDownload(item.id)} target="_blank" rel="noopener noreferrer">
            <Icon name="dl" className="h-[18px] w-[18px]" />
            تنزيل
          </a>
        </div>
      </div>
    </div>
  );
}
