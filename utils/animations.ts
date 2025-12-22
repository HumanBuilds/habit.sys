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
    ease: steppedEase(12)
};

/**
 * Variants for the "Sideways Flash" transition.
 * Elements slide in from the right and exit to the left.
 */
export const sidewaysFlashVariants: Variants = {
    initial: {
        x: "100%",
        opacity: 0
    },
    animate: {
        x: 0,
        opacity: 1,
        transition: mechanicalTransition
    },
    exit: {
        x: "-100%",
        opacity: 0,
        transition: mechanicalTransition
    }
};
