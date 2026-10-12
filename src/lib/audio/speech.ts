import type { TtsSession } from '@mintplex-labs/piper-tts-web';

/**
 * German text-to-speech using Piper (neural voice, runs fully in the browser via WASM).
 *
 * - The voice model (~63 MB) is downloaded once on the first visit and cached by the browser.
 * - Until it is ready (or if it fails to load) the browser's built-in voice is used instead,
 *   so tapping a card is never silent.
 * - Each word is rendered once and cached, so repeat taps are instant.
 */

// Any key from `await tts.voices()` works. German options: de_DE-thorsten-medium (default),
// de_DE-thorsten-high (114 MB, best), de_DE-thorsten-low (63 MB), de_DE-eva_k-x_low (21 MB, smallest).
const VOICE_ID = 'de_DE-thorsten-medium';

// Tiny silent clip, played once on the first tap so iOS/Safari allows later programmatic playback
const SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

export type VoiceStatus = 'idle' | 'loading' | 'ready' | 'error';
export interface VoiceState {
    status: VoiceStatus;
    /** Model download progress, 0..1 */
    progress: number;
}

export class GermanSpeechEngine {
    state: VoiceState = { status: 'idle', progress: 0 };

    private listeners = new Set<(s: VoiceState) => void>();
    private session?: TtsSession;
    private loading?: Promise<void>;
    private queue: Promise<unknown> = Promise.resolve(); // Piper renders one text at a time
    private cache = new Map<string, string>();            // word -> blob URL
    private inflight = new Map<string, Promise<string | null>>();
    private el?: HTMLAudioElement;
    private unlocked = false;
    private reqId = 0;

    // Fallback: browser voice
    private synth?: SpeechSynthesis;
    private deVoice?: SpeechSynthesisVoice;

    constructor() {
        if (typeof Audio !== 'undefined') this.el = new Audio();
        this.synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
        this.initBrowserVoice();
    }

    // ---------- status ----------
    subscribe(fn: (s: VoiceState) => void): () => void {
        this.listeners.add(fn);
        fn(this.state);
        return () => { this.listeners.delete(fn); };
    }

    private setState(patch: Partial<VoiceState>) {
        this.state = { ...this.state, ...patch };
        this.listeners.forEach((fn) => fn(this.state));
    }

    // ---------- loading the Piper voice ----------
    /** Call from the first user gesture: unlocks playback on iOS and starts loading the voice. */
    unlock() {
        if (!this.unlocked && this.el) {
            this.unlocked = true;
            this.el.src = SILENT_WAV;
            Promise.resolve(this.el.play()).then(() => this.el?.pause()).catch(() => {});
        }
        void this.load();
    }

    load(): Promise<void> {
        if (this.loading) return this.loading;
        this.setState({ status: 'loading', progress: 0 });
        this.loading = (async () => {
            try {
                // Imported lazily so nothing Piper-related runs during server rendering
                const { TtsSession } = await import('@mintplex-labs/piper-tts-web');
                this.session = await TtsSession.create({
                    voiceId: VOICE_ID,
                    progress: (p) => {
                        if (p.url.endsWith('.onnx') && p.total) {
                            this.setState({ progress: Math.min(1, p.loaded / p.total) });
                        }
                    },
                });
                this.setState({ status: 'ready', progress: 1 });
            } catch (err) {
                console.warn('Piper voice failed to load, using the browser voice instead.', err);
                this.setState({ status: 'error' });
            }
        })();
        return this.loading;
    }

    // ---------- rendering ----------
    private render(text: string): Promise<string | null> {
        const hit = this.cache.get(text);
        if (hit) return Promise.resolve(hit);
        const pending = this.inflight.get(text);
        if (pending) return pending;

        const job = this.queue.then(() => this.session!.predict(text));
        this.queue = job.catch(() => {});
        const p = job
            .then((blob) => {
                const url = URL.createObjectURL(blob);
                this.cache.set(text, url);
                return url;
            })
            .catch((err) => {
                console.warn('Piper could not render', text, err);
                return null;
            })
            .finally(() => this.inflight.delete(text));
        this.inflight.set(text, p);
        return p;
    }

    /** Pre-render words in the background (e.g. a level's vocabulary) so taps play instantly. */
    async warm(words: string[]) {
        await this.load();
        if (this.state.status !== 'ready') return;
        for (const w of new Set(words)) {
            if (!this.cache.has(w)) await this.render(w);
        }
    }

    // ---------- speaking ----------
    async speak(text: string) {
        const id = ++this.reqId;
        this.stop();

        let url = this.cache.get(text) ?? null;
        if (!url) {
            if (this.state.status === 'ready') url = await this.render(text);
            else void this.load(); // not ready yet: start loading and use the browser voice for now
        }
        if (id !== this.reqId) return; // the player already tapped something else

        if (url && this.el) {
            this.el.src = url;
            this.el.currentTime = 0;
            Promise.resolve(this.el.play()).catch(() => this.speakWithBrowserVoice(text));
        } else {
            this.speakWithBrowserVoice(text);
        }
    }

    stop() {
        this.el?.pause();
        this.synth?.cancel();
    }

    // ---------- fallback: browser voice ----------
    private initBrowserVoice() {
        if (!this.synth) return;
        const update = () => {
            this.deVoice = this.synth!.getVoices().find((v) => v.lang.toLowerCase().includes('de'));
        };
        update();
        if (this.synth.onvoiceschanged !== undefined) this.synth.onvoiceschanged = update;
    }

    private speakWithBrowserVoice(text: string) {
        if (!this.synth) return;
        this.synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        utterance.rate = 0.88; // slightly slow for language learning
        if (this.deVoice) utterance.voice = this.deVoice;
        this.synth.speak(utterance);
    }
}