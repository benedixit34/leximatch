import type { CardData } from '@/lib/types';

interface CardProps {
  card: CardData;
  flipped: boolean;
  matched: boolean;
  shaking?: boolean;
  hinted?: boolean;
  /** Render as the floating drag preview (no id, no handlers) */
  ghost?: boolean;
  onFlip?: (cardId: string) => void;
  onSpeak?: (text: string) => void;
  onPointerDown?: (e: React.PointerEvent<HTMLDivElement>, card: CardData) => void;
}

export default function Card({
  card, flipped, matched, shaking, hinted, ghost, onFlip, onSpeak, onPointerDown,
}: CardProps) {
  const isWord = card.type === 'word';

  return (
    <div
      data-card-id={ghost ? undefined : card.cardId}
      onClick={() => onFlip?.(card.cardId)}
      onPointerDown={(e) => onPointerDown?.(e, card)}
      className={[
        'card-perspective aspect-[3/4] cursor-pointer touch-none rounded-[1.1rem] transition',
        shaking && 'animate-shake',
        flipped && !matched && 'card-selected',
        hinted && 'ring-4 ring-amber-400 scale-105',
        matched && 'animate-pop-match pointer-events-none',
      ].filter(Boolean).join(' ')}
    >
      <div className={`card-inner ${flipped || matched ? 'is-flipped' : ''}`}>
        <div className="card-front flex items-center justify-center">
          <span className="text-white/80 font-black text-xs font-mono drop-shadow">DE</span>
        </div>
        <div
          className={`card-back ${isWord ? 'card-back-word' : 'card-back-image'} p-1 flex flex-col items-center justify-between text-center relative`}
        >
          <div className="w-full text-right">
            {isWord && (
              <button
                className="text-[10px] bg-amber-200/80 hover:bg-amber-300 p-1 rounded-full border border-amber-400"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak?.(card.pair.german);
                }}
              >
                🔊
              </button>
            )}
          </div>
          <div className="flex-grow flex items-center justify-center">
            {isWord ? (
              <span className="font-bold text-slate-800 text-xs sm:text-sm leading-tight">{card.pair.german}</span>
            ) : (
              <span className="text-3xl">{card.pair.emoji}</span>
            )}
          </div>
          <div className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{card.type}</div>
        </div>
      </div>
    </div>
  );
}
