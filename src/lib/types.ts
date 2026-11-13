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
  last: string | null;
  theme: 'light' | 'dark';
  cityId?: string;
  calcMethod?: string;
  madhab?: 'shafi' | 'hanafi';
  selectedAdhanId?: string;
  tasbeehCounts?: Record<string, number>;
  lastSurah?: number;
  lastAyah?: number;
  hijriOffset?: number;
}

export type View =
  | 'home'
  | 'lib'
  | 'search'
  | 'fav'
  | 'prayer'
  | 'qibla'
  | 'quran'
  | 'azkar'
  | 'tasbeeh'
  | 'hadith'
  | 'zakat'
  | 'calendar'
  | 'radio'
  | 'names'
  | 'hajj'
  | 'khatma';

export type Filter = 'all' | 'audio' | 'pdf';
