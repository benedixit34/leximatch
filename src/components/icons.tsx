'use client';

import { useId } from 'react';

interface IconProps {
  className?: string;
}

/** Rounded five-point star with a white outline. Grey when not earned. */
/** `tone` is how an UNEARNED star looks: 'light' (white-ish, on bright UI) or 'dark' (deep purple, on the map). */
export function StarShape({ earned, className, tone = 'light' }: IconProps & { earned: boolean; tone?: 'light' | 'dark' }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={earned ? '#fde047' : tone === 'dark' ? '#5b3a8f' : '#f1f5f9'} />
          <stop offset="1" stopColor={earned ? '#f97316' : tone === 'dark' ? '#2e1065' : '#94a3b8'} />
        </linearGradient>
      </defs>
      <polygon
        points="12,1.8 14.9,8.7 22.3,9.3 16.7,14.1 18.4,21.4 12,17.5 5.6,21.4 7.3,14.1 1.7,9.3 9.1,8.7"
        fill={`url(#${id}-fill)`}
        stroke={earned || tone === 'light' ? '#ffffff' : '#c4b5fd'}
        strokeWidth="1.8"
        strokeLinejoin="round"
        paintOrder="stroke"
      />
      {earned && <ellipse cx="9.2" cy="8.6" rx="2.4" ry="1.2" fill="#fff" opacity="0.55" transform="rotate(-35 9.2 8.6)" />}
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde047" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="21" fill={`url(#${id}-gold)`} stroke="#b45309" strokeWidth="2" />
      <circle cx="24" cy="24" r="15" fill="#fffbeb" stroke="#d97706" strokeWidth="1.5" />
      <path d="M24 14v10l7 4" stroke="#92400e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function SpeakerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M3 9v6h4l5 4V5L7 9H3z" fill="currentColor" />
      <path d="M15.5 8.5a5 5 0 010 7M18.2 5.8a8.8 8.8 0 010 12.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function RestartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4v6h-6" />
      <path d="M2 20v-6h6" />
      <path d="M3.5 9a9 9 0 0114.9-3.4L22 10M2 14l3.6 4.4A9 9 0 0020.5 15" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function CoinIcon({ className }: IconProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde047" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <g transform="rotate(-18 24 24)">
        <circle cx="24" cy="24" r="21" fill={`url(#${id}-c)`} stroke="#b45309" strokeWidth="2.5" />
        <circle cx="24" cy="24" r="14" fill="#fcd34d" stroke="#d97706" strokeWidth="2" />
        <path d="M24 15l2.6 6 6.4.5-4.9 4.2 1.5 6.3-5.6-3.4-5.6 3.4 1.5-6.3L15 21.5l6.4-.5z" fill="#f59e0b" />
      </g>
    </svg>
  );
}

export function GemIcon({ className }: IconProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f9a8d4" />
          <stop offset="1" stopColor="#db2777" />
        </linearGradient>
      </defs>
      <polygon points="15,4 33,4 44,15 44,33 33,44 15,44 4,33 4,15" fill={`url(#${id}-g)`} stroke="#fdf2f8" strokeWidth="3" strokeLinejoin="round" />
      <polygon points="18,12 30,12 36,18 36,30 30,36 18,36 12,30 12,18" fill="#f472b6" stroke="#fbcfe8" strokeWidth="1.5" />
      <path d="M17 17l5-4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export function PauseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <rect x="6" y="5" width="4.2" height="14" rx="1.4" />
      <rect x="13.8" y="5" width="4.2" height="14" rx="1.4" />
    </svg>
  );
}

export function HintIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 00-3.6 10.8c.7.6 1.1 1.4 1.1 2.2h5c0-.8.4-1.6 1.1-2.2A6 6 0 0012 3z" fill="currentColor" fillOpacity="0.25" />
    </svg>
  );
}

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-hidden>
      <path
        d="M20 3L4 16l16 13v-8h24V11H20z"
        fill="#ffffff"
        stroke="#7dd3fc"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}