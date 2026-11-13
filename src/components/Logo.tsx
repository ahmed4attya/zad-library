export function Emblem({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M24 3v6" stroke="#C9A24A" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="3.5" r="1.6" fill="#C9A24A" />
      <path
        d="M12 27c0-9 5-15 12-17 7 2 12 8 12 17z"
        style={{ fill: 'var(--b700)' }}
        stroke="#C9A24A"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M4 29c7-3 14-1 20 4 6-5 13-7 20-4v11c-7-3-14-1-20 4-6-5-13-7-20-4z"
        style={{ fill: 'var(--b800)' }}
        stroke="#C9A24A"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M24 33v11" stroke="#C9A24A" strokeWidth="1.4" />
    </svg>
  );
}

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <Emblem />
      <div className="text-start leading-tight">
        <div className="text-[22px] font-extrabold text-pri">زاد المسلم</div>
        <div className="text-[10px] font-semibold text-mut">المكتبة الإسلامية الشاملة</div>
      </div>
    </div>
  );
}
