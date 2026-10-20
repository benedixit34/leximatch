'use client';

import { useEffect, useRef, useState } from 'react';
import type { AssetLoaderState } from '@/hooks/useAssetLoader';

/** The guide character shown while loading (transparent WebP in public/images). */
export const GUIDE_SRC = '/images/guide.webp';

interface LoadingScreenProps extends AssetLoaderState {
  onPlay: () => void;
}

export default function LoadingScreen({ progress, label, ready, onPlay }: LoadingScreenProps) {
  const pct = Math.round(progress * 100);

  // Fade the character in once it has loaded. `complete` covers the case where it finished
  // before React attached the onLoad handler (e.g. cached image + server-rendered HTML).
  const [guideLoaded, setGuideLoaded] = useState(false);
  const guideRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (guideRef.current?.complete) setGuideLoaded(true);
  }, []);

  return (
    <div className="w-full max-w-md min-h-[92vh] sm:min-h-[860px] bg-map-theme rounded-[2.5rem] border-4 border-slate-900 shadow-2xl relative flex flex-col items-center justify-between overflow-hidden p-6 text-center">
      {/* Soft glow behind the character */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-[22rem] h-[22rem] rounded-full bg-gradient-to-b from-pink-500/30 via-amber-400/20 to-transparent blur-2xl pointer-events-none"
      />

      <header className="relative z-10 pt-2">
        <h1 className="text-3xl font-black tracking-wide text-amber-300 uppercase drop-shadow">German Express</h1>
        <p className="mt-1 text-xs font-semibold text-slate-300">City Travel Adventure</p>
      </header>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={guideRef}
        src={GUIDE_SRC}
        alt="Your German guide, ready to travel with you"
        width={490}
        height={994}
        fetchPriority="high"
        decoding="async"
        onLoad={() => setGuideLoaded(true)}
        // her legs are cropped in the source art, so fade them out toward the progress bar
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, #000 80%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, #000 80%, transparent 100%)',
        }}
        className={`relative z-10 h-[52vh] sm:h-[520px] w-auto object-contain animate-guide drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)] transition-opacity duration-500 ${
          guideLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="relative z-10 w-full max-w-xs min-h-[5.5rem] flex flex-col items-center justify-start">
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