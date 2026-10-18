export type VoiceStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface VoiceState {
  status: VoiceStatus;
  progress: number;
}

export interface TTSOptions {
  voiceIndex?: number;
  pitch?: number;
  rate?: number;
  volume?: number;
  lang?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (event: SpeechSynthesisErrorEvent) => void;
}

export class TextToSpeech {
  protected synth?: SpeechSynthesis;
  protected utterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    // Don't throw when unsupported (some in-app browsers): the game just stays silent instead of crashing.
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public get isSupported(): boolean {
    return !!this.synth;
  }

  public speak(text: string, options: TTSOptions = {}): void {
    if (!this.synth) return;
    if (this.synth.speaking) {
      this.synth.cancel();
    }

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.pitch = options.pitch ?? 1;
    this.utterance.rate = options.rate ?? 1;
    this.utterance.volume = options.volume ?? 1;
    if (options.lang) {
      this.utterance.lang = options.lang;
    }

    const voices = this.synth.getVoices();
    if (options.voiceIndex !== undefined && voices[options.voiceIndex]) {
      this.utterance.voice = voices[options.voiceIndex];
    }

    if (options.onStart) this.utterance.onstart = options.onStart;
    if (options.onEnd) this.utterance.onend = options.onEnd;
    if (options.onError) this.utterance.onerror = options.onError;

    this.synth.speak(this.utterance);
  }

  public pause(): void {
    if (this.synth?.speaking) this.synth.pause();
  }

  public resume(): void {
    if (this.synth?.paused) this.synth.resume();
  }

  public stop(): void {
    if (this.synth && (this.synth.speaking || this.synth.paused)) this.synth.cancel();
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.synth?.getVoices() ?? [];
  }
}

export class GermanSpeechEngine extends TextToSpeech {
  /** The browser voice needs no download, so it is always "ready". Kept so the game's voice-status code keeps working. */
  public state: VoiceState = { status: 'ready', progress: 1 };

  constructor() {
    super();
  }

  /** Best installed German voice: prefers de-DE, accepts de-AT / de-CH. Android reports "de_DE" with an underscore. */
  private findGermanVoiceIndex(): number {
    const voices = this.getVoices();
    const lang = (v: SpeechSynthesisVoice) => v.lang.toLowerCase().replace('_', '-');
    const exact = voices.findIndex((v) => lang(v) === 'de-de');
    return exact !== -1 ? exact : voices.findIndex((v) => lang(v).startsWith('de'));
  }

  public speakGerman(text: string, options: Omit<TTSOptions, 'lang'> = {}): void {
    const germanVoiceIndex = this.findGermanVoiceIndex();

    super.speak(text, {
      ...options,
      lang: 'de-DE',
      rate: options.rate ?? 0.88, // slightly slow for language learning
      voiceIndex: options.voiceIndex ?? (germanVoiceIndex !== -1 ? germanVoiceIndex : undefined),
    });
  }

  /** Chrome loads its voice list asynchronously. Resolves when voices are available (or after `timeoutMs`). */
  public whenVoicesReady(timeoutMs = 1500): Promise<void> {
    const synth = this.synth;
    if (!synth || synth.getVoices().length > 0) return Promise.resolve();
    return new Promise((resolve) => {
      const finish = () => {
        synth.removeEventListener('voiceschanged', finish);
        clearTimeout(timer);
        resolve();
      };
      const timer = setTimeout(finish, timeoutMs);
      synth.addEventListener('voiceschanged', finish);
    });
  }

  // ---- Used by the game hook. Nothing to do for the browser voice. ----
  public subscribe(fn: (s: VoiceState) => void): () => void {
    fn(this.state);
    return () => {};
  }

  /** Called on the first tap. Touching getVoices() makes Chrome start loading its voice list. */
  public unlock(): void {
    this.getVoices();
  }

  /** The browser voice speaks on demand, so there is nothing to pre-render. */
  public async warm(_words: string[]): Promise<void> {}
}

// @ts-ignore
const SpeechRecognitionAPI = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;

export interface STTOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (error: any) => void;
  onEnd?: () => void;
}

export class SpeechToText {
  private recognition: any = null;

  constructor() {
    if (SpeechRecognitionAPI) {
      this.recognition = new SpeechRecognitionAPI();
    }
  }

  public start(options: STTOptions): void {
    if (!this.recognition) {
      console.warn('Speech Recognition is not available in this environment.');
      return;
    }

    this.recognition.lang = options.language || 'de-DE';
    this.recognition.continuous = options.continuous ?? false;
    this.recognition.interimResults = options.interimResults ?? true;

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const transcript = finalTranscript || interimTranscript;
      options.onResult(transcript, !!finalTranscript);
    };

    if (options.onError) this.recognition.onerror = (e: any) => options.onError!(e);
    if (options.onEnd) this.recognition.onend = () => options.onEnd!();

    try {
      this.recognition.start();
    } catch (e) {
      console.error('Error starting speech recognition:', e);
    }
  }

  public stop(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.error('Error stopping speech recognition:', e);
      }
    }
  }
}