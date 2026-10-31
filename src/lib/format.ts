import type { Item } from './types';

/** أرقام لاتينية كما في التصميم */
export const nf = (n: number) => String(n);

export const tf = (s: number) => {
  if (!isFinite(s)) return '0:00';
  const t = Math.floor(s);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};

/** يحذف الترقيم البادئ مثل "١- " أو "5. " من اسم المجلد */
export const cleanName = (s: string) => s.replace(/^[\d٠-٩]+\s*[-–.]\s*/, '').trim() || s;

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
