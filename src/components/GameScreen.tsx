'use client';

import { useEffect, useState } from 'react';
import Card from './Card';
import { CoinIcon, ClockIcon, GemIcon, HintIcon, PauseIcon, RestartIcon, StarShape } from './icons';
import { GUIDE_SRC } from './LoadingScreen';
import StatPill from './StatPill';
import { HINT_COST, type GameApi } from '@/hooks/useGame';
import { formatTime } from '@/lib/utils';
import type { CardData } from '@/lib/types';

interface DragState {
  card: CardData;
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Faint pictures on the card backs; they cycle across the board */
const WATERMARKS = ['🎒', '🍎', '📖', '🎩', '🧳', '🍰', '🎁', '🕰️'];

const TIP_SECONDS = 5;

/** Glossy teal booster button with a count badge */
function Booster({
  label, badge, disabled, onClick, children,
}: { label: string; badge: string | number; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="btn-teal relative flex h-14 w-[4.5rem] items-center justify-center rounded-[1.2rem] text-white transition active:translate-y-0.5 active:shadow-none"
    >
      {children}
      <span className="absolute -right-1.5 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-teal-700 px-1 text-[11px] font-black text-white shadow">
        {badge}
      </span>
    </button>
  );
}

export default function GameScreen({ game }: { game: GameApi }) {
  const { city, deck, flipped, shaking, matched, hinted, coins, gems, timeLeft, shuffles } = game;
  const [drag, setDrag] = useState<DragState | null>(null);

  // The guide's tip: shown when a level starts (and when you tap her), then tucked away
  const [tipVisible, setTipVisible] = useState(true);
  const [tipNonce, setTipNonce] = useState(0);
  useEffect(() => {
    setTipVisible(true);
    const t = setTimeout(() => setTipVisible(false), TIP_SECONDS * 1000);
    return () => clearTimeout(t);
  }, [city.level, tipNonce]);

  const total = city.pairs.length;
  const pct = (matched.length / total) * 100;
  const trayPairs = matched.map((id) => city.pairs.find((p) => p.id === id)!);

  // Drag a picture onto its German word (or vice versa). A short press is just a tap.
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, card: CardData) => {
    if (!game.canStartDrag() || matched.includes(card.pairId)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const start = { x: e.clientX, y: e.clientY };
    let moved = false;

    const onMove = (ev: PointerEvent) => {
      if (!moved && Math.hypot(ev.clientX - start.x, ev.clientY - start.y) < 6) return;
      moved = true;
      setDrag({ card, x: ev.clientX, y: ev.clientY, w: rect.width, h: rect.height });
    };
    const onUp = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      setDrag(null);
      if (!moved) return;
      const target = document.elementFromPoint(ev.clientX, ev.clientY)?.closest<HTMLElement>('[data-card-id]');
      const targetId = target?.dataset.cardId;
      if (targetId && targetId !== card.cardId) {
        game.flipCard(card.cardId);
        game.flipCard(targetId);
      }
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <section className="relative z-10 flex h-full w-full flex-grow flex-col">
      {/* HUD */}
      <header className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span aria-hidden className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border-2 border-white/80 bg-white/85 text-xl shadow">
              {city.icon}
            </span>
            <div className="min-w-0 leading-tight text-white drop-shadow">
              <p className="max-w-[6.5rem] truncate text-[9px] font-bold uppercase tracking-normal opacity-90">{city.venue}</p>
              <h1 className="text-base font-black">Level {city.level}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 pl-1">
            <StatPill label="Coins" value={coins} icon={<CoinIcon className="h-full w-full" />} />
            <StatPill label="Gems" value={gems} icon={<GemIcon className="h-full w-full" />} />
            <StatPill label="Time" value={formatTime(timeLeft)} icon={<ClockIcon className="h-full w-full" />} />
          </div>
        </div>

        {/* Progress with 1 / 2 / 3-star milestones */}
        <div className="flex items-center gap-2">
          <div
            role="progressbar"
            aria-label="Level progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pct)}
            className="relative h-7 flex-grow overflow-hidden rounded-full border-2 border-white/75 bg-violet-300/60 shadow-inner backdrop-blur-sm"
          >
            <div
              className="glossy-pill h-full rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
            <div className="pointer-events-none absolute inset-0 flex">
              {[1, 2, 3].map((n) => {
                const earned = matched.length * 3 >= total * n;
                return (
                  <div key={n} className="flex flex-1 items-center justify-center gap-0.5" data-milestone={n} data-earned={earned}>
                    {Array.from({ length: n }, (_, i) => (
                      <StarShape key={i} earned={earned} className="h-4 w-4 drop-shadow-sm" />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
          <button
            onClick={game.pause}
            aria-label="Pause"
            className="btn-teal flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white transition active:translate-y-0.5 active:shadow-none"
          >
            <PauseIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Matched pairs */}
      <section className="relative mt-12">
        <span aria-hidden className="pointer-events-none absolute -top-11 right-2 z-20 text-5xl drop-shadow-lg">🐿️</span>
        <div className="flex min-h-[5.5rem] items-center rounded-xl border-2 border-white/80 bg-white/40 p-2 shadow-lg backdrop-blur-sm">
          <div className="no-scrollbar flex w-full items-center gap-3 overflow-x-auto px-1">
            {trayPairs.length === 0 && (
              <p className="w-full text-center text-xs font-semibold italic text-slate-700">Match German words to pictures! 🎧🔊</p>
            )}
            {trayPairs.map((pair) => (
              <button
                key={pair.id}
                onClick={() => game.speak(pair.german)}
                aria-label={`Hear ${pair.german}`}
                className="relative h-[4.4rem] w-[4.6rem] flex-shrink-0"
              >
                {/* picture card behind, word card in front: a little stack */}
                <span className="absolute right-0 top-0 flex h-[3.6rem] w-11 rotate-[8deg] items-center justify-center rounded-lg border-2 border-sky-300 bg-white text-2xl shadow-md">
                  {pair.emoji}
                </span>
                <span className="absolute left-0 top-2 flex h-[3.6rem] w-11 -rotate-[6deg] items-center justify-center rounded-lg border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-amber-200 px-0.5 text-center text-[10px] font-extrabold leading-tight text-slate-800 shadow-md">
                  {pair.german}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Board: 4 x 3 slots. Matched cards leave an empty, darker slot. */}
      <main className="my-2 flex flex-grow items-center">
        <div className="w-full overflow-hidden rounded-xl border-2 border-cyan-400 bg-slate-700/25 p-1 shadow-2xl backdrop-blur-sm">
          <div className="grid grid-cols-4">
            {deck.map((card, i) => {
              const isMatched = matched.includes(card.pairId);
              return (
                <div
                  key={card.cardId}
                  className={`aspect-[5/6] border border-amber-100/25 p-1.5 ${isMatched ? 'bg-slate-900/30' : 'bg-slate-900/10'}`}
                >
                  <Card
                    card={card}
                    flipped={flipped.includes(card.cardId)}
                    matched={isMatched}
                    shaking={shaking.includes(card.cardId)}
                    hinted={hinted === card.pairId}
                    watermark={WATERMARKS[i % WATERMARKS.length]}
                    onFlip={game.flipCard}
                    onSpeak={game.speak}
                    onPointerDown={handlePointerDown}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom bar: guide + boosters (bleeds to the edges of the screen) */}
      <footer className="relative -mx-3 -mb-3 flex items-center justify-between rounded-t-[2rem] border-t-2 border-indigo-400/40 bg-gradient-to-b from-indigo-900 to-indigo-950 px-5 pb-5 pt-3 sm:-mx-4 sm:-mb-4">
        {/* The guide's tip appears above the bar */}
        <div
          role="status"
          className={`pointer-events-none absolute bottom-full left-4 right-4 mb-2 transition-opacity duration-500 ${tipVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <p className="ml-16 rounded-2xl border border-cyan-400/60 bg-slate-900/90 p-2.5 text-xs font-medium leading-tight text-amber-200 shadow-lg">
            {city.speechTip}
          </p>
        </div>

        <button
          onClick={() => setTipNonce((n) => n + 1)}
          aria-label="Show the guide's tip"
          className="relative -mt-9 h-[4.5rem] w-[4.5rem] overflow-hidden rounded-2xl border-[3px] border-cyan-300 bg-gradient-to-b from-indigo-400 to-purple-700 shadow-xl"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={GUIDE_SRC} alt="" className="h-full w-full object-cover object-top" />
        </button>

        <div className="flex items-center gap-5">
          <Booster label={`Hint (costs ${HINT_COST} coins)`} badge={HINT_COST} onClick={game.requestHint}>
            <HintIcon className="h-8 w-8" />
          </Booster>
          <Booster label="Shuffle cards" badge={shuffles} disabled={shuffles <= 0} onClick={game.shuffleBoard}>
            <RestartIcon className="h-7 w-7" />
          </Booster>
        </div>
      </footer>

      {/* Drag preview */}
      {drag && (
        <div className="drag-ghost" style={{ left: drag.x - drag.w / 2, top: drag.y - drag.h / 2, width: drag.w, height: drag.h }}>
          <Card card={drag.card} flipped matched={false} ghost />
        </div>
      )}
    </section>
  );
}