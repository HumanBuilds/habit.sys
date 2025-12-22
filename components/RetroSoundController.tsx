'use client';

import { useEffect } from 'react';
import { soundEngine } from '@/utils/sound-engine';

export const RetroSoundController = () => {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check if clicked element or its parent is a retro button or input
            const interactiveElement = target.closest('.btn-retro, .btn-retro-secondary, .habit-item, button, a');

            if (interactiveElement) {
                soundEngine.playClick();
            }
        };

        // Add capture listener to hear all clicks
        window.addEventListener('click', handleClick, true);

        return () => {
            window.removeEventListener('click', handleClick, true);
        };
    }, []);

    return null; // Render nothing visible
};
