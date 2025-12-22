"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { signout } from '@/app/login/actions';
import { HabitTaskList } from '@/components/HabitTaskList';
import { HabitPunchcard } from '@/components/HabitPunchcard';
import { ViewToggle } from './ViewToggle';
import { sidewaysFlashVariants } from '@/utils/animations';

interface DashboardClientProps {
    user: {
        email: string | undefined;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    habits: any[];
    completedHabitIds: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    eligibility: any;
    logsByHabit: Record<string, string[]>;
}

export const DashboardClient: React.FC<DashboardClientProps> = ({
    user,
    habits,
    completedHabitIds,
    eligibility,
    logsByHabit,
}) => {
    const [viewMode, setViewMode] = useState<'detailed' | 'simplified'>('simplified');

    return (
        <>
            <div className="flex justify-between items-start mb-8 border-b-2 border-black pb-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter">HABIT.SYS</h1>
                    <div className="flex items-center gap-6 mt-2">
                        <p className="text-xl">OPERATOR: {user.email?.split('@')[0].toUpperCase()}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <form action={signout}>
                        <button className="btn-retro-secondary text-xs">
                            [ <span>EXIT</span> ]
                        </button>
                    </form>
                </div>
            </div>

            {habits && habits.length > 0 ? (
                <>
                    <HabitTaskList
                        habits={habits}
                        completedHabitIds={completedHabitIds}
                        eligibility={eligibility}
                        viewMode={viewMode}
                    />

                    <AnimatePresence mode="wait">
                        {viewMode === 'detailed' && (
                            <motion.div
                                key="detailed-diagnostics"
                                variants={sidewaysFlashVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="mt-4 pt-8 border-t-4 border-black border-double"
                            >
                                <h2 className="text-xl font-bold tracking-widest mb-6 flex items-center gap-2" id="system-diagnostics-header">
                                    <span className="bg-black text-white px-2">SYSTEM_DIAGNOSTICS:</span>
                                    <span>STREAK_PUNCHCARDS.DB</span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="punchcards-grid">
                                    {habits.map((habit) => (
                                        <HabitPunchcard
                                            key={habit.id}
                                            title={habit.title}
                                            createdAt={habit.created_at}
                                            logs={logsByHabit[habit.id] || []}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            ) : (
                <div className="text-center py-20 border-2 border-dashed border-black">
                    <p className="text-2xl mb-8">NO PROTOCOLS INITIALIZED IN THIS NODE.</p>
                    <Link href="/create-habit" scroll={false} className="btn-retro">
                        + INITIALIZE FIRST MODULE
                    </Link>
                </div>
            )}

            {/* View Toggle - Positioned bottom-right of the window container */}
            <div className="absolute bottom-4 right-4 z-[100]">
                <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
            </div>
        </>
    );
};
