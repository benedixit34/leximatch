import type { AssetLoaderState } from '@/hooks/useAssetLoader';

interface LoadingScreenProps extends AssetLoaderState {
  onPlay: () => void;
}

export default function LoadingScreen({ progress, label, ready, onPlay }: LoadingScreenProps) {
  const pct = Math.round(progress * 100);

  return (
    <div className="w-full max-w-md min-h-[92vh] sm:min-h-[860px] bg-map-theme rounded-[2.5rem] border-4 border-slate-900 shadow-2xl relative flex flex-col items-center justify-center overflow-hidden p-6 text-center">
      <div className="animate-mascot w-24 h-24 rounded-full bg-amber-300 border-4 border-slate-900 shadow-2xl flex items-center justify-center text-5xl">
        🐿️
      </div>

      <h1 className="mt-6 text-3xl font-black tracking-wide text-amber-300 uppercase drop-shadow">German Express</h1>
      <p className="mt-1 text-xs font-semibold text-slate-300">City Travel Adventure</p>

      <div className="w-full max-w-xs mt-10 min-h-[5.5rem] flex flex-col items-center justify-start">
        {ready ? (
          <>
            <button
              onClick={onPlay}
              className="px-8 py-3 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 font-black rounded-2xl shadow-lg border-2 border-white transform active:scale-95 transition text-sm uppercase tracking-wider"
            >
              ▶ Tap to play
            </button>
            <p className="mt-3 text-[11px] font-semibold text-slate-400">🔊 Sound on</p>
          </>
        ) : (
          <>
            <div
              role="progressbar"
              aria-label="Loading"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
              className="w-full h-5 bg-slate-900/60 rounded-full p-1 border-2 border-white/40 shadow-inner overflow-hidden"
            >
              <div
                className="h-full bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(pct, 4)}%` }}
              />
            </div>
            <p aria-live="polite" className="mt-3 text-xs font-semibold text-slate-300">
              {label}… {pct}%
            </p>
          </>
        )}
      </div>
    </div>
  );
}