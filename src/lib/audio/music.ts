/**
 * Background music: one looping track that plays on every screen.
 * Put your file at  public/audio/background.mp3  (served as /audio/background.mp3).
 */
export const MUSIC_SRC = '/audio/background.mp3';

const LEVEL = 0.4;   // normal volume (0..1)
const DUCKED = 0.12; // volume while a German word is being spoken

export class MusicEngine {
    enabled = true;
    started = false;

    private audio?: HTMLAudioElement;
    private rampTimer?: ReturnType<typeof setInterval>;
    private duckTimer?: ReturnType<typeof setTimeout>;

    constructor() {
        try { if (localStorage.getItem('ge-music') === '0') this.enabled = false; } catch { /* storage unavailable */ }
    }

    private get el(): HTMLAudioElement {
        if (!this.audio) {
            const a = new Audio(MUSIC_SRC);
            a.loop = true;
            a.preload = 'auto';
            a.volume = 0;
            a.addEventListener('error', () => console.warn(`Background music not found at ${MUSIC_SRC}`));
            this.audio = a;
        }
        return this.audio;
    }

    /**
     * Resolves once the track is buffered, or has failed to load, so a loading screen can never get stuck on it.
     * iPhones/iPads ignore preloading until the first tap, so they are not waited for.
     */
    preload(): Promise<void> {
        const a = this.el;
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        if (isIOS || a.readyState >= 4) return Promise.resolve();
        return new Promise((resolve) => {
            const done = () => {
                a.removeEventListener('canplaythrough', done);
                a.removeEventListener('error', done);
                resolve();
            };
            a.addEventListener('canplaythrough', done);
            a.addEventListener('error', done);
        });
    }

    /** Call on every user gesture. Browsers block audio until the first tap, so this retries until it plays. */
    start() {
        this.started = true;
        if (this.enabled) this.playWithFadeIn();
    }

    private playWithFadeIn() {
        const a = this.el;
        if (!a.paused) return;
        a.volume = 0;
        Promise.resolve(a.play())
            .then(() => this.fadeTo(LEVEL, 600))
            .catch(() => { /* autoplay still blocked: the next tap tries again */ });
    }

    toggle(): boolean {
        this.enabled = !this.enabled;
        try { localStorage.setItem('ge-music', this.enabled ? '1' : '0'); } catch { /* ignore */ }
        if (this.started) {
            if (this.enabled) this.playWithFadeIn();
            else this.fadeTo(0, 300, () => { if (!this.enabled) this.audio?.pause(); });
        }
        return this.enabled;
    }

    /** Lower the music briefly while a German word is spoken. (iPhones ignore volume changes, so no ducking there.) */
    duck() {
        if (!this.started || !this.enabled || !this.audio || this.audio.paused) return;
        this.fadeTo(DUCKED, 150);
        clearTimeout(this.duckTimer);
        this.duckTimer = setTimeout(() => { if (this.enabled) this.fadeTo(LEVEL, 500); }, 1800);
    }

    /** Used when the browser tab is hidden / shown again. */
    pause() { this.audio?.pause(); }
    resume() { if (this.started && this.enabled) this.playWithFadeIn(); }

    private fadeTo(target: number, ms: number, done?: () => void) {
        clearInterval(this.rampTimer);
        const a = this.audio;
        if (!a) return;
        const from = a.volume;
        const steps = Math.max(1, Math.round(ms / 30));
        let i = 0;
        this.rampTimer = setInterval(() => {
            i++;
            a.volume = Math.min(1, Math.max(0, from + (target - from) * (i / steps)));
            if (i >= steps) {
                clearInterval(this.rampTimer);
                done?.();
            }
        }, 30);
    }
}