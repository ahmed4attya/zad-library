import type { IconName } from '@/components/Icon';

/** ألوان بلاطات الأقسام بترتيب التصميم: أخضر داكن، أخضر، بني، أزرق، أخضر فاتح، بنفسجي، عسلي */
export const TILES: [string, string][] = [
  ['#16603E', '#0B3D27'],
  ['#2F8A5B', '#1F6B42'],
  ['#A86B3C', '#7D4A24'],
  ['#4C7DA8', '#36607F'],
  ['#3B9B64', '#2A7A4B'],
  ['#7C4DB0', '#5B3688'],
  ['#B98544', '#93622B'],
];

const RULES: [RegExp, IconName][] = [
  [/قرآن|قران|مصحف/, 'quran'],
  [/رقي/, 'shield'],
  [/تسجيل|محاضر|درس|صوت/, 'mic'],
  [/[إاأ]بتهال|عقيدة|لغة/, 'feather'],
  [/[آاأ]ذان|فقه|مسجد|سيرة/, 'mosque'],
  [/حديث|شعراوي|موسوعة/, 'layers'],
  [/تفسير|كتب|قصص|تراث/, 'lib'],
];
const FALLBACK: IconName[] = ['lib', 'layers', 'mosque', 'feather'];

export function iconFor(name: string, i: number): IconName {
  for (const [r, n] of RULES) if (r.test(name)) return n;
  return FALLBACK[i % FALLBACK.length] ?? 'lib';
}
