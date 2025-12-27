"use client";

import React, { useMemo, useTransition, useState, useOptimistic } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { HabitTaskItem } from './HabitTaskItem';
import { EmptyState } from './EmptyState';
import { sortHabits, type Habit } from './utils';
import { commitHabitLog } from '@/app/dashboard/actions';
import { GlitchState } from '../GlitchState';
import { sidewaysFlashVariants, glitchExpansionVariants } from '@/utils/animations';
import { soundEngine } from '@/utils/sound-engine';

interface HabitTaskListProps {
    habits: Habit[];
    completedHabitIds: string[]; // Standardized to array for stable serialization
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

    // Initial value for useOptimistic should be the base prop.
    const [optimisticCompletedIds, addOptimisticId] = useOptimistic(
        completedHabitIds,
        (state: string[], { habitId, isCompleted }: { habitId: string, isCompleted: boolean }) => {
            if (isCompleted) {
                return state.filter(id => id !== habitId);
            } else {
                return [...state, habitId];
            }
        }
    );

    // Convert to Set once for efficient .has() lookups across items
    const completedSet = useMemo(() => {
        return new Set(optimisticCompletedIds)
    }, [optimisticCompletedIds]);

    const isEligible = eligibility.eligible || devOverride;

    const sortedHabits = useMemo(() => {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }); // "Mon", "Tue"

        const filtered = habits.filter(h => {
            // If frequency is missing or empty, assume Daily (or show it to be safe)
            if (!h.frequency || h.frequency.length === 0) return true;
            return h.frequency.includes(today);
        });

        return sortHabits(filtered, completedSet);
    }, [habits, completedSet]);

    const handleToggle = (habitId: string, isCompleted: boolean) => {
        // Optimistic update
        startTransition(async () => {
            if (!isCompleted) {
                soundEngine.playSuccess();
            } else {
                soundEngine.playClick();
            }

            const result = await commitHabitLog(habitId, isCompleted);
            if (result.error) {
                // revalidatePath will handle the rollback if needed by fetching fresh data
                console.error(result.error);
            }
        });
    };

    return (
        <motion.div layout className="flex flex-col">
            {/* Command Row or Glitch State - Only visible in Detailed mode */}
            <AnimatePresence mode="wait">
                {viewMode === 'detailed' && (
                    <motion.div
                        key="detailed-controls"
                        variants={sidewaysFlashVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        {!isEligible && (
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
                                    <span className="font-mono text-xs opacity-70">
                                        {glitchExpanded ? (
                                            <>
                                                <span className="md:hidden">[ COLLAPSE ]</span>
                                                <span className="hidden md:inline">[ COLLAPSE_LOG ]</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="md:hidden">[ DIAGNOSTICS ]</span>
                                                <span className="hidden md:inline">[ VIEW_DIAGNOSTICS ]</span>
                                            </>
                                        )}
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {glitchExpanded && (
                                        <motion.div
                                            variants={glitchExpansionVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
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
                {viewMode === 'simplified' && isEligible && (
                    <Link
                        href="/create-habit"
                        scroll={false}
                        className="w-5 h-5 flex items-center justify-center border border-transparent hover:border-white transition-all leading-none text-lg"
                        aria-label="Add New Protocol"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path></svg>
                    </Link>
                )}
            </motion.h2>

            <motion.div layout className="flex flex-col divide-y-1 divide-black/10">
                <AnimatePresence mode="popLayout" initial={false}>
                    {sortedHabits.length > 0 ? (
                        sortedHabits.map((habit) => (
                            <HabitTaskItem
                                key={habit.id}
                                id={habit.id}
                                title={habit.title}
                                isCompleted={completedSet.has(habit.id)}
                                onToggle={async (id, currentlyDone) => await handleToggle(id, currentlyDone)}
                            />
                        ))
                    ) : (
                        <EmptyState key="empty-state" />
                    )}
                </AnimatePresence>
            </motion.div>

            {/* <motion.div layout className="mt-auto pt-8 flex justify-end">
                <button
                    onClick={() => setDevOverride(!devOverride)}
                    className="text-[10px] uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity"
                >
                    [ DEV_OVERRIDE: {devOverride ? "ACTIVE" : "INACTIVE"} ]
                </button>
            </motion.div> */}
        </motion.div>
    );
};
