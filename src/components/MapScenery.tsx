/** Code-drawn art for the journey map: trees, rocks, ferns, the stone path and the welcome sign. */
import type { MapLayout } from '../lib/mapLayout';

const TREE_COLORS = [
  { base: '#0f766e', mid: '#2dd4bf', dark: '#0b4f4a' },
  { base: '#0e7490', mid: '#22d3ee', dark: '#0a4a5e' },
  { base: '#15803d', mid: '#4ade80', dark: '#0f5a2b' },
];

/** One rounded layer of pine foliage */
function Foliage({ cy, rx, ry, c }: { cy: number; rx: number; ry: number; c: (typeof TREE_COLORS)[number] }) {
  return (
    <g>
      <ellipse cx="50" cy={cy + 4} rx={rx + 2} ry={ry} fill={c.dark} />
      <ellipse cx="50" cy={cy} rx={rx} ry={ry - 2} fill={c.base} />
      <ellipse cx={50 - rx * 0.28} cy={cy - ry * 0.35} rx={rx * 0.55} ry={ry * 0.4} fill={c.mid} opacity="0.65" />
    </g>
  );
}

export function Tree({ shade = 0, className, style }: { shade?: number; className?: string; style?: React.CSSProperties }) {
  const c = TREE_COLORS[shade % TREE_COLORS.length];
  return (
    <svg viewBox="0 0 100 150" className={className} style={style} aria-hidden>
      <ellipse cx="52" cy="146" rx="30" ry="4.5" fill="rgba(0,0,0,0.22)" />
      <path d="M43 148 L46 92 L57 92 L60 148 Z" fill="#9a5b2e" />
      <path d="M53 92 L57 92 L60 148 L52 148 Z" fill="#7a431f" />
      <ellipse cx="50" cy="128" rx="5" ry="7" fill="none" stroke="#6b3a1a" strokeWidth="1.6" opacity="0.7" />
      <Foliage cy={90} rx={46} ry={26} c={c} />
      <Foliage cy={64} rx={38} ry={22} c={c} />
      <Foliage cy={40} rx={29} ry={19} c={c} />
      <Foliage cy={19} rx={17} ry={14} c={c} />
    </svg>
  );
}

export function Rock({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 62 44" className={className} style={style} aria-hidden>
      <ellipse cx="31" cy="41" rx="28" ry="3.5" fill="rgba(0,0,0,0.2)" />
      <path d="M3 40 L10 15 L30 5 L52 11 L59 40 Z" fill="#8b93a1" />
      <path d="M10 15 L30 5 L52 11 L40 21 L20 23 Z" fill="#d1d5db" />
      <path d="M20 23 L40 21 L59 40 L3 40 Z" fill="#9ca3af" opacity="0.6" />
    </svg>
  );
}

export function Fern({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const leaves = ['M30 44 Q14 30 5 14', 'M30 44 Q20 26 17 6', 'M30 44 Q30 24 30 3', 'M30 44 Q40 26 43 6', 'M30 44 Q46 30 55 14'];
  return (
    <svg viewBox="0 0 60 46" className={className} style={style} aria-hidden>
      {leaves.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={i % 2 ? '#2f9e44' : '#237a36'} strokeWidth="6" strokeLinecap="round" />
      ))}
    </svg>
  );
}

/** The winding flagstone path */
export function PathArt({ layout }: { layout: MapLayout }) {
  const { pathD, height, width } = layout;
  const common = { d: pathD, fill: 'none', strokeLinejoin: 'round' as const };
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 w-full"
      style={{ height }}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <path {...common} stroke="rgba(40,70,10,0.45)" strokeWidth="122" strokeLinecap="round" transform="translate(0 5)" />
      <path {...common} stroke="#7f9f33" strokeWidth="114" strokeLinecap="round" />
      <path {...common} stroke="#cde77a" strokeWidth="104" strokeLinecap="round" />
      {/* flagstone seams: short wide dashes across the path, at two scales so the stones look irregular */}
      <path {...common} stroke="#86ab2f" strokeWidth="104" strokeDasharray="3 46" />
      <path {...common} stroke="#93b73a" strokeWidth="62" strokeDasharray="2.5 31" strokeDashoffset="16" />
      <path {...common} stroke="#a3c444" strokeWidth="34" strokeDasharray="2 23" strokeDashoffset="7" />
      <path {...common} stroke="rgba(255,255,255,0.22)" strokeWidth="5" strokeLinecap="round" transform="translate(-30 0)" />
    </svg>
  );
}

/** Pink wooden sign with a purple frame, at the start of the journey */
export function WelcomeSign({ text, top }: { text: string; top: number }) {
  return (
    <div className="absolute left-0 drop-shadow-[0_6px_6px_rgba(0,0,0,0.35)]" style={{ top }}>
      <div className="map-sign flex h-[4.4rem] w-[9.8rem] items-center justify-center pl-4 pr-6 text-center text-[13px] font-semibold leading-tight text-fuchsia-950">
        {text}
      </div>
    </div>
  );
}