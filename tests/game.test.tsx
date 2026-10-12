import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Game from '@/components/Game';
import { CITIES } from '@/data/cities';

function node(): any {
  const g: any = { connect() {}, start() {}, stop() {}, setValueAtTime() {}, exponentialRampToValueAtTime() {}, setTargetAtTime() {}, cancelScheduledValues() {} };
  g.gain = g; g.frequency = g; g.delayTime = g; return g;
}
class FakeAC {
  currentTime = 0; sampleRate = 100; state = 'running'; destination = {};
  createGain = node; createBiquadFilter = node; createDelay = node; createOscillator = node; createBufferSource = node;
  createBuffer() { return { getChannelData: () => new Float32Array(200) }; }
  resume() {} suspend() {}
}

const ids = (c: Element) => c.getAttribute('data-card-id')!;
const card = (id: string) => document.querySelector(`[data-card-id="${id}"]`)!;
const tick = (ms: number) => act(() => { vi.advanceTimersByTime(ms); });
const play = (pairId: string) => { fireEvent.click(card(`${pairId}_word`)); fireEvent.click(card(`${pairId}_img`)); };

beforeEach(() => { vi.useFakeTimers(); (window as any).AudioContext = FakeAC; });
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('German Express', () => {
  it('starts on the map with only Vienna unlocked', () => {
    render(<Game />);
    expect(screen.getByText('PLAY LEVEL')).toBeTruthy();
    expect(screen.getAllByText('READY')).toHaveLength(1);
    expect(screen.getAllByText('🔒')).toHaveLength(4);
  });

  it('plays a level: mismatch resets, matches fill the tray, victory unlocks Berlin', () => {
    render(<Game />);
    fireEvent.click(screen.getByText('PLAY LEVEL'));
    expect(screen.getByText('SCHÖNBRUNN PALACE')).toBeTruthy();
    expect(document.querySelectorAll('[data-card-id]')).toHaveLength(12);
    expect(screen.getByText('03:00')).toBeTruthy();

    // timer ticks
    tick(1000); tick(1000);
    expect(screen.getByText('02:58')).toBeTruthy();

    // mismatch -> shakes, then flips back
    fireEvent.click(card('v_2_word'));
    fireEvent.click(card('v_3_img'));
    expect(card('v_2_word').className).toContain('animate-shake');
    tick(900);
    expect(card('v_2_word').className).not.toContain('card-selected');
    expect(card('v_2_word').className).not.toContain('animate-pop-match');

    // a third tap while two are flipped is ignored
    fireEvent.click(card('v_1_word')); fireEvent.click(card('v_1_img'));
    fireEvent.click(card('v_2_word'));
    expect(card('v_2_word').className).not.toContain('card-selected');
    tick(500);
    expect(card('v_1_word').className).toContain('animate-pop-match');
    expect(screen.getAllByText('Hallo').length).toBeGreaterThan(0); // in tray

    // finish the level
    ['v_2', 'v_3', 'v_4', 'v_5', 'v_6'].forEach((p) => { play(p); tick(500); });
    tick(700);
    expect(screen.getByText('CITY CLEARED!')).toBeTruthy();

    fireEvent.click(screen.getByText(/CONTINUE ON MAP/));
    expect(screen.getByText('PLAY LEVEL')).toBeTruthy();
    expect(screen.getByText('Berlin - Level 2')).toBeTruthy();
    expect(screen.getAllByText('🔒')).toHaveLength(3);
    expect(screen.getByText(/⭐ 3/)).toBeTruthy(); // fast clear = 3 stars
    expect(CITIES.length).toBe(5);
  });

  it('pause stops the timer; hint costs 20 coins; music toggle flips', () => {
    render(<Game />);
    fireEvent.click(screen.getByText('PLAY LEVEL'));
    fireEvent.click(screen.getByText('⏸️'));
    expect(screen.getByText('Game Paused')).toBeTruthy();
    tick(5000);
    fireEvent.click(screen.getByText('🎵 MUSIC: ON'));
    expect(screen.getByText('🎵 MUSIC: OFF')).toBeTruthy();
    fireEvent.click(screen.getByText(/RESUME/));
    expect(screen.getByText('03:00')).toBeTruthy();
    expect(screen.getAllByText('230').length).toBe(2);
    fireEvent.click(screen.getByText('💡'));
    expect(screen.getAllByText('230').length).toBe(1);
    expect(screen.getByText('210')).toBeTruthy();
  });
});
