import type { GameApi } from '@/hooks/useGame';

const overlay = 'fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4';

export function PauseModal({ game }: { game: GameApi }) {
  if (game.modal !== 'pause') return null;
  return (
    <div className={`${overlay} bg-slate-950/80`}>
      <div className="bg-slate-900 border-4 border-cyan-400 rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl">
        <h2 className="text-2xl font-black text-amber-300 tracking-wide uppercase">Game Paused</h2>
        <div className="space-y-2 font-bold">
          <button onClick={game.resume} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 border-2 border-white text-white rounded-2xl shadow-lg active:scale-95 transition">
            ▶️ RESUME
          </button>
          <button onClick={game.toggleMusic} className="w-full py-2.5 bg-slate-800 border-2 border-cyan-500/60 text-cyan-200 rounded-2xl transition">
            🎵 MUSIC: {game.musicOn ? 'ON' : 'OFF'}
          </button>
          <button onClick={game.restartLevel} className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 border-2 border-white text-white rounded-2xl transition">
            🔄 RESTART LEVEL
          </button>
          <button onClick={game.backToMap} className="w-full py-2.5 bg-slate-800 border-2 border-slate-600 text-slate-200 rounded-2xl transition">
            🗺️ RETURN TO MAP
          </button>
        </div>
      </div>
    </div>
  );
}

export function TrophyModal({ game }: { game: GameApi }) {
  if (game.modal !== 'trophy') return null;
  const rows: [string, string | number, string][] = [
    ['Total Matches:', game.totalMatches, 'text-amber-300'],
    ['Cities Visited:', `${game.unlockedIdx + 1} / ${game.cities.length}`, 'text-cyan-300'],
    ['Coins Collected:', game.coins, 'text-amber-400'],
    ['Highest Streak:', game.streak, 'text-emerald-400'],
  ];
  return (
    <div className={`${overlay} bg-slate-950/80`}>
      <div className="bg-slate-900 border-4 border-amber-400 rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl text-white">
        <div className="text-4xl">🏆</div>
        <h2 className="text-xl font-black text-amber-300 uppercase">Travel Statistics</h2>
        <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700 text-xs font-mono space-y-2">
          {rows.map(([label, value, color]) => (
            <div key={label} className="flex justify-between">
              <span className="text-slate-400">{label}</span>
              <span className={`font-bold ${color}`}>{value}</span>
            </div>
          ))}
        </div>
        <button onClick={() => game.setModal(null)} className="w-full py-2.5 bg-slate-800 border-2 border-slate-600 text-white rounded-2xl font-bold">
          CLOSE
        </button>
      </div>
    </div>
  );
}

export function VictoryModal({ game }: { game: GameApi }) {
  if (game.modal !== 'victory') return null;
  return (
    <div className={`${overlay} bg-slate-950/85`}>
      <div className="bg-slate-900 border-4 border-pink-500 rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl text-white">
        <div className="text-5xl animate-bounce">🎉</div>
        <h2 className="text-2xl font-black text-amber-300 tracking-wide uppercase">CITY CLEARED!</h2>
        <p className="text-xs text-slate-300 font-semibold">Ausgezeichnet! You mastered this city!</p>
        <div className="flex justify-center text-3xl gap-2 py-1">
          {[1, 2, 3].map((n) => (
            <span key={n} className={n <= game.earnedStars ? '' : 'grayscale opacity-40'}>⭐</span>
          ))}
        </div>
        <div className="bg-slate-800/90 rounded-2xl p-3 border border-slate-700 font-mono text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Level Bonus:</span>
            <span className="font-bold text-amber-300">+150 🪙</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Gem Reward:</span>
            <span className="font-bold text-pink-300">+75 💎</span>
          </div>
        </div>
        <button
          onClick={game.continueAfterVictory}
          className="w-full py-3 bg-gradient-to-r from-emerald-400 to-cyan-500 border-2 border-white text-slate-950 font-black rounded-2xl shadow-lg active:scale-95 transition uppercase tracking-wider"
        >
          CONTINUE ON MAP ➔
        </button>
      </div>
    </div>
  );
}

export function Toast({ game }: { game: GameApi }) {
  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 bg-slate-900 border-2 border-cyan-400 text-white font-bold text-xs px-4 py-2 rounded-full shadow-2xl pointer-events-none transition-opacity duration-300 z-50 ${
        game.toast.visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {game.toast.msg}
    </div>
  );
}
