'use client';

import { useState, useRef, useEffect } from 'react';
import { Radio, Play, Square, Volume2, VolumeX, Sparkles, Wifi, Tv, ExternalLink } from 'lucide-react';
import radiosData from '@/data/radios.json';

export function RadioView() {
  const [activeRadio, setActiveRadio] = useState<(typeof radiosData)[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playRadio = (radio: (typeof radiosData)[0]) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setIsLoading(true);
    setActiveRadio(radio);

    const audio = new Audio(radio.url);
    audioRef.current = audio;
    audio.volume = isMuted ? 0 : volume;

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      })
      .catch(() => {
        setIsPlaying(false);
        setIsLoading(false);
      });

    audio.onerror = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };
  };

  const togglePlay = () => {
    if (!audioRef.current && radiosData.length > 0) {
      playRadio(radiosData[0]);
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  return (
    <div className="wrap space-y-6 pt-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-pri">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">إذاعات القرآن الكريم المباشرة</h2>
            <p className="text-xs text-mut">بث إذاعي مباشر ومتواصل على مدار 24 ساعة لأشهر المحطات والقراء</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>بث مباشر حي</span>
          </span>
        </div>
      </div>

      {/* Main Radio Player Hero Card */}
      <div className="relative overflow-hidden rounded-[28px] border border-gold/40 bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 p-6 text-white shadow-xl md:p-8">
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black/25 px-4 py-1 text-xs text-gold">
            <Wifi className="h-3.5 w-3.5" />
            <span>{activeRadio ? activeRadio.name : 'اختر محطة إذاعية لبدء الاستماع'}</span>
          </div>

          <h3 className="mt-4 text-2xl font-extrabold text-white md:text-3xl">
            {activeRadio ? activeRadio.name : 'إذاعة القرآن الكريم'}
          </h3>
          <p className="mt-1 text-xs text-emerald-100/80">
            {activeRadio ? activeRadio.desc : 'بث مباشر عالي الجودة'}
          </p>

          {/* Equalizer Visualizer Bars */}
          <div className="my-6 flex items-end justify-center gap-1.5 h-10">
            {[40, 75, 55, 90, 65, 85, 45, 95, 70, 50, 80, 60].map((h, i) => (
              <div
                key={i}
                className={`w-1 rounded-full bg-amber-400 transition-all duration-300 ${
                  isPlaying ? 'animate-pulse' : 'opacity-40'
                }`}
                style={{
                  height: isPlaying ? `${h}%` : '20%',
                  animationDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={togglePlay}
              disabled={isLoading}
              className="grid h-16 w-16 place-items-center rounded-full bg-gold text-brand-950 shadow-xl transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-950 border-t-transparent" />
              ) : isPlaying ? (
                <Square className="h-6 w-6 fill-current" />
              ) : (
                <Play className="h-7 w-7 ms-1 fill-current" />
              )}
            </button>
          </div>

          {/* Volume slider */}
          <div className="mt-6 flex items-center gap-3 w-full max-w-xs">
            <button type="button" onClick={toggleMute} className="text-white/80 hover:text-white">
              {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Radios List Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {radiosData.map((radio) => {
          const isCurrent = activeRadio?.id === radio.id;

          return (
            <div
              key={radio.id}
              className={`flex items-center justify-between rounded-2xl border p-4 transition-all ${
                isCurrent
                  ? 'border-gold bg-amber-500/10 shadow-md ring-2 ring-gold/40'
                  : 'border-line bg-card hover:border-gold/40'
              }`}
            >
              <div className="min-w-0 flex-1 pe-3">
                <div className="flex items-center gap-1.5">
                  <h4 className="truncate text-sm font-bold text-ink">{radio.name}</h4>
                  {radio.featured && (
                    <span className="rounded-full bg-gold/20 px-2 py-0.2 text-[9px] font-bold text-gold-700">
                      مميز
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-xs text-mut">{radio.desc}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (isCurrent && isPlaying) {
                    togglePlay();
                  } else {
                    playRadio(radio);
                  }
                }}
                className={`grid h-10 w-10 flex-none place-items-center rounded-full text-white shadow transition-transform hover:scale-105 ${
                  isCurrent && isPlaying ? 'bg-rose-600' : 'bg-brand-700'
                }`}
              >
                {isCurrent && isPlaying ? (
                  <Square className="h-4 w-4 fill-current" />
                ) : (
                  <Play className="h-4 w-4 ms-0.5 fill-current" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Live TV Channels Section from Islamic-APIs */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Tv className="w-4 h-4 text-[var(--gold-500)]" />
          <h3 className="font-bold text-sm text-[var(--text-main)]">قنوات البث المباشر المرئي للحرمين الشريفين</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="https://www.youtube.com/watch?v=eC4LfEVxvKg"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--emerald-500)] transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--text-main)]">قناة القرآن الكريم (مكة المكرمة)</h4>
                <p className="text-xs text-[var(--text-subtle)] mt-0.5">بث حي مباشر متواصل من المسجد الحرام 24/7</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-[var(--text-subtle)] group-hover:text-[var(--emerald-600)]" />
          </a>

          <a
            href="https://youtu.be/Rs7St51oDDc"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--emerald-500)] transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold/15 text-gold-700 dark:text-gold-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--text-main)]">قناة السنة النبوية (المدينة المنورة)</h4>
                <p className="text-xs text-[var(--text-subtle)] mt-0.5">بث حي مباشر متواصل من المسجد النبوي الشريف 24/7</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-[var(--text-subtle)] group-hover:text-[var(--gold-500)]" />
          </a>
        </div>
      </div>
    </div>
  );
}
