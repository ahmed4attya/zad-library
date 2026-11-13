'use client';

import { BottomNav, Header, Toast } from './Chrome';
import { FavView } from './FavView';
import { HomeView } from './HomeView';
import { LibraryView } from './LibraryView';
import { SearchView } from './SearchView';
import { Sheet } from './Sheet';
import { PrayerTimesView } from './PrayerTimesView';
import { QiblaCompassView } from './QiblaCompassView';
import { QuranView } from './QuranView';
import { AzkarView } from './AzkarView';
import { TasbeehView } from './TasbeehView';
import { HadithView } from './HadithView';
import { ZakatView } from './ZakatView';
import { HijriCalendarView } from './HijriCalendarView';
import { RadioView } from './RadioView';
import { AllahNamesView } from './AllahNamesView';
import { HajjUmrahView } from './HajjUmrahView';
import { KhatmaView } from './KhatmaView';
import { NotificationSettingsModal } from './NotificationSettingsModal';
import { LibraryProvider, useLib } from '@/lib/library-context';

function Shell() {
  const { view, loading, notifModalOpen, closeNotifModal, playAdhan, toast } = useLib();
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface text-sm text-mut">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold border-t-transparent" />
          <p className="font-bold text-pri">جارٍ تهيئة زاد المسلم…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-ink flex flex-col justify-between">
      <Header />
      <main className="flex-1 pb-16 md:pb-8">
        {view === 'home' && <HomeView />}
        {view === 'prayer' && <PrayerTimesView />}
        {view === 'qibla' && <QiblaCompassView />}
        {view === 'quran' && <QuranView />}
        {view === 'azkar' && <AzkarView />}
        {view === 'tasbeeh' && <TasbeehView />}
        {view === 'hadith' && <HadithView />}
        {view === 'zakat' && <ZakatView />}
        {view === 'calendar' && <HijriCalendarView />}
        {view === 'radio' && <RadioView />}
        {view === 'names' && <AllahNamesView toast={toast} />}
        {view === 'hajj' && <HajjUmrahView />}
        {view === 'khatma' && <KhatmaView />}
        {view === 'lib' && <LibraryView />}
        {view === 'search' && <SearchView />}
        {view === 'fav' && <FavView />}
      </main>
      <BottomNav />
      <Sheet />
      <Toast />
      <NotificationSettingsModal
        isOpen={notifModalOpen}
        onClose={closeNotifModal}
        onPlayAdhan={playAdhan}
        toast={toast}
      />
    </div>
  );
}

export default function LibraryApp() {
  return (
    <LibraryProvider>
      <Shell />
    </LibraryProvider>
  );
}
