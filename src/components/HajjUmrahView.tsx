'use client';

import { useState } from 'react';
import {
  Compass,
  RotateCcw,
  Sparkles,
  Footprints,
  BookOpen,
  Volume2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  Award,
} from 'lucide-react';
import { useLib } from '@/lib/library-context';

export function HajjUmrahView() {
  const { toast } = useLib();
  const [activeTab, setActiveTab] = useState<'tawaf' | 'sai' | 'umrah_guide' | 'hajj_guide'>('tawaf');

  // Tawaf state
  const [tawafRound, setTawafRound] = useState<number>(1);
  const [tawafCompleted, setTawafCompleted] = useState<boolean>(false);

  // Sa'i state
  const [saiRound, setSaiRound] = useState<number>(1);
  const [saiCompleted, setSaiCompleted] = useState<boolean>(false);

  // Haptic feedback
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([80, 40, 80]);
      } catch {
        /* ignore */
      }
    }
  };

  const nextTawaf = () => {
    triggerHaptic();
    if (tawafRound < 7) {
      setTawafRound((r) => r + 1);
      toast(`اكتمل الشوط ${tawafRound} — ابدأ الشوط ${tawafRound + 1}`);
    } else {
      setTawafCompleted(true);
      toast('الحمد لله! أتممت أشواط الطواف السبعة كاملة');
    }
  };

  const resetTawaf = () => {
    setTawafRound(1);
    setTawafCompleted(false);
    toast('تم إعادة ضبط عداد الطواف');
  };

  const nextSai = () => {
    triggerHaptic();
    if (saiRound < 7) {
      setSaiRound((r) => r + 1);
      toast(`اكتمل الشوط ${saiRound} — ابدأ الشوط ${saiRound + 1}`);
    } else {
      setSaiCompleted(true);
      toast('الحمد لله! أتممت أشواط السعي السبعة بنجاح');
    }
  };

  const resetSai = () => {
    setSaiRound(1);
    setSaiCompleted(false);
    toast('تم إعادة ضبط عداد السعي');
  };

  const TAWAF_DUAS = [
    {
      title: 'الشوط الأول',
      dua: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ. اللَّهُمَّ إِيمَانًا بِكَ وَتَصْدِيقًا بِكِتَابِكَ وَوَفَاءً بِعَهْدِكَ وَاتِّبَاعًا لِسُنَّةِ نَبِيِّكَ مُحَمَّدٍ ﷺ.',
      sunnah: 'البدء من محاذاة الحجر الأسود بالتكبير (بسم الله، والله أكبر) وجعل الكعبة عن يسارك.',
    },
    {
      title: 'الشوط الثاني',
      dua: 'اللَّهُمَّ إِنَّ هَذَا البَيْتَ بَيْتُكَ، وَالحَرَمَ حَرَمُكَ، وَالأَمْنَ أَمْنُكَ، اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَأَدْخِلْنِي الجَنَّةَ بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ.',
      sunnah: 'الإكثار من الذكر والاستغفار، والدعاء بين الركن اليماني والحجر الأسود بدعاء (ربنا آتنا في الدنيا حسنة...).',
    },
    {
      title: 'الشوط الثالث',
      dua: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الشَّكِّ وَالشِّرْكِ وَالشِّقَاقِ وَالنِّفَاقِ وَسُوءِ الأَخْلاقِ، وَسُوءِ المُنْقَلَبِ فِي المَالِ وَالأَهْلِ وَالوَلَدِ.',
      sunnah: 'الطواف يكون من وراء الحِجر (حجر إسماعيل) لأن الحجر من الكعبة.',
    },
    {
      title: 'الشوط الرابع',
      dua: 'اللَّهُمَّ اجْعَلْهُ حَجّاً مَبْرُوراً، وَسَعْياً مَشْكُوراً، وَذَنْباً مَغْفُوراً، وَعَمَلاً صَالِحاً مَقْبُولاً، وَتِجَارَةً لَنْ تَبُورَ، يَا عَالِمَ مَا فِي الصُّدُورِ.',
      sunnah: 'يجوز الطواف راكباً أو على العربة لعذر أو مشقة أو كبر سن.',
    },
    {
      title: 'الشوط الخامس',
      dua: 'اللَّهُمَّ ظَلِّلْنِي تَحْتَ ظِلِّ عَرْشِكَ يَوْمَ لا ظِلَّ إِلا ظِلُّكَ، وَاسْقِنِي مِنْ حَوْضِ نَبِيِّكَ مُحَمَّدٍ ﷺ شَرْبَةً هَنِيئَةً لا أَظْمَأُ بَعْدَهَا أَبَداً.',
      sunnah: 'استحضار عظمة الموقف والافتقار إلى الله والتضرع بصالح الدعاء للنفس والوالدين والمسلمين.',
    },
    {
      title: 'الشوط السادس',
      dua: 'اللَّهُمَّ إِنَّ لَكَ عَلَيَّ حُقُوقاً كَثِيرَةً فِيمَا بَيْنِي وَبَيْنَكَ، وَحُقُوقاً كَثِيرَةً فِيمَا بَيْنِي وَبَيْنَ خَلْقِكَ، اللَّهُمَّ مَا كَانَ لَكَ فَاغْفِرْهُ لِي، وَمَا كَانَ لِخَلْقِكَ فَتَحَمَّلْهُ عَنِّي.',
      sunnah: 'عدم مزاحمة الطائفين والتزام السكينة والوقار وخفض الصوت بالدعاء.',
    },
    {
      title: 'الشوط السابع',
      dua: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ إِيمَاناً كَامِلاً، وَيَقِيناً صَادِقاً، وَرِزْقاً وَاسِعاً، وَقَلْباً خَاشِعاً، وَلِسَاناً ذَاكِراً، وَتَوْبَةً نَصُوحاً قَبْلَ المَوْتِ وَرَاحَةً عِنْدَ المَوْتِ وَمَغْفِرَةً بَعْدَ المَوْتِ.',
      sunnah: 'عند ختام الشوط السابع: التوجه لمقام إبراهيم وصلاة ركعتين خفيفتين ثم الشرب من ماء زمزم والتضلع منه.',
    },
  ];

  const SAI_ROUNDS = [
    { num: 1, from: 'الصفا', to: 'المروة' },
    { num: 2, from: 'المروة', to: 'الصفا' },
    { num: 3, from: 'الصفا', to: 'المروة' },
    { num: 4, from: 'المروة', to: 'الصفا' },
    { num: 5, from: 'الصفا', to: 'المروة' },
    { num: 6, from: 'المروة', to: 'الصفا' },
    { num: 7, from: 'الصفا', to: 'المروة' },
  ];

  return (
    <div className="wrap space-y-6 pt-4 max-w-4xl mx-auto px-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-card p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0F2D1F] text-gold">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">دليل ومناسك الحج والعمرة التفاعلي</h2>
            <p className="text-xs text-mut">عدادات الطواف والسعي الذكية، الأدعية المأثورة، ومناسك البيت الحرام</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 rounded-xl border border-line bg-surface p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('tawaf')}
            className={`rounded-lg px-3 py-1.5 transition-all ${
              activeTab === 'tawaf'
                ? 'bg-brand-700 text-white shadow-xs'
                : 'text-mut hover:text-ink'
            }`}
          >
            عداد الطواف (٧)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sai')}
            className={`rounded-lg px-3 py-1.5 transition-all ${
              activeTab === 'sai'
                ? 'bg-brand-700 text-white shadow-xs'
                : 'text-mut hover:text-ink'
            }`}
          >
            عداد السعي (٧)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('umrah_guide')}
            className={`rounded-lg px-3 py-1.5 transition-all ${
              activeTab === 'umrah_guide'
                ? 'bg-brand-700 text-white shadow-xs'
                : 'text-mut hover:text-ink'
            }`}
          >
            مناسك العمرة
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hajj_guide')}
            className={`rounded-lg px-3 py-1.5 transition-all ${
              activeTab === 'hajj_guide'
                ? 'bg-brand-700 text-white shadow-xs'
                : 'text-mut hover:text-ink'
            }`}
          >
            مناسك الحج
          </button>
        </div>
      </div>

      {/* ---------- TAB 1: TAWAF COUNTER ---------- */}
      {activeTab === 'tawaf' && (
        <div className="space-y-5 animate-in fade-in">
          {/* Active Round Card */}
          <div className="relative overflow-hidden rounded-[28px] border border-gold/40 bg-gradient-to-br from-[#0F2D1F] via-[#163A29] to-[#0A1F15] p-6 text-white shadow-xl text-center md:p-8">
            <div className="flex items-center justify-between max-w-sm mx-auto mb-3">
              <span className="text-xs font-bold text-emerald-200">طواف البيت العتيق</span>
              <button
                type="button"
                onClick={resetTawaf}
                className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] text-white hover:bg-white/20"
              >
                <RotateCcw className="h-3 w-3" />
                <span>إعادة البدء</span>
              </button>
            </div>

            {!tawafCompleted ? (
              <>
                <p className="text-xs text-gold font-bold">الشوط الحالي</p>
                <div className="font-mono text-7xl font-black text-amber-300 my-2">
                  {tawafRound} <span className="text-2xl text-white/70">/ ٧</span>
                </div>

                <div className="flex justify-center gap-1.5 my-4">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <span
                      key={num}
                      className={`h-2 rounded-full transition-all ${
                        num === tawafRound
                          ? 'w-8 bg-amber-400'
                          : num < tawafRound
                          ? 'w-4 bg-emerald-400'
                          : 'w-4 bg-white/20'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={nextTawaf}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-4 text-base font-extrabold text-[#0F2D1F] shadow-lg shadow-black/30 hover:brightness-105 active:scale-95 transition-all w-full max-w-xs"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span>أتممت الشوط {tawafRound} (اضغط هنا)</span>
                </button>
              </>
            ) : (
              <div className="py-6 space-y-3">
                <div className="h-14 w-14 rounded-full bg-amber-400 text-[#0F2D1F] grid place-items-center mx-auto text-2xl font-black">
                  ✓
                </div>
                <h3 className="text-2xl font-extrabold text-white">طواف مبارك وسعي مشكور!</h3>
                <p className="text-xs text-emerald-100/90 max-w-md mx-auto leading-relaxed">
                  أتممت الأشواط السبعة كاملة بحمد الله. يتوجه الطائف الآن خلف مقام إبراهيم لصلاة ركعتين خفيفتين (يقرأ بالكافرون والإخلاص)، ثم الشرب من ماء زمزم، ثم التوجه إلى الصفا لبدء السعي.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('sai')}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-2.5 text-xs font-bold text-[#0F2D1F]"
                >
                  <span>الانتقال إلى عداد السعي (الصفا والمروة)</span>
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Current Round Dua & Etiquette */}
          <div className="rounded-3xl border border-line bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-line pb-3 mb-3">
              <Sparkles className="h-4 w-4 text-gold" />
              <h3 className="text-sm font-bold text-ink">
                دعاء ومأثور الشوط {tawafCompleted ? 7 : tawafRound}
              </h3>
            </div>

            <p className="font-serif text-base text-ink leading-loose p-4 rounded-2xl bg-amber-500/5 border border-gold/30">
              {TAWAF_DUAS[(tawafCompleted ? 7 : tawafRound) - 1].dua}
            </p>

            <div className="mt-4 flex items-start gap-2 text-xs text-mut leading-relaxed">
              <Info className="h-4 w-4 shrink-0 text-gold mt-0.5" />
              <span>{TAWAF_DUAS[(tawafCompleted ? 7 : tawafRound) - 1].sunnah}</span>
            </div>
          </div>
        </div>
      )}

      {/* ---------- TAB 2: SAI COUNTER ---------- */}
      {activeTab === 'sai' && (
        <div className="space-y-5 animate-in fade-in">
          <div className="relative overflow-hidden rounded-[28px] border border-gold/40 bg-gradient-to-br from-[#0F2D1F] via-[#163A29] to-[#0A1F15] p-6 text-white shadow-xl text-center md:p-8">
            <div className="flex items-center justify-between max-w-sm mx-auto mb-3">
              <span className="text-xs font-bold text-emerald-200">السعي بين الصفا والمروة</span>
              <button
                type="button"
                onClick={resetSai}
                className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] text-white hover:bg-white/20"
              >
                <RotateCcw className="h-3 w-3" />
                <span>إعادة البدء</span>
              </button>
            </div>

            {!saiCompleted ? (
              <>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs text-gold mb-2 font-bold">
                  <span>من: {SAI_ROUNDS[saiRound - 1].from}</span>
                  <span>➔</span>
                  <span>إلى: {SAI_ROUNDS[saiRound - 1].to}</span>
                </div>

                <div className="font-mono text-7xl font-black text-amber-300 my-2">
                  {saiRound} <span className="text-2xl text-white/70">/ ٧</span>
                </div>

                <div className="flex justify-center gap-1.5 my-4">
                  {SAI_ROUNDS.map((r) => (
                    <span
                      key={r.num}
                      className={`h-2 rounded-full transition-all ${
                        r.num === saiRound
                          ? 'w-8 bg-amber-400'
                          : r.num < saiRound
                          ? 'w-4 bg-emerald-400'
                          : 'w-4 bg-white/20'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={nextSai}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-4 text-base font-extrabold text-[#0F2D1F] shadow-lg shadow-black/30 hover:brightness-105 active:scale-95 transition-all w-full max-w-xs"
                >
                  <Footprints className="h-5 w-5" />
                  <span>وصلت إلى {SAI_ROUNDS[saiRound - 1].to} (سجل الشوط)</span>
                </button>
              </>
            ) : (
              <div className="py-6 space-y-3">
                <div className="h-14 w-14 rounded-full bg-amber-400 text-[#0F2D1F] grid place-items-center mx-auto text-2xl font-black">
                  ✓
                </div>
                <h3 className="text-2xl font-extrabold text-white">تقبل الله عمرتك وسعيك!</h3>
                <p className="text-xs text-emerald-100/90 max-w-md mx-auto leading-relaxed">
                  أتممت أشواط السعي السبعة كاملة حيث ينتهي الشوط السابع عند المروة. يتوجه المعتمر الآن للحلق أو التقصير (والتقصير يعم جميع شعر الرأس) وبذلك يتحلل تحللاً كاملاً وتتم العمرة بحمد الله.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-line bg-card p-6 shadow-sm">
            <h3 className="text-sm font-bold text-ink mb-3">سنة ودعاء الصفا والمروة المأثور</h3>
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-gold/30 space-y-3 text-xs leading-relaxed text-ink">
              <p className="font-serif text-sm font-bold text-pri">
                «إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ ۖ أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ»
              </p>
              <p>
                ثم يستقبل الكعبة ويوحد الله ويكبره ويقول: «لا إِلَهَ إِلا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، لا إِلَهَ إِلا اللَّهُ وَحْدَهُ، أَنْجَزَ وَعْدَهُ، وَنَصَرَ عَبْدَهُ، وَهَزَمَ الأَحْزَابَ وَحْدَهُ» (ثلاث مرات ويدعو بينها).
              </p>
              <p className="text-mut text-[11px] border-t border-line/40 pt-2">
                * يسن للرجال فقط الهرولة والركض الخفيف بين العلمين الأخضرين في المسعى، والمشي العادي في بقية المسار.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------- TAB 3: UMRAH GUIDE ---------- */}
      {activeTab === 'umrah_guide' && (
        <div className="rounded-3xl border border-line bg-card p-6 shadow-sm space-y-4 animate-in fade-in">
          <h3 className="text-base font-bold text-ink mb-2">أركان ومناسك العمرة خطوة بخطوة</h3>

          {[
            {
              step: '١. الإحرام من الميقات',
              desc: 'الاغتسال والتطيب في البدن ولبس ثياب الإحرام، ثم نية الدخول في النسك بقول: (لَبَّيْكَ عُمْرَةً). وتستمر التلبية حتى رؤية البيت الحرام.',
            },
            {
              step: '٢. الطواف بالبيت (٧ أشواط)',
              desc: 'الابتداء بمحاذاة الحجر الأسود بالتكبير، وجعل الكعبة عن اليسار، والاضطباع والرمل في الثلاثة الأولى للرجال، وختام كل شوط بالحجر الأسود.',
            },
            {
              step: '٣. صلاة ركعتين والشرب من زمزم',
              desc: 'صلاة ركعتين خفيفتين خلف مقام إبراهيم (أو في أي مكان من الحرم عند الزحام)، ثم التضلع من ماء زمزم والدعاء عنده بما فتح الله.',
            },
            {
              step: '٤. السعي بين الصفا والمروة (٧ أشواط)',
              desc: 'يبدأ من الصفا وينتهي بالمروة، كل ذهاب شوط وكل إياب شوط، مع الذكر المأثور عند الصعود على الصفا والمروة.',
            },
            {
              step: '٥. الحلق أو التقصير (التحلل)',
              desc: 'حلق شعر الرأس كاملاً أو تقصيره من كافة جوانب الرأس للرجال (والحلق أفضل)، وتقصير قيد أنملة للمرأة من ضفائرها، وبذلك تمت العمرة.',
            },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4 p-4 rounded-2xl border border-line/70 bg-surface/40">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand-700 font-bold text-white text-xs">
                {idx + 1}
              </span>
              <div>
                <h4 className="text-sm font-bold text-ink">{item.step}</h4>
                <p className="mt-1 text-xs text-mut leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------- TAB 4: HAJJ GUIDE ---------- */}
      {activeTab === 'hajj_guide' && (
        <div className="rounded-3xl border border-line bg-card p-6 shadow-sm space-y-4 animate-in fade-in">
          <h3 className="text-base font-bold text-ink mb-2">رحلة الحج ومراحله بالأيام المباركة</h3>

          {[
            {
              day: 'يوم التروية (٨ ذو الحجة)',
              action: 'الإحرام بالحج صباحاً والتوجه إلى منى وصلاة الظهر والعصر والمغرب والعشاء وفجر التاسع قصراً بلا جمع، والمبيت بها سنة مؤكدة.',
            },
            {
              day: 'يوم عرفة الركن الأعظم (٩ ذو الحجة)',
              action: 'التوجه إلى عرفات بعد شروق الشمس، والجمع بين الظهر والعصر جمع تقديم وقصراً، واستغلال الوقت بالتضرع والدعاء والذكر حتى غروب الشمس.',
            },
            {
              day: 'ليلة المزدلفة (ليلة النحر)',
              action: 'الإفاضة إلى المزدلفة بعد الغروب بسكينة، وصلاة المغرب والعشاء جمع تأخير، والمبيت بها والتقاط حصى الجمار، وصلاة الفجر بمزدلفة.',
            },
            {
              day: 'يوم النحر الأكبر (١٠ ذو الحجة)',
              action: 'رمي جمرة العقبة الكبرى بـ 7 حصيات، ثم ذبح الهدي، ثم الحلق أو التقصير (التحلل الأول)، ثم طواف الإفاضة والسعي (التحلل الأكبر).',
            },
            {
              day: 'أيام التشريق (١١، ١٢، ١٣ ذو الحجة)',
              action: 'المبيت بمنى ورمي الجمرات الثلاث (الصغرى، الوسطى، الكبرى) بعد الزوال كل يوم بـ 7 حصيات لكل جمرة، والتعجل في اليوم الثاني عشر جائز.',
            },
            {
              day: 'طواف الوداع',
              action: 'آخر عهد الحاج بالبيت الحرام قبل السفر مباشرة، وهو واجب على كل حاج عدا الحائض والنفساء.',
            },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4 p-4 rounded-2xl border border-gold/30 bg-amber-500/5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gold text-[#0F2D1F] font-bold text-xs">
                {idx + 1}
              </span>
              <div>
                <h4 className="text-sm font-bold text-ink">{item.day}</h4>
                <p className="mt-1 text-xs text-mut leading-relaxed">{item.action}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
