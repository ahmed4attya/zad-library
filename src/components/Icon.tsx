const P = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  lib: '<path d="M4 4h6a2 2 0 012 2v14a2 2 0 00-2-2H4z"/><path d="M20 4h-6a2 2 0 00-2 2v14a2 2 0 012-2h6z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
  play: '<path d="M7 4l13 8-13 8z"/>',
  pause: '<path d="M7 4h4v16H7zM13 4h4v16h-4z"/>',
  next: '<path d="M5 5l10 7-10 7zM19 5v14"/>',
  prev: '<path d="M19 5L9 12l10 7zM5 5v14"/>',
  pdf: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 13h6M9 17h6"/>',
  audio: '<path d="M4 15v-3a8 8 0 0116 0v3"/><path d="M4 15h3v5H4zM17 15h3v5h-3z"/>',
  folder: '<path d="M3 6h7l2 2h9v11H3z"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  up: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 20h16"/>',
  moon: '<path d="M20 14A8 8 0 1110 4a7 7 0 0010 10z"/>',
  dl: '<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 20h16"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v6H4V6h6"/>',
  quran:
    '<path d="M12 2l2.4 4.6L19 5l-1.6 4.6L22 12l-4.6 2.4L19 19l-4.6-1.6L12 22l-2.4-4.6L5 19l1.6-4.6L2 12l4.6-2.4L5 5l4.6 1.6z"/><circle cx="12" cy="12" r="3"/>',
  layers: '<path d="M12 2l9 4.5-9 4.5-9-4.5z"/><path d="M3 11l9 4.5 9-4.5"/><path d="M3 15.5L12 20l9-4.5"/>',
  mosque:
    '<path d="M12 3v3"/><path d="M7 13a5 5 0 0110 0"/><path d="M5 13h14v8H5z"/><path d="M2.5 21V10l1.5-2 1.5 2v11M18.5 21V10l1.5-2 1.5 2v11"/>',
  feather: '<path d="M20 4c-6 0-12 4-12 11v3"/><path d="M20 4c0 6-4 11-11 11"/><path d="M4 21l7-7"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  dots: '<circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/>',
} as const;

export type IconName = keyof typeof P;

export function Icon({ name, className = 'h-[22px] w-[22px]' }: { name: IconName; className?: string }) {
  const fill = name === 'play' || name === 'pause' || name === 'dots';
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={fill ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: P[name] }}
    />
  );
}
