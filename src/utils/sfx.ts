class SFXManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;

  constructor() {
    this.initializeSounds();
  }

  private initializeSounds() {
    const soundFrequencies: Record<string, { freq: number; duration: number; type?: OscillatorType }> = {
      click: { freq: 800, duration: 0.05, type: 'square' },
      correct: { freq: 523.25, duration: 0.2, type: 'sine' },
      wrong: { freq: 200, duration: 0.3, type: 'sawtooth' },
      combo: { freq: 659.25, duration: 0.3, type: 'sine' },
      boss: { freq: 300, duration: 0.5, type: 'triangle' },
      gacha: { freq: 440, duration: 0.8, type: 'sine' },
      purchase: { freq: 880, duration: 0.15, type: 'square' },
    };

    Object.entries(soundFrequencies).forEach(([name, config]) => {
      this.createSound(name, config.freq, config.duration, config.type);
    });
  }

  private createSound(name: string, frequency: number, duration: number, type: OscillatorType = 'sine') {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      const audio = new Audio();
      this.sounds.set(name, audio);
    } catch (error) {
      console.warn('Web Audio API not supported', error);
    }
  }

  play(soundName: string) {
    if (!this.enabled) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const configs: Record<string, { freq: number; duration: number; type?: OscillatorType }> = {
        click: { freq: 800, duration: 0.05, type: 'square' },
        correct: { freq: 523.25, duration: 0.2, type: 'sine' },
        wrong: { freq: 200, duration: 0.3, type: 'sawtooth' },
        combo: { freq: 659.25, duration: 0.3, type: 'sine' },
        boss: { freq: 300, duration: 0.5, type: 'triangle' },
        gacha: { freq: 440, duration: 0.8, type: 'sine' },
        purchase: { freq: 880, duration: 0.15, type: 'square' },
      };

      const config = configs[soundName] || { freq: 440, duration: 0.1, type: 'sine' as OscillatorType };

      oscillator.frequency.value = config.freq;
      oscillator.type = config.type || 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + config.duration);
    } catch (error) {
      console.warn('Failed to play sound:', soundName, error);
    }
  }

  playSequence(soundNames: string[], interval: number = 100) {
    soundNames.forEach((name, index) => {
      setTimeout(() => this.play(name), index * interval);
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
