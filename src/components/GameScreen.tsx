'use client';

import { useState } from 'react';
import Card from './Card';
import type { GameApi } from '@/hooks/useGame';
import { formatTime } from '@/lib/utils';
import type { CardData } from '@/lib/types';

interface DragState {
  card: CardData;
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function GameScreen({ game }: { game: GameApi }) {
  const { city, deck, flipped, shaking, matched, hinted, coins, gems, timeLeft } = game;
  const [drag, setDrag] = useState<DragState | null>(null);

  const total = city.pairs.length;
  const pct = (matched.length / total) * 100;
  const trayPairs = matched.map((id) => city.pairs.find((p) => p.id === id)!);

  // Drag an image card onto its German word (or vice versa). A short press is just a tap.
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
    <section className="w-full h-full flex flex-col justify-between flex-grow relative z-10">
      {/* Header */}
      <header className="space-y-2 z-10">
        <div className="flex items-center justify-between text-white drop-shadow">
          <div className="flex items-center gap-1.5">
            <button
              onClick={game.backToMap}
              title="Back to Map"
              className="w-8 h-8 rounded-lg bg-slate-900/60 border border-white/30 flex items-center justify-center text-white text-xs hover:bg-slate-800 transition"
            >
              ⬅️
            </button>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-90 block leading-tight">{city.venue}</span>
              <h1 className="text-xs font-black tracking-tight leading-none text-amber-300">Level {city.level}</h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="bg-slate-900/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/30 flex items-center gap-1">
              <span className="text-xs">🪙</span>
              <span className="font-mono font-bold text-xs text-amber-300">{coins}</span>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/30 flex items-center gap-1">
              <span className="text-xs">💎</span>
              <span className="font-mono font-bold text-xs text-pink-300">{gems}</span>
            </div>
            <div className="bg-slate-900/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-300/60 flex items-center gap-1">
              <span className="text-xs">🕒</span>
              <span className="font-mono font-bold text-xs text-white">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-grow bg-slate-900/50 backdrop-blur-md h-8 rounded-full p-1 border-2 border-white/40 relative flex items-center shadow-inner overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 rounded-full transition-all duration-500 relative glossy-pill"
              style={{ width: `${pct}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-around px-4 pointer-events-none">
              {[33, 66, 100].map((threshold) => (
                <span
                  key={threshold}
                  className={`text-sm transition-all duration-300 transform ${pct >= threshold ? '' : 'grayscale scale-90'}`}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={game.pause}
            className="w-8 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-cyan-600 border-2 border-white flex items-center justify-center text-white text-xs shadow-lg active:scale-95 transition"
          >
            ⏸️
          </button>
        </div>
      </header>

      {/* Matched tray */}
      <section className="relative my-1.5 z-10">
        <div className="absolute -top-5 right-2 z-20">
          <div className="w-10 h-10 bg-amber-100 rounded-full border-2 border-amber-500 shadow-lg flex items-center justify-center text-xl relative">
            🐿️
            <span className="absolute -bottom-1 -right-1 bg-pink-500 text-[8px] text-white font-bold px-1 rounded-full border border-white">DE</span>
          </div>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl p-2 border-2 border-cyan-300/40 min-h-[72px] shadow-lg flex items-center">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full py-0.5 px-1">
            {trayPairs.length === 0 && (
              <div className="w-full text-center text-xs font-semibold text-white/70 italic">
                Match German words to pictures! 🎧🔊
              </div>
            )}
            {trayPairs.map((pair) => (
              <div
                key={pair.id}
                onClick={() => game.speak(pair.german)}
                className="flex-shrink-0 bg-gradient-to-r from-amber-100 to-amber-200 border border-amber-400 rounded-xl px-2 py-1 flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <div className="text-sm"><span className="text-3xl">{pair.emoji}</span></div>
                <span className="font-bold text-[10px] text-slate-800 font-mono">{pair.german}</span>
                <span className="text-[10px]">🔊</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Card grid */}
      <main className="bg-slate-900/40 backdrop-blur-md rounded-2xl p-2.5 border-2 border-cyan-300/50 shadow-2xl flex-grow flex items-center justify-center my-1 z-10">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-sm">
          {deck.map((card) => (
            <Card
              key={card.cardId}
              card={card}
              flipped={flipped.includes(card.cardId)}
              matched={matched.includes(card.pairId)}
              shaking={shaking.includes(card.cardId)}
              hinted={hinted === card.pairId}
              onFlip={game.flipCard}
              onSpeak={game.speak}
              onPointerDown={handlePointerDown}
            />
          ))}
        </div>
      </main>

      {/* Guide + actions */}
      <footer className="flex items-end justify-between z-10 pt-1">
        <div className="flex items-center gap-2 max-w-[70%]">
          <div className="w-14 h-14 rounded-full bg-gradient-to-b from-indigo-500 to-purple-700 border-[3px] border-cyan-300 shadow-xl flex-shrink-0 flex items-center justify-center text-2xl overflow-hidden">
            👩🏽‍🦱
          </div>
          <div className="bg-slate-900/90 border border-cyan-400/60 rounded-2xl p-2 shadow-lg">
            <p className="text-[10px] sm:text-xs text-amber-200 font-medium leading-tight">{city.speechTip}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={game.requestHint}
            title="Hint (-20 Coins)"
            className="w-10 h-10 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-white flex items-center justify-center text-slate-950 text-base shadow-lg active:scale-95 transition"
          >
            💡
          </button>
          <button
            onClick={() => game.setModal('trophy')}
            title="Trophy Stats"
            className="w-10 h-10 rounded-full bg-gradient-to-b from-cyan-400 to-cyan-600 border-2 border-white flex items-center justify-center text-white text-base shadow-lg active:scale-95 transition"
          >
            🏆
          </button>
          <button
            onClick={game.share}
            title="Share Game"
            className="w-10 h-10 rounded-full bg-gradient-to-b from-cyan-400 to-cyan-600 border-2 border-white flex items-center justify-center text-white text-base shadow-lg active:scale-95 transition"
          >
            🔗
          </button>
        </div>
      </footer>

      {/* Drag preview */}
      {drag && (
        <div
          className="drag-ghost"
          style={{ left: drag.x - drag.w / 2, top: drag.y - drag.h / 2, width: drag.w, height: drag.h }}
        >
          <Card card={drag.card} flipped matched={false} ghost />
        </div>
      )}
    </section>
  );
}
