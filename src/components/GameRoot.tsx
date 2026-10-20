'use client';

import { useGame } from '@/hooks/useGame';
import GameScreen from './GameScreen';
import MapScreen from './MapScreen';
import { PauseModal, Toast, TrophyModal } from './Modals';
import VictoryModal from './VictoryModal';

export default function GameRoot() {
  const game = useGame();
  const theme = game.screen === 'map' ? 'bg-map-theme' : `bg-theme-${game.city.theme}`;

  return (
    <>
      <div
        className={`w-full max-w-md min-h-[92vh] sm:min-h-[860px] ${theme} rounded-[2.5rem] border-4 border-slate-900 shadow-2xl relative flex flex-col justify-between overflow-hidden p-3 sm:p-4 transition-all duration-500`}
      >
        {game.screen === 'map' ? <MapScreen game={game} /> : <GameScreen game={game} />}
      </div>
      <PauseModal game={game} />
      <TrophyModal game={game} />
      <VictoryModal game={game} />
      <Toast game={game} />
    </>
  );
}