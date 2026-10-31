'use client';

import { EmptyCatalog } from './EmptyCatalog';
import { HomeHero } from './HomeHero';
import { MoreTile, Tile } from './Tile';
import { useLib } from '@/lib/library-context';

const MAX = 7;

export function HomeView() {
  const { tree, go } = useLib();
  const secs = tree?.folders ?? [];
  const shown = secs.length > MAX ? secs.slice(0, MAX) : secs;

  return (
    <div className="wrap pt-4">
      <HomeHero />
      <div className="mt-4">
        {!tree ? (
          <EmptyCatalog />
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {shown.map((n, i) => (
              <Tile key={n.id ?? n.name} node={n} index={i} />
            ))}
            {secs.length > MAX && <MoreTile onClick={() => go('lib')} />}
          </div>
        )}
      </div>
    </div>
  );
}
