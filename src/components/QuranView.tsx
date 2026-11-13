'use client';

import { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Search,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Bookmark,
  Share2,
  BookMarked,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useLib } from '@/lib/library-context';
import surahsData from '@/data/surahs.json';

interface Ayah {
  numberInSurah: number;
  text: string;
}

interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  type: string;
  versesCount: number;
  ayahs: Ayah[];
}

const RECITERS = [
  { id: 'ar.alafasy', name: 'الشيخ مشاري راشد العفاسي', server: 'https://server8.mp3quran.net/afs/' },
  { id: 'ar.abdulbasitmurattal', name: 'الشيخ عبد الباسط عبد الصمد (مرتل)', server: 'https://server7.mp3quran.net/basit/' },
  { id: 'ar.minshawi', name: 'الشيخ محمد صديق المنشاوي', server: 'https://server10.mp3quran.net/minsh/' },
  { id: 'ar.husary', name: 'الشيخ محمود خليل الحصري', server: 'https://server13.mp3quran.net/husr/' },
  { id: 'ar.mahermuaiqly', name: 'الشيخ ماهر المعيقلي', server: 'https://server12.mp3quran.net/maher/' },
  { id: 'ar.sudais', name: 'الشيخ عبد الرحمن السديس', server: 'https://server11.mp3quran.net/sds/' },
];

export function QuranView() {
  const { go, tree, openSection } = useLib();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'meccan' | 'medinan'>('all');
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bookmarkedSurah, setBookmarkedSurah] = useState<number>(1);
  const [bookmarkedAyah, setBookmarkedAyah] = useState<number>(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('zad:quran_bookmark');
      if (saved) {
        const { surah, ayah } = JSON.parse(saved);
        setBookmarkedSurah(surah);
        setBookmarkedAyah(ayah);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const saveBookmark = (surahNum: number, ayahNum: number) => {
    setBookmarkedSurah(surahNum);
    setBookmarkedAyah(ayahNum);
    try {
      localStorage.setItem('zad:quran_bookmark', JSON.stringify({ surah: surahNum, ayah: ayahNum }));
    } catch {
      /* ignore */
    }
  };

  // Load Surah content when selected
  useEffect(() => {
    if (!selectedSurah) {
      setSurahDetail(null);
      return;
    }

    setLoadingSurah(true);
    let alive = true;

    // Fetch surah text from reliable Quran API
    fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}/quran-uthmani`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch surah');
        return res.json();
      })
      .then((data) => {
        if (!alive) return;
        if (data.code === 200 && data.data) {
          const s = data.data;
          setSurahDetail({
            number: s.number,
            name: s.name,
            englishName: s.englishName,
            type: s.revelationType === 'Meccan' ? 'مكية' : 'مدنية',
            versesCount: s.numberOfAyahs,
            ayahs: s.ayahs.map((a: { numberInSurah: number; text: string }) => ({
              numberInSurah: a.numberInSurah,
              text: a.text,
            })),
          });
        }
      })
      .catch(() => {
        // Fallback offline mock for popular surahs
        if (alive) {
          const sInfo = surahsData.find((s) => s.number === selectedSurah);
          if (sInfo) {
            setSurahDetail({
              number: sInfo.number,
              name: sInfo.name,
              englishName: sInfo.englishName,
              type: sInfo.type === 'meccan' ? 'مكية' : 'مدنية',
              versesCount: sInfo.versesCount,
              ayahs: [
                {
                  numberInSurah: 1,
                  text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
                },
              ],
            });
          }
        }
      })
      .finally(() => {
        if (alive) setLoadingSurah(false);
      });

    return () => {
      alive = false;
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
  }, [selectedSurah]);

  const filteredSurahs = surahsData.filter((s) => {
    const matchesSearch =
      s.name.includes(search) ||
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      String(s.number) === search.trim();
    const matchesType = filterType === 'all' || s.type === filterType;
    return matchesSearch && matchesType;
  });

  const getAudioUrl = (surahNum: number) => {
    const pad = String(surahNum).padStart(3, '0');
    return `${selectedReciter.server}${pad}.mp3`;
  };

  const togglePlayAudio = () => {
    if (!audioRef.current && selectedSurah) {
      audioRef.current = new Audio(getAudioUrl(selectedSurah));
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onerror = () => setIsPlaying(false);
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => setIsPlaying(false));
        setIsPlaying(true);
      }
    }
  };

  const openWaqfQuranSection = () => {
    const quranFolder = tree?.folders?.find((f) => f.name.includes('القرآن الكريم'));
    if (quranFolder) {
      openSection(quranFolder);
    } else {
      go('lib');
    }
  };

  return (
    <div className="wrap space-y-6 pt-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-pri">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">القرآن الكريم والتلاوات</h2>
            <p className="text-xs text-mut">المصحف الشريف كاملاً برسم المصحف العثماني مع التلاوات العطرة</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedSurah && (
            <button
              type="button"
              onClick={() => {
                setSelectedSurah(null);
                if (audioRef.current) {
                  audioRef.current.pause();
                  setIsPlaying(false);
                }
              }}
              className="btn gap-1 text-xs font-semibold hover:border-gold hover:text-pri"
            >
              <ArrowRight className="h-3.5 w-3.5" />
              <span>فهرس السور</span>
            </button>
          )}

          <button
            type="button"
            onClick={openWaqfQuranSection}
            className="btn gap-1 text-xs font-semibold hover:border-gold hover:text-pri"
            title="تصفح مجلدات المصحف والتفاسير في مكتبة الوقف"
          >
            <Layers className="h-3.5 w-3.5 text-gold" />
            <span>مكتبة التلاوات الوقفية</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: SURAH READER */}
      {selectedSurah && surahDetail ? (
        <div className="space-y-6">
          {/* Surah Header Card */}
          <div className="relative overflow-hidden rounded-[28px] border border-gold/40 bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 p-6 text-white shadow-xl md:p-8">
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 rounded-full border border-gold/40 bg-black/20 px-4 py-1 text-xs text-gold">
                <span>سورة {surahDetail.type}</span>
                <span>•</span>
                <span>{surahDetail.versesCount} آية</span>
                <span>•</span>
                <span>ترتيبها: {surahDetail.number}</span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold text-white md:text-4xl">
                سُورَةُ {surahDetail.name.replace(/^سورة\s*/, '')}
              </h1>
              <p className="mt-1 text-xs text-emerald-100/80">{surahDetail.englishName}</p>

              {/* Reciter & Audio Controls */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <select
                  value={selectedReciter.id}
                  onChange={(e) => {
                    const r = RECITERS.find((x) => x.id === e.target.value) || RECITERS[0];
                    setSelectedReciter(r);
                    if (audioRef.current) {
                      audioRef.current.pause();
                      setIsPlaying(false);
                      audioRef.current = null;
                    }
                  }}
                  className="rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs text-white focus:outline-none focus:border-gold"
                >
                  {RECITERS.map((r) => (
                    <option key={r.id} value={r.id} className="bg-brand-900 text-white">
                      {r.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={togglePlayAudio}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2 text-xs font-bold text-brand-900 shadow-md transition-transform hover:scale-105"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4" />
                      <span>إيقاف التلاوة</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 ms-0.5" />
                      <span>استماع للسورة</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Bismillah (except Surah 9 At-Tawbah) */}
          {selectedSurah !== 9 && (
            <div className="text-center py-4">
              <span className="font-serif text-2xl font-bold text-pri md:text-3xl">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </span>
            </div>
          )}

          {/* Verses Container */}
          {loadingSurah ? (
            <div className="grid place-items-center py-16 text-sm text-mut">جارٍ تحميل آيات السورة الكريمة...</div>
          ) : (
            <div className="rounded-3xl border border-line bg-card p-6 shadow-sm md:p-10">
              <div className="leading-[2.8] text-justify text-ink md:leading-[3.2]">
                {surahDetail.ayahs.map((ayah) => {
                  const isBookmarked =
                    bookmarkedSurah === selectedSurah && bookmarkedAyah === ayah.numberInSurah;

                  // Clean out redundant Bismillah in first verse if present
                  let text = ayah.text;
                  if (ayah.numberInSurah === 1 && selectedSurah !== 1 && selectedSurah !== 9) {
                    text = text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '');
                  }

                  return (
                    <span
                      key={ayah.numberInSurah}
                      className={`inline text-[19px] md:text-[22px] font-medium transition-colors ${
                        isBookmarked ? 'bg-amber-100 dark:bg-amber-950/40 rounded px-1' : ''
                      }`}
                    >
                      {text}{' '}
                      <button
                        type="button"
                        onClick={() => saveBookmark(selectedSurah, ayah.numberInSurah)}
                        title={`حفظ علامة عند الآية ${ayah.numberInSurah}`}
                        className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-gold/60 text-xs font-bold text-gold-700 bg-surface/50 hover:bg-gold hover:text-brand-900 mx-1 align-middle"
                      >
                        {ayah.numberInSurah}
                      </button>{' '}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* VIEW 2: SURAHS INDEX LIST */
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mut" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث باسم السورة، رقمها، أو اسمها اللاتيني..."
                className="w-full rounded-2xl border border-line bg-card py-2.5 pe-4 ps-10 text-xs text-ink placeholder:text-mut focus:border-gold focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-line bg-card p-1">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
                  filterType === 'all' ? 'bg-brand-700 text-white font-bold' : 'text-mut hover:text-ink'
                }`}
              >
                الكل (114)
              </button>
              <button
                type="button"
                onClick={() => setFilterType('meccan')}
                className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
                  filterType === 'meccan' ? 'bg-brand-700 text-white font-bold' : 'text-mut hover:text-ink'
                }`}
              >
                مكية
              </button>
              <button
                type="button"
                onClick={() => setFilterType('medinan')}
                className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
                  filterType === 'medinan' ? 'bg-brand-700 text-white font-bold' : 'text-mut hover:text-ink'
                }`}
              >
                مدنية
              </button>
            </div>
          </div>

          {/* Last read bookmark banner */}
          {bookmarkedSurah && (
            <div className="flex items-center justify-between rounded-2xl border border-gold/40 bg-gradient-to-r from-amber-500/10 via-card to-emerald-500/10 p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gold/20 text-gold-700">
                  <Bookmark className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink">موضع قراءتك الأخير</h4>
                  <p className="text-[11px] text-mut">
                    سورة {surahsData.find((s) => s.number === bookmarkedSurah)?.name} • الآية {bookmarkedAyah}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSurah(bookmarkedSurah)}
                className="btn text-xs font-bold text-pri hover:border-gold"
              >
                متابعة التلاوة
              </button>
            </div>
          )}

          {/* Surahs Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSurahs.map((surah) => (
              <button
                key={surah.number}
                type="button"
                onClick={() => setSelectedSurah(surah.number)}
                className="group flex items-center justify-between rounded-2xl border border-line bg-card p-4 text-start shadow-sm transition-all hover:border-gold hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-surface font-mono text-xs font-extrabold text-pri group-hover:bg-brand-50">
                    {surah.number}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ink group-hover:text-pri">
                      سورة {surah.name}
                    </h3>
                    <p className="text-[11px] text-mut">
                      {surah.type === 'meccan' ? 'مكية' : 'مدنية'} • {surah.versesCount} آيات • جزء {surah.juz}
                    </p>
                  </div>
                </div>

                <div className="text-end">
                  <span className="font-serif text-lg font-bold text-gold-700 group-hover:text-gold">
                    {surah.name}
                  </span>
                  <p className="text-[10px] text-mut">ص {surah.page}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
