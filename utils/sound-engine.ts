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
        const randomDetune = 1 + Math.min(Math.max(Math.random(), 0.15), 0);
        const baseFreq = 150 * randomDetune;

        const timeRamp = t + Math.min(Math.max(Math.random(), 0.05), 0.5);

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(baseFreq, t);
        oscillator.frequency.exponentialRampToValueAtTime(40, timeRamp);

        gainNode.gain.setValueAtTime(0.01, t);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

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

    // Ascending Happy Beep / Arpeggio (Sine waves)
    public playSuccess() {
        if (this.isMuted || !this.audioContext) return;
        this.ensureContext();

        const t = this.audioContext.currentTime;

        // Major Arpeggio: C5 -> E5 -> G5
        const notes = [
            { freq: 523.25, start: 0, duration: 0.1 },    // C5
            { freq: 659.25, start: 0.08, duration: 0.1 }, // E5
            { freq: 783.99, start: 0.16, duration: 0.2 }  // G5
        ];

        notes.forEach(note => {
            const osc = this.audioContext!.createOscillator();
            const gain = this.audioContext!.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(note.freq, t + note.start);

            // Slightly more emphasized volume (0.07 instead of 0.05)
            gain.gain.setValueAtTime(0.07, t + note.start);
            gain.gain.exponentialRampToValueAtTime(0.001, t + note.start + note.duration);

            osc.connect(gain);
            gain.connect(this.audioContext!.destination);

            osc.start(t + note.start);
            osc.stop(t + note.start + note.duration);
        });
    }
}

export const soundEngine = new SoundEngine();
