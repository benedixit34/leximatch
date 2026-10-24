'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CITIES } from '@/data/cities';
import { getAudio, speak, type VoiceState } from '@/lib/audio';
import { buildDeck, shuffle } from '@/lib/utils';
import type { CardData, ModalId, Screen } from '@/lib/types';

const LEVEL_SECONDS = 180;
const START_CURRENCY = 230;
export const HINT_COST = 20;
export const SHUFFLES_PER_LEVEL = 3;
const LEVEL_BONUS_COINS = 150;
const LEVEL_BONUS_GEMS = 75;

/** Everything the victory screen shows about the level the player just cleared. */
export interface LevelResult {
  /** Seconds it took to clear the level */
  seconds: number;
  /** % of pair attempts that were correct (100 = no mistakes) */
  accuracy: number;
  /** Faster than the player's previous best for this level (or the first clear) */
  newBest: boolean;
  stars: number;
  coins: number;
  gems: number;
}

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
  const [shuffles, setShuffles] = useState(SHUFFLES_PER_LEVEL);
  const [result, setResult] = useState<LevelResult | null>(null);
  const [bestTimes, setBestTimes] = useState<(number | null)[]>(() => CITIES.map(() => null));

  // ---- UI ----
  const [modal, setModal] = useState<ModalId>(null);
  const [toast, setToast] = useState({ msg: '', visible: false });
  const [musicOn, setMusicOn] = useState(true);
  const [voice, setVoice] = useState<VoiceState>({ status: 'idle', progress: 0 });

  const city = CITIES[selectedIdx];

  // Fresh values for timeouts/pointer handlers (avoids stale closures)
  const live = useRef({ deck, matched, paused, timeLeft, selectedIdx, coins, bestTimes, shuffles, cleared });
  live.current = { deck, matched, paused, timeLeft, selectedIdx, coins, bestTimes, shuffles, cleared };
  const mistakes = useRef(0); // wrong pairs in the current level, used for accuracy
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
    setShuffles(SHUFFLES_PER_LEVEL);
    setResult(null);
    mistakes.current = 0;
    setPaused(false);
    setModal(null);
    // Pre-render this level's German words so tapping a card plays instantly
    void getAudio().speech.warm(CITIES[idx].pairs.map((p) => p.german));
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

  /** Tap a level on the map: select it and start playing right away. */
  const playLevel = (idx: number) => {
    if (idx > unlockedIdx) return showToast(`Clear Level ${idx} to unlock ${CITIES[idx].venue}!`);
    setSelectedIdx(idx);
    setScreen('game');
    loadLevel(idx);
  };

  const selectCity = (idx: number) => {
    if (idx <= unlockedIdx) setSelectedIdx(idx);
    else showToast(`Clear Level ${idx} to unlock ${CITIES[idx].venue}!`);
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
    const timeLeftNow = live.current.timeLeft;
    const stars = timeLeftNow > 100 ? 3 : timeLeftNow > 50 ? 2 : 1;

    const seconds = LEVEL_SECONDS - timeLeftNow;
    const pairs = CITIES[idx].pairs.length;
    const accuracy = Math.round((pairs / (pairs + mistakes.current)) * 100);
    const previousBest = live.current.bestTimes[idx];
    const newBest = previousBest === null || seconds < previousBest;

    getAudio().sfx.playVictory();
    setCleared(true);
    setResult({ seconds, accuracy, newBest, stars, coins: LEVEL_BONUS_COINS, gems: LEVEL_BONUS_GEMS });
    if (newBest) setBestTimes((prev) => prev.map((b, i) => (i === idx ? seconds : b)));
    setLevelStars((prev) => prev.map((st, i) => (i === idx ? Math.max(st, stars) : st)));
    setUnlockedIdx((u) => (idx === u && u < CITIES.length - 1 ? u + 1 : u));
    setCoins((c) => c + LEVEL_BONUS_COINS);
    setGems((g) => g + LEVEL_BONUS_GEMS);
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
        mistakes.current += 1;
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
    if (live.current.coins < HINT_COST) return showToast('Not enough coins!');
    const pair = city.pairs.find((p) => !live.current.matched.includes(p.id));
    if (!pair) return;
    setCoins((c) => c - HINT_COST);
    speak(pair.german);
    setHinted(pair.id);
    setTimeout(() => setHinted(null), 1800);
    showToast(`Hint: Match "${pair.german}"! 🎧`);
  };

  /** Re-deal the cards that are still face-down. Matched cards stay in their (empty) slots. */
  const shuffleBoard = () => {
    const L = live.current;
    if (L.paused || L.cleared || L.shuffles <= 0 || flippedRef.current.length > 0) return;
    const open = L.deck.reduce<number[]>((acc, c, i) => (L.matched.includes(c.pairId) ? acc : [...acc, i]), []);
    if (open.length < 2) return;
    const mixed = shuffle(open.map((i) => L.deck[i]));
    setDeck(L.deck.map((c, i) => (open.includes(i) ? mixed[open.indexOf(i)] : c)));
    setShuffles((n) => n - 1);
    getAudio().sfx.playFlip();
    showToast('Cards shuffled! 🔀');
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
    const { music, speech } = getAudio();
    setMusicOn(music.enabled);
    const stopVoiceUpdates = speech.subscribe(setVoice);
    const unlock = () => {
      // browsers only allow audio after a user gesture
      music.start();
      speech.unlock();
    };
    const onVisibility = () => (document.hidden ? music.pause() : music.resume());
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      document.removeEventListener('visibilitychange', onVisibility);
      stopVoiceUpdates();
    };
  }, []);

  const toggleMusic = () => setMusicOn(getAudio().music.toggle());

  return {
    // state
    screen, city, cities: CITIES, unlockedIdx, selectedIdx, levelStars, coins, gems,
    totalMatches, streak, deck, flipped, shaking, matched, hinted, timeLeft, paused, shuffles,
    result, modal, toast, musicOn, voice,
    // actions
    setModal, selectCity, playLevel, notify: showToast, startLevel, backToMap, restartLevel, flipCard, canStartDrag,
    requestHint, shuffleBoard, share, pause, resume, continueAfterVictory, toggleMusic, speak,
  };
}

export type GameApi = ReturnType<typeof useGame>;