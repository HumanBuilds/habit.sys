"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface GlitchStateProps {
    title?: string;
    message?: string;
    stats?: {
        completions: number;
        requiredCompletions: number;
        dedication: number;
        requiredDedication: number;
    };
    latestHabitTitle?: string;
}

export const GlitchState: React.FC<GlitchStateProps> = ({
    title = "CRITICAL PROTOCOL ERROR",
    message = "NEW INITIALIZATION BLOCKED",
    stats,
    latestHabitTitle
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="critical-failure p-6 font-mono border-4 border-black mb-6"
        >
            <div className="flex flex-col gap-4">
                <div className="bg-white text-black px-2 py-1 inline-block self-start font-bold glitch-text">
                    {title}
                </div>

                <p className="text-xl font-bold border-b-2 border-white/20 pb-2">
                    {message}
                </p>

                {stats && (
                    <div className="space-y-2 text-sm ">
                        <div className="flex justify-between border-b border-white/10 pb-1">
                            <span>LATEST_PROTOCOL:</span>
                            <span className="font-bold underline">{latestHabitTitle?.toUpperCase() || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>STABILITY_COUNT:</span>
                            <span className={stats.completions >= stats.requiredCompletions ? "flex items-center gap-2 font-bold" : "glitch-text-large glitch-text"}>
                                {stats.completions >= stats.requiredCompletions ? (
                                    <>
                                        COMPLETED
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                                    </>
                                ) : (
                                    `${stats.completions} / ${stats.requiredCompletions} COMPLETED`
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>DEDICATION_RATE:</span>
                            <span className={stats.dedication >= stats.requiredDedication ? "flex items-center gap-2 font-bold" : "glitch-text-large glitch-text"}>
                                {stats.dedication >= stats.requiredDedication ? (
                                    <>
                                        STABLE
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                                    </>
                                ) : (
                                    `${stats.dedication}% / ${stats.requiredDedication}% REQUIRED`
                                )}
                            </span>
                        </div>
                    </div>
                )}

                <div className="mt-2 text-xs opacity-60 italic">
                    &gt;&gt; STATUS: MODULE_UNSTABLE. <br />
                    &gt;&gt; ADVICE: STRENGTHEN THE CURRENT NODE BEFORE SYSTEM EXPANSION.
                </div>
            </div>
        </motion.div>
    );
};
