"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface HabitTaskItemProps {
    id: string;
    title: string;
    isCompleted: boolean;
    onToggle: (id: string, currentlyCompleted: boolean) => void;
}

export const HabitTaskItem: React.FC<HabitTaskItemProps> = ({ id, title, isCompleted, onToggle }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center gap-4 ps-4 py-3 group cursor-pointer select-none habit-item"
            onClick={() => onToggle(id, isCompleted)}
        >
            {/* Chunky Checkbox */}
            <div className="relative w-8 h-8 border-3 border-black bg-white flex items-center justify-center shrink-0">
                <AnimatePresence>
                    {isCompleted && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 0.8 }}
                            exit={{ scale: 0 }}
                            className="w-full h-full bg-black"
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Habit Title with Strikethrough */}
            <div className="relative overflow-hidden flex-1">
                <span className={cn(
                    "text-2xl font-bold tracking-tight transition-colors duration-300",
                    isCompleted ? "text-gray-400" : "text-black"
                )}>
                    {title.toUpperCase()}
                </span>

                {/* Animated Strikethrough Line */}
                <motion.div
                    className="absolute left-0 top-[45%] w-full h-1 bg-black origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                />
            </div>
        </motion.div>
    );
};
