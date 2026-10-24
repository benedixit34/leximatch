import { StarShape } from './icons';

interface LevelNodeProps {
  level: number;
  locked: boolean;
  selected: boolean;
  /** 0..3 stars earned */
  stars: number;
  /** Theme id: the landmark photo comes from --img-<theme> */
  theme: string;
  label: string;
  onClick: () => void;
}

const PALETTE = {
  open: { top: '#fbcfe8', topDeep: '#f472b6', rim: '#fdf2f8', sideL: '#be185d', sideR: '#701a45' },
  locked: { top: '#e5e7eb', topDeep: '#c4c8d2', rim: '#f3f4f6', sideL: '#8b90a0', sideR: '#4e5260' },
};

/** A level on the map: a 3D stone pedestal with a flag (landmark photo, or "?" while locked) and three stars. */
export default function LevelNode({ level, locked, selected, stars, theme, label, onClick }: LevelNodeProps) {
  const c = locked ? PALETTE.locked : PALETTE.open;
  const id = `lvl${level}`;

  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-current={selected ? 'step' : undefined}
      className="group absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 transition-transform active:scale-95"
    >
      {selected && (
        <span
          aria-hidden
          className="animate-node-pulse absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-[42%] rounded-full border-2 border-pink-200/70 bg-pink-400/30"
        />
      )}

      {/* Flag */}
      <span className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center" style={{ bottom: 'calc(100% - 26px)' }}>
        <span
          className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-md border-[3px] shadow-lg ${
            locked ? 'border-slate-600 bg-slate-900' : 'border-pink-500 bg-pink-200'
          }`}
          style={
            locked
              ? undefined
              : { backgroundImage: `var(--img-${theme})`, backgroundSize: 'cover', backgroundPosition: 'center bottom' }
          }
        >
          {locked && <span className="text-3xl font-black text-white">?</span>}
        </span>
        <span
          className={`h-0 w-0 border-x-[9px] border-t-[11px] border-x-transparent ${locked ? 'border-t-slate-600' : 'border-t-pink-500'}`}
        />
      </span>

      {/* Pedestal */}
      <svg viewBox="0 0 100 100" className="relative h-full w-full drop-shadow-[0_5px_4px_rgba(0,0,0,0.3)]" aria-hidden>
        <defs>
          <linearGradient id={`${id}-side`} x1="0" x2="1">
            <stop offset="0" stopColor={c.sideL} />
            <stop offset="1" stopColor={c.sideR} />
          </linearGradient>
          <linearGradient id={`${id}-top`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c.top} />
            <stop offset="1" stopColor={c.topDeep} />
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="84" rx="46" ry="11" fill="rgba(0,0,0,0.25)" />
        <path d="M8 50 L8 68 C8 78 28 86 50 86 C72 86 92 78 92 68 L92 50 Z" fill={`url(#${id}-side)`} />
        <ellipse cx="50" cy="50" rx="42" ry="18" fill={`url(#${id}-top)`} stroke={c.rim} strokeWidth="2" />
        <ellipse cx="50" cy="50" rx="35" ry="14" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        {locked ? (
          <>
            <path d="M22 54 C34 44 46 56 58 46" fill="none" stroke="#a3a8b5" strokeWidth="1.4" opacity="0.7" />
            <path d="M46 58 C58 52 66 58 78 50" fill="none" stroke="#a3a8b5" strokeWidth="1.2" opacity="0.6" />
          </>
        ) : (
          <ellipse cx="38" cy="43" rx="14" ry="3.5" fill="#fff" opacity="0.35" />
        )}
      </svg>

      {/* Level number */}
      <span
        className={`pointer-events-none absolute inset-0 flex items-center justify-center text-[1.65rem] font-black tracking-tight text-white ${
          locked ? '[text-shadow:0_2px_0_rgba(55,60,75,0.9)]' : '[text-shadow:0_2px_0_#9d174d]'
        }`}
      >
        {String(level).padStart(2, '0')}
      </span>

      {/* Stars */}
      <span className="pointer-events-none absolute left-1/2 top-full -mt-5 flex -translate-x-1/2 items-end gap-0.5" data-stars={stars}>
        {[0, 1, 2].map((i) => (
          <span key={i} className={i === 1 ? 'translate-y-1' : ''}>
            <StarShape earned={i < stars} tone="dark" className="h-5 w-5 drop-shadow" />
          </span>
        ))}
      </span>
    </button>
  );
}