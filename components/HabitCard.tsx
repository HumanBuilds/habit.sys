"use client";

import React, { useState } from 'react';

interface HabitCardProps {
    name: string;
    icon?: string;
    isCompleted?: boolean;
    onToggle?: (completed: boolean) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ name, icon, isCompleted = false, onToggle }) => {
    const [completed, setCompleted] = useState(isCompleted);

    const handleClick = () => {
        const newState = !completed;
        setCompleted(newState);
        if (onToggle) onToggle(newState);
    };

    return (
        <div
            onClick={handleClick}
            className={`
        pixel-border hard-shadow p-6 cursor-pointer select-none transition-all
        flex flex-col items-center justify-center gap-4 text-center
        ${completed ? 'inverted bg-black text-white' : 'bg-white text-black'}
      `}
        >
            <div className="text-4xl">
                {icon || '🌱'}
            </div>
            <div className="text-2xl font-bold tracking-wider">
                {name.toUpperCase()}
            </div>
            <div className="text-sm mt-2">
                {completed ? '[ COMPLETED ]' : '[ INCOMPLETE ]'}
            </div>
        </div>
    );
};
