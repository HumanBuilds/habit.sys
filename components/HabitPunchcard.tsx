'use client';

import React from 'react';
import Link from 'next/link';

interface HabitPunchcardProps {
    id: string;
    title: string;
    createdAt: string;
    logs: string[]; // Array of 'YYYY-MM-DD' strings
    frequency?: string[]; // Array of short weekdays e.g. ['Mon', 'Tue']
}

function hashRef(id: string): string {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
    }
    const num = Math.abs(hash);
    const chars = 'ABCDEFGHJKLMNPQRSTVWXYZ';
    const c1 = chars[num % chars.length];
    const c2 = chars[(num >> 5) % chars.length];
    const c3 = chars[(num >> 10) % chars.length];
    const digits = String(num).slice(0, 5).padStart(5, '0');
    return `${c1}${c2}${c3}${digits}`;
}

export const HabitPunchcard: React.FC<HabitPunchcardProps> = ({ id, title, createdAt, logs, frequency }) => {
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
        <div className="punchcard w-full max-w-md">
            <div className="flex justify-between items-start mb-6 border-b border-[rgba(0,0,0,0.1)] pb-2">
                <div>
                    <h3 className="text-2xl font-bold tracking-tighter leading-none">{title.toUpperCase()}</h3>
                    <p className="punchcard-label mt-1">PROTOCOL REF: {hashRef(id)}</p>
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
                        />
                    );
                })}
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <Link
                    href={`/edit-habit/${id}`}
                    className="btn-retro-secondary w-full text-center group"
                >
                    [ <span>MODIFY PROTOCOL</span> ]
                </Link>
            </div>
        </div>
    );
};
