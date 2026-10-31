import { Icon } from './Icon';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoFocus?: boolean;
}

export function SearchBox({ value, onChange, placeholder, autoFocus }: Props) {
  return (
    <div className="relative">
      <input
        type="text"
        inputMode="search"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-full border border-line bg-card py-3 pe-12 ps-5 text-[15px] text-ink shadow-sm placeholder:text-mut"
      />
      <span className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-mut">
        <Icon name="search" className="h-5 w-5" />
      </span>
    </div>
  );
}
