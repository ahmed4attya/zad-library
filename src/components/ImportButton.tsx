'use client';

import { useRef, type ReactNode } from 'react';
import { useLib } from '@/lib/library-context';

export function ImportButton({
  className,
  label,
  children,
}: {
  className: string;
  label: string;
  children: ReactNode;
}) {
  const { importFile } = useLib();
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <button type="button" className={className} aria-label={label} onClick={() => ref.current?.click()}>
        {children}
      </button>
      <input
        ref={ref}
        type="file"
        accept=".json,application/json"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void importFile(f);
          e.target.value = '';
        }}
      />
    </>
  );
}
