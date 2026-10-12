import type { CardData, City } from './types';

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** One word card + one image card per pair, shuffled. */
export function buildDeck(city: City): CardData[] {
  return shuffle(
    city.pairs.flatMap((pair): CardData[] => [
      { cardId: `${pair.id}_word`, pairId: pair.id, type: 'word', pair },
      { cardId: `${pair.id}_img`, pairId: pair.id, type: 'image', pair },
    ])
  );
}

export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
