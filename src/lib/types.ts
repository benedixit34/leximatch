export type ThemeId = 'vienna' | 'berlin' | 'munich' | 'hamburg' | 'honolulu';
export type Screen = 'map' | 'game';
export type ModalId = 'pause' | 'trophy' | 'victory' | null;

export interface Pair {
  id: string;
  german: string;
  english: string;
  emoji: string;
}

export interface City {
  level: number;
  name: string;
  venue: string;
  theme: ThemeId;
  icon: string;
  /** Position of the city pin on the map, in % of the map viewport */
  pin: { left: number; top: number };
  /** Where the squirrel mascot stands when this city is selected (%) */
  mascot: { left: number; top: number };
  speechTip: string;
  pairs: Pair[];
}

export interface CardData {
  cardId: string;
  pairId: string;
  type: 'word' | 'image';
  pair: Pair;
}
