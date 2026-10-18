'use client';

import { useEffect, useState } from 'react';
import { useAssetLoader } from '@/hooks/useAssetLoader';
import { getAudio } from '@/lib/audio';
import GameRoot from './GameRoot';
import LoadingScreen from './LoadingScreen';


const REQUIRE_TAP = true;

export default function Game() {
  const assets = useAssetLoader();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!REQUIRE_TAP && assets.ready) setEntered(true);
  }, [assets.ready]);

  const play = () => {
    const { music, speech } = getAudio();
    music.start();
    speech.unlock();
    setEntered(true);
  };

  if (!entered) return <LoadingScreen {...assets} onPlay={play} />;
  return <GameRoot />;
}