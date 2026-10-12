// Procedural background music (Web Audio) - no audio files needed.
export type MusicMode = 'map' | 'vienna' | 'berlin' | 'munich' | 'hamburg' | 'honolulu';

interface MusicTheme {
    bpm: number;
    bpb: number;
    root: number;
    scale: number[];
    prog: number[];
    bass: number[];
    stab: number[];
    mel: number;
    melSteps: number[];
    lead: OscillatorType;
    waves: boolean;
    pluck?: boolean;
}

const MAJOR = [0,2,4,5,7,9,11];
const MUSIC_THEMES: Record<MusicMode, MusicTheme> = {
    // bpm, beats/bar, root note (MIDI), scale, chord roots per bar (scale degrees),
    // bass hits / chord stabs (eighth-note slots in the bar), melody chance + slots
    map:      { bpm: 80,  bpb: 4, root: 60, scale: MAJOR,                prog: [0,5,3,4], bass: [0],       stab: [],        mel: 0.55, melSteps: [0,2,4,6], lead: 'triangle', waves: false },
    vienna:   { bpm: 112, bpb: 3, root: 62, scale: MAJOR,                prog: [0,3,4,0], bass: [0],       stab: [2,4],     mel: 0.70, melSteps: [0,2,4,5], lead: 'triangle', waves: false }, // waltz
    berlin:   { bpm: 104, bpb: 4, root: 57, scale: [0,2,3,5,7,8,10],     prog: [0,5,2,6], bass: [0,2,4,6], stab: [],        mel: 0.40, melSteps: [0,3,4,7], lead: 'triangle', waves: false }, // minor pulse
    munich:   { bpm: 100, bpb: 4, root: 55, scale: MAJOR,                prog: [0,0,3,4], bass: [0,4],     stab: [2,6],     mel: 0.50, melSteps: [0,2,4,6], lead: 'triangle', waves: false }, // oom-pah
    hamburg:  { bpm: 72,  bpb: 4, root: 50, scale: [0,2,3,5,7,9,10],     prog: [0,3,0,4], bass: [0],       stab: [],        mel: 0.30, melSteps: [0,2,4,6], lead: 'sine',     waves: true  }, // mellow + sea
    honolulu: { bpm: 108, bpb: 4, root: 60, scale: MAJOR,                prog: [0,3,4,3], bass: [0,4],     stab: [1,3,5,7], mel: 0.45, melSteps: [0,2,4,6], lead: 'triangle', waves: true, pluck: true } // ukulele + surf
};

export class MusicEngine {
    ctx!: AudioContext;
    master!: GainNode;
    bus!: GainNode;
    mix!: GainNode;
    started: boolean;
    enabled: boolean;
    level: number;
    mode: MusicMode;
    cfg: MusicTheme;
    step: number;
    nextTime: number;
    mel: number;
    timer: ReturnType<typeof setInterval> | null;
    duckTimer?: ReturnType<typeof setTimeout>;

    constructor() {
        this.started = false;
        this.enabled = true;
        this.level = 0.5;
        this.mode = 'map';
        this.cfg = MUSIC_THEMES.map;
        this.step = 0;
        this.nextTime = 0;
        this.mel = 9;
        this.timer = null;
        try { if (localStorage.getItem('ge-music') === '0') this.enabled = false; } catch (e) {}
    }

    midi(m: number) { return 440 * Math.pow(2, (m - 69) / 12); }

    deg(d: number) {
        const sc = this.cfg.scale, n = sc.length;
        return this.cfg.root + sc[((d % n) + n) % n] + 12 * Math.floor(d / n);
    }

    init() {
        if (this.ctx) return;
        const ctx = this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        this.master = ctx.createGain();
        this.master.gain.value = 0;
        this.bus = ctx.createGain();
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass'; lp.frequency.value = 2400;
        const delay = ctx.createDelay(1); delay.delayTime.value = 0.32;
        const fb = ctx.createGain(); fb.gain.value = 0.3;
        const wet = ctx.createGain(); wet.gain.value = 0.35;
        this.bus.connect(lp); lp.connect(this.master);
        lp.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(this.master);
        this.master.connect(ctx.destination);

        // Gentle looping "waves" ambience (filtered noise with a slow swell)
        const len = ctx.sampleRate * 2;
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
        const noise = ctx.createBufferSource(); noise.buffer = buf; noise.loop = true;
        const nf = ctx.createBiquadFilter(); nf.type = 'lowpass'; nf.frequency.value = 600;
        const swell = ctx.createGain(); swell.gain.value = 0.08;
        const lfo = ctx.createOscillator(); lfo.frequency.value = 0.12;
        const lfoAmt = ctx.createGain(); lfoAmt.gain.value = 0.06;
        lfo.connect(lfoAmt); lfoAmt.connect(swell.gain);
        this.mix = ctx.createGain(); this.mix.gain.value = 0;
        noise.connect(nf); nf.connect(swell); swell.connect(this.mix); this.mix.connect(this.master);
        noise.start(); lfo.start();
    }

    start() {
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        if (this.started) return;
        this.started = true;
        this.mix.gain.value = this.cfg.waves ? 1 : 0;
        this.applyLevel();
        this.nextTime = this.ctx.currentTime + 0.15;
        this.timer = setInterval(() => this.tick(), 100);
    }

    applyLevel(delay = 0) {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        this.master.gain.cancelScheduledValues(now);
        this.master.gain.setTargetAtTime(this.enabled ? this.level : 0, now + delay, 0.4);
    }

    setMode(mode: MusicMode) {
        if (!MUSIC_THEMES[mode] || mode === this.mode) return;
        this.mode = mode;
        this.cfg = MUSIC_THEMES[mode];
        this.step = 0;
        this.mel = 9;
        if (!this.started) return; // will begin with this mode after the first tap
        const now = this.ctx.currentTime;
        this.master.gain.cancelScheduledValues(now);
        this.master.gain.setTargetAtTime(0, now, 0.12);   // quick fade-out
        this.mix.gain.setTargetAtTime(this.cfg.waves ? 1 : 0, now + 0.4, 0.5);
        this.nextTime = now + 0.6;
        this.applyLevel(0.5);                             // fade the new tune in
    }

    toggle() {
        this.enabled = !this.enabled;
        if (this.started) this.applyLevel();
        try { localStorage.setItem('ge-music', this.enabled ? '1' : '0'); } catch (e) {}
        return this.enabled;
    }

    // Lower the music briefly while a German word is being spoken
    duck() {
        if (!this.started || !this.enabled) return;
        const now = this.ctx.currentTime;
        this.master.gain.cancelScheduledValues(now);
        this.master.gain.setTargetAtTime(this.level * 0.3, now, 0.05);
        clearTimeout(this.duckTimer);
        this.duckTimer = setTimeout(() => this.applyLevel(), 1800);
    }

    tick() {
        const ctx = this.ctx;
        if (!ctx || ctx.state !== 'running') return;
        if (!this.enabled) { this.nextTime = ctx.currentTime + 0.1; return; }
        const stepDur = 60 / this.cfg.bpm / 2; // one eighth note
        while (this.nextTime < ctx.currentTime + 0.3) {
            this.playStep(this.step, this.nextTime, stepDur);
            this.nextTime += stepDur;
            this.step++;
        }
    }

    playStep(step: number, t: number, sd: number) {
        const c = this.cfg, perBar = c.bpb * 2;
        const pos = step % perBar, bar = Math.floor(step / perBar);
        const root = c.prog[bar % c.prog.length];
        const chord = [root, root + 2, root + 4];

        if (pos === 0) chord.forEach(d => this.tone(this.deg(d), t, perBar * sd, 'sine', 0.07, 0.5, 0.8)); // soft pad
        if (c.bass.includes(pos)) this.tone(this.deg(root) - 12, t, sd * 1.6, 'sine', 0.22, 0.01, 0.25);   // bass
        if (c.stab.includes(pos)) chord.forEach(d => this.tone(this.deg(d), t, c.pluck ? 0.05 : sd * 0.8, 'triangle', 0.08, 0.005, c.pluck ? 0.35 : 0.2));

        if (c.melSteps.includes(pos) && Math.random() < c.mel) {
            if (pos === 0) this.mel = root + 7 + [0,2,4][Math.floor(Math.random() * 3)];
            else this.mel = Math.max(7, Math.min(14, this.mel + [-2,-1,-1,0,1,1,2][Math.floor(Math.random() * 7)]));
            this.tone(this.deg(this.mel), t, sd * 1.5, c.lead, 0.12, 0.02, 0.5);
        }
    }

    tone(m: number, t: number, dur: number, type: OscillatorType, vol: number, atk: number, rel: number) {
        const ctx = this.ctx, o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type; o.frequency.value = this.midi(m);
        const hold = t + Math.max(atk, dur);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol, t + atk);
        g.gain.setValueAtTime(vol, hold);
        g.gain.exponentialRampToValueAtTime(0.0001, hold + rel);
        o.connect(g); g.connect(this.bus);
        o.start(t); o.stop(hold + rel + 0.05);
    }
}
