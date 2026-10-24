import type { CardData } from '@/lib/types';

/** Letters on the back of every card */
const CARD_BADGE = 'AE';

interface CardProps {
  card: CardData;
  flipped: boolean;
  matched: boolean;
  shaking?: boolean;
  hinted?: boolean;
  /** Render as the floating drag preview (no id, no handlers) */
  ghost?: boolean;
  /** Faint decoration on the card back (an emoji) */
  watermark?: string;
  onFlip?: (cardId: string) => void;
  onSpeak?: (text: string) => void;
  onPointerDown?: (e: React.PointerEvent<HTMLDivElement>, card: CardData) => void;
}

export default function Card({
  card, flipped, matched, shaking, hinted, ghost, watermark, onFlip, onSpeak, onPointerDown,
}: CardProps) {
  const isWord = card.type === 'word';

  return (
    <div
      data-card-id={ghost ? undefined : card.cardId}
      onClick={() => onFlip?.(card.cardId)}
      onPointerDown={(e) => onPointerDown?.(e, card)}
      className={[
        'card-perspective h-full w-full cursor-pointer touch-none rounded-[0.9rem] transition',
        shaking && 'animate-shake',
        flipped && !matched && 'card-selected',
        hinted && 'ring-4 ring-amber-400 scale-105',
        matched && 'animate-pop-match pointer-events-none',
      ].filter(Boolean).join(' ')}
    >
      <div className={`card-inner ${flipped || matched ? 'is-flipped' : ''}`}>
        <div className="card-front flex flex-col items-center pt-2">
          <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border border-white/80 bg-white/55 text-[9px] font-black text-fuchsia-700">
            {CARD_BADGE}
          </span>
          <span aria-hidden className="relative z-10 mt-1.5 text-2xl opacity-30 grayscale">
            {watermark}
          </span>
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