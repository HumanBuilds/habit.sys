"use client";

import React, { useMemo, useTransition } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HabitTaskItem } from './HabitTaskItem';
import { sortHabits, type Habit } from './utils';
import { commitHabitLog } from '@/app/dashboard/actions';

interface HabitTaskListProps {
    habits: Habit[];
    completedHabitIds: Set<string>;
}

export const HabitTaskList: React.FC<HabitTaskListProps> = ({ habits, completedHabitIds }) => {
    const [isPending, startTransition] = useTransition();

    const sortedHabits = useMemo(() => {
        return sortHabits(habits, completedHabitIds);
    }, [habits, completedHabitIds]);

    const handleToggle = (habitId: string, isCompleted: boolean) => {
        startTransition(async () => {
            await commitHabitLog(habitId, isCompleted);
        });
    };

    return (
        <div className="flex flex-col border-t-2 border-black">
            <h2 className="text-sm font-bold tracking-[0.2em] bg-black text-white px-2 py-1 mb-4 flex justify-between">
                <span>ONGOING_HABITS.LOG</span>
                {isPending && <span className="animate-pulse">UPDATING...</span>}
            </h2>
            <div className="flex flex-col divide-y-1 divide-black/10">
                <AnimatePresence mode="popLayout">
                    {sortedHabits.map((habit) => (
                        <HabitTaskItem
                            key={habit.id}
                            id={habit.id}
                            title={habit.title}
                            isCompleted={completedHabitIds.has(habit.id)}
                            onToggle={handleToggle}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {habits.length === 0 && (
                <div className="text-center py-10 opacity-50 italic">
                    NO ACTIVE PROTOCOLS FOUND.
                </div>
            )}
        </div>
    );
};
