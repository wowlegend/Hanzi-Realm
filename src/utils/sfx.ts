type NoteConfig = {
  freq: number;
  duration: number;
  startTime: number;
  type: OscillatorType;
  gain: number;
  detune?: number;
};

type SoundDef = NoteConfig[];

const SOUNDS: Record<string, SoundDef> = {
  click: [
    { freq: 1200, duration: 0.04, startTime: 0, type: 'square', gain: 0.15 },
    { freq: 1800, duration: 0.03, startTime: 0.02, type: 'square', gain: 0.1 },
  ],
  correct: [
    { freq: 523.25, duration: 0.12, startTime: 0, type: 'sine', gain: 0.25 },
    { freq: 659.25, duration: 0.12, startTime: 0.1, type: 'sine', gain: 0.25 },
    { freq: 783.99, duration: 0.15, startTime: 0.2, type: 'sine', gain: 0.3 },
    { freq: 1046.5, duration: 0.25, startTime: 0.3, type: 'sine', gain: 0.2 },
    { freq: 783.99, duration: 0.1, startTime: 0.3, type: 'triangle', gain: 0.1 },
  ],
  wrong: [
    { freq: 300, duration: 0.15, startTime: 0, type: 'sawtooth', gain: 0.2 },
    { freq: 250, duration: 0.15, startTime: 0.12, type: 'sawtooth', gain: 0.18 },
    { freq: 200, duration: 0.25, startTime: 0.24, type: 'sawtooth', gain: 0.15 },
  ],
  combo: [
    { freq: 440, duration: 0.08, startTime: 0, type: 'sine', gain: 0.2 },
    { freq: 554.37, duration: 0.08, startTime: 0.06, type: 'sine', gain: 0.2 },
    { freq: 659.25, duration: 0.08, startTime: 0.12, type: 'sine', gain: 0.22 },
    { freq: 880, duration: 0.15, startTime: 0.18, type: 'sine', gain: 0.25 },
    { freq: 880, duration: 0.1, startTime: 0.18, type: 'triangle', gain: 0.1, detune: 5 },
  ],
  boss: [
    { freq: 110, duration: 0.3, startTime: 0, type: 'sawtooth', gain: 0.2 },
    { freq: 146.83, duration: 0.3, startTime: 0.25, type: 'sawtooth', gain: 0.2 },
    { freq: 174.61, duration: 0.4, startTime: 0.5, type: 'sawtooth', gain: 0.25 },
    { freq: 220, duration: 0.5, startTime: 0.8, type: 'sawtooth', gain: 0.3 },
    { freq: 110, duration: 0.3, startTime: 0, type: 'square', gain: 0.08 },
  ],
  gacha: [
    { freq: 392, duration: 0.1, startTime: 0, type: 'sine', gain: 0.2 },
    { freq: 440, duration: 0.1, startTime: 0.08, type: 'sine', gain: 0.2 },
    { freq: 523.25, duration: 0.1, startTime: 0.16, type: 'sine', gain: 0.22 },
    { freq: 587.33, duration: 0.1, startTime: 0.24, type: 'sine', gain: 0.22 },
    { freq: 659.25, duration: 0.12, startTime: 0.32, type: 'sine', gain: 0.24 },
    { freq: 783.99, duration: 0.15, startTime: 0.4, type: 'sine', gain: 0.26 },
    { freq: 1046.5, duration: 0.35, startTime: 0.5, type: 'sine', gain: 0.3 },
    { freq: 783.99, duration: 0.2, startTime: 0.5, type: 'triangle', gain: 0.1 },
  ],
  purchase: [
    { freq: 1046.5, duration: 0.06, startTime: 0, type: 'square', gain: 0.15 },
    { freq: 1318.51, duration: 0.06, startTime: 0.05, type: 'square', gain: 0.15 },
    { freq: 1567.98, duration: 0.1, startTime: 0.1, type: 'square', gain: 0.18 },
  ],
  streak5: [
    { freq: 523.25, duration: 0.1, startTime: 0, type: 'sine', gain: 0.2 },
    { freq: 659.25, duration: 0.1, startTime: 0.08, type: 'sine', gain: 0.22 },
    { freq: 783.99, duration: 0.1, startTime: 0.16, type: 'sine', gain: 0.24 },
    { freq: 1046.5, duration: 0.3, startTime: 0.24, type: 'sine', gain: 0.3 },
    { freq: 1046.5, duration: 0.3, startTime: 0.24, type: 'triangle', gain: 0.12, detune: 3 },
  ],
  streak10: [
    { freq: 523.25, duration: 0.08, startTime: 0, type: 'sine', gain: 0.2 },
    { freq: 659.25, duration: 0.08, startTime: 0.06, type: 'sine', gain: 0.22 },
    { freq: 783.99, duration: 0.08, startTime: 0.12, type: 'sine', gain: 0.24 },
    { freq: 1046.5, duration: 0.08, startTime: 0.18, type: 'sine', gain: 0.26 },
    { freq: 1318.51, duration: 0.1, startTime: 0.24, type: 'sine', gain: 0.28 },
    { freq: 1567.98, duration: 0.4, startTime: 0.32, type: 'sine', gain: 0.3 },
    { freq: 1046.5, duration: 0.3, startTime: 0.32, type: 'triangle', gain: 0.12 },
    { freq: 1567.98, duration: 0.3, startTime: 0.32, type: 'square', gain: 0.06, detune: 7 },
  ],
  levelup: [
    { freq: 392, duration: 0.15, startTime: 0, type: 'sine', gain: 0.2 },
    { freq: 523.25, duration: 0.15, startTime: 0.12, type: 'sine', gain: 0.22 },
    { freq: 659.25, duration: 0.15, startTime: 0.24, type: 'sine', gain: 0.24 },
    { freq: 783.99, duration: 0.15, startTime: 0.36, type: 'sine', gain: 0.26 },
    { freq: 1046.5, duration: 0.5, startTime: 0.48, type: 'sine', gain: 0.3 },
    { freq: 523.25, duration: 0.3, startTime: 0.48, type: 'triangle', gain: 0.15 },
  ],
  jade: [
    { freq: 1200, duration: 0.06, startTime: 0, type: 'sine', gain: 0.15 },
    { freq: 1500, duration: 0.08, startTime: 0.04, type: 'sine', gain: 0.18 },
    { freq: 1800, duration: 0.1, startTime: 0.08, type: 'sine', gain: 0.12 },
  ],
};

class SFXManager {
  private ctx: AudioContext | null = null;
  private enabled = true;

  private getCtx(): AudioContext | null {
    try {
      if (!this.ctx || this.ctx.state === 'closed') {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  play(soundName: string) {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    if (!ctx) return;

    const notes = SOUNDS[soundName];
    if (!notes) return;

    const now = ctx.currentTime;
    for (const note of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = note.type;
      osc.frequency.value = note.freq;
      if (note.detune) osc.detune.value = note.detune;

      const start = now + note.startTime;
      gain.gain.setValueAtTime(note.gain, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + note.duration);

      osc.start(start);
      osc.stop(start + note.duration + 0.01);
    }
  }

  playSequence(soundNames: string[], interval = 150) {
    soundNames.forEach((name, i) => {
      setTimeout(() => this.play(name), i * interval);
    });
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

export const sfxManager = new SFXManager();
