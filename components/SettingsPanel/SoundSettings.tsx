'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '@/utils/sound-engine';

export function SoundSettings() {
    const [isMuted, setIsMuted] = useState(() => soundEngine.muted);

    const handleToggle = () => {
        const next = !isMuted;
        soundEngine.setMuted(next);
        setIsMuted(next);
    };

    return (
        <div className="flex flex-col gap-4">
            <button
                onClick={handleToggle}
                className="w-full flex items-center justify-between gap-4 py-3 px-1 cursor-pointer select-none"
                data-custom-sound="true"
            >
                <span className="text-xl">SOUND EFFECTS</span>
                <div className="relative w-8 h-8 border-3 border-black bg-white flex items-center justify-center shrink-0">
                    <AnimatePresence>
                        {!isMuted && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 0.8 }}
                                exit={{ scale: 0 }}
                                className="w-full h-full bg-black"
                            />
                        )}
                    </AnimatePresence>
                </div>
            </button>
        </div>
    );
}
