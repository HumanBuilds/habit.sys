"use client";

import React, { useMemo, useTransition, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { HabitTaskItem } from './HabitTaskItem';
import { sortHabits, type Habit } from './utils';
import { commitHabitLog } from '@/app/dashboard/actions';
import { GlitchState } from '../GlitchState';

interface HabitTaskListProps {
    habits: Habit[];
    completedHabitIds: Set<string>;
    eligibility: {
        eligible: boolean;
        stats?: {
            completions: number;
            requiredCompletions: number;
            dedication: number;
            requiredDedication: number;
        };
        latestHabitTitle?: string;
    };
    viewMode: 'detailed' | 'simplified';
}

export const HabitTaskList: React.FC<HabitTaskListProps> = ({ habits, completedHabitIds, eligibility, viewMode }) => {
    const [isPending, startTransition] = useTransition();
    const [devOverride, setDevOverride] = useState(false);
    const [glitchExpanded, setGlitchExpanded] = useState(false);

    const isEligible = eligibility.eligible || devOverride;

    const sortedHabits = useMemo(() => {
        return sortHabits(habits, completedHabitIds);
    }, [habits, completedHabitIds]);

    const handleToggle = (habitId: string, isCompleted: boolean) => {
        startTransition(async () => {
            await commitHabitLog(habitId, isCompleted);
        });
    };

    return (
        <motion.div layout className="flex flex-col">
            {/* Command Row or Glitch State - Only visible in Detailed mode */}
            <AnimatePresence mode="wait">
                {viewMode === 'detailed' && (
                    <motion.div
                        key="detailed-controls"
                        layout
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "-100%", opacity: 0 }}
                        transition={{
                            duration: 0.8,
                            ease: (t) => Math.floor(t * 4) / 4
                        }}
                    >
                        {isEligible ? (
                            <div className="mb-6">
                                <Link href="/create-habit" scroll={false} className="flex items-center gap-4 py-2 px-3 border-2 border-dashed border-black hover:bg-black hover:text-white transition-colors group">
                                    <div className="w-8 h-8 flex items-center justify-center shrink-0 border-2 border-black group-hover:border-white">
                                        <span className="text-2xl font-bold">+</span>
                                    </div>
                                    <span className="text-xl font-bold tracking-tight uppercase">Initialize New Protocol...</span>
                                </Link>
                            </div>
                        ) : (
                            <div >
                                <button
                                    onClick={() => setGlitchExpanded(!glitchExpanded)}
                                    className="w-full border-2 border-black bg-black text-white px-3 py-2 flex justify-between items-center hover:bg-white hover:text-black transition-colors group mb-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <span >●</span>
                                        <span className="font-bold tracking-tight uppercase">
                                            System Expansion Blocked
                                        </span>
                                    </div>
                                    <span className="font-mono text-xs opacity-70">{glitchExpanded ? "[ COLLAPSE_LOG ]" : "[ VIEW_DIAGNOSTICS ]"}</span>
                                </button>

                                <AnimatePresence>
                                    {glitchExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <GlitchState
                                                stats={eligibility.stats}
                                                latestHabitTitle={eligibility.latestHabitTitle}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.h2
                layout
                className="text-sm font-bold tracking-[0.2em] bg-black text-white px-2 py-1 mb-4 flex justify-between items-center"
            >
                <div className="flex items-center gap-2">
                    <span>ONGOING_HABITS.LOG</span>
                    {isPending && <span className="animate-pulse opacity-70">UPDATING...</span>}
                </div>
                {viewMode === 'simplified' && (
                    <Link
                        href="/create-habit"
                        scroll={false}
                        className="w-5 h-5 flex items-center justify-center border border-transparent hover:border-white transition-all leading-none text-lg pb-0.5"
                        aria-label="Add New Protocol"
                    >
                        +
                    </Link>
                )}
            </motion.h2>

            <motion.div layout className="flex flex-col divide-y-1 divide-black/10">
                <AnimatePresence mode="popLayout" initial={false}>
                    {sortedHabits.map((habit) => (
                        <HabitTaskItem
                            key={habit.id}
                            id={habit.id}
                            title={habit.title}
                            isCompleted={completedHabitIds.has(habit.id)}
                            onToggle={(id, currentlyDone) => handleToggle(id, currentlyDone)}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            <motion.div layout className="mt-auto pt-8 flex justify-end">
                <button
                    onClick={() => setDevOverride(!devOverride)}
                    className="text-[10px] uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity"
                >
                    [ DEV_OVERRIDE: {devOverride ? "ACTIVE" : "INACTIVE"} ]
                </button>
            </motion.div>
        </motion.div>
    );
};
