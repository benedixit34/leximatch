declare module '@mintplex-labs/piper-tts-web' {
  export interface Progress { url: string; total: number; loaded: number }
  export class TtsSession {
    static create(options: {
      voiceId: string;
      progress?: (p: Progress) => void;
      logger?: (text: string) => void;
    }): Promise<TtsSession>;
    predict(text: string): Promise<Blob>;
  }
}