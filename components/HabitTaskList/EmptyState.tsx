"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const EmptyState: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="border-2 border-dashed border-black/30 w-full p-8 flex flex-col items-center justify-center text-center gap-4 bg-black/[0.02]"
        >
            <div className="w-12 h-12 border-2 border-black flex items-center justify-center rounded-full mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>

            <div className="space-y-1">
                <h3 className="font-bold tracking-widest text-lg uppercase">All Systems Optimized</h3>
                <p className="font-mono text-xs opacity-60">NO PROTOCOLS PENDING FOR CURRENT CYCLE</p>
            </div>

            <div className="h-px w-16 bg-black/20 my-2"></div>

            <p className="font-mono text-[10px] opacity-40 uppercase tracking-tight">
                Standby Mode // Awaiting Input
            </p>
        </motion.div>
    );
};
