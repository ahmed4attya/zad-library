import type { CatFile, CatNode, Index, Item, Kind } from './types';

const ID = /^[\w-]+$/;
export const okId = (s: unknown): s is string => typeof s === 'string' && ID.test(s);

export function isCatalog(d: unknown): d is CatNode {
  if (!d || typeof d !== 'object') return false;
  const n = d as Partial<CatNode>;
  return (
    typeof n.name === 'string' &&
    (n.folders === undefined || Array.isArray(n.folders)) &&
    (n.files === undefined || Array.isArray(n.files))
  );
}

export function kindOf(f: CatFile): Kind {
  const n = (f.name ?? '').toLowerCase();
  const m = (f.mime ?? '').toLowerCase();
  if (m.includes('pdf') || n.endsWith('.pdf')) return 'pdf';
  if (m.startsWith('audio') || /\.(mp3|wav|m4a|ogg)$/.test(n)) return 'audio';
  return 'doc';
}

export function buildIndex(tree: CatNode): Index {
  const all: Item[] = [];
  const by: Record<string, Item> = {};
  const walk = (n: CatNode, path: string[]) => {
    for (const f of n.files ?? []) {
      if (!okId(f.id)) continue;
      const name = f.name ?? '';
      const item: Item = {
        id: f.id,
        name,
        title: name.replace(/\.[A-Za-z0-9]{2,4}$/, ''),
        kind: kindOf(f),
        path,
      };
      all.push(item);
      by[item.id] = item;
    }
    for (const d of n.folders ?? []) walk(d, [...path, d.name]);
  };
  walk(tree, []);
  return { all, by };
}

export function filesOf(n: CatNode, by: Record<string, Item>): Item[] {
  let a = (n.files ?? []).map((f) => by[f.id]).filter((x): x is Item => !!x);
  for (const d of n.folders ?? []) a = a.concat(filesOf(d, by));
  return a;
}
