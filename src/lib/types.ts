export interface CatFile {
  id: string;
  name: string;
  mime?: string;
}
export interface CatNode {
  id?: string;
  name: string;
  folders?: CatNode[];
  files?: CatFile[];
}
export type Kind = 'audio' | 'pdf' | 'doc';
export interface Item {
  id: string;
  name: string;
  title: string;
  kind: Kind;
  path: string[];
}
export interface Index {
  all: Item[];
  by: Record<string, Item>;
}
export interface Progress {
  t: number;
  d: number;
}
export interface Persist {
  fav: Record<string, 1>;
  done: Record<string, 1>;
  pos: Record<string, Progress>;
  days: Record<string, number>;
  last: string | null;
  goal: number;
  theme: 'light' | 'dark';
}
export type View = 'home' | 'lib' | 'search' | 'fav';
export type Filter = 'all' | 'audio' | 'pdf';
