'use client';

// Singleton to manage audio context and sounds
class SoundEngine {
    private audioContext: AudioContext | null = null;
    private isMuted: boolean = false;

    constructor() {
        if (typeof window !== 'undefined') {
            this.init();
        }
    }

    private init() {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                this.audioContext = new AudioContextClass();
            }
        } catch (e) {
            console.error('Web Audio API not supported', e);
        }
    }

    private ensureContext() {
        if (!this.audioContext) {
            this.init();
        }
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    public setMuted(muted: boolean) {
        this.isMuted = muted;
    }

    // Mechanical Switch Sound (Square wave burst)
    public playClick() {
        if (this.isMuted || !this.audioContext) return;
        this.ensureContext();

        const t = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        // Small random pitch variation (+/- 15%)
        const randomDetune = 1 + (Math.random() * 0.3 - 0.15);
        const baseFreq = 150 * randomDetune;

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(baseFreq, t);
        oscillator.frequency.exponentialRampToValueAtTime(40, t + 0.05);

        gainNode.gain.setValueAtTime(0.1, t);
        gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start(t);
        oscillator.stop(t + 0.05);
    }

    // High Pitch Beep (Sine wave)
    public playConfirm() {
        if (this.isMuted || !this.audioContext) return;
        this.ensureContext();

        const t = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, t); // A5

        gainNode.gain.setValueAtTime(0.05, t);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start(t);
        oscillator.stop(t + 0.1);
    }
}

export const soundEngine = new SoundEngine();
