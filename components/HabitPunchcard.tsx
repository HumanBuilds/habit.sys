'use client';

import React from 'react';

interface HabitPunchcardProps {
    title: string;
    createdAt: string;
    logs: string[]; // Array of 'YYYY-MM-DD' strings
    frequency?: string[]; // Array of short weekdays e.g. ['Mon', 'Tue']
}

export const HabitPunchcard: React.FC<HabitPunchcardProps> = ({ title, createdAt, logs, frequency }) => {
    // 1. Calculate dates from creation to today
    const createdDate = new Date(createdAt);
    createdDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysSinceCreation: Date[] = [];
    const tempDate = new Date(createdDate);

    while (tempDate <= today) {
        // If frequency is specified, only include matching days
        if (frequency && frequency.length > 0) {
            const dayName = tempDate.toLocaleDateString('en-US', { weekday: 'short' });
            if (frequency.includes(dayName)) {
                daysSinceCreation.push(new Date(tempDate));
            }
        } else {
            // Fallback: Include all days if no frequency set
            daysSinceCreation.push(new Date(tempDate));
        }

        tempDate.setDate(tempDate.getDate() + 1);
    }

    const logSet = new Set(logs);

    return (
        <div className="punchcard w-full max-w-md my-4">
            <div className="punchcard-clip"></div>

            <div className="flex justify-between items-start mb-6 border-b border-black/10 pb-2">
                <div>
                    <h3 className="text-2xl font-bold tracking-tighter leading-none">{title.toUpperCase()}</h3>
                    <p className="punchcard-label mt-1">PROTOCOL_REF: {createdAt.replace(/[^0-9]/g, '').slice(0, 8)}</p>
                </div>
                <div className="text-right">
                    <p className="punchcard-label">ESTABLISHED</p>
                    <p className="font-bold text-sm">{createdDate.toISOString().split('T')[0]}</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {daysSinceCreation.reverse().map((date) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const isPunched = logSet.has(dateStr);

                    return (
                        <div
                            key={dateStr}
                            className={`punchcard-slot ${isPunched ? 'punched' : ''}`}
                            title={dateStr}
                        >
                            {/* Visual indicator for week boundaries could be added here if needed */}
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-4 border-t border-black/10 flex justify-between items-center">
                <div className="punchcard-label italic">
                    &gt;&gt; DATA_VALIDATION_PASSED
                </div>
                <div className="text-xs font-bold opacity-30 uppercase">
                    ID: {createdAt.split('T')[0].replace(/-/g, '')}
                </div>
            </div>
        </div>
    );
};
