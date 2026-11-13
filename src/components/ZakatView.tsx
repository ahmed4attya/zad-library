'use client';

import { useState } from 'react';
import {
  Coins,
  DollarSign,
  Info,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';

export function ZakatView() {
  // Cash
  const [cash, setCash] = useState<number>(0);

  // Gold
  const [gold24Grams, setGold24Grams] = useState<number>(0);
  const [gold21Grams, setGold21Grams] = useState<number>(0);
  const [gold18Grams, setGold18Grams] = useState<number>(0);
  const [goldPricePerGram24, setGoldPricePerGram24] = useState<number>(315); // Example SAR/AED or USD equivalent

  // Silver
  const [silverGrams, setSilverGrams] = useState<number>(0);
  const [silverPricePerGram, setSilverPricePerGram] = useState<number>(3.8);

  // Business & Investments
  const [tradeGoods, setTradeGoods] = useState<number>(0);
  const [stocks, setStocks] = useState<number>(0);

  // Debts to deduct
  const [debts, setDebts] = useState<number>(0);

  // Calculation formulas
  // Convert 21k and 18k into 24k equivalent
  const totalGold24Equivalent =
    gold24Grams + gold21Grams * (21 / 24) + gold18Grams * (18 / 24);
  const totalGoldValue = totalGold24Equivalent * goldPricePerGram24;
  const totalSilverValue = silverGrams * silverPricePerGram;

  const totalAssets = cash + totalGoldValue + totalSilverValue + tradeGoods + stocks;
  const netZakatableWealth = Math.max(0, totalAssets - debts);

  // Gold Nisab: 85 grams of 24k gold
  const goldNisabValue = 85 * goldPricePerGram24;
  const isAboveNisab = netZakatableWealth >= goldNisabValue;

  // Zakat rate is 2.5% (ربع العشر)
  const zakatDue = isAboveNisab ? netZakatableWealth * 0.025 : 0;

  const handleReset = () => {
    setCash(0);
    setGold24Grams(0);
    setGold21Grams(0);
    setGold18Grams(0);
    setSilverGrams(0);
    setTradeGoods(0);
    setStocks(0);
    setDebts(0);
  };

  return (
    <div className="wrap space-y-6 pt-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-pri">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">حاسبة الزكاة الشرعية</h2>
            <p className="text-xs text-mut">احسب زكاة أموالك والذهب والفضة والأسهم وعروض التجارة بدقة وسهولة</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="btn gap-1 text-xs font-semibold hover:border-gold hover:text-pri"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>تصفير الحقول</span>
        </button>
      </div>

      {/* Main Result Card */}
      <div className="relative overflow-hidden rounded-[28px] border border-gold/40 bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 p-6 text-white shadow-xl md:p-8">
        <div className="relative z-10 flex flex-col items-center text-center">
          <span className="rounded-full border border-gold/40 bg-black/20 px-4 py-1 text-xs text-gold">
            {isAboveNisab ? (
              <span className="flex items-center gap-1.5 text-amber-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>بلغ النصاب الشرعي وجبت فيه الزكاة</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-200">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>لم يبلغ النصاب بعد (أقل من {goldNisabValue.toLocaleString('ar-EG', { maximumFractionDigits: 0 })})</span>
              </span>
            )}
          </span>

          <span className="mt-4 text-xs text-emerald-100/80">المقدار الشرعي الواجب إخراجه (2.5%)</span>
          <div className="mt-2 font-mono text-5xl font-black text-amber-300 md:text-6xl">
            {zakatDue.toLocaleString('ar-EG', { maximumFractionDigits: 2 })}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-sm text-center">
            <div className="rounded-xl border border-white/15 bg-black/30 p-2.5">
              <span className="text-[11px] text-white/60">إجمالي الوعاء الزكوي</span>
              <p className="font-mono text-sm font-bold text-white">
                {netZakatableWealth.toLocaleString('ar-EG', { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="rounded-xl border border-white/15 bg-black/30 p-2.5">
              <span className="text-[11px] text-white/60">قيمة النصاب (85 جرام ذهب 24)</span>
              <p className="font-mono text-sm font-bold text-gold">
                {goldNisabValue.toLocaleString('ar-EG', { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Inputs Form */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Cash & Bank */}
        <div className="rounded-2xl border border-line bg-card p-5 shadow-sm space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
            <DollarSign className="h-4 w-4 text-gold" />
            <span>السيولة النقدية والأرصدة البنكية</span>
          </h3>

          <div>
            <label className="text-xs text-mut">الأموال النقدية والودائع بالحسابات</label>
            <input
              type="number"
              min="0"
              value={cash || ''}
              onChange={(e) => setCash(Number(e.target.value) || 0)}
              placeholder="0"
              className="mt-1.5 w-full rounded-xl border border-line bg-surface p-2.5 text-xs text-ink focus:border-gold focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-xs text-mut">عروض التجارة والبضائع للبيع</label>
            <input
              type="number"
              min="0"
              value={tradeGoods || ''}
              onChange={(e) => setTradeGoods(Number(e.target.value) || 0)}
              placeholder="0"
              className="mt-1.5 w-full rounded-xl border border-line bg-surface p-2.5 text-xs text-ink focus:border-gold focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-xs text-mut">الأسهم والصناديق الاستثمارية</label>
            <input
              type="number"
              min="0"
              value={stocks || ''}
              onChange={(e) => setStocks(Number(e.target.value) || 0)}
              placeholder="0"
              className="mt-1.5 w-full rounded-xl border border-line bg-surface p-2.5 text-xs text-ink focus:border-gold focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-xs text-rose-600 dark:text-rose-400">الديون العاجلة الواجبة السداد عليك (تُخصم)</label>
            <input
              type="number"
              min="0"
              value={debts || ''}
              onChange={(e) => setDebts(Number(e.target.value) || 0)}
              placeholder="0"
              className="mt-1.5 w-full rounded-xl border border-rose-300 dark:border-rose-900 bg-surface p-2.5 text-xs text-ink focus:border-rose-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Gold & Silver */}
        <div className="rounded-2xl border border-line bg-card p-5 shadow-sm space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
            <Coins className="h-4 w-4 text-gold" />
            <span>الذهب والفضة (المدخر للزكاة)</span>
          </h3>

          <div>
            <div className="flex justify-between items-center text-xs text-mut">
              <span>سعر جرام الذهب عيار 24 (بعملتك)</span>
            </div>
            <input
              type="number"
              min="0"
              value={goldPricePerGram24 || ''}
              onChange={(e) => setGoldPricePerGram24(Number(e.target.value) || 0)}
              className="mt-1.5 w-full rounded-xl border border-line bg-surface p-2 text-xs text-ink focus:border-gold focus:outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] text-mut">ذهب عيار 24 (جرام)</label>
              <input
                type="number"
                min="0"
                value={gold24Grams || ''}
                onChange={(e) => setGold24Grams(Number(e.target.value) || 0)}
                placeholder="0"
                className="mt-1 w-full rounded-xl border border-line bg-surface p-2 text-xs text-ink focus:border-gold focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-mut">ذهب عيار 21 (جرام)</label>
              <input
                type="number"
                min="0"
                value={gold21Grams || ''}
                onChange={(e) => setGold21Grams(Number(e.target.value) || 0)}
                placeholder="0"
                className="mt-1 w-full rounded-xl border border-line bg-surface p-2 text-xs text-ink focus:border-gold focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-mut">ذهب عيار 18 (جرام)</label>
              <input
                type="number"
                min="0"
                value={gold18Grams || ''}
                onChange={(e) => setGold18Grams(Number(e.target.value) || 0)}
                placeholder="0"
                className="mt-1 w-full rounded-xl border border-line bg-surface p-2 text-xs text-ink focus:border-gold focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <div>
              <label className="text-[11px] text-mut">الفضة (بالجرام)</label>
              <input
                type="number"
                min="0"
                value={silverGrams || ''}
                onChange={(e) => setSilverGrams(Number(e.target.value) || 0)}
                placeholder="0"
                className="mt-1 w-full rounded-xl border border-line bg-surface p-2 text-xs text-ink focus:border-gold focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-mut">سعر جرام الفضة</label>
              <input
                type="number"
                min="0"
                value={silverPricePerGram || ''}
                onChange={(e) => setSilverPricePerGram(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-xl border border-line bg-surface p-2 text-xs text-ink focus:border-gold focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fiqh Guidance Card */}
      <div className="rounded-2xl border border-line bg-surface/70 p-5">
        <h4 className="flex items-center gap-2 text-xs font-bold text-pri">
          <Info className="h-4 w-4 text-gold" />
          <span>تنبيهات فقهية مهمة في الزكاة</span>
        </h4>
        <ul className="mt-3 space-y-2 text-xs text-mut leading-relaxed list-disc list-inside">
          <li>يشترط لوجوب الزكاة في المال والذهب وعروض التجارة بلوغ النصاب وحولان الحول (مرور عام هجري كامل).</li>
          <li>ذهب الزينة الشخصية المعتاد للمرأة بدون إسراف فيه خلاف بين الفقهاء، وجمهورهم على عدم وجوب الزكاة فيه، والأحوط إخراجها.</li>
          <li>نصاب الذهب الشرعي هو 85 جراماً من الذهب الخالص (عيار 24)، ونصاب الفضة 595 جراماً.</li>
        </ul>
      </div>
    </div>
  );
}
