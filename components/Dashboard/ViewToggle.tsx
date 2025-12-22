"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { List, LayoutGrid } from 'lucide-react';

interface ViewToggleProps {
    viewMode: 'detailed' | 'simplified';
    onToggle: (mode: 'detailed' | 'simplified') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onToggle }) => {
    const isDetailed = viewMode === 'detailed';

    return (
        <div className="flex  items-center gap-2 select-none" role="checkbox" aria-checked={isDetailed} aria-label="Toggle Detailed View">
            <LayoutGrid
                size={14}
                className={`transition-opacity duration-300 ${isDetailed ? 'opacity-100' : 'opacity-20'}`}
            />

            <button
                onClick={() => onToggle(isDetailed ? 'simplified' : 'detailed')}
                className="relative w-12 h-6 border-2 border-black bg-white cursor-pointer outline-none p-0.5 group shrink-0"
                id="view-toggle-slider"
            >
                {/* Track Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"></div>

                {/* Slider Thumb */}
                <motion.div
                    className="w-5 h-full bg-black relative z-10"
                    animate={{ x: isDetailed ? 0 : 20 }}
                    transition={{ type: "spring", stiffness: 400, damping: 80 }}
                >
                </motion.div>
            </button>

            <List
                size={14}
                className={`transition-opacity duration-300 ${!isDetailed ? 'opacity-100' : 'opacity-20'}`}
            />
        </div>
    );
};
