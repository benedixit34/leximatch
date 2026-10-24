'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { GameApi } from '@/hooks/useGame';
import { MAP_WIDTH, buildMapLayout } from '../lib/mapLayout';
import { ArrowLeftIcon, CoinIcon, GemIcon } from './icons';
import LevelNode from './LevelNode';
import { Fern, PathArt, Rock, Tree, WelcomeSign } from './MapScenery';
import StatPill from './StatPill';
import TabBar from './TabBar';

const pct = (x: number) => `${(x / MAP_WIDTH) * 100}%`;

export default function MapScreen({ game }: { game: GameApi }) {
  const { cities, unlockedIdx, selectedIdx, levelStars, coins, gems, musicOn } = game;

  const layout = useMemo(() => buildMapLayout(cities.length), [cities.length]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstScroll = useRef(true);

  // Keep the selected level in view (instantly the first time, smoothly afterwards)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const top = Math.max(0, layout.nodes[selectedIdx].y - el.clientHeight * 0.62);
    if (firstScroll.current || typeof el.scrollTo !== 'function') el.scrollTop = top;
    else el.scrollTo({ top, behavior: 'smooth' });
    firstScroll.current = false;
  }, [selectedIdx, layout]);

  const selected = layout.nodes[selectedIdx];
  const mascotOnLeft = selected.x > 135; // stand on the roomier side of the level, facing it

  return (
    <section className="absolute inset-0 flex flex-col">
      <div className="relative min-h-0 flex-1">
        <div ref={scrollRef} className="no-scrollbar absolute inset-0 overflow-y-auto overscroll-contain">
          <div className="map-grass relative w-full overflow-hidden" style={{ height: layout.height }}>
            <PathArt layout={layout} />

            {layout.scenery.map((s, i) => {
              const style: React.CSSProperties = {
                left: pct(s.x - s.size / 2),
                top: s.y,
                width: pct(s.size),
                transform: `translateY(-100%)${s.flip ? ' scaleX(-1)' : ''}`,
              };
              const cls = 'pointer-events-none absolute h-auto';
              if (s.kind === 'tree') return <Tree key={i} shade={s.shade} className={cls} style={style} />;
              return s.kind === 'rock' ? <Rock key={i} className={cls} style={style} /> : <Fern key={i} className={cls} style={style} />;
            })}

            <WelcomeSign text={`Welcome to ${cities[0].name}`} top={layout.nodes[0].y + 38} />

            {cities.map((c, idx) => {
              const locked = idx > unlockedIdx;
              const p = layout.nodes[idx];
              return (
                <div key={c.level} className="absolute" style={{ left: pct(p.x), top: p.y }}>
                  <LevelNode
                    level={c.level}
                    locked={locked}
                    selected={idx === selectedIdx}
                    stars={levelStars[idx]}
                    theme={c.theme}
                    label={locked ? `Level ${c.level}, locked` : `Play level ${c.level}`}
                    onClick={() => (locked ? game.selectCity(idx) : game.playLevel(idx))}
                  />
                </div>
              );
            })}

            {/* Mascot walks to the selected level */}
            <div
              data-testid="mascot"
              data-level={selectedIdx + 1}
              className="pointer-events-none absolute z-10 transition-all duration-700 ease-in-out"
              style={{ left: pct(selected.x + (mascotOnLeft ? -112 : 52)), top: selected.y - 52 }}
            >
              <span
                aria-hidden
                className="animate-mascot block text-6xl drop-shadow-lg"
                style={{ transform: mascotOnLeft ? 'scaleX(-1)' : undefined }}
              >
                🐿️
              </span>
            </div>
          </div>
        </div>

        {/* Top bar floats over the map */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-3 pt-4">
          <button
            onClick={() => game.notify('Nothing to go back to yet')}
            aria-label="Back"
            className="pointer-events-auto h-8 w-12 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)] transition active:scale-90"
          >
            <ArrowLeftIcon className="h-full w-full" />
          </button>
          <div className="pointer-events-auto flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <StatPill label="Coins" value={coins} icon={<CoinIcon className="h-full w-full" />} />
              <StatPill label="Gems" value={gems} icon={<GemIcon className="h-full w-full" />} />
            </div>
            <button
              onClick={game.toggleMusic}
              aria-label="Music on/off"
              title="Music on/off"
              className={`flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-slate-900/55 text-xs backdrop-blur-sm transition active:scale-95 ${musicOn ? '' : 'opacity-60'}`}
            >
              {musicOn ? '🎵' : '🔇'}
            </button>
          </div>
        </div>
      </div>

      <TabBar active="journey" onSelect={(tab, label) => tab !== 'journey' && game.notify(`${label} is coming soon`)} />
    </section>
  );
}