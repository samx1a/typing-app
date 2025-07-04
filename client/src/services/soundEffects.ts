class SoundEffectsService {
  private audioContext: AudioContext | null = null;
  private isEnabled = true;
  private volume = 0.3;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      // Create audio context only when needed
      if (typeof window !== 'undefined' && window.AudioContext) {
        this.audioContext = new AudioContext();
      }
    } catch (error) {
      console.warn('Audio context not supported:', error);
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  private async ensureAudioContext() {
    if (!this.audioContext) {
      this.initAudioContext();
    }
    
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  playKeyPress() {
    if (!this.isEnabled || !this.audioContext) return;
    
    this.ensureAudioContext().then(() => {
      this.playTone(800, 0.05, 'sine');
    });
  }

  playKeyError() {
    if (!this.isEnabled || !this.audioContext) return;
    
    this.ensureAudioContext().then(() => {
      this.playTone(200, 0.1, 'sawtooth');
    });
  }

  playTestComplete() {
    if (!this.isEnabled || !this.audioContext) return;
    
    this.ensureAudioContext().then(() => {
      // Play a success chord
      this.playTone(523, 0.2, 'sine'); // C
      setTimeout(() => this.playTone(659, 0.2, 'sine'), 50); // E
      setTimeout(() => this.playTone(784, 0.3, 'sine'), 100); // G
    });
  }

  playTestStart() {
    if (!this.isEnabled || !this.audioContext) return;
    
    this.ensureAudioContext().then(() => {
      this.playTone(440, 0.1, 'sine'); // A
    });
  }

  private playTone(frequency: number, duration: number, type: OscillatorType) {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }
}

export const soundEffects = new SoundEffectsService(); 