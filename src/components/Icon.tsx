const P = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  lib: '<path d="M4 4h6a2 2 0 012 2v14a2 2 0 00-2-2H4z"/><path d="M20 4h-6a2 2 0 00-2 2v14a2 2 0 012-2h6z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
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
} as const;

export type IconName = keyof typeof P;

export function Icon({ name, className = 'h-[22px] w-[22px]' }: { name: IconName; className?: string }) {
  const fill = name === 'play' || name === 'pause';
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
