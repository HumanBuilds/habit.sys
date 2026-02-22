import { Variants, Transition } from 'framer-motion';

/**
 * Mechanical "stepped" easing function for retro/1-bit feel.
 * Default is 4 steps over the duration.
 */
export const steppedEase = (steps: number = 4) => (t: number) => Math.floor(t * steps) / steps;

/**
 * Shared transition settings for mechanical animations.
 */
export const mechanicalTransition: Transition = {
    duration: 1,
    ease: steppedEase(8)
};

/**
 * Variants for the "Sideways Flash" transition.
 * Pass custom={1} for forward (right-to-left) or custom={-1} for backward (left-to-right).
 */
export const sidewaysFlashVariants: Variants = {
    initial: (direction: number) => ({
        x: `${100 * direction}%`,
        opacity: 0
    }),
    animate: {
        x: 0,
        opacity: 1,
        transition: mechanicalTransition
    },
    exit: (direction: number) => ({
        x: `${-100 * direction}%`,
        opacity: 0,
        transition: mechanicalTransition
    })
};

/**
 * Vertical expansion for the glitch state with a "jerky" stepped feel.
 */
export const glitchExpansionVariants: Variants = {
    initial: {
        height: 0,
        opacity: .9
    },
    animate: {
        height: 'auto',
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: steppedEase(6)
        }
    },
    exit: {
        height: 0,
        opacity: .9,
        transition: {
            duration: 0.6,
            ease: steppedEase(6)
        }
    }
};
