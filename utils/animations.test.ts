import { describe, it, expect } from 'vitest';
import { sidewaysFlashVariants, glitchExpansionVariants, mechanicalTransition } from './animations';

describe('Animation Config', () => {
    it('mechanicalTransition should match snapshot', () => {
        expect(mechanicalTransition).toMatchSnapshot();
    });

    it('sidewaysFlashVariants should match snapshot', () => {
        expect(sidewaysFlashVariants).toMatchSnapshot();
    });

    it('glitchExpansionVariants should match snapshot', () => {
        expect(glitchExpansionVariants).toMatchSnapshot();
    });
});
