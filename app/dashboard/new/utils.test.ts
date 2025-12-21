import { describe, it, expect } from 'vitest';
import { isInputInvalid } from './utils';

describe('Wizard Validation Logic', () => {
    it('should identify empty input as invalid', () => {
        expect(isInputInvalid('')).toBe(true);
        expect(isInputInvalid(undefined)).toBe(true);
    });

    it('should identify whitespace-only input as invalid', () => {
        expect(isInputInvalid('   ')).toBe(true);
        expect(isInputInvalid('\n\t')).toBe(true);
    });

    it('should identify non-empty input as valid', () => {
        expect(isInputInvalid('STRENGTHEN CORE')).toBe(false);
        expect(isInputInvalid('100')).toBe(false);
    });
});
