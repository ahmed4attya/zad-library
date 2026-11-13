/** رسوم زخرفية للبانر الرئيسي: مسجد، ومصحف على رحلة مع فانوس */
export function MosqueArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 170" className={className} aria-hidden="true" style={{ fill: 'var(--pri)' }}>
      <circle cx="262" cy="34" r="22" opacity=".25" />
      <rect x="0" y="150" width="320" height="20" />
      <rect x="88" y="120" width="144" height="32" />
      <path d="M110 120A50 50 0 0 1 210 120Z" />
      <rect x="157" y="56" width="6" height="14" />
      <circle cx="160" cy="52" r="5" />
      <path d="M80 120A24 24 0 0 1 128 120Z" />
      <path d="M192 120A24 24 0 0 1 240 120Z" />
      <rect x="52" y="46" width="14" height="106" />
      <path d="M48 46L59 22 70 46Z" />
      <rect x="254" y="46" width="14" height="106" />
      <path d="M250 46L261 22 272 46Z" />
      <rect x="20" y="104" width="10" height="48" opacity=".6" />
      <path d="M17 104L25 88 33 104Z" opacity=".6" />
    </svg>
  );
}

export function QuranArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 190" className={className} aria-hidden="true">
      <circle cx="226" cy="76" r="30" fill="#C9A24A" opacity=".28" />
      <path d="M226 14v22" stroke="#9A7A2A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M212 36h28l-5 12h-18z" fill="#B8892A" />
      <path d="M214 48h24v44h-24z" fill="#C9A24A" opacity=".85" stroke="#8A6A1E" strokeWidth="2" />
      <path d="M220 54h12v32h-12z" fill="#FFF3C4" opacity=".8" />
      <path d="M210 92h32v8h-32z" fill="#8A6A1E" />
      <path d="M40 112q45-14 90 0v44q-45-14-90 0z" fill="#FFFCF2" stroke="#C9A24A" strokeWidth="2" />
      <path d="M130 112q45-14 90 0v44q-45-14-90 0z" fill="#FBF6E6" stroke="#C9A24A" strokeWidth="2" />
      <path d="M130 112v44" stroke="#C9A24A" strokeWidth="2" />
      <path d="M54 124q32-8 62 0M54 134q32-8 62 0M54 144q32-8 62 0M144 124q32-8 62 0M144 134q32-8 62 0M144 144q32-8 62 0"
        stroke="#14573A" strokeWidth="2" fill="none" opacity=".5" strokeLinecap="round" />
      <path d="M70 156l60 24 60-24" fill="none" stroke="#8A5A2B" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
