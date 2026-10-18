import { MusicEngine } from './music';
import { SoundSynth } from './sfx';
import { GermanSpeechEngine } from './speech';

export type { VoiceState } from './speech';

interface AudioEngines {
  music: MusicEngine;
  sfx: SoundSynth;
  speech: GermanSpeechEngine;
}

let engines: AudioEngines | null = null;

/** Lazily creates the audio engines. Browser-only: call from effects/handlers, never during render. */
export function getAudio(): AudioEngines {
  if (!engines) {
    engines = { music: new MusicEngine(), sfx: new SoundSynth(), speech: new GermanSpeechEngine() };
  }
  return engines;
}

/** Speak a German word, briefly ducking the background music so it stays audible. */
export function speak(text: string): void {
  const { music, speech } = getAudio();
  music.duck();
  speech.speakGerman(text);
}