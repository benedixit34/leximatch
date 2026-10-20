'use client';

import { useId } from 'react';

interface IconProps {
  className?: string;
}

/** Rounded five-point star with a white outline. Grey when not earned. */
export function StarShape({ earned, className }: IconProps & { earned: boolean }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={earned ? '#fde047' : '#cbd5e1'} />
          <stop offset="1" stopColor={earned ? '#f97316' : '#64748b'} />
        </linearGradient>
      </defs>
      <polygon
        points="12,1.8 14.9,8.7 22.3,9.3 16.7,14.1 18.4,21.4 12,17.5 5.6,21.4 7.3,14.1 1.7,9.3 9.1,8.7"
        fill={`url(#${id}-fill)`}
        stroke="#ffffff"
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