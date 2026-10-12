'use client';

import { useEffect, useState } from 'react';
import type { GameApi } from '@/hooks/useGame';

const PAGE_SIZE = 5;

export default function MapScreen({ game }: { game: GameApi }) {
  const { cities, city, unlockedIdx, selectedIdx, levelStars, coins, gems, musicOn } = game;

  const pageCount = Math.ceil(cities.length / PAGE_SIZE);
  const selectedPage = Math.floor(selectedIdx / PAGE_SIZE);
  const [page, setPage] = useState(selectedPage);
  // Follow the selection (e.g. after clearing a level, the next one may be on the next page)
  useEffect(() => setPage(selectedPage), [selectedPage]);
  const start = page * PAGE_SIZE;

  return (
    <section className="w-full h-full flex flex-col justify-between flex-grow relative z-10">
      {/* Header */}
      <header className="flex items-center justify-between text-white bg-slate-900/60 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🗺️</span>
          <div>
            <h1 className="text-sm font-black tracking-wide text-amber-300 uppercase leading-none">German Express</h1>
            <span className="text-[10px] text-slate-300 font-semibold">City Travel Map</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={game.toggleMusic}
            title="Music on/off"
            className={`w-7 h-7 rounded-full bg-slate-950/60 border border-cyan-400/50 flex items-center justify-center text-xs active:scale-95 transition ${musicOn ? '' : 'opacity-60'}`}
          >
            {musicOn ? '🎵' : '🔇'}
          </button>
          <div className="bg-slate-950/60 px-2.5 py-1 rounded-full border border-amber-400/40 flex items-center gap-1">
            <span className="text-xs">🪙</span>
            <span className="font-mono font-bold text-xs text-amber-300">{coins}</span>
          </div>
          <div className="bg-slate-950/60 px-2.5 py-1 rounded-full border border-pink-400/40 flex items-center gap-1">
            <span className="text-xs">💎</span>
            <span className="font-mono font-bold text-xs text-pink-300">{gems}</span>
          </div>
        </div>
      </header>

      {/* Page switcher */}
      <div className="flex items-center justify-between mt-3 text-xs font-bold text-white">
        <button
          aria-label="Previous levels"
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 rounded-full bg-slate-900/60 border border-white/30 disabled:opacity-30"
        >
          ‹
        </button>
        <span className="text-amber-300">
          Levels {start + 1}–{Math.min(start + PAGE_SIZE, cities.length)} of {cities.length}
        </span>
        <button
          aria-label="Next levels"
          disabled={page === pageCount - 1}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 rounded-full bg-slate-900/60 border border-white/30 disabled:opacity-30"
        >
          ›
        </button>
      </div>

      {/* Map viewport */}
      <div className="map-viewport relative flex-grow my-2 rounded-2xl border-2 border-cyan-500/40 overflow-hidden flex items-center justify-center min-h-[480px]">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 360 480" preserveAspectRatio="none">
          <path
            d="M 60 420 Q 180 380 300 330 T 80 230 Q 180 160 280 120 T 180 40"
            fill="none" stroke="#67e8f9" strokeWidth="4" strokeDasharray="8 8" opacity="0.95"
            style={{ filter: 'drop-shadow(0 0 4px rgba(34,211,238,0.9))' }}
          />
        </svg>

        {cities.slice(start, start + PAGE_SIZE).map((c, i) => {
          const idx = start + i; // real index in the full level list
          const unlocked = idx <= unlockedIdx;
          return (
            <div
              key={c.level}
              onClick={() => game.selectCity(idx)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition hover:scale-110"
              style={{ left: `${c.pin.left}%`, top: `${c.pin.top}%` }}
            >
              <div
                className={`w-14 h-14 rounded-2xl border-2 shadow-xl flex flex-col items-center justify-center font-black relative ${
                  unlocked
                    ? 'bg-gradient-to-b from-amber-300 to-amber-500 border-white text-slate-900'
                    : 'bg-slate-800 border-slate-600 text-slate-400'
                } ${idx === selectedIdx ? 'ring-4 ring-cyan-300/70' : ''}`}
              >
                <span className="text-lg">{c.icon}</span>
                <span className="text-[9px] leading-tight">Lvl {c.level}</span>
                <div
                  className={`absolute -bottom-2 bg-slate-900/90 border px-1.5 rounded-full text-[9px] ${
                    unlocked ? 'border-amber-300 text-amber-300 font-bold' : 'border-slate-700 text-slate-400'
                  }`}
                >
                  {!unlocked ? '🔒' : levelStars[idx] > 0 ? `⭐ ${levelStars[idx]}` : 'READY'}
                </div>
              </div>
              <span
                className={`absolute top-14 left-1/2 -translate-x-1/2 max-w-[110px] truncate bg-slate-900/90 text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                  unlocked ? 'text-amber-300 border-amber-400/50' : 'text-slate-300 border-slate-700'
                }`}
              >
                {c.venue}
              </span>
            </div>
          );
        })}

        {/* Mascot (only on the page that contains the selected level) */}
        {selectedPage === page && (
          <div
            className="absolute -translate-x-1/2 -translate-y-full transition-all duration-700 ease-in-out pointer-events-none animate-mascot z-20"
            style={{ left: `${city.mascot.left}%`, top: `${city.mascot.top}%` }}
          >
            <div className="w-10 h-10 rounded-full bg-amber-300 border-2 border-slate-900 shadow-2xl flex items-center justify-center text-xl relative">
              🐿️
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border border-slate-900" />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900/70 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">SELECTED DESTINATION</span>
          <h2 className="text-sm font-black text-amber-300 leading-tight truncate">
            {city.venue} - Level {city.level}
          </h2>
        </div>
        <button
          onClick={game.startLevel}
          className="flex-shrink-0 px-6 py-3 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 font-black rounded-2xl shadow-lg border-2 border-white transform active:scale-95 transition flex items-center gap-1.5 text-sm uppercase"
        >
          <span>PLAY LEVEL</span>
          <span>➔</span>
        </button>
      </footer>
    </section>
  );
}
