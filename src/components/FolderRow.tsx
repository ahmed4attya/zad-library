'use client';

import { Icon } from './Icon';
import { filesOf } from '@/lib/catalog';
import { cleanName, nf } from '@/lib/format';
import { useLib } from '@/lib/library-context';
import type { CatNode } from '@/lib/types';

export function FolderRow({ node, onClick }: { node: CatNode; onClick: () => void }) {
  const { data } = useLib();
  const n = filesOf(node, data.by).length;
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3.5 text-start shadow-sm transition-colors hover:border-brand-600"
    >
      <Icon name="folder" className="h-7 w-7 flex-none fill-[#E9BC4F] stroke-[#B98A22]" />
      <b className="min-w-0 flex-1 truncate text-[15px] font-bold">{cleanName(node.name)}</b>
      <span className="flex-none text-sm text-mut">{nf(n)} عنصر</span>
    </button>
  );
}
