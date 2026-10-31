'use client';

import { BottomNav, Header, Toast } from './Chrome';
import { FavView } from './FavView';
import { HomeView } from './HomeView';
import { LibraryView } from './LibraryView';
import { SearchView } from './SearchView';
import { Sheet } from './Sheet';
import { LibraryProvider, useLib } from '@/lib/library-context';

function Shell() {
  const { view, loading } = useLib();
  if (loading) {
    return <div className="grid min-h-screen place-items-center text-mut">جارٍ تحميل المكتبة…</div>;
  }
  return (
    <>
      <Header />
      <main>
        {view === 'home' && <HomeView />}
        {view === 'lib' && <LibraryView />}
        {view === 'search' && <SearchView />}
        {view === 'fav' && <FavView />}
      </main>
      <BottomNav />
      <Sheet />
      <Toast />
    </>
  );
}

export default function LibraryApp() {
  return (
    <LibraryProvider>
      <Shell />
    </LibraryProvider>
  );
}
