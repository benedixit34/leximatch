'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CITIES } from '@/data/cities';
import { getAudio, speak } from '@/lib/audio';
import { buildDeck } from '@/lib/utils';
import type { CardData, ModalId, Screen } from '@/lib/types';

const LEVEL_SECONDS = 180;
const START_CURRENCY = 230;

export function useGame() {
  // ---- Progress / meta-game ----
  const [screen, setScreen] = useState<Screen>('map');
  const [unlockedIdx, setUnlockedIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [levelStars, setLevelStars] = useState<number[]>(() => CITIES.map(() => 0));
  const [coins, setCoins] = useState(START_CURRENCY);
  const [gems, setGems] = useState(START_CURRENCY);
  const [totalMatches, setTotalMatches] = useState(0);
  const [streak, setStreak] = useState(0);

  // ---- Current level ----
  const [deck, setDeck] = useState<CardData[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]); // cardIds face-up and not yet resolved
  const [shaking, setShaking] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]); // pairIds, in match order
  const [hinted, setHinted] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(LEVEL_SECONDS);
  const [paused, setPaused] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);

  // ---- UI ----
  const [modal, setModal] = useState<ModalId>(null);
  const [toast, setToast] = useState({ msg: '', visible: false });
  const [musicOn, setMusicOn] = useState(true);

  const city = CITIES[selectedIdx];

  // Fresh values for timeouts/pointer handlers (avoids stale closures)
  const live = useRef({ deck, matched, paused, timeLeft, selectedIdx, coins });
  live.current = { deck, matched, paused, timeLeft, selectedIdx, coins };
  const flippedRef = useRef<string[]>([]); // synchronous mirror so two quick taps / a drag-drop both register
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showToast = useCallback((msg: string) => {
    setToast({ msg, visible: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2200);
  }, []);

  const setFlippedBoth = (ids: string[]) => {
    flippedRef.current = ids;
    setFlipped(ids);
  };

  // ---- Level lifecycle ----
  const loadLevel = useCallback((idx: number) => {
    setDeck(buildDeck(CITIES[idx]));
    setFlippedBoth([]);
    setShaking([]);
    setMatched([]);
    setHinted(null);
    setTimeLeft(LEVEL_SECONDS);
    setCleared(false);
    setPaused(false);
    setModal(null);
  }, []);

  const startLevel = () => {
    setScreen('game');
    loadLevel(selectedIdx);
  };
  const backToMap = () => {
    setPaused(false);
    setModal(null);
    setScreen('map');
  };
  const restartLevel = () => loadLevel(selectedIdx);

  const selectCity = (idx: number) => {
    if (idx <= unlockedIdx) setSelectedIdx(idx);
    else showToast(`Clear Level ${idx} to unlock ${CITIES[idx].name}!`);
  };

  // ---- Timer ----
  useEffect(() => {
    if (screen !== 'game' || paused || cleared || timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [screen, paused, cleared, timeLeft]);

  useEffect(() => {
    if (screen === 'game' && timeLeft === 0 && !cleared) showToast('⏰ Time is up! Try again!');
  }, [screen, timeLeft, cleared, showToast]);

  // ---- Cards ----
  const handleVictory = useCallback(() => {
    const idx = live.current.selectedIdx;
    const t = live.current.timeLeft;
    const stars = t > 100 ? 3 : t > 50 ? 2 : 1;
    getAudio().sfx.playVictory();
    setCleared(true);
    setEarnedStars(stars);
    setLevelStars((prev) => prev.map((s, i) => (i === idx ? Math.max(s, stars) : s)));
    setUnlockedIdx((u) => (idx === u && u < CITIES.length - 1 ? u + 1 : u));
    setCoins((c) => c + 150);
    setGems((g) => g + 75);
    setTimeout(() => setModal('victory'), 600);
  }, []);

  const resolvePair = useCallback(
    (aId: string, bId: string) => {
      const { deck: d, selectedIdx: idx } = live.current;
      const a = d.find((c) => c.cardId === aId);
      const b = d.find((c) => c.cardId === bId);
      if (!a || !b) return;
      const { sfx } = getAudio();

      if (a.pairId === b.pairId && a.type !== b.type) {
        sfx.playMatch();
        setTotalMatches((n) => n + 1);
        setStreak((n) => n + 1);
        setCoins((c) => c + 50);
        setGems((g) => g + 25);
        setTimeout(() => {
          const count = live.current.matched.length + 1;
          setMatched((m) => [...m, a.pairId]);
          setFlippedBoth([]);
          if (count === CITIES[idx].pairs.length) handleVictory();
        }, 400);
      } else {
        sfx.playError();
        setStreak(0);
        setShaking([aId, bId]);
        setTimeout(() => {
          setShaking([]);
          setFlippedBoth([]);
        }, 800);
      }
    },
    [handleVictory]
  );

  const flipCard = useCallback(
    (cardId: string) => {
      const L = live.current;
      if (L.paused || flippedRef.current.length >= 2 || flippedRef.current.includes(cardId)) return;
      const card = L.deck.find((c) => c.cardId === cardId);
      if (!card || L.matched.includes(card.pairId)) return;

      getAudio().sfx.playFlip();
      speak(card.pair.german);

      const next = [...flippedRef.current, cardId];
      setFlippedBoth(next);
      if (next.length === 2) resolvePair(next[0], next[1]);
    },
    [resolvePair]
  );

  const canStartDrag = () => flippedRef.current.length === 0 && !live.current.paused;

  const requestHint = () => {
    if (live.current.coins < 20) return showToast('Not enough coins!');
    const pair = city.pairs.find((p) => !live.current.matched.includes(p.id));
    if (!pair) return;
    setCoins((c) => c - 20);
    speak(pair.german);
    setHinted(pair.id);
    setTimeout(() => setHinted(null), 1800);
    showToast(`Hint: Match "${pair.german}"! 🎧`);
  };

  const share = () => {
    const text = `🏆 Playing German Express! Unlocked ${unlockedIdx + 1} cities with ${coins} coins!`;
    navigator.clipboard?.writeText(text).catch(() => {});
    showToast('Travel record copied to clipboard!');
  };

  const continueAfterVictory = () => {
    setModal(null);
    setSelectedIdx((i) => Math.min(i + 1, CITIES.length - 1));
    setScreen('map');
  };

  const pause = () => {
    setPaused(true);
    setModal('pause');
  };
  const resume = () => {
    setPaused(false);
    setModal(null);
  };

  // ---- Music ----
  useEffect(() => {
    const { music } = getAudio();
    setMusicOn(music.enabled);
    const unlock = () => music.start(); // browsers only allow audio after a user gesture
    const onVisibility = () => {
      if (!music.ctx) return;
      if (document.hidden) music.ctx.suspend();
      else music.ctx.resume();
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    getAudio().music.setMode(screen === 'map' ? 'map' : city.theme);
  }, [screen, city.theme]);

  const toggleMusic = () => setMusicOn(getAudio().music.toggle());

  return {
    // state
    screen, city, cities: CITIES, unlockedIdx, selectedIdx, levelStars, coins, gems,
    totalMatches, streak, deck, flipped, shaking, matched, hinted, timeLeft, paused,
    earnedStars, modal, toast, musicOn,
    // actions
    setModal, selectCity, startLevel, backToMap, restartLevel, flipCard, canStartDrag,
    requestHint, share, pause, resume, continueAfterVictory, toggleMusic, speak,
  };
}

export type GameApi = ReturnType<typeof useGame>;
