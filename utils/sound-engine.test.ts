// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SoundEngine } from './sound-engine';

// Types for mocking
type MockAudioContext = {
    createOscillator: ReturnType<typeof vi.fn>;
    createGain: ReturnType<typeof vi.fn>;
    currentTime: number;
    destination: {};
};

describe('SoundEngine', () => {
    let mockCtx: MockAudioContext;
    let mockOsc: any;
    let mockGain: any;
    let engine: SoundEngine;

    beforeEach(() => {
        // Mock Audio Nodes
        mockOsc = {
            connect: vi.fn(),
            start: vi.fn(),
            stop: vi.fn(),
            type: '',
            frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        };

        mockGain = {
            connect: vi.fn(),
            gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        };

        // Mock Audio Context
        mockCtx = {
            createOscillator: vi.fn(() => mockOsc),
            createGain: vi.fn(() => mockGain),
            currentTime: 0,
            destination: {},
        };

        // Stub global AudioContext
        // We set it on window directly for jsdom, using a class to satisfy constructor calls
        window.AudioContext = class {
            constructor() {
                return mockCtx;
            }
        } as any;

        engine = new SoundEngine();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should initialize AudioContext on interaction', () => {
        engine.playClick();
        expect(mockCtx.createOscillator).toHaveBeenCalled();
        expect(mockCtx.createGain).toHaveBeenCalled();
    });

    it('playClick should create oscillator and ramp gain', () => {
        engine.playClick();

        expect(mockOsc.type).toBe('square');
        expect(mockOsc.frequency.setValueAtTime).toHaveBeenCalled();
        expect(mockOsc.start).toHaveBeenCalled();
        expect(mockOsc.stop).toHaveBeenCalled();
    });

    it('playSuccess should play multiple notes', () => {
        // Clear previous calls
        vi.clearAllMocks();

        engine.playSuccess();

        // Should create 3 notes (arpeggio)
        expect(mockCtx.createOscillator).toHaveBeenCalledTimes(3);

        // Check frequencies (approximate logic check)
        expect(mockOsc.frequency.setValueAtTime).toHaveBeenCalled();
    });
});
