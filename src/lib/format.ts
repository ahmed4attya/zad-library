import type { Item } from './types';

export const nf = (n: number) => Number(n).toLocaleString('ar-EG');

export const tf = (s: number) => {
  if (!isFinite(s)) return '0:00';
  const t = Math.floor(s);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};

export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function streak(days: Record<string, number>): number {
  const d = new Date();
  if (!((days[dayKey(d)] ?? 0) > 0)) d.setDate(d.getDate() - 1);
  let n = 0;
  while ((days[dayKey(d)] ?? 0) > 0 && n < 1000) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function greet(): string {
  const h = new Date().getHours();
  return h >= 5 && h < 12 ? 'صباح الخير' : h < 17 ? 'نهارك سعيد' : 'مساء الخير';
}

export function kindLabel(i: Item): string {
  if (i.kind === 'pdf') return 'PDF';
  if (i.kind === 'audio') {
    const e = /\.(\w+)$/.exec(i.name)?.[1];
    return e ? e.toUpperCase() : 'صوت';
  }
  return 'ملف';
}

export const driveDownload = (id: string) => `https://drive.google.com/uc?export=download&id=${id}`;
export const drivePreview = (id: string) => `https://drive.google.com/file/d/${id}/preview`;
export const driveView = (id: string) => `https://drive.google.com/file/d/${id}/view`;
