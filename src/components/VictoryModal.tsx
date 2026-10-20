import type { GameApi } from '@/hooks/useGame';
import { formatTime } from '@/lib/utils';
import { ClockIcon, CloseIcon, RestartIcon, SpeakerIcon, StarShape } from './icons';

const TITLES = ['Well done!', 'Great job!', 'Amazing!']; // 1, 2 or 3 stars

// Border + picture-area colour for each word card (cycles)
const CARD_STYLES = [
  { border: 'border-sky-400', bg: 'from-sky-100 to-sky-200' },
  { border: 'border-amber-400', bg: 'from-amber-100 to-orange-200' },
  { border: 'border-teal-300', bg: 'from-teal-50 to-teal-100' },
  { border: 'border-pink-400', bg: 'from-pink-100 to-rose-200' },
  { border: 'border-amber-500', bg: 'from-orange-100 to-amber-200' },
  { border: 'border-orange-300', bg: 'from-yellow-100 to-orange-100' },
];

// Left, centre, right star: size, tilt and vertical offset
const STAR_SLOTS = [
  { size: 'w-[4.3rem] h-[4.3rem]', style: { transform: 'rotate(-14deg) translateY(10px)' } },
  { size: 'w-[5.6rem] h-[5.6rem]', style: { transform: 'translateY(-6px)' } },
  { size: 'w-[4.3rem] h-[4.3rem]', style: { transform: 'rotate(14deg) translateY(10px)' } },
];

export default function VictoryModal({ game }: { game: GameApi }) {
  const { modal, result, city } = game;
  if (modal !== 'victory' || !result) return null;

  const title = TITLES[result.stars - 1] ?? TITLES[0];
  const total = city.pairs.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Level complete"
      className="fixed inset-0 z-50 flex overflow-y-auto bg-slate-950/85 backdrop-blur-md p-4"
    >
      {/* m-auto centres it when there is room and lets the page scroll on short screens */}
      <div className="m-auto w-full max-w-[22rem] pt-[4.5rem] animate-victory-in">
        <div className="relative isolate">
          {/* Stars */}
          <div
            role="img"
            aria-label={`${result.stars} of 3 stars`}
            className="absolute left-1/2 -top-[4.6rem] z-20 flex -translate-x-1/2 items-end justify-center pointer-events-none drop-shadow-[0_6px_6px_rgba(0,0,0,0.35)]"
          >
            {STAR_SLOTS.map((slot, i) => (
              <div key={i} className={`${slot.size} animate-star-pop`} style={{ animationDelay: `${0.25 + i * 0.18}s` }}>
                <div className="h-full w-full" style={slot.style}>
                  <StarShape earned={i < result.stars} className="h-full w-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Ribbon title */}
          <div className="relative z-10 -mx-2">
            <div className="victory-ribbon rounded-lg px-12 py-2.5 text-center">
              <h2 className="text-2xl font-black text-white [text-shadow:0_2px_0_rgba(131,24,67,0.8)]">{title}</h2>
              <button
                onClick={game.backToMap}
                aria-label="Close"
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-pink-700 text-white shadow active:scale-95 transition"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Purple frame */}
          <div className="-mt-5 rounded-[2rem] border-4 border-violet-950 bg-gradient-to-b from-violet-500 to-violet-800 px-2.5 pb-3 pt-6 shadow-2xl">
            {/* Cream panel */}
            <div className="space-y-3 rounded-[1.5rem] border-2 border-violet-900/30 bg-gradient-to-b from-orange-50 to-amber-50 px-3 pb-8 pt-7">
              {/* Landmark */}
              <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-cyan-100 bg-cyan-50 p-2 pr-16">
                <div
                  aria-hidden
                  className="h-14 w-20 flex-shrink-0 rounded-lg border-2 border-white shadow-md"
                  style={{ backgroundImage: `var(--img-${city.theme})`, backgroundSize: 'cover', backgroundPosition: 'center bottom' }}
                />
                <div className="min-w-0 text-left">
                  <p className="text-[9px] font-extrabold uppercase tracking-wider text-teal-700">Landmark completed</p>
                  <p className="text-base font-black capitalize leading-tight text-slate-900">{city.venue.toLowerCase()}</p>
                </div>
                <span aria-hidden className="absolute -bottom-2 -right-1 text-5xl drop-shadow">🐿️</span>
              </div>

              {/* Time */}
              <div className="flex items-center justify-between rounded-2xl bg-violet-100 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-11 w-11" />
                  <span aria-label="Time" className="text-3xl font-black tabular-nums tracking-tight text-indigo-950">
                    {formatTime(result.seconds)}
                  </span>
                </div>
                {result.newBest && (
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-800 shadow">New Best</span>
                )}
              </div>

              {/* Words learned */}
              <div>
                <div className="flex items-center justify-between px-1 text-[10px] font-bold uppercase tracking-wide">
                  <span className="text-slate-400">
                    Words you learned <span aria-hidden>•</span> Tap to hear
                  </span>
                  <span className="text-teal-600">{total}/{total}</span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {city.pairs.map((pair, i) => {
                    const st = CARD_STYLES[i % CARD_STYLES.length];
                    return (
                      <button
                        key={pair.id}
                        onClick={() => game.speak(pair.german)}
                        aria-label={`Hear ${pair.german}`}
                        className={`relative overflow-hidden rounded-xl border-2 ${st.border} bg-white text-left shadow-[0_3px_0_rgba(100,80,120,0.35)] transition active:translate-y-0.5 active:shadow-none`}
                      >
                        <div className={`flex aspect-[5/4] items-center justify-center bg-gradient-to-b ${st.bg} text-4xl`}>{pair.emoji}</div>
                        <span className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-sky-500 text-white">
                          <SpeakerIcon className="h-3 w-3" />
                        </span>
                        <div className="flex min-h-[2.3rem] items-center justify-center bg-amber-200 px-1 py-1 text-center text-[11px] font-extrabold leading-tight text-slate-800">
                          {pair.german}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rewards + accuracy */}
              <div className="flex items-center rounded-2xl bg-orange-100/80 px-3 py-2.5">
                <div className="flex flex-1 items-center gap-2">
                  <span aria-hidden className="text-3xl">🪙</span>
                  <div className="leading-tight">
                    <p className="text-xl font-black text-slate-800">+{result.coins}</p>
                    <p className="text-[10px] font-bold text-pink-600">💎 +{result.gems}</p>
                  </div>
                </div>
                <div className="mx-2 h-9 w-px bg-slate-300" />
                <div className="flex flex-1 items-baseline justify-center gap-1">
                  <span className="text-xl font-black text-slate-800">{result.accuracy}%</span>
                  <span className="text-[10px] font-extrabold uppercase text-slate-500">Accuracy</span>
                </div>
              </div>
            </div>

            {/* Buttons straddle the bottom edge of the cream panel */}
            <div className="relative z-10 -mt-5 flex items-center gap-4 px-1">
              <button
                onClick={game.restartLevel}
                aria-label="Play again"
                className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-[3px] border-red-900/60 bg-gradient-to-b from-rose-400 to-red-600 text-white shadow-[0_4px_0_#7f1d1d] transition active:translate-y-0.5 active:shadow-none"
              >
                <RestartIcon className="h-7 w-7" />
              </button>
              <button
                onClick={game.continueAfterVictory}
                className="victory-continue h-12 flex-1 text-lg font-black text-white [text-shadow:0_2px_0_rgba(8,80,90,0.8)] transition active:translate-y-0.5"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}